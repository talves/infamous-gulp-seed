/* LogoDot
   ES6 class
*/

import { Node } from 'infamous-engine/src/core/Node';
import { DOMElement } from 'infamous-engine/src/dom-renderables/DOMElement';

export class LogoDot extends Node {

  constructor(node) {
    super();
    //console.log('LogoDot', this);
    // create local node onto the passed scene/node
    this.rootNode = node.addChild(this);

    // Create an [image] DOM element providing the logo 'node' with the 'src' path
    new DOMElement(this.rootNode, {
      tagName: 'div'
    })
      .setProperty('background-color', '#4F4F4F')
      .setProperty('border-radius', '15px');

    // Chainable API
    this.rootNode
      // Set size mode to 'absolute' to use absolute pixel values: (width 250px, height 250px)
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(30, 30, 0)
      // Center the 'node' to the parent (the screen, in this instance)
      .setAlign(0.5, 0.2, 0)
      // Set the rotational origin to the center of the 'node'
      .setOrigin(0.5, 0.5, 0)
      // Set the translational origin to the center of the 'node'
      .setMountPoint(0.5, 0.5, 0)
      .setPosition(0, 0, 20);

  }
}
