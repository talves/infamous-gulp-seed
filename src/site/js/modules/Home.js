import { PointLight } from 'infamous-engine/src/webgl-renderables/lights/PointLight';
import { FamousEngine } from 'infamous-engine/src/core/FamousEngine';
import { Camera } from 'infamous-engine/src/components/Camera';
import { Color } from 'infamous-engine/src/utilities/Color';
import { Transitionable } from 'infamous-engine/src/transitions/Transitionable';
import { Vec3 } from 'infamous-engine/src/math/Vec3';
import { DOMElement } from 'infamous-engine/src/dom-renderables/DOMElement';
import { PhysicsEngine } from 'infamous-engine/src/physics/PhysicsEngine';
import { MountPoint } from 'infamous-engine/src/components/MountPoint';
import { Sphere } from 'infamous-engine/src/physics/bodies/Sphere';
import { Mesh } from 'infamous-engine/src/webgl-renderables/Mesh';
import { Node } from 'infamous-engine/src/core/Node';


class ExplodingTriangles {
  constructor(rootNode, amount) {
    this.rootNode = rootNode;
    this.nodes = {};
    this.children = amount;
    this.simulation = new PhysicsEngine();
    this.tDuration = 2000;

    var self = this;

    this.graphNode = this.rootNode.addChild();

    this.graphNode.addComponent({
      id: null,
      node: null,
      onMount: function(node) {
        this.id = node.addComponent(this);
        node.requestUpdate(this.id);
        this.scalar = 72;
        this.node = node;

      },
      onUpdate: function(time) {

        var spherePosition;

        if (self.nodes) {

          for (let prop in self.nodes) {


            self.nodes[prop].node.setAlign(self.nodes[prop].t.transform.get()[0], self.nodes[prop].t.transform.get()[1], self.nodes[prop].t.transform.get()[2]);
            self.nodes[prop].node.setOpacity(self.nodes[prop].t.opacity.get());


            spherePosition = self.nodes[prop].sphere.getPosition();

            if (spherePosition.x > window.innerWidth + 150) {
              self.nodes[prop].sphere.setVelocity(-1 * this.scalar, 0);
            }

            if (spherePosition.x > window.innerWidth + 150 && spherePosition.y > window.innerHeight + 150) {
              self.nodes[prop].sphere.setVelocity(-1 * this.scalar, -1 * this.scalar);
            }

            if (spherePosition.x < -150) {
              self.nodes[prop].sphere.setVelocity(this.scalar);
            }

            if (spherePosition.y < -150) {
              self.nodes[prop].sphere.setVelocity(this.scalar, this.scalar);
            }

            self.nodes[prop].node.setPosition(spherePosition.x, spherePosition.y);
          }

          // Update simulation with time to progress forward
          self.simulation.update(time);
        }
        // Request an update on the next tick of the Engine.
        this.node.requestUpdateOnNextTick(this.id);
      }
    });

    this.createGraph(24, 24);

  }

  createGraph(row, col) {
    var self = this;
    var node, elem, sphere, top, left, z, color, line, lineNode, hoverColor, rotate, lastId;

    for (var x = 0; x < col; x++) {
      for (var y = 0; y < row; y++) {

        left = x * (1.25 / col) - 0.1;
        top = y * (1.25 / row) - 0.1;
        z = (Math.random() * 0.25) + 0.1;
        rotate = {
          x: Math.random() * 360,
          y: Math.random() * 360,
          z: Math.random() * 360
        };

        node = this.rootNode.addChild()
          .setOrigin(0.5, 0.5, 0.5)
          .setMountPoint(0.5, 0.5, 0.5)
          .setAlign(left, top, z)
          .setSizeMode(1, 1, 1)
          .setRotation(rotate.x, rotate.y, rotate.z)
          .setAbsoluteSize(100, 100)
          .setOpacity(z);
        sphere = new Sphere({
          mass: 50,
          radius: 100,
          position: new Vec3(left, top)
        });
        color = 'rgba(' + (255 - Math.floor(Math.random() * 255) + 190) + ',' + (255 - Math.floor(Math.random() * 255) + 150) + ',' + (255 - Math.floor(Math.random() * 255) + 150) + ',' + (z - 0.2) + ')';

        elem = new DOMElement(node, {
          classes: ['tri']
        });
        elem.setProperty('border-top', '100px solid ' + color);
        //elem.setProperty('border-radius', '50px');
        //elem.setProperty('background-color',color);


        node.addUIEvent('click');
        node.addUIEvent('mousemove');
        node.addUIEvent('mouseleave');
        node.addUIEvent('touchmove');
        node.addUIEvent('touchend');

        node.onReceive = function(event, payload) {


          if (event === 'mousemove' || event === 'touchmove') {

            var deltaX = self.nodes[payload.node._id].hit.x - payload.x,
              deltaY = self.nodes[payload.node._id].hit.y - payload.y;

            if (deltaX < 20 && deltaX > -20 && deltaY < 20 && deltaY > -20) {
              self.nodes[payload.node._id].sphere.setVelocity(deltaX * -36, deltaY * -36);
            }
            self.nodes[payload.node._id].hit = {
              x: payload.x,
              y: payload.y
            };

            hoverColor = self.nodes[payload.node._id].color.split(',');
            //console.log(parseFloat(hoverColor[3].substring(0, hoverColor[3].length - 2))+0.3);
            hoverColor = hoverColor[0] + ',' + hoverColor[1] + ',' + hoverColor[2] + ',' + (parseFloat(hoverColor[3].substring(0, hoverColor[3].length - 2)) + 0.5) + ')';

            self.nodes[payload.node._id].elem.setProperty('border-top', '100px solid ' + hoverColor);
            //self.nodes[payload.node._id].elem.setProperty('background',hoverColor);

          }
          if (event === 'mouseleave' || event === 'touchend') {
            //self.nodes[payload.node._id].elem.setProperty('background',self.nodes[payload.node._id].color);
            self.nodes[payload.node._id].elem.setProperty('border-top', '100px solid ' + self.nodes[payload.node._id].color);
          }

        };

        this.nodes[node._id] = ({
          node: node,
          sphere: sphere,
          hit: {
            x: left,
            y: top
          },
          elem: elem,
          color: color,
          opacity: z,
          position: {
            x: left,
            y: top,
            z: z
          },
          t: {
            transform: new Transitionable([-3.0, 0, 0]),
            opacity: new Transitionable(0.0)
          }
        });

        this.nodes[node._id].t.opacity.from(0.0).to(self.nodes[node._id].opacity, 'outCubic', 1600);
        this.nodes[node._id].t.transform.from([-3.0, 0.5, 0.5]).to([self.nodes[node._id].position.x,
          self.nodes[node._id].position.y,
          self.nodes[node._id].position.z],
          'outExpo',
          this.tDuration);

        this.nodes[node._id].sphere.setVelocity(4, 0);
        this.simulation.addBody(this.nodes[node._id].sphere);
        lastId = node._id;

      }
    }
  }

}


class _Home {
  constructor(rootNode) {

    this.items = [];

    this.rootNode = rootNode;


    this.cameraNode = this.rootNode.addChild();

    this.camera = new Camera(this.cameraNode)
      .setDepth(1000);


    // Save reference to our Famous clock
    this.clock = FamousEngine.getClock();
    // Create the header
    // this.header = {};
    // this.header.node = this.rootNode.addChild()
    //     .setOrigin(0.0, 0.0, 0.0)
    //     .setMountPoint(0.0, 0.0, 0.0)
    //     .setAlign(0.0, -1.0, 0.0)
    //     .setSizeMode(0, 1, 0)
    //     .setAbsoluteSize(window.innerWidth, 40)
    //     .setProportionalSize(1.0, 40)
    //     .setOpacity(0.5);
    // this.header.elem = new DOMElement(this.header.node);
    // this.header.elem.setProperty('background-color', 'rgba(71,53,79,0.8)');
    // this.header.elem.setContent('');
    //
    // this.header.t = new Transitionable([0, -1.0, 0]);
    // this.header.t.from([0, -1.0, 0]).to([0, 0.0, 0], 'linear', 2000);


    // Create the main title
    this.title = {};
    this.title.node = this.rootNode.addChild()
      .setOrigin(0.5, 0.5, 0.5)
      .setMountPoint(0.5, 0.5, 0.5)
      .setAlign(0.5, 0.5, -5.0)
      .setSizeMode(0, 0, 0)
      .setProportionalSize(0.5, 0.2);
    this.title.elem = new DOMElement(this.title.node, {
      classes: ['splash-title']
    });
    this.title.elem.setContent('<h1>Infamous</h1><h3>Fork of Famo.us Engine and Framework developed by the open source community.</h3>');
    this.title.elem.setProperty('background-color', 'transparent');
    this.title.elem.setProperty('user-select', 'none');
    this.title.elem.setProperty('-webkit-user-select', 'none');
    this.title.elem.setProperty('-ms-user-select', 'none');
    this.title.elem.setProperty('-moz-user-select', 'none');

    //setup transitionables for the title

    this.title.t = {};

    this.title.t.fade = new Transitionable(0.0);
    this.title.t.fade.from(0.0).to(1.0, 'inQuad', 1200);

    this.title.t.transformIn = new Transitionable([0.5, 0.5, -0.6]);
    this.title.t.transformIn.from([0.5, 0.5, -5.0]).to([0.5, 0.4, 0.5], 'outQuad', 1200);

    // Create the footer


    this.footer = {};

    this.footer.node = this.rootNode.addChild()
      .setOrigin(0.0, 1.0, 0.0)
      .setMountPoint(0.0, 1.0, 0.0)
      .setAlign(0.0, 2.0, 0.0)
      .setSizeMode(0, 1)
      .setAbsoluteSize(window.innerWidth, 40)
      .setProportionalSize(1.0, 40)
      .setOpacity(1.0);


    this.footer.engineButton = {};
    this.footer.engineButton.node = this.footer.node.addChild()
      .setOrigin(0.0, 0.0, 0.0)
      .setMountPoint(0.0, 0.0, 0.0)
      .setAlign(0.0, 0.0, 0.0)
      .setSizeMode(0, 0)
      .setProportionalSize(0.5, 1.0)
      .setOpacity(0.8);

    this.footer.engineButton.node.addUIEvent('mouseover');
    this.footer.engineButton.node.addUIEvent('mouseleave');

    this.footer.engineButton.node.onReceive = function(event, payload) {
      if (event === 'mouseover') {
        this.setOpacity(1.0);
      }
      if (event === 'mouseleave') {
        this.setOpacity(0.8);
      }
    };

    this.footer.engineButton.elem = new DOMElement(this.footer.engineButton.node, {
      classes: ['footer-link']
    });
    this.footer.engineButton.elem.setProperty('background-color', 'rgba(2,2,2,1.0)');
    this.footer.engineButton.elem.setProperty('user-select', 'none');
    this.footer.engineButton.elem.setProperty('-webkit-user-select', 'none');
    this.footer.engineButton.elem.setProperty('-ms-user-select', 'none');
    this.footer.engineButton.elem.setProperty('-moz-user-select', 'none');
    this.footer.engineButton.elem.setContent('<a href="https://github.com/infamous/engine">Engine</a>');

    this.footer.frameworkButton = {};
    this.footer.frameworkButton.node = this.footer.node.addChild()
      .setOrigin(0.0, 0.0, 0.0)
      .setMountPoint(0.0, 0.0, 0.0)
      .setAlign(0.5, 0.0, 0.0)
      .setSizeMode(0, 0)
      .setProportionalSize(0.5, 1.0)
      .setOpacity(0.8);
    this.footer.frameworkButton.elem = new DOMElement(this.footer.frameworkButton.node, {
      classes: ['footer-link']
    });
    this.footer.frameworkButton.elem.setProperty('background-color', 'rgba(2,2,2,1.0)');
    this.footer.frameworkButton.elem.setContent('<a href="https://github.com/infamous/framework">Framework</a>');
    this.footer.frameworkButton.elem.setProperty('user-select', 'none');
    this.footer.frameworkButton.elem.setProperty('-webkit-user-select', 'none');
    this.footer.frameworkButton.elem.setProperty('-ms-user-select', 'none');
    this.footer.frameworkButton.elem.setProperty('-moz-user-select', 'none');
    this.footer.frameworkButton.node.addUIEvent('mouseover');
    this.footer.frameworkButton.node.addUIEvent('mouseleave');

    this.footer.frameworkButton.node.onReceive = function(event, payload) {
      if (event === 'mouseover') {
        this.setOpacity(1.0);
      }
      if (event === 'mouseleave') {
        this.setOpacity(0.8);
      }
    };


    // Create the transitionable for the footer

    this.footer.t = new Transitionable([0, 2.0, 0]);
    this.footer.t.from([0, 2.0, 0]).to([0, 1.0, 0], 'linear', 2000);

    //Request an update from the Engine.

    FamousEngine.requestUpdateOnNextTick(this);

  }

  onUpdate(time) {
    this.title.node.setOpacity(this.title.t.fade.get());
    this.title.node.setAlign(this.title.t.transformIn.get()[0], this.title.t.transformIn.get()[1], this.title.t.transformIn.get()[2]);
    //this.header.node.setAlign(this.header.t.get()[0], this.header.t.get()[1], this.header.t.get()[2]);
    this.footer.node.setAlign(this.footer.t.get()[0], this.footer.t.get()[1], this.footer.t.get()[2]);
    FamousEngine.requestUpdateOnNextTick(this);
  }
}

export default class Home extends Node {
  constructor(node) {
    super();

    this.rootNode = node.addChild();
    var bootstrap = new _Home(this.rootNode);
    var web = new ExplodingTriangles(this.rootNode, 128);

    return this.rootNode;
  }
}
