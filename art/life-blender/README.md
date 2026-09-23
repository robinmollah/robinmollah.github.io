# Timeline Blender Models

Editable scenes and preview renders for Bonton, multi-cloud, AWS Wavelength,
Freedom2Hear, and the message pipeline. These are conceptual illustrations,
not replicas of deployed hardware or exact production architecture.

Rebuild with Blender 5.1:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --python tools/build-life-models.py
```

The generator writes editable scenes and renders here, and exports GLBs to
`source/life/assets/blender/`. Only the GLBs are published by Hexo.
The website retains its animated packet paths and falls back to procedural
geometry if an asset fails to load.
