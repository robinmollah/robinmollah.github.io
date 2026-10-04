const sslLiveForm = document.querySelector('#ssl-live-form');
const sslLiveHost = document.querySelector('#ssl-live-host');
const sslUpload = document.querySelector('#ssl-upload');
const sslStatus = document.querySelector('#ssl-tool-status');
const sslResults = document.querySelector('#ssl-results');

const oidLabels = {
  '1.2.840.113549.1.1.1': 'RSA',
  '1.2.840.113549.1.1.5': 'SHA1 with RSA',
  '1.2.840.113549.1.1.11': 'SHA256 with RSA',
  '1.2.840.113549.1.1.12': 'SHA384 with RSA',
  '1.2.840.113549.1.1.13': 'SHA512 with RSA',
  '1.2.840.10045.2.1': 'EC public key',
  '1.2.840.10045.4.3.2': 'ECDSA with SHA256',
  '1.2.840.10045.4.3.3': 'ECDSA with SHA384',
  '1.2.840.10045.4.3.4': 'ECDSA with SHA512',
  '1.3.101.112': 'Ed25519',
  '2.5.4.3': 'CN',
  '2.5.4.6': 'C',
  '2.5.4.7': 'L',
  '2.5.4.8': 'ST',
  '2.5.4.10': 'O',
  '2.5.4.11': 'OU',
  '2.5.29.17': 'Subject Alt Names'
};

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const setSslStatus = (message, isError = false) => {
  sslStatus.textContent = message;
  sslStatus.classList.toggle('is-error', isError);
};

const bytesToHex = (bytes) => Array.from(bytes)
  .map((byte) => byte.toString(16).padStart(2, '0'))
  .join('');

const formatFingerprint = (bytes) => Array.from(bytes)
  .map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
  .join(':');

const decodeOid = (bytes) => {
  const values = [Math.floor(bytes[0] / 40), bytes[0] % 40];
  let value = 0;

  for (const byte of bytes.slice(1)) {
    value = (value << 7) | (byte & 0x7f);
    if ((byte & 0x80) === 0) {
      values.push(value);
      value = 0;
    }
  }

  return values.join('.');
};

const parseAsn1 = (bytes, offset = 0) => {
  const start = offset;
  const first = bytes[offset++];
  const tagClass = first >> 6;
  const constructed = Boolean(first & 0x20);
  let tag = first & 0x1f;

  if (tag === 0x1f) {
    tag = 0;
    let byte;
    do {
      byte = bytes[offset++];
      tag = (tag << 7) | (byte & 0x7f);
    } while (byte & 0x80);
  }

  let length = bytes[offset++];
  if (length & 0x80) {
    const lengthBytes = length & 0x7f;
    length = 0;
    for (let i = 0; i < lengthBytes; i += 1) {
      length = (length << 8) | bytes[offset++];
    }
  }

  const contentStart = offset;
  const end = contentStart + length;
  const node = {
    tagClass,
    constructed,
    tag,
    start,
    contentStart,
    end,
    value: bytes.slice(contentStart, end),
    children: []
  };

  if (constructed || tag === 16 || tag === 17) {
    let childOffset = contentStart;
    while (childOffset < end) {
      const child = parseAsn1(bytes, childOffset);
      node.children.push(child);
      childOffset = child.end;
    }
  }

  return node;
};

const decodeAsn1String = (node) => {
  if (node.tag === 30) {
    let output = '';
    for (let i = 0; i < node.value.length; i += 2) {
      output += String.fromCharCode((node.value[i] << 8) | node.value[i + 1]);
    }
    return output;
  }

  return new TextDecoder('utf-8').decode(node.value);
};

const decodeName = (node) => node.children
  .map((set) => {
    const pair = set.children[0];
    if (!pair || pair.children.length < 2) return '';
    const oid = decodeOid(pair.children[0].value);
    const label = oidLabels[oid] || oid;
    return `${label}=${decodeAsn1String(pair.children[1])}`;
  })
  .filter(Boolean)
  .join(', ');

const decodeTime = (node) => {
  const value = decodeAsn1String(node).replace(/Z$/, '');
  let year;
  let offset;

  if (node.tag === 23) {
    year = Number(value.slice(0, 2));
    year += year >= 50 ? 1900 : 2000;
    offset = 2;
  } else {
    year = Number(value.slice(0, 4));
    offset = 4;
  }

  const month = Number(value.slice(offset, offset + 2)) - 1;
  const day = Number(value.slice(offset + 2, offset + 4));
  const hour = Number(value.slice(offset + 4, offset + 6) || '0');
  const minute = Number(value.slice(offset + 6, offset + 8) || '0');
  const second = Number(value.slice(offset + 8, offset + 10) || '0');

  return new Date(Date.UTC(year, month, day, hour, minute, second));
};

const formatDate = (date) => new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  timeZone: 'UTC'
}).format(date);

const decodeGeneralName = (node) => {
  if (node.tagClass !== 2) return '';
  if ([1, 2, 6].includes(node.tag)) return decodeAsn1String(node);
  if (node.tag === 7 && node.value.length === 4) return Array.from(node.value).join('.');
  if (node.tag === 7 && node.value.length === 16) {
    const chunks = [];
    for (let i = 0; i < node.value.length; i += 2) {
      chunks.push(((node.value[i] << 8) | node.value[i + 1]).toString(16));
    }
    return chunks.join(':');
  }
  return '';
};

const findExtension = (tbs, oid) => {
  const extensionsWrapper = tbs.children.find((node) => node.tagClass === 2 && node.tag === 3);
  const extensions = extensionsWrapper && extensionsWrapper.children[0];
  if (!extensions) return undefined;

  return extensions.children.find((extension) => {
    const extensionOid = extension.children[0] && decodeOid(extension.children[0].value);
    return extensionOid === oid;
  });
};

const decodeSubjectAltNames = (tbs) => {
  const extension = findExtension(tbs, '2.5.29.17');
  if (!extension) return [];

  const octet = extension.children.find((node) => node.tag === 4);
  if (!octet) return [];

  return parseAsn1(octet.value).children.map(decodeGeneralName).filter(Boolean);
};

const extractPemBlocks = (text) => Array.from(text.matchAll(/-----BEGIN ([^-]+)-----([\s\S]*?)-----END \1-----/g))
  .map((match) => ({
    type: match[1].trim(),
    body: match[2].replace(/\s+/g, '')
  }));

const normalizeHostname = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
  const hostname = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  const isDomainOrIpv4 = /^[a-z0-9.-]+$/.test(hostname) && hostname.includes('.');

  if (!isDomainOrIpv4) {
    throw new Error('Enter a valid public hostname.');
  }

  return hostname;
};

const renderLiveSslOptions = (hostname) => {
  const sslLabsUrl = `https://www.ssllabs.com/ssltest/analyze.html?d=${encodeURIComponent(hostname)}&hideResults=on`;
  const command = `echo | openssl s_client -servername ${hostname} -connect ${hostname}:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates -serial -fingerprint -sha256`;

  sslResults.innerHTML = `
    <div class="ssl-live-panel">
      <p>Live website SSL check prepared for ${escapeHtml(hostname)}.</p>
      <p><a href="${sslLabsUrl}" target="_blank" rel="noopener">Open detailed SSL Labs scan</a></p>
      <code>${escapeHtml(command)}</code>
    </div>
  `;
};

const parseCertificate = async (bytes) => {
  const cert = parseAsn1(bytes);
  const tbs = cert.children[0];
  const signatureOid = cert.children[1] && cert.children[1].children[0]
    ? decodeOid(cert.children[1].children[0].value)
    : '';
  let index = tbs.children[0].tagClass === 2 && tbs.children[0].tag === 0 ? 1 : 0;
  const serial = tbs.children[index++];
  index += 1;
  const issuer = tbs.children[index++];
  const validity = tbs.children[index++];
  const subject = tbs.children[index++];
  const publicKeyInfo = tbs.children[index++];
  const notBefore = decodeTime(validity.children[0]);
  const notAfter = decodeTime(validity.children[1]);
  const remainingDays = Math.ceil((notAfter.getTime() - Date.now()) / 86400000);
  const publicKeyOid = publicKeyInfo && publicKeyInfo.children[0] && publicKeyInfo.children[0].children[0]
    ? decodeOid(publicKeyInfo.children[0].children[0].value)
    : '';
  const fingerprint = await crypto.subtle.digest('SHA-256', bytes);

  return {
    subject: decodeName(subject),
    issuer: decodeName(issuer),
    validFrom: formatDate(notBefore),
    validTo: formatDate(notAfter),
    status: remainingDays < 0 ? `Expired ${Math.abs(remainingDays)}d ago` : `${remainingDays}d left`,
    sans: decodeSubjectAltNames(tbs).join(', ') || 'None found',
    serial: bytesToHex(serial.value).replace(/^00/, '').toUpperCase(),
    signature: oidLabels[signatureOid] || signatureOid || 'Unknown',
    publicKey: oidLabels[publicKeyOid] || publicKeyOid || 'Unknown',
    fingerprint: formatFingerprint(new Uint8Array(fingerprint))
  };
};

const renderSslResults = (details) => {
  const rows = [
    ['Subject', details.subject, true],
    ['Issuer', details.issuer, true],
    ['Valid from', details.validFrom, false],
    ['Valid to', details.validTo, false],
    ['Status', details.status, false],
    ['SANs', details.sans, true],
    ['Serial', details.serial, true],
    ['Signature', details.signature, false],
    ['Public key', details.publicKey, false],
    ['SHA-256 fingerprint', details.fingerprint, true]
  ];

  sslResults.innerHTML = `<dl class="result-grid">${rows.map(([label, value, wide]) => `
    <div class="${wide ? 'wide' : ''}">
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `).join('')}</dl>`;
};

const processSslFile = async (file) => {
  if (!file) {
    setSslStatus('No certificate selected yet.');
    return;
  }

  sslResults.innerHTML = '<p class="empty-result">Reading certificate...</p>';
  setSslStatus('Processing...');

  try {
    const text = await file.text();
    const blocks = extractPemBlocks(text);
    const certificateBlock = blocks.find((block) => block.type === 'CERTIFICATE');
    const privateKeyBlock = blocks.find((block) => block.type.includes('PRIVATE KEY'));

    if (!certificateBlock && privateKeyBlock) {
      sslResults.innerHTML = '<p class="empty-result">Private key detected. Upload a certificate file.</p>';
      setSslStatus('Private key detected.', true);
      return;
    }

    const bytes = certificateBlock
      ? Uint8Array.from(atob(certificateBlock.body), (char) => char.charCodeAt(0))
      : new Uint8Array(await file.arrayBuffer());
    const details = await parseCertificate(bytes);

    renderSslResults(details);
    setSslStatus('Certificate analysed.');
  } catch (error) {
    sslResults.innerHTML = '<p class="empty-result">Could not parse certificate.</p>';
    setSslStatus(error.message || 'Invalid certificate file.', true);
  }
};

const processLiveHost = (value) => {
  try {
    const hostname = normalizeHostname(value);

    if (!hostname) {
      setSslStatus('Enter a hostname to check.', true);
      return;
    }

    renderLiveSslOptions(hostname);
    setSslStatus('Live website check prepared.');
  } catch (error) {
    sslResults.innerHTML = '<p class="empty-result">Enter a valid public hostname, for example example.com.</p>';
    setSslStatus(error.message || 'Invalid hostname.', true);
  }
};

if (sslLiveForm) {
  sslLiveForm.addEventListener('submit', (event) => {
    event.preventDefault();
    processLiveHost(sslLiveHost.value);
  });
}

if (sslUpload) {
  sslUpload.addEventListener('change', (event) => {
    processSslFile(event.target.files[0]);
  });
}
