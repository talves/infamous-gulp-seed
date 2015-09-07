import { FamousEngine } from 'infamous-engine/src/core/FamousEngine';

import Home from './js/modules/Home';

// Boilerplate code to make your life easier
FamousEngine.init();

// Create a scene for the FamousEngine to render
var scene = FamousEngine.createScene();
var nextNode = scene.addChild();

// Get a node of the Famous Logo
var home = new Home(nextNode);
console.log('home', home);
