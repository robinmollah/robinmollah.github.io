import { GLTFLoader } from "./examples/jsm/loaders/GLTFLoader.js";

window.LIFE_GLTFLoader = GLTFLoader;
window.dispatchEvent(new CustomEvent("life:gltf-loader-ready"));
