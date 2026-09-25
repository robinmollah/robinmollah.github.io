(() => {
  "use strict";
  document.querySelectorAll("[data-teaser]").forEach((description, index) => {
    const full = document.createElement("span");
    full.className = "description-full";
    full.id = "description-" + index;
    full.textContent = description.textContent.trim();
    const teaser = document.createElement("span");
    teaser.className = "description-teaser";
    teaser.textContent = description.dataset.teaser;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "description-info";
    button.textContent = "i";
    button.title = "More details";
    button.setAttribute("aria-label", "More details");
    button.setAttribute("aria-controls", full.id);
    description.replaceChildren(teaser, full, button);
    description.classList.add("description-ready");
    let pinned = false, hovered = false, focused = false;
    const update = () => {
      const open = pinned || hovered || focused;
      description.classList.toggle("description-open", open);
      button.setAttribute("aria-expanded", String(open));
      full.setAttribute("aria-hidden", String(!open));
      teaser.setAttribute("aria-hidden", String(open));
    };
    description.addEventListener("pointerenter", event => {
      if (event.pointerType === "mouse") { hovered = true; update(); }
    });
    description.addEventListener("pointerleave", () => { hovered = false; update(); });
    button.addEventListener("focus", () => {
      focused = button.matches(":focus-visible"); update();
    });
    button.addEventListener("blur", () => { focused = false; update(); });
    button.addEventListener("click", () => {
      pinned = !pinned;
      if (!pinned) { hovered = false; focused = false; }
      update();
    });
    button.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        pinned = hovered = focused = false;
        update();
      }
    });
    update();
  });
  document.querySelectorAll(".next-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 9).toFixed(2)}deg`);
      card.style.setProperty("--shine-x", `${((x + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty("--shine-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
      card.style.removeProperty("--shine-x");
      card.style.removeProperty("--shine-y");
    });
  });
  const chapters = [...document.querySelectorAll(".chapter")];
  const links = [...document.querySelectorAll(".chapters a")];
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const motionButton = document.querySelector("#motion");
  let paused = media.matches;
  let progress = 0;
  let orbitProgress = 0;
  let active = 0;
  let routeLayout = [];
  let draw = () => {};
  const updateMotion = () => {
    document.body.classList.toggle("motion-paused", paused);
    motionButton.setAttribute("aria-pressed", String(paused));
    motionButton.textContent = paused ? "Resume motion" : "Pause motion";
    motionButton.title = paused ? "Resume scene motion" : "Pause scene motion";
    draw();
  };
  motionButton.addEventListener("click", () => {
    paused = !paused;
    updateMotion();
  });
  media.addEventListener("change", (event) => {
    paused = event.matches;
    updateMotion();
  });
  updateMotion();
  function updateProgress() {
    const point = scrollY + innerHeight * 0.4;
    active = 0;
    chapters.forEach((section, i) => {
      if (point >= section.offsetTop) active = i;
    });
    const section = chapters[active];
    progress = 0;
    routeLayout.forEach(({ start, end }, index) => {
      if (scrollY >= start)
        progress = index + Math.min(1, (scrollY - start) / (end - start));
    });
    const stop = Math.floor(progress);
    const orbitStart = stop === 0 ? 0 : routeLayout[stop - 1]?.end || 0;
    const orbitEnd =
      routeLayout[stop]?.start ||
      document.documentElement.scrollHeight - innerHeight;
    orbitProgress = Math.max(
      0,
      Math.min(1, (scrollY - orbitStart) / Math.max(1, orbitEnd - orbitStart)),
    );
    links.forEach((link) => {
      if (link.hash === "#" + section.id)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    document.querySelector("#current-destination").textContent =
      section.dataset.name.toUpperCase();
    if (paused) draw();
  }
  addEventListener("scroll", updateProgress, { passive: true });
  function measureRoute() {
    routeLayout = chapters.slice(1).map((section) => ({
      start: section.offsetTop - innerHeight * 0.4,
      end:
        section.offsetTop +
        parseFloat(getComputedStyle(section).paddingTop) -
        innerHeight * 0.4,
    }));
    updateProgress();
  }
  addEventListener("resize", measureRoute);
  new ResizeObserver(measureRoute).observe(document.querySelector("main"));
  measureRoute();
  const stories = {
    cache: [
      "01 / FAST PATH",
      "The fastest work is work you don't repeat.",
      "A request reaches the API. A valid cached result returns immediately, reducing database load. Cache keys, expiry, and invalidation are part of the correctness story.",
    ],
    async: [
      "02 / ASYNC PATH",
      "Accept the request. Finish the work reliably.",
      "The API records a job in a durable queue and returns an acknowledgement. Workers process it independently. Idempotent handlers and bounded retries make redelivery safe; failed jobs need a visible recovery path.",
    ],
    failure: [
      "03 / RECOVERY PATH",
      "A failed service should not end the request.",
      "Health checks remove an unavailable instance from routing. New requests reach a healthy replica. In-flight requests can still fail: timeouts, retry budgets, and idempotency determine whether retrying is safe.",
    ],
  };
  let scenario = "cache";
  document.querySelectorAll("[data-scenario]").forEach((button) =>
    button.addEventListener("click", () => {
      scenario = button.dataset.scenario;
      document
        .querySelectorAll("[data-scenario]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
      document.querySelector(".system-map").dataset.mode = scenario;
      ["number", "title", "copy"].forEach((name, i) => {
        document.querySelector("#scenario-" + name).textContent =
          stories[scenario][i];
      });
      draw();
    }),
  );
  if (!window.THREE) {
    motionButton.hidden = true;
    return;
  }
  const T = window.THREE;
  const canvas = document.querySelector("#space");
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch (_) {
    motionButton.hidden = true;
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setClearColor(0x050608);
  renderer.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene();
  scene.fog = new T.Fog(0x050608, 55, 150);
  const camera = new T.PerspectiveCamera(
    42,
    innerWidth / innerHeight,
    0.1,
    2200,
  );
  camera.position.z = 14;
  scene.add(camera);
  scene.add(new T.AmbientLight(0x8b9baa, 0.16));
  const sun = new T.DirectionalLight(0xe8f1ff, 3.2);
  sun.position.set(-300, 400, 500);
  scene.add(sun);
  const earthGroup = new T.Group();
  scene.add(earthGroup);
  const earthMaterial = new T.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 12,
    specular: 0x202b35,
  });
  const earth = new T.Mesh(new T.SphereGeometry(3.3, 80, 64), earthMaterial);
  earth.rotation.set(0.12, 2.7, -0.2);
  earthGroup.add(earth);
  const texture = new T.TextureLoader().load("/life/assets/earth.jpg", () =>
    draw(),
  );
  texture.colorSpace = T.SRGBColorSpace;
  earthMaterial.map = texture;
  const atmosphere = new T.Mesh(
    new T.SphereGeometry(3.36, 64, 48),
    new T.ShaderMaterial({
      transparent: true,
      side: T.BackSide,
      blending: T.AdditiveBlending,
      depthWrite: false,
      vertexShader:
        "varying vec3 vNormal; varying vec3 vView; void main(){vec4 p=modelViewMatrix*vec4(position,1.0);vNormal=normalize(normalMatrix*normal);vView=normalize(-p.xyz);gl_Position=projectionMatrix*p;}",
      fragmentShader:
        "varying vec3 vNormal; varying vec3 vView; void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),3.0);gl_FragColor=vec4(0.18,0.43,0.68,rim*0.7);}",
    }),
  );
  earthGroup.add(atmosphere);
  // Seeded stars keep framing stable between visits and viewport checks.
  let seed = 1947;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const positions = new Float32Array(3200 * 3);
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (random() - 0.5) * 700;
    positions[i + 1] = (random() - 0.5) * 400;
    positions[i + 2] = 120 - random() * 1400;
  }
  const starGeometry = new T.BufferGeometry();
  starGeometry.setAttribute("position", new T.BufferAttribute(positions, 3));
  const stars = new T.Points(
    starGeometry,
    new T.PointsMaterial({
      color: 0xc7cbd0,
      size: 0.23,
      transparent: true,
      opacity: 0.65,
      fog: false,
    }),
  );
  scene.add(stars);
  const metal = new T.MeshStandardMaterial({
    color: 0x8e969b,
    metalness: 0.7,
    roughness: 0.35,
  });
  const darkMetal = new T.MeshStandardMaterial({
    color: 0x20272b,
    metalness: 0.65,
    roughness: 0.5,
  });
  const gold = new T.MeshStandardMaterial({
    color: 0xb08b51,
    metalness: 0.6,
    roughness: 0.4,
  });
  function part(group, geometry, material, x, y, z) {
    const mesh = new T.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  }
  const ship = new T.Group();
  scene.add(ship);
  part(
    ship,
    new T.CylinderGeometry(0.19, 0.27, 1.2, 12),
    metal,
    0,
    0,
    0,
  ).rotation.z = Math.PI / 2;
  part(ship, new T.ConeGeometry(0.2, 0.4, 12), metal, 0.78, 0, 0).rotation.z =
    -Math.PI / 2;
  part(ship, new T.BoxGeometry(0.45, 0.45, 0.5), gold, -0.2, 0, 0);
  for (const side of [-1, 1]) {
    part(
      ship,
      new T.BoxGeometry(0.9, 0.025, 0.65),
      darkMetal,
      -0.15,
      side * 0.75,
      0,
    );
    part(
      ship,
      new T.CylinderGeometry(0.025, 0.025, 1.5, 6),
      metal,
      -0.15,
      0,
      0,
    );
    for (let j = 0; j < 5; j++)
      part(
        ship,
        new T.BoxGeometry(0.015, 0.035, 0.65),
        metal,
        -0.52 + j * 0.18,
        side * 0.75,
        0,
      );
  }
  const beacon = part(
    ship,
    new T.SphereGeometry(0.045, 8, 8),
    new T.MeshBasicMaterial({ color: 0xe1b478 }),
    0.5,
    0,
    0.18,
  );
  ship.rotation.set(0.55, 0.3, -0.3);
  const station = new T.Group();
  scene.add(station);
  part(station, new T.TorusGeometry(2, 0.08, 8, 100), metal, 0, 0, 0);
  part(station, new T.TorusGeometry(1.8, 0.025, 6, 100), gold, 0, 0, 0);
  part(
    station,
    new T.CylinderGeometry(0.42, 0.42, 2, 12),
    metal,
    0,
    0,
    0,
  ).rotation.x = Math.PI / 2;
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    part(
      station,
      new T.BoxGeometry(2, 0.06, 0.06),
      metal,
      Math.cos(angle),
      Math.sin(angle),
      0,
    ).rotation.z = angle;
    part(
      station,
      new T.BoxGeometry(0.55, 0.7, 0.6),
      darkMetal,
      Math.cos(angle) * 2,
      Math.sin(angle) * 2,
      0,
    ).rotation.z = angle;
  }
  station.rotation.set(0.3, 0.5, 0.2);
  const moon = new T.Mesh(
    new T.IcosahedronGeometry(1.35, 4),
    new T.MeshStandardMaterial({
      color: 0x858077,
      roughness: 1,
      flatShading: true,
    }),
  );
  scene.add(moon);
  const frontier = new T.Group();
  scene.add(frontier);
  part(
    frontier,
    new T.SphereGeometry(2.6, 64, 48),
    new T.MeshStandardMaterial({ color: 0x9e8066, roughness: 0.85 }),
    0,
    0,
    0,
  );
  const ring = part(
    frontier,
    new T.RingGeometry(3.4, 4.5, 100),
    new T.MeshBasicMaterial({
      color: 0x92816c,
      side: T.DoubleSide,
      transparent: true,
      opacity: 0.38,
    }),
    0,
    0,
    0,
  );
  ring.rotation.x = 1.25;
  ring.rotation.y = 0.25;

  const loader = new T.TextureLoader();
  const moonTexture = loader.load("/life/assets/moon.jpg", () => draw());
  moonTexture.colorSpace = T.SRGBColorSpace;
  moon.geometry.dispose();
  moon.geometry = new T.SphereGeometry(4.2, 64, 48);
  moon.material.dispose();
  moon.material = new T.MeshStandardMaterial({
    map: moonTexture,
    bumpMap: moonTexture,
    bumpScale: 0.12,
    roughness: 0.95,
  });
  function rockyPlanet(radius, color) {
    const planet = new T.Mesh(
      new T.SphereGeometry(radius, 64, 48),
      new T.MeshStandardMaterial({
        map: moonTexture,
        bumpMap: moonTexture,
        bumpScale: 0.16,
        color,
        roughness: 0.85,
      }),
    );
    scene.add(planet);
    return planet;
  }
  const redPlanet = rockyPlanet(5.5, 0xb87655);
  const icePlanet = rockyPlanet(5, 0x83aebc);

  // Surface detail lives in object space, so clouds remain attached as the camera flies past.
  const gasMaterial = new T.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
  });
  gasMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vSurface;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvSurface = position;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
      varying vec3 vSurface;
      float surfaceHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float surfaceNoise(vec3 p) {
        vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(mix(surfaceHash(i),surfaceHash(i+vec3(1,0,0)),f.x),mix(surfaceHash(i+vec3(0,1,0)),surfaceHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(surfaceHash(i+vec3(0,0,1)),surfaceHash(i+vec3(1,0,1)),f.x),mix(surfaceHash(i+vec3(0,1,1)),surfaceHash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        vec3 p=normalize(vSurface);
        float n=surfaceNoise(p*7.0)+0.35*surfaceNoise(p*28.0);
        float band=sin(p.y*85.0+n*6.0)*0.5+0.5;
        float fine=surfaceNoise(p*120.0);
        diffuseColor.rgb=mix(vec3(.24,.19,.16),vec3(.72,.64,.49),band)*(.78+.22*fine);
      `,
      );
  };
  const giant = new T.Mesh(new T.SphereGeometry(8, 80, 64), gasMaterial);
  scene.add(giant);
  frontier.children[0].material.dispose();
  frontier.children[0].material = gasMaterial;
  earthGroup.scale.setScalar(1.65);
  station.scale.setScalar(2);
  frontier.scale.setScalar(2);

  const redGlow = new T.MeshBasicMaterial({ color: 0xff2e2e });
  const greenGlow = new T.MeshBasicMaterial({ color: 0x8fd7a1 });
  const blueGlow = new T.MeshBasicMaterial({ color: 0x7fb3ff });
  const goldGlow = new T.MeshBasicMaterial({ color: 0xe6b95b });
  const glass = new T.MeshStandardMaterial({
    color: 0x1c2a34,
    roughness: 0.25,
    metalness: 0.2,
    transparent: true,
    opacity: 0.74,
  });
  const earthCloneMaterial = earthMaterial.clone();
  earthCloneMaterial.map = texture;

  function latLonPoint(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new T.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    );
  }
  function attachVideoPanel(group, src, datasetKey, width, height) {
    const material = new T.MeshBasicMaterial({
      color: 0x111b23,
      side: T.DoubleSide,
      transparent: true,
      opacity: 0.78,
    });
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = false;
    video.playsInline = true;
    video.preload = "auto";
    video.style.display = "none";
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    document.body.append(video);
    video.addEventListener("loadeddata", () => {
      const aspect = video.videoWidth / video.videoHeight;
      const fittedWidth = Math.min(width, height * aspect);
      const fittedHeight = fittedWidth / aspect;
      panel.geometry.dispose();
      panel.geometry = new T.PlaneGeometry(fittedWidth, fittedHeight);
      const texture = new T.VideoTexture(video);
      texture.colorSpace = T.SRGBColorSpace;
      texture.minFilter = T.LinearFilter;
      texture.magFilter = T.LinearFilter;
      material.map = texture;
      material.color.setHex(0xffffff);
      material.opacity = 1;
      material.needsUpdate = true;
      canvas.dataset[datasetKey] = "loaded";
      draw();
    });
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      video.play().catch(() => {
        canvas.dataset[datasetKey] = "blocked";
      });
    });
    video.load();
    const panel = part(group, new T.PlaneGeometry(width, height), material, 0, 0, 0.08);
    panel.renderOrder = 2;
    group.userData.video = video;
    group.userData.videoMaterial = material;
    group.userData.videoKey = datasetKey;
    return panel;
  }
  function updateVideoPanel(world, stopIndex) {
    if (!world.userData.video || !world.userData.videoMaterial) return;
    const video = world.userData.video;
    const material = world.userData.videoMaterial;
    const key = world.userData.videoKey;
    if (
      canvas.dataset[key] === "loaded" &&
      Number.isFinite(video.duration) &&
      video.duration > 1
    ) {
      const shouldPlayVideo = !paused && Math.abs(current - stopIndex) < 1.15;
      if (shouldPlayVideo && video.paused) {
        video.play().catch(() => {
          canvas.dataset[key] = "blocked";
        });
      } else if (!shouldPlayVideo && !video.paused) {
        video.pause();
      }
      const fadeWindow = 0.9;
      const remaining = video.duration - video.currentTime;
      if (shouldPlayVideo && remaining < 0.08 && !world.userData.refreshingVideo) {
        world.userData.refreshingVideo = true;
        material.opacity = 0.12;
        video.currentTime = 0;
        video.play().catch(() => {
          canvas.dataset[key] = "blocked";
        });
        setTimeout(() => {
          world.userData.refreshingVideo = false;
        }, 350);
      } else {
        const fadeIn = Math.min(1, video.currentTime / fadeWindow);
        const fadeOut = Math.min(1, Math.max(0, remaining / fadeWindow));
        material.opacity = Math.max(0.12, Math.min(fadeIn, fadeOut));
      }
    } else if (canvas.dataset[key] === "blocked") {
      material.map = null;
      material.color.setHex(0x111b23);
      material.opacity = 0.78;
    }
  }
  function makeOriginGlobe() {
    const group = new T.Group();
    earth.add(group);
    const highlight = goldGlow.clone();
    highlight.transparent = true;
    highlight.opacity = 0;
    const narsingdi = latLonPoint(23.92, 90.72, 3.34);
    part(
      group,
      new T.SphereGeometry(0.025, 16, 12),
      highlight,
      narsingdi.x,
      narsingdi.y,
      narsingdi.z,
    );
    const marker = part(
      group,
      new T.TorusGeometry(0.13, 0.008, 8, 48),
      highlight,
      narsingdi.x,
      narsingdi.y,
      narsingdi.z,
    );
    marker.quaternion.setFromUnitVectors(
      new T.Vector3(0, 0, 1),
      narsingdi.clone().normalize(),
    );
    group.userData.marker = marker;
    group.userData.highlight = highlight;
    // Simplified geographic boundary from johan/world.geo.json (Natural Earth).
    fetch("/life/assets/bangladesh-border.geo.json")
      .then(response => {
        if (!response.ok) throw new Error("Boundary unavailable");
        return response.json();
      })
      .then(data => {
        const material = new T.LineBasicMaterial({ color: 0xffd57a, transparent: true, opacity: 0 });
        data.features[0].geometry.coordinates.forEach(ring => {
          const points = ring.map(([lon, lat]) => latLonPoint(lat, lon, 3.315));
          group.add(new T.Line(new T.BufferGeometry().setFromPoints(points), material));
        });
        group.userData.borderMaterial = material;
        canvas.dataset.bangladeshBorder = "loaded";
        draw();
      }).catch(() => { canvas.dataset.bangladeshBorder = "unavailable"; });
    return group;
  }
  function makeFpsWorld() {
    const group = new T.Group();
    scene.add(group);

    const videoMaterial = new T.MeshBasicMaterial({
      color: 0x111b23,
      side: T.DoubleSide,
      transparent: true,
      opacity: 0.78,
    });
    const video = document.createElement("video");
    video.src = "/life/assets/1971_hit_n_run_trimmed.mp4";
    video.muted = true;
    video.defaultMuted = true;
    video.loop = false;
    video.playsInline = true;
    video.preload = "auto";
    video.style.display = "none";
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    document.body.append(video);
    video.addEventListener("loadeddata", () => {
      const texture = new T.VideoTexture(video);
      texture.colorSpace = T.SRGBColorSpace;
      texture.minFilter = T.LinearFilter;
      texture.magFilter = T.LinearFilter;
      videoMaterial.map = texture;
      videoMaterial.color.setHex(0xffffff);
      videoMaterial.opacity = 1;
      videoMaterial.needsUpdate = true;
      canvas.dataset.hitRunVideo = "loaded";
      draw();
    });
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      video.play().catch(() => {
        canvas.dataset.hitRunVideo = "blocked";
      });
    });
    video.load();

    const panel = part(
      group,
      new T.PlaneGeometry(5.8, 3.26),
      videoMaterial,
      0,
      0,
      0.08,
    );
    part(group, new T.BoxGeometry(6.15, 3.6, 0.16), darkMetal, 0, 0, -0.04);
    panel.renderOrder = 2;
    for (let i = 0; i < 8; i++) {
      const top = i < 4;
      const x = (i % 4) * 1.42 - 2.13;
      const y = top ? 1.98 : -1.98;
      part(group, new T.BoxGeometry(0.62, 0.09, 0.32), i % 2 ? metal : gold, x, y, 0.18);
    }
    const crosshair = new T.Group();
    group.add(crosshair);
    part(crosshair, new T.TorusGeometry(0.64, 0.014, 8, 64), redGlow, 0, 0, 0.18);
    part(crosshair, new T.BoxGeometry(1.72, 0.02, 0.02), redGlow, 0, 0, 0.18);
    part(crosshair, new T.BoxGeometry(0.02, 1.72, 0.02), redGlow, 0, 0, 0.18);
    crosshair.renderOrder = 3;
    group.rotation.y = -0.18;
    group.userData.crosshair = crosshair;
    group.userData.video = video;
    group.userData.videoMaterial = videoMaterial;
    return group;
  }
  function makeBotWorld() {
    const group = new T.Group();
    scene.add(group);
    attachVideoPanel(
      group,
      "/life/assets/bracubot-sample-conversation.mp4",
      "bracuBotVideo",
      7.2,
      4.032,
    );
    part(group, new T.BoxGeometry(7.55, 4.38, 0.16), darkMetal, 0, 0, -0.04);
    part(group, new T.SphereGeometry(0.06, 16, 12), greenGlow, -3.3, 2.1, 0.09);
    part(group, new T.SphereGeometry(0.06, 16, 12), greenGlow, -3.05, 2.1, 0.09);
    part(group, new T.CylinderGeometry(0.025, 0.025, 0.75, 8), metal, 0, 2.55, 0);
    part(group, new T.SphereGeometry(0.14, 16, 12), goldGlow, 0, 2.95, 0);
    for (let i = 0; i < 3; i++) {
      const bubble = part(
        group,
        new T.BoxGeometry(1.25 - i * 0.18, 0.32, 0.05),
        new T.MeshBasicMaterial({
          color: i === 0 ? 0xe6b95b : 0x8fd7a1,
          transparent: true,
          opacity: 0.42,
        }),
        4.5,
        1.15 - i * 0.48,
        0.34,
      );
      bubble.rotation.y = -0.18;
    }
    return group;
  }
  function makeNasaWorld() {
    const group = new T.Group();
    scene.add(group);
    part(group, new T.SphereGeometry(0.62, 48, 36), goldGlow, 0, 0, 0);
    const planets = [];
    const colors = [0xa99c8d, 0xe4c489, 0x568ee8, 0xc97154, 0xc6a281, 0xe4d5a2, 0x80d3d6, 0x4267cf];
    colors.forEach((color, i) => {
      const radius = 1.1 + i * 0.49;
      const path = part(group, new T.TorusGeometry(radius, 0.009, 6, 100),
        new T.MeshBasicMaterial({ color: 0x687785, transparent: true, opacity: 0.4 }), 0, 0, 0);
      path.rotation.x = Math.PI / 2;
      const planet = part(group, new T.SphereGeometry(i > 3 ? 0.2 : 0.12, 24, 16),
        i === 2 ? earthCloneMaterial : new T.MeshStandardMaterial({ color, roughness: 0.65 }), 0, 0, 0);
      if (i === 5) {
        const rings = part(planet, new T.TorusGeometry(0.34, 0.055, 8, 48), gold, 0, 0, 0);
        rings.rotation.x = 1.2;
      }
      planets.push({ planet, radius, speed: 0.3 / Math.sqrt(i + 1), phase: i * 2.4 });
    });
    group.userData.planets = planets;
    group.rotation.x = 0.55;
    const orbit = part(
      group,
      new T.TorusGeometry(3.0, 0.018, 8, 96),
      goldGlow,
      0,
      0,
      0,
    );
    orbit.rotation.x = 1.2;
    orbit.rotation.y = 0.35;
    const satellite = new T.Group();
    group.add(satellite);
    part(satellite, new T.BoxGeometry(0.75, 0.42, 0.42), metal, 3, 0, 0);
    part(satellite, new T.BoxGeometry(1.1, 0.03, 0.55), darkMetal, 2.2, 0, 0);
    part(satellite, new T.BoxGeometry(1.1, 0.03, 0.55), darkMetal, 3.8, 0, 0);
    group.userData.orbit = orbit;
    group.userData.satellite = satellite;
    satellite.visible = false;
    orbit.visible = false;
    return group;
  }
  function makeBontonWorld() {
    const group = new T.Group();
    scene.add(group);
    part(group, new T.BoxGeometry(3.8, 1.05, 2.35), darkMetal, 0, -0.8, 0);
    part(group, new T.BoxGeometry(2.7, 0.12, 1.7), metal, 0, -0.18, 0.18);
    for (let i = 0; i < 4; i++) {
      part(group, new T.SphereGeometry(0.08, 12, 8), greenGlow, -1.35 + i * 0.9, -0.18, 1.08);
    }
    for (let i = 0; i < 3; i++) {
      const antenna = part(group, new T.CylinderGeometry(0.025, 0.025, 1.8, 8), metal, -1.4 + i * 1.4, 0.76, -0.25);
      antenna.rotation.z = i === 1 ? 0 : (i - 1) * 0.25;
      const signal = part(group, new T.TorusGeometry(0.55 + i * 0.3, 0.012, 6, 48), greenGlow, -1.4 + i * 1.4, 1.7, -0.25);
      signal.rotation.x = 1.3;
    }
    const tunnel = part(group, new T.TorusGeometry(2.65, 0.035, 8, 100), blueGlow, 0, 0.25, -0.65);
    tunnel.rotation.x = 1.45;
    group.userData.tunnel = tunnel;
    group.userData.flows = [];
    for (let i = 0; i < 4; i++) {
      const x = i % 2 ? 3.4 : -3.4;
      const y = i < 2 ? 2.4 : -2.1;
      part(group, new T.BoxGeometry(0.65, 1.1, 0.12), metal, x, y, 0);
      part(group, new T.PlaneGeometry(0.5, 0.82), blueGlow, x, y, 0.07);
      addFlow(group, new T.Vector3(x, y, 0), new T.Vector3(0, -0.5, 0), greenGlow, 4, i);
    }
    return group;
  }
  // Conceptual traffic paths illustrate flow without claiming a deployment topology.
  function addFlow(group, start, end, material, count, phase) {
    const curve = new T.QuadraticBezierCurve3(start,
      start.clone().lerp(end, 0.5).add(new T.Vector3(0, 0.5, 0.5)), end);
    const line = new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(40)),
      new T.LineBasicMaterial({ color: material.color, transparent: true, opacity: 0.3 }));
    group.add(line);
    line.userData.flowVisual = true;
    group.userData.flows ||= [];
    for (let i = 0; i < count; i++) {
      const packet = part(group, new T.BoxGeometry(0.09, 0.09, 0.18), material, 0, 0, 0);
      packet.userData.flowVisual = true;
      group.userData.flows.push({ curve, packet, phase: i / count + phase * 0.13 });
    }
  }
  function makeMessageWorld(pipeline) {
    const group = new T.Group();
    scene.add(group);
    const core = part(group, pipeline ? new T.BoxGeometry(1.2, 2.5, 0.9) : new T.IcosahedronGeometry(0.9, 1),
      metal, 0, 0, 0);
    const ring = part(group, new T.TorusGeometry(1.5, 0.025, 8, 80), greenGlow, 0, 0, 0);
    group.userData.core = core;
    group.userData.ring = ring;
    for (let i = 0; i < 4; i++) {
      const y = (i - 1.5) * 1.4;
      part(group, new T.BoxGeometry(0.6, 0.75, 0.18), [blueGlow, redGlow, goldGlow, greenGlow][i], -3.7, y, 0);
      part(group, new T.BoxGeometry(0.65, 0.42, 0.5), darkMetal, 3.6, y, 0);
      addFlow(group, new T.Vector3(-3.4, y, 0), new T.Vector3(-0.7, 0, 0),
        [blueGlow, redGlow, goldGlow, greenGlow][i], pipeline ? 14 : 5, i);
      addFlow(group, new T.Vector3(0.7, 0, 0), new T.Vector3(3.3, y, 0), greenGlow, 5, i);
    }
    return group;
  }
  function makeEdgeWorld() {
    const group = new T.Group();
    scene.add(group);
    part(group, new T.CylinderGeometry(0.05, 0.18, 4.5, 12), metal, 0, 0, 0);
    for (let i = 0; i < 3; i++) {
      const ring = part(group, new T.TorusGeometry(0.5 + i * 0.45, 0.016, 8, 64),
        greenGlow, 0, 1.9, 0);
      ring.rotation.x = 0.8;
    }
    part(group, new T.BoxGeometry(0.7, 1.3, 0.15), metal, -3.3, -1.3, 0);
    part(group, new T.PlaneGeometry(0.55, 1.1), blueGlow, -3.3, -1.3, 0.09);
    part(group, new T.BoxGeometry(1, 2, 0.8), darkMetal, 3.1, -0.8, 0);
    for (let i = 0; i < 5; i++) {
      part(group, new T.BoxGeometry(0.7, 0.04, 0.04), goldGlow, 3.1, -1.5 + i * 0.32, 0.42);
    }
    addFlow(group, new T.Vector3(-3.3, -0.5, 0), new T.Vector3(0, 1.9, 0), blueGlow, 5, 0);
    addFlow(group, new T.Vector3(0, 1.9, 0), new T.Vector3(3.1, 0.2, 0), greenGlow, 5, 1);
    return group;
  }
  function makeCoronaWorld() {
    const group = new T.Group();
    scene.add(group);
    part(
      group,
      new T.SphereGeometry(2.25, 48, 36),
      new T.MeshStandardMaterial({ color: 0x8d2627, roughness: 0.8 }),
      0,
      0,
      0,
    );
    const dirs = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
      [0.75, 0.75, 0.2],
      [-0.75, 0.75, -0.2],
      [0.65, -0.55, -0.55],
      [-0.65, -0.55, 0.55],
      [0.25, 0.65, -0.75],
      [-0.25, -0.65, 0.75],
    ];
    dirs.forEach((point) => {
      const dir = new T.Vector3(...point).normalize();
      const spike = part(
        group,
        new T.ConeGeometry(0.18, 1.2, 14),
        redGlow,
        dir.x * 2.75,
        dir.y * 2.75,
        dir.z * 2.75,
      );
      spike.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir);
    });
    return group;
  }
  function makeCloudWorld() {
    const group = new T.Group();
    scene.add(group);
    for (let i = 0; i < 4; i++) {
      part(group, new T.BoxGeometry(0.7, 2.1, 0.7), darkMetal, -2.8, -1.2 + i * 1.05, 0);
      part(group, new T.BoxGeometry(0.48, 0.05, 0.75), blueGlow, -2.8, -0.45 + i * 1.05, 0.05);
    }
    const nodes = [
      [-0.5, 0.5, 0],
      [1.0, 1.25, -0.4],
      [2.35, 0.05, 0.25],
      [0.9, -1.15, 0.2],
    ];
    nodes.forEach(([x, y, z], i) => {
      part(group, new T.SphereGeometry(0.48, 24, 16), i === 0 ? goldGlow : blueGlow, x, y, z);
      const ring = part(group, new T.TorusGeometry(0.72 + i * 0.08, 0.014, 6, 48), blueGlow, x, y, z);
      ring.rotation.x = 1.35;
    });
    const wave = part(group, new T.TorusGeometry(3.4, 0.018, 8, 96), greenGlow, 0, 0, 0);
    wave.rotation.x = 1.42;
    group.userData.wave = wave;
    nodes.forEach(([x, y, z], i) => addFlow(group, new T.Vector3(-2.8, 0, 0),
      new T.Vector3(x, y, z), i % 2 ? greenGlow : goldGlow, 5, i));
    return group;
  }
  function makeAwardWorld() {
    const group = new T.Group();
    scene.add(group);
    const gate = part(group, new T.TorusGeometry(2.7, 0.07, 12, 100), goldGlow, 0, 0.45, 0);
    gate.rotation.y = 0.2;
    part(group, new T.CylinderGeometry(0.45, 0.7, 2.2, 6), gold, 0, -1.1, 0);
    part(group, new T.ConeGeometry(1.1, 1.5, 5), goldGlow, 0, 0.45, 0.2).rotation.z = Math.PI;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      part(
        group,
        new T.BoxGeometry(0.08, 2.4, 0.08),
        goldGlow,
        Math.cos(angle) * 2.1,
        Math.sin(angle) * 2.1 + 0.45,
        0,
      ).rotation.z = angle;
    }
    group.userData.gate = gate;
    return group;
  }
  function makeNextWorld() {
    const group = new T.Group();
    scene.add(group);
    const core = part(
      group,
      new T.IcosahedronGeometry(0.72, 2),
      new T.MeshBasicMaterial({ color: 0xf4d397 }),
      0,
      0.2,
      0,
    );
    const rings = [1.8, 2.75, 3.7].map((radius, index) => {
      const ringMaterial = new T.MeshBasicMaterial({
        color: [0xe6b95b, 0x7fb3ff, 0x8fd7a1][index],
        transparent: true,
        opacity: 0.65 - index * 0.12,
      });
      const halo = part(
        group,
        new T.TorusGeometry(radius, 0.028 - index * 0.004, 8, 120),
        ringMaterial,
        0,
        0.2,
        0,
      );
      halo.rotation.set(1.15 + index * 0.2, index * 0.25, index * 0.18);
      return halo;
    });
    const nodes = [];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const radius = 4.6 + (i % 3) * 0.42;
      nodes.push(
        part(
          group,
          new T.SphereGeometry(i % 3 === 0 ? 0.085 : 0.045, 10, 8),
          [goldGlow, blueGlow, greenGlow][i % 3],
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.58 + 0.2,
          Math.sin(angle * 2) * 0.7,
        ),
      );
    }
    group.userData.core = core;
    group.userData.rings = rings;
    group.userData.nodes = nodes;
    return group;
  }
  const originGlobe = makeOriginGlobe();
  const originAnchor = latLonPoint(23.92, 90.72, 1).normalize();
  const originAlignment = new T.Quaternion().setFromEuler(new T.Euler(
    23.92 * Math.PI / 180, -Math.atan2(originAnchor.x, originAnchor.z), 0, "XYZ",
  ));
  const originFront = new T.Vector3(0, 0, 1);
  const originFacing = new T.Vector3();
  const launchOrientation = earth.quaternion.clone();
  const originOrientation = new T.Quaternion();
  const originSpin = new T.Quaternion();
  const fpsWorld = makeFpsWorld();
  const botWorld = makeBotWorld();
  const nasaWorld = makeNasaWorld();
  const bontonWorld = makeBontonWorld();
  const coronaWorld = makeCoronaWorld();
  const cloudWorld = makeCloudWorld();
  const edgeWorld = makeEdgeWorld();
  const awardWorld = makeAwardWorld();
  const freedomWorld = makeMessageWorld(false);
  const pipelineWorld = makeMessageWorld(true);
  const nextWorld = makeNextWorld();
  function loadCoronaModel() {
    const Loader = window.LIFE_GLTFLoader;
    if (!Loader || coronaWorld.userData.modelLoaded) return;
    coronaWorld.userData.modelLoaded = true;
    const fallback = [...coronaWorld.children];
    new Loader().load(
      "/life/assets/corona_virus_3d_model.glb",
      (gltf) => {
        const model = gltf.scene;
        const box = new T.Box3().setFromObject(model);
        const size = box.getSize(new T.Vector3());
        const center = box.getCenter(new T.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        model.position.sub(center);
        model.scale.setScalar(5.3 / maxDimension);
        model.rotation.set(0.18, -0.45, 0.08);
        model.traverse((object) => {
          if (object.isMesh) {
            object.castShadow = false;
            object.receiveShadow = false;
            if (object.material) object.material.needsUpdate = true;
          }
        });
        fallback.forEach((child) => {
          child.visible = false;
        });
        coronaWorld.add(model);
        coronaWorld.userData.realModel = model;
        canvas.dataset.coronaModel = "loaded";
        draw();
      },
      undefined,
      () => {
        fallback.forEach((child) => {
          child.visible = true;
        });
        canvas.dataset.coronaModel = "fallback";
      },
    );
  }
  addEventListener("life:gltf-loader-ready", loadCoronaModel);
  loadCoronaModel();
  const blenderScenes = [
    [bontonWorld, "bonton-router"],
    [cloudWorld, "multicloud"],
    [edgeWorld, "wavelength"],
    [freedomWorld, "freedom2hear"],
    [pipelineWorld, "message-pipeline"],
  ];
  function loadBlenderModels() {
    const Loader = window.LIFE_GLTFLoader;
    if (!Loader) return;
    blenderScenes.forEach(([world, name]) => {
      if (world.userData.blenderRequested) return;
      world.userData.blenderRequested = true;
      const fallback = world.children.filter(child => !child.userData.flowVisual);
      new Loader().load("/life/assets/blender/" + name + ".glb", (gltf) => {
        fallback.forEach(child => { child.visible = false; });
        world.add(gltf.scene);
        const key = new T.PointLight(0xdcecff, 65, 18, 2);
        key.position.set(-3, 5, 5);
        world.add(key);
        const rim = new T.PointLight(0xffbc7b, 35, 14, 2);
        rim.position.set(3, 2, -3);
        world.add(rim);
        world.userData.blenderModel = gltf.scene;
        canvas.setAttribute("data-model-" + name, "loaded");
        draw();
      }, undefined, () => {
        canvas.setAttribute("data-model-" + name, "fallback");
      });
    });
  }
  addEventListener("life:gltf-loader-ready", loadBlenderModels);
  loadBlenderModels();
  [moon, redPlanet, station, giant, icePlanet, frontier].forEach((world) => {
    world.visible = false;
  });

  const worlds = [
    earthGroup,
    earthGroup,
    fpsWorld,
    botWorld,
    nasaWorld,
    bontonWorld,
    coronaWorld,
    cloudWorld,
    edgeWorld,
    awardWorld,
    freedomWorld,
    pipelineWorld,
    nextWorld,
  ];
  const centers = [
    [7, 0, 0],
    [7, 0, 0],
    [22, -5, -205],
    [-20, 8, -320],
    [24, -5, -445],
    [-18, 7, -570],
    [23, -6, -700],
    [-16, 6, -840],
    [24, -4, -910],
    [20, 0, -980],
    [-18, 6, -1120],
    [22, -4, -1260],
    [4, 1, -1405],
  ].map((point) => new T.Vector3(...point));
  worlds.forEach((world, i) => world.position.copy(centers[i]));
  const distances = [16, 15, 18, 23, 22, 22, 24, 20, 23, 25, 23, 23, 24];
  const arrivals = centers.map((center, i) =>
    center
      .clone()
      .add(new T.Vector3(i === 6 || i === 9 ? -10 : -7, 1, distances[i])),
  );
  const routes = arrivals.slice(1).map(
    (arrival, i) =>
      new T.CubicBezierCurve3(
        arrivals[i]
          .clone()
          .sub(centers[i])
          .applyAxisAngle(new T.Vector3(0, 1, 0), -0.18)
          .add(centers[i]),
        centers[i].clone().add(new T.Vector3(-12, 4, -28)),
        centers[i + 1].clone().add(new T.Vector3(-2, 5, 54)),
        arrival,
      ),
  );
  const destinationNames = [
    "EARTH / LAUNCH",
    "GLOBE / NARSINGDI",
    "FPS WORLD / 2017",
    "CHATBOT / 2019",
    "NASA SPACE APPS / 2019",
    "BONTON CONNECT / 2019",
    "PANDEMIC SHIFT / 2020",
    "MULTI-CLOUD / 2021",
    "AWS WAVELENGTH / 2021",
    "AWARD GATE / 2022",
    "FREEDOM2HEAR / 2023–2026",
    "MESSAGE PIPELINE / 2023–2026",
    "NEXT / CONTINUE THE STORY",
  ];
  const flightLabel = document.createElement("div");
  flightLabel.className = "flight-label";
  flightLabel.setAttribute("aria-hidden", "true");
  document.body.append(flightLabel);
  const fill = new T.PointLight(0xb2c5d4, 10, 12, 2);
  fill.position.set(-2, 2, 0);
  camera.add(fill);
  const lookDirection = new T.Vector3();
  const lookTarget = new T.Vector3();
  const destinationDirection = new T.Vector3();
  const orbitalForward = new T.Vector3();
  const orbitAxis = new T.Vector3(0, 1, 0);
  const forward = new T.Vector3(0, -0.025, -1).normalize();
  const smooth = (value) => value * value * (3 - 2 * value);
  let time = 0,
    last = 0,
    frame = 0,
    current = progress;
  let pointerX = 0,
    pointerY = 0;
  addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "mouse" && !paused) {
        pointerX = (event.clientX / innerWidth - 0.5) * 0.2;
        pointerY = (event.clientY / innerHeight - 0.5) * 0.1;
      }
    },
    { passive: true },
  );
  function render(now = performance.now()) {
    frame = 0;
    if (document.hidden) return;
    const delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!paused) time += delta;
    current = paused
      ? progress
      : current + (progress - current) * (1 - Math.exp(-delta * 7));
    const mobile = innerWidth < 600;
    const segment = Math.min(routes.length - 1, Math.floor(current));
    const fraction = Math.min(1, current - segment);
    const transit = Math.sin(Math.PI * fraction);
    const route = routes[segment];
    route.getPoint(smooth(fraction), camera.position);
    route.getTangent(smooth(fraction), lookDirection);
    // Ease into a forward-facing orbital view at both ends of every leg.
    orbitalForward.copy(forward).applyAxisAngle(orbitAxis, -.18 * (1-smooth(fraction)));
    lookDirection.lerp(orbitalForward, 1 - Math.pow(transit, 0.7)).normalize();
    destinationDirection
      .copy(centers[segment + 1])
      .sub(camera.position)
      .normalize();
    lookDirection
      .lerp(destinationDirection, Math.pow(transit, 0.7) * 0.92)
      .normalize();
    if (Number.isInteger(progress) && Math.abs(current - progress) < 0.002) {
      const stop = Math.round(progress);
      const angle = -0.18 * smooth(orbitProgress);
      camera.position
        .copy(arrivals[stop])
        .sub(centers[stop])
        .applyAxisAngle(orbitAxis, angle)
        .add(centers[stop]);
      lookDirection.copy(forward).applyAxisAngle(orbitAxis, angle);
    }
    if (mobile) {
      camera.position.x += (1 - transit) * 2;
      camera.position.y += (1 - transit) * 3;
      if ([3, 4, 5, 7, 8, 10, 11].includes(Math.round(current))) {
        camera.position.x += (1 - transit) * 5;
        camera.position.y += (1 - transit) * 3;
        camera.position.z += (1 - transit) * (Math.round(current) === 3 ? 0 : 10);
      }
    }
    // Launch and Origin share one globe; the first leg is a local camera move.
    if (current < 1) {
      camera.position.lerpVectors(arrivals[0], arrivals[1], smooth(current));
      lookDirection.copy(forward);
      if (mobile) {
        camera.position.x += 2;
        camera.position.y += 3;
      }
    }
    if (mobile && current < 2) {
      const originFrame = current < 1 ? smooth(current) : 1 - smooth(current - 1);
      camera.position.x += 5 * originFrame;
      camera.position.y += 3 * originFrame;
      camera.position.z += 8 * originFrame;
    }
    if (!paused) {
      camera.position.x += pointerX;
      camera.position.y -= pointerY;
    }
    lookTarget.copy(camera.position).add(lookDirection);
    camera.up.set(Math.sin(fraction * Math.PI * 2) * 0.035, 1, 0);
    camera.lookAt(lookTarget);
    camera.fov = (mobile ? 57 : 46) + transit * 10;
    camera.updateProjectionMatrix();
    const originProgress = smooth(Math.min(1, Math.max(0, current)));
    originFacing.copy(camera.position).sub(earthGroup.position).normalize();
    originOrientation.setFromUnitVectors(originFront, originFacing).multiply(originAlignment);
    earth.quaternion.copy(launchOrientation).slerp(originOrientation, originProgress);
    originSpin.setFromAxisAngle(orbitAxis, media.matches ? 0 : Math.PI * 2 * originProgress);
    earth.quaternion.multiply(originSpin);
    earth.scale.setScalar(1 + originProgress * 0.2);
    atmosphere.scale.copy(earth.scale);
    const reveal = smooth(Math.max(0, Math.min(1, (originProgress - 0.8) / 0.2)));
    const pulse = media.matches ? 0.5 : (Math.sin(time * Math.PI * 2 / 3.6) + 1) / 2;
    originGlobe.visible = reveal > 0;
    originGlobe.userData.marker.scale.setScalar(1 + pulse * 0.25);
    originGlobe.userData.highlight.opacity = reveal * (0.65 + pulse * 0.35);
    if (originGlobe.userData.borderMaterial) originGlobe.userData.borderMaterial.opacity = reveal;
    atmosphere.visible = camera.position.distanceTo(centers[0]) < 100;
    fpsWorld.rotation.y = -0.18 + Math.sin(time * 0.55) * 0.045;
    fpsWorld.userData.crosshair.rotation.z = time * 0.24;
    if (fpsWorld.userData.video && fpsWorld.userData.videoMaterial) {
      const video = fpsWorld.userData.video;
      const material = fpsWorld.userData.videoMaterial;
      if (
        canvas.dataset.hitRunVideo === "loaded" &&
        Number.isFinite(video.duration) &&
        video.duration > 1
      ) {
        const shouldPlayVideo = !paused && Math.abs(current - 2) < 1.15;
        if (shouldPlayVideo && video.paused) {
          video.play().catch(() => {
            canvas.dataset.hitRunVideo = "blocked";
          });
        } else if (!shouldPlayVideo && !video.paused) {
          video.pause();
        }
        const fadeWindow = 0.9;
        const remaining = video.duration - video.currentTime;
        if (
          shouldPlayVideo &&
          remaining < 0.08 &&
          !fpsWorld.userData.refreshingVideo
        ) {
          fpsWorld.userData.refreshingVideo = true;
          material.opacity = 0.12;
          video.currentTime = 0;
          video.play().catch(() => {
            canvas.dataset.hitRunVideo = "blocked";
          });
          setTimeout(() => {
            fpsWorld.userData.refreshingVideo = false;
          }, 350);
        } else {
          const fadeIn = Math.min(1, video.currentTime / fadeWindow);
          const fadeOut = Math.min(1, Math.max(0, remaining / fadeWindow));
          material.opacity = Math.max(0.12, Math.min(fadeIn, fadeOut));
        }
      } else if (canvas.dataset.hitRunVideo === "blocked") {
        material.map = null;
        material.color.setHex(0x111b23);
        material.opacity = 0.78;
      }
    }
    botWorld.rotation.y = -0.06 + Math.sin(time * 0.42) * 0.01;
    updateVideoPanel(botWorld, 3);
    nasaWorld.rotation.y = time * 0.012;
    nasaWorld.userData.planets.forEach(({ planet, radius, speed, phase }) => {
      planet.position.set(Math.cos(time * speed + phase) * radius, 0,
        Math.sin(time * speed + phase) * radius);
    });
    [bontonWorld, cloudWorld, edgeWorld, freedomWorld, pipelineWorld].forEach((world) => {
      world.userData.flows.forEach(({ curve, packet, phase }) => {
        const progress = (time * 0.18 + phase + (world === pipelineWorld ? Math.sin(time * 0.7 + phase) * 0.07 : 0)) % 1;
        packet.position.copy(curve.getPoint((progress + 1) % 1));
      });
    });
    [freedomWorld, pipelineWorld].forEach((world) => {
      world.rotation.y = -0.2 + Math.sin(time * 0.3) * 0.04;
      world.userData.ring.rotation.y = time * 0.2;
    });
    nextWorld.rotation.y = Math.sin(time * 0.22) * 0.08;
    nextWorld.userData.core.rotation.set(time * 0.16, time * 0.24, time * 0.1);
    nextWorld.userData.core.scale.setScalar(1 + Math.sin(time * 1.1) * 0.08);
    nextWorld.userData.rings.forEach((halo, index) => {
      halo.rotation.z += delta * (index % 2 ? -0.08 : 0.06);
    });
    nextWorld.userData.nodes.forEach((node, index) => {
      node.scale.setScalar(0.8 + (Math.sin(time * 1.3 + index) + 1) * 0.22);
    });
    nasaWorld.userData.orbit.rotation.z = time * 0.18;
    nasaWorld.userData.satellite.rotation.z = time * 0.32;
    bontonWorld.rotation.y = -0.25 + Math.sin(time * 0.4) * 0.04;
    bontonWorld.userData.tunnel.rotation.z = time * 0.08;
    coronaWorld.rotation.y = time * 0.02;
    if (coronaWorld.userData.realModel) {
      coronaWorld.userData.realModel.rotation.y = -0.45 + time * 0.06;
    }
    cloudWorld.rotation.y = -0.3 + Math.sin(time * 0.28) * 0.05;
    cloudWorld.userData.wave.scale.setScalar(1 + Math.sin(time * 1.4) * 0.04);
    awardWorld.rotation.y = 0.2 + Math.sin(time * 0.35) * 0.04;
    awardWorld.userData.gate.rotation.z = time * 0.018;
    ship.position.copy(centers[0]).add(new T.Vector3(-2, -3, 7));
    ship.scale.setScalar(0.5);
    ship.rotation.set(0.5, 0.3, -0.3);
    beacon.material.color.setHex(transit > 0.15 ? 0xa2c9b3 : 0xe1b478);
    document.body.style.setProperty("--in-flight", transit.toFixed(3));
    flightLabel.style.opacity = transit > 0.15 ? Math.min(1, transit * 2) : 0;
    flightLabel.textContent = `IN TRANSIT  /  ${destinationNames[segment + 1]}`;
    canvas.dataset.flightPosition = current.toFixed(3);
    renderer.render(scene, camera);
    if (!paused) frame = requestAnimationFrame(render);
  }
  draw = () => {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  };
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    draw();
  }
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      last = performance.now();
      draw();
    }
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    cancelAnimationFrame(frame);
    frame = 0;
    document.body.classList.remove("scene-ready");
    motionButton.hidden = true;
  });
  canvas.addEventListener("webglcontextrestored", () => {
    document.body.classList.add("scene-ready");
    motionButton.hidden = false;
    draw();
  });
  resize();
  document.body.classList.add("scene-ready");
  draw();
})();
