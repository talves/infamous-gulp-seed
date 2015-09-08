// Famous dependencies
import { FamousEngine } from 'infamous-engine/src/core/FamousEngine';
import { Camera } from 'infamous-engine/src/components/Camera';
import { LogoNode as Logo } from './js/LogoNode';

// Boilerplate code to make your life easier
var w = window.innerWidth;
var h = window.innerHeight;
// Create a scene for the FamousEngine to render
var scene = FamousEngine.createScene();
var nextNode = scene.addChild();
nextNode
  .setSizeMode('absolute', 'absolute', 'absolute')
  .setAbsoluteSize(w, h, h)
  .setAlign(0.5, 0.5, 0)
  .setOrigin(0, 0, 0)
  .setMountPoint(0.5, 0.5, 0);
var camera = new Camera(nextNode);
camera.setDepth(1000);

FamousEngine.init();
var clock = FamousEngine.getClock();

// Get a node of the Famous Logo
var logo = new Logo(nextNode);
console.log('logonode', logo);
let _start = () => {
  logo.start();
}

clock.setTimeout(_start, 2000);
