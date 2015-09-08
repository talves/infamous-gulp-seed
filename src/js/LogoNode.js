/* LogoNode
   ES6 class
*/

import { Node } from 'infamous-engine/src/core/Node';
import { DOMElement } from 'infamous-engine/src/dom-renderables/DOMElement';
import { SpinnerAnimation as Spinner } from './animation/SpinnerAnimation';
import { LogoDot } from './LogoDot';
import { LogoPeg } from './LogoPeg';

export class LogoNode extends Node {

  constructor(node) {
    super();
    //console.log('logonode', this);
    // create local node onto the passed scene/node
    this.rootNode = node.addChild(this);

    // Create an [image] DOM element providing the logo 'node' with the 'src' path
    new DOMElement(this.rootNode, {
      tagName: 'div'
    })
      //.setAttribute('src', '../images/favicons/favicon-196x196.png')
      .setProperty('background-color', 'white')
      .setProperty('border-radius', '98px');

    // Chainable API
    this.rootNode
      // Set size mode to 'absolute' to use absolute pixel values: (width 250px, height 250px)
      .setSizeMode('absolute', 'absolute', 'absolute')
      .setAbsoluteSize(200, 200, 0)
      // Center the 'node' to the parent (the screen, in this instance)
      .setAlign(0.5, 0.5, 0)
      // Set the rotational origin to the center of the 'node'
      .setOrigin(0.5, 0.5, 0)
      // Set the translational origin to the center of the 'node'
      .setMountPoint(0.5, 0.5, 0);

    // add the Dot & peg of the logo
    this.logoDot = new LogoDot(this.rootNode);
    this.logoPeg = new LogoPeg(this.rootNode);

    // Setup a custom component for animation
    this.dotAnimation = new Spinner(this.logoDot, {
      axis: Spinner.XAXIS,
      duration: 4000
    });
    this.pegAnimation = new Spinner(this.logoPeg, {
      axis: Spinner.YAXIS,
      duration: 4000
    });
    this.animation = new Spinner(this.rootNode, {
      axis: Spinner.ZAXIS,
      duration: 10000
    });

  }
  start() {
    // Let the magic begin...
    this.animation.start();
    this.pegAnimation.start();
    this.dotAnimation.start();
  }
}
