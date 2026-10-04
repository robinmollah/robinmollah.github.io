const iconUpload = document.querySelector('#icon-upload');
const iconStatus = document.querySelector('#icon-tool-status');
const iconPreview = document.querySelector('#icon-preview');
const iconDownloads = document.querySelector('#icon-downloads');
const iconChecks = document.querySelectorAll('#icon-spec-list [data-check]');
const acceptedIconSizes = [2048, 1024, 512, 256];
const outputIconSizes = [2048, 1024, 512, 256];
const playIconMaxBytes = 1024 * 1024;
let generatedIconUrls = [];

const setIconStatus = (message, isError = false) => {
  iconStatus.textContent = message;
  iconStatus.classList.toggle('is-error', isError);
};

const setIconCheck = (name, state, message) => {
  const item = Array.from(iconChecks).find((check) => check.dataset.check === name);
  if (!item) return;

  item.classList.remove('is-pass', 'is-warn', 'is-fail');
  if (state) item.classList.add(`is-${state}`);
  item.textContent = message;
};

const resetIconTool = () => {
  generatedIconUrls.forEach((url) => URL.revokeObjectURL(url));
  generatedIconUrls = [];
  iconPreview.replaceChildren();
  iconDownloads.replaceChildren();
};

const loadIconImage = (file) => new Promise((resolve, reject) => {
  const image = new Image();
  const url = URL.createObjectURL(file);

  image.onload = () => resolve({ image, url });
  image.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error('Invalid image file.'));
  };

  image.src = url;
});

const renderIconBlob = (image, size) => new Promise((resolve) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = size;
  canvas.height = size;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.clearRect(0, 0, size, size);
  context.drawImage(image, 0, 0, size, size);
  canvas.toBlob(resolve, 'image/png');
});

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
};

const processIconFile = async (file) => {
  resetIconTool();

  if (!file) {
    setIconStatus('No icon selected yet.');
    return;
  }

  setIconStatus('Processing...');

  try {
    const { image, url } = await loadIconImage(file);
    const isSquare = image.naturalWidth === image.naturalHeight;
    const isAcceptedSource = isSquare && acceptedIconSizes.includes(image.naturalWidth);
    const isPng = file.type === 'image/png';
    generatedIconUrls.push(url);

    const preview = new Image();
    preview.src = url;
    preview.alt = `${image.naturalWidth} by ${image.naturalHeight} icon preview`;
    iconPreview.replaceChildren(preview);

    setIconCheck(
      'dimensions',
      isAcceptedSource ? 'pass' : 'fail',
      isSquare
        ? `${image.naturalWidth}x${image.naturalHeight}`
        : `${image.naturalWidth}x${image.naturalHeight}, not square`
    );

    setIconCheck(
      'format',
      isPng ? 'pass' : 'warn',
      isPng
        ? 'PNG source'
        : 'Converted to PNG'
    );

    setIconCheck('manual', 'warn', 'Check artwork shape/shadow manually.');

    if (!isAcceptedSource) {
      setIconCheck('play-size', 'fail', 'Not generated');
      setIconCheck('file-size', 'fail', 'Not checked');
      setIconStatus('Use 2048, 1024, 512, or 256px square image.', true);
      return;
    }

    const generated = await Promise.all(outputIconSizes.map(async (size) => {
      const blob = await renderIconBlob(image, size);
      return { size, blob };
    }));

    const playIcon = generated.find((item) => item.size === 512);
    const playIconFits = playIcon && playIcon.blob && playIcon.blob.size <= playIconMaxBytes;

    setIconCheck('play-size', 'pass', 'Generated');
    setIconCheck(
      'file-size',
      playIconFits ? 'pass' : 'fail',
      playIcon
        ? `${formatBytes(playIcon.blob.size)} / 1024KB`
        : 'Not generated'
    );

    generated.forEach(({ size, blob }) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      generatedIconUrls.push(url);

      const link = document.createElement('a');
      link.href = url;
      link.download = `app-icon-${size}x${size}.png`;
      link.innerHTML = `<span>${size}x${size}</span><small>${formatBytes(blob.size)}</small>`;
      iconDownloads.appendChild(link);
    });

    setIconStatus(`Generated ${generated.length} sizes.`);
  } catch (error) {
    setIconCheck('dimensions', 'fail', 'Unreadable');
    setIconCheck('format', 'fail', 'Invalid file');
    setIconCheck('play-size', 'fail', 'Not generated');
    setIconCheck('file-size', 'fail', 'Not checked');
    setIconCheck('manual', 'warn', 'Check manually after upload.');
    setIconStatus(error.message, true);
  }
};

if (iconUpload) {
  iconUpload.addEventListener('change', (event) => {
    processIconFile(event.target.files[0]);
  });
}
