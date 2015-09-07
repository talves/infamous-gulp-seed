/* SpinnerAnimation
    ES6 class
*/
import { Transitionable } from 'infamous-engine/src/transitions/Transitionable';

export class SpinnerAnimation {
  constructor(node, options) {
    // setup the options
    if (!options)
      options = {};
    this.axis = options.axis || this.YAXIS;
    this.duration = options.duration || 10000;
    // store a reference to the node
    this.node = node;
    // get an id from the node so that we can update
    this.id = node.addComponent(this);
    // Transitionable Rotation values
    this.transition = new Transitionable();
    var startAngle = Math.PI * 2 / this.duration;
    this.rotateAngle = () => {
      this.transition.from(startAngle).set(Math.PI * 2, {
        duration: this.duration
      }, this.rotateAngle);
    }

    return this.id;
  }
  onUpdate(time) {
    var x = 0;
    var y = 0;
    var z = 0;
    // set the axis values
    switch (this.axis) {
      case this.XAXIS:
        x = this.transition.get();
        break;
      case this.ZAXIS:
        z = this.transition.get();
        break;
      default:
        y = this.transition.get();
        break;
    }
    // set a rotation based on time
    this.node.setRotation(x, y, z);
    // request the update on the next frame
    this.node.requestUpdateOnNextTick(this.id);
  }
  start() {
    // Let the magic begin...
    this.node.requestUpdate(this.id);
    this.rotateAngle();
  }
}

SpinnerAnimation.XAXIS = 0;
SpinnerAnimation.YAXIS = 1;
SpinnerAnimation.ZAXIS = 2;
