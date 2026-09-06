# Career Space Mission

Standalone Hexo page at `source/life/index.html`, emitted at `/life/` through the existing `skip_render` convention. No framework or deployment changes.

Career descriptions and project outcomes are grounded in `source/work.html` and `source/index.html`. Employment dates were supplied by Robin: Bonton Connect (December 2019-June 2020), Eagle 3D Streaming (July 2020-March 2022), GoBubble (March 2022-June 2026). A resume file was not supplied; both resume links explicitly request it by email.

Native section anchors and details elements keep content readable without JavaScript. WebGL failure keeps a static image background. Reduced motion and the pause control stop continuous scene rendering; rendering also suspends when the document is hidden.

The cinematic scene uses fixed world positions and six cubic camera flight paths. Each chapter begins with a scroll-controlled departure/transit/arrival interval, followed by a slow orbital camera move as its content is read. Scrolling backward reverses the same path. Chapter navigation travels to the reading position through native anchor scrolling. Reduced-motion and WebGL fallback layouts omit the extended flight intervals.

Destinations: Earth, Moon, red planet, orbital computing station, gas giant, ice world, and a ringed frontier. Planet surfaces use local Earth/Moon imagery and procedural gas bands. Distant scene geometry fades out to keep each destination visually distinct.

## Scene assets

- `source/life/assets/earth.jpg`: Earth surface texture from the Three.js examples, https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg.
- `source/life/assets/moon.jpg`: Moon texture from https://raw.githubusercontent.com/mrdoob/three.js/r160/examples/textures/planets/moon_1024.jpg; also used as a tinted surface on the fictional rocky worlds.
- `source/life/vendor/three.min.js`: Three.js 0.160.0, the same version used on the existing site. MIT license is included in `source/life/vendor/LICENSE`.

The scene uses local assets and does not require a runtime CDN request. All spacecraft and station geometry is constructed in `mission.js`.
