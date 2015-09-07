(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _coreCommands = require('../core/Commands');

/**
 * Camera is a component that is responsible for sending information to the renderer about where
 * the camera is in the scene.  This allows the user to set the type of projection, the focal depth,
 * and other properties to adjust the way the scenes are rendered.
 *
 * @class Camera
 *
 * @param {Node} node to which the instance of Camera will be a component of
 */

var Camera = (function () {
  function Camera(node) {
    _classCallCheck(this, Camera);

    this._node = node;
    this._projectionType = Camera.ORTHOGRAPHIC_PROJECTION;
    this._focalDepth = 0;
    this._near = 0;
    this._far = 0;
    this._requestingUpdate = false;
    this._id = node.addComponent(this);
    this._viewTransform = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    this._viewDirty = false;
    this._perspectiveDirty = false;
    this.setFlat();
  }

  /**
   * @method
   *
   * @return {String} Name of the component
   */

  _createClass(Camera, [{
    key: 'toString',
    value: function toString() {
      return 'Camera';
    }
  }, {
    key: 'getValue',

    /**
     * Gets object containing serialized data for the component
     *
     * @method
     *
     * @return {Object} the state of the component
     */
    value: function getValue() {
      return {
        component: this.toString(),
        projectionType: this._projectionType,
        focalDepth: this._focalDepth,
        near: this._near,
        far: this._far
      };
    }
  }, {
    key: 'setValue',

    /**
     * Set the components state based on some serialized data
     *
     * @method
     *
     * @param {Object} state an object defining what the state of the component should be
     *
     * @return {Boolean} status of the set
     */
    value: function setValue(state) {
      if (this.toString() === state.component) {
        this.set(state.projectionType, state.focalDepth, state.near, state.far);
        return true;
      }
      return false;
    }
  }, {
    key: 'set',

    /**
     * Set the internals of the component
     *
     * @method
     *
     * @param {Number} type an id corresponding to the type of projection to use
     * @param {Number} depth the depth for the pinhole projection model
     * @param {Number} near the distance of the near clipping plane for a frustum projection
     * @param {Number} far the distance of the far clipping plane for a frustum projection
     *
     * @return {Boolean} status of the set
     */
    value: function set(type, depth, near, far) {
      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }
      this._projectionType = type;
      this._focalDepth = depth;
      this._near = near;
      this._far = far;
    }
  }, {
    key: 'setDepth',

    /**
     * Set the camera depth for a pinhole projection model
     *
     * @method
     *
     * @param {Number} depth the distance between the Camera and the origin
     *
     * @return {Camera} this
     */
    value: function setDepth(depth) {
      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }
      this._perspectiveDirty = true;
      this._projectionType = Camera.PINHOLE_PROJECTION;
      this._focalDepth = depth;
      this._near = 0;
      this._far = 0;

      return this;
    }
  }, {
    key: 'setFrustum',

    /**
     * Gets object containing serialized data for the component
     *
     * @method
     *
     * @param {Number} near distance from the near clipping plane to the camera
     * @param {Number} far distance from the far clipping plane to the camera
     *
     * @return {Camera} this
     */
    value: function setFrustum(near, far) {
      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }

      this._perspectiveDirty = true;
      this._projectionType = Camera.FRUSTUM_PROJECTION;
      this._focalDepth = 0;
      this._near = near;
      this._far = far;

      return this;
    }
  }, {
    key: 'setFlat',

    /**
     * Set the Camera to have orthographic projection
     *
     * @method
     *
     * @return {Camera} this
     */
    value: function setFlat() {
      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }

      this._perspectiveDirty = true;
      this._projectionType = Camera.ORTHOGRAPHIC_PROJECTION;
      this._focalDepth = 0;
      this._near = 0;
      this._far = 0;

      return this;
    }
  }, {
    key: 'onUpdate',

    /**
     * When the node this component is attached to updates, the Camera will
     * send new camera information to the Compositor to update the rendering
     * of the scene.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function onUpdate() {
      this._requestingUpdate = false;

      var path = this._node.getLocation();

      this._node.sendDrawCommand(_coreCommands.Commands.WITH).sendDrawCommand(path);

      if (this._perspectiveDirty) {
        this._perspectiveDirty = false;

        switch (this._projectionType) {
          case Camera.FRUSTUM_PROJECTION:
            this._node.sendDrawCommand(_coreCommands.Commands.FRUSTRUM_PROJECTION);
            this._node.sendDrawCommand(this._near);
            this._node.sendDrawCommand(this._far);
            break;
          case Camera.PINHOLE_PROJECTION:
            this._node.sendDrawCommand(_coreCommands.Commands.PINHOLE_PROJECTION);
            this._node.sendDrawCommand(this._focalDepth);
            break;
          case Camera.ORTHOGRAPHIC_PROJECTION:
            this._node.sendDrawCommand(_coreCommands.Commands.ORTHOGRAPHIC_PROJECTION);
            break;
        }
      }

      if (this._viewDirty) {
        this._viewDirty = false;

        this._node.sendDrawCommand(_coreCommands.Commands.CHANGE_VIEW_TRANSFORM);
        this._node.sendDrawCommand(this._viewTransform[0]);
        this._node.sendDrawCommand(this._viewTransform[1]);
        this._node.sendDrawCommand(this._viewTransform[2]);
        this._node.sendDrawCommand(this._viewTransform[3]);

        this._node.sendDrawCommand(this._viewTransform[4]);
        this._node.sendDrawCommand(this._viewTransform[5]);
        this._node.sendDrawCommand(this._viewTransform[6]);
        this._node.sendDrawCommand(this._viewTransform[7]);

        this._node.sendDrawCommand(this._viewTransform[8]);
        this._node.sendDrawCommand(this._viewTransform[9]);
        this._node.sendDrawCommand(this._viewTransform[10]);
        this._node.sendDrawCommand(this._viewTransform[11]);

        this._node.sendDrawCommand(this._viewTransform[12]);
        this._node.sendDrawCommand(this._viewTransform[13]);
        this._node.sendDrawCommand(this._viewTransform[14]);
        this._node.sendDrawCommand(this._viewTransform[15]);
      }
    }
  }, {
    key: 'onTransformChange',

    /**
     * When the transform of the node this component is attached to
     * changes, have the Camera update its projection matrix and
     * if needed, flag to node to update.
     *
     * @method
     *
     * @param {Array} transform an array denoting the transform matrix of the node
     *
     * @return {Camera} this
     */
    value: function onTransformChange(transform) {
      var a = transform;
      this._viewDirty = true;

      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }

      var a00 = a[0],
          a01 = a[1],
          a02 = a[2],
          a03 = a[3],
          a10 = a[4],
          a11 = a[5],
          a12 = a[6],
          a13 = a[7],
          a20 = a[8],
          a21 = a[9],
          a22 = a[10],
          a23 = a[11],
          a30 = a[12],
          a31 = a[13],
          a32 = a[14],
          a33 = a[15],
          b00 = a00 * a11 - a01 * a10,
          b01 = a00 * a12 - a02 * a10,
          b02 = a00 * a13 - a03 * a10,
          b03 = a01 * a12 - a02 * a11,
          b04 = a01 * a13 - a03 * a11,
          b05 = a02 * a13 - a03 * a12,
          b06 = a20 * a31 - a21 * a30,
          b07 = a20 * a32 - a22 * a30,
          b08 = a20 * a33 - a23 * a30,
          b09 = a21 * a32 - a22 * a31,
          b10 = a21 * a33 - a23 * a31,
          b11 = a22 * a33 - a23 * a32,
          det = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

      this._viewTransform[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
      this._viewTransform[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
      this._viewTransform[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
      this._viewTransform[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
      this._viewTransform[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
      this._viewTransform[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
      this._viewTransform[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
      this._viewTransform[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
      this._viewTransform[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
      this._viewTransform[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
      this._viewTransform[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
      this._viewTransform[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
      this._viewTransform[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
      this._viewTransform[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
      this._viewTransform[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
      this._viewTransform[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    }
  }]);

  return Camera;
})();

Camera.FRUSTUM_PROJECTION = 0;
Camera.PINHOLE_PROJECTION = 1;
Camera.ORTHOGRAPHIC_PROJECTION = 2;

exports.Camera = Camera;

},{"../core/Commands":6}],2:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Position2 = require('./Position');

/**
 * MountPoint is a component designed to allow for smooth tweening
 * of where on the Node it is attached to the parent.
 *
 * @class MountPoint
 * @augments Position
 *
* @param {Node} node Node that the MountPoint component will be attached to
 */

var MountPoint = (function (_Position) {
  _inherits(MountPoint, _Position);

  function MountPoint(node) {
    _classCallCheck(this, MountPoint);

    _get(Object.getPrototypeOf(MountPoint.prototype), 'constructor', this).call(this, node);

    var initial = node.getMountPoint();

    this._x.set(initial[0]);
    this._y.set(initial[1]);
    this._z.set(initial[2]);

    this.onUpdate = this.constructor.update;
  }

  /**
   * Return the name of the MountPoint component
   *
   * @method
   *
   * @return {String} Name of the component
   */

  _createClass(MountPoint, [{
    key: 'toString',
    value: function toString() {
      return 'MountPoint';
    }
  }, {
    key: 'update',

    /**
     * When the node this component is attached to updates, update the value
     * of the Node's mount point.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function update() {
      this._node.setMountPoint(this._x.get(), this._y.get(), this._z.get());
      this._checkUpdate();
    }
  }]);

  return MountPoint;
})(_Position2.Position);

exports.MountPoint = MountPoint;

},{"./Position":3}],3:[function(require,module,exports){
/**
* The MIT License (MIT)
*
* Copyright (c) 2015 Famous Industries Inc.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _transitionsTransitionable = require('../transitions/Transitionable');

/**
* The Position component serves as a way to tween to translation of a Node.
*  It is also the base class for the other core components that interact
* with the Vec3 properties on the Node
*
* @class Position
*
* @param {Node} node Node that the Position component will be attached to
*/

var Position = (function () {
  function Position(node) {
    _classCallCheck(this, Position);

    this._node = node;
    this._id = node.addComponent(this);

    this._requestingUpdate = false;

    var initialPosition = node.getPosition();

    this._x = new _transitionsTransitionable.Transitionable(initialPosition[0]);
    this._y = new _transitionsTransitionable.Transitionable(initialPosition[1]);
    this._z = new _transitionsTransitionable.Transitionable(initialPosition[2]);

    this.onUpdate = this.constructor.update;
  }

  /**
  * Return the name of the Position component
  *
  * @method
  *
  * @return {String} Name of the component
  */

  _createClass(Position, [{
    key: 'toString',
    value: function toString() {
      return 'Position';
    }
  }, {
    key: 'getValue',

    /**
    * Gets object containing stringified constructor, and corresponding dimensional values
    *
    * @method
    *
    * @return {Object} the internal state of the component
    */
    value: function getValue() {
      return {
        component: this.toString(),
        x: this._x.get(),
        y: this._y.get(),
        z: this._z.get()
      };
    }
  }, {
    key: 'setValue',

    /**
    * Set the translation of the Node
    *
    * @method
    *
    * @param {Object} state Object -- component: stringified constructor, x: number, y: number, z: number
    *
    * @return {Boolean} status of the set
    */
    value: function setValue(state) {
      if (this.toString() === state.component) {
        this.set(state.x, state.y, state.z);
        return true;
      }
      return false;
    }
  }, {
    key: 'getX',

    /**
    * Getter for X translation
    *
    * @method
    *
    * @return {Number} the Node's translation along its x-axis
    */

    value: function getX() {
      return this._x.get();
    }
  }, {
    key: 'getY',

    /**
    * Getter for Y translation
    *
    * @method
    *
    * @return {Number} the Node's translation along its Y-axis
    */
    value: function getY() {
      return this._y.get();
    }
  }, {
    key: 'getZ',

    /**
    * Getter for z translation
    *
    * @method
    *
    * @return {Number} the Node's translation along its z-axis
    */
    value: function getZ() {
      return this._z.get();
    }
  }, {
    key: 'isActive',

    /**
    * Whether or not the Position is currently changing
    *
    * @method
    *
    * @return {Boolean} whether or not the Position is changing the Node's position
    */
    value: function isActive() {
      return this._x.isActive() || this._y.isActive() || this._z.isActive();
    }
  }, {
    key: '_checkUpdate',

    /**
    * Decide whether the component needs to be updated on the next tick.
    *
    * @method
    * @private
    *
    * @return {undefined} undefined
    */
    value: function _checkUpdate() {
      if (this.isActive()) this._node.requestUpdateOnNextTick(this._id);else this._requestingUpdate = false;
    }
  }, {
    key: 'update',

    /**
    * When the node this component is attached to updates, update the value
    * of the Node's position
    *
    * @method
    *
    * @return {undefined} undefined
    */
    value: function update() {
      this._node.setPosition(this._x.get(), this._y.get(), this._z.get());
      this._checkUpdate();
    }
  }, {
    key: 'setX',

    /**
    * Setter for X position
    *
    * @method
    *
    * @param {Number} val used to set x coordinate
    * @param {Object} transition options for the transition
    * @param {Function} callback function to execute after setting X
    *
    * @return {Position} this
    */
    value: function setX(val, transition, callback) {
      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }

      this._x.set(val, transition, callback);
      return this;
    }
  }, {
    key: 'setY',

    /**
    * Setter for Y position
    *
    * @method
    *
    * @param {Number} val used to set y coordinate
    * @param {Object} transition options for the transition
    * @param {Function} callback function to execute after setting Y
    *
    * @return {Position} this
    */
    value: function setY(val, transition, callback) {
      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }

      this._y.set(val, transition, callback);
      return this;
    }
  }, {
    key: 'setZ',

    /**
    * Setter for Z position
    *
    * @method
    *
    * @param {Number} val used to set z coordinate
    * @param {Object} transition options for the transition
    * @param {Function} callback function to execute after setting Z
    *
    * @return {Position} this
    */
    value: function setZ(val, transition, callback) {
      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }

      this._z.set(val, transition, callback);
      return this;
    }
  }, {
    key: 'set',

    /**
    * Setter for X, Y, and Z positions
    *
    * @method
    *
    * @param {Number} x used to set x coordinate
    * @param {Number} y used to set y coordinate
    * @param {Number} z used to set z coordinate
    * @param {Object} transition options for the transition
    * @param {Function} callback function to execute after setting X
    *
    * @return {Position} this
    */
    value: function set(x, y, z, transition, callback) {
      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }

      var xCallback;
      var yCallback;
      var zCallback;

      if (z != null) {
        zCallback = callback;
      } else if (y != null) {
        yCallback = callback;
      } else if (x != null) {
        xCallback = callback;
      }

      if (x != null) this._x.set(x, transition, xCallback);
      if (y != null) this._y.set(y, transition, yCallback);
      if (z != null) this._z.set(z, transition, zCallback);

      return this;
    }
  }, {
    key: 'halt',

    /**
    * Stops transition of Position component
    *
    * @method
    *
    * @return {Position} this
    */
    value: function halt() {
      this._x.halt();
      this._y.halt();
      this._z.halt();
      return this;
    }
  }]);

  return Position;
})();

exports.Position = Position;

},{"../transitions/Transitionable":52}],4:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * Channels are being used for interacting with the UI Thread when running in
 * a Web Worker or with the UIManager/ Compositor when running in single
 * threaded mode (no Web Worker).
 *
 * @class Channel
 * @constructor
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Channel = (function () {
  function Channel() {
    _classCallCheck(this, Channel);

    if (typeof self !== 'undefined' && self.window !== self) {
      this._enterWorkerMode();
    }
  }

  /**
   * Called during construction. Subscribes for `message` event and routes all
   * future `sendMessage` messages to the Main Thread ("UI Thread").
   *
   * Primarily used for testing.
   *
   * @method
   *
   * @return {undefined} undefined
   */

  _createClass(Channel, [{
    key: '_enterWorkerMode',
    value: function _enterWorkerMode() {
      this._workerMode = true;
      var _this = this;
      self.addEventListener('message', function onmessage(ev) {
        _this.onMessage(ev.data);
      });
    }
  }, {
    key: 'sendMessage',

    /**
     * Sends a message to the UIManager.
     *
     * @param  {Any}    message Arbitrary message object.
     *
     * @return {undefined} undefined
     */
    value: function sendMessage(message) {
      if (this._workerMode) {
        self.postMessage(message);
      } else {
        this.onmessage(message);
      }
    }
  }, {
    key: 'postMessage',

    /**
     * Sends a message to the manager of this channel (the `Famous` singleton) by
     * invoking `onMessage`.
     * Used for preserving API compatibility with Web Workers.
     *
     * @private
     * @alias onMessage
     *
     * @param {Any} message a message to send over the channel
     *
     * @return {undefined} undefined
     */
    value: function postMessage(message) {
      return this.onMessage(message);
    }
  }, {
    key: 'onMessage',

    /**
     * Meant to be overridden by `Famous`.
     * Assigned method will be invoked for every received message.
     *
     * @type {Function}
     * @override
     *
     * @return {undefined} undefined
     */
    value: function onMessage() {
      return null;
    }

    /**
     * Meant to be overriden by the UIManager when running in the UI Thread.
     * Used for preserving API compatibility with Web Workers.
     * When running in Web Worker mode, this property won't be mutated.
     *
     * Assigned method will be invoked for every message posted by `famous-core`.
     *
     * @type {Function}
     * @override
     */
  }, {
    key: 'onmessage',
    value: function onmessage() {
      return null;
    }
  }]);

  return Channel;
})();

exports.Channel = Channel;

},{}],5:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * Equivalent of an Engine in the Worker Thread. Used to synchronize and manage
 * time across different Threads.
 *
 * @class  Clock
 * @constructor
 * @private
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Clock = (function () {
  function Clock() {
    _classCallCheck(this, Clock);

    this._time = 0;
    this._frame = 0;
    this._timerQueue = [];
    this._updatingIndex = 0;

    this._scale = 1;
    this._scaledTime = this._time;
  }

  /**
   * Sets the scale at which the clock time is passing.
   * Useful for slow-motion or fast-forward effects.
   *
   * `1` means no time scaling ("realtime"),
   * `2` means the clock time is passing twice as fast,
   * `0.5` means the clock time is passing two times slower than the "actual"
   * time at which the Clock is being updated via `.step`.
   *
   * Initally the clock time is not being scaled (factor `1`).
   *
   * @method  setScale
   * @chainable
   *
   * @param {Number} scale    The scale at which the clock time is passing.
   *
   * @return {Clock} this
   */

  _createClass(Clock, [{
    key: 'setScale',
    value: function setScale(scale) {
      this._scale = scale;
      return this;
    }
  }, {
    key: 'getScale',

    /**
     * @method  getScale
     *
     * @return {Number} scale    The scale at which the clock time is passing.
     */
    value: function getScale() {
      return this._scale;
    }
  }, {
    key: 'step',

    /**
     * Updates the internal clock time.
     *
     * @method  step
     * @chainable
     *
     * @param  {Number} time high resolution timestamp used for invoking the
     *                       `update` method on all registered objects
     * @return {Clock}       this
     */
    value: function step(time) {
      this._frame++;

      this._scaledTime = this._scaledTime + (time - this._time) * this._scale;
      this._time = time;

      for (var i = 0; i < this._timerQueue.length; i++) {
        if (this._timerQueue[i](this._scaledTime)) {
          this._timerQueue.splice(i, 1);
        }
      }
      return this;
    }
  }, {
    key: 'now',

    /**
     * Returns the internal clock time.
     *
     * @method  now
     *
     * @return  {Number} time high resolution timestamp used for invoking the
     *                       `update` method on all registered objects
     */
    value: function now() {
      return this._scaledTime;
    }
  }, {
    key: 'getFrame',

    /**
     * Returns the number of frames elapsed so far.
     *
     * @method getFrame
     *
     * @return {Number} frames
     */
    value: function getFrame() {
      return this._frame;
    }
  }, {
    key: 'setTimeout',

    /**
     * Wraps a function to be invoked after a certain amount of time.
     * After a set duration has passed, it executes the function and
     * removes it as a listener to 'prerender'.
     *
     * @method setTimeout
     *
     * @param {Function} callback function to be run after a specified duration
     * @param {Number} delay milliseconds from now to execute the function
     *
     * @return {Function} timer function used for Clock#clearTimer
     */
    value: function setTimeout(callback, delay) {
      var params = Array.prototype.slice.call(arguments, 2);
      var startedAt = this._time;
      var timer = function timer(time) {
        if (time - startedAt >= delay) {
          callback.apply(null, params);
          return true;
        }
        return false;
      };
      this._timerQueue.push(timer);
      return timer;
    }
  }, {
    key: 'setInterval',

    /**
     * Wraps a function to be invoked after a certain amount of time.
     *  After a set duration has passed, it executes the function and
     *  resets the execution time.
     *
     * @method setInterval
     *
     * @param {Function} callback function to be run after a specified duration
     * @param {Number} delay interval to execute function in milliseconds
     *
     * @return {Function} timer function used for Clock#clearTimer
     */
    value: function setInterval(callback, delay) {
      var params = Array.prototype.slice.call(arguments, 2);
      var startedAt = this._time;
      var timer = function timer(time) {
        if (time - startedAt >= delay) {
          callback.apply(null, params);
          startedAt = time;
        }
        return false;
      };
      this._timerQueue.push(timer);
      return timer;
    }
  }, {
    key: 'clearTimer',

    /**
     * Removes previously via `Clock#setTimeout` or `Clock#setInterval`
     * registered callback function
     *
     * @method clearTimer
     * @chainable
     *
     * @param  {Function} timer  previously by `Clock#setTimeout` or
     *                              `Clock#setInterval` returned callback function
     * @return {Clock}              this
     */
    value: function clearTimer(timer) {
      var index = this._timerQueue.indexOf(timer);
      if (index !== -1) {
        this._timerQueue.splice(index, 1);
      }
      return this;
    }
  }]);

  return Clock;
})();

exports.Clock = Clock;

},{}],6:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * An enumeration of the commands in our command queue.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
var Commands = {
  INIT_DOM: 0,
  DOM_RENDER_SIZE: 1,
  CHANGE_TRANSFORM: 2,
  CHANGE_SIZE: 3,
  CHANGE_PROPERTY: 4,
  CHANGE_CONTENT: 5,
  CHANGE_ATTRIBUTE: 6,
  ADD_CLASS: 7,
  REMOVE_CLASS: 8,
  SUBSCRIBE: 9,
  GL_SET_DRAW_OPTIONS: 10,
  GL_AMBIENT_LIGHT: 11,
  GL_LIGHT_POSITION: 12,
  GL_LIGHT_COLOR: 13,
  MATERIAL_INPUT: 14,
  GL_SET_GEOMETRY: 15,
  GL_UNIFORMS: 16,
  GL_BUFFER_DATA: 17,
  GL_CUTOUT_STATE: 18,
  GL_MESH_VISIBILITY: 19,
  GL_REMOVE_MESH: 20,
  PINHOLE_PROJECTION: 21,
  ORTHOGRAPHIC_PROJECTION: 22,
  CHANGE_VIEW_TRANSFORM: 23,
  WITH: 24,
  FRAME: 25,
  ENGINE: 26,
  START: 27,
  STOP: 28,
  TIME: 29,
  TRIGGER: 30,
  NEED_SIZE_FOR: 31,
  DOM: 32,
  READY: 33,
  ALLOW_DEFAULT: 34,
  PREVENT_DEFAULT: 35,
  UNSUBSCRIBE: 36,
  prettyPrint: function prettyPrint(buffer, start, count) {
    var callback;
    start = start ? start : 0;
    var data = {
      i: start,
      result: ''
    };
    for (var len = count ? count + start : buffer.length; data.i < len; data.i++) {
      callback = commandPrinters[buffer[data.i]];
      if (!callback) throw new Error('PARSE ERROR: no command registered for: ' + buffer[data.i]);
      callback(buffer, data);
    }
    return data.result;
  }
};

var commandPrinters = [];

commandPrinters[Commands.INIT_DOM] = function init_dom(buffer, data) {
  data.result += data.i + '. INIT_DOM\n    tagName: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.DOM_RENDER_SIZE] = function dom_render_size(buffer, data) {
  data.result += data.i + '. DOM_RENDER_SIZE\n    selector: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.CHANGE_TRANSFORM] = function change_transform(buffer, data) {
  data.result += data.i + '. CHANGE_TRANSFORM\n    val: [';
  for (var j = 0; j < 16; j++) data.result += buffer[++data.i] + (j < 15 ? ', ' : '');
  data.result += ']\n\n';
};

commandPrinters[Commands.CHANGE_SIZE] = function change_size(buffer, data) {
  data.result += data.i + '. CHANGE_SIZE\n    x: ' + buffer[++data.i] + ', y: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.CHANGE_PROPERTY] = function change_property(buffer, data) {
  data.result += data.i + '. CHANGE_PROPERTY\n    key: ' + buffer[++data.i] + ', value: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.CHANGE_CONTENT] = function change_content(buffer, data) {
  data.result += data.i + '. CHANGE_CONTENT\n    content: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.CHANGE_ATTRIBUTE] = function change_attribute(buffer, data) {
  data.result += data.i + '. CHANGE_ATTRIBUTE\n    key: ' + buffer[++data.i] + ', value: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.ADD_CLASS] = function add_class(buffer, data) {
  data.result += data.i + '. ADD_CLASS\n    className: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.REMOVE_CLASS] = function remove_class(buffer, data) {
  data.result += data.i + '. REMOVE_CLASS\n    className: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.SUBSCRIBE] = function subscribe(buffer, data) {
  data.result += data.i + '. SUBSCRIBE\n    event: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.GL_SET_DRAW_OPTIONS] = function gl_set_draw_options(buffer, data) {
  data.result += data.i + '. GL_SET_DRAW_OPTIONS\n    options: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.GL_AMBIENT_LIGHT] = function gl_ambient_light(buffer, data) {
  data.result += data.i + '. GL_AMBIENT_LIGHT\n    r: ' + buffer[++data.i] + 'g: ' + buffer[++data.i] + 'b: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.GL_LIGHT_POSITION] = function gl_light_position(buffer, data) {
  data.result += data.i + '. GL_LIGHT_POSITION\n    x: ' + buffer[++data.i] + 'y: ' + buffer[++data.i] + 'z: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.GL_LIGHT_COLOR] = function gl_light_color(buffer, data) {
  data.result += data.i + '. GL_LIGHT_COLOR\n    r: ' + buffer[++data.i] + 'g: ' + buffer[++data.i] + 'b: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.MATERIAL_INPUT] = function material_input(buffer, data) {
  data.result += data.i + '. MATERIAL_INPUT\n    key: ' + buffer[++data.i] + ', value: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.GL_SET_GEOMETRY] = function gl_set_geometry(buffer, data) {
  data.result += data.i + '. GL_SET_GEOMETRY\n   x: ' + buffer[++data.i] + ', y: ' + buffer[++data.i] + ', z: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.GL_UNIFORMS] = function gl_uniforms(buffer, data) {
  data.result += data.i + '. GL_UNIFORMS\n    key: ' + buffer[++data.i] + ', value: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.GL_BUFFER_DATA] = function gl_buffer_data(buffer, data) {
  data.result += data.i + '. GL_BUFFER_DATA\n    data: ';
  for (var i = 0; i < 5; i++) data.result += buffer[++data.i] + ', ';
  data.result += '\n\n';
};

commandPrinters[Commands.GL_CUTOUT_STATE] = function gl_cutout_state(buffer, data) {
  data.result += data.i + '. GL_CUTOUT_STATE\n    state: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.GL_MESH_VISIBILITY] = function gl_mesh_visibility(buffer, data) {
  data.result += data.i + '. GL_MESH_VISIBILITY\n    visibility: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.GL_REMOVE_MESH] = function gl_remove_mesh(buffer, data) {
  data.result += data.i + '. GL_REMOVE_MESH\n\n';
};

commandPrinters[Commands.PINHOLE_PROJECTION] = function pinhole_projection(buffer, data) {
  data.result += data.i + '. PINHOLE_PROJECTION\n    depth: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.ORTHOGRAPHIC_PROJECTION] = function orthographic_projection(buffer, data) {
  data.result += data.i + '. ORTHOGRAPHIC_PROJECTION\n';
};

commandPrinters[Commands.CHANGE_VIEW_TRANSFORM] = function change_view_transform(buffer, data) {
  data.result += data.i + '. CHANGE_VIEW_TRANSFORM\n   value: [';
  for (var i = 0; i < 16; i++) data.result += buffer[++data.i] + (i < 15 ? ', ' : '');
  data.result += ']\n\n';
};

commandPrinters[Commands.PREVENT_DEFAULT] = function prevent_default(buffer, data) {
  data.result += data.i + '. PREVENT_DEFAULT\n    value: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.ALLOW_DEFAULT] = function allow_default(buffer, data) {
  data.result += data.i + '. ALLOW_DEFAULT\n    value: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.READY] = function ready(buffer, data) {
  data.result += data.i + '. READY\n\n';
};

commandPrinters[Commands.WITH] = function w(buffer, data) {
  data.result += data.i + '. **WITH**\n     path: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.TIME] = function time(buffer, data) {
  data.result += data.i + '. TIME\n     ms: ' + buffer[++data.i] + '\n\n';
};

commandPrinters[Commands.NEED_SIZE_FOR] = function need_size_for(buffer, data) {
  data.result += data.i + '. NEED_SIZE_FOR\n    selector: ' + buffer[++data.i] + '\n\n';
};

exports.Commands = Commands;

},{}],7:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Event = require('./Event');

var _Path = require('./Path');

/**
 * The Dispatch class is used to propogate events down the
 * scene graph.
 *
 * @class Dispatch
 * @param {Scene} context The context on which it operates
 * @constructor
 */

var Dispatch = (function () {
  function Dispatch() {
    _classCallCheck(this, Dispatch);

    this._nodes = {}; // a container for constant time lookup of nodes

    // The queue is used for two purposes
    // 1. It is used to list indicies in the
    //    Nodes path which are then used to lookup
    //    a node in the scene graph.
    // 2. It is used to assist dispatching
    //    such that it is possible to do a breadth first
    //    traversal of the scene graph.

    this.queues = [];
  }

  /**
   * Protected method that sets the updater for the dispatch. The updater will
   * almost certainly be the FamousEngine class.
   *
   * @method
   * @protected
   *
   * @param {FamousEngine} updater The updater which will be passed through the scene graph
   *
   * @return {undefined} undefined
   */

  _createClass(Dispatch, [{
    key: '_setUpdater',
    value: function _setUpdater(updater) {
      this._updater = updater;

      for (var key in this._nodes) this._nodes[key]._setUpdater(updater);
    }
  }, {
    key: 'mount',

    /**
     * Calls the onMount method for the node at a given path and
     * properly registers all of that nodes children to their proper
     * paths. Throws if that path doesn't have a node registered as
     * a parent or if there is no node registered at that path.
     *
     * @method mount
     *
     * @param {String} path at which to begin mounting
     * @param {Node} node the node that was mounted
     *
     * @return {void}
     */
    value: function mount(path, node) {
      if (!node) throw new Error('Dispatch: no node passed to mount at: ' + path);
      if (this._nodes[path]) throw new Error('Dispatch: there is a node already registered at: ' + path);

      node._setUpdater(this._updater);
      this._nodes[path] = node;
      var parentPath = _Path.Path.parent(path);

      // scenes are their own parents
      var parent = !parentPath ? node : this._nodes[parentPath];

      if (!parent) throw new Error('Parent to path: ' + path + ' doesn\'t exist at expected path: ' + parentPath);

      var children = node.getChildren();
      var components = node.getComponents();
      var i;
      var len;

      if (parent.isMounted()) node._setMounted(true, path);
      if (parent.isShown()) node._setShown(true);

      if (parent.isMounted()) {
        node._setParent(parent);
        if (node.onMount) node.onMount(path);

        for (i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onMount) components[i].onMount(node, i);

        for (i = 0, len = children.length; i < len; i++) if (children[i] && children[i].mount) children[i].mount(path + '/' + i);else if (children[i]) this.mount(path + '/' + i, children[i]);
      }

      if (parent.isShown()) {
        if (node.onShow) node.onShow();
        for (i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onShow) components[i].onShow();
      }
    }
  }, {
    key: 'dismount',

    /**
     * Calls the onDismount method for the node at a given path
     * and deregisters all of that nodes children. Throws if there
     * is no node registered at that path.
     *
     * @method dismount
     * @return {void}
     *
     * @param {String} path at which to begin dismounting
     */
    value: function dismount(path) {
      var node = this._nodes[path];

      if (!node) throw new Error('No node registered to path: ' + path);

      var children = node.getChildren();
      var components = node.getComponents();
      var i;
      var len;

      if (node.isShown()) {
        node._setShown(false);
        if (node.onHide) node.onHide();
        for (i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onHide) components[i].onHide();
      }

      if (node.isMounted()) {
        if (node.onDismount) node.onDismount(path);

        for (i = 0, len = children.length; i < len; i++) if (children[i] && children[i].dismount) children[i].dismount();else if (children[i]) this.dismount(path + '/' + i);

        for (i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onDismount) components[i].onDismount();

        node._setMounted(false);
        node._setParent(null);
      }

      this._nodes[path] = null;
    }
  }, {
    key: 'getNode',

    /**
     * Returns a the node registered to the given path, or none
     * if no node exists at that path.
     *
     * @method getNode
     * @return {Node | void} node at the given path
     *
     * @param {String} path at which to look up the node
     */
    value: function getNode(path) {
      return this._nodes[path];
    }
  }, {
    key: 'show',

    /**
     * Issues the onShow method to the node registered at the given path,
     * and shows the entire subtree below that node. Throws if no node
     * is registered to this path.
     *
     * @method show
     * @return {void}
     *
     * @param {String} path the path of the node to show
     */
    value: function show(path) {
      var node = this._nodes[path];

      if (!node) throw new Error('No node registered to path: ' + path);

      if (node.onShow) node.onShow();

      var components = node.getComponents();
      for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onShow) components[i].onShow();

      var queue = allocQueue();

      addChildrenToQueue(node, queue);
      var child;

      while (child = breadthFirstNext(queue)) this.show(child.getLocation());

      deallocQueue(queue);
    }
  }, {
    key: 'hide',

    /**
     * Issues the onHide method to the node registered at the given path,
     * and hides the entire subtree below that node. Throws if no node
     * is registered to this path.
     *
     * @method hide
     * @return {void}
     *
     * @param {String} path the path of the node to hide
     */
    value: function hide(path) {
      var node = this._nodes[path];

      if (!node) throw new Error('No node registered to path: ' + path);

      if (node.onHide) node.onHide();

      var components = node.getComponents();
      for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onHide) components[i].onHide();

      var queue = allocQueue();

      addChildrenToQueue(node, queue);
      var child;

      while (child = breadthFirstNext(queue)) this.hide(child.getLocation());

      deallocQueue(queue);
    }
  }, {
    key: 'lookupNode',

    /**
     * lookupNode takes a path and returns the node at the location specified
     * by the path, if one exists. If not, it returns undefined.
     *
     * @param {String} location The location of the node specified by its path
     *
     * @return {Node | undefined} The node at the requested path
     */
    value: function lookupNode(location) {
      if (!location) throw new Error('lookupNode must be called with a path');

      var path = allocQueue();

      _splitTo(location, path);

      for (var i = 0, len = path.length; i < len; i++) path[i] = this._nodes[path[i]];

      path.length = 0;
      deallocQueue(path);

      return path[path.length - 1];
    }
  }, {
    key: 'dispatch',

    /**
     * dispatch takes an event name and a payload and dispatches it to the
     * entire scene graph below the node that the dispatcher is on. The nodes
     * receive the events in a breadth first traversal, meaning that parents
     * have the opportunity to react to the event before children.
     *
     * @param {String} path path of the node to send the event to
     * @param {String} event name of the event
     * @param {Any} payload data associated with the event
     *
     * @return {undefined} undefined
     */
    value: function dispatch(path, event, payload) {
      if (!path) throw new Error('dispatch requires a path as it\'s first argument');
      if (!event) throw new Error('dispatch requires an event name as it\'s second argument');

      var node = this._nodes[path];

      if (!node) return;

      payload.node = node;

      var queue = allocQueue();
      queue.push(node);

      var child;
      var components;
      var i;
      var len;

      while (child = breadthFirstNext(queue)) {
        if (child && child.onReceive) child.onReceive(event, payload);

        components = child.getComponents();

        for (i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onReceive) components[i].onReceive(event, payload);
      }

      deallocQueue(queue);
    }
  }, {
    key: 'dispatchUIEvent',

    /**
     * dispatchUIevent takes a path, an event name, and a payload and dispatches them in
     * a manner anologous to DOM bubbling. It first traverses down to the node specified at
     * the path. That node receives the event first, and then every ancestor receives the event
     * until the context.
     *
     * @param {String} path the path of the node
     * @param {String} event the event name
     * @param {Any} payload the payload
     *
     * @return {undefined} undefined
     */
    value: function dispatchUIEvent(path, event, payload) {
      if (!path) throw new Error('dispatchUIEvent needs a valid path to dispatch to');
      if (!event) throw new Error('dispatchUIEvent needs an event name as its second argument');
      var node;

      _Event.Event.call(payload);
      node = this.getNode(path);
      if (node) {
        var parent;
        var components;
        var i;
        var len;

        payload.node = node;

        while (node) {
          if (node.onReceive) node.onReceive(event, payload);
          components = node.getComponents();

          for (i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onReceive) components[i].onReceive(event, payload);

          if (payload.propagationStopped) break;
          parent = node.getParent();
          if (parent === node) return;
          node = parent;
        }
      }
    }
  }]);

  return Dispatch;
})();

var queues = [];

/**
 * Helper method used for allocating a new queue or reusing a previously freed
 * one if possible.
 *
 * @private
 *
 * @return {Array} allocated queue.
 */
function allocQueue() {
  return queues.pop() || [];
}

/**
 * Helper method used for freeing a previously allocated queue.
 *
 * @private
 *
 * @param  {Array} queue    the queue to be relased to the pool.
 * @return {undefined}      undefined
 */
function deallocQueue(queue) {
  queues.push(queue);
}

/**
 * _splitTo is a private method which takes a path and splits it at every '/'
 * pushing the result into the supplied array. This is a destructive change.
 *
 * @private
 * @param {String} string the specified path
 * @param {Array} target the array to which the result should be written
 *
 * @return {Array} the target after having been written to
 */
function _splitTo(string, target) {
  target.length = 0; // clears the array first.
  var last = 0;
  var i;
  var len = string.length;

  for (i = 0; i < len; i++) {
    if (string[i] === '/') {
      target.push(string.substring(last, i));
      last = i + 1;
    }
  }

  if (i - last > 0) target.push(string.substring(last, i));

  return target;
}

/**
 * Enque the children of a node within the dispatcher. Does not clear
 * the dispatchers queue first.
 *
 * @method addChildrenToQueue
 *
 * @param {Node} node from which to add children to the queue
 * @param {Array} queue the queue used for retrieving the new child from
 *
 * @return {void}
 */
function addChildrenToQueue(node, queue) {
  var children = node.getChildren();
  var child;
  for (var i = 0, len = children.length; i < len; i++) {
    child = children[i];
    if (child) queue.push(child);
  }
}

/**
 * Returns the next node in the queue, but also adds its children to
 * the end of the queue. Continually calling this method will result
 * in a breadth first traversal of the render tree.
 *
 * @method breadthFirstNext
 * @param {Array} queue the queue used for retrieving the new child from
 * @return {Node | undefined} the next node in the traversal if one exists
 */
function breadthFirstNext(queue) {
  var child = queue.shift();
  if (!child) return void 0;
  addChildrenToQueue(child, queue);
  return child;
}

var newDispatch = new Dispatch();
exports.Dispatch = newDispatch;

},{"./Event":8,"./Path":13}],8:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * The Event class adds the stopPropagation functionality
 * to the UIEvents within the scene graph.
 *
 * @constructor Event
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
function Event() {
  this.propagationStopped = false;
  this.stopPropagation = stopPropagation;
}

/**
 * stopPropagation ends the bubbling of the event in the
 * scene graph.
 *
 * @method stopPropagation
 *
 * @return {undefined} undefined
 */
function stopPropagation() {
  this.propagationStopped = true;
}

exports.Event = Event;

},{}],9:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Clock = require('./Clock');

var _Scene = require('./Scene');

var _Channel = require('./Channel');

var _Dispatch = require('./Dispatch');

var _renderersUIManager = require('../renderers/UIManager');

var _renderersCompositor = require('../renderers/Compositor');

var _renderLoopsRequestAnimationFrameLoop = require('../render-loops/RequestAnimationFrameLoop');

var _TransformSystem = require('./TransformSystem');

var _OpacitySystem = require('./OpacitySystem');

var _SizeSystem = require('./SizeSystem');

var _Commands = require('./Commands');

var ENGINE_START = [_Commands.Commands.ENGINE, _Commands.Commands.START];
var ENGINE_STOP = [_Commands.Commands.ENGINE, _Commands.Commands.STOP];
var TIME_UPDATE = [_Commands.Commands.TIME, null];

/**
 * Famous has two responsibilities, one to act as the highest level
 * updater and another to send messages over to the renderers. It is
 * a singleton.
 *
 * @class FamousEngine
 * @constructor
 */

var FamousEngine = (function () {
  function FamousEngine() {
    _classCallCheck(this, FamousEngine);

    var _this = this;

    _Dispatch.Dispatch._setUpdater(this);

    this._updateQueue = []; // The updateQueue is a place where nodes
    // can place themselves in order to be
    // updated on the frame.

    this._nextUpdateQueue = []; // the nextUpdateQueue is used to queue
    // updates for the next tick.
    // this prevents infinite loops where during
    // an update a node continuously puts itself
    // back in the update queue.

    this._scenes = {}; // a hash of all of the scenes's that the FamousEngine
    // is responsible for.

    this._messages = TIME_UPDATE; // a queue of all of the draw commands to
    // send to the the renderers this frame.

    this._inUpdate = false; // when the famous is updating this is true.
    // all requests for updates will get put in the
    // nextUpdateQueue

    this._clock = new _Clock.Clock(); // a clock to keep track of time for the scene
    // graph.

    this._channel = new _Channel.Channel();
    this._channel.onMessage = function (message) {
      _this.handleMessage(message);
    };
  }

  /**
   * An init script that initializes the FamousEngine with options
   * or default parameters.
   *
   * @method
   *
   * @param {Object} options a set of options containing a compositor and a render loop
   *
   * @return {FamousEngine} this
   */

  _createClass(FamousEngine, [{
    key: 'init',
    value: function init(options) {
      if (typeof window === 'undefined') {
        throw new Error('FamousEngine#init needs to have access to the global window object. ' + 'Instantiate Compositor and UIManager manually in the UI thread.');
      }
      this.compositor = options && options.compositor || new _renderersCompositor.Compositor();
      this.renderLoop = options && options.renderLoop || new _renderLoopsRequestAnimationFrameLoop.RequestAnimationFrameLoop();
      this.uiManager = new _renderersUIManager.UIManager(this.getChannel(), this.compositor, this.renderLoop);
      return this;
    }
  }, {
    key: 'setChannel',

    /**
     * Sets the channel that the engine will use to communicate to
     * the renderers.
     *
     * @method
     *
     * @param {Channel} channel     The channel to be used for communicating with
     *                              the `UIManager`/ `Compositor`.
     *
     * @return {FamousEngine} this
     */
    value: function setChannel(channel) {
      this._channel = channel;
      return this;
    }
  }, {
    key: 'getChannel',

    /**
     * Returns the channel that the engine is currently using
     * to communicate with the renderers.
     *
     * @method
     *
     * @return {Channel} channel    The channel to be used for communicating with
     *                              the `UIManager`/ `Compositor`.
     */
    value: function getChannel() {
      return this._channel;
    }
  }, {
    key: '_update',

    /**
     * _update is the body of the update loop. The frame consists of
     * pulling in appending the nextUpdateQueue to the currentUpdate queue
     * then moving through the updateQueue and calling onUpdate with the current
     * time on all nodes. While _update is called _inUpdate is set to true and
     * all requests to be placed in the update queue will be forwarded to the
     * nextUpdateQueue.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function _update() {
      this._inUpdate = true;
      var time = this._clock.now();
      var nextQueue = this._nextUpdateQueue;
      var queue = this._updateQueue;
      var item;

      this._messages[1] = time;

      _SizeSystem.SizeSystem.update();
      _TransformSystem.TransformSystem.update();
      _OpacitySystem.OpacitySystem.update();

      while (nextQueue.length) queue.unshift(nextQueue.pop());

      while (queue.length) {
        item = queue.shift();
        if (item && item.update) item.update(time);
        if (item && item.onUpdate) item.onUpdate(time);
      }

      this._inUpdate = false;
    }
  }, {
    key: 'requestUpdate',

    /**
     * requestUpdates takes a class that has an onUpdate method and puts it
     * into the updateQueue to be updated at the next frame.
     * If FamousEngine is currently in an update, requestUpdate
     * passes its argument to requestUpdateOnNextTick.
     *
     * @method
     *
     * @param {Object} requester an object with an onUpdate method
     *
     * @return {undefined} undefined
     */
    value: function requestUpdate(requester) {
      if (!requester) throw new Error('requestUpdate must be called with a class to be updated');

      if (this._inUpdate) this.requestUpdateOnNextTick(requester);else this._updateQueue.push(requester);
    }
  }, {
    key: 'requestUpdateOnNextTick',

    /**
     * requestUpdateOnNextTick is requests an update on the next frame.
     * If FamousEngine is not currently in an update than it is functionally equivalent
     * to requestUpdate. This method should be used to prevent infinite loops where
     * a class is updated on the frame but needs to be updated again next frame.
     *
     * @method
     *
     * @param {Object} requester an object with an onUpdate method
     *
     * @return {undefined} undefined
     */
    value: function requestUpdateOnNextTick(requester) {
      this._nextUpdateQueue.push(requester);
    }
  }, {
    key: 'handleMessage',

    /**
     * postMessage sends a message queue into FamousEngine to be processed.
     * These messages will be interpreted and sent into the scene graph
     * as events if necessary.
     *
     * @method
     *
     * @param {Array} messages an array of commands.
     *
     * @return {FamousEngine} this
     */
    value: function handleMessage(messages) {
      if (!messages) throw new Error('onMessage must be called with an array of messages');

      var command;

      while (messages.length > 0) {
        command = messages.shift();
        switch (command) {
          case _Commands.Commands.WITH:
            this.handleWith(messages);
            break;
          case _Commands.Commands.FRAME:
            this.handleFrame(messages);
            break;
          default:
            throw new Error('received unknown command: ' + command);
        }
      }
      return this;
    }
  }, {
    key: 'handleWith',

    /**
     * handleWith is a method that takes an array of messages following the
     * WITH command. It'll then issue the next commands to the path specified
     * by the WITH command.
     *
     * @method
     *
     * @param {Array} messages array of messages.
     *
     * @return {FamousEngine} this
     */
    value: function handleWith(messages) {
      var path = messages.shift();
      var command = messages.shift();
      switch (command) {
        case _Commands.Commands.TRIGGER:
          // the TRIGGER command sends a UIEvent to the specified path
          var type = messages.shift();
          var ev = messages.shift();
          _Dispatch.Dispatch.dispatchUIEvent(path, type, ev);
          break;
        default:
          throw new Error('received unknown command: ' + command);
      }
      return this;
    }
  }, {
    key: 'handleFrame',

    /**
     * handleFrame is called when the renderers issue a FRAME command to
     * FamousEngine. FamousEngine will then step updating the scene graph to the current time.
     *
     * @method
     *
     * @param {Array} messages array of messages.
     *
     * @return {FamousEngine} this
     */
    value: function handleFrame(messages) {
      if (!messages) throw new Error('handleFrame must be called with an array of messages');
      if (!messages.length) throw new Error('FRAME must be sent with a time');

      this.step(messages.shift());
      return this;
    }
  }, {
    key: 'step',

    /**
     * step updates the clock and the scene graph and then sends the draw commands
     * that accumulated in the update to the renderers.
     *
     * @method
     *
     * @param {Number} time current engine time
     *
     * @return {FamousEngine} this
     */
    value: function step(time) {
      if (time == null) throw new Error('step must be called with a time');

      this._clock.step(time);
      this._update();

      if (this._messages.length) {
        this._channel.sendMessage(this._messages);
        while (this._messages.length > 2) this._messages.pop();
      }

      return this;
    }
  }, {
    key: 'getContext',

    /**
     * returns the context of a particular path. The context is looked up by the selector
     * portion of the path and is listed from the start of the string to the first
     * '/'.
     *
     * @method
     *
     * @param {String} selector the path to look up the context for.
     *
     * @return {Context | Undefined} the context if found, else undefined.
     */
    value: function getContext(selector) {
      if (!selector) throw new Error('getContext must be called with a selector');

      var index = selector.indexOf('/');
      selector = index === -1 ? selector : selector.substring(0, index);

      return this._scenes[selector];
    }
  }, {
    key: 'getClock',

    /**
     * Returns the instance of clock used by the FamousEngine.
     *
     * @method
     *
     * @return {Clock} FamousEngine's clock
     */
    value: function getClock() {
      return this._clock;
    }
  }, {
    key: 'message',

    /**
     * Enqueues a message to be transfered to the renderers.
     *
     * @method
     *
     * @param {Any} command Draw Command
     *
     * @return {FamousEngine} this
     */
    value: function message(command) {
      this._messages.push(command);
      return this;
    }
  }, {
    key: 'createScene',

    /**
     * Creates a scene under which a scene graph could be built.
     *
     * @method
     *
     * @param {String} selector a dom selector for where the scene should be placed
     *
     * @return {Scene} a new instance of Scene.
     */
    value: function createScene(selector) {
      selector = selector || 'body';

      if (this._scenes[selector]) this._scenes[selector].dismount();
      this._scenes[selector] = new _Scene.Scene(selector, this);
      return this._scenes[selector];
    }
  }, {
    key: 'addScene',

    /**
     * Introduce an already instantiated scene to the engine.
     *
     * @method
     *
     * @param {Scene} scene the scene to reintroduce to the engine
     *
     * @return {FamousEngine} this
     */
    value: function addScene(scene) {
      var selector = scene._selector;

      var current = this._scenes[selector];
      if (current && current !== scene) current.dismount();
      if (!scene.isMounted()) scene.mount(scene.getSelector());
      this._scenes[selector] = scene;
      return this;
    }
  }, {
    key: 'removeScene',

    /**
     * Remove a scene.
     *
     * @method
     *
     * @param {Scene} scene the scene to remove from the engine
     *
     * @return {FamousEngine} this
     */
    value: function removeScene(scene) {
      var selector = scene._selector;

      var current = this._scenes[selector];
      if (current && current === scene) {
        if (scene.isMounted()) scene.dismount();
        delete this._scenes[selector];
      }
      return this;
    }
  }, {
    key: 'startRenderLoop',

    /**
     * Starts the engine running in the Main-Thread.
     * This effects **every** updateable managed by the Engine.
     *
     * @method
     *
     * @return {FamousEngine} this
     */
    value: function startRenderLoop() {
      this._channel.sendMessage(ENGINE_START);
      return this;
    }
  }, {
    key: 'stopRenderLoop',

    /**
     * Stops the engine running in the Main-Thread.
     * This effects **every** updateable managed by the Engine.
     *
     * @method
     *
     * @return {FamousEngine} this
     */
    value: function stopRenderLoop() {
      this._channel.sendMessage(ENGINE_STOP);
      return this;
    }
  }, {
    key: 'startEngine',

    /**
     * @method
     * @deprecated Use {@link FamousEngine#startRenderLoop} instead!
     *
     * @return {FamousEngine} this
     */
    value: function startEngine() {
      console.warn('FamousEngine.startEngine is deprecated! Use ' + 'FamousEngine.startRenderLoop instead!');
      return this.startRenderLoop();
    }
  }, {
    key: 'stopEngine',

    /**
     * @method
     * @deprecated Use {@link FamousEngine#stopRenderLoop} instead!
     *
     * @return {FamousEngine} this
     */
    value: function stopEngine() {
      console.warn('FamousEngine.stopEngine is deprecated! Use ' + 'FamousEngine.stopRenderLoop instead!');
      return this.stopRenderLoop();
    }
  }]);

  return FamousEngine;
})();

var newFamousEngine = new FamousEngine();
exports.FamousEngine = newFamousEngine;

},{"../render-loops/RequestAnimationFrameLoop":46,"../renderers/Compositor":47,"../renderers/UIManager":49,"./Channel":4,"./Clock":5,"./Commands":6,"./Dispatch":7,"./OpacitySystem":12,"./Scene":15,"./SizeSystem":17,"./TransformSystem":19}],10:[function(require,module,exports){
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jshint -W079 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _SizeSystem = require('./SizeSystem');

var _Dispatch = require('./Dispatch');

var _TransformSystem = require('./TransformSystem');

var _OpacitySystem = require('./OpacitySystem');

var _Size = require('./Size');

var _Opacity = require('./Opacity');

var _Transform = require('./Transform');

/**
 * Nodes define hierarchy and geometrical transformations. They can be moved
 * (translated), scaled and rotated.
 *
 * A Node is either mounted or unmounted. Unmounted nodes are detached from the
 * scene graph. Unmounted nodes have no parent node, while each mounted node has
 * exactly one parent. Nodes have an arbitrary number of children, which can be
 * dynamically added using {@link Node#addChild}.
 *
 * Each Node has an arbitrary number of `components`. Those components can
 * send `draw` commands to the renderer or mutate the node itself, in which case
 * they define behavior in the most explicit way. Components that send `draw`
 * commands are considered `renderables`. From the node's perspective, there is
 * no distinction between nodes that send draw commands and nodes that define
 * behavior.
 *
 * Because of the fact that Nodes themself are very unopinioted (they don't
 * "render" to anything), they are often being subclassed in order to add e.g.
 * components at initialization to them. Because of this flexibility, they might
 * as well have been called `Entities`.
 *
 * @example
 * // create three detached (unmounted) nodes
 * var parent = new Node();
 * var child1 = new Node();
 * var child2 = new Node();
 *
 * // build an unmounted subtree (parent is still detached)
 * parent.addChild(child1);
 * parent.addChild(child2);
 *
 * // mount parent by adding it to the context
 * var context = Famous.createContext("body");
 * context.addChild(parent);
 *
 * @class Node
 * @constructor
 */

var Node = (function () {
  function Node() {
    _classCallCheck(this, Node);

    this._requestingUpdate = false;
    this._inUpdate = false;
    this._mounted = false;
    this._shown = true;
    this._updater = null;
    this._UIEvents = [];

    this._updateQueue = [];
    this._nextUpdateQueue = [];

    this._freedComponentIndicies = [];
    this._components = [];

    this._freedChildIndicies = [];
    this._children = [];

    this._fullChildren = [];

    this._parent = null;

    this._id = null;

    this._transformID = null;
    this._sizeID = null;
    this._opacityID = null;

    if (!this.constructor.NO_DEFAULT_COMPONENTS) this._init();
  }

  /**
   * Protected method. Initializes a node with a default Transform and Size component
   *
   * @method
   * @protected
   *
   * @return {undefined} undefined
   */

  _createClass(Node, [{
    key: '_init',
    value: function _init() {
      this._transformID = this.addComponent(new _Transform.Transform());
      this._sizeID = this.addComponent(new _Size.Size());
      this._opacityID = this.addComponent(new _Opacity.Opacity());
    }
  }, {
    key: '_setParent',

    /**
     * Protected method. Sets the parent of this node such that it can be looked up.
     *
     * @method
     *
     * @param {Node} parent The node to set as the parent of this
     *
     * @return {undefined} undefined;
     */
    value: function _setParent(parent) {
      if (this._parent && this._parent.getChildren().indexOf(this) !== -1) {
        this._parent.removeChild(this);
      }
      this._parent = parent;
    }
  }, {
    key: '_setMounted',

    /**
     * Protected method. Sets the mount state of the node. Should only be called
     * by the dispatch
     *
     * @method
     *
     * @param {Boolean} mounted whether or not the Node is mounted.
     * @param {String} path The path that the node will be mounted to
     *
     * @return {undefined} undefined
     */
    value: function _setMounted(mounted, path) {
      this._mounted = mounted;
      this._id = path ? path : null;
    }
  }, {
    key: '_setShown',

    /**
     * Protected method, sets whether or not the Node is shown. Should only
     * be called by the dispatch
     *
     * @method
     *
     * @param {Boolean} shown whether or not the node is shown
     *
     * @return {undefined} undefined
     */
    value: function _setShown(shown) {
      this._shown = shown;
    }
  }, {
    key: '_setUpdater',

    /**
     * Protected method. Sets the updater of the node.
     *
     * @method
     *
     * @param {FamousEngine} updater the Updater of the node.
     *
     * @return {undefined} undefined
     */
    value: function _setUpdater(updater) {
      this._updater = updater;
      if (this._requestingUpdate) this._updater.requestUpdate(this);
    }
  }, {
    key: 'getLocation',

    /**
     * Determine the node's location in the scene graph hierarchy.
     * A location of `body/0/1` can be interpreted as the following scene graph
     * hierarchy (ignoring siblings of ancestors and additional child nodes):
     *
     * `Context:body` -> `Node:0` -> `Node:1`, where `Node:1` is the node the
     * `getLocation` method has been invoked on.
     *
     * @method getLocation
     *
     * @return {String} location (path), e.g. `body/0/1`
     */
    value: function getLocation() {
      return this._id;
    }
  }, {
    key: 'emit',

    /**
     * Dispatches the event using the Dispatch. All descendent nodes will
     * receive the dispatched event.
     *
     * @method emit
     *
     * @param  {String} event   Event type.
     * @param  {Object} payload Event object to be dispatched.
     *
     * @return {Node} this
     */
    value: function emit(event, payload) {
      _Dispatch.Dispatch.dispatch(this.getLocation(), event, payload);
      return this;
    }
  }, {
    key: 'sendDrawCommand',

    // THIS WILL BE DEPRECATED
    value: function sendDrawCommand(message) {
      this._updater.message(message);
      return this;
    }
  }, {
    key: 'getValue',

    /**
     * Recursively serializes the Node, including all previously added components.
     *
     * @method getValue
     *
     * @return {Object}     Serialized representation of the node, including
     *                      components.
     */
    value: function getValue() {
      var numberOfChildren = this._children.length;
      var numberOfComponents = this._components.length;
      var i = 0;

      var value = {
        location: this.getId(),
        spec: {
          location: this.getId(),
          showState: {
            mounted: this.isMounted(),
            shown: this.isShown(),
            opacity: 1
          },
          offsets: {
            mountPoint: [0, 0, 0],
            align: [0, 0, 0],
            origin: [0, 0, 0]
          },
          vectors: {
            position: [0, 0, 0],
            rotation: [0, 0, 0, 1],
            scale: [1, 1, 1]
          },
          size: {
            sizeMode: [0, 0, 0],
            proportional: [1, 1, 1],
            differential: [0, 0, 0],
            absolute: [0, 0, 0],
            render: [0, 0, 0]
          }
        },
        UIEvents: this._UIEvents,
        components: [],
        children: []
      };

      if (value.location) {
        var transform = _TransformSystem.TransformSystem.get(this.getId());
        var size = _SizeSystem.SizeSystem.get(this.getId());
        var opacity = _OpacitySystem.OpacitySystem.get(this.getId());

        value.spec.showState.opacity = opacity.getOpacity();

        for (i = 0; i < 3; i++) {
          value.spec.offsets.mountPoint[i] = transform.offsets.mountPoint[i];
          value.spec.offsets.align[i] = transform.offsets.align[i];
          value.spec.offsets.origin[i] = transform.offsets.origin[i];
          value.spec.vectors.position[i] = transform.vectors.position[i];
          value.spec.vectors.rotation[i] = transform.vectors.rotation[i];
          value.spec.vectors.scale[i] = transform.vectors.scale[i];
          value.spec.size.sizeMode[i] = size.sizeMode[i];
          value.spec.size.proportional[i] = size.proportionalSize[i];
          value.spec.size.differential[i] = size.differentialSize[i];
          value.spec.size.absolute[i] = size.absoluteSize[i];
          value.spec.size.render[i] = size.renderSize[i];
        }

        value.spec.vectors.rotation[3] = transform.vectors.rotation[3];
      }

      for (i = 0; i < numberOfChildren; i++) if (this._children[i] && this._children[i].getValue) value.children.push(this._children[i].getValue());

      for (i = 0; i < numberOfComponents; i++) if (this._components[i] && this._components[i].getValue) value.components.push(this._components[i].getValue());

      return value;
    }
  }, {
    key: 'getComputedValue',

    /**
     * Similar to {@link Node#getValue}, but returns the actual "computed" value. E.g.
     * a proportional size of 0.5 might resolve into a "computed" size of 200px
     * (assuming the parent has a width of 400px).
     *
     * @method getComputedValue
     *
     * @return {Object}     Serialized representation of the node, including
     *                      children, excluding components.
     */
    value: function getComputedValue() {
      console.warn('Node.getComputedValue is depricated. Use Node.getValue instead');
      var numberOfChildren = this._children.length;

      var value = {
        location: this.getId(),
        computedValues: {
          transform: this.isMounted() ? _TransformSystem.TransformSystem.get(this.getLocation()).getLocalTransform() : null,
          size: this.isMounted() ? _SizeSystem.SizeSystem.get(this.getLocation()).get() : null,
          opacity: this.isMounted() ? _OpacitySystem.OpacitySystem.get(this.getLocation()).get() : null
        },
        children: []
      };

      for (var i = 0; i < numberOfChildren; i++) if (this._children[i] && this._children[i].getComputedValue) value.children.push(this._children[i].getComputedValue());

      return value;
    }
  }, {
    key: 'getChildren',

    /**
     * Retrieves all children of the current node.
     *
     * @method getChildren
     *
     * @return {Array.<Node>}   An array of children.
     */
    value: function getChildren() {
      return this._fullChildren;
    }
  }, {
    key: 'getRawChildren',

    /**
     * Method used internally to retrieve the children of a node. Each index in the
     * returned array represents a path fragment.
     *
     * @method getRawChildren
     * @private
     *
     * @return {Array}  An array of children. Might contain `null` elements.
     */
    value: function getRawChildren() {
      return this._children;
    }
  }, {
    key: 'getParent',

    /**
     * Retrieves the parent of the current node. Unmounted nodes do not have a
     * parent node.
     *
     * @method getParent
     *
     * @return {Node}       Parent node.
     */
    value: function getParent() {
      return this._parent;
    }
  }, {
    key: 'requestUpdate',

    /**
     * Schedules the {@link Node#update} function of the node to be invoked on the
     * next frame (if no update during this frame has been scheduled already).
     * If the node is currently being updated (which means one of the requesters
     * invoked requestsUpdate while being updated itself), an update will be
     * scheduled on the next frame by falling back to the `requestUpdateOnNextTick`
     * function.
     *
     * Components request their `onUpdate` method to be called during the next
     * frame using this method.
     *
     * @method requestUpdate
     *
     * @param  {Number} requester   Id of the component (as returned by
     *                              {@link Node#addComponent}) to be updated. The
     *                              component's `onUpdate` method will be invoked
     *                              during the next update cycle.
     *
     * @return {Node} this
     */
    value: function requestUpdate(requester) {
      if (this._inUpdate || !this.isMounted()) return this.requestUpdateOnNextTick(requester);
      if (this._updateQueue.indexOf(requester) === -1) {
        this._updateQueue.push(requester);
        if (!this._requestingUpdate) this._requestUpdate();
      }
      return this;
    }
  }, {
    key: 'requestUpdateOnNextTick',

    /**
     * Schedules an update on the next tick.
     *
     * This method is similar to {@link Node#requestUpdate}, but schedules an
     * update on the **next** frame. It schedules the node's `onUpdate` function
     * to be invoked on the frame after the next invocation on
     * the node's onUpdate function.
     *
     * The primary use-case for this method is to request an update while being in
     * an update phase (e.g. because an animation is still active). Most of the
     * time, {@link Node#requestUpdate} is sufficient, since it automatically
     * falls back to {@link Node#requestUpdateOnNextTick} when being invoked during
     * the update phase.
     *
     * @method requestUpdateOnNextTick
     *
     * @param  {Number} requester   Id of the component (as returned by
     *                              {@link Node#addComponent}) to be updated. The
     *                              component's `onUpdate` method will be invoked
     *                              during the next update cycle.
     *
     * @return {Node} this
     */
    value: function requestUpdateOnNextTick(requester) {
      if (this._nextUpdateQueue.indexOf(requester) === -1) this._nextUpdateQueue.push(requester);
      return this;
    }
  }, {
    key: 'isMounted',

    /**
     * Checks if the node is mounted. Unmounted nodes are detached from the scene
     * graph.
     *
     * @method isMounted
     *
     * @return {Boolean}    Boolean indicating whether the node is mounted or not.
     */
    value: function isMounted() {
      return this._mounted;
    }
  }, {
    key: 'isRendered',

    /**
     * Checks if the node is being rendered. A node is being rendererd when it is
     * mounted to a parent node **and** shown.
     *
     * @method isRendered
     *
     * @return {Boolean}    Boolean indicating whether the node is rendered or not.
     */
    value: function isRendered() {
      return this._mounted && this._shown;
    }
  }, {
    key: 'isShown',

    /**
     * Checks if the node is visible ("shown").
     *
     * @method isShown
     *
     * @return {Boolean}    Boolean indicating whether the node is visible
     *                      ("shown") or not.
     */
    value: function isShown() {
      return this._shown;
    }
  }, {
    key: 'getOpacity',

    /**
     * Determines the node's relative opacity.
     * The opacity needs to be within [0, 1], where 0 indicates a completely
     * transparent, therefore invisible node, whereas an opacity of 1 means the
     * node is completely solid.
     *
     * @method getOpacity
     *
     * @return {Number}         Relative opacity of the node.
     */
    value: function getOpacity() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._opacityID).getOpacity();else if (this.isMounted()) return _OpacitySystem.OpacitySystem.get(this.getLocation()).getOpacity();else throw new Error('This node does not have access to an opacity component');
    }
  }, {
    key: 'getMountPoint',

    /**
     * Determines the node's previously set mount point.
     *
     * @method getMountPoint
     *
     * @return {Float32Array}   An array representing the mount point.
     */
    value: function getMountPoint() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._transformID).getMountPoint();else if (this.isMounted()) return _TransformSystem.TransformSystem.get(this.getLocation()).getMountPoint();else throw new Error('This node does not have access to a transform component');
    }
  }, {
    key: 'getAlign',

    /**
     * Determines the node's previously set align.
     *
     * @method getAlign
     *
     * @return {Float32Array}   An array representing the align.
     */
    value: function getAlign() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._transformID).getAlign();else if (this.isMounted()) return _TransformSystem.TransformSystem.get(this.getLocation()).getAlign();else throw new Error('This node does not have access to a transform component');
    }
  }, {
    key: 'getOrigin',

    /**
     * Determines the node's previously set origin.
     *
     * @method getOrigin
     *
     * @return {Float32Array}   An array representing the origin.
     */
    value: function getOrigin() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._transformID).getOrigin();else if (this.isMounted()) return _TransformSystem.TransformSystem.get(this.getLocation()).getOrigin();else throw new Error('This node does not have access to a transform component');
    }
  }, {
    key: 'getPosition',

    /**
     * Determines the node's previously set position.
     *
     * @method getPosition
     *
     * @return {Float32Array}   An array representing the position.
     */
    value: function getPosition() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._transformID).getPosition();else if (this.isMounted()) return _TransformSystem.TransformSystem.get(this.getLocation()).getPosition();else throw new Error('This node does not have access to a transform component');
    }
  }, {
    key: 'getRotation',

    /**
     * Returns the node's current rotation
     *
     * @method getRotation
     *
     * @return {Float32Array} an array of four values, showing the rotation as a quaternion
     */
    value: function getRotation() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._transformID).getRotation();else if (this.isMounted()) return _TransformSystem.TransformSystem.get(this.getLocation()).getRotation();else throw new Error('This node does not have access to a transform component');
    }
  }, {
    key: 'getScale',

    /**
     * Returns the scale of the node
     *
     * @method
     *
     * @return {Float32Array} an array showing the current scale vector
     */
    value: function getScale() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._transformID).getScale();else if (this.isMounted()) return _TransformSystem.TransformSystem.get(this.getLocation()).getScale();else throw new Error('This node does not have access to a transform component');
    }
  }, {
    key: 'getSizeMode',

    /**
     * Returns the current size mode of the node
     *
     * @method
     *
     * @return {Float32Array} an array of numbers showing the current size mode
     */
    value: function getSizeMode() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._sizeID).getSizeMode();else if (this.isMounted()) return _SizeSystem.SizeSystem.get(this.getLocation()).getSizeMode();else throw new Error('This node does not have access to a size component');
    }
  }, {
    key: 'getProportionalSize',

    /**
     * Returns the current proportional size
     *
     * @method
     *
     * @return {Float32Array} a vector 3 showing the current proportional size
     */
    value: function getProportionalSize() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._sizeID).getProportional();else if (this.isMounted()) return _SizeSystem.SizeSystem.get(this.getLocation()).getProportional();else throw new Error('This node does not have access to a size component');
    }
  }, {
    key: 'getDifferentialSize',

    /**
     * Returns the differential size of the node
     *
     * @method
     *
     * @return {Float32Array} a vector 3 showing the current differential size
     */
    value: function getDifferentialSize() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._sizeID).getDifferential();else if (this.isMounted()) return _SizeSystem.SizeSystem.get(this.getLocation()).getDifferential();else throw new Error('This node does not have access to a size component');
    }
  }, {
    key: 'getAbsoluteSize',

    /**
     * Returns the absolute size of the node
     *
     * @method
     *
     * @return {Float32Array} a vector 3 showing the current absolute size of the node
     */
    value: function getAbsoluteSize() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._sizeID).getAbsolute();else if (this.isMounted()) return _SizeSystem.SizeSystem.get(this.getLocation()).getAbsolute();else throw new Error('This node does not have access to a size component');
    }
  }, {
    key: 'getRenderSize',

    /**
     * Returns the current Render Size of the node. Note that the render size
     * is asynchronous (will always be one frame behind) and needs to be explicitely
     * calculated by setting the proper size mode.
     *
     * @method
     *
     * @return {Float32Array} a vector 3 showing the current render size
     */
    value: function getRenderSize() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._sizeID).getRender();else if (this.isMounted()) return _SizeSystem.SizeSystem.get(this.getLocation()).getRender();else throw new Error('This node does not have access to a size component');
    }
  }, {
    key: 'getSize',

    /**
     * Returns the external size of the node
     *
     * @method
     *
     * @return {Float32Array} a vector 3 of the final calculated side of the node
     */
    value: function getSize() {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) return this.getComponent(this._sizeID).get();else if (this.isMounted()) return _SizeSystem.SizeSystem.get(this.getLocation()).get();else throw new Error('This node does not have access to a size component');
    }
  }, {
    key: 'getTransform',

    /**
     * Returns the current world transform of the node
     *
     * @method
     *
     * @return {Float32Array} a 16 value transform
     */
    value: function getTransform() {
      return _TransformSystem.TransformSystem.get(this.getLocation());
    }
  }, {
    key: 'getUIEvents',

    /**
     * Get the list of the UI Events that are currently associated with this node
     *
     * @method
     *
     * @return {Array} an array of strings representing the current subscribed UI event of this node
     */
    value: function getUIEvents() {
      return this._UIEvents;
    }
  }, {
    key: 'addChild',

    /**
     * Adds a new child to this node. If this method is called with no argument it will
     * create a new node, however it can also be called with an existing node which it will
     * append to the node that this method is being called on. Returns the new or passed in node.
     *
     * @method
     *
     * @param {Node | void} child the node to appended or no node to create a new node.
     *
     * @return {Node} the appended node.
     */
    value: function addChild(child) {
      var index = child ? this._children.indexOf(child) : -1;
      child = child ? child : new Node();

      if (index === -1) {
        index = this._freedChildIndicies.length ? this._freedChildIndicies.pop() : this._children.length;

        this._children[index] = child;
        this._fullChildren.push(child);
      }

      if (this.isMounted()) child.mount(this.getLocation() + '/' + index);

      return child;
    }
  }, {
    key: 'removeChild',

    /**
     * Removes a child node from another node. The passed in node must be
     * a child of the node that this method is called upon.
     *
     * @method
     *
     * @param {Node} child node to be removed
     *
     * @return {Boolean} whether or not the node was successfully removed
     */
    value: function removeChild(child) {
      var index = this._children.indexOf(child);

      if (index > -1) {
        this._freedChildIndicies.push(index);

        this._children[index] = null;

        if (child.isMounted()) child.dismount();

        var fullChildrenIndex = this._fullChildren.indexOf(child);
        var len = this._fullChildren.length;
        var i = 0;

        for (i = fullChildrenIndex; i < len - 1; i++) this._fullChildren[i] = this._fullChildren[i + 1];

        this._fullChildren.pop();

        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'addComponent',

    /**
     * Each component can only be added once per node.
     *
     * @method addComponent
     *
     * @param {Object} component    A component to be added.
     * @return {Number} index       The index at which the component has been
     *                              registered. Indices aren't necessarily
     *                              consecutive.
     */
    value: function addComponent(component) {
      var index = this._components.indexOf(component);
      if (index === -1) {
        index = this._freedComponentIndicies.length ? this._freedComponentIndicies.pop() : this._components.length;
        this._components[index] = component;

        if (this.isMounted() && component.onMount) component.onMount(this, index);

        if (this.isShown() && component.onShow) component.onShow();
      }

      return index;
    }
  }, {
    key: 'getComponent',

    /**
     * @method  getComponent
     *
     * @param  {Number} index   Index at which the component has been registered
     *                          (using `Node#addComponent`).
     * @return {*}              The component registered at the passed in index (if
     *                          any).
     */
    value: function getComponent(index) {
      return this._components[index];
    }
  }, {
    key: 'removeComponent',

    /**
     * Removes a previously via {@link Node#addComponent} added component.
     *
     * @method removeComponent
     *
     * @param  {Object} component   An component that has previously been added
     *                              using {@link Node#addComponent}.
     *
     * @return {Node} this
     */
    value: function removeComponent(component) {
      var index = this._components.indexOf(component);
      if (index !== -1) {
        this._freedComponentIndicies.push(index);
        if (this.isShown() && component.onHide) component.onHide();

        if (this.isMounted() && component.onDismount) component.onDismount();

        this._components[index] = null;
      }
      return component;
    }
  }, {
    key: 'removeUIEvent',

    /**
     * Removes a node's subscription to a particular UIEvent. All components
     * on the node will have the opportunity to remove all listeners depending
     * on this event.
     *
     * @method
     *
     * @param {String} eventName the name of the event
     *
     * @return {undefined} undefined
     */
    value: function removeUIEvent(eventName) {
      var UIEvents = this.getUIEvents();
      var components = this._components;
      var component;

      var index = UIEvents.indexOf(eventName);
      if (index !== -1) {
        UIEvents.splice(index, 1);
        for (var i = 0, len = components.length; i < len; i++) {
          component = components[i];
          if (component && component.onRemoveUIEvent) component.onRemoveUIEvent(eventName);
        }
      }
    }
  }, {
    key: 'addUIEvent',

    /**
     * Subscribes a node to a UI Event. All components on the node
     * will have the opportunity to begin listening to that event
     * and alerting the scene graph.
     *
     * @method
     *
     * @param {String} eventName the name of the event
     *
     * @return {Node} this
     */
    value: function addUIEvent(eventName) {
      var UIEvents = this.getUIEvents();
      var components = this._components;
      var component;

      var added = UIEvents.indexOf(eventName) !== -1;
      if (!added) {
        UIEvents.push(eventName);
        for (var i = 0, len = components.length; i < len; i++) {
          component = components[i];
          if (component && component.onAddUIEvent) component.onAddUIEvent(eventName);
        }
      }

      return this;
    }
  }, {
    key: '_requestUpdate',

    /**
     * Private method for the Node to request an update for itself.
     *
     * @method
     * @private
     *
     * @param {Boolean} force whether or not to force the update
     *
     * @return {undefined} undefined
     */
    value: function _requestUpdate(force) {
      if (force || !this._requestingUpdate) {
        if (this._updater) this._updater.requestUpdate(this);
        this._requestingUpdate = true;
      }
    }
  }, {
    key: '_vecOptionalSet',

    /**
     * Private method to set an optional value in an array, and
     * request an update if this changes the value of the array.
     *
     * @method
     *
     * @param {Array} vec the array to insert the value into
     * @param {Number} index the index at which to insert the value
     * @param {Any} val the value to potentially insert (if not null or undefined)
     *
     * @return {Boolean} whether or not a new value was inserted.
     */
    value: function _vecOptionalSet(vec, index, val) {
      if (val != null && vec[index] !== val) {
        vec[index] = val;
        if (!this._requestingUpdate) this._requestUpdate();
        return true;
      }
      return false;
    }
  }, {
    key: 'show',

    /**
     * Shows the node, which is to say, calls onShow on all of the
     * node's components. Renderable components can then issue the
     * draw commands necessary to be shown.
     *
     * @method
     *
     * @return {Node} this
     */
    value: function show() {
      _Dispatch.Dispatch.show(this.getLocation());
      this._shown = true;
      return this;
    }
  }, {
    key: 'hide',

    /**
     * Hides the node, which is to say, calls onHide on all of the
     * node's components. Renderable components can then issue
     * the draw commands necessary to be hidden
     *
     * @method
     *
     * @return {Node} this
     */
    value: function hide() {
      _Dispatch.Dispatch.hide(this.getLocation());
      this._shown = false;
      return this;
    }
  }, {
    key: 'setAlign',

    /**
     * Sets the align value of the node. Will call onAlignChange
     * on all of the Node's components.
     *
     * @method
     *
     * @param {Number} x Align value in the x dimension.
     * @param {Number} y Align value in the y dimension.
     * @param {Number} z Align value in the z dimension.
     *
     * @return {Node} this
     */
    value: function setAlign(x, y, z) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._transformID).setAlign(x, y, z);else if (this.isMounted()) _TransformSystem.TransformSystem.get(this.getLocation()).setAlign(x, y, z);else throw new Error('This node does not have access to a transform component');
      return this;
    }
  }, {
    key: 'setMountPoint',

    /**
     * Sets the mount point value of the node. Will call onMountPointChange
     * on all of the node's components.
     *
     * @method
     *
     * @param {Number} x MountPoint value in x dimension
     * @param {Number} y MountPoint value in y dimension
     * @param {Number} z MountPoint value in z dimension
     *
     * @return {Node} this
     */
    value: function setMountPoint(x, y, z) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._transformID).setMountPoint(x, y, z);else if (this.isMounted()) _TransformSystem.TransformSystem.get(this.getLocation()).setMountPoint(x, y, z);else throw new Error('This node does not have access to a transform component');
      return this;
    }
  }, {
    key: 'setOrigin',

    /**
     * Sets the origin value of the node. Will call onOriginChange
     * on all of the node's components.
     *
     * @method
     *
     * @param {Number} x Origin value in x dimension
     * @param {Number} y Origin value in y dimension
     * @param {Number} z Origin value in z dimension
     *
     * @return {Node} this
     */
    value: function setOrigin(x, y, z) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._transformID).setOrigin(x, y, z);else if (this.isMounted()) _TransformSystem.TransformSystem.get(this.getLocation()).setOrigin(x, y, z);else throw new Error('This node does not have access to a transform component');
      return this;
    }
  }, {
    key: 'setPosition',

    /**
     * Sets the position of the node. Will call onPositionChange
     * on all of the node's components.
     *
     * @method
     *
     * @param {Number} x Position in x
     * @param {Number} y Position in y
     * @param {Number} z Position in z
     *
     * @return {Node} this
     */
    value: function setPosition(x, y, z) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._transformID).setPosition(x, y, z);else if (this.isMounted()) _TransformSystem.TransformSystem.get(this.getLocation()).setPosition(x, y, z);else throw new Error('This node does not have access to a transform component');
      return this;
    }
  }, {
    key: 'setRotation',

    /**
     * Sets the rotation of the node. Will call onRotationChange
     * on all of the node's components. This method takes either
     * Euler angles or a quaternion. If the fourth argument is undefined
     * Euler angles are assumed.
     *
     * @method
     *
     * @param {Number} x Either the rotation around the x axis or the magnitude in x of the axis of rotation.
     * @param {Number} y Either the rotation around the y axis or the magnitude in y of the axis of rotation.
     * @param {Number} z Either the rotation around the z axis or the magnitude in z of the axis of rotation.
     * @param {Number|undefined} w the amount of rotation around the axis of rotation, if a quaternion is specified.
     *
     * @return {Node} this
     */
    value: function setRotation(x, y, z, w) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._transformID).setRotation(x, y, z, w);else if (this.isMounted()) _TransformSystem.TransformSystem.get(this.getLocation()).setRotation(x, y, z, w);else throw new Error('This node does not have access to a transform component');
      return this;
    }
  }, {
    key: 'setScale',

    /**
     * Sets the scale of the node. The default value is 1 in all dimensions.
     * The node's components will have onScaleChanged called on them.
     *
     * @method
     *
     * @param {Number} x Scale value in x
     * @param {Number} y Scale value in y
     * @param {Number} z Scale value in z
     *
     * @return {Node} this
     */
    value: function setScale(x, y, z) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._transformID).setScale(x, y, z);else if (this.isMounted()) _TransformSystem.TransformSystem.get(this.getLocation()).setScale(x, y, z);else throw new Error('This node does not have access to a transform component');
      return this;
    }
  }, {
    key: 'setOpacity',

    /**
     * Sets the value of the opacity of this node. All of the node's
     * components will have onOpacityChange called on them.
     *
     * @method
     *
     * @param {Number} val=1 Value of the opacity. 1 is the default.
     *
     * @return {Node} this
     */
    value: function setOpacity(val) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._opacityID).setOpacity(val);else if (this.isMounted()) _OpacitySystem.OpacitySystem.get(this.getLocation()).setOpacity(val);else throw new Error('This node does not have access to an opacity component');
      return this;
    }
  }, {
    key: 'setSizeMode',

    /**
     * Sets the size mode being used for determining the node's final width, height
     * and depth.
     * Size modes are a way to define the way the node's size is being calculated.
     * Size modes are enums set on the {@link Size} constructor (and aliased on
     * the Node).
     *
     * @example
     * node.setSizeMode(Node.RELATIVE_SIZE, Node.ABSOLUTE_SIZE, Node.ABSOLUTE_SIZE);
     * // Instead of null, any proportional height or depth can be passed in, since
     * // it would be ignored in any case.
     * node.setProportionalSize(0.5, null, null);
     * node.setAbsoluteSize(null, 100, 200);
     *
     * @method setSizeMode
     *
     * @param {SizeMode} x    The size mode being used for determining the size in
     *                        x direction ("width").
     * @param {SizeMode} y    The size mode being used for determining the size in
     *                        y direction ("height").
     * @param {SizeMode} z    The size mode being used for determining the size in
     *                        z direction ("depth").
     *
     * @return {Node} this
     */
    value: function setSizeMode(x, y, z) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._sizeID).setSizeMode(x, y, z);else if (this.isMounted()) _SizeSystem.SizeSystem.get(this.getLocation()).setSizeMode(x, y, z);else throw new Error('This node does not have access to a size component');
      return this;
    }
  }, {
    key: 'setProportionalSize',

    /**
     * A proportional size defines the node's dimensions relative to its parents
     * final size.
     * Proportional sizes need to be within the range of [0, 1].
     *
     * @method setProportionalSize
     *
     * @param {Number} x    x-Size in pixels ("width").
     * @param {Number} y    y-Size in pixels ("height").
     * @param {Number} z    z-Size in pixels ("depth").
     *
     * @return {Node} this
     */
    value: function setProportionalSize(x, y, z) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._sizeID).setProportional(x, y, z);else if (this.isMounted()) _SizeSystem.SizeSystem.get(this.getLocation()).setProportional(x, y, z);else throw new Error('This node does not have access to a size component');
      return this;
    }
  }, {
    key: 'setDifferentialSize',

    /**
     * Differential sizing can be used to add or subtract an absolute size from an
     * otherwise proportionally sized node.
     * E.g. a differential width of `-10` and a proportional width of `0.5` is
     * being interpreted as setting the node's size to 50% of its parent's width
     * *minus* 10 pixels.
     *
     * @method setDifferentialSize
     *
     * @param {Number} x    x-Size to be added to the relatively sized node in
     *                      pixels ("width").
     * @param {Number} y    y-Size to be added to the relatively sized node in
     *                      pixels ("height").
     * @param {Number} z    z-Size to be added to the relatively sized node in
     *                      pixels ("depth").
     *
     * @return {Node} this
     */
    value: function setDifferentialSize(x, y, z) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._sizeID).setDifferential(x, y, z);else if (this.isMounted()) _SizeSystem.SizeSystem.get(this.getLocation()).setDifferential(x, y, z);else throw new Error('This node does not have access to a size component');
      return this;
    }
  }, {
    key: 'setAbsoluteSize',

    /**
     * Sets the node's size in pixels, independent of its parent.
     *
     * @method setAbsoluteSize
     *
     * @param {Number} x x-Size in pixels ("width").
     * @param {Number} y y-Size in pixels ("height").
     * @param {Number} z z-Size in pixels ("depth").
     *
     * @return {Node} this
     */
    value: function setAbsoluteSize(x, y, z) {
      if (!this.constructor.NO_DEFAULT_COMPONENTS) this.getComponent(this._sizeID).setAbsolute(x, y, z);else if (this.isMounted()) _SizeSystem.SizeSystem.get(this.getLocation()).setAbsolute(x, y, z);else throw new Error('This node does not have access to a size component');
      return this;
    }
  }, {
    key: 'getFrame',

    /**
     * Method for getting the current frame. Will be deprecated.
     *
     * @method
     *
     * @return {Number} current frame
     */
    value: function getFrame() {
      return this._updater.getFrame();
    }
  }, {
    key: 'getComponents',

    /**
     * returns an array of the components currently attached to this
     * node.
     *
     * @method getComponents
     *
     * @return {Array} list of components.
     */
    value: function getComponents() {
      return this._components;
    }
  }, {
    key: 'update',

    /**
     * Enters the node's update phase while updating its own spec and updating its components.
     *
     * @method update
     *
     * @param  {Number} time    high-resolution timestamp, usually retrieved using
     *                          requestAnimationFrame
     *
     * @return {Node} this
     */
    value: function update(time) {
      this._inUpdate = true;
      var nextQueue = this._nextUpdateQueue;
      var queue = this._updateQueue;
      var item;

      while (nextQueue.length) queue.unshift(nextQueue.pop());

      while (queue.length) {
        item = this._components[queue.shift()];
        if (item && item.onUpdate) item.onUpdate(time);
      }

      this._inUpdate = false;
      this._requestingUpdate = false;

      if (!this.isMounted()) {
        // last update
        this._parent = null;
        this._id = null;
      } else if (this._nextUpdateQueue.length) {
        this._updater.requestUpdateOnNextTick(this);
        this._requestingUpdate = true;
      }
      return this;
    }
  }, {
    key: 'mount',

    /**
     * Mounts the node and therefore its subtree by setting it as a child of the
     * passed in parent.
     *
     * @method mount
     *
     * @param  {String} path unique path of node (e.g. `body/0/1`)
     *
     * @return {Node} this
     */
    value: function mount(path) {
      if (this.isMounted()) throw new Error('Node is already mounted at: ' + this.getLocation());

      if (!this.constructor.NO_DEFAULT_COMPONENTS) {
        _TransformSystem.TransformSystem.registerTransformAtPath(path, this.getComponent(this._transformID));
        _OpacitySystem.OpacitySystem.registerOpacityAtPath(path, this.getComponent(this._opacityID));
        _SizeSystem.SizeSystem.registerSizeAtPath(path, this.getComponent(this._sizeID));
      } else {
        _TransformSystem.TransformSystem.registerTransformAtPath(path);
        _OpacitySystem.OpacitySystem.registerOpacityAtPath(path);
        _SizeSystem.SizeSystem.registerSizeAtPath(path);
      }
      _Dispatch.Dispatch.mount(path, this);

      if (!this._requestingUpdate) this._requestUpdate();
      return this;
    }
  }, {
    key: 'dismount',

    /**
     * Dismounts (detaches) the node from the scene graph by removing it as a
     * child of its parent.
     *
     * @method
     *
     * @return {Node} this
     */
    value: function dismount() {
      if (!this.isMounted()) throw new Error('Node is not mounted');

      var path = this.getLocation();

      _TransformSystem.TransformSystem.deregisterTransformAtPath(path);
      _SizeSystem.SizeSystem.deregisterSizeAtPath(path);
      _OpacitySystem.OpacitySystem.deregisterOpacityAtPath(path);
      _Dispatch.Dispatch.dismount(path);

      if (!this._requestingUpdate) this._requestUpdate();
    }
  }, {
    key: 'getId',

    /**
     * @alias getId
     *
     * @return {String} the path of the Node
     */
    value: function getId() {
      return this.getLocation();
    }
  }]);

  return Node;
})();

Node.RELATIVE_SIZE = 0;
Node.ABSOLUTE_SIZE = 1;
Node.RENDER_SIZE = 2;
Node.DEFAULT_SIZE = 0;
Node.NO_DEFAULT_COMPONENTS = false;

exports.Node = Node;

},{"./Dispatch":7,"./Opacity":11,"./OpacitySystem":12,"./Size":16,"./SizeSystem":17,"./Transform":18,"./TransformSystem":19}],11:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Opacity = (function () {
  function Opacity(parent) {
    _classCallCheck(this, Opacity);

    this.local = 1;
    this.global = 1;
    this.opacity = 1;
    this.parent = parent ? parent : null;
    this.breakPoint = false;
    this.calculatingWorldOpacity = false;
  }

  _createClass(Opacity, [{
    key: 'reset',
    value: function reset() {
      this.parent = null;
      this.breakPoint = false;
    }
  }, {
    key: 'setParent',
    value: function setParent(parent) {
      this.parent = parent;
    }
  }, {
    key: 'getParent',
    value: function getParent() {
      return this.parent;
    }
  }, {
    key: 'setBreakPoint',
    value: function setBreakPoint() {
      this.breakPoint = true;
      this.calculatingWorldOpacity = true;
    }
  }, {
    key: 'setCalculateWorldOpacity',

    /**
     * Set this node to calculate the world opacity.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function setCalculateWorldOpacity() {
      this.calculatingWorldOpacity = true;
    }
  }, {
    key: 'isBreakPoint',
    value: function isBreakPoint() {
      return this.breakPoint;
    }
  }, {
    key: 'getLocalOpacity',
    value: function getLocalOpacity() {
      return this.local;
    }
  }, {
    key: 'getWorldOpacity',
    value: function getWorldOpacity() {
      if (!this.isBreakPoint() && !this.calculatingWorldOpacity) throw new Error('This opacity is not calculating world transforms');
      return this.global;
    }
  }, {
    key: 'calculate',
    value: function calculate(node) {
      if (!this.parent || this.parent.isBreakPoint()) return this.fromNode(node);else return this.fromNodeWithParent(node);
    }
  }, {
    key: 'getOpacity',
    value: function getOpacity() {
      return this.opacity;
    }
  }, {
    key: 'setOpacity',
    value: function setOpacity(opacity) {
      this.opacity = opacity;
    }
  }, {
    key: 'calculateWorldOpacity',
    value: function calculateWorldOpacity() {
      var nearestBreakPoint = this.parent;

      var previousGlobal = this.global;

      while (nearestBreakPoint && !nearestBreakPoint.isBreakPoint()) nearestBreakPoint = nearestBreakPoint.parent;

      if (nearestBreakPoint) {
        this.global = nearestBreakPoint.getWorldOpacity() * this.local;
      } else {
        this.global = this.local;
      }

      return previousGlobal !== this.global;
    }
  }, {
    key: 'fromNode',
    value: function fromNode() {
      var changed = 0;

      if (this.opacity !== this.local) changed |= Opacity.LOCAL_CHANGED;

      this.local = this.opacity;

      if (this.calculatingWorldOpacity && this.calculateWorldOpacity()) changed |= Opacity.WORLD_CHANGED;

      return changed;
    }
  }, {
    key: 'fromNodeWithParent',
    value: function fromNodeWithParent() {
      var changed = 0;

      var previousLocal = this.local;

      this.local = this.parent.getLocalOpacity() * this.opacity;

      if (this.calculatingWorldOpacity && this.calculateWorldOpacity()) changed |= Opacity.WORLD_CHANGED;

      if (previousLocal !== this.local) changed |= Opacity.LOCAL_CHANGED;

      return changed;
    }
  }]);

  return Opacity;
})();

Opacity.WORLD_CHANGED = 1;
Opacity.LOCAL_CHANGED = 2;

exports.Opacity = Opacity;

},{}],12:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Path = require('./Path');

var _Opacity = require('./Opacity');

var _Dispatch = require('./Dispatch');

var _PathStore = require('./PathStore');

/**
 * The opacity class is responsible for calculating the opacity of a particular
 * node from the data on the node and its parent
 *
 * @constructor {OpacitySystem}
 */

var OpacitySystem = (function () {
  function OpacitySystem() {
    _classCallCheck(this, OpacitySystem);

    this.pathStore = new _PathStore.PathStore();
  }

  /**
   * Private method to call when either the Local or World Opacity changes.
   * Triggers 'onOpacityChange' methods on the node and all of the node's components
   *
   * @method
   * @private
   *
   * @param {Node} node the node on which to trigger a change event if necessary
   * @param {Array} components the components on which to trigger a change event if necessary
   * @param {Opacity} opacity the opacity class that changed
   *
   * @return {undefined} undefined
   */

  /**
   * registers a new Opacity for the given path. This opacity will be updated
   * when the OpacitySystem updates.
   *
   * @method registerOpacityAtPath
   *
   * @param {String} path path for the opacity to be registered to.
   * @param {Opacity} [opacity] opacity to register.
   * @return {undefined} undefined
   */

  _createClass(OpacitySystem, [{
    key: 'registerOpacityAtPath',
    value: function registerOpacityAtPath(path, opacity) {
      if (!_Path.Path.depth(path)) return this.pathStore.insert(path, opacity ? opacity : new _Opacity.Opacity());

      var parent = this.pathStore.get(_Path.Path.parent(path));

      if (!parent) throw new Error('No parent opacity registered at expected path: ' + _Path.Path.parent(path));

      if (opacity) opacity.setParent(parent);

      this.pathStore.insert(path, opacity ? opacity : new _Opacity.Opacity(parent));
    }
  }, {
    key: 'deregisterOpacityAtPath',

    /**
     * Deregisters a opacity registered at the given path.
     *
     * @method deregisterOpacityAtPath
     * @return {void}
     *
     * @param {String} path at which to register the opacity
     */
    value: function deregisterOpacityAtPath(path) {
      this.pathStore.remove(path);
    }
  }, {
    key: 'makeBreakPointAt',

    /**
     * Method which will make the opacity currently stored at the given path a breakpoint.
     * A opacity being a breakpoint means that both a local and world opacity will be calculated
     * for that point. The local opacity being the concatinated opacity of all ancestor opacities up
     * until the nearest breakpoint, and the world being the concatinated opacity of all ancestor opacities.
     * This method throws if no opacity is at the provided path.
     *
     * @method
     *
     * @param {String} path The path at which to turn the opacity into a breakpoint
     *
     * @return {undefined} undefined
     */
    value: function makeBreakPointAt(path) {
      var opacity = this.pathStore.get(path);
      if (!opacity) throw new Error('No opacity Registered at path: ' + path);
      opacity.setBreakPoint();
    }
  }, {
    key: 'makeCalculateWorldOpacityAt',

    /**
     * Method that will make the opacity at this location calculate a world opacity.
     *
     * @method
     *
     * @param {String} path The path at which to make the opacity calculate a world matrix
     *
     * @return {undefined} undefined
     */
    value: function makeCalculateWorldOpacityAt(path) {
      var opacity = this.pathStore.get(path);
      if (!opacity) throw new Error('No opacity opacity at path: ' + path);
      opacity.setCalculateWorldOpacity();
    }
  }, {
    key: 'get',

    /**
     * Returns the instance of the opacity class associated with the given path,
     * or undefined if no opacity is associated.
     *
     * @method
     *
     * @param {String} path The path to lookup
     *
     * @return {Opacity | undefined} the opacity at that path is available, else undefined.
     */
    value: function get(path) {
      return this.pathStore.get(path);
    }
  }, {
    key: 'update',

    /**
     * update is called when the opacity system requires an update.
     * It traverses the opacity array and evaluates the necessary opacities
     * in the scene graph with the information from the corresponding node
     * in the scene graph
     *
     * @method update
     * @return {undefined} undefined
     */
    value: function update() {
      var opacities = this.pathStore.getItems();
      var paths = this.pathStore.getPaths();
      var opacity;
      var changed;
      var node;
      var components;

      for (var i = 0, len = opacities.length; i < len; i++) {
        node = _Dispatch.Dispatch.getNode(paths[i]);
        if (!node) continue;
        components = node.getComponents();
        opacity = opacities[i];

        if (changed = opacity.calculate()) {
          _opacityChanged(node, components, opacity);
          if (changed & _Opacity.Opacity.LOCAL_CHANGED) _localOpacityChanged(node, components, opacity.getLocalOpacity());
          if (changed & _Opacity.Opacity.WORLD_CHANGED) _worldOpacityChanged(node, components, opacity.getWorldOpacity());
        }
      }
    }
  }]);

  return OpacitySystem;
})();

function _opacityChanged(node, components, opacity) {
  if (node.onOpacityChange) node.onOpacityChange(opacity);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onOpacityChange) components[i].onOpacityChange(opacity);
}

/**
 * Private method to call when the local opacity changes. Triggers 'onLocalOpacityChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Array} opacity the local opacity
 *
 * @return {undefined} undefined
 */
function _localOpacityChanged(node, components, opacity) {
  if (node.onLocalOpacityChange) node.onLocalOpacityChange(opacity);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onLocalOpacityChange) components[i].onLocalOpacityChange(opacity);
}

/**
 * Private method to call when the world opacity changes. Triggers 'onWorldOpacityChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Array} opacity the world opacity
 *
 * @return {undefined} undefined
 */
function _worldOpacityChanged(node, components, opacity) {
  if (node.onWorldOpacityChange) node.onWorldOpacityChange(opacity);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onWorldOpacityChange) components[i].onWorldOpacityChange(opacity);
}

var newOpacitySystem = new OpacitySystem();
exports.OpacitySystem = newOpacitySystem;

},{"./Dispatch":7,"./Opacity":11,"./Path":13,"./PathStore":14}],13:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * A collection of utilities for handling paths.
 *
 * @namespace
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
var Path = {

  /**
   * determines if the passed in path has a trailing slash. Paths of the form
   * 'body/0/1/' return true, while paths of the form 'body/0/1' return false.
   *
   * @method
   *
   * @param {String} path the path
   *
   * @return {Boolean} whether or not the path has a trailing slash
   */
  hasTrailingSlash: function hasTrailingSlash(path) {
    return path[path.length - 1] === '/';
  },

  /**
   * Returns the depth in the tree this path represents. Essentially counts
   * the slashes ignoring a trailing slash.
   *
   * @method
   *
   * @param {String} path the path
   *
   * @return {Number} the depth in the tree that this path represents
   */
  depth: function depth(path) {
    var count = 0;
    var length = path.length;
    var len = this.hasTrailingSlash(path) ? length - 1 : length;
    var i = 0;
    for (; i < len; i++) count += path[i] === '/' ? 1 : 0;
    return count;
  },

  /**
   * Gets the position of this path in relation to its siblings.
   *
   * @method
   *
   * @param {String} path the path
   *
   * @return {Number} the index of this path in relation to its siblings.
   */
  index: function index(path) {
    var length = path.length;
    var len = this.hasTrailingSlash(path) ? length - 1 : length;
    while (len--) if (path[len] === '/') break;
    var result = parseInt(path.substring(len + 1));
    return isNaN(result) ? 0 : result;
  },

  /**
   * Gets the position of the path at a particular breadth in relationship
   * to its siblings
   *
   * @method
   *
   * @param {String} path the path
   * @param {Number} depth the breadth at which to find the index
   *
   * @return {Number} index at the particular depth
   */
  indexAtDepth: function indexAtDepth(path, depth) {
    var i = 0;
    var len = path.length;
    var index = 0;
    for (; i < len; i++) {
      if (path[i] === '/') index++;
      if (index === depth) {
        path = path.substring(i ? i + 1 : i);
        index = path.indexOf('/');
        path = index === -1 ? path : path.substring(0, index);
        index = parseInt(path);
        return isNaN(index) ? path : index;
      }
    }
  },

  /**
   * returns the path of the passed in path's parent.
   *
   * @method
   *
   * @param {String} path the path
   *
   * @return {String} the path of the passed in path's parent
   */
  parent: function parent(path) {
    return path.substring(0, path.lastIndexOf('/', path.length - 2));
  },

  /**
   * Determines whether or not the first argument path is the direct child
   * of the second argument path.
   *
   * @method
   *
   * @param {String} child the path that may be a child
   * @param {String} parent the path that may be a parent
   *
   * @return {Boolean} whether or not the first argument path is a child of the second argument path
   */
  isChildOf: function isChildOf(child, parent) {
    return this.isDescendentOf(child, parent) && this.depth(child) === this.depth(parent) + 1;
  },

  /**
   * Returns true if the first argument path is a descendent of the second argument path.
   *
   * @method
   *
   * @param {String} child potential descendent path
   * @param {String} parent potential ancestor path
   *
   * @return {Boolean} whether or not the path is a descendent
   */
  isDescendentOf: function isDescendentOf(child, parent) {
    if (child === parent) return false;
    child = this.hasTrailingSlash(child) ? child : child + '/';
    parent = this.hasTrailingSlash(parent) ? parent : parent + '/';
    return this.depth(parent) < this.depth(child) && child.indexOf(parent) === 0;
  },

  /**
   * returns the selector portion of the path.
   *
   * @method
   *
   * @param {String} path the path
   *
   * @return {String} the selector portion of the path.
   */
  getSelector: function getSelector(path) {
    var index = path.indexOf('/');
    return index === -1 ? path : path.substring(0, index);
  }

};

exports.Path = Path;

},{}],14:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jshint -W079 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Path = require('./Path');

/**
 * A class that can be used to associate any item with a path.
 * Items and paths are kept in flat arrays for easy iteration
 * and a memo is used to provide constant time lookup.
 *
 * @class
 *
 */

var PathStore = (function () {
  function PathStore() {
    _classCallCheck(this, PathStore);

    this.items = [];
    this.paths = [];
    this.memo = {};
  }

  /**
   * Associates an item with the given path. Errors if an item
   * already exists at the given path.
   *
   * @method
   *
   * @param {String} path The path at which to insert the item
   * @param {Any} item The item to associate with the given path.
   *
   * @return {undefined} undefined
   */

  _createClass(PathStore, [{
    key: 'insert',
    value: function insert(path, item) {
      var paths = this.paths;
      var index = paths.indexOf(path);
      if (index !== -1) throw new Error('item already exists at path: ' + path);

      var i = 0;
      var targetDepth = _Path.Path.depth(path);
      var targetIndex = _Path.Path.index(path);

      // The item will be inserted at a point in the array
      // such that it is within its own breadth in the tree
      // that the paths represent
      while (paths[i] && targetDepth >= _Path.Path.depth(paths[i])) i++;

      // The item will be sorted within its breadth by index
      // in regard to its siblings.
      while (paths[i] && targetDepth === _Path.Path.depth(paths[i]) && targetIndex < _Path.Path.index(paths[i])) i++;

      // insert the items in the path
      paths.splice(i, 0, path);
      this.items.splice(i, 0, item);

      // store the relationship between path and index in the memo
      this.memo[path] = i;

      // all items behind the inserted item are now no longer
      // accurately stored in the memo. Thus the memo must be cleared for
      // these items.
      for (var len = this.paths.length; i < len; i++) this.memo[this.paths[i]] = null;
    }
  }, {
    key: 'remove',

    /**
     * Removes the the item from the store at the given path.
     * Errors if no item exists at the given path.
     *
     * @method
     *
     * @param {String} path The path at which to remove the item.
     *
     * @return {undefined} undefined
     */
    value: function remove(path) {
      var paths = this.paths;
      var index = this.memo[path] ? this.memo[path] : paths.indexOf(path);
      if (index === -1) throw new Error('Cannot remove. No item exists at path: ' + path);

      paths.splice(index, 1);
      this.items.splice(index, 1);

      this.memo[path] = null;

      for (var len = this.paths.length; index < len; index++) this.memo[this.paths[index]] = null;
    }
  }, {
    key: 'get',

    /**
     * Returns the item stored at the current path. Returns undefined
     * if no item is stored at that path.
     *
     * @method
     *
     * @param {String} path The path to lookup the item for
     *
     * @return {Any | undefined} the item stored or undefined
     */
    value: function get(path) {
      if (this.memo[path]) return this.items[this.memo[path]];

      var index = this.paths.indexOf(path);

      if (index === -1) return void 0;

      this.memo[path] = index;

      return this.items[index];
    }
  }, {
    key: 'getItems',

    /**
     * Returns an array of the items currently stored in this
     * PathStore.
     *
     * @method
     *
     * @return {Array} items currently stored
     */
    value: function getItems() {
      return this.items;
    }
  }, {
    key: 'getPaths',

    /**
     * Returns an array of the paths currently stored in this
     * PathStore.
     *
     * @method
     *
     * @return {Array} paths currently stored
     */
    value: function getPaths() {
      return this.paths;
    }
  }]);

  return PathStore;
})();

exports.PathStore = PathStore;

},{"./Path":13}],15:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jshint -W079 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Node2 = require('./Node');

var _Dispatch = require('./Dispatch');

var _Commands = require('./Commands');

var _TransformSystem = require('./TransformSystem');

var _OpacitySystem = require('./OpacitySystem');

var _SizeSystem = require('./SizeSystem');

/**
 * Scene is the bottom of the scene graph. It is its own
 * parent and provides the global updater to the scene graph.
 *
 * @class Scene
 * @constructor
 * @extends Node
 *
 * @param {String} selector a string which is a dom selector
 *                 signifying which dom element the context
 *                 should be set upon
 * @param {Famous} updater a class which conforms to Famous' interface
 *                 it needs to be able to send methods to
 *                 the renderers and update nodes in the scene graph
 */

var Scene = (function (_Node) {
  _inherits(Scene, _Node);

  function Scene(selector, updater) {
    _classCallCheck(this, Scene);

    if (!selector) throw new Error('Scene needs to be created with a DOM selector');
    if (!updater) throw new Error('Scene needs to be created with a class like Famous');

    _get(Object.getPrototypeOf(Scene.prototype), 'constructor', this).call(this); // Scene inherits from node

    this._globalUpdater = updater; // The updater that will both
    // send messages to the renderers
    // and update dirty nodes

    this._selector = selector; // reference to the DOM selector
    // that represents the element
    // in the dom that this context
    // inhabits

    this.mount(selector); // Mount the context to itself
    // (it is its own parent)

    this._globalUpdater // message a request for the dom
    .message(_Commands.Commands.NEED_SIZE_FOR) // size of the context so that
    .message(selector); // the scene graph has a total size

    this.show(); // the context begins shown (it's already present in the dom)
  }

  /**
   * Scene getUpdater function returns the passed in updater
   *
   * @return {Famous} the updater for this Scene
   */

  _createClass(Scene, [{
    key: 'getUpdater',
    value: function getUpdater() {
      return this._updater;
    }
  }, {
    key: 'getSelector',

    /**
     * Returns the selector that the context was instantiated with
     *
     * @return {String} dom selector
     */
    value: function getSelector() {
      return this._selector;
    }
  }, {
    key: 'getDispatch',

    /**
     * Returns the dispatcher of the context. Used to send events
     * to the nodes in the scene graph.
     *
     * @return {Dispatch} the Scene's Dispatch
     * @deprecated
     */
    value: function getDispatch() {
      console.warn('Scene#getDispatch is deprecated, require the dispatch directly');
      return _Dispatch.Dispatch;
    }
  }, {
    key: 'onReceive',

    /**
     * Receives an event. If the event is 'CONTEXT_RESIZE' it sets the size of the scene
     * graph to the payload, which must be an array of numbers of at least
     * length three representing the pixel size in 3 dimensions.
     *
     * @param {String} event the name of the event being received
     * @param {*} payload the object being sent
     *
     * @return {undefined} undefined
     */
    value: function onReceive(event, payload) {
      // TODO: In the future the dom element that the context is attached to
      // should have a representation as a component. It would be render sized
      // and the context would receive its size the same way that any render size
      // component receives its size.
      if (event === 'CONTEXT_RESIZE') {
        if (payload.length < 2) throw new Error('CONTEXT_RESIZE\'s payload needs to be at least a pair' + ' of pixel sizes');

        this.setSizeMode('absolute', 'absolute', 'absolute');
        this.setAbsoluteSize(payload[0], payload[1], payload[2] ? payload[2] : 0);

        this._updater.message(_Commands.Commands.WITH).message(this._selector).message(_Commands.Commands.READY);
      }
    }
  }, {
    key: 'mount',
    value: function mount(path) {
      if (this.isMounted()) throw new Error('Scene is already mounted at: ' + this.getLocation());
      _Dispatch.Dispatch.mount(path, this);
      this._id = path;
      this._mounted = true;
      this._parent = this;
      _TransformSystem.TransformSystem.registerTransformAtPath(path);
      _OpacitySystem.OpacitySystem.registerOpacityAtPath(path);
      _SizeSystem.SizeSystem.registerSizeAtPath(path);
    }
  }]);

  return Scene;
})(_Node2.Node);

Scene.NO_DEFAULT_COMPONENTS = true;

exports.Scene = Scene;

},{"./Commands":6,"./Dispatch":7,"./Node":10,"./OpacitySystem":12,"./SizeSystem":17,"./TransformSystem":19}],16:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ONES = [1, 1, 1];
var ZEROS = [0, 0, 0];

/**
 * The Size class is responsible for processing Size from a node
 * @constructor Size
 *
 * @param {Size} parent the parent size
 */

var Size = (function () {
  function Size(parent) {
    _classCallCheck(this, Size);

    this.finalSize = new Float32Array(3);
    this.sizeChanged = false;

    this.sizeMode = new Uint8Array(3);
    this.sizeModeChanged = false;

    this.absoluteSize = new Float32Array(3);
    this.absoluteSizeChanged = false;

    this.proportionalSize = new Float32Array(ONES);
    this.proportionalSizeChanged = false;

    this.differentialSize = new Float32Array(3);
    this.differentialSizeChanged = false;

    this.renderSize = new Float32Array(3);
    this.renderSizeChanged = false;

    this.parent = parent != null ? parent : null;
  }

  // an enumeration of the different types of size modes

  /**
   * Sets the parent of this size.
   *
   * @method
   *
   * @param {Size} parent The parent size component
   *
   * @return {Size} this
   */

  _createClass(Size, [{
    key: 'setParent',
    value: function setParent(parent) {
      this.parent = parent;
      return this;
    }
  }, {
    key: 'getParent',

    /**
     * Gets the parent of this size.
     *
     * @method
     *
     * @returns {Size|undefined} the parent if one exists
     */
    value: function getParent() {
      return this.parent;
    }
  }, {
    key: 'setSizeMode',

    /**
     * Gets the size mode of this size representation
     *
     * @method
     *
     * @param {Number} x the size mode to use for the width
     * @param {Number} y the size mode to use for the height
     * @param {Number} z the size mode to use for the depth
     *
     * @return {array} array of size modes
     */
    value: function setSizeMode(x, y, z) {
      if (x != null) x = _resolveSizeMode(x);
      if (y != null) y = _resolveSizeMode(y);
      if (z != null) z = _resolveSizeMode(z);
      this.sizeModeChanged = _setVec(this.sizeMode, x, y, z);
      return this;
    }
  }, {
    key: 'getSizeMode',

    /**
     * Returns the size mode of this component.
     *
     * @method
     *
     * @return {Array} the current size mode of the this.
     */
    value: function getSizeMode() {
      return this.sizeMode;
    }
  }, {
    key: 'setAbsolute',

    /**
     * Sets the absolute size of this size representation.
     *
     * @method
     *
     * @param {Number} x The x dimension of the absolute size
     * @param {Number} y The y dimension of the absolute size
     * @param {Number} z The z dimension of the absolute size
     *
     * @return {Size} this
     */
    value: function setAbsolute(x, y, z) {
      this.absoluteSizeChanged = _setVec(this.absoluteSize, x, y, z);
      return this;
    }
  }, {
    key: 'getAbsolute',

    /**
     * Gets the absolute size of this size representation
     *
     * @method
     *
     * @return {array} array of absolute size
     */
    value: function getAbsolute() {
      return this.absoluteSize;
    }
  }, {
    key: 'setProportional',

    /**
     * Sets the proportional size of this size representation.
     *
     * @method
     *
     * @param {Number} x The x dimension of the proportional size
     * @param {Number} y The y dimension of the proportional size
     * @param {Number} z The z dimension of the proportional size
     *
     * @return {Size} this
     */
    value: function setProportional(x, y, z) {
      this.proportionalSizeChanged = _setVec(this.proportionalSize, x, y, z);
      return this;
    }
  }, {
    key: 'getProportional',

    /**
     * Gets the propotional size of this size representation
     *
     * @method
     *
     * @return {array} array of proportional size
     */
    value: function getProportional() {
      return this.proportionalSize;
    }
  }, {
    key: 'setDifferential',

    /**
     * Sets the differential size of this size representation.
     *
     * @method
     *
     * @param {Number} x The x dimension of the differential size
     * @param {Number} y The y dimension of the differential size
     * @param {Number} z The z dimension of the differential size
     *
     * @return {Size} this
     */
    value: function setDifferential(x, y, z) {
      this.differentialSizeChanged = _setVec(this.differentialSize, x, y, z);
      return this;
    }
  }, {
    key: 'getDifferential',

    /**
     * Gets the differential size of this size representation
     *
     * @method
     *
     * @return {array} array of differential size
     */
    value: function getDifferential() {
      return this.differentialSize;
    }
  }, {
    key: 'get',

    /**
     * Sets the size of this size representation.
     *
     * @method
     *
     * @param {Number} x The x dimension of the size
     * @param {Number} y The y dimension of the size
     * @param {Number} z The z dimension of the size
     *
     * @return {Size} this
     */
    value: function get() {
      return this.finalSize;
    }
  }, {
    key: 'fromComponents',

    /**
     * fromSpecWithParent takes the parent node's size, the target node's spec,
     * and a target array to write to. Using the node's size mode it calculates
     * a final size for the node from the node's spec. Returns whether or not
     * the final size has changed from its last value.
     *
     * @method
     *
     * @param {Array} components the node's components
     *
     * @return {Boolean} true if the size of the node has changed.
     */
    value: function fromComponents(components) {
      var mode = this.sizeMode;
      var target = this.finalSize;
      var parentSize = this.parent ? this.parent.get() : ZEROS;
      var prev;
      var changed = false;
      var len = components.length;
      var j;
      for (var i = 0; i < 3; i++) {
        prev = target[i];
        switch (mode[i]) {
          case Size.RELATIVE:
            target[i] = parentSize[i] * this.proportionalSize[i] + this.differentialSize[i];
            break;
          case Size.ABSOLUTE:
            target[i] = this.absoluteSize[i];
            break;
          case Size.RENDER:
            var candidate;
            var component;
            for (j = 0; j < len; j++) {
              component = components[j];
              if (component && component.getRenderSize) {
                candidate = component.getRenderSize()[i];
                target[i] = target[i] < candidate || target[i] === 0 ? candidate : target[i];
              }
            }
            break;
        }
        changed = changed || prev !== target[i];
      }
      this.sizeChanged = changed;
      return changed;
    }
  }]);

  return Size;
})();

Size.RELATIVE = 0;
Size.ABSOLUTE = 1;
Size.RENDER = 2;
Size.DEFAULT = Size.RELATIVE;

/**
 * Private method which sets a value within an array
 * and report if the value has changed.
 *
 * @method
 *
 * @param {Array} vec The array to set the value in
 * @param {Number} index The index at which to set the value
 * @param {Any} val If the val is undefined or null, or if the value
 *                  is the same as what is already there, then nothing
 *                  is set.
 *
 * @return {Boolean} returns true if anything changed
 */
function _vecOptionalSet(vec, index, val) {
  if (val != null && vec[index] !== val) {
    vec[index] = val;
    return true;
  } else return false;
}

/**
 * Private method which sets three values within an array of three
 * using _vecOptionalSet. Returns whether anything has changed.
 *
 * @method
 *
 * @param {Array} vec The array to set the values of
 * @param {Any} x The first value to set within the array
 * @param {Any} y The second value to set within the array
 * @param {Any} z The third value to set within the array
 *
 * @return {Boolean} whether anything has changed
 */
function _setVec(vec, x, y, z) {
  var propagate = false;

  propagate = _vecOptionalSet(vec, 0, x) || propagate;
  propagate = _vecOptionalSet(vec, 1, y) || propagate;
  propagate = _vecOptionalSet(vec, 2, z) || propagate;

  return propagate;
}

/**
 * Private method to allow for polymorphism in the size mode such that strings
 * or the numbers from the enumeration can be used.
 *
 * @method
 *
 * @param {String|Number} val The Size mode to resolve.
 *
 * @return {Number} the resolved size mode from the enumeration.
 */
function _resolveSizeMode(val) {
  if (val.constructor === String) {
    switch (val.toLowerCase()) {
      case 'relative':
      case 'default':
        return Size.RELATIVE;
      case 'absolute':
        return Size.ABSOLUTE;
      case 'render':
        return Size.RENDER;
      default:
        throw new Error('unknown size mode: ' + val);
    }
  } else if (val < 0 || val > Size.RENDER) throw new Error('unknown size mode: ' + val);
  return val;
}

exports.Size = Size;

},{}],17:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _PathStore = require('./PathStore');

var _Size = require('./Size');

var _Dispatch = require('./Dispatch');

var _Path = require('./Path');

/**
 * The size system is used to calculate size throughout the scene graph.
 * It holds size components and operates upon them.
 *
 * @constructor
 */

var SizeSystem = (function () {
  function SizeSystem() {
    _classCallCheck(this, SizeSystem);

    this.pathStore = new _PathStore.PathStore();
  }

  // private methods

  /**
   * Private method to alert the node and components that size mode changed.
   *
   * @method
   * @private
   *
   * @param {Node} node Node to potentially call sizeModeChanged on
   * @param {Array} components a list of the nodes' components
   * @param {Size} size the size class for the Node
   *
   * @return {undefined} undefined
   */

  /**
   * Registers a size component to a give path. A size component can be passed as the second argument
   * or a default one will be created. Throws if no size component has been added at the parent path.
   *
   * @method
   *
   * @param {String} path The path at which to register the size component
   * @param {Size | undefined} size The size component to be registered or undefined.
   *
   * @return {undefined} undefined
   */

  _createClass(SizeSystem, [{
    key: 'registerSizeAtPath',
    value: function registerSizeAtPath(path, size) {
      if (!_Path.Path.depth(path)) return this.pathStore.insert(path, size ? size : new _Size.Size());

      var parent = this.pathStore.get(_Path.Path.parent(path));

      if (!parent) throw new Error('No parent size registered at expected path: ' + _Path.Path.parent(path));

      if (size) size.setParent(parent);

      this.pathStore.insert(path, size ? size : new _Size.Size(parent));
    }
  }, {
    key: 'deregisterSizeAtPath',

    /**
     * Removes the size component from the given path. Will throw if no component is at that
     * path
     *
     * @method
     *
     * @param {String} path The path at which to remove the size.
     *
     * @return {undefined} undefined
     */
    value: function deregisterSizeAtPath(path) {
      this.pathStore.remove(path);
    }
  }, {
    key: 'get',

    /**
     * Returns the size component stored at a given path. Returns undefined if no
     * size component is registered to that path.
     *
     * @method
     *
     * @param {String} path The path at which to get the size component.
     *
     * @return {undefined} undefined
     */
    value: function get(path) {
      return this.pathStore.get(path);
    }
  }, {
    key: 'update',

    /**
     * Updates the sizes in the scene graph. Called internally by the famous engine.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function update() {
      var sizes = this.pathStore.getItems();
      var paths = this.pathStore.getPaths();
      var node;
      var size;
      var i;
      var len;
      var components;

      for (i = 0, len = sizes.length; i < len; i++) {
        node = _Dispatch.Dispatch.getNode(paths[i]);
        components = node.getComponents();
        if (!node) continue;
        size = sizes[i];
        if (size.sizeModeChanged) _sizeModeChanged(node, components, size);
        if (size.absoluteSizeChanged) _absoluteSizeChanged(node, components, size);
        if (size.proportionalSizeChanged) _proportionalSizeChanged(node, components, size);
        if (size.differentialSizeChanged) _differentialSizeChanged(node, components, size);
        if (size.renderSizeChanged) _renderSizeChanged(node, components, size);
        if (size.fromComponents(components)) _sizeChanged(node, components, size);
      }
    }
  }]);

  return SizeSystem;
})();

function _sizeModeChanged(node, components, size) {
  var sizeMode = size.getSizeMode();
  var x = sizeMode[0];
  var y = sizeMode[1];
  var z = sizeMode[2];
  if (node.onSizeModeChange) node.onSizeModeChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onSizeModeChange) components[i].onSizeModeChange(x, y, z);
  size.sizeModeChanged = false;
}

/**
 * Private method to alert the node and components that absoluteSize changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call onAbsoluteSizeChange on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */
function _absoluteSizeChanged(node, components, size) {
  var absoluteSize = size.getAbsolute();
  var x = absoluteSize[0];
  var y = absoluteSize[1];
  var z = absoluteSize[2];
  if (node.onAbsoluteSizeChange) node.onAbsoluteSizeChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onAbsoluteSizeChange) components[i].onAbsoluteSizeChange(x, y, z);
  size.absoluteSizeChanged = false;
}

/**
 * Private method to alert the node and components that the proportional size changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call onProportionalSizeChange on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */
function _proportionalSizeChanged(node, components, size) {
  var proportionalSize = size.getProportional();
  var x = proportionalSize[0];
  var y = proportionalSize[1];
  var z = proportionalSize[2];
  if (node.onProportionalSizeChange) node.onProportionalSizeChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onProportionalSizeChange) components[i].onProportionalSizeChange(x, y, z);
  size.proportionalSizeChanged = false;
}

/**
 * Private method to alert the node and components that differential size changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call onDifferentialSize on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */
function _differentialSizeChanged(node, components, size) {
  var differentialSize = size.getDifferential();
  var x = differentialSize[0];
  var y = differentialSize[1];
  var z = differentialSize[2];
  if (node.onDifferentialSizeChange) node.onDifferentialSizeChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onDifferentialSizeChange) components[i].onDifferentialSizeChange(x, y, z);
  size.differentialSizeChanged = false;
}

/**
 * Private method to alert the node and components that render size changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call onRenderSizeChange on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */
function _renderSizeChanged(node, components, size) {
  var renderSize = size.getRenderSize();
  var x = renderSize[0];
  var y = renderSize[1];
  var z = renderSize[2];
  if (node.onRenderSizeChange) node.onRenderSizeChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onRenderSizeChange) components[i].onRenderSizeChange(x, y, z);
  size.renderSizeChanged = false;
}

/**
 * Private method to alert the node and components that the size changed.
 *
 * @method
 * @private
 *
 * @param {Node} node Node to potentially call onSizeChange on
 * @param {Array} components a list of the nodes' components
 * @param {Size} size the size class for the Node
 *
 * @return {undefined} undefined
 */
function _sizeChanged(node, components, size) {
  var finalSize = size.get();
  var x = finalSize[0];
  var y = finalSize[1];
  var z = finalSize[2];
  if (node.onSizeChange) node.onSizeChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onSizeChange) components[i].onSizeChange(x, y, z);
  size.sizeChanged = false;
}

var newSizeSystem = new SizeSystem();
exports.SizeSystem = newSizeSystem;

},{"./Dispatch":7,"./Path":13,"./PathStore":14,"./Size":16}],18:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var QUAT = [0, 0, 0, 1];
var ONES = [1, 1, 1];

/**
 * The transform class is responsible for calculating the transform of a particular
 * node from the data on the node and its parent
 *
 * @constructor Transform
 *
 * @param {Transform} parent the parent Transform
 */

var Transform = (function () {
  function Transform(parent) {
    _classCallCheck(this, Transform);

    this.local = new Float32Array(Transform.IDENT);
    this.global = new Float32Array(Transform.IDENT);
    this.offsets = {
      align: new Float32Array(3),
      alignChanged: false,
      mountPoint: new Float32Array(3),
      mountPointChanged: false,
      origin: new Float32Array(3),
      originChanged: false
    };
    this.vectors = {
      position: new Float32Array(3),
      positionChanged: false,
      rotation: new Float32Array(QUAT),
      rotationChanged: false,
      scale: new Float32Array(ONES),
      scaleChanged: false
    };
    this._lastEulerVals = [0, 0, 0];
    this._lastEuler = false;
    this.parent = parent ? parent : null;
    this.breakPoint = false;
    this.calculatingWorldMatrix = false;
  }

  /**
   * resets the transform state such that it no longer has a parent
   * and is not a breakpoint.
   *
   * @method
   *
   * @return {undefined} undefined
   */

  _createClass(Transform, [{
    key: 'reset',
    value: function reset() {
      this.parent = null;
      this.breakPoint = false;
      this.calculatingWorldMatrix = false;
    }
  }, {
    key: 'setParent',

    /**
     * sets the parent of this transform.
     *
     * @method
     *
     * @param {Transform} parent The transform class that parents this class
     *
     * @return {undefined} undefined
     */
    value: function setParent(parent) {
      this.parent = parent;
    }
  }, {
    key: 'getParent',

    /**
     * returns the parent of this transform
     *
     * @method
     *
     * @return {Transform | null} the parent of this transform if one exists
     */
    value: function getParent() {
      return this.parent;
    }
  }, {
    key: 'setBreakPoint',

    /**
     * Makes this transform a breakpoint. This will cause it to calculate
     * both a local (relative to the nearest ancestor breakpoint) and a world
     * matrix (relative to the scene).
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function setBreakPoint() {
      this.breakPoint = true;
      this.calculatingWorldMatrix = true;
    }
  }, {
    key: 'setCalculateWorldMatrix',

    /**
     * Set this node to calculate the world matrix.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function setCalculateWorldMatrix() {
      this.calculatingWorldMatrix = true;
    }
  }, {
    key: 'isBreakPoint',

    /**
     * returns whether or not this transform is a breakpoint.
     *
     * @method
     *
     * @return {Boolean} true if this transform is a breakpoint
     */
    value: function isBreakPoint() {
      return this.breakPoint;
    }
  }, {
    key: 'getLocalTransform',

    /**
     * returns the local transform
     *
     * @method
     *
     * @return {Float32Array} local transform
     */
    value: function getLocalTransform() {
      return this.local;
    }
  }, {
    key: 'getWorldTransform',

    /**
     * returns the world transform. Requires that this transform is a breakpoint.
     *
     * @method
     *
     * @return {Float32Array} world transform.
     */
    value: function getWorldTransform() {
      if (!this.isBreakPoint() && !this.calculatingWorldMatrix) throw new Error('This transform is not calculating world transforms');
      return this.global;
    }
  }, {
    key: 'calculate',

    /**
     * Takes a node and calculates the proper transform from it.
     *
     * @method
     *
     * @param {Node} node the node to calculate the transform from
     *
     * @return {undefined} undefined
     */
    value: function calculate(node) {
      if (!this.parent || this.parent.isBreakPoint()) return _fromNode(node, this);else return _fromNodeWithParent(node, this);
    }
  }, {
    key: 'getPosition',

    /**
     * Gets the position component of the transform
     *
     * @method
     *
     * @return {Float32Array} the position component of the transform
     */
    value: function getPosition() {
      return this.vectors.position;
    }
  }, {
    key: 'setPosition',

    /**
     * Sets the position component of the transform.
     *
     * @method
     *
     * @param {Number} x The x dimension of the position
     * @param {Number} y The y dimension of the position
     * @param {Number} z The z dimension of the position
     *
     * @return {undefined} undefined
     */
    value: function setPosition(x, y, z) {
      this.vectors.positionChanged = _setVec(this.vectors.position, x, y, z);
    }
  }, {
    key: 'getRotation',

    /**
     * Gets the rotation component of the transform. Will return a quaternion.
     *
     * @method
     *
     * @return {Float32Array} the quaternion representation of the transform's rotation
     */
    value: function getRotation() {
      return this.vectors.rotation;
    }
  }, {
    key: 'setRotation',

    /**
     * Sets the rotation component of the transform. Can take either Euler
     * angles or a quaternion.
     *
     * @method
     *
     * @param {Number} x The rotation about the x axis or the extent in the x dimension
     * @param {Number} y The rotation about the y axis or the extent in the y dimension
     * @param {Number} z The rotation about the z axis or the extent in the z dimension
     * @param {Number} w The rotation about the proceeding vector
     *
     * @return {undefined} undefined
     */
    value: function setRotation(x, y, z, w) {
      var quat = this.vectors.rotation;
      var qx, qy, qz, qw;

      if (w != null) {
        qx = x;
        qy = y;
        qz = z;
        qw = w;
        this._lastEulerVals[0] = null;
        this._lastEulerVals[1] = null;
        this._lastEulerVals[2] = null;
        this._lastEuler = false;
      } else {
        if (x == null || y == null || z == null) {
          if (this._lastEuler) {
            x = x == null ? this._lastEulerVals[0] : x;
            y = y == null ? this._lastEulerVals[1] : y;
            z = z == null ? this._lastEulerVals[2] : z;
          } else {
            var sp = -2 * (quat[1] * quat[2] - quat[3] * quat[0]);

            if (Math.abs(sp) > 0.99999) {
              y = y == null ? Math.PI * 0.5 * sp : y;
              x = x == null ? Math.atan2(-quat[0] * quat[2] + quat[3] * quat[1], 0.5 - quat[1] * quat[1] - quat[2] * quat[2]) : x;
              z = z == null ? 0 : z;
            } else {
              y = y == null ? Math.asin(sp) : y;
              x = x == null ? Math.atan2(quat[0] * quat[2] + quat[3] * quat[1], 0.5 - quat[0] * quat[0] - quat[1] * quat[1]) : x;
              z = z == null ? Math.atan2(quat[0] * quat[1] + quat[3] * quat[2], 0.5 - quat[0] * quat[0] - quat[2] * quat[2]) : z;
            }
          }
        }

        var hx = x * 0.5;
        var hy = y * 0.5;
        var hz = z * 0.5;

        var sx = Math.sin(hx);
        var sy = Math.sin(hy);
        var sz = Math.sin(hz);
        var cx = Math.cos(hx);
        var cy = Math.cos(hy);
        var cz = Math.cos(hz);

        var sysz = sy * sz;
        var cysz = cy * sz;
        var sycz = sy * cz;
        var cycz = cy * cz;

        qx = sx * cycz + cx * sysz;
        qy = cx * sycz - sx * cysz;
        qz = cx * cysz + sx * sycz;
        qw = cx * cycz - sx * sysz;

        this._lastEuler = true;
        this._lastEulerVals[0] = x;
        this._lastEulerVals[1] = y;
        this._lastEulerVals[2] = z;
      }

      this.vectors.rotationChanged = _setVec(quat, qx, qy, qz, qw);
    }
  }, {
    key: 'getScale',

    /**
     * Gets the scale component of the transform
     *
     * @method
     *
     * @return {Float32Array} the scale component of the transform
     */
    value: function getScale() {
      return this.vectors.scale;
    }
  }, {
    key: 'setScale',

    /**
     * Sets the scale component of the transform.
     *
     * @method
     *
     * @param {Number | null | undefined} x The x dimension of the scale
     * @param {Number | null | undefined} y The y dimension of the scale
     * @param {Number | null | undefined} z The z dimension of the scale
     *
     * @return {undefined} undefined
     */
    value: function setScale(x, y, z) {
      this.vectors.scaleChanged = _setVec(this.vectors.scale, x, y, z);
    }
  }, {
    key: 'getAlign',

    /**
     * Gets the align value of the transform
     *
     * @method
     *
     * @return {Float32Array} the align value of the transform
     */
    value: function getAlign() {
      return this.offsets.align;
    }
  }, {
    key: 'setAlign',

    /**
     * Sets the align value of the transform.
     *
     * @method
     *
     * @param {Number | null | undefined} x The x dimension of the align
     * @param {Number | null | undefined} y The y dimension of the align
     * @param {Number | null | undefined} z The z dimension of the align
     *
     * @return {undefined} undefined
     */
    value: function setAlign(x, y, z) {
      this.offsets.alignChanged = _setVec(this.offsets.align, x, y, z != null ? z - 0.5 : z);
    }
  }, {
    key: 'getMountPoint',

    /**
     * Gets the mount point value of the transform.
     *
     * @method
     *
     * @return {Float32Array} the mount point of the transform
     */
    value: function getMountPoint() {
      return this.offsets.mountPoint;
    }
  }, {
    key: 'setMountPoint',

    /**
     * Sets the mount point value of the transform.
     *
     * @method
     *
     * @param {Number | null | undefined} x the x dimension of the mount point
     * @param {Number | null | undefined} y the y dimension of the mount point
     * @param {Number | null | undefined} z the z dimension of the mount point
     *
     * @return {undefined} undefined
     */
    value: function setMountPoint(x, y, z) {
      this.offsets.mountPointChanged = _setVec(this.offsets.mountPoint, x, y, z != null ? z - 0.5 : z);
    }
  }, {
    key: 'getOrigin',

    /**
     * Gets the origin of the transform.
     *
     * @method
     *
     * @return {Float32Array} the origin
     */
    value: function getOrigin() {
      return this.offsets.origin;
    }
  }, {
    key: 'setOrigin',

    /**
     * Sets the origin of the transform.
     *
     * @method
     *
     * @param {Number | null | undefined} x the x dimension of the origin
     * @param {Number | null | undefined} y the y dimension of the origin
     * @param {Number | null | undefined} z the z dimension of the origin
     *
     * @return {undefined} undefined
     */
    value: function setOrigin(x, y, z) {
      this.offsets.originChanged = _setVec(this.offsets.origin, x, y, z != null ? z - 0.5 : z);
    }
  }, {
    key: 'calculateWorldMatrix',

    /**
     * Calculates the world for this particular transform.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function calculateWorldMatrix() {
      var nearestBreakPoint = this.parent;

      while (nearestBreakPoint && !nearestBreakPoint.isBreakPoint()) nearestBreakPoint = nearestBreakPoint.parent;

      if (nearestBreakPoint) return _multiply(this.global, nearestBreakPoint.getWorldTransform(), this.local);else {
        for (var i = 0; i < 16; i++) this.global[i] = this.local[i];
        return false;
      }
    }
  }]);

  return Transform;
})();

Transform.IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

Transform.WORLD_CHANGED = 1;
Transform.LOCAL_CHANGED = 2;

/**
 * Private function. Creates a transformation matrix from a Node's spec.
 *
 * @param {Node} node the node to create a transform for
 * @param {Transform} transform transform to apply
 *
 * @return {Boolean} whether or not the target array was changed
 */
function _fromNode(node, transform) {
  var target = transform.getLocalTransform();
  var mySize = node.getSize();
  var vectors = transform.vectors;
  var offsets = transform.offsets;
  var parentSize = node.getParent().getSize();
  var changed = 0;

  var t00 = target[0];
  var t01 = target[1];
  var t02 = target[2];
  var t10 = target[4];
  var t11 = target[5];
  var t12 = target[6];
  var t20 = target[8];
  var t21 = target[9];
  var t22 = target[10];
  var t30 = target[12];
  var t31 = target[13];
  var t32 = target[14];
  var posX = vectors.position[0];
  var posY = vectors.position[1];
  var posZ = vectors.position[2];
  var rotX = vectors.rotation[0];
  var rotY = vectors.rotation[1];
  var rotZ = vectors.rotation[2];
  var rotW = vectors.rotation[3];
  var scaleX = vectors.scale[0];
  var scaleY = vectors.scale[1];
  var scaleZ = vectors.scale[2];
  var alignX = offsets.align[0] * parentSize[0];
  var alignY = offsets.align[1] * parentSize[1];
  var alignZ = offsets.align[2] * parentSize[2];
  var mountPointX = offsets.mountPoint[0] * mySize[0];
  var mountPointY = offsets.mountPoint[1] * mySize[1];
  var mountPointZ = offsets.mountPoint[2] * mySize[2];
  var originX = offsets.origin[0] * mySize[0];
  var originY = offsets.origin[1] * mySize[1];
  var originZ = offsets.origin[2] * mySize[2];

  var wx = rotW * rotX;
  var wy = rotW * rotY;
  var wz = rotW * rotZ;
  var xx = rotX * rotX;
  var yy = rotY * rotY;
  var zz = rotZ * rotZ;
  var xy = rotX * rotY;
  var xz = rotX * rotZ;
  var yz = rotY * rotZ;

  target[0] = (1 - 2 * (yy + zz)) * scaleX;
  target[1] = 2 * (xy + wz) * scaleX;
  target[2] = 2 * (xz - wy) * scaleX;
  target[3] = 0;
  target[4] = 2 * (xy - wz) * scaleY;
  target[5] = (1 - 2 * (xx + zz)) * scaleY;
  target[6] = 2 * (yz + wx) * scaleY;
  target[7] = 0;
  target[8] = 2 * (xz + wy) * scaleZ;
  target[9] = 2 * (yz - wx) * scaleZ;
  target[10] = (1 - 2 * (xx + yy)) * scaleZ;
  target[11] = 0;
  target[12] = alignX + posX - mountPointX + originX - (target[0] * originX + target[4] * originY + target[8] * originZ);
  target[13] = alignY + posY - mountPointY + originY - (target[1] * originX + target[5] * originY + target[9] * originZ);
  target[14] = alignZ + posZ - mountPointZ + originZ - (target[2] * originX + target[6] * originY + target[10] * originZ);
  target[15] = 1;

  if (transform.calculatingWorldMatrix && transform.calculateWorldMatrix()) changed |= Transform.WORLD_CHANGED;

  if (t00 !== target[0] || t01 !== target[1] || t02 !== target[2] || t10 !== target[4] || t11 !== target[5] || t12 !== target[6] || t20 !== target[8] || t21 !== target[9] || t22 !== target[10] || t30 !== target[12] || t31 !== target[13] || t32 !== target[14]) changed |= Transform.LOCAL_CHANGED;

  return changed;
}

/**
 * Private function. Uses the parent transform, the node's spec, the node's size, and the parent's size
 * to calculate a final transform for the node. Returns true if the transform has changed.
 *
 * @private
 *
 * @param {Node} node the node to create a transform for
 * @param {Transform} transform transform to apply
 *
 * @return {Boolean} whether or not the transform changed
 */
function _fromNodeWithParent(node, transform) {
  var target = transform.getLocalTransform();
  var parentMatrix = transform.parent.getLocalTransform();
  var mySize = node.getSize();
  var vectors = transform.vectors;
  var offsets = transform.offsets;
  var parentSize = node.getParent().getSize();
  var changed = false;

  // local cache of everything
  var t00 = target[0];
  var t01 = target[1];
  var t02 = target[2];
  var t10 = target[4];
  var t11 = target[5];
  var t12 = target[6];
  var t20 = target[8];
  var t21 = target[9];
  var t22 = target[10];
  var t30 = target[12];
  var t31 = target[13];
  var t32 = target[14];
  var p00 = parentMatrix[0];
  var p01 = parentMatrix[1];
  var p02 = parentMatrix[2];
  var p10 = parentMatrix[4];
  var p11 = parentMatrix[5];
  var p12 = parentMatrix[6];
  var p20 = parentMatrix[8];
  var p21 = parentMatrix[9];
  var p22 = parentMatrix[10];
  var p30 = parentMatrix[12];
  var p31 = parentMatrix[13];
  var p32 = parentMatrix[14];
  var posX = vectors.position[0];
  var posY = vectors.position[1];
  var posZ = vectors.position[2];
  var rotX = vectors.rotation[0];
  var rotY = vectors.rotation[1];
  var rotZ = vectors.rotation[2];
  var rotW = vectors.rotation[3];
  var scaleX = vectors.scale[0];
  var scaleY = vectors.scale[1];
  var scaleZ = vectors.scale[2];
  var alignX = offsets.align[0] * parentSize[0];
  var alignY = offsets.align[1] * parentSize[1];
  var alignZ = offsets.align[2] * parentSize[2];
  var mountPointX = offsets.mountPoint[0] * mySize[0];
  var mountPointY = offsets.mountPoint[1] * mySize[1];
  var mountPointZ = offsets.mountPoint[2] * mySize[2];
  var originX = offsets.origin[0] * mySize[0];
  var originY = offsets.origin[1] * mySize[1];
  var originZ = offsets.origin[2] * mySize[2];

  var wx = rotW * rotX;
  var wy = rotW * rotY;
  var wz = rotW * rotZ;
  var xx = rotX * rotX;
  var yy = rotY * rotY;
  var zz = rotZ * rotZ;
  var xy = rotX * rotY;
  var xz = rotX * rotZ;
  var yz = rotY * rotZ;

  var rs0 = (1 - 2 * (yy + zz)) * scaleX;
  var rs1 = 2 * (xy + wz) * scaleX;
  var rs2 = 2 * (xz - wy) * scaleX;
  var rs3 = 2 * (xy - wz) * scaleY;
  var rs4 = (1 - 2 * (xx + zz)) * scaleY;
  var rs5 = 2 * (yz + wx) * scaleY;
  var rs6 = 2 * (xz + wy) * scaleZ;
  var rs7 = 2 * (yz - wx) * scaleZ;
  var rs8 = (1 - 2 * (xx + yy)) * scaleZ;

  var tx = alignX + posX - mountPointX + originX - (rs0 * originX + rs3 * originY + rs6 * originZ);
  var ty = alignY + posY - mountPointY + originY - (rs1 * originX + rs4 * originY + rs7 * originZ);
  var tz = alignZ + posZ - mountPointZ + originZ - (rs2 * originX + rs5 * originY + rs8 * originZ);

  target[0] = p00 * rs0 + p10 * rs1 + p20 * rs2;
  target[1] = p01 * rs0 + p11 * rs1 + p21 * rs2;
  target[2] = p02 * rs0 + p12 * rs1 + p22 * rs2;
  target[3] = 0;
  target[4] = p00 * rs3 + p10 * rs4 + p20 * rs5;
  target[5] = p01 * rs3 + p11 * rs4 + p21 * rs5;
  target[6] = p02 * rs3 + p12 * rs4 + p22 * rs5;
  target[7] = 0;
  target[8] = p00 * rs6 + p10 * rs7 + p20 * rs8;
  target[9] = p01 * rs6 + p11 * rs7 + p21 * rs8;
  target[10] = p02 * rs6 + p12 * rs7 + p22 * rs8;
  target[11] = 0;
  target[12] = p00 * tx + p10 * ty + p20 * tz + p30;
  target[13] = p01 * tx + p11 * ty + p21 * tz + p31;
  target[14] = p02 * tx + p12 * ty + p22 * tz + p32;
  target[15] = 1;

  if (transform.calculatingWorldMatrix && transform.calculateWorldMatrix()) changed |= Transform.WORLD_CHANGED;

  if (t00 !== target[0] || t01 !== target[1] || t02 !== target[2] || t10 !== target[4] || t11 !== target[5] || t12 !== target[6] || t20 !== target[8] || t21 !== target[9] || t22 !== target[10] || t30 !== target[12] || t31 !== target[13] || t32 !== target[14]) changed |= Transform.LOCAL_CHANGED;

  return changed;
}

/**
 * private method to multiply two transforms.
 *
 * @method
 *
 * @param {Array} out The array to write the result to
 * @param {Array} a the left hand transform
 * @param {Array} b the right hand transform
 *
 * @return {undefined} undefined
 */
function _multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a30 = a[12],
      a31 = a[13],
      a32 = a[14];

  var changed = false;
  var res;

  // Cache only the current line of the second matrix
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];

  res = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  changed = changed ? changed : out[0] === res;
  out[0] = res;

  res = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  changed = changed ? changed : out[1] === res;
  out[1] = res;

  res = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  changed = changed ? changed : out[2] === res;
  out[2] = res;

  out[3] = 0;

  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];

  res = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  changed = changed ? changed : out[4] === res;
  out[4] = res;

  res = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  changed = changed ? changed : out[5] === res;
  out[5] = res;

  res = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  changed = changed ? changed : out[6] === res;
  out[6] = res;

  out[7] = 0;

  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];

  res = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  changed = changed ? changed : out[8] === res;
  out[8] = res;

  res = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  changed = changed ? changed : out[9] === res;
  out[9] = res;

  res = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  changed = changed ? changed : out[10] === res;
  out[10] = res;

  out[11] = 0;

  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];

  res = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  changed = changed ? changed : out[12] === res;
  out[12] = res;

  res = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  changed = changed ? changed : out[13] === res;
  out[13] = res;

  res = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  changed = changed ? changed : out[14] === res;
  out[14] = res;

  out[15] = 1;

  return changed;
}

/**
 * A private method to potentially set a value within an
 * array. Will set the value if a value was given
 * for the third argument and if that value is different
 * than the value that is currently in the array at the given index.
 * Returns true if a value was set and false if not.
 *
 * @method
 *
 * @param {Array} vec The array to set the value within
 * @param {Number} index The index at which to set the value
 * @param {Any} val The value to potentially set in the array
 *
 * @return {Boolean} whether or not a value was set
 */
function _vecOptionalSet(vec, index, val) {
  if (val != null && vec[index] !== val) {
    vec[index] = val;
    return true;
  } else return false;
}

/**
 * private method to set values within an array.
 * Returns whether or not the array has been changed.
 *
 * @method
 *
 * @param {Array} vec The vector to be operated upon
 * @param {Number | null | undefined} x The x value of the vector
 * @param {Number | null | undefined} y The y value of the vector
 * @param {Number | null | undefined} z The z value of the vector
 * @param {Number | null | undefined} w the w value of the vector
 *
 * @return {Boolean} whether or not the array was changed
 */
function _setVec(vec, x, y, z, w) {
  var propagate = false;

  propagate = _vecOptionalSet(vec, 0, x) || propagate;
  propagate = _vecOptionalSet(vec, 1, y) || propagate;
  propagate = _vecOptionalSet(vec, 2, z) || propagate;
  if (w != null) propagate = _vecOptionalSet(vec, 3, w) || propagate;

  return propagate;
}

exports.Transform = Transform;

},{}],19:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Path = require('./Path');

var _Transform = require('./Transform');

var _Dispatch = require('./Dispatch');

var _PathStore = require('./PathStore');

/**
 * The transform class is responsible for calculating the transform of a particular
 * node from the data on the node and its parent
 *
 * @constructor {TransformSystem}
 */

var TransformSystem = (function () {
  function TransformSystem() {
    _classCallCheck(this, TransformSystem);

    this.pathStore = new _PathStore.PathStore();
  }

  // private methods

  /**
   * Private method to call when align changes. Triggers 'onAlignChange' methods
   * on the node and all of the node's components
   *
   * @method
   * @private
   *
   * @param {Node} node the node on which to call onAlignChange if necessary
   * @param {Array} components the components on which to call onAlignChange if necessary
   * @param {Object} offsets the set of offsets from the transform
   *
   * @return {undefined} undefined
   */

  /**
   * registers a new Transform for the given path. This transform will be updated
   * when the TransformSystem updates.
   *
   * @method registerTransformAtPath
   * @return {undefined} undefined
   *
   * @param {String} path for the transform to be registered to.
   * @param {Transform | undefined} transform optional transform to register.
   */

  _createClass(TransformSystem, [{
    key: 'registerTransformAtPath',
    value: function registerTransformAtPath(path, transform) {
      if (!_Path.Path.depth(path)) return this.pathStore.insert(path, transform ? transform : new _Transform.Transform());

      var parent = this.pathStore.get(_Path.Path.parent(path));

      if (!parent) throw new Error('No parent transform registered at expected path: ' + _Path.Path.parent(path));

      if (transform) transform.setParent(parent);

      this.pathStore.insert(path, transform ? transform : new _Transform.Transform(parent));
    }
  }, {
    key: 'deregisterTransformAtPath',

    /**
     * deregisters a transform registered at the given path.
     *
     * @method deregisterTransformAtPath
     * @return {void}
     *
     * @param {String} path at which to register the transform
     */
    value: function deregisterTransformAtPath(path) {
      this.pathStore.remove(path);
    }
  }, {
    key: 'makeBreakPointAt',

    /**
     * Method which will make the transform currently stored at the given path a breakpoint.
     * A transform being a breakpoint means that both a local and world transform will be calculated
     * for that point. The local transform being the concatinated transform of all ancestor transforms up
     * until the nearest breakpoint, and the world being the concatinated transform of all ancestor transforms.
     * This method throws if no transform is at the provided path.
     *
     * @method
     *
     * @param {String} path The path at which to turn the transform into a breakpoint
     *
     * @return {undefined} undefined
     */
    value: function makeBreakPointAt(path) {
      var transform = this.pathStore.get(path);
      if (!transform) throw new Error('No transform Registered at path: ' + path);
      transform.setBreakPoint();
    }
  }, {
    key: 'makeCalculateWorldMatrixAt',

    /**
     * Method that will make the transform at this location calculate a world matrix.
     *
     * @method
     *
     * @param {String} path The path at which to make the transform calculate a world matrix
     *
     * @return {undefined} undefined
     */
    value: function makeCalculateWorldMatrixAt(path) {
      var transform = this.pathStore.get(path);
      if (!transform) throw new Error('No transform Registered at path: ' + path);
      transform.setCalculateWorldMatrix();
    }
  }, {
    key: 'get',

    /**
     * Returns the instance of the transform class associated with the given path,
     * or undefined if no transform is associated.
     *
     * @method
     *
     * @param {String} path The path to lookup
     *
     * @return {Transform | undefined} the transform at that path is available, else undefined.
     */
    value: function get(path) {
      return this.pathStore.get(path);
    }
  }, {
    key: 'update',

    /**
     * update is called when the transform system requires an update.
     * It traverses the transform array and evaluates the necessary transforms
     * in the scene graph with the information from the corresponding node
     * in the scene graph
     *
     * @method update
     *
     * @return {undefined} undefined
     */
    value: function update() {
      var transforms = this.pathStore.getItems();
      var paths = this.pathStore.getPaths();
      var transform;
      var changed;
      var node;
      var vectors;
      var offsets;
      var components;

      for (var i = 0, len = transforms.length; i < len; i++) {
        node = _Dispatch.Dispatch.getNode(paths[i]);
        if (!node) continue;
        components = node.getComponents();
        transform = transforms[i];
        vectors = transform.vectors;
        offsets = transform.offsets;
        if (offsets.alignChanged) _alignChanged(node, components, offsets);
        if (offsets.mountPointChanged) _mountPointChanged(node, components, offsets);
        if (offsets.originChanged) _originChanged(node, components, offsets);
        if (vectors.positionChanged) _positionChanged(node, components, vectors);
        if (vectors.rotationChanged) _rotationChanged(node, components, vectors);
        if (vectors.scaleChanged) _scaleChanged(node, components, vectors);
        if (changed = transform.calculate(node)) {
          _transformChanged(node, components, transform);
          if (changed & _Transform.Transform.LOCAL_CHANGED) _localTransformChanged(node, components, transform.getLocalTransform());
          if (changed & _Transform.Transform.WORLD_CHANGED) _worldTransformChanged(node, components, transform.getWorldTransform());
        }
      }
    }
  }]);

  return TransformSystem;
})();

function _alignChanged(node, components, offsets) {
  var x = offsets.align[0];
  var y = offsets.align[1];
  var z = offsets.align[2];
  if (node.onAlignChange) node.onAlignChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onAlignChange) components[i].onAlignChange(x, y, z);
  offsets.alignChanged = false;
}

/**
 * Private method to call when MountPoint changes. Triggers 'onMountPointChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Object} offsets the set of offsets from the transform
 *
 * @return {undefined} undefined
 */
function _mountPointChanged(node, components, offsets) {
  var x = offsets.mountPoint[0];
  var y = offsets.mountPoint[1];
  var z = offsets.mountPoint[2];
  if (node.onMountPointChange) node.onMountPointChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onMountPointChange) components[i].onMountPointChange(x, y, z);
  offsets.mountPointChanged = false;
}

/**
 * Private method to call when Origin changes. Triggers 'onOriginChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Object} offsets the set of offsets from the transform
 *
 * @return {undefined} undefined
 */
function _originChanged(node, components, offsets) {
  var x = offsets.origin[0];
  var y = offsets.origin[1];
  var z = offsets.origin[2];
  if (node.onOriginChange) node.onOriginChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onOriginChange) components[i].onOriginChange(x, y, z);
  offsets.originChanged = false;
}

/**
 * Private method to call when Position changes. Triggers 'onPositionChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Object} vectors the set of vectors from the transform
 *
 * @return {undefined} undefined
 */
function _positionChanged(node, components, vectors) {
  var x = vectors.position[0];
  var y = vectors.position[1];
  var z = vectors.position[2];
  if (node.onPositionChange) node.onPositionChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onPositionChange) components[i].onPositionChange(x, y, z);
  vectors.positionChanged = false;
}

/**
 * Private method to call when Rotation changes. Triggers 'onRotationChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Object} vectors the set of vectors from the transform
 *
 * @return {undefined} undefined
 */
function _rotationChanged(node, components, vectors) {
  var x = vectors.rotation[0];
  var y = vectors.rotation[1];
  var z = vectors.rotation[2];
  var w = vectors.rotation[3];
  if (node.onRotationChange) node.onRotationChange(x, y, z, w);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onRotationChange) components[i].onRotationChange(x, y, z, w);
  vectors.rotationChanged = false;
}

/**
 * Private method to call when Scale changes. Triggers 'onScaleChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Object} vectors the set of vectors from the transform
 *
 * @return {undefined} undefined
 */
function _scaleChanged(node, components, vectors) {
  var x = vectors.scale[0];
  var y = vectors.scale[1];
  var z = vectors.scale[2];
  if (node.onScaleChange) node.onScaleChange(x, y, z);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onScaleChange) components[i].onScaleChange(x, y, z);
  vectors.scaleChanged = false;
}

/**
 * Private method to call when either the Local or World Transform changes.
 * Triggers 'onTransformChange' methods on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Transform} transform the transform class that changed
 *
 * @return {undefined} undefined
 */
function _transformChanged(node, components, transform) {
  if (node.onTransformChange) node.onTransformChange(transform);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onTransformChange) components[i].onTransformChange(transform);
}

/**
 * Private method to call when the local transform changes. Triggers 'onLocalTransformChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Array} transform the local transform
 *
 * @return {undefined} undefined
 */
function _localTransformChanged(node, components, transform) {
  if (node.onLocalTransformChange) node.onLocalTransformChange(transform);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onLocalTransformChange) components[i].onLocalTransformChange(transform);
}

/**
 * Private method to call when the world transform changes. Triggers 'onWorldTransformChange' methods
 * on the node and all of the node's components
 *
 * @method
 * @private
 *
 * @param {Node} node the node on which to trigger a change event if necessary
 * @param {Array} components the components on which to trigger a change event if necessary
 * @param {Array} transform the world transform
 *
 * @return {undefined} undefined
 */
function _worldTransformChanged(node, components, transform) {
  if (node.onWorldTransformChange) node.onWorldTransformChange(transform);
  for (var i = 0, len = components.length; i < len; i++) if (components[i] && components[i].onWorldTransformChange) components[i].onWorldTransformChange(transform);
}

var newTransformSystem = new TransformSystem();
exports.TransformSystem = newTransformSystem;

},{"./Dispatch":7,"./Path":13,"./PathStore":14,"./Transform":18}],20:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilitiesCallbackStore = require('../utilities/CallbackStore');

var _coreTransformSystem = require('../core/TransformSystem');

var _coreOpacitySystem = require('../core/OpacitySystem');

var _coreCommands = require('../core/Commands');

var _coreSize = require('../core/Size');

/**
 * A DOMElement is a component that can be added to a Node with the
 * purpose of sending draw commands to the renderer. Renderables send draw commands
 * to through their Nodes to the Compositor where they are acted upon.
 *
 * @class DOMElement
 *
 * @param {Node} node                   The Node to which the `DOMElement`
 *                                      renderable should be attached to.
 * @param {Object} options              Initial options used for instantiating
 *                                      the Node.
 * @param {Object} options.properties   CSS properties that should be added to
 *                                      the actual DOMElement on the initial draw.
 * @param {Object} options.attributes   Element attributes that should be added to
 *                                      the actual DOMElement.
 * @param {String} options.id           String to be applied as 'id' of the actual
 *                                      DOMElement.
 * @param {String} options.content      String to be applied as the content of the
 *                                      actual DOMElement.
 * @param {Boolean} options.cutout      Specifies the presence of a 'cutout' in the
 *                                      WebGL canvas over this element which allows
 *                                      for DOM and WebGL layering.  On by default.
 */

var DOMElement = (function () {
  function DOMElement(node, options) {
    _classCallCheck(this, DOMElement);

    if (!node) throw new Error('DOMElement must be instantiated on a node');

    this._changeQueue = [];

    this._requestingUpdate = false;
    this._renderSized = false;
    this._requestRenderSize = false;

    this._UIEvents = node.getUIEvents().slice(0);
    this._classes = ['famous-dom-element'];
    this._requestingEventListeners = [];
    this._styles = {};

    this._attributes = {};
    this._content = '';

    this._tagName = options && options.tagName ? options.tagName : 'div';
    this._renderSize = [0, 0, 0];

    this._node = node;

    if (node) node.addComponent(this);

    this._callbacks = new _utilitiesCallbackStore.CallbackStore();

    this.setProperty('display', node.isShown() ? 'block' : 'none');

    if (!options) return;

    var i;
    var key;

    if (options.classes) for (i = 0; i < options.classes.length; i++) this.addClass(options.classes[i]);

    if (options.attributes) for (key in options.attributes) this.setAttribute(key, options.attributes[key]);

    if (options.properties) for (key in options.properties) this.setProperty(key, options.properties[key]);

    if (options.id) this.setId(options.id);
    if (options.content) this.setContent(options.content);
    if (options.cutout === false) this.setCutoutState(options.cutout);
  }

  /**
   * Serializes the state of the DOMElement.
   *
   * @method
   *
   * @return {Object} serialized interal state
   */

  _createClass(DOMElement, [{
    key: 'getValue',
    value: function getValue() {
      return {
        classes: this._classes,
        styles: this._styles,
        attributes: this._attributes,
        content: this._content,
        id: this._attributes.id,
        tagName: this._tagName
      };
    }
  }, {
    key: 'onUpdate',

    /**
     * Method to be invoked by the node as soon as an update occurs. This allows
     * the DOMElement renderable to dynamically react to state changes on the Node.
     *
     * This flushes the internal draw command queue by sending individual commands
     * to the node using `sendDrawCommand`.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function onUpdate() {
      var node = this._node;
      var queue = this._changeQueue;
      var len = queue.length;

      if (len && node) {
        node.sendDrawCommand(_coreCommands.Commands.WITH);
        node.sendDrawCommand(node.getLocation());

        while (len--) node.sendDrawCommand(queue.shift());
        if (this._requestRenderSize) {
          node.sendDrawCommand(_coreCommands.Commands.DOM_RENDER_SIZE);
          node.sendDrawCommand(node.getLocation());
          this._requestRenderSize = false;
        }
      }

      this._requestingUpdate = false;
    }
  }, {
    key: 'onMount',

    /**
     * Method to be invoked by the Node as soon as the node (or any of its
     * ancestors) is being mounted.
     *
     * @method onMount
     *
     * @param {Node} node      Parent node to which the component should be added.
     * @param {String} id      Path at which the component (or node) is being
     *                          attached. The path is being set on the actual
     *                          DOMElement as a `data-fa-path`-attribute.
     *
     * @return {undefined} undefined
     */
    value: function onMount(node, id) {
      this._node = node;
      this._id = id;
      this._UIEvents = node.getUIEvents().slice(0);
      _coreTransformSystem.TransformSystem.makeBreakPointAt(node.getLocation());
      this.onSizeModeChange.apply(this, node.getSizeMode());
      _coreOpacitySystem.OpacitySystem.makeBreakPointAt(node.getLocation());
      this.draw();
      this.setAttribute('data-fa-path', node.getLocation());
    }
  }, {
    key: 'onDismount',

    /**
     * Method to be invoked by the Node as soon as the node is being dismounted
     * either directly or by dismounting one of its ancestors.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function onDismount() {
      this.setProperty('display', 'none');
      this.setAttribute('data-fa-path', '');
      this.setCutoutState(false);

      this.onUpdate();
      this._initialized = false;
    }
  }, {
    key: 'onShow',

    /**
     * Method to be invoked by the node as soon as the DOMElement is being shown.
     * This results into the DOMElement setting the `display` property to `block`
     * and therefore visually showing the corresponding DOMElement (again).
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function onShow() {
      this.setProperty('display', 'block');
    }
  }, {
    key: 'onHide',

    /**
     * Method to be invoked by the node as soon as the DOMElement is being hidden.
     * This results into the DOMElement setting the `display` property to `none`
     * and therefore visually hiding the corresponding DOMElement (again).
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function onHide() {
      this.setProperty('display', 'none');
    }
  }, {
    key: 'setCutoutState',

    /**
     * Enables or disables WebGL 'cutout' for this element, which affects
     * how the element is layered with WebGL objects in the scene.
     *
     * @method
     *
     * @param {Boolean} usesCutout  The presence of a WebGL 'cutout' for this element.
     *
     * @return {DOMElement} this
     */
    value: function setCutoutState(usesCutout) {
      if (this._initialized) this._changeQueue.push(_coreCommands.Commands.GL_CUTOUT_STATE, usesCutout);

      if (!this._requestingUpdate) this._requestUpdate();
      return this;
    }
  }, {
    key: 'onTransformChange',

    /**
     * Method to be invoked by the node as soon as the transform matrix associated
     * with the node changes. The DOMElement will react to transform changes by sending
     * `CHANGE_TRANSFORM` commands to the `DOMRenderer`.
     *
     * @method
     *
     * @param {Float32Array} transform The final transform matrix
     *
     * @return {undefined} undefined
     */
    value: function onTransformChange(transform) {
      this._changeQueue.push(_coreCommands.Commands.CHANGE_TRANSFORM);
      transform = transform.getLocalTransform();

      for (var i = 0, len = transform.length; i < len; i++) this._changeQueue.push(transform[i]);

      if (!this._requestingUpdate) this._requestUpdate();
    }
  }, {
    key: 'onSizeChange',

    /**
     * Method to be invoked by the node as soon as its computed size changes.
     *
     * @method
     *
     * @param {Number} x width of the Node the DOMElement is attached to
     * @param {Number} y height of the Node the DOMElement is attached to
     *
     * @return {DOMElement} this
     */
    value: function onSizeChange(x, y) {
      var sizeMode = this._node.getSizeMode();
      var sizedX = sizeMode[0] !== _coreSize.Size.RENDER;
      var sizedY = sizeMode[1] !== _coreSize.Size.RENDER;
      if (this._initialized) this._changeQueue.push(_coreCommands.Commands.CHANGE_SIZE, sizedX ? x : sizedX, sizedY ? y : sizedY);

      if (!this._requestingUpdate) this._requestUpdate();
      return this;
    }
  }, {
    key: 'onOpacityChange',

    /**
     * Method to be invoked by the node as soon as its opacity changes
     *
     * @method
     *
     * @param {Number} opacity The new opacity, as a scalar from 0 to 1
     *
     * @return {DOMElement} this
     */
    value: function onOpacityChange(opacity) {
      opacity = opacity.getLocalOpacity();

      return this.setProperty('opacity', opacity);
    }
  }, {
    key: 'onAddUIEvent',

    /**
     * Method to be invoked by the node as soon as a new UIEvent is being added.
     * This results into an `ADD_EVENT_LISTENER` command being sent.
     *
     * @param {String} uiEvent uiEvent to be subscribed to (e.g. `click`)
     *
     * @return {undefined} undefined
     */
    value: function onAddUIEvent(uiEvent) {
      if (this._UIEvents.indexOf(uiEvent) === -1) {
        this._subscribe(uiEvent);
        this._UIEvents.push(uiEvent);
      } else if (this._inDraw) {
        this._subscribe(uiEvent);
      }
      return this;
    }
  }, {
    key: 'onRemoveUIEvent',

    /**
     * Method to be invoked by the node as soon as a UIEvent is removed from
     * the node.  This results into an `UNSUBSCRIBE` command being sent.
     *
     * @param {String} UIEvent UIEvent to be removed (e.g. `mousedown`)
     *
     * @return {undefined} undefined
     */
    value: function onRemoveUIEvent(UIEvent) {
      var index = this._UIEvents.indexOf(UIEvent);
      if (index !== -1) {
        this._unsubscribe(UIEvent);
        this._UIEvents.splice(index, 1);
      } else if (this._inDraw) {
        this._unsubscribe(UIEvent);
      }
      return this;
    }
  }, {
    key: '_subscribe',

    /**
     * Appends an `SUBSCRIBE` command to the command queue.
     *
     * @method
     * @private
     *
     * @param {String} uiEvent Event type (e.g. `click`)
     *
     * @return {undefined} undefined
     */
    value: function _subscribe(uiEvent) {
      if (this._initialized) {
        this._changeQueue.push(_coreCommands.Commands.SUBSCRIBE, uiEvent);
      }

      if (!this._requestingUpdate) this._requestUpdate();
    }
  }, {
    key: 'preventDefault',

    /**
     * When running in a worker, the browser's default action for specific events
     * can't be prevented on a case by case basis (via `e.preventDefault()`).
     * Instead this function should be used to register an event to be prevented by
     * default.
     *
     * @method
     *
     * @param  {String} uiEvent     UI Event (e.g. wheel) for which to prevent the
     *                              browser's default action (e.g. form submission,
     *                              scrolling)
     * @return {undefined}          undefined
     */
    value: function preventDefault(uiEvent) {
      if (this._initialized) {
        this._changeQueue.push(_coreCommands.Commands.PREVENT_DEFAULT, uiEvent);
      }
      if (!this._requestingUpdate) this._requestUpdate();
    }
  }, {
    key: 'allowDefault',

    /**
     * Opposite of {@link DOMElement#preventDefault}. No longer prevent the
     * browser's default action on subsequent events of this type.
     *
     * @method
     *
     * @param  {type} uiEvent       UI Event previously registered using
     *                              {@link DOMElement#preventDefault}.
     * @return {undefined}          undefined
     */
    value: function allowDefault(uiEvent) {
      if (this._initialized) {
        this._changeQueue.push(_coreCommands.Commands.ALLOW_DEFAULT, uiEvent);
      }

      if (!this._requestingUpdate) this._requestUpdate();
    }
  }, {
    key: '_unsubscribe',

    /**
     * Appends an `UNSUBSCRIBE` command to the command queue.
     *
     * @method
     * @private
     *
     * @param {String} UIEvent Event type (e.g. `click`)
     *
     * @return {undefined} undefined
     */
    value: function _unsubscribe(UIEvent) {
      if (this._initialized) {
        this._changeQueue.push(_coreCommands.Commands.UNSUBSCRIBE, UIEvent);
      }

      if (!this._requestingUpdate) this._requestUpdate();
    }
  }, {
    key: 'onSizeModeChange',

    /**
     * Method to be invoked by the node as soon as the underlying size mode
     * changes. This results into the size being fetched from the node in
     * order to update the actual, rendered size.
     *
     * @method
     *
     * @param {Number} x the sizing mode in use for determining size in the x direction
     * @param {Number} y the sizing mode in use for determining size in the y direction
     * @param {Number} z the sizing mode in use for determining size in the z direction
     *
     * @return {undefined} undefined
     */
    value: function onSizeModeChange(x, y, z) {
      if (x === _coreSize.Size.RENDER || y === _coreSize.Size.RENDER || z === _coreSize.Size.RENDER) {
        this._renderSized = true;
        this._requestRenderSize = true;
      }
      var size = this._node.getSize();
      this.onSizeChange(size[0], size[1]);
    }
  }, {
    key: 'getRenderSize',

    /**
     * Method to be retrieve the rendered size of the DOM element that is
     * drawn for this node.
     *
     * @method
     *
     * @return {Array} size of the rendered DOM element in pixels
     */
    value: function getRenderSize() {
      return this._renderSize;
    }
  }, {
    key: '_requestUpdate',

    /**
     * Method to have the component request an update from its Node
     *
     * @method
     * @private
     *
     * @return {undefined} undefined
     */
    value: function _requestUpdate() {
      if (!this._requestingUpdate && this._id) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }
    }
  }, {
    key: 'init',

    /**
     * Initializes the DOMElement by sending the `INIT_DOM` command. This creates
     * or reallocates a new Element in the actual DOM hierarchy.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function init() {
      this._changeQueue.push(_coreCommands.Commands.INIT_DOM, this._tagName);
      this._initialized = true;
      this.onTransformChange(_coreTransformSystem.TransformSystem.get(this._node.getLocation()));
      this.onOpacityChange(_coreOpacitySystem.OpacitySystem.get(this._node.getLocation()));
      var size = this._node.getSize();
      this.onSizeChange(size[0], size[1]);
      if (!this._requestingUpdate) this._requestUpdate();
    }
  }, {
    key: 'setId',

    /**
     * Sets the id attribute of the DOMElement.
     *
     * @method
     *
     * @param {String} id New id to be set
     *
     * @return {DOMElement} this
     */
    value: function setId(id) {
      this.setAttribute('id', id);
      return this;
    }
  }, {
    key: 'addClass',

    /**
     * Adds a new class to the internal class list of the underlying Element in the
     * DOM.
     *
     * @method
     *
     * @param {String} value New class name to be added
     *
     * @return {DOMElement} this
     */
    value: function addClass(value) {
      if (this._classes.indexOf(value) < 0) {
        if (this._initialized) this._changeQueue.push(_coreCommands.Commands.ADD_CLASS, value);
        this._classes.push(value);
        if (!this._requestingUpdate) this._requestUpdate();
        if (this._renderSized) this._requestRenderSize = true;
        return this;
      }

      if (this._inDraw) {
        if (this._initialized) this._changeQueue.push(_coreCommands.Commands.ADD_CLASS, value);
        if (!this._requestingUpdate) this._requestUpdate();
      }
      return this;
    }
  }, {
    key: 'removeClass',

    /**
     * Removes a class from the DOMElement's classList.
     *
     * @method
     *
     * @param {String} value Class name to be removed
     *
     * @return {DOMElement} this
     */
    value: function removeClass(value) {
      var index = this._classes.indexOf(value);

      if (index < 0) return this;

      this._changeQueue.push(_coreCommands.Commands.REMOVE_CLASS, value);

      this._classes.splice(index, 1);

      if (!this._requestingUpdate) this._requestUpdate();
      return this;
    }
  }, {
    key: 'hasClass',

    /**
     * Checks if the DOMElement has the passed in class.
     *
     * @method
     *
     * @param {String} value The class name
     *
     * @return {Boolean} Boolean value indicating whether the passed in class name is in the DOMElement's class list.
     */
    value: function hasClass(value) {
      return this._classes.indexOf(value) !== -1;
    }
  }, {
    key: 'setAttribute',

    /**
     * Sets an attribute of the DOMElement.
     *
     * @method
     *
     * @param {String} name Attribute key (e.g. `src`)
     * @param {String} value Attribute value (e.g. `http://famo.us`)
     *
     * @return {DOMElement} this
     */
    value: function setAttribute(name, value) {
      if (this._attributes[name] !== value || this._inDraw) {
        this._attributes[name] = value;
        if (this._initialized) this._changeQueue.push(_coreCommands.Commands.CHANGE_ATTRIBUTE, name, value);
        if (!this._requestUpdate) this._requestUpdate();
      }

      return this;
    }
  }, {
    key: 'setProperty',

    /**
     * Sets a CSS property
     *
     * @chainable
     *
     * @param {String} name  Name of the CSS rule (e.g. `background-color`)
     * @param {String} value Value of CSS property (e.g. `red`)
     *
     * @return {DOMElement} this
     */
    value: function setProperty(name, value) {
      if (this._styles[name] !== value || this._inDraw) {
        this._styles[name] = value;
        if (this._initialized) this._changeQueue.push(_coreCommands.Commands.CHANGE_PROPERTY, name, value);
        if (!this._requestingUpdate) this._requestUpdate();
        if (this._renderSized) this._requestRenderSize = true;
      }

      return this;
    }
  }, {
    key: 'setContent',

    /**
     * Sets the content of the DOMElement. This is using `innerHTML`, escaping user
     * generated content is therefore essential for security purposes.
     *
     * @method
     *
     * @param {String} content Content to be set using `.innerHTML = ...`
     *
     * @return {DOMElement} this
     */
    value: function setContent(content) {
      if (this._content !== content || this._inDraw) {
        this._content = content;
        if (this._initialized) this._changeQueue.push(_coreCommands.Commands.CHANGE_CONTENT, content);
        if (!this._requestingUpdate) this._requestUpdate();
        if (this._renderSized) this._requestRenderSize = true;
      }

      return this;
    }
  }, {
    key: 'on',

    /**
     * Subscribes to a DOMElement using.
     *
     * @method on
     *
     * @param {String} event       The event type (e.g. `click`).
     * @param {Function} listener  Handler function for the specified event type
     *                              in which the payload event object will be
     *                              passed into.
     *
     * @return {Function} A function to call if you want to remove the callback
     */
    value: function on(event, listener) {
      return this._callbacks.on(event, listener);
    }
  }, {
    key: 'onReceive',

    /**
     * Function to be invoked by the Node whenever an event is being received.
     * There are two different ways to subscribe for those events:
     *
     * 1. By overriding the onReceive method (and possibly using `switch` in order
     *     to differentiate between the different event types).
     * 2. By using DOMElement and using the built-in CallbackStore.
     *
     * @method
     *
     * @param {String} event Event type (e.g. `click`)
     * @param {Object} payload Event object.
     *
     * @return {undefined} undefined
     */
    value: function onReceive(event, payload) {
      if (event === 'resize') {
        this._renderSize[0] = payload.val[0];
        this._renderSize[1] = payload.val[1];
        if (!this._requestingUpdate) this._requestUpdate();
      }
      this._callbacks.trigger(event, payload);
    }
  }, {
    key: 'draw',

    /**
     * The draw function is being used in order to allow mutating the DOMElement
     * before actually mounting the corresponding node.
     *
     * @method
     * @private
     *
     * @return {undefined} undefined
     */
    value: function draw() {
      var key;
      var i;
      var len;

      this._inDraw = true;

      this.init();

      for (i = 0, len = this._classes.length; i < len; i++) this.addClass(this._classes[i]);

      if (this._content) this.setContent(this._content);

      for (key in this._styles) if (this._styles[key] != null) this.setProperty(key, this._styles[key]);

      for (key in this._attributes) if (this._attributes[key] != null) this.setAttribute(key, this._attributes[key]);

      for (i = 0, len = this._UIEvents.length; i < len; i++) this.onAddUIEvent(this._UIEvents[i]);

      this._inDraw = false;
    }
  }]);

  return DOMElement;
})();

exports.DOMElement = DOMElement;

},{"../core/Commands":6,"../core/OpacitySystem":12,"../core/Size":16,"../core/TransformSystem":19,"../utilities/CallbackStore":53}],21:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ElementCache = require('./ElementCache');

var _Math = require('./Math');

var math = _interopRequireWildcard(_Math);

var _corePath = require('../core/Path');

var _utilitiesVendorPrefix = require('../utilities/vendorPrefix');

var _utilitiesCallbackStore = require('../utilities/CallbackStore');

var _eventsEventMap = require('./events/EventMap');

var TRANSFORM = null;

/**
 * DOMRenderer is a class responsible for adding elements
 * to the DOM and writing to those elements.
 * There is a DOMRenderer per context, represented as an
 * element and a selector. It is instantiated in the
 * context class.
 *
 * @class DOMRenderer
 *
 * @param {HTMLElement} element an element.
 * @param {String} selector the selector of the element.
 * @param {Compositor} compositor the compositor controlling the renderer
 */

var DOMRenderer = (function () {
  function DOMRenderer(element, selector, compositor) {
    _classCallCheck(this, DOMRenderer);

    var _this = this;

    element.classList.add('famous-dom-renderer');

    TRANSFORM = TRANSFORM || (0, _utilitiesVendorPrefix.vendorPrefix)('transform');
    this._compositor = compositor; // a reference to the compositor

    this._target = null; // a register for holding the current
    // element that the Renderer is operating
    // upon

    this._parent = null; // a register for holding the parent
    // of the target

    this._path = null; // a register for holding the path of the target
    // this register must be set first, and then
    // children, target, and parent are all looked
    // up from that.

    this._children = []; // a register for holding the children of the
    // current target.

    this._insertElCallbackStore = new _utilitiesCallbackStore.CallbackStore();
    this._removeElCallbackStore = new _utilitiesCallbackStore.CallbackStore();

    this._root = new _ElementCache.ElementCache(element, selector); // the root
    // of the dom tree that this
    // renderer is responsible
    // for

    this._boundTriggerEvent = function (ev) {
      return _this._triggerEvent(ev);
    };

    this._selector = selector;

    this._elements = {};

    this._elements[selector] = this._root;

    this.perspectiveTransform = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    this._VPtransform = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

    this._lastEv = null;
  }

  /**
   * Attaches an EventListener to the element associated with the passed in path.
   * Prevents the default browser action on all subsequent events if
   * `preventDefault` is truthy.
   * All incoming events will be forwarded to the compositor by invoking the
   * `sendEvent` method.
   * Delegates events if possible by attaching the event listener to the context.
   *
   * @method
   *
   * @param {String} type DOM event type (e.g. click, mouseover).
   * @param {Boolean} preventDefault Whether or not the default browser action should be prevented.
   *
   * @return {undefined} undefined
   */

  _createClass(DOMRenderer, [{
    key: 'subscribe',
    value: function subscribe(type) {
      this._assertTargetLoaded();
      this._listen(type);
      this._target.subscribe[type] = true;
    }
  }, {
    key: 'preventDefault',

    /**
     * Used to preventDefault if an event of the specified type is being emitted on
     * the currently loaded target.
     *
     * @method
     *
     * @param  {String} type    The type of events that should be prevented.
     * @return {undefined}      undefined
     */
    value: function preventDefault(type) {
      this._assertTargetLoaded();
      this._listen(type);
      this._target.preventDefault[type] = true;
    }
  }, {
    key: 'allowDefault',

    /**
     * Used to undo a previous call to preventDefault. No longer `preventDefault`
     * for this event on the loaded target.
     *
     * @method
     * @private
     *
     * @param  {String} type    The event type that should no longer be affected by
     *                          `preventDefault`.
     * @return {undefined}      undefined
     */
    value: function allowDefault(type) {
      this._assertTargetLoaded();
      this._listen(type);
      this._target.preventDefault[type] = false;
    }
  }, {
    key: '_listen',

    /**
     * Internal helper function used for adding an event listener for the the
     * currently loaded ElementCache.
     *
     * If the event can be delegated as specified in the {@link EventMap}, the
     * bound {@link _triggerEvent} function will be added as a listener on the
     * root element. Otherwise, the listener will be added directly to the target
     * element.
     *
     * @private
     * @method
     *
     * @param  {String} type    The event type to listen to (e.g. click).
     * @return {undefined}      undefined
     */
    value: function _listen(type) {
      this._assertTargetLoaded();

      if (!this._target.listeners[type] && !this._root.listeners[type]) {
        // FIXME Add to content DIV if available
        var target = _eventsEventMap.EventMap[type][1] ? this._root : this._target;
        target.listeners[type] = this._boundTriggerEvent;
        target.element.addEventListener(type, this._boundTriggerEvent);
      }
    }
  }, {
    key: 'unsubscribe',

    /**
     * Unsubscribes from all events that are of the specified type.
     *
     * @method
     *
     * @param {String} type DOM event type (e.g. click, mouseover).
     * @return {undefined} undefined
     */
    value: function unsubscribe(type) {
      this._assertTargetLoaded();
      this._target.subscribe[type] = false;
    }
  }, {
    key: '_triggerEvent',

    /**
     * Function to be added using `addEventListener` to the corresponding
     * DOMElement.
     *
     * @method
     * @private
     *
     * @param {Event} ev DOM Event payload
     *
     * @return {undefined} undefined
     */
    value: function _triggerEvent(ev) {
      if (this._lastEv === ev) return;

      // Use ev.path, which is an array of Elements (polyfilled if needed).
      var evPath = ev.path ? ev.path : _getPath(ev);
      // First element in the path is the element on which the event has actually
      // been emitted.
      for (var i = 0; i < evPath.length; i++) {
        // Skip nodes that don't have a dataset property or data-fa-path
        // attribute.
        if (!evPath[i].dataset) continue;
        var path = evPath[i].dataset.faPath;
        if (!path) continue;

        // Optionally preventDefault. This needs forther consideration and
        // should be optional. Eventually this should be a separate command/
        // method.
        if (this._elements[path].preventDefault[ev.type]) {
          ev.preventDefault();
        }

        // Stop further event propogation and path traversal as soon as the
        // first ElementCache subscribing for the emitted event has been found.
        if (this._elements[path] && this._elements[path].subscribe[ev.type]) {
          this._lastEv = ev;

          var NormalizedEventConstructor = _eventsEventMap.EventMap[ev.type][0];

          // Finally send the event to the Worker Thread through the
          // compositor.
          this._compositor.sendEvent(path, ev.type, new NormalizedEventConstructor(ev));

          break;
        }
      }
    }
  }, {
    key: 'getSizeOf',

    /**
     * getSizeOf gets the dom size of a particular DOM element.  This is
     * needed for render sizing in the scene graph.
     *
     * @method
     *
     * @param {String} path path of the Node in the scene graph
     *
     * @return {Array} a vec3 of the offset size of the dom element
     */
    value: function getSizeOf(path) {
      var element = this._elements[path];
      if (!element) return null;

      var res = {
        val: element.size
      };
      this._compositor.sendEvent(path, 'resize', res);
      return res;
    }
  }, {
    key: 'draw',

    /**
     * Executes the retrieved draw commands. Draw commands only refer to the
     * cross-browser normalized `transform` property.
     *
     * @method
     *
     * @param {Object} renderState description
     *
     * @return {undefined} undefined
     */
    value: function draw(renderState) {
      if (renderState.perspectiveDirty) {
        this.perspectiveDirty = true;

        this.perspectiveTransform[0] = renderState.perspectiveTransform[0];
        this.perspectiveTransform[1] = renderState.perspectiveTransform[1];
        this.perspectiveTransform[2] = renderState.perspectiveTransform[2];
        this.perspectiveTransform[3] = renderState.perspectiveTransform[3];

        this.perspectiveTransform[4] = renderState.perspectiveTransform[4];
        this.perspectiveTransform[5] = renderState.perspectiveTransform[5];
        this.perspectiveTransform[6] = renderState.perspectiveTransform[6];
        this.perspectiveTransform[7] = renderState.perspectiveTransform[7];

        this.perspectiveTransform[8] = renderState.perspectiveTransform[8];
        this.perspectiveTransform[9] = renderState.perspectiveTransform[9];
        this.perspectiveTransform[10] = renderState.perspectiveTransform[10];
        this.perspectiveTransform[11] = renderState.perspectiveTransform[11];

        this.perspectiveTransform[12] = renderState.perspectiveTransform[12];
        this.perspectiveTransform[13] = renderState.perspectiveTransform[13];
        this.perspectiveTransform[14] = renderState.perspectiveTransform[14];
        this.perspectiveTransform[15] = renderState.perspectiveTransform[15];
      }

      if (renderState.viewDirty || renderState.perspectiveDirty) {
        math.multiply(this._VPtransform, this.perspectiveTransform, renderState.viewTransform);
        this._root.element.style[TRANSFORM] = this._stringifyMatrix(this._VPtransform);
      }
    }
  }, {
    key: '_assertPathLoaded',

    /**
     * Internal helper function used for ensuring that a path is currently loaded.
     *
     * @method
     * @private
     *
     * @return {undefined} undefined
     */
    value: function _assertPathLoaded() {
      if (!this._path) throw new Error('path not loaded');
    }
  }, {
    key: '_assertParentLoaded',

    /**
     * Internal helper function used for ensuring that a parent is currently loaded.
     *
     * @method
     * @private
     *
     * @return {undefined} undefined
     */
    value: function _assertParentLoaded() {
      if (!this._parent) throw new Error('parent not loaded');
    }
  }, {
    key: '_assertChildrenLoaded',

    /**
     * Internal helper function used for ensuring that children are currently
     * loaded.
     *
     * @method
     * @private
     *
     * @return {undefined} undefined
     */
    value: function _assertChildrenLoaded() {
      if (!this._children) throw new Error('children not loaded');
    }
  }, {
    key: '_assertTargetLoaded',

    /**
     * Internal helper function used for ensuring that a target is currently loaded.
     *
     * @method  _assertTargetLoaded
     *
     * @return {undefined} undefined
     */
    value: function _assertTargetLoaded() {
      if (!this._target) throw new Error('No target loaded');
    }
  }, {
    key: 'findParent',

    /**
     * Finds and sets the parent of the currently loaded element (path).
     *
     * @method
     * @private
     *
     * @return {ElementCache} Parent element.
     */
    value: function findParent() {
      this._assertPathLoaded();

      var path = this._path;
      var parent;

      while (!parent && path.length) {
        path = path.substring(0, path.lastIndexOf('/'));
        parent = this._elements[path];
      }

      this._parent = parent;
      return parent;
    }
  }, {
    key: 'findTarget',

    /**
     * Used for determining the target loaded under the current path.
     *
     * @method
     * @deprecated
     *
     * @return {ElementCache|undefined} Element loaded under defined path.
     */
    value: function findTarget() {
      this._target = this._elements[this._path];
      return this._target;
    }
  }, {
    key: 'loadPath',

    /**
     * Loads the passed in path into the DOMRenderer.
     *
     * @method
     *
     * @param {String} path Path to be loaded
     *
     * @return {String} Loaded path
     */
    value: function loadPath(path) {
      this._path = path;
      this._target = this._elements[this._path];
      return this._path;
    }
  }, {
    key: 'resolveChildren',

    /**
     * Finds children of a parent element that are descendents of a inserted element in the scene
     * graph. Appends those children to the inserted element.
     *
     * @method resolveChildren
     * @return {void}
     *
     * @param {HTMLElement} element the inserted element
     * @param {HTMLElement} parent the parent of the inserted element
     */
    value: function resolveChildren(element, parent) {
      var i = 0;
      var childNode;
      var path = this._path;
      var childPath;

      while (childNode = parent.childNodes[i]) {
        if (!childNode.dataset) {
          i++;
          continue;
        }
        childPath = childNode.dataset.faPath;
        if (!childPath) {
          i++;
          continue;
        }
        if (_corePath.Path.isDescendentOf(childPath, path)) element.appendChild(childNode);else i++;
      }
    }
  }, {
    key: 'insertEl',

    /**
     * Inserts a DOMElement at the currently loaded path, assuming no target is
     * loaded. Only one DOMElement can be associated with each path.
     *
     * @method
     *
     * @param {String} tagName Tag name (capitalization will be normalized).
     *
     * @return {undefined} undefined
     */
    value: function insertEl(tagName) {

      this.findParent();

      this._assertParentLoaded();

      if (this._parent['void']) throw new Error(this._parent.path + ' is a void element. ' + 'Void elements are not allowed to have children.');

      if (!this._target) this._target = new _ElementCache.ElementCache(document.createElement(tagName), this._path);

      var el = this._target.element;
      var parent = this._parent.element;

      this.resolveChildren(el, parent);

      parent.appendChild(el);
      this._elements[this._path] = this._target;

      this._insertElCallbackStore.trigger(this._path, this._target);
    }
  }, {
    key: 'setProperty',

    /**
     * Sets a property on the currently loaded target.
     *
     * @method
     *
     * @param {String} name Property name (e.g. background, color, font)
     * @param {String} value Proprty value (e.g. black, 20px)
     *
     * @return {undefined} undefined
     */
    value: function setProperty(name, value) {
      this._assertTargetLoaded();
      this._target.element.style[name] = value;
    }
  }, {
    key: 'setSize',

    /**
     * Sets the size of the currently loaded target.
     * Removes any explicit sizing constraints when passed in `false`
     * ("true-sizing").
     *
     * Invoking setSize is equivalent to a manual invocation of `setWidth` followed
     * by `setHeight`.
     *
     * @method
     *
     * @param {Number|false} width   Width to be set.
     * @param {Number|false} height  Height to be set.
     *
     * @return {undefined} undefined
     */
    value: function setSize(width, height) {
      this._assertTargetLoaded();

      this.setWidth(width);
      this.setHeight(height);
    }
  }, {
    key: 'setWidth',

    /**
     * Sets the width of the currently loaded ElementCache.
     *
     * @method
     *
     * @param  {Number|false} width     The explicit width to be set on the
     *                                  ElementCache's target (and content) element.
     *                                  `false` removes any explicit sizing
     *                                  constraints from the underlying DOM
     *                                  Elements.
     *
     * @return {undefined} undefined
     */
    value: function setWidth(width) {
      this._assertTargetLoaded();

      var contentWrapper = this._target.content;

      if (width === false) {
        this._target.explicitWidth = true;
        if (contentWrapper) contentWrapper.style.width = '';
        width = contentWrapper ? contentWrapper.offsetWidth : 0;
        this._target.element.style.width = width + 'px';
      } else {
        this._target.explicitWidth = false;
        if (contentWrapper) contentWrapper.style.width = width + 'px';
        this._target.element.style.width = width + 'px';
      }

      this._target.size[0] = width;
    }
  }, {
    key: 'setHeight',

    /**
     * Sets the height of the currently loaded ElementCache.
     *
     * @method  setHeight
     *
     * @param  {Number|false} height    The explicit height to be set on the
     *                                  ElementCache's target (and content) element.
     *                                  `false` removes any explicit sizing
     *                                  constraints from the underlying DOM
     *                                  Elements.
     *
     * @return {undefined} undefined
     */
    value: function setHeight(height) {
      this._assertTargetLoaded();

      var contentWrapper = this._target.content;

      if (height === false) {
        this._target.explicitHeight = true;
        if (contentWrapper) contentWrapper.style.height = '';
        height = contentWrapper ? contentWrapper.offsetHeight : 0;
        this._target.element.style.height = height + 'px';
      } else {
        this._target.explicitHeight = false;
        if (contentWrapper) contentWrapper.style.height = height + 'px';
        this._target.element.style.height = height + 'px';
      }

      this._target.size[1] = height;
    }
  }, {
    key: 'setAttribute',

    /**
     * Sets an attribute on the currently loaded target.
     *
     * @method
     *
     * @param {String} name Attribute name (e.g. href)
     * @param {String} value Attribute value (e.g. http://famous.org)
     *
     * @return {undefined} undefined
     */
    value: function setAttribute(name, value) {
      this._assertTargetLoaded();
      this._target.element.setAttribute(name, value);
    }
  }, {
    key: 'setContent',

    /**
     * Sets the `innerHTML` content of the currently loaded target.
     *
     * @method
     *
     * @param {String} content Content to be set as `innerHTML`
     *
     * @return {undefined} undefined
     */
    value: function setContent(content) {
      this._assertTargetLoaded();

      if (this._target.formElement) {
        this._target.element.value = content;
      } else {
        if (!this._target.content) {
          this._target.content = document.createElement('div');
          this._target.content.classList.add('famous-dom-element-content');
          this._target.element.insertBefore(this._target.content, this._target.element.firstChild);
        }
        this._target.content.innerHTML = content;
      }

      this.setSize(this._target.explicitWidth ? false : this._target.size[0], this._target.explicitHeight ? false : this._target.size[1]);
    }
  }, {
    key: 'setMatrix',

    /**
     * Sets the passed in transform matrix (world space). Inverts the parent's world
     * transform.
     *
     * @method
     *
     * @param {Float32Array} transform The transform for the loaded DOM Element in world space
     *
     * @return {undefined} undefined
     */
    value: function setMatrix(transform) {
      this._assertTargetLoaded();
      this._target.element.style[TRANSFORM] = this._stringifyMatrix(transform);
    }
  }, {
    key: 'addClass',

    /**
     * Adds a class to the classList associated with the currently loaded target.
     *
     * @method
     *
     * @param {String} domClass Class name to be added to the current target.
     *
     * @return {undefined} undefined
     */
    value: function addClass(domClass) {
      this._assertTargetLoaded();
      this._target.element.classList.add(domClass);
    }
  }, {
    key: 'removeClass',

    /**
     * Removes a class from the classList associated with the currently loaded
     * target.
     *
     * @method
     *
     * @param {String} domClass Class name to be removed from currently loaded target.
     *
     * @return {undefined} undefined
     */
    value: function removeClass(domClass) {
      this._assertTargetLoaded();
      this._target.element.classList.remove(domClass);
    }
  }, {
    key: '_stringifyMatrix',

    /**
     * Stringifies the passed in matrix for setting the `transform` property.
     *
     * @method  _stringifyMatrix
     * @private
     *
     * @param {Array} m    Matrix as an array or array-like object.
     * @return {String}     Stringified matrix as `matrix3d`-property.
     */
    value: function _stringifyMatrix(m) {
      var r = 'matrix3d(';

      r += m[0] < 0.000001 && m[0] > -0.000001 ? '0,' : m[0] + ',';
      r += m[1] < 0.000001 && m[1] > -0.000001 ? '0,' : m[1] + ',';
      r += m[2] < 0.000001 && m[2] > -0.000001 ? '0,' : m[2] + ',';
      r += m[3] < 0.000001 && m[3] > -0.000001 ? '0,' : m[3] + ',';
      r += m[4] < 0.000001 && m[4] > -0.000001 ? '0,' : m[4] + ',';
      r += m[5] < 0.000001 && m[5] > -0.000001 ? '0,' : m[5] + ',';
      r += m[6] < 0.000001 && m[6] > -0.000001 ? '0,' : m[6] + ',';
      r += m[7] < 0.000001 && m[7] > -0.000001 ? '0,' : m[7] + ',';
      r += m[8] < 0.000001 && m[8] > -0.000001 ? '0,' : m[8] + ',';
      r += m[9] < 0.000001 && m[9] > -0.000001 ? '0,' : m[9] + ',';
      r += m[10] < 0.000001 && m[10] > -0.000001 ? '0,' : m[10] + ',';
      r += m[11] < 0.000001 && m[11] > -0.000001 ? '0,' : m[11] + ',';
      r += m[12] < 0.000001 && m[12] > -0.000001 ? '0,' : m[12] + ',';
      r += m[13] < 0.000001 && m[13] > -0.000001 ? '0,' : m[13] + ',';
      r += m[14] < 0.000001 && m[14] > -0.000001 ? '0,' : m[14] + ',';

      r += m[15] + ')';
      return r;
    }
  }, {
    key: 'onInsertEl',

    /**
     * Registers a function to be executed when a new element is being inserted at
     * the specified path.
     *
     * @method
     *
     * @param  {String}   path      Path at which to listen for element insertion.
     * @param  {Function} callback  Function to be executed when an insertion
     *                              occurs.
     * @return {DOMRenderer}        this
     */
    value: function onInsertEl(path, callback) {
      this._insertElCallbackStore.on(path, callback);
      return this;
    }
  }, {
    key: 'offInsertEl',

    /**
     * Deregisters a listener function to be no longer executed on future element
     * insertions at the specified path.
     *
     * @method
     *
     * @param  {String}   path      Path at which the listener function has been
     *                              registered.
     * @param  {Function} callback  Callback function to be deregistered.
     * @return {DOMRenderer}        this
     */
    value: function offInsertEl(path, callback) {
      this._insertElCallbackStore.off(path, callback);
      return this;
    }
  }, {
    key: 'onRemoveEl',

    /**
     * Registers an event handler to be triggered as soon as an element at the
     * specified path is being removed.
     *
     * @method
     *
     * @param  {String}   path      Path at which to listen for the removal of an
     *                              element.
     * @param  {Function} callback  Function to be executed when an element is
     *                              being removed at the specified path.
     * @return {DOMRenderer}        this
     */
    value: function onRemoveEl(path, callback) {
      this._removeElCallbackStore.on(path, callback);
      return this;
    }
  }, {
    key: 'offRemoveEl',

    /**
     * Deregisters a listener function to be no longer executed when an element is
     * being removed from the specified path.
     *
     * @method
     *
     * @param  {String}   path      Path at which the listener function has been
     *                              registered.
     * @param  {Function} callback  Callback function to be deregistered.
     * @return {DOMRenderer}        this
     */
    value: function offRemoveEl(path, callback) {
      this._removeElCallbackStore.off(path, callback);
      return this;
    }
  }]);

  return DOMRenderer;
})();

function _getPath(ev) {
  // TODO move into _triggerEvent, avoid object allocation
  var path = [];
  var node = ev.target;
  while (node !== document.body) {
    path.push(node);
    node = node.parentNode;
  }
  return path;
}

exports.DOMRenderer = DOMRenderer;

},{"../core/Path":13,"../utilities/CallbackStore":53,"../utilities/vendorPrefix":58,"./ElementCache":22,"./Math":23,"./events/EventMap":27}],22:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _VoidElements = require('./VoidElements');

/**
 * ElementCache is being used for keeping track of an element's DOM Element,
 * path, world transform, inverted parent, final transform (as being used for
 * setting the actual `transform`-property) and post render size (final size as
 * being rendered to the DOM).
 *
 * @class ElementCache
 *
 * @param {Element} element DOMElement
 * @param {String} path Path used for uniquely identifying the location in the
 *                      scene graph.
 */

var ElementCache = function ElementCache(element, path) {
  _classCallCheck(this, ElementCache);

  this.tagName = element.tagName.toLowerCase();
  this['void'] = _VoidElements.VoidElements[this.tagName];

  var constructor = element.constructor;

  this.formElement = constructor === HTMLInputElement || constructor === HTMLTextAreaElement || constructor === HTMLSelectElement;

  this.element = element;
  this.path = path;
  this.content = null;
  this.size = new Int16Array(3);
  this.explicitHeight = false;
  this.explicitWidth = false;
  this.postRenderSize = new Float32Array(2);
  this.listeners = {};
  this.preventDefault = {};
  this.subscribe = {};
};

exports.ElementCache = ElementCache;

},{"./VoidElements":24}],23:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * A method for inverting a transform matrix
 *
 * @method
 *
 * @param {Array} out array to store the return of the inversion
 * @param {Array} a transform matrix to inverse
 *
 * @return {Array} out
 *   output array that is storing the transform matrix
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
var invert = function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3],
      a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7],
      a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11],
      a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15],
      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,

  // Calculate the determinant
  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
};

/**
 * A method for multiplying two matricies
 *
 * @method
 *
 * @param {Array} out array to store the return of the multiplication
 * @param {Array} a transform matrix to multiply
 * @param {Array} b transform matrix to multiply
 *
 * @return {Array} out
 *   output array that is storing the transform matrix
 */
var multiply = function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3],
      a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7],
      a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11],
      a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15],
      b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3],
      b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7],
      b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11],
      b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];

  var changed = false;
  var out0, out1, out2, out3;

  out0 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out1 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out2 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out3 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  changed = changed ? changed : out0 === out[0] || out1 === out[1] || out2 === out[2] || out3 === out[3];

  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = out3;

  b0 = b4;
  b1 = b5;
  b2 = b6;
  b3 = b7;
  out0 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out1 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out2 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out3 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  changed = changed ? changed : out0 === out[4] || out1 === out[5] || out2 === out[6] || out3 === out[7];

  out[4] = out0;
  out[5] = out1;
  out[6] = out2;
  out[7] = out3;

  b0 = b8;
  b1 = b9;
  b2 = b10;
  b3 = b11;
  out0 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out1 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out2 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out3 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  changed = changed ? changed : out0 === out[8] || out1 === out[9] || out2 === out[10] || out3 === out[11];

  out[8] = out0;
  out[9] = out1;
  out[10] = out2;
  out[11] = out3;

  b0 = b12;
  b1 = b13;
  b2 = b14;
  b3 = b15;
  out0 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out1 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out2 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out3 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  changed = changed ? changed : out0 === out[12] || out1 === out[13] || out2 === out[14] || out3 === out[15];

  out[12] = out0;
  out[13] = out1;
  out[14] = out2;
  out[15] = out3;

  return out;
};

exports.invert = invert;
exports.multiply = multiply;

},{}],24:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * Map of void elements as defined by the
 * [HTML5 spec](http://www.w3.org/TR/html5/syntax.html#elements-0).
 *
 * @type {Object}
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
var VoidElements = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};

exports.VoidElements = VoidElements;

},{}],25:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _UIEvent2 = require('./UIEvent');

/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#events-compositionevents).
 *
 * @class CompositionEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */

var CompositionEvent = (function (_UIEvent) {
  _inherits(CompositionEvent, _UIEvent);

  function CompositionEvent(ev) {
    _classCallCheck(this, CompositionEvent);

    // [Constructor(DOMString typeArg, optional CompositionEventInit compositionEventInitDict)]
    // interface CompositionEvent : UIEvent {
    //     readonly    attribute DOMString data;
    // };

    _get(Object.getPrototypeOf(CompositionEvent.prototype), 'constructor', this).call(this, ev);

    /**
     * @name CompositionEvent#data
     * @type String
     */
    this.data = ev.data;
  }

  /**
   * Return the name of the event type
   *
   * @method
   *
   * @return {String} Name of the event type
   */

  _createClass(CompositionEvent, [{
    key: 'toString',
    value: function toString() {
      return 'CompositionEvent';
    }
  }]);

  return CompositionEvent;
})(_UIEvent2.UIEvent);

exports.CompositionEvent = CompositionEvent;

},{"./UIEvent":33}],26:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * The Event class is being used in order to normalize native DOM events.
 * Events need to be normalized in order to be serialized through the structured
 * cloning algorithm used by the `postMessage` method (Web Workers).
 *
 * Wrapping DOM events also has the advantage of providing a consistent
 * interface for interacting with DOM events across browsers by copying over a
 * subset of the exposed properties that is guaranteed to be consistent across
 * browsers.
 *
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#interface-Event).
 *
 * @class Event
 *
 * @param {Event} ev The native DOM event.
 */
Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Event = (function () {
    function Event(ev) {
        _classCallCheck(this, Event);

        // [Constructor(DOMString type, optional EventInit eventInitDict),
        //  Exposed=Window,Worker]
        // interface Event {
        //   readonly attribute DOMString type;
        //   readonly attribute EventTarget? target;
        //   readonly attribute EventTarget? currentTarget;

        //   const unsigned short NONE = 0;
        //   const unsigned short CAPTURING_PHASE = 1;
        //   const unsigned short AT_TARGET = 2;
        //   const unsigned short BUBBLING_PHASE = 3;
        //   readonly attribute unsigned short eventPhase;

        //   void stopPropagation();
        //   void stopImmediatePropagation();

        //   readonly attribute boolean bubbles;
        //   readonly attribute boolean cancelable;
        //   void preventDefault();
        //   readonly attribute boolean defaultPrevented;

        //   [Unforgeable] readonly attribute boolean isTrusted;
        //   readonly attribute DOMTimeStamp timeStamp;

        //   void initEvent(DOMString type, boolean bubbles, boolean cancelable);
        // };

        /**
         * @name Event#type
         * @type String
         */
        this.type = ev.type;

        /**
         * @name Event#defaultPrevented
         * @type Boolean
         */
        this.defaultPrevented = ev.defaultPrevented;

        /**
         * @name Event#timeStamp
         * @type Number
         */
        this.timeStamp = ev.timeStamp;

        /**
         * Used for exposing the current target's value.
         *
         * @name Event#value
         * @type String
         */
        var targetConstructor = ev.target.constructor;
        // TODO Support HTMLKeygenElement
        if (targetConstructor === HTMLInputElement || targetConstructor === HTMLTextAreaElement || targetConstructor === HTMLSelectElement) {
            this.value = ev.target.value;
        }
    }

    /**
     * Return the name of the event type
     *
     * @method
     *
     * @return {String} Name of the event type
     */

    _createClass(Event, [{
        key: 'toString',
        value: function toString() {
            return 'Event';
        }
    }]);

    return Event;
})();

exports.Event = Event;

},{}],27:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CompositionEvent = require('./CompositionEvent');

var _Event = require('./Event');

var _FocusEvent = require('./FocusEvent');

var _InputEvent = require('./InputEvent');

var _KeyboardEvent = require('./KeyboardEvent');

var _MouseEvent = require('./MouseEvent');

var _TouchEvent = require('./TouchEvent');

var _UIEvent = require('./UIEvent');

var _WheelEvent = require('./WheelEvent');

/**
 * A mapping of DOM events to the corresponding handlers
 *
 * @name EventMap
 * @type Object
 */
var EventMap = {
  change: [_Event.Event, true],
  submit: [_Event.Event, true],

  // UI Events (http://www.w3.org/TR/uievents/)
  abort: [_Event.Event, false],
  beforeinput: [_InputEvent.InputEvent, true],
  blur: [_FocusEvent.FocusEvent, false],
  click: [_MouseEvent.MouseEvent, true],
  compositionend: [_CompositionEvent.CompositionEvent, true],
  compositionstart: [_CompositionEvent.CompositionEvent, true],
  compositionupdate: [_CompositionEvent.CompositionEvent, true],
  dblclick: [_MouseEvent.MouseEvent, true],
  focus: [_FocusEvent.FocusEvent, false],
  focusin: [_FocusEvent.FocusEvent, true],
  focusout: [_FocusEvent.FocusEvent, true],
  input: [_InputEvent.InputEvent, true],
  keydown: [_KeyboardEvent.KeyboardEvent, true],
  keyup: [_KeyboardEvent.KeyboardEvent, true],
  load: [_Event.Event, false],
  mousedown: [_MouseEvent.MouseEvent, true],
  mouseenter: [_MouseEvent.MouseEvent, false],
  mouseleave: [_MouseEvent.MouseEvent, false],

  // bubbles, but will be triggered very frequently
  mousemove: [_MouseEvent.MouseEvent, false],

  mouseout: [_MouseEvent.MouseEvent, true],
  mouseover: [_MouseEvent.MouseEvent, true],
  mouseup: [_MouseEvent.MouseEvent, true],
  contextMenu: [_MouseEvent.MouseEvent, true],
  resize: [_UIEvent.UIEvent, false],

  // might bubble
  scroll: [_UIEvent.UIEvent, false],

  select: [_Event.Event, true],
  unload: [_Event.Event, false],
  wheel: [_WheelEvent.WheelEvent, true],

  // Touch Events Extension (http://www.w3.org/TR/touch-events-extensions/)
  touchcancel: [_TouchEvent.TouchEvent, true],
  touchend: [_TouchEvent.TouchEvent, true],
  touchmove: [_TouchEvent.TouchEvent, true],
  touchstart: [_TouchEvent.TouchEvent, true]
};

exports.EventMap = EventMap;

},{"./CompositionEvent":25,"./Event":26,"./FocusEvent":28,"./InputEvent":29,"./KeyboardEvent":30,"./MouseEvent":31,"./TouchEvent":32,"./UIEvent":33,"./WheelEvent":34}],28:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _UIEvent2 = require('./UIEvent');

/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#events-focusevent).
 *
 * @class FocusEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */

var FocusEvent = (function (_UIEvent) {
  _inherits(FocusEvent, _UIEvent);

  function FocusEvent(ev) {
    _classCallCheck(this, FocusEvent);

    // [Constructor(DOMString typeArg, optional FocusEventInit focusEventInitDict)]
    // interface FocusEvent : UIEvent {
    //     readonly    attribute EventTarget? relatedTarget;
    // };

    _get(Object.getPrototypeOf(FocusEvent.prototype), 'constructor', this).call(this, ev);
  }

  /**
   * Return the name of the event type
   *
   * @method
   *
   * @return {String} Name of the event type
   */

  _createClass(FocusEvent, [{
    key: 'toString',
    value: function toString() {
      return 'FocusEvent';
    }
  }]);

  return FocusEvent;
})(_UIEvent2.UIEvent);

exports.FocusEvent = FocusEvent;

},{"./UIEvent":33}],29:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _UIEvent2 = require('./UIEvent');

/**
 * See [Input Events](http://w3c.github.io/editing-explainer/input-events.html#idl-def-InputEvent).
 *
 * @class InputEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */

var InputEvent = (function (_UIEvent) {
  _inherits(InputEvent, _UIEvent);

  function InputEvent(ev) {
    _classCallCheck(this, InputEvent);

    // [Constructor(DOMString typeArg, optional InputEventInit inputEventInitDict)]
    // interface InputEvent : UIEvent {
    //     readonly    attribute DOMString inputType;
    //     readonly    attribute DOMString data;
    //     readonly    attribute boolean   isComposing;
    //     readonly    attribute Range     targetRange;
    // };

    _get(Object.getPrototypeOf(InputEvent.prototype), 'constructor', this).call(this, ev);

    /**
     * @name    InputEvent#inputType
     * @type    String
     */
    this.inputType = ev.inputType;

    /**
     * @name    InputEvent#data
     * @type    String
     */
    this.data = ev.data;

    /**
     * @name    InputEvent#isComposing
     * @type    Boolean
     */
    this.isComposing = ev.isComposing;

    /**
     * **Limited browser support**.
     *
     * @name    InputEvent#targetRange
     * @type    Boolean
     */
    this.targetRange = ev.targetRange;
  }

  /**
   * Return the name of the event type
   *
   * @method
   *
   * @return {String} Name of the event type
   */

  _createClass(InputEvent, [{
    key: 'toString',
    value: function toString() {
      return 'InputEvent';
    }
  }]);

  return InputEvent;
})(_UIEvent2.UIEvent);

exports.InputEvent = InputEvent;

},{"./UIEvent":33}],30:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _UIEvent2 = require('./UIEvent');

/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#events-keyboardevents).
 *
 * @class KeyboardEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */

var KeyboardEvent = (function (_UIEvent) {
  _inherits(KeyboardEvent, _UIEvent);

  function KeyboardEvent(ev) {
    _classCallCheck(this, KeyboardEvent);

    // [Constructor(DOMString typeArg, optional KeyboardEventInit keyboardEventInitDict)]
    // interface KeyboardEvent : UIEvent {
    //     // KeyLocationCode
    //     const unsigned long DOM_KEY_LOCATION_STANDARD = 0x00;
    //     const unsigned long DOM_KEY_LOCATION_LEFT = 0x01;
    //     const unsigned long DOM_KEY_LOCATION_RIGHT = 0x02;
    //     const unsigned long DOM_KEY_LOCATION_NUMPAD = 0x03;
    //     readonly    attribute DOMString     key;
    //     readonly    attribute DOMString     code;
    //     readonly    attribute unsigned long location;
    //     readonly    attribute boolean       ctrlKey;
    //     readonly    attribute boolean       shiftKey;
    //     readonly    attribute boolean       altKey;
    //     readonly    attribute boolean       metaKey;
    //     readonly    attribute boolean       repeat;
    //     readonly    attribute boolean       isComposing;
    //     boolean getModifierState (DOMString keyArg);
    // };

    _get(Object.getPrototypeOf(KeyboardEvent.prototype), 'constructor', this).call(this, ev);

    /**
     * @name KeyboardEvent#DOM_KEY_LOCATION_STANDARD
     * @type Number
     */
    this.DOM_KEY_LOCATION_STANDARD = 0x00;

    /**
     * @name KeyboardEvent#DOM_KEY_LOCATION_LEFT
     * @type Number
     */
    this.DOM_KEY_LOCATION_LEFT = 0x01;

    /**
     * @name KeyboardEvent#DOM_KEY_LOCATION_RIGHT
     * @type Number
     */
    this.DOM_KEY_LOCATION_RIGHT = 0x02;

    /**
     * @name KeyboardEvent#DOM_KEY_LOCATION_NUMPAD
     * @type Number
     */
    this.DOM_KEY_LOCATION_NUMPAD = 0x03;

    /**
     * @name KeyboardEvent#key
     * @type String
     */
    this.key = ev.key;

    /**
     * @name KeyboardEvent#code
     * @type String
     */
    this.code = ev.code;

    /**
     * @name KeyboardEvent#location
     * @type Number
     */
    this.location = ev.location;

    /**
     * @name KeyboardEvent#ctrlKey
     * @type Boolean
     */
    this.ctrlKey = ev.ctrlKey;

    /**
     * @name KeyboardEvent#shiftKey
     * @type Boolean
     */
    this.shiftKey = ev.shiftKey;

    /**
     * @name KeyboardEvent#altKey
     * @type Boolean
     */
    this.altKey = ev.altKey;

    /**
     * @name KeyboardEvent#metaKey
     * @type Boolean
     */
    this.metaKey = ev.metaKey;

    /**
     * @name KeyboardEvent#repeat
     * @type Boolean
     */
    this.repeat = ev.repeat;

    /**
     * @name KeyboardEvent#isComposing
     * @type Boolean
     */
    this.isComposing = ev.isComposing;

    /**
     * @name KeyboardEvent#keyCode
     * @type String
     * @deprecated
     */
    this.keyCode = ev.keyCode;
  }

  /**
   * Return the name of the event type
   *
   * @method
   *
   * @return {String} Name of the event type
   */

  _createClass(KeyboardEvent, [{
    key: 'toString',
    value: function toString() {
      return 'KeyboardEvent';
    }
  }]);

  return KeyboardEvent;
})(_UIEvent2.UIEvent);

exports.KeyboardEvent = KeyboardEvent;

},{"./UIEvent":33}],31:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _UIEvent2 = require('./UIEvent');

/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#events-mouseevents).
 *
 * @class KeyboardEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */

var MouseEvent = (function (_UIEvent) {
  _inherits(MouseEvent, _UIEvent);

  function MouseEvent(ev) {
    _classCallCheck(this, MouseEvent);

    // [Constructor(DOMString typeArg, optional MouseEventInit mouseEventInitDict)]
    // interface MouseEvent : UIEvent {
    //     readonly    attribute long           screenX;
    //     readonly    attribute long           screenY;
    //     readonly    attribute long           clientX;
    //     readonly    attribute long           clientY;
    //     readonly    attribute boolean        ctrlKey;
    //     readonly    attribute boolean        shiftKey;
    //     readonly    attribute boolean        altKey;
    //     readonly    attribute boolean        metaKey;
    //     readonly    attribute short          button;
    //     readonly    attribute EventTarget?   relatedTarget;
    //     // Introduced in this specification
    //     readonly    attribute unsigned short buttons;
    //     boolean getModifierState (DOMString keyArg);
    // };

    _get(Object.getPrototypeOf(MouseEvent.prototype), 'constructor', this).call(this, ev);

    /**
     * @name MouseEvent#screenX
     * @type Number
     */
    this.screenX = ev.screenX;

    /**
     * @name MouseEvent#screenY
     * @type Number
     */
    this.screenY = ev.screenY;

    /**
     * @name MouseEvent#clientX
     * @type Number
     */
    this.clientX = ev.clientX;

    /**
     * @name MouseEvent#clientY
     * @type Number
     */
    this.clientY = ev.clientY;

    /**
     * @name MouseEvent#ctrlKey
     * @type Boolean
     */
    this.ctrlKey = ev.ctrlKey;

    /**
     * @name MouseEvent#shiftKey
     * @type Boolean
     */
    this.shiftKey = ev.shiftKey;

    /**
     * @name MouseEvent#altKey
     * @type Boolean
     */
    this.altKey = ev.altKey;

    /**
     * @name MouseEvent#metaKey
     * @type Boolean
     */
    this.metaKey = ev.metaKey;

    /**
     * @type MouseEvent#button
     * @type Number
     */
    this.button = ev.button;

    /**
     * @type MouseEvent#buttons
     * @type Number
     */
    this.buttons = ev.buttons;

    /**
     * @type MouseEvent#pageX
     * @type Number
     */
    this.pageX = ev.pageX;

    /**
     * @type MouseEvent#pageY
     * @type Number
     */
    this.pageY = ev.pageY;

    /**
     * @type MouseEvent#x
     * @type Number
     */
    this.x = ev.x;

    /**
     * @type MouseEvent#y
     * @type Number
     */
    this.y = ev.y;

    /**
     * @type MouseEvent#offsetX
     * @type Number
     */
    this.offsetX = ev.offsetX;

    /**
     * @type MouseEvent#offsetY
     * @type Number
     */
    this.offsetY = ev.offsetY;
  }

  /**
   * Return the name of the event type
   *
   * @method
   *
   * @return {String} Name of the event type
   */

  _createClass(MouseEvent, [{
    key: 'toString',
    value: function toString() {
      return 'MouseEvent';
    }
  }]);

  return MouseEvent;
})(_UIEvent2.UIEvent);

exports.MouseEvent = MouseEvent;

},{"./UIEvent":33}],32:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _UIEvent2 = require('./UIEvent');

var EMPTY_ARRAY = [];

/**
 * See [Touch Interface](http://www.w3.org/TR/2013/REC-touch-events-20131010/#touch-interface).
 *
 * @class Touch
 * @private
 *
 * @param {Touch} touch The native Touch object.
 */

var Touch = function Touch(touch) {
  _classCallCheck(this, Touch);

  // interface Touch {
  //     readonly    attribute long        identifier;
  //     readonly    attribute EventTarget target;
  //     readonly    attribute double      screenX;
  //     readonly    attribute double      screenY;
  //     readonly    attribute double      clientX;
  //     readonly    attribute double      clientY;
  //     readonly    attribute double      pageX;
  //     readonly    attribute double      pageY;
  // };

  /**
   * @name Touch#identifier
   * @type Number
   */
  this.identifier = touch.identifier;

  /**
   * @name Touch#screenX
   * @type Number
   */
  this.screenX = touch.screenX;

  /**
   * @name Touch#screenY
   * @type Number
   */
  this.screenY = touch.screenY;

  /**
   * @name Touch#clientX
   * @type Number
   */
  this.clientX = touch.clientX;

  /**
   * @name Touch#clientY
   * @type Number
   */
  this.clientY = touch.clientY;

  /**
   * @name Touch#pageX
   * @type Number
   */
  this.pageX = touch.pageX;

  /**
   * @name Touch#pageY
   * @type Number
   */
  this.pageY = touch.pageY;
}

/**
 * Normalizes the browser's native TouchList by converting it into an array of
 * normalized Touch objects.
 *
 * @method  cloneTouchList
 * @private
 *
 * @param  {TouchList} touchList    The native TouchList array.
 * @return {Array.<Touch>}          An array of normalized Touch objects.
 */
;

function cloneTouchList(touchList) {
  if (!touchList) return EMPTY_ARRAY;
  // interface TouchList {
  //     readonly    attribute unsigned long length;
  //     getter Touch? item (unsigned long index);
  // };

  var touchListArray = [];
  for (var i = 0; i < touchList.length; i++) {
    touchListArray[i] = new Touch(touchList[i]);
  }
  return touchListArray;
}

/**
 * See [Touch Event Interface](http://www.w3.org/TR/2013/REC-touch-events-20131010/#touchevent-interface).
 *
 * @class TouchEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */

var TouchEvent = (function (_UIEvent) {
  _inherits(TouchEvent, _UIEvent);

  function TouchEvent(ev) {
    _classCallCheck(this, TouchEvent);

    // interface TouchEvent : UIEvent {
    //     readonly    attribute TouchList touches;
    //     readonly    attribute TouchList targetTouches;
    //     readonly    attribute TouchList changedTouches;
    //     readonly    attribute boolean   altKey;
    //     readonly    attribute boolean   metaKey;
    //     readonly    attribute boolean   ctrlKey;
    //     readonly    attribute boolean   shiftKey;
    // };
    _get(Object.getPrototypeOf(TouchEvent.prototype), 'constructor', this).call(this, ev);

    /**
     * @name TouchEvent#touches
     * @type Array.<Touch>
     */
    this.touches = cloneTouchList(ev.touches);

    /**
     * @name TouchEvent#targetTouches
     * @type Array.<Touch>
     */
    this.targetTouches = cloneTouchList(ev.targetTouches);

    /**
     * @name TouchEvent#changedTouches
     * @type TouchList
     */
    this.changedTouches = cloneTouchList(ev.changedTouches);

    /**
     * @name TouchEvent#altKey
     * @type Boolean
     */
    this.altKey = ev.altKey;

    /**
     * @name TouchEvent#metaKey
     * @type Boolean
     */
    this.metaKey = ev.metaKey;

    /**
     * @name TouchEvent#ctrlKey
     * @type Boolean
     */
    this.ctrlKey = ev.ctrlKey;

    /**
     * @name TouchEvent#shiftKey
     * @type Boolean
     */
    this.shiftKey = ev.shiftKey;
  }

  /**
   * Return the name of the event type
   *
   * @method
   *
   * @return {String} Name of the event type
   */

  _createClass(TouchEvent, [{
    key: 'toString',
    value: function toString() {
      return 'TouchEvent';
    }
  }]);

  return TouchEvent;
})(_UIEvent2.UIEvent);

exports.TouchEvent = TouchEvent;

},{"./UIEvent":33}],33:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Event2 = require('./Event');

/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428).
 *
 * @class UIEvent
 * @augments Event
 *
 * @param  {Event} ev   The native DOM event.
 */

var UIEvent = (function (_Event) {
  _inherits(UIEvent, _Event);

  function UIEvent(ev) {
    _classCallCheck(this, UIEvent);

    // [Constructor(DOMString type, optional UIEventInit eventInitDict)]
    // interface UIEvent : Event {
    //     readonly    attribute Window? view;
    //     readonly    attribute long    detail;
    // };
    _get(Object.getPrototypeOf(UIEvent.prototype), 'constructor', this).call(this, ev);

    /**
     * @name UIEvent#detail
     * @type Number
     */
    this.detail = ev.detail;
  }

  /**
   * Return the name of the event type
   *
   * @method
   *
   * @return {String} Name of the event type
   */

  _createClass(UIEvent, [{
    key: 'toString',
    value: function toString() {
      return 'UIEvent';
    }
  }]);

  return UIEvent;
})(_Event2.Event);

exports.UIEvent = UIEvent;

},{"./Event":26}],34:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _MouseEvent2 = require('./MouseEvent');

/**
 * See [UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/2015/WD-uievents-20150428/#events-wheelevents).
 *
 * @class WheelEvent
 * @augments UIEvent
 *
 * @param {Event} ev The native DOM event.
 */

var WheelEvent = (function (_MouseEvent) {
  _inherits(WheelEvent, _MouseEvent);

  function WheelEvent(ev) {
    _classCallCheck(this, WheelEvent);

    // [Constructor(DOMString typeArg, optional WheelEventInit wheelEventInitDict)]
    // interface WheelEvent : MouseEvent {
    //     // DeltaModeCode
    //     const unsigned long DOM_DELTA_PIXEL = 0x00;
    //     const unsigned long DOM_DELTA_LINE = 0x01;
    //     const unsigned long DOM_DELTA_PAGE = 0x02;
    //     readonly    attribute double        deltaX;
    //     readonly    attribute double        deltaY;
    //     readonly    attribute double        deltaZ;
    //     readonly    attribute unsigned long deltaMode;
    // };

    _get(Object.getPrototypeOf(WheelEvent.prototype), 'constructor', this).call(this, ev);

    /**
     * @name WheelEvent#DOM_DELTA_PIXEL
     * @type Number
     */
    this.DOM_DELTA_PIXEL = 0x00;

    /**
     * @name WheelEvent#DOM_DELTA_LINE
     * @type Number
     */
    this.DOM_DELTA_LINE = 0x01;

    /**
     * @name WheelEvent#DOM_DELTA_PAGE
     * @type Number
     */
    this.DOM_DELTA_PAGE = 0x02;

    /**
     * @name WheelEvent#deltaX
     * @type Number
     */
    this.deltaX = ev.deltaX;

    /**
     * @name WheelEvent#deltaY
     * @type Number
     */
    this.deltaY = ev.deltaY;

    /**
     * @name WheelEvent#deltaZ
     * @type Number
     */
    this.deltaZ = ev.deltaZ;

    /**
     * @name WheelEvent#deltaMode
     * @type Number
     */
    this.deltaMode = ev.deltaMode;
  }

  /**
   * Return the name of the event type
   *
   * @method
   *
   * @return {String} Name of the event type
   */

  _createClass(WheelEvent, [{
    key: 'toString',
    value: function toString() {
      return 'WheelEvent';
    }
  }]);

  return WheelEvent;
})(_MouseEvent2.MouseEvent);

exports.WheelEvent = WheelEvent;

},{"./MouseEvent":31}],35:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * A 3x3 numerical matrix, represented as an array.
 *
 * @class Mat33
 *
 * @param {Array} values a 3x3 matrix flattened
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Mat33 = (function () {
  function Mat33(values) {
    _classCallCheck(this, Mat33);

    this.values = values || [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  /**
   * Clones the input Mat33.
   *
   * @method
   *
   * @param {Mat33} m Mat33 to clone.
   *
   * @return {Mat33} New copy of the original Mat33.
   */

  /**
   * Return the values in the Mat33 as an array.
   *
   * @method
   *
   * @return {Array} matrix values as array of rows.
   */

  _createClass(Mat33, [{
    key: 'get',
    value: function get() {
      return this.values;
    }
  }, {
    key: 'set',

    /**
     * Set the values of the current Mat33.
     *
     * @method
     *
     * @param {Array} values Array of nine numbers to set in the Mat33.
     *
     * @return {Mat33} this
     */
    value: function set(values) {
      this.values = values;
      return this;
    }
  }, {
    key: 'copy',

    /**
     * Copy the values of the input Mat33.
     *
     * @method
     *
     * @param {Mat33} matrix The Mat33 to copy.
     *
     * @return {Mat33} this
     */
    value: function copy(matrix) {
      var A = this.values;
      var B = matrix.values;

      A[0] = B[0];
      A[1] = B[1];
      A[2] = B[2];
      A[3] = B[3];
      A[4] = B[4];
      A[5] = B[5];
      A[6] = B[6];
      A[7] = B[7];
      A[8] = B[8];

      return this;
    }
  }, {
    key: 'vectorMultiply',

    /**
     * Take this Mat33 as A, input vector V as a column vector, and return Mat33 product (A)(V).
     *
     * @method
     *
     * @param {Vec3} v Vector to rotate.
     * @param {Vec3} output Vec3 in which to place the result.
     *
     * @return {Vec3} The input vector after multiplication.
     */
    value: function vectorMultiply(v, output) {
      var M = this.values;
      var v0 = v.x;
      var v1 = v.y;
      var v2 = v.z;

      output.x = M[0] * v0 + M[1] * v1 + M[2] * v2;
      output.y = M[3] * v0 + M[4] * v1 + M[5] * v2;
      output.z = M[6] * v0 + M[7] * v1 + M[8] * v2;

      return output;
    }
  }, {
    key: 'multiply',

    /**
     * Multiply the provided Mat33 with the current Mat33.  Result is (this) * (matrix).
     *
     * @method
     *
     * @param {Mat33} matrix Input Mat33 to multiply on the right.
     *
     * @return {Mat33} this
     */
    value: function multiply(matrix) {
      var A = this.values;
      var B = matrix.values;

      var A0 = A[0];
      var A1 = A[1];
      var A2 = A[2];
      var A3 = A[3];
      var A4 = A[4];
      var A5 = A[5];
      var A6 = A[6];
      var A7 = A[7];
      var A8 = A[8];

      var B0 = B[0];
      var B1 = B[1];
      var B2 = B[2];
      var B3 = B[3];
      var B4 = B[4];
      var B5 = B[5];
      var B6 = B[6];
      var B7 = B[7];
      var B8 = B[8];

      A[0] = A0 * B0 + A1 * B3 + A2 * B6;
      A[1] = A0 * B1 + A1 * B4 + A2 * B7;
      A[2] = A0 * B2 + A1 * B5 + A2 * B8;
      A[3] = A3 * B0 + A4 * B3 + A5 * B6;
      A[4] = A3 * B1 + A4 * B4 + A5 * B7;
      A[5] = A3 * B2 + A4 * B5 + A5 * B8;
      A[6] = A6 * B0 + A7 * B3 + A8 * B6;
      A[7] = A6 * B1 + A7 * B4 + A8 * B7;
      A[8] = A6 * B2 + A7 * B5 + A8 * B8;

      return this;
    }
  }, {
    key: 'transpose',

    /**
     * Transposes the Mat33.
     *
     * @method
     *
     * @return {Mat33} this
     */
    value: function transpose() {
      var M = this.values;

      var M1 = M[1];
      var M2 = M[2];
      var M3 = M[3];
      var M5 = M[5];
      var M6 = M[6];
      var M7 = M[7];

      M[1] = M3;
      M[2] = M6;
      M[3] = M1;
      M[5] = M7;
      M[6] = M2;
      M[7] = M5;

      return this;
    }
  }, {
    key: 'getDeterminant',

    /**
     * The determinant of the Mat33.
     *
     * @method
     *
     * @return {Number} The determinant.
     */
    value: function getDeterminant() {
      var M = this.values;

      var M3 = M[3];
      var M4 = M[4];
      var M5 = M[5];
      var M6 = M[6];
      var M7 = M[7];
      var M8 = M[8];

      var det = M[0] * (M4 * M8 - M5 * M7) - M[1] * (M3 * M8 - M5 * M6) + M[2] * (M3 * M7 - M4 * M6);

      return det;
    }
  }, {
    key: 'inverse',

    /**
     * The inverse of the Mat33.
     *
     * @method
     *
     * @return {Mat33} this
     */
    value: function inverse() {
      var M = this.values;

      var M0 = M[0];
      var M1 = M[1];
      var M2 = M[2];
      var M3 = M[3];
      var M4 = M[4];
      var M5 = M[5];
      var M6 = M[6];
      var M7 = M[7];
      var M8 = M[8];

      var det = M0 * (M4 * M8 - M5 * M7) - M1 * (M3 * M8 - M5 * M6) + M2 * (M3 * M7 - M4 * M6);

      if (Math.abs(det) < 1e-40) return null;

      det = 1 / det;

      M[0] = (M4 * M8 - M5 * M7) * det;
      M[3] = (-M3 * M8 + M5 * M6) * det;
      M[6] = (M3 * M7 - M4 * M6) * det;
      M[1] = (-M1 * M8 + M2 * M7) * det;
      M[4] = (M0 * M8 - M2 * M6) * det;
      M[7] = (-M0 * M7 + M1 * M6) * det;
      M[2] = (M1 * M5 - M2 * M4) * det;
      M[5] = (-M0 * M5 + M2 * M3) * det;
      M[8] = (M0 * M4 - M1 * M3) * det;

      return this;
    }
  }]);

  return Mat33;
})();

Mat33.clone = function clone(m) {
  return new Mat33(m.values.slice());
};

/**
 * The inverse of the Mat33.
 *
 * @method
 *
 * @param {Mat33} matrix Mat33 to invert.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The Mat33 after the invert.
 */
Mat33.inverse = function inverse(matrix, output) {
  var M = matrix.values;
  var result = output.values;

  var M0 = M[0];
  var M1 = M[1];
  var M2 = M[2];
  var M3 = M[3];
  var M4 = M[4];
  var M5 = M[5];
  var M6 = M[6];
  var M7 = M[7];
  var M8 = M[8];

  var det = M0 * (M4 * M8 - M5 * M7) - M1 * (M3 * M8 - M5 * M6) + M2 * (M3 * M7 - M4 * M6);

  if (Math.abs(det) < 1e-40) return null;

  det = 1 / det;

  result[0] = (M4 * M8 - M5 * M7) * det;
  result[3] = (-M3 * M8 + M5 * M6) * det;
  result[6] = (M3 * M7 - M4 * M6) * det;
  result[1] = (-M1 * M8 + M2 * M7) * det;
  result[4] = (M0 * M8 - M2 * M6) * det;
  result[7] = (-M0 * M7 + M1 * M6) * det;
  result[2] = (M1 * M5 - M2 * M4) * det;
  result[5] = (-M0 * M5 + M2 * M3) * det;
  result[8] = (M0 * M4 - M1 * M3) * det;

  return output;
};

/**
 * Transposes the Mat33.
 *
 * @method
 *
 * @param {Mat33} matrix Mat33 to transpose.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The Mat33 after the transpose.
 */
Mat33.transpose = function transpose(matrix, output) {
  var M = matrix.values;
  var result = output.values;

  var M0 = M[0];
  var M1 = M[1];
  var M2 = M[2];
  var M3 = M[3];
  var M4 = M[4];
  var M5 = M[5];
  var M6 = M[6];
  var M7 = M[7];
  var M8 = M[8];

  result[0] = M0;
  result[1] = M3;
  result[2] = M6;
  result[3] = M1;
  result[4] = M4;
  result[5] = M7;
  result[6] = M2;
  result[7] = M5;
  result[8] = M8;

  return output;
};

/**
 * Add the provided Mat33's.
 *
 * @method
 *
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The result of the addition.
 */
Mat33.add = function add(matrix1, matrix2, output) {
  var A = matrix1.values;
  var B = matrix2.values;
  var result = output.values;

  var A0 = A[0];
  var A1 = A[1];
  var A2 = A[2];
  var A3 = A[3];
  var A4 = A[4];
  var A5 = A[5];
  var A6 = A[6];
  var A7 = A[7];
  var A8 = A[8];

  var B0 = B[0];
  var B1 = B[1];
  var B2 = B[2];
  var B3 = B[3];
  var B4 = B[4];
  var B5 = B[5];
  var B6 = B[6];
  var B7 = B[7];
  var B8 = B[8];

  result[0] = A0 + B0;
  result[1] = A1 + B1;
  result[2] = A2 + B2;
  result[3] = A3 + B3;
  result[4] = A4 + B4;
  result[5] = A5 + B5;
  result[6] = A6 + B6;
  result[7] = A7 + B7;
  result[8] = A8 + B8;

  return output;
};

/**
 * Subtract the provided Mat33's.
 *
 * @method
 *
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} The result of the subtraction.
 */
Mat33.subtract = function subtract(matrix1, matrix2, output) {
  var A = matrix1.values;
  var B = matrix2.values;
  var result = output.values;

  var A0 = A[0];
  var A1 = A[1];
  var A2 = A[2];
  var A3 = A[3];
  var A4 = A[4];
  var A5 = A[5];
  var A6 = A[6];
  var A7 = A[7];
  var A8 = A[8];

  var B0 = B[0];
  var B1 = B[1];
  var B2 = B[2];
  var B3 = B[3];
  var B4 = B[4];
  var B5 = B[5];
  var B6 = B[6];
  var B7 = B[7];
  var B8 = B[8];

  result[0] = A0 - B0;
  result[1] = A1 - B1;
  result[2] = A2 - B2;
  result[3] = A3 - B3;
  result[4] = A4 - B4;
  result[5] = A5 - B5;
  result[6] = A6 - B6;
  result[7] = A7 - B7;
  result[8] = A8 - B8;

  return output;
};
/**
 * Multiply the provided Mat33 M2 with this Mat33.  Result is (this) * (M2).
 *
 * @method
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 *
 * @return {Mat33} the result of the multiplication.
 */
Mat33.multiply = function multiply(matrix1, matrix2, output) {
  var A = matrix1.values;
  var B = matrix2.values;
  var result = output.values;

  var A0 = A[0];
  var A1 = A[1];
  var A2 = A[2];
  var A3 = A[3];
  var A4 = A[4];
  var A5 = A[5];
  var A6 = A[6];
  var A7 = A[7];
  var A8 = A[8];

  var B0 = B[0];
  var B1 = B[1];
  var B2 = B[2];
  var B3 = B[3];
  var B4 = B[4];
  var B5 = B[5];
  var B6 = B[6];
  var B7 = B[7];
  var B8 = B[8];

  result[0] = A0 * B0 + A1 * B3 + A2 * B6;
  result[1] = A0 * B1 + A1 * B4 + A2 * B7;
  result[2] = A0 * B2 + A1 * B5 + A2 * B8;
  result[3] = A3 * B0 + A4 * B3 + A5 * B6;
  result[4] = A3 * B1 + A4 * B4 + A5 * B7;
  result[5] = A3 * B2 + A4 * B5 + A5 * B8;
  result[6] = A6 * B0 + A7 * B3 + A8 * B6;
  result[7] = A6 * B1 + A7 * B4 + A8 * B7;
  result[8] = A6 * B2 + A7 * B5 + A8 * B8;

  return output;
};

exports.Mat33 = Mat33;

},{}],36:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var sin = Math.sin;
var cos = Math.cos;
var asin = Math.asin;
var acos = Math.acos;
var atan2 = Math.atan2;
var sqrt = Math.sqrt;

/**
 * A vector-like object used to represent rotations. If theta is the angle of
 * rotation, and (x', y', z') is a normalized vector representing the axis of
 * rotation, then w = cos(theta/2), x = sin(theta/2)*x', y = sin(theta/2)*y',
 * and z = sin(theta/2)*z'.
 *
 * @class Quaternion
 *
 * @param {Number} w The w component.
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */

var Quaternion = (function () {
  function Quaternion(w, x, y, z) {
    _classCallCheck(this, Quaternion);

    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  /**
   * Multiply the input Quaternions.
   * Left-handed coordinate system multiplication.
   *
   * @method
   *
   * @param {Quaternion} q1 The left Quaternion.
   * @param {Quaternion} q2 The right Quaternion.
   * @param {Quaternion} output Quaternion in which to place the result.
   *
   * @return {Quaternion} The product of multiplication.
   */

  /**
   * Multiply the current Quaternion by input Quaternion q.
   * Left-handed multiplication.
   *
   * @method
   *
   * @param {Quaternion} q The Quaternion to multiply by on the right.
   *
   * @return {Quaternion} this
   */

  _createClass(Quaternion, [{
    key: 'multiply',
    value: function multiply(q) {
      var x1 = this.x;
      var y1 = this.y;
      var z1 = this.z;
      var w1 = this.w;
      var x2 = q.x;
      var y2 = q.y;
      var z2 = q.z;
      var w2 = q.w || 0;

      this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
      this.x = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
      this.y = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
      this.z = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
      return this;
    }
  }, {
    key: 'leftMultiply',

    /**
     * Multiply the current Quaternion by input Quaternion q on the left, i.e. q * this.
     * Left-handed multiplication.
     *
     * @method
     *
     * @param {Quaternion} q The Quaternion to multiply by on the left.
     *
     * @return {Quaternion} this
     */
    value: function leftMultiply(q) {
      var x1 = q.x;
      var y1 = q.y;
      var z1 = q.z;
      var w1 = q.w || 0;
      var x2 = this.x;
      var y2 = this.y;
      var z2 = this.z;
      var w2 = this.w;

      this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
      this.x = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
      this.y = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
      this.z = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
      return this;
    }
  }, {
    key: 'rotateVector',

    /**
     * Apply the current Quaternion to input Vec3 v, according to
     * v' = ~q * v * q.
     *
     * @method
     *
     * @param {Vec3} v The reference Vec3.
     * @param {Vec3} output Vec3 in which to place the result.
     *
     * @return {Vec3} The rotated version of the Vec3.
     */
    value: function rotateVector(v, output) {
      var cw = this.w;
      var cx = -this.x;
      var cy = -this.y;
      var cz = -this.z;

      var vx = v.x;
      var vy = v.y;
      var vz = v.z;

      var tw = -cx * vx - cy * vy - cz * vz;
      var tx = vx * cw + vy * cz - cy * vz;
      var ty = vy * cw + cx * vz - vx * cz;
      var tz = vz * cw + vx * cy - cx * vy;

      var w = cw;
      var x = -cx;
      var y = -cy;
      var z = -cz;

      output.x = tx * w + x * tw + y * tz - ty * z;
      output.y = ty * w + y * tw + tx * z - x * tz;
      output.z = tz * w + z * tw + x * ty - tx * y;
      return output;
    }
  }, {
    key: 'invert',

    /**
     * Invert the current Quaternion.
     *
     * @method
     *
     * @return {Quaternion} this
     */
    value: function invert() {
      this.w = -this.w;
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      return this;
    }
  }, {
    key: 'conjugate',

    /**
     * Conjugate the current Quaternion.
     *
     * @method
     *
     * @return {Quaternion} this
     */
    value: function conjugate() {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      return this;
    }
  }, {
    key: 'length',

    /**
     * Compute the length (norm) of the current Quaternion.
     *
     * @method
     *
     * @return {Number} length of the Quaternion
     */
    value: function length() {
      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;
      return sqrt(w * w + x * x + y * y + z * z);
    }
  }, {
    key: 'normalize',

    /**
     * Alter the current Quaternion to be of unit length;
     *
     * @method
     *
     * @return {Quaternion} this
     */
    value: function normalize() {
      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;
      var length = sqrt(w * w + x * x + y * y + z * z);
      if (length === 0) return this;
      length = 1 / length;
      this.w *= length;
      this.x *= length;
      this.y *= length;
      this.z *= length;
      return this;
    }
  }, {
    key: 'set',

    /**
     * Set the w, x, y, z components of the current Quaternion.
     *
     * @method
     *
     * @param {Number} w The w component.
     * @param {Number} x The x component.
     * @param {Number} y The y component.
     * @param {Number} z The z component.
     *
     * @return {Quaternion} this
     */
    value: function set(w, x, y, z) {
      if (w != null) this.w = w;
      if (x != null) this.x = x;
      if (y != null) this.y = y;
      if (z != null) this.z = z;
      return this;
    }
  }, {
    key: 'copy',

    /**
     * Copy input Quaternion q onto the current Quaternion.
     *
     * @method
     *
     * @param {Quaternion} q The reference Quaternion.
     *
     * @return {Quaternion} this
     */
    value: function copy(q) {
      this.w = q.w;
      this.x = q.x;
      this.y = q.y;
      this.z = q.z;
      return this;
    }
  }, {
    key: 'clear',

    /**
     * Reset the current Quaternion.
     *
     * @method
     *
     * @return {Quaternion} this
     */
    value: function clear() {
      this.w = 1;
      this.x = 0;
      this.y = 0;
      this.z = 0;
      return this;
    }
  }, {
    key: 'dot',

    /**
     * The dot product. Can be used to determine the cosine of the angle between
     * the two rotations, assuming both Quaternions are of unit length.
     *
     * @method
     *
     * @param {Quaternion} q The other Quaternion.
     *
     * @return {Number} the resulting dot product
     */
    value: function dot(q) {
      return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
    }
  }, {
    key: 'slerp',

    /**
     * Spherical linear interpolation.
     *
     * @method
     *
     * @param {Quaternion} q The final orientation.
     * @param {Number} t The tween parameter.
     * @param {Vec3} output Vec3 in which to put the result.
     *
     * @return {Quaternion} The quaternion the slerp results were saved to
     */
    value: function slerp(q, t, output) {
      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      var qw = q.w;
      var qx = q.x;
      var qy = q.y;
      var qz = q.z;

      var omega;
      var cosomega;
      var sinomega;
      var scaleFrom;
      var scaleTo;

      cosomega = w * qw + x * qx + y * qy + z * qz;
      if (1.0 - cosomega > 1e-5) {
        omega = acos(cosomega);
        sinomega = sin(omega);
        scaleFrom = sin((1.0 - t) * omega) / sinomega;
        scaleTo = sin(t * omega) / sinomega;
      } else {
        scaleFrom = 1.0 - t;
        scaleTo = t;
      }

      output.w = w * scaleFrom + qw * scaleTo;
      output.x = x * scaleFrom + qx * scaleTo;
      output.y = y * scaleFrom + qy * scaleTo;
      output.z = z * scaleFrom + qz * scaleTo;

      return output;
    }
  }, {
    key: 'toMatrix',

    /**
     * Get the Mat33 matrix corresponding to the current Quaternion.
     *
     * @method
     *
     * @param {Object} output Object to process the Transform matrix
     *
     * @return {Array} the Quaternion as a Transform matrix
     */
    value: function toMatrix(output) {
      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      var xx = x * x;
      var yy = y * y;
      var zz = z * z;
      var xy = x * y;
      var xz = x * z;
      var yz = y * z;

      return output.set([1 - 2 * (yy + zz), 2 * (xy - w * z), 2 * (xz + w * y), 2 * (xy + w * z), 1 - 2 * (xx + zz), 2 * (yz - w * x), 2 * (xz - w * y), 2 * (yz + w * x), 1 - 2 * (xx + yy)]);
    }
  }, {
    key: 'toEuler',

    /**
     * The rotation angles about the x, y, and z axes corresponding to the
     * current Quaternion, when applied in the ZYX order.
     *
     * @method
     *
     * @param {Vec3} output Vec3 in which to put the result.
     *
     * @return {Vec3} the Vec3 the result was stored in
     */
    value: function toEuler(output) {
      var w = this.w;
      var x = this.x;
      var y = this.y;
      var z = this.z;

      var xx = x * x;
      var yy = y * y;
      var zz = z * z;

      var ty = 2 * (x * z + y * w);
      ty = ty < -1 ? -1 : ty > 1 ? 1 : ty;

      output.x = atan2(2 * (x * w - y * z), 1 - 2 * (xx + yy));
      output.y = asin(ty);
      output.z = atan2(2 * (z * w - x * y), 1 - 2 * (yy + zz));

      return output;
    }
  }, {
    key: 'fromEuler',

    /**
     * The Quaternion corresponding to the Euler angles x, y, and z,
     * applied in the ZYX order.
     *
     * @method
     *
     * @param {Number} x The angle of rotation about the x axis.
     * @param {Number} y The angle of rotation about the y axis.
     * @param {Number} z The angle of rotation about the z axis.
     * @param {Quaternion} output Quaternion in which to put the result.
     *
     * @return {Quaternion} The equivalent Quaternion.
     */
    value: function fromEuler(x, y, z) {
      var hx = x * 0.5;
      var hy = y * 0.5;
      var hz = z * 0.5;

      var sx = sin(hx);
      var sy = sin(hy);
      var sz = sin(hz);
      var cx = cos(hx);
      var cy = cos(hy);
      var cz = cos(hz);

      this.w = cx * cy * cz - sx * sy * sz;
      this.x = sx * cy * cz + cx * sy * sz;
      this.y = cx * sy * cz - sx * cy * sz;
      this.z = cx * cy * sz + sx * sy * cz;

      return this;
    }
  }, {
    key: 'fromAngleAxis',

    /**
     * Alter the current Quaternion to reflect a rotation of input angle about
     * input axis x, y, and z.
     *
     * @method
     *
     * @param {Number} angle The angle of rotation.
     * @param {Vec3} x The axis of rotation.
     * @param {Vec3} y The axis of rotation.
     * @param {Vec3} z The axis of rotation.
     *
     * @return {Quaternion} this
     */
    value: function fromAngleAxis(angle, x, y, z) {
      var len = sqrt(x * x + y * y + z * z);
      if (len === 0) {
        this.w = 1;
        this.x = this.y = this.z = 0;
      } else {
        len = 1 / len;
        var halfTheta = angle * 0.5;
        var s = sin(halfTheta);
        this.w = cos(halfTheta);
        this.x = s * x * len;
        this.y = s * y * len;
        this.z = s * z * len;
      }
      return this;
    }
  }]);

  return Quaternion;
})();

Quaternion.multiply = function multiply(q1, q2, output) {
  var w1 = q1.w || 0;
  var x1 = q1.x;
  var y1 = q1.y;
  var z1 = q1.z;

  var w2 = q2.w || 0;
  var x2 = q2.x;
  var y2 = q2.y;
  var z2 = q2.z;

  output.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
  output.x = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
  output.y = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
  output.z = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
  return output;
};

/**
 * Normalize the input quaternion.
 *
 * @method
 *
 * @param {Quaternion} q The reference Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 *
 * @return {Quaternion} The normalized quaternion.
 */
Quaternion.normalize = function normalize(q, output) {
  var w = q.w;
  var x = q.x;
  var y = q.y;
  var z = q.z;
  var length = sqrt(w * w + x * x + y * y + z * z);
  if (length === 0) return this;
  length = 1 / length;
  output.w *= length;
  output.x *= length;
  output.y *= length;
  output.z *= length;
  return output;
};

/**
 * The conjugate of the input Quaternion.
 *
 * @method
 *
 * @param {Quaternion} q The reference Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 *
 * @return {Quaternion} The conjugate Quaternion.
 */
Quaternion.conjugate = function conjugate(q, output) {
  output.w = q.w;
  output.x = -q.x;
  output.y = -q.y;
  output.z = -q.z;
  return output;
};

/**
 * Clone the input Quaternion.
 *
 * @method
 *
 * @param {Quaternion} q the reference Quaternion.
 *
 * @return {Quaternion} The cloned Quaternion.
 */
Quaternion.clone = function clone(q) {
  return new Quaternion(q.w, q.x, q.y, q.z);
};

/**
 * The dot product of the two input Quaternions.
 *
 * @method
 *
 * @param {Quaternion} q1 The left Quaternion.
 * @param {Quaternion} q2 The right Quaternion.
 *
 * @return {Number} The dot product of the two Quaternions.
 */
Quaternion.dot = function dot(q1, q2) {
  return q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
};

exports.Quaternion = Quaternion;

},{}],37:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * A two-dimensional vector.
 *
 * @class Vec2
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Vec2 = (function () {
  function Vec2(x, y) {
    _classCallCheck(this, Vec2);

    if (x instanceof Array || x instanceof Float32Array) {
      this.x = x[0] || 0;
      this.y = x[1] || 0;
    } else {
      this.x = x || 0;
      this.y = y || 0;
    }
  }

  /**
   * Normalize the input Vec2.
   *
   * @method
   *
   * @param {Vec2} v The reference Vec2.
   * @param {Vec2} output Vec2 in which to place the result.
   *
   * @return {Vec2} The normalized Vec2.
   */

  _createClass(Vec2, [{
    key: 'set',

    /**
     * Set the components of the current Vec2.
     *
     * @method
     *
     * @param {Number} x The x component.
     * @param {Number} y The y component.
     *
     * @return {Vec2} this
     */
    value: function set(x, y) {
      if (x != null) this.x = x;
      if (y != null) this.y = y;
      return this;
    }
  }, {
    key: 'add',

    /**
     * Add the input v to the current Vec2.
     *
     * @method
     *
     * @param {Vec2} v The Vec2 to add.
     *
     * @return {Vec2} this
     */
    value: function add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
  }, {
    key: 'subtract',

    /**
     * Subtract the input v from the current Vec2.
     *
     * @method
     *
     * @param {Vec2} v The Vec2 to subtract.
     *
     * @return {Vec2} this
     */
    value: function subtract(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }
  }, {
    key: 'scale',

    /**
     * Scale the current Vec2 by a scalar or Vec2.
     *
     * @method
     *
     * @param {Number|Vec2} s The Number or vec2 by which to scale.
     *
     * @return {Vec2} this
     */
    value: function scale(s) {
      if (s instanceof Vec2) {
        this.x *= s.x;
        this.y *= s.y;
      } else {
        this.x *= s;
        this.y *= s;
      }
      return this;
    }
  }, {
    key: 'rotate',

    /**
     * Rotate the Vec2 counter-clockwise by theta about the z-axis.
     *
     * @method
     *
     * @param {Number} theta Angle by which to rotate.
     *
     * @return {Vec2} this
     */
    value: function rotate(theta) {
      var x = this.x;
      var y = this.y;

      var cosTheta = Math.cos(theta);
      var sinTheta = Math.sin(theta);

      this.x = x * cosTheta - y * sinTheta;
      this.y = x * sinTheta + y * cosTheta;

      return this;
    }
  }, {
    key: 'dot',

    /**
     * The dot product of of the current Vec2 with the input Vec2.
     *
     * @method
     *
     * @param {Number} v The other Vec2.
     *
     * @return {Vec2} this
     */
    value: function dot(v) {
      return this.x * v.x + this.y * v.y;
    }
  }, {
    key: 'cross',

    /**
     * The cross product of of the current Vec2 with the input Vec2.
     *
     * @method
     *
     * @param {Number} v The other Vec2.
     *
     * @return {Vec2} this
     */
    value: function cross(v) {
      return this.x * v.y - this.y * v.x;
    }
  }, {
    key: 'invert',

    /**
     * Preserve the magnitude but invert the orientation of the current Vec2.
     *
     * @method
     *
     * @return {Vec2} this
     */
    value: function invert() {
      this.x *= -1;
      this.y *= -1;
      return this;
    }
  }, {
    key: 'map',

    /**
     * Apply a function component-wise to the current Vec2.
     *
     * @method
     *
     * @param {Function} fn Function to apply.
     *
     * @return {Vec2} this
     */
    value: function map(fn) {
      this.x = fn(this.x);
      this.y = fn(this.y);
      return this;
    }
  }, {
    key: 'length',

    /**
     * Get the magnitude of the current Vec2.
     *
     * @method
     *
     * @return {Number} the length of the vector
     */
    value: function length() {
      var x = this.x;
      var y = this.y;

      return Math.sqrt(x * x + y * y);
    }
  }, {
    key: 'copy',

    /**
     * Copy the input onto the current Vec2.
     *
     * @method
     *
     * @param {Vec2} v Vec2 to copy
     *
     * @return {Vec2} this
     */
    value: function copy(v) {
      this.x = v.x;
      this.y = v.y;
      return this;
    }
  }, {
    key: 'clear',

    /**
     * Reset the current Vec2.
     *
     * @method
     *
     * @return {Vec2} this
     */
    value: function clear() {
      this.x = 0;
      this.y = 0;
      return this;
    }
  }, {
    key: 'isZero',

    /**
     * Check whether the magnitude of the current Vec2 is exactly 0.
     *
     * @method
     *
     * @return {Boolean} whether or not the length is 0
     */
    value: function isZero() {
      if (this.x !== 0 || this.y !== 0) return false;else return true;
    }
  }, {
    key: 'toArray',

    /**
     * The array form of the current Vec2.
     *
     * @method
     *
     * @return {Array} the Vec to as an array
     */
    value: function toArray() {
      return [this.x, this.y];
    }
  }]);

  return Vec2;
})();

Vec2.normalize = function normalize(v, output) {
  var x = v.x;
  var y = v.y;

  var length = Math.sqrt(x * x + y * y) || 1;
  length = 1 / length;
  output.x = v.x * length;
  output.y = v.y * length;

  return output;
};

/**
 * Clone the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The Vec2 to clone.
 *
 * @return {Vec2} The cloned Vec2.
 */
Vec2.clone = function clone(v) {
  return new Vec2(v.x, v.y);
};

/**
 * Add the input Vec2's.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the addition.
 */
Vec2.add = function add(v1, v2, output) {
  output.x = v1.x + v2.x;
  output.y = v1.y + v2.y;

  return output;
};

/**
 * Subtract the second Vec2 from the first.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the subtraction.
 */
Vec2.subtract = function subtract(v1, v2, output) {
  output.x = v1.x - v2.x;
  output.y = v1.y - v2.y;
  return output;
};

/**
 * Scale the input Vec2.
 *
 * @method
 *
 * @param {Vec2} v The reference Vec2.
 * @param {Number} s Number to scale by.
 * @param {Vec2} output Vec2 in which to place the result.
 *
 * @return {Vec2} The result of the scaling.
 */
Vec2.scale = function scale(v, s, output) {
  output.x = v.x * s;
  output.y = v.y * s;
  return output;
};

/**
 * The dot product of the input Vec2's.
 *
 * @method
 *
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 *
 * @return {Number} The dot product.
 */
Vec2.dot = function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
};

/**
 * The cross product of the input Vec2's.
 *
 * @method
 *
 * @param {Number} v1 The left Vec2.
 * @param {Number} v2 The right Vec2.
 *
 * @return {Number} The z-component of the cross product.
 */
Vec2.cross = function (v1, v2) {
  return v1.x * v2.y - v1.y * v2.x;
};

exports.Vec2 = Vec2;

},{}],38:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * A three-dimensional vector.
 *
 * @class Vec3
 *
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Vec3 = (function () {
  function Vec3(x, y, z) {
    _classCallCheck(this, Vec3);

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  /**
   * Normalize the input Vec3.
   *
   * @method
   *
   * @param {Vec3} v The reference Vec3.
   * @param {Vec3} output Vec3 in which to place the result.
   *
   * @return {Vec3} The normalize Vec3.
   */

  /**
   * Set the components of the current Vec3.
   *
   * @method
   *
   * @param {Number} x The x component.
   * @param {Number} y The y component.
   * @param {Number} z The z component.
   *
   * @return {Vec3} this
   */

  _createClass(Vec3, [{
    key: 'set',
    value: function set(x, y, z) {
      if (x != null) this.x = x;
      if (y != null) this.y = y;
      if (z != null) this.z = z;

      return this;
    }
  }, {
    key: 'add',

    /**
     * Add the input v to the current Vec3.
     *
     * @method
     *
     * @param {Vec3} v The Vec3 to add.
     *
     * @return {Vec3} this
     */
    value: function add(v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;

      return this;
    }
  }, {
    key: 'subtract',

    /**
     * Subtract the input v from the current Vec3.
     *
     * @method
     *
     * @param {Vec3} v The Vec3 to subtract.
     *
     * @return {Vec3} this
     */
    value: function subtract(v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;

      return this;
    }
  }, {
    key: 'rotateX',

    /**
     * Rotate the current Vec3 by theta clockwise about the x axis.
     *
     * @method
     *
     * @param {Number} theta Angle by which to rotate.
     *
     * @return {Vec3} this
     */
    value: function rotateX(theta) {
      var y = this.y;
      var z = this.z;

      var cosTheta = Math.cos(theta);
      var sinTheta = Math.sin(theta);

      this.y = y * cosTheta - z * sinTheta;
      this.z = y * sinTheta + z * cosTheta;

      return this;
    }
  }, {
    key: 'rotateY',

    /**
     * Rotate the current Vec3 by theta clockwise about the y axis.
     *
     * @method
     *
     * @param {Number} theta Angle by which to rotate.
     *
     * @return {Vec3} this
     */
    value: function rotateY(theta) {
      var x = this.x;
      var z = this.z;

      var cosTheta = Math.cos(theta);
      var sinTheta = Math.sin(theta);

      this.x = z * sinTheta + x * cosTheta;
      this.z = z * cosTheta - x * sinTheta;

      return this;
    }
  }, {
    key: 'rotateZ',

    /**
     * Rotate the current Vec3 by theta clockwise about the z axis.
     *
     * @method
     *
     * @param {Number} theta Angle by which to rotate.
     *
     * @return {Vec3} this
     */
    value: function rotateZ(theta) {
      var x = this.x;
      var y = this.y;

      var cosTheta = Math.cos(theta);
      var sinTheta = Math.sin(theta);

      this.x = x * cosTheta - y * sinTheta;
      this.y = x * sinTheta + y * cosTheta;

      return this;
    }
  }, {
    key: 'dot',

    /**
     * The dot product of the current Vec3 with input Vec3 v.
     *
     * @method
     *
     * @param {Vec3} v The other Vec3.
     *
     * @return {Vec3} this
     */
    value: function dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    }
  }, {
    key: 'cross',

    /**
     * The dot product of the current Vec3 with input Vec3 v.
     * Stores the result in the current Vec3.
     *
     * @method cross
     *
     * @param {Vec3} v The other Vec3
     *
     * @return {Vec3} this
     */
    value: function cross(v) {
      var x = this.x;
      var y = this.y;
      var z = this.z;

      var vx = v.x;
      var vy = v.y;
      var vz = v.z;

      this.x = y * vz - z * vy;
      this.y = z * vx - x * vz;
      this.z = x * vy - y * vx;
      return this;
    }
  }, {
    key: 'scale',

    /**
     * Scale the current Vec3 by a scalar.
     *
     * @method
     *
     * @param {Number} s The Number by which to scale
     *
     * @return {Vec3} this
     */
    value: function scale(s) {
      this.x *= s;
      this.y *= s;
      this.z *= s;

      return this;
    }
  }, {
    key: 'invert',

    /**
     * Preserve the magnitude but invert the orientation of the current Vec3.
     *
     * @method
     *
     * @return {Vec3} this
     */
    value: function invert() {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;

      return this;
    }
  }, {
    key: 'map',

    /**
     * Apply a function component-wise to the current Vec3.
     *
     * @method
     *
     * @param {Function} fn Function to apply.
     *
     * @return {Vec3} this
     */
    value: function map(fn) {
      this.x = fn(this.x);
      this.y = fn(this.y);
      this.z = fn(this.z);

      return this;
    }
  }, {
    key: 'length',

    /**
     * The magnitude of the current Vec3.
     *
     * @method
     *
     * @return {Number} the magnitude of the Vec3
     */
    value: function length() {
      var x = this.x;
      var y = this.y;
      var z = this.z;

      return Math.sqrt(x * x + y * y + z * z);
    }
  }, {
    key: 'lengthSq',

    /**
     * The magnitude squared of the current Vec3.
     *
     * @method
     *
     * @return {Number} magnitude of the Vec3 squared
     */
    value: function lengthSq() {
      var x = this.x;
      var y = this.y;
      var z = this.z;

      return x * x + y * y + z * z;
    }
  }, {
    key: 'copy',

    /**
     * Copy the input onto the current Vec3.
     *
     * @method
     *
     * @param {Vec3} v Vec3 to copy
     *
     * @return {Vec3} this
     */
    value: function copy(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    }
  }, {
    key: 'clear',

    /**
     * Reset the current Vec3.
     *
     * @method
     *
     * @return {Vec3} this
     */
    value: function clear() {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      return this;
    }
  }, {
    key: 'isZero',

    /**
     * Check whether the magnitude of the current Vec3 is exactly 0.
     *
     * @method
     *
     * @return {Boolean} whether or not the magnitude is zero
     */
    value: function isZero() {
      return this.x === 0 && this.y === 0 && this.z === 0;
    }
  }, {
    key: 'toArray',

    /**
     * The array form of the current Vec3.
     *
     * @method
     *
     * @return {Array} a three element array representing the components of the Vec3
     */
    value: function toArray() {
      return [this.x, this.y, this.z];
    }
  }, {
    key: 'normalize',

    /**
     * Preserve the orientation but change the length of the current Vec3 to 1.
     *
     * @method
     *
     * @return {Vec3} this
     */
    value: function normalize() {
      var x = this.x;
      var y = this.y;
      var z = this.z;

      var len = Math.sqrt(x * x + y * y + z * z) || 1;
      len = 1 / len;

      this.x *= len;
      this.y *= len;
      this.z *= len;
      return this;
    }
  }, {
    key: 'applyRotation',

    /**
     * Apply the rotation corresponding to the input (unit) Quaternion
     * to the current Vec3.
     *
     * @method
     *
     * @param {Quaternion} q Unit Quaternion representing the rotation to apply
     *
     * @return {Vec3} this
     */
    value: function applyRotation(q) {
      var cw = q.w;
      var cx = -q.x;
      var cy = -q.y;
      var cz = -q.z;

      var vx = this.x;
      var vy = this.y;
      var vz = this.z;

      var tw = -cx * vx - cy * vy - cz * vz;
      var tx = vx * cw + vy * cz - cy * vz;
      var ty = vy * cw + cx * vz - vx * cz;
      var tz = vz * cw + vx * cy - cx * vy;

      var w = cw;
      var x = -cx;
      var y = -cy;
      var z = -cz;

      this.x = tx * w + x * tw + y * tz - ty * z;
      this.y = ty * w + y * tw + tx * z - x * tz;
      this.z = tz * w + z * tw + x * ty - tx * y;
      return this;
    }
  }, {
    key: 'applyMatrix',

    /**
     * Apply the input Mat33 the the current Vec3.
     *
     * @method
     *
     * @param {Mat33} matrix Mat33 to apply
     *
     * @return {Vec3} this
     */
    value: function applyMatrix(matrix) {
      var M = matrix.get();

      var x = this.x;
      var y = this.y;
      var z = this.z;

      this.x = M[0] * x + M[1] * y + M[2] * z;
      this.y = M[3] * x + M[4] * y + M[5] * z;
      this.z = M[6] * x + M[7] * y + M[8] * z;
      return this;
    }
  }]);

  return Vec3;
})();

Vec3.normalize = function normalize(v, output) {
  var x = v.x;
  var y = v.y;
  var z = v.z;

  var length = Math.sqrt(x * x + y * y + z * z) || 1;
  length = 1 / length;

  output.x = x * length;
  output.y = y * length;
  output.z = z * length;
  return output;
};

/**
 * Apply a rotation to the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Quaternion} q Unit Quaternion representing the rotation to apply.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The rotated version of the input Vec3.
 */
Vec3.applyRotation = function applyRotation(v, q, output) {
  var cw = q.w;
  var cx = -q.x;
  var cy = -q.y;
  var cz = -q.z;

  var vx = v.x;
  var vy = v.y;
  var vz = v.z;

  var tw = -cx * vx - cy * vy - cz * vz;
  var tx = vx * cw + vy * cz - cy * vz;
  var ty = vy * cw + cx * vz - vx * cz;
  var tz = vz * cw + vx * cy - cx * vy;

  var w = cw;
  var x = -cx;
  var y = -cy;
  var z = -cz;

  output.x = tx * w + x * tw + y * tz - ty * z;
  output.y = ty * w + y * tw + tx * z - x * tz;
  output.z = tz * w + z * tw + x * ty - tx * y;
  return output;
};

/**
 * Clone the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The Vec3 to clone.
 *
 * @return {Vec3} The cloned Vec3.
 */
Vec3.clone = function clone(v) {
  return new Vec3(v.x, v.y, v.z);
};

/**
 * Add the input Vec3's.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the addition.
 */
Vec3.add = function add(v1, v2, output) {
  output.x = v1.x + v2.x;
  output.y = v1.y + v2.y;
  output.z = v1.z + v2.z;
  return output;
};

/**
 * Subtract the second Vec3 from the first.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the subtraction.
 */
Vec3.subtract = function subtract(v1, v2, output) {
  output.x = v1.x - v2.x;
  output.y = v1.y - v2.y;
  output.z = v1.z - v2.z;
  return output;
};

/**
 * Scale the input Vec3.
 *
 * @method
 *
 * @param {Vec3} v The reference Vec3.
 * @param {Number} s Number to scale by.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Vec3} The result of the scaling.
 */
Vec3.scale = function scale(v, s, output) {
  output.x = v.x * s;
  output.y = v.y * s;
  output.z = v.z * s;
  return output;
};

/**
 * The dot product of the input Vec3's.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 *
 * @return {Number} The dot product.
 */
Vec3.dot = function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

/**
 * The (right-handed) cross product of the input Vec3's.
 * v1 x v2.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Object} the object the result of the cross product was placed into
 */
Vec3.cross = function cross(v1, v2, output) {
  var x1 = v1.x;
  var y1 = v1.y;
  var z1 = v1.z;
  var x2 = v2.x;
  var y2 = v2.y;
  var z2 = v2.z;

  output.x = y1 * z2 - z1 * y2;
  output.y = z1 * x2 - x1 * z2;
  output.z = x1 * y2 - y1 * x2;
  return output;
};

/**
 * The projection of v1 onto v2.
 *
 * @method
 *
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 *
 * @return {Object} the object the result of the cross product was placed into
 */
Vec3.project = function project(v1, v2, output) {
  var x1 = v1.x;
  var y1 = v1.y;
  var z1 = v1.z;
  var x2 = v2.x;
  var y2 = v2.y;
  var z2 = v2.z;

  var scale = x1 * x2 + y1 * y2 + z1 * z2;
  scale /= x2 * x2 + y2 * y2 + z2 * z2;

  output.x = x2 * scale;
  output.y = y2 * scale;
  output.z = z2 * scale;

  return output;
};

exports.Vec3 = Vec3;

},{}],39:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bodiesParticle = require('./bodies/Particle');

var _constraintsConstraint = require('./constraints/Constraint');

var _forcesForce = require('./forces/Force');

var _utilitiesCallbackStore = require('../utilities/CallbackStore');

var _mathVec3 = require('../math/Vec3');

var _mathQuaternion = require('../math/Quaternion');

var VEC_REGISTER = new _mathVec3.Vec3();
var QUAT_REGISTER = new _mathQuaternion.Quaternion();
var DELTA_REGISTER = new _mathVec3.Vec3();

/**
 * Singleton PhysicsEngine object.
 * Manages bodies, forces, constraints.
 *
 * @class PhysicsEngine
 * @param {Object} options A hash of configurable options.
 */

var PhysicsEngine = (function () {
  function PhysicsEngine(options) {
    _classCallCheck(this, PhysicsEngine);

    this.events = new _utilitiesCallbackStore.CallbackStore();

    options = options || {};
    /** @prop bodies The bodies currently active in the engine. */
    this.bodies = [];
    /** @prop forces The forces currently active in the engine. */
    this.forces = [];
    /** @prop constraints The constraints currently active in the engine. */
    this.constraints = [];

    /** @prop step The time between frames in the engine. */
    this.step = options.step || 1000 / 60;
    /** @prop iterations The number of times each constraint is solved per frame. */
    this.iterations = options.iterations || 10;
    /** @prop _indexPool Pools of indicies to track holes in the arrays. */
    this._indexPools = {
      bodies: [],
      forces: [],
      constraints: []
    };

    this._entityMaps = {
      bodies: {},
      forces: {},
      constraints: {}
    };

    this.speed = options.speed || 1.0;
    this.time = 0;
    this.delta = 0;

    this.origin = options.origin || new _mathVec3.Vec3();
    this.orientation = options.orientation ? options.orientation.normalize() : new _mathQuaternion.Quaternion();

    this.frameDependent = options.frameDependent || false;

    this.transformBuffers = {
      position: [0, 0, 0],
      rotation: [0, 0, 0, 1]
    };
  }

  /**
   * Private helper method to store an element in a library array.
   *
   * @method
   * @private
   * @param {Object} context Object in possesion of the element arrays.
   * @param {Object} element The body, force, or constraint to add.
   * @param {String} key Where to store the element.
   * @return {undefined} undefined
   */

  /**
   * Listen for a specific event.
   *
   * @method
   * @param {String} key Name of the event.
   * @param {Function} callback Callback to register for the event.
   * @return {PhysicsEngine} this
   */

  _createClass(PhysicsEngine, [{
    key: 'on',
    value: function on(key, callback) {
      this.events.on(key, callback);
      return this;
    }
  }, {
    key: 'off',

    /**
     * Stop listening for a specific event.
     *
     * @method
     * @param {String} key Name of the event.
     * @param {Function} callback Callback to deregister for the event.
     * @return {PhysicsEngine} this
     */
    value: function off(key, callback) {
      this.events.off(key, callback);
      return this;
    }
  }, {
    key: 'trigger',

    /**
     * Trigger an event.
     *
     * @method
     * @param {String} key Name of the event.
     * @param {Object} payload Payload to pass to the event listeners.
     * @return {PhysicsEngine} this
     */
    value: function trigger(key, payload) {
      this.events.trigger(key, payload);
      return this;
    }
  }, {
    key: 'setOrigin',

    /**
     * Set the origin of the world.
     *
     * @method
     * @chainable
     * @param {Number} x The x component.
     * @param {Number} y The y component.
     * @param {Number} z The z component.
     * @return {PhysicsEngine} this
     */
    value: function setOrigin(x, y, z) {
      this.origin.set(x, y, z);
      return this;
    }
  }, {
    key: 'setOrientation',

    /**
     * Set the orientation of the world.
     *
     * @method
     * @chainable
     * @param {Number} w The w component.
     * @param {Number} x The x component.
     * @param {Number} y The y component.
     * @param {Number} z The z component.
     * @return {PhysicsEngine} this
     */
    value: function setOrientation(w, x, y, z) {
      this.orientation.set(w, x, y, z).normalize();
      return this;
    }
  }, {
    key: 'add',

    /**
     * Add a group of bodies, force, or constraints to the engine.
     *
     * @method
     * @return {PhysicsEngine} this
     */
    value: function add() {
      for (var j = 0, lenj = arguments.length; j < lenj; j++) {
        var entity = arguments[j];
        if (entity instanceof Array) {
          for (var i = 0, len = entity.length; i < len; i++) {
            var e = entity[i];
            this.add(e);
          }
        } else {
          if (entity instanceof _bodiesParticle.Particle) this.addBody(entity);else if (entity instanceof _constraintsConstraint.Constraint) this.addConstraint(entity);else if (entity instanceof _forcesForce.Force) this.addForce(entity);
        }
      }
      return this;
    }
  }, {
    key: 'remove',

    /**
     * Remove a group of bodies, force, or constraints from the engine.
     *
     * @method
     * @return {PhysicsEngine} this
     */
    value: function remove() {
      for (var j = 0, lenj = arguments.length; j < lenj; j++) {
        var entity = arguments[j];
        if (entity instanceof Array) {
          for (var i = 0, len = entity.length; i < len; i++) {
            var e = entity[i];
            this.add(e);
          }
        } else {
          if (entity instanceof _bodiesParticle.Particle) this.removeBody(entity);else if (entity instanceof _constraintsConstraint.Constraint) this.removeConstraint(entity);else if (entity instanceof _forcesForce.Force) this.removeForce(entity);
        }
      }
      return this;
    }
  }, {
    key: 'addBody',

    /**
     * Begin tracking a body.
     *
     * @method
     * @param {Particle} body The body to track.
     * @return {undefined} undefined
     */
    value: function addBody(body) {
      _addElement(this, body, 'bodies');
    }
  }, {
    key: 'addForce',

    /**
     * Begin tracking a force.
     *
     * @method
     * @param {Force} force The force to track.
     * @return {undefined} undefined
     */
    value: function addForce(force) {
      _addElement(this, force, 'forces');
    }
  }, {
    key: 'addConstraint',

    /**
     * Begin tracking a constraint.
     *
     * @method
     * @param {Constraint} constraint The constraint to track.
     * @return {undefined} undefined
     */
    value: function addConstraint(constraint) {
      _addElement(this, constraint, 'constraints');
    }
  }, {
    key: 'removeBody',

    /**
     * Stop tracking a body.
     *
     * @method
     * @param {Particle} body The body to stop tracking.
     * @return {undefined} undefined
     */
    value: function removeBody(body) {
      _removeElement(this, body, 'bodies');
    }
  }, {
    key: 'removeForce',

    /**
     * Stop tracking a force.
     *
     * @method
     * @param {Force} force The force to stop tracking.
     * @return {undefined} undefined
     */
    value: function removeForce(force) {
      _removeElement(this, force, 'forces');
    }
  }, {
    key: 'removeConstraint',

    /**
     * Stop tracking a constraint.
     *
     * @method
     * @param {Constraint} constraint The constraint to stop tracking.
     * @return {undefined} undefined
     */
    value: function removeConstraint(constraint) {
      _removeElement(this, constraint, 'constraints');
    }
  }, {
    key: 'update',

    /**
     * Update the physics system to reflect the changes since the last frame. Steps forward in increments of
     * PhysicsEngine.step.
     *
     * @method
     * @param {Number} time The time to which to update.
     * @return {undefined} undefined
     */
    value: function update(time) {
      if (this.time === 0) this.time = time;

      var bodies = this.bodies;
      var forces = this.forces;
      var constraints = this.constraints;

      var frameDependent = this.frameDependent;
      var step = this.step;
      var dt = step * 0.001;
      var speed = this.speed;

      var delta = this.delta;
      delta += (time - this.time) * speed;
      this.time = time;

      var i, len;
      var force, body, constraint;

      while (delta > step) {
        this.events.trigger('prestep', time);

        // Update Forces on particles
        for (i = 0, len = forces.length; i < len; i++) {
          force = forces[i];
          if (force === null) continue;
          force.update(time, dt);
        }

        // Tentatively update velocities
        for (i = 0, len = bodies.length; i < len; i++) {
          body = bodies[i];
          if (body === null) continue;
          _integrateVelocity(body, dt);
        }

        // Prep constraints for solver
        for (i = 0, len = constraints.length; i < len; i++) {
          constraint = constraints[i];
          if (constraint === null) continue;
          constraint.update(time, dt);
        }

        // Iteratively resolve constraints
        for (var j = 0, numIterations = this.iterations; j < numIterations; j++) {
          for (i = 0, len = constraints.length; i < len; i++) {
            constraint = constraints[i];
            if (constraint === null) continue;
            constraint.resolve(time, dt);
          }
        }

        // Increment positions and orientations
        for (i = 0, len = bodies.length; i < len; i++) {
          body = bodies[i];
          if (body === null) continue;
          _integratePose(body, dt);
        }

        this.events.trigger('poststep', time);

        if (frameDependent) delta = 0;else delta -= step;
      }

      this.delta = delta;
    }
  }, {
    key: 'getTransform',

    /**
     * Transform the body position and rotation to world coordinates.
     *
     * @method
     * @param {Particle} body The body to retrieve the transform of.
     * @return {Object} Position and rotation of the body, taking into account
     * the origin and orientation of the world.
     */
    value: function getTransform(body) {
      var o = this.origin;
      var oq = this.orientation;
      var transform = this.transformBuffers;

      var p = body.position;
      var q = body.orientation;
      var rot = q;
      var loc = p;

      if (oq.w !== 1) {
        rot = _mathQuaternion.Quaternion.multiply(q, oq, QUAT_REGISTER);
        loc = oq.rotateVector(p, VEC_REGISTER);
      }

      transform.position[0] = o.x + loc.x;
      transform.position[1] = o.y + loc.y;
      transform.position[2] = o.z + loc.z;

      transform.rotation[0] = rot.x;
      transform.rotation[1] = rot.y;
      transform.rotation[2] = rot.z;
      transform.rotation[3] = rot.w;

      return transform;
    }
  }]);

  return PhysicsEngine;
})();

function _addElement(context, element, key) {
  var map = context._entityMaps[key];
  if (map[element._ID] == null) {
    var library = context[key];
    var indexPool = context._indexPools[key];
    if (indexPool.length) {
      map[element._ID] = indexPool.pop();
    } else {
      map[element._ID] = library.length;
    }
    library[map[element._ID]] = element;
  }
}

/**
 * Private helper method to remove an element from a library array.
 *
 * @method
 * @private
 * @param {Object} context Object in possesion of the element arrays.
 * @param {Object} element The body, force, or constraint to remove.
 * @param {String} key Where to store the element.
 * @return {undefined} undefined
 */
function _removeElement(context, element, key) {
  var map = context._entityMaps[key];
  var index = map[element._ID];
  if (index != null) {
    context._indexPools[key].push(index);
    context[key][index] = null;
    map[element._ID] = null;
  }
}

/**
 * Update the Particle momenta based off of current incident force and torque.
 *
 * @method
 * @private
 * @param {Particle} body The body to update.
 * @param {Number} dt Delta time.
 * @return {undefined} undefined
 */
function _integrateVelocity(body, dt) {
  body.momentum.add(_mathVec3.Vec3.scale(body.force, dt, DELTA_REGISTER));
  body.angularMomentum.add(_mathVec3.Vec3.scale(body.torque, dt, DELTA_REGISTER));
  _mathVec3.Vec3.scale(body.momentum, body.inverseMass, body.velocity);
  body.inverseInertia.vectorMultiply(body.angularMomentum, body.angularVelocity);
  body.force.clear();
  body.torque.clear();
}

/**
 * Update the Particle position and orientation based off current translational and angular velocities.
 *
 * @method
 * @private
 * @param {Particle} body The body to update.
 * @param {Number} dt Delta time.
 * @return {undefined} undefined
 */
function _integratePose(body, dt) {
  if (body.restrictions !== 0) {
    var restrictions = body.restrictions;
    var x = null;
    var y = null;
    var z = null;
    var ax = null;
    var ay = null;
    var az = null;

    if (restrictions & 32) x = 0;
    if (restrictions & 16) y = 0;
    if (restrictions & 8) z = 0;
    if (restrictions & 4) ax = 0;
    if (restrictions & 2) ay = 0;
    if (restrictions & 1) az = 0;

    if (x !== null || y !== null || z !== null) body.setVelocity(x, y, z);
    if (ax !== null || ay !== null || az !== null) body.setAngularVelocity(ax, ay, az);
  }

  body.position.add(_mathVec3.Vec3.scale(body.velocity, dt, DELTA_REGISTER));

  var w = body.angularVelocity;
  var q = body.orientation;
  var wx = w.x;
  var wy = w.y;
  var wz = w.z;

  var qw = q.w;
  var qx = q.x;
  var qy = q.y;
  var qz = q.z;

  var hdt = dt * 0.5;
  q.w += (-wx * qx - wy * qy - wz * qz) * hdt;
  q.x += (wx * qw + wy * qz - wz * qy) * hdt;
  q.y += (wy * qw + wz * qx - wx * qz) * hdt;
  q.z += (wz * qw + wx * qy - wy * qx) * hdt;

  q.normalize();

  body.updateInertia();
}

exports.PhysicsEngine = PhysicsEngine;

},{"../math/Quaternion":36,"../math/Vec3":38,"../utilities/CallbackStore":53,"./bodies/Particle":40,"./constraints/Constraint":42,"./forces/Force":43}],40:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mathVec3 = require('../../math/Vec3');

var _mathQuaternion = require('../../math/Quaternion');

var _mathMat33 = require('../../math/Mat33');

var _utilitiesCallbackStore = require('../../utilities/CallbackStore');

var ZERO_VECTOR = new _mathVec3.Vec3();

var MAT1_REGISTER = new _mathMat33.Mat33();

var _ID = 0;
/**
 * Fundamental physical body. Maintains translational and angular momentum, position and orientation, and other properties
 * such as size and coefficients of restitution and friction used in collision response.
 *
 * @class Particle
 * @param {Object} options Initial state of the body.
 */

var Particle = (function () {
  function Particle(options) {
    _classCallCheck(this, Particle);

    this.events = new _utilitiesCallbackStore.CallbackStore();

    options = options || {};

    this.position = options.position || new _mathVec3.Vec3();
    this.orientation = options.orientation || new _mathQuaternion.Quaternion();

    this.velocity = new _mathVec3.Vec3();
    this.momentum = new _mathVec3.Vec3();
    this.angularVelocity = new _mathVec3.Vec3();
    this.angularMomentum = new _mathVec3.Vec3();

    this.mass = options.mass || 1;
    this.inverseMass = 1 / this.mass;

    this.force = new _mathVec3.Vec3();
    this.torque = new _mathVec3.Vec3();

    this.restitution = options.restitution != null ? options.restitution : 0.4;
    this.friction = options.friction != null ? options.friction : 0.2;

    this.inverseInertia = new _mathMat33.Mat33([0, 0, 0, 0, 0, 0, 0, 0, 0]);

    this.localInertia = new _mathMat33.Mat33([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this.localInverseInertia = new _mathMat33.Mat33([0, 0, 0, 0, 0, 0, 0, 0, 0]);

    this.size = options.size || [0, 0, 0];

    var v = options.velocity;
    if (v) this.setVelocity(v.x, v.y, v.z);

    this.restrictions = 0;
    this.setRestrictions.apply(this, options.restrictions || []);

    this.collisionMask = options.collisionMask || 1;
    this.collisionGroup = options.collisionGroup || 1;

    this.type = 1 << 0;

    this._ID = _ID++;
  }

  /**
   * Listen for a specific event.
   *
   * @method
   * @param {String} key Name of the event.
   * @param {Function} callback Callback to register for the event.
   * @return {Particle} this
   */

  _createClass(Particle, [{
    key: 'on',
    value: function on(key, callback) {
      this.events.on(key, callback);
      return this;
    }
  }, {
    key: 'off',

    /**
     * Stop listening for a specific event.
     *
     * @method
     * @param {String} key Name of the event.
     * @param {Function} callback Callback to deregister for the event.
     * @return {Particle} this
     */
    value: function off(key, callback) {
      this.events.off(key, callback);
      return this;
    }
  }, {
    key: 'trigger',

    /**
     * Trigger an event.
     *
     * @method
     * @param {String} key Name of the event.
     * @param {Object} payload Payload to pass to the event listeners.
     * @return {Particle} this
     */
    value: function trigger(key, payload) {
      this.events.trigger(key, payload);
      return this;
    }
  }, {
    key: 'getRestrictions',

    /**
     * Getter for the restriction bitmask. Converts the restrictions to their string representation.
     *
     * @method
     * @return {String[]} restrictions
     */
    value: function getRestrictions() {
      var linear = '';
      var angular = '';
      var restrictions = this.restrictions;
      if (restrictions & 32) linear += 'x';
      if (restrictions & 16) linear += 'y';
      if (restrictions & 8) linear += 'z';
      if (restrictions & 4) angular += 'x';
      if (restrictions & 2) angular += 'y';
      if (restrictions & 1) angular += 'z';

      return [linear, angular];
    }
  }, {
    key: 'setRestrictions',

    /**
     * Setter for the particle restriction bitmask.
     *
     * @method
     * @param {String} transRestrictions The restrictions to linear motion.
     * @param {String} rotRestrictions The restrictions to rotational motion.
     * @return {Particle} this
     */
    value: function setRestrictions(transRestrictions, rotRestrictions) {
      transRestrictions = transRestrictions || '';
      rotRestrictions = rotRestrictions || '';
      this.restrictions = 0;
      if (transRestrictions.indexOf('x') > -1) this.restrictions |= 32;
      if (transRestrictions.indexOf('y') > -1) this.restrictions |= 16;
      if (transRestrictions.indexOf('z') > -1) this.restrictions |= 8;
      if (rotRestrictions.indexOf('x') > -1) this.restrictions |= 4;
      if (rotRestrictions.indexOf('y') > -1) this.restrictions |= 2;
      if (rotRestrictions.indexOf('z') > -1) this.restrictions |= 1;
      return this;
    }
  }, {
    key: 'getMass',

    /**
     * Getter for mass
     *
     * @method
     * @return {Number} mass
     */
    value: function getMass() {
      return this.mass;
    }
  }, {
    key: 'setMass',

    /**
     * Set the mass of the Particle.
     *
     * @method
     * @param {Number} mass The mass.
     * @return {Particle} this
     */
    value: function setMass(mass) {
      this.mass = mass;
      this.inverseMass = 1 / mass;
      return this;
    }
  }, {
    key: 'getInverseMass',

    /**
     * Getter for inverse mass
     *
     * @method
     * @return {Number} inverse mass
     */
    value: function getInverseMass() {
      return this.inverseMass;
    }
  }, {
    key: 'updateLocalInertia',

    /**
     * Resets the inertia tensor and its inverse to reflect the current shape.
     *
     * @method
     * @return {Particle} this
     */
    value: function updateLocalInertia() {
      this.localInertia.set([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      this.localInverseInertia.set([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      return this;
    }
  }, {
    key: 'updateInertia',

    /**
     * Updates the world inverse inertia tensor.
     *
     * @method
     * @return {Particle} this
     */
    value: function updateInertia() {
      var localInvI = this.localInverseInertia;
      var q = this.orientation;
      if (localInvI[0] === localInvI[4] && localInvI[4] === localInvI[8] || q.w === 1) return this;
      var R = q.toMatrix(MAT1_REGISTER);
      _mathMat33.Mat33.multiply(R, this.inverseInertia, this.inverseInertia);
      _mathMat33.Mat33.multiply(this.localInverseInertia, R.transpose(), this.inverseInertia);
      return this;
    }
  }, {
    key: 'getPosition',

    /**
     * Getter for position
     *
     * @method
     * @return {Vec3} position
     */
    value: function getPosition() {
      return this.position;
    }
  }, {
    key: 'setPosition',

    /**
     * Setter for position
     *
     * @method
     * @param {Number} x the x coordinate for position
     * @param {Number} y the y coordinate for position
     * @param {Number} z the z coordinate for position
     * @return {Particle} this
     * @return {Particle} this
     */
    value: function setPosition(x, y, z) {
      this.position.set(x, y, z);
      return this;
    }
  }, {
    key: 'getVelocity',

    /**
     * Getter for velocity
     *
     * @method
     * @return {Vec3} velocity
     */
    value: function getVelocity() {
      return this.velocity;
    }
  }, {
    key: 'setVelocity',

    /**
     * Setter for velocity
     *
     * @method
     * @param {Number} x the x coordinate for velocity
     * @param {Number} y the y coordinate for velocity
     * @param {Number} z the z coordinate for velocity
     * @return {Particle} this
     */
    value: function setVelocity(x, y, z) {
      this.velocity.set(x, y, z);
      _mathVec3.Vec3.scale(this.velocity, this.mass, this.momentum);
      return this;
    }
  }, {
    key: 'getMomentum',

    /**
     * Getter for momenutm
     *
     * @method
     * @return {Vec3} momentum
     */
    value: function getMomentum() {
      return this.momentum;
    }
  }, {
    key: 'setMomentum',

    /**
     * Setter for momentum
     *
     * @method
     * @param {Number} x the x coordinate for momentum
     * @param {Number} y the y coordinate for momentum
     * @param {Number} z the z coordinate for momentum
     * @return {Particle} this
     */
    value: function setMomentum(x, y, z) {
      this.momentum.set(x, y, z);
      _mathVec3.Vec3.scale(this.momentum, this.inverseMass, this.velocity);
      return this;
    }
  }, {
    key: 'getOrientation',

    /**
     * Getter for orientation
     *
     * @method
     * @return {Quaternion} orientation
     */
    value: function getOrientation() {
      return this.orientation;
    }
  }, {
    key: 'setOrientation',

    /**
     * Setter for orientation
     *
     * @method
     * @param {Number} w The w component.
     * @param {Number} x The x component.
     * @param {Number} y The y component.
     * @param {Number} z The z component.
     * @return {Particle} this
     */
    value: function setOrientation(w, x, y, z) {
      this.orientation.set(w, x, y, z).normalize();
      this.updateInertia();
      return this;
    }
  }, {
    key: 'getAngularVelocity',

    /**
     * Getter for angular velocity
     *
     * @method
     * @return {Vec3} angularVelocity
     */
    value: function getAngularVelocity() {
      return this.angularVelocity;
    }
  }, {
    key: 'setAngularVelocity',

    /**
     * Setter for angular velocity
     *
     * @method
     * @param {Number} x The x component.
     * @param {Number} y The y component.
     * @param {Number} z The z component.
     * @return {Particle} this
     */
    value: function setAngularVelocity(x, y, z) {
      this.angularVelocity.set(x, y, z);
      var I = _mathMat33.Mat33.inverse(this.inverseInertia, MAT1_REGISTER);
      if (I) I.vectorMultiply(this.angularVelocity, this.angularMomentum);else this.angularMomentum.clear();
      return this;
    }
  }, {
    key: 'getAngularMomentum',

    /**
     * Getter for angular momentum
     *
     * @method
     * @return {Vec3} angular momentum
     */
    value: function getAngularMomentum() {
      return this.angularMomentum;
    }
  }, {
    key: 'setAngularMomentum',

    /**
     * Setter for angular momentum
     *
     * @method
     * @param {Number} x The x component.
     * @param {Number} y The y component.
     * @param {Number} z The z component.
     * @return {Particle} this
     */
    value: function setAngularMomentum(x, y, z) {
      this.angularMomentum.set(x, y, z);
      this.inverseInertia.vectorMultiply(this.angularMomentum, this.angularVelocity);
      return this;
    }
  }, {
    key: 'getForce',

    /**
     * Getter for the force on the Particle
     *
     * @method
     * @return {Vec3} force
     */
    value: function getForce() {
      return this.force;
    }
  }, {
    key: 'setForce',

    /**
     * Setter for the force on the Particle
     *
     * @method
     * @param {Number} x The x component.
     * @param {Number} y The y component.
     * @param {Number} z The z component.
     * @return {Particle} this
     */
    value: function setForce(x, y, z) {
      this.force.set(x, y, z);
      return this;
    }
  }, {
    key: 'getTorque',

    /**
     * Getter for torque.
     *
     * @method
     * @return {Vec3} torque
     */
    value: function getTorque() {
      return this.torque;
    }
  }, {
    key: 'setTorque',

    /**
     * Setter for torque.
     *
     * @method
     * @param {Number} x The x component.
     * @param {Number} y The y component.
     * @param {Number} z The z component.
     * @return {Particle} this
     */
    value: function setTorque(x, y, z) {
      this.torque.set(x, y, z);
      return this;
    }
  }, {
    key: 'applyForce',

    /**
     * Extends Particle.applyForce with an optional argument
     * to apply the force at an off-centered location, resulting in a torque.
     *
     * @method
     * @param {Vec3} force Force to apply.
     * @return {Particle} this
     */
    value: function applyForce(force) {
      this.force.add(force);
      return this;
    }
  }, {
    key: 'applyTorque',

    /**
     * Applied a torque force to a Particle, inducing a rotation.
     *
     * @method
     * @param {Vec3} torque Torque to apply.
     * @return {Particle} this
     */
    value: function applyTorque(torque) {
      this.torque.add(torque);
      return this;
    }
  }, {
    key: 'applyImpulse',

    /**
     * Applies an impulse to momentum and updates velocity.
     *
     * @method
     * @param {Vec3} impulse Impulse to apply.
     * @return {Particle} this
     */
    value: function applyImpulse(impulse) {
      this.momentum.add(impulse);
      _mathVec3.Vec3.scale(this.momentum, this.inverseMass, this.velocity);
      return this;
    }
  }, {
    key: 'applyAngularImpulse',

    /**
     * Applies an angular impulse to angular momentum and updates angular velocity.
     *
     * @method
     * @param {Vec3} angularImpulse Angular impulse to apply.
     * @return {Particle} this
     */
    value: function applyAngularImpulse(angularImpulse) {
      this.angularMomentum.add(angularImpulse);
      this.inverseInertia.vectorMultiply(this.angularMomentum, this.angularVelocity);
      return this;
    }
  }, {
    key: 'support',

    /**
     * Used in collision detection. The support function should accept a Vec3 direction
     * and return the point on the body's shape furthest in that direction. For point particles,
     * this returns the zero vector.
     *
     * @method
     * @return {Vec3} The zero vector.
     */
    value: function support() {
      return ZERO_VECTOR;
    }
  }, {
    key: 'updateShape',

    /**
     * Update the body's shape to reflect current orientation. Called in Collision.
     * Noop for point particles.
     *
     * @method
     * @return {undefined} undefined
     */
    value: function updateShape() {}
  }]);

  return Particle;
})();

exports.Particle = Particle;

},{"../../math/Mat33":35,"../../math/Quaternion":36,"../../math/Vec3":38,"../../utilities/CallbackStore":53}],41:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Particle2 = require('./Particle');

var _mathVec3 = require('../../math/Vec3');

var SUPPORT_REGISTER = new _mathVec3.Vec3();

/**
 * Spherical Rigid body
 *
 * @class Sphere
 * @extends Particle
 * @param {Object} options The initial state of the body.
 */

var Sphere = (function (_Particle) {
  _inherits(Sphere, _Particle);

  function Sphere(options) {
    _classCallCheck(this, Sphere);

    _get(Object.getPrototypeOf(Sphere.prototype), 'constructor', this).call(this, options);
    var r = options.radius || 1;
    this.radius = r;
    this.size = [2 * r, 2 * r, 2 * r];
    this.updateLocalInertia();
    this.inverseInertia.copy(this.localInverseInertia);

    var w = options.angularVelocity;
    if (w) this.setAngularVelocity(w.x, w.y, w.z);

    this.type = 1 << 2;
  }

  /**
   * Getter for radius.
   *
   * @method
   * @return {Number} radius
   */

  _createClass(Sphere, [{
    key: 'getRadius',
    value: function getRadius() {
      return this.radius;
    }
  }, {
    key: 'setRadius',

    /**
     * Setter for radius.
     *
     * @method
     * @param {Number} radius The intended radius of the sphere.
     * @return {Sphere} this
     */
    value: function setRadius(radius) {
      this.radius = radius;
      this.size = [2 * this.radius, 2 * this.radius, 2 * this.radius];
      return this;
    }
  }, {
    key: 'updateInertia',

    /**
     * Infers the inertia tensor.
     *
     * @override
     * @method
     * @return {undefined} undefined
     */

    value: function updateInertia() {
      var m = this.mass;
      var r = this.radius;

      var mrr = m * r * r;

      this.localInertia.set([0.4 * mrr, 0, 0, 0, 0.4 * mrr, 0, 0, 0, 0.4 * mrr]);

      this.localInverseInertia.set([2.5 / mrr, 0, 0, 0, 2.5 / mrr, 0, 0, 0, 2.5 / mrr]);
    }
  }, {
    key: 'support',

    /**
     * Returns the point on the sphere furthest in a given direction.
     *
     * @method
     * @param {Vec3} direction The direction in which to search.
     * @return {Vec3} The support point.
     */
    value: function support(direction) {
      return _mathVec3.Vec3.scale(direction, this.radius, SUPPORT_REGISTER);
    }
  }]);

  return Sphere;
})(_Particle2.Particle);

exports.Sphere = Sphere;

},{"../../math/Vec3":38,"./Particle":40}],42:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ID = 0;
/**
 * Base Constraint class to be used in the Physics
 * Subclass this class to implement a constraint
 *
 * @virtual
 * @class Constraint
 * @param {Object} options The options hash.
 */

var Constraint = (function () {
  function Constraint(options) {
    _classCallCheck(this, Constraint);

    options = options || {};
    this.setOptions(options);

    this._ID = _ID++;
  }

  /**
   * Decorates the Constraint with the options object.
   *
   * @method
   * @param {Object} options The options hash.
   * @return {undefined} undefined
   */

  _createClass(Constraint, [{
    key: 'setOptions',
    value: function setOptions(options) {
      for (var key in options) this[key] = options[key];
      this.init(options);
    }
  }, {
    key: 'init',

    /**
     * Method invoked upon instantiation and the setting of options.
     *
     * @method
     * @param {Object} options The options hash.
     * @return {undefined} undefined
     */
    value: function init(options) {}
  }, {
    key: 'update',

    /**
     * Detect violations of the constraint. Warm start the constraint, if possible.
     *
     * @method
     * @param {Number} time The current time in the physics engine.
     * @param {Number} dt The physics engine frame delta.
     * @return {undefined} undefined
     */
    value: function update(time, dt) {}
  }, {
    key: 'resolve',

    /**
     * Apply impulses to resolve the constraint.
     *
     * @method
     * @param {Number} time The current time in the physics engine.
     * @param {Number} dt The physics engine frame delta.
     * @return {undefined} undefined
     */
    value: function resolve(time, dt) {}
  }]);

  return Constraint;
})();

exports.Constraint = Constraint;

},{}],43:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ID = 0;
/**
 * Abstract force manager to apply forces to targets.
 *
 * @class Force
 * @virtual
 * @param {Particle[]} targets The targets of the force.
 * @param {Object} options The options hash.
 */

var Force = (function () {
  function Force(targets, options) {
    _classCallCheck(this, Force);

    if (targets) {
      if (targets instanceof Array) this.targets = targets;else this.targets = [targets];
    } else this.targets = [];

    options = options || {};
    this.setOptions(options);

    this._ID = _ID++;
  }

  /**
   * Decorates the Force with the options object.
   *
   * @method
   * @param {Object} options The options hash.
   * @return {undefined} undefined
   */

  _createClass(Force, [{
    key: 'setOptions',
    value: function setOptions(options) {
      for (var key in options) this[key] = options[key];
      this.init(options);
    }
  }, {
    key: 'addTarget',

    /**
     * Add a target or targets to the Force.
     *
     * @method
     * @param {Particle} target The body to begin targetting.
     * @return {undefined} undefined
     */
    value: function addTarget(target) {
      this.targets.push(target);
    }
  }, {
    key: 'removeTarget',

    /**
     * Remove a target or targets from the Force.
     *
     * @method
     * @param {Particle} target The body to stop targetting.
     * @return {undefined} undefined
     */
    value: function removeTarget(target) {
      var index = this.targets.indexOf(target);
      if (index < 0) return;
      this.targets.splice(index, 1);
    }
  }, {
    key: 'init',

    /**
     * Method invoked upon instantiation and the setting of options.
     *
     * @method
     * @param {Object} options The options hash.
     * @return {undefined} undefined
     */
    value: function init(options) {}
  }, {
    key: 'update',

    /**
     * Apply forces on each target.
     *
     * @method
     * @param {Number} time The current time in the physics engine.
     * @param {Number} dt The physics engine frame delta.
     * @return {undefined} undefined
     */
    value: function update(time, dt) {}
  }]);

  return Force;
})();

exports.Force = Force;

},{}],44:[function(require,module,exports){
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];

var rAF, cAF;

if (typeof window === 'object') {
  rAF = window.requestAnimationFrame;
  cAF = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;
  for (var x = 0; x < vendors.length && !rAF; ++x) {
    rAF = window[vendors[x] + 'RequestAnimationFrame'];
    cAF = window[vendors[x] + 'CancelRequestAnimationFrame'] || window[vendors[x] + 'CancelAnimationFrame'];
  }

  if (rAF && !cAF) {
    // cAF not supported.
    // Fall back to setInterval for now (very rare).
    rAF = null;
  }
}

if (!rAF) {
  var now = Date.now ? Date.now : function () {
    return new Date().getTime();
  };

  rAF = function (callback) {
    var currTime = now();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  cAF = function (id) {
    clearTimeout(id);
  };
}

var animationFrame = {
  /**
   * Cross browser version of [requestAnimationFrame]{@link https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame}.
   *
   * Used by Engine in order to establish a render loop.
   *
   * If no (vendor prefixed version of) `requestAnimationFrame` is available,
   * `setTimeout` will be used in order to emulate a render loop running at
   * approximately 60 frames per second.
   *
   * @method  requestAnimationFrame
   *
   * @param   {Function}  callback function to be invoked on the next frame.
   * @return  {Number}    requestId to be used to cancel the request using
   *                      {@link cancelAnimationFrame}.
   */
  requestAnimationFrame: rAF,

  /**
   * Cross browser version of [cancelAnimationFrame]{@link https://developer.mozilla.org/en-US/docs/Web/API/window/cancelAnimationFrame}.
   *
   * Cancels a previously using [requestAnimationFrame]{@link animationFrame#requestAnimationFrame}
   * scheduled request.
   *
   * Used for immediately stopping the render loop within the Engine.
   *
   * @method  cancelAnimationFrame
   *
   * @param   {Number}    requestId of the scheduled callback function
   *                      returned by [requestAnimationFrame]{@link animationFrame#requestAnimationFrame}.
   */
  cancelAnimationFrame: cAF
};

var requestAnimationFrame = rAF;
var cancelAnimationFrame = cAF;

exports.requestAnimationFrame = requestAnimationFrame;
exports.cancelAnimationFrame = cancelAnimationFrame;

},{}],45:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _animationFrame = require('./animationFrame');

exports.requestAnimationFrame = _animationFrame.requestAnimationFrame;
exports.cancelAnimationFrame = _animationFrame.cancelAnimationFrame;

},{"./animationFrame":44}],46:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _polyfills = require('../polyfills');

var polyfills = _interopRequireWildcard(_polyfills);

var rAF = polyfills.requestAnimationFrame;
var cAF = polyfills.cancelAnimationFrame;

/**
 * Boolean constant indicating whether the RequestAnimationFrameLoop has access
 * to the document. The document is being used in order to subscribe for
 * visibilitychange events used for normalizing the RequestAnimationFrameLoop
 * time when e.g. when switching tabs.
 *
 * @constant
 * @type {Boolean}
 */
var DOCUMENT_ACCESS = typeof document !== 'undefined';

if (DOCUMENT_ACCESS) {
  var VENDOR_HIDDEN;
  var VENDOR_VISIBILITY_CHANGE;

  // Opera 12.10 and Firefox 18 and later support
  if (typeof document.hidden !== 'undefined') {
    VENDOR_HIDDEN = 'hidden';
    VENDOR_VISIBILITY_CHANGE = 'visibilitychange';
  } else if (typeof document.mozHidden !== 'undefined') {
    VENDOR_HIDDEN = 'mozHidden';
    VENDOR_VISIBILITY_CHANGE = 'mozvisibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    VENDOR_HIDDEN = 'msHidden';
    VENDOR_VISIBILITY_CHANGE = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    VENDOR_HIDDEN = 'webkitHidden';
    VENDOR_VISIBILITY_CHANGE = 'webkitvisibilitychange';
  }
}

/**
 * RequestAnimationFrameLoop class used for updating objects on a frame-by-frame.
 * Synchronizes the `update` method invocations to the refresh rate of the
 * screen. Manages the `requestAnimationFrame`-loop by normalizing the passed in
 * timestamp when switching tabs.
 *
 * @class RequestAnimationFrameLoop
 */

var RequestAnimationFrameLoop = (function () {
  function RequestAnimationFrameLoop() {
    _classCallCheck(this, RequestAnimationFrameLoop);

    var _this = this;

    // References to objects to be updated on next frame.
    this._updates = [];

    this._looper = function (time) {
      _this.loop(time);
    };
    this._time = 0;
    this._stoppedAt = 0;
    this._sleep = 0;

    // Indicates whether the engine should be restarted when the tab/ window is
    // being focused again (visibility change).
    this._startOnVisibilityChange = true;

    // requestId as returned by requestAnimationFrame function;
    this._rAF = null;

    this._sleepDiff = true;

    // The engine is being started on instantiation.
    // TODO(alexanderGugel)
    this.start();

    // The RequestAnimationFrameLoop supports running in a non-browser
    // environment (e.g. Worker).
    if (DOCUMENT_ACCESS) {
      document.addEventListener(VENDOR_VISIBILITY_CHANGE, function () {
        _this._onVisibilityChange();
      });
    }
  }

  /**
   * Handle the switching of tabs.
   *
   * @method
   * @private
   *
   * @return {undefined} undefined
   */

  _createClass(RequestAnimationFrameLoop, [{
    key: '_onVisibilityChange',
    value: function _onVisibilityChange() {
      if (document[VENDOR_HIDDEN]) {
        this._onUnfocus();
      } else {
        this._onFocus();
      }
    }
  }, {
    key: '_onFocus',

    /**
     * Internal helper function to be invoked as soon as the window/ tab is being
     * focused after a visibiltiy change.
     *
     * @method
     * @private
     *
     * @return {undefined} undefined
     */
    value: function _onFocus() {
      if (this._startOnVisibilityChange) {
        this._start();
      }
    }
  }, {
    key: '_onUnfocus',

    /**
     * Internal helper function to be invoked as soon as the window/ tab is being
     * unfocused (hidden) after a visibiltiy change.
     *
     * @method  _onFocus
     * @private
     *
     * @return {undefined} undefined
     */
    value: function _onUnfocus() {
      this._stop();
    }
  }, {
    key: 'start',

    /**
     * Starts the RequestAnimationFrameLoop. When switching to a differnt tab/
     * window (changing the visibiltiy), the engine will be retarted when switching
     * back to a visible state.
     *
     * @method
     *
     * @return {RequestAnimationFrameLoop} this
     */
    value: function start() {
      if (!this._running) {
        this._startOnVisibilityChange = true;
        this._start();
      }
      return this;
    }
  }, {
    key: '_start',

    /**
     * Internal version of RequestAnimationFrameLoop's start function, not affecting
     * behavior on visibilty change.
     *
     * @method
     * @private
    *
     * @return {undefined} undefined
     */
    value: function _start() {
      this._running = true;
      this._sleepDiff = true;
      this._rAF = rAF(this._looper);
    }
  }, {
    key: 'stop',

    /**
     * Stops the RequestAnimationFrameLoop.
     *
     * @method
     * @private
     *
     * @return {RequestAnimationFrameLoop} this
     */
    value: function stop() {
      if (this._running) {
        this._startOnVisibilityChange = false;
        this._stop();
      }
      return this;
    }
  }, {
    key: '_stop',

    /**
     * Internal version of RequestAnimationFrameLoop's stop function, not affecting
     * behavior on visibilty change.
     *
     * @method
     * @private
     *
     * @return {undefined} undefined
     */
    value: function _stop() {
      this._running = false;
      this._stoppedAt = this._time;

      // Bug in old versions of Fx. Explicitly cancel.
      cAF(this._rAF);
    }
  }, {
    key: 'isRunning',

    /**
     * Determines whether the RequestAnimationFrameLoop is currently running or not.
     *
     * @method
     *
     * @return {Boolean} boolean value indicating whether the
     * RequestAnimationFrameLoop is currently running or not
     */
    value: function isRunning() {
      return this._running;
    }
  }, {
    key: 'step',

    /**
     * Updates all registered objects.
     *
     * @method
     *
     * @param {Number} time high resolution timstamp used for invoking the `update`
     * method on all registered objects
     *
     * @return {RequestAnimationFrameLoop} this
     */
    value: function step(time) {
      this._time = time;
      if (this._sleepDiff) {
        this._sleep += time - this._stoppedAt;
        this._sleepDiff = false;
      }

      // The same timetamp will be emitted immediately before and after visibility
      // change.
      var normalizedTime = time - this._sleep;
      for (var i = 0, len = this._updates.length; i < len; i++) {
        this._updates[i].update(normalizedTime);
      }
      return this;
    }
  }, {
    key: 'loop',

    /**
     * Method being called by `requestAnimationFrame` on every paint. Indirectly
     * recursive by scheduling a future invocation of itself on the next paint.
     *
     * @method
     *
     * @param {Number} time high resolution timstamp used for invoking the `update`
     * method on all registered objects
     * @return {RequestAnimationFrameLoop} this
     */
    value: function loop(time) {
      this.step(time);
      this._rAF = rAF(this._looper);
      return this;
    }
  }, {
    key: 'update',

    /**
     * Registeres an updateable object which `update` method should be invoked on
     * every paint, starting on the next paint (assuming the
     * RequestAnimationFrameLoop is running).
     *
     * @method
     *
     * @param {Object} updateable object to be updated
     * @param {Function} updateable.update update function to be called on the
     * registered object
     *
     * @return {RequestAnimationFrameLoop} this
     */
    value: function update(updateable) {
      if (this._updates.indexOf(updateable) === -1) {
        this._updates.push(updateable);
      }
      return this;
    }
  }, {
    key: 'noLongerUpdate',

    /**
     * Deregisters an updateable object previously registered using `update` to be
     * no longer updated.
     *
     * @method
     *
     * @param {Object} updateable updateable object previously registered using
     * `update`
     *
     * @return {RequestAnimationFrameLoop} this
     */
    value: function noLongerUpdate(updateable) {
      var index = this._updates.indexOf(updateable);
      if (index > -1) {
        this._updates.splice(index, 1);
      }
      return this;
    }
  }]);

  return RequestAnimationFrameLoop;
})();

exports.RequestAnimationFrameLoop = RequestAnimationFrameLoop;

},{"../polyfills":45}],47:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Context = require('./Context');

var _injectCss = require('./inject-css');

var _coreCommands = require('../core/Commands');

/**
 * Instantiates a new Compositor.
 * The Compositor receives draw commands frm the UIManager and routes the to the
 * respective context objects.
 *
 * Upon creation, it injects a stylesheet used for styling the individual
 * renderers used in the context objects.
 *
 * @class Compositor
 * @constructor
 * @return {undefined} undefined
 */

var Compositor = (function () {
  function Compositor() {
    _classCallCheck(this, Compositor);

    (0, _injectCss.injectCSS)();

    this._contexts = {};
    this._outCommands = [];
    this._inCommands = [];
    this._time = null;

    this._resized = false;

    var _this = this;
    window.addEventListener('resize', function () {
      _this.onResize();
    });
  }

  _createClass(Compositor, [{
    key: 'onResize',
    value: function onResize() {
      this._resized = true;
      for (var selector in this._contexts) {
        this._contexts[selector].updateSize();
      }
    }
  }, {
    key: 'getTime',

    /**
     * Retrieves the time being used by the internal clock managed by
     * `FamousEngine`.
     *
     * The time is being passed into core by the Engine through the UIManager.
     * Since core has the ability to scale the time, the time needs to be passed
     * back to the rendering system.
     *
     * @method
     *
     * @return {Number} time The clock time used in core.
     */
    value: function getTime() {
      return this._time;
    }
  }, {
    key: 'sendEvent',

    /**
     * Schedules an event to be sent the next time the out command queue is being
     * flushed.
     *
     * @method
     * @private
     *
     * @param  {String} path Render path to the node the event should be triggered
     * on (*targeted event*)
     * @param  {String} ev Event type
     * @param  {Object} payload Event object (serializable using structured cloning
     * algorithm)
     *
     * @return {undefined} undefined
     */
    value: function sendEvent(path, ev, payload) {
      this._outCommands.push(_coreCommands.Commands.WITH, path, _coreCommands.Commands.TRIGGER, ev, payload);
    }
  }, {
    key: 'sendResize',

    /**
     * Internal helper method used for notifying externally
     * resized contexts (e.g. by resizing the browser window).
     *
     * @method
     * @private
     *
     * @param  {String} selector render path to the node (context) that should be
     * resized
     * @param  {Array} size new context size
     *
     * @return {undefined} undefined
     */
    value: function sendResize(selector, size) {
      this.sendEvent(selector, 'CONTEXT_RESIZE', size);
    }
  }, {
    key: 'handleWith',

    /**
     * Internal helper method used by `drawCommands`.
     * Subsequent commands are being associated with the node defined the the path
     * following the `WITH` command.
     *
     * @method
     * @private
     *
     * @param  {Number} iterator position index within the commands queue
     * @param  {Array} commands remaining message queue received, used to
     * shift single messages from
     *
     * @return {undefined} undefined
     */
    value: function handleWith(iterator, commands) {
      var path = commands[iterator];
      var pathArr = path.split('/');
      var context = this.getOrSetContext(pathArr.shift());
      return context.receive(path, commands, iterator);
    }
  }, {
    key: 'getOrSetContext',

    /**
     * Retrieves the top-level Context associated with the passed in document
     * query selector. If no such Context exists, a new one will be instantiated.
     *
     * @method
     *
     * @param  {String} selector document query selector used for retrieving the
     * DOM node that should be used as a root element by the Context
     *
     * @return {Context} context
     */
    value: function getOrSetContext(selector) {
      if (this._contexts[selector]) {
        return this._contexts[selector];
      } else {
        var context = new _Context.Context(selector, this);
        this._contexts[selector] = context;
        return context;
      }
    }
  }, {
    key: 'getContext',

    /**
     * Retrieves a context object registered under the passed in selector.
     *
     * @method
     *
     * @param  {String} selector    Query selector that has previously been used to
     *                              register the context.
     * @return {Context}            The repsective context.
     */
    value: function getContext(selector) {
      if (this._contexts[selector]) return this._contexts[selector];
    }
  }, {
    key: 'drawCommands',

    /**
     * Processes the previously via `receiveCommands` updated incoming "in"
     * command queue.
     * Called by UIManager on a frame by frame basis.
     *
     * @method
     *
     * @return {Array} outCommands set of commands to be sent back
     */
    value: function drawCommands() {
      var commands = this._inCommands;
      var localIterator = 0;
      var command = commands[localIterator];
      while (command) {
        switch (command) {
          case _coreCommands.Commands.TIME:
            this._time = commands[++localIterator];
            break;
          case _coreCommands.Commands.WITH:
            localIterator = this.handleWith(++localIterator, commands);
            break;
          case _coreCommands.Commands.NEED_SIZE_FOR:
            this.giveSizeFor(++localIterator, commands);
            break;
        }
        command = commands[++localIterator];
      }

      // TODO: Switch to associative arrays here...

      for (var key in this._contexts) {
        this._contexts[key].draw();
      }

      if (this._resized) {
        this.updateSize();
      }

      return this._outCommands;
    }
  }, {
    key: 'updateSize',

    /**
     * Updates the size of all previously registered context objects.
     * This results into CONTEXT_RESIZE events being sent and the root elements
     * used by the individual renderers being resized to the the DOMRenderer's root
     * size.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function updateSize() {
      for (var selector in this._contexts) {
        this._contexts[selector].updateSize();
      }
    }
  }, {
    key: 'receiveCommands',

    /**
     * Used by ThreadManager to update the internal queue of incoming commands.
     * Receiving commands does not immediately start the rendering process.
     *
     * @method
     *
     * @param  {Array} commands command queue to be processed by the compositor's
     * `drawCommands` method
     *
     * @return {undefined} undefined
     */
    value: function receiveCommands(commands) {
      var len = commands.length;
      for (var i = 0; i < len; i++) {
        this._inCommands.push(commands[i]);
      }

      for (var selector in this._contexts) {
        this._contexts[selector].checkInit();
      }
    }
  }, {
    key: 'giveSizeFor',

    /**
     * Internal helper method used by `drawCommands`.
     *
     * @method
     * @private
     *
     * @param  {Number} iterator position index within the command queue
     * @param  {Array} commands remaining message queue received, used to
     * shift single messages
     *
     * @return {undefined} undefined
     */
    value: function giveSizeFor(iterator, commands) {
      var selector = commands[iterator];
      var context = this.getContext(selector);
      if (context) {
        var size = context.getRootSize();
        this.sendResize(selector, size);
      } else {
        this.getOrSetContext(selector);
      }
    }
  }, {
    key: 'clearCommands',

    /**
     * Flushes the queue of outgoing "out" commands.
     * Called by ThreadManager.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function clearCommands() {
      this._inCommands.length = 0;
      this._outCommands.length = 0;
      this._resized = false;
    }
  }]);

  return Compositor;
})();

exports.Compositor = Compositor;

},{"../core/Commands":6,"./Context":48,"./inject-css":50}],48:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _webglRenderersWebGLRenderer = require('../webgl-renderers/WebGLRenderer');

var _componentsCamera = require('../components/Camera');

var _domRenderersDOMRenderer = require('../dom-renderers/DOMRenderer');

var _coreCommands = require('../core/Commands');

/**
 * Context is a render layer with its own WebGLRenderer and DOMRenderer.
 * It is the interface between the Compositor which receives commands
 * and the renderers that interpret them. It also relays information to
 * the renderers about resizing.
 *
 * The DOMElement at the given query selector is used as the root. A
 * new DOMElement is appended to this root element, and used as the
 * parent element for all Famous DOM rendering at this context. A
 * canvas is added and used for all WebGL rendering at this context.
 *
 * @class Context
 * @constructor
 *
 * @param {String} selector Query selector used to locate root element of
 * context layer.
 * @param {Compositor} compositor Compositor reference to pass down to
 * WebGLRenderer.
 */

var Context = (function () {
  function Context(selector, compositor) {
    _classCallCheck(this, Context);

    this._compositor = compositor;
    this._rootEl = document.querySelector(selector);
    this._selector = selector;

    if (this._rootEl === null) {
      throw new Error('Failed to create Context: ' + 'No matches for "' + selector + '" found.');
    }

    this._selector = selector;

    // Initializes the DOMRenderer.
    // Every Context has at least a DOMRenderer for now.
    this._initDOMRenderer();

    // WebGLRenderer will be instantiated when needed.
    this._webGLRenderer = null;
    this._domRenderer = new _domRenderersDOMRenderer.DOMRenderer(this._domRendererRootEl, selector, compositor);
    this._canvasEl = null;

    // State holders

    this._renderState = {
      projectionType: _componentsCamera.Camera.ORTHOGRAPHIC_PROJECTION,
      perspectiveTransform: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
      viewTransform: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
      viewDirty: false,
      perspectiveDirty: false
    };

    this._size = [];

    this._meshTransform = new Float32Array(16);
    this._meshSize = [0, 0, 0];

    this._initDOM = false;

    this._commandCallbacks = [];
    this.initCommandCallbacks();

    this.updateSize();
  }

  // Command Callbacks

  /**
   * Queries DOMRenderer size and updates canvas size. Relays size information to
   * WebGLRenderer.
   *
   * @method
   *
   * @return {Context} this
   */

  _createClass(Context, [{
    key: 'updateSize',
    value: function updateSize() {
      var width = this._rootEl.offsetWidth;
      var height = this._rootEl.offsetHeight;

      this._size[0] = width;
      this._size[1] = height;
      this._size[2] = width > height ? width : height;

      this._compositor.sendResize(this._selector, this._size);
      if (this._webGLRenderer) this._webGLRenderer.updateSize(this._size);

      return this;
    }
  }, {
    key: 'draw',

    /**
     * Draw function called after all commands have been handled for current frame.
     * Issues draw commands to all renderers with current renderState.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function draw() {
      this._domRenderer.draw(this._renderState);
      if (this._webGLRenderer) this._webGLRenderer.draw(this._renderState);

      if (this._renderState.perspectiveDirty) this._renderState.perspectiveDirty = false;
      if (this._renderState.viewDirty) this._renderState.viewDirty = false;
    }
  }, {
    key: '_initDOMRenderer',

    /**
     * Initializes the DOMRenderer by creating a root DIV element and appending it
     * to the context.
     *
     * @method
     * @private
     *
     * @return {undefined} undefined
     */
    value: function _initDOMRenderer() {
      this._domRendererRootEl = document.createElement('div');
      this._rootEl.appendChild(this._domRendererRootEl);
      this._domRendererRootEl.style.visibility = 'hidden';

      this._domRenderer = new _domRenderersDOMRenderer.DOMRenderer(this._domRendererRootEl, this._selector, this._compositor);
    }
  }, {
    key: 'initCommandCallbacks',
    value: function initCommandCallbacks() {
      this._commandCallbacks[_coreCommands.Commands.INIT_DOM] = initDOM;
      this._commandCallbacks[_coreCommands.Commands.DOM_RENDER_SIZE] = domRenderSize;
      this._commandCallbacks[_coreCommands.Commands.CHANGE_TRANSFORM] = changeTransform;
      this._commandCallbacks[_coreCommands.Commands.CHANGE_SIZE] = changeSize;
      this._commandCallbacks[_coreCommands.Commands.CHANGE_PROPERTY] = changeProperty;
      this._commandCallbacks[_coreCommands.Commands.CHANGE_CONTENT] = changeContent;
      this._commandCallbacks[_coreCommands.Commands.CHANGE_ATTRIBUTE] = changeAttribute;
      this._commandCallbacks[_coreCommands.Commands.ADD_CLASS] = addClass;
      this._commandCallbacks[_coreCommands.Commands.REMOVE_CLASS] = removeClass;
      this._commandCallbacks[_coreCommands.Commands.SUBSCRIBE] = subscribe;
      this._commandCallbacks[_coreCommands.Commands.UNSUBSCRIBE] = unsubscribe;
      this._commandCallbacks[_coreCommands.Commands.GL_SET_DRAW_OPTIONS] = glSetDrawOptions;
      this._commandCallbacks[_coreCommands.Commands.GL_AMBIENT_LIGHT] = glAmbientLight;
      this._commandCallbacks[_coreCommands.Commands.GL_LIGHT_POSITION] = glLightPosition;
      this._commandCallbacks[_coreCommands.Commands.GL_LIGHT_COLOR] = glLightColor;
      this._commandCallbacks[_coreCommands.Commands.MATERIAL_INPUT] = materialInput;
      this._commandCallbacks[_coreCommands.Commands.GL_SET_GEOMETRY] = glSetGeometry;
      this._commandCallbacks[_coreCommands.Commands.GL_UNIFORMS] = glUniforms;
      this._commandCallbacks[_coreCommands.Commands.GL_BUFFER_DATA] = glBufferData;
      this._commandCallbacks[_coreCommands.Commands.GL_CUTOUT_STATE] = glCutoutState;
      this._commandCallbacks[_coreCommands.Commands.GL_MESH_VISIBILITY] = glMeshVisibility;
      this._commandCallbacks[_coreCommands.Commands.GL_REMOVE_MESH] = glRemoveMesh;
      this._commandCallbacks[_coreCommands.Commands.PINHOLE_PROJECTION] = pinholeProjection;
      this._commandCallbacks[_coreCommands.Commands.ORTHOGRAPHIC_PROJECTION] = orthographicProjection;
      this._commandCallbacks[_coreCommands.Commands.CHANGE_VIEW_TRANSFORM] = changeViewTransform;
      this._commandCallbacks[_coreCommands.Commands.PREVENT_DEFAULT] = preventDefault;
      this._commandCallbacks[_coreCommands.Commands.ALLOW_DEFAULT] = allowDefault;
      this._commandCallbacks[_coreCommands.Commands.READY] = ready;
    }
  }, {
    key: '_initWebGLRenderer',

    /**
     * Initializes the WebGLRenderer and updates it initial size.
     *
     * The Initialization process consists of the following steps:
     *
     * 1. A new `<canvas>` element is being created and appended to the root element.
     * 2. The WebGLRenderer is being instantiated.
     * 3. The size of the WebGLRenderer is being updated.
     *
     * @method
     * @private
     *
     * @return {undefined} undefined
     */
    value: function _initWebGLRenderer() {
      this._webGLRendererRootEl = document.createElement('canvas');
      this._rootEl.appendChild(this._webGLRendererRootEl);

      this._webGLRenderer = new _webglRenderersWebGLRenderer.WebGLRenderer(this._webGLRendererRootEl, this._compositor);

      // Don't read offset width and height.
      this._webGLRenderer.updateSize(this._size);
    }
  }, {
    key: 'getRootSize',

    /**
     * Gets the size of the parent element of the DOMRenderer for this context.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function getRootSize() {
      return [this._rootEl.offsetWidth, this._rootEl.offsetHeight];
    }
  }, {
    key: 'checkInit',

    /**
     * Initializes the context if the `READY` command has been received earlier.
     *
     * @return {undefined} undefined
     */
    value: function checkInit() {
      if (this._initDOM) {
        this._domRendererRootEl.style.visibility = 'visible';
        this._initDOM = false;
      }
    }
  }, {
    key: 'receive',

    /**
     * Handles delegation of commands to renderers of this context.
     *
     * @method
     *
     * @param {String} path String used as identifier of a given node in the
     * scene graph.
     * @param {Array} commands List of all commands from this frame.
     * @param {Number} iterator Number indicating progress through the command
     * queue.
     *
     * @return {Number} iterator indicating progress through the command queue.
     */
    value: function receive(path, commands, iterator) {
      var localIterator = iterator;

      var command = commands[++localIterator];

      this._domRenderer.loadPath(path);

      while (command != null) {
        if (command === _coreCommands.Commands.WITH || command === _coreCommands.Commands.TIME) return localIterator - 1;else localIterator = this._commandCallbacks[command](this, path, commands, localIterator) + 1;
        command = commands[localIterator];
      }

      return localIterator;
    }
  }, {
    key: 'getDOMRenderer',

    /**
     * Getter method used for retrieving the used DOMRenderer.
     *
     * @method
     *
     * @return {DOMRenderer}    The DOMRenderer being used by the Context.
     */
    value: function getDOMRenderer() {
      return this._domRenderer;
    }
  }, {
    key: 'getWebGLRenderer',

    /**
     * Getter method used for retrieving the used WebGLRenderer (if any).
     *
     * @method
     *
     * @return {WebGLRenderer|null}    The WebGLRenderer being used by the Context.
     */
    value: function getWebGLRenderer() {
      return this._webGLRenderer;
    }
  }]);

  return Context;
})();

function preventDefault(context, path, commands, iterator) {
  if (context._webGLRenderer) context._webGLRenderer.getOrSetCutout(path);
  context._domRenderer.preventDefault(commands[++iterator]);
  return iterator;
}

function allowDefault(context, path, commands, iterator) {
  if (context._webGLRenderer) context._webGLRenderer.getOrSetCutout(path);
  context._domRenderer.allowDefault(commands[++iterator]);
  return iterator;
}

function ready(context, path, commands, iterator) {
  context._initDOM = true;
  return iterator;
}

function initDOM(context, path, commands, iterator) {
  context._domRenderer.insertEl(commands[++iterator]);
  return iterator;
}

function domRenderSize(context, path, commands, iterator) {
  context._domRenderer.getSizeOf(commands[++iterator]);
  return iterator;
}

function changeTransform(context, path, commands, iterator) {
  var temp = context._meshTransform;

  temp[0] = commands[++iterator];
  temp[1] = commands[++iterator];
  temp[2] = commands[++iterator];
  temp[3] = commands[++iterator];
  temp[4] = commands[++iterator];
  temp[5] = commands[++iterator];
  temp[6] = commands[++iterator];
  temp[7] = commands[++iterator];
  temp[8] = commands[++iterator];
  temp[9] = commands[++iterator];
  temp[10] = commands[++iterator];
  temp[11] = commands[++iterator];
  temp[12] = commands[++iterator];
  temp[13] = commands[++iterator];
  temp[14] = commands[++iterator];
  temp[15] = commands[++iterator];

  context._domRenderer.setMatrix(temp);

  if (context._webGLRenderer) context._webGLRenderer.setCutoutUniform(path, 'u_transform', temp);

  return iterator;
}

function changeSize(context, path, commands, iterator) {
  var width = commands[++iterator];
  var height = commands[++iterator];

  context._domRenderer.setSize(width, height);
  if (context._webGLRenderer) {
    context._meshSize[0] = width;
    context._meshSize[1] = height;
    context._webGLRenderer.setCutoutUniform(path, 'u_size', context._meshSize);
  }

  return iterator;
}

function changeProperty(context, path, commands, iterator) {
  if (context._webGLRenderer) context._webGLRenderer.getOrSetCutout(path);
  context._domRenderer.setProperty(commands[++iterator], commands[++iterator]);
  return iterator;
}

function changeContent(context, path, commands, iterator) {
  if (context._webGLRenderer) context._webGLRenderer.getOrSetCutout(path);
  context._domRenderer.setContent(commands[++iterator]);
  return iterator;
}

function changeAttribute(context, path, commands, iterator) {
  if (context._webGLRenderer) context._webGLRenderer.getOrSetCutout(path);
  context._domRenderer.setAttribute(commands[++iterator], commands[++iterator]);
  return iterator;
}

function addClass(context, path, commands, iterator) {
  if (context._webGLRenderer) context._webGLRenderer.getOrSetCutout(path);
  context._domRenderer.addClass(commands[++iterator]);
  return iterator;
}

function removeClass(context, path, commands, iterator) {
  if (context._webGLRenderer) context._webGLRenderer.getOrSetCutout(path);
  context._domRenderer.removeClass(commands[++iterator]);
  return iterator;
}

function subscribe(context, path, commands, iterator) {
  if (context._webGLRenderer) context._webGLRenderer.getOrSetCutout(path);
  context._domRenderer.subscribe(commands[++iterator]);
  return iterator;
}

function unsubscribe(context, path, commands, iterator) {
  if (context._webGLRenderer) context._webGLRenderer.getOrSetCutout(path);
  context._domRenderer.unsubscribe(commands[++iterator]);
  return iterator;
}

function glSetDrawOptions(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.setMeshOptions(path, commands[++iterator]);
  return iterator;
}

function glAmbientLight(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.setAmbientLightColor(path, commands[++iterator], commands[++iterator], commands[++iterator]);
  return iterator;
}

function glLightPosition(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.setLightPosition(path, commands[++iterator], commands[++iterator], commands[++iterator]);
  return iterator;
}

function glLightColor(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.setLightColor(path, commands[++iterator], commands[++iterator], commands[++iterator]);
  return iterator;
}

function materialInput(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.handleMaterialInput(path, commands[++iterator], commands[++iterator]);
  return iterator;
}

function glSetGeometry(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.setGeometry(path, commands[++iterator], commands[++iterator], commands[++iterator]);
  return iterator;
}

function glUniforms(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.setMeshUniform(path, commands[++iterator], commands[++iterator]);
  return iterator;
}

function glBufferData(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.bufferData(commands[++iterator], commands[++iterator], commands[++iterator], commands[++iterator], commands[++iterator]);
  return iterator;
}

function glCutoutState(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.setCutoutState(path, commands[++iterator]);
  return iterator;
}

function glMeshVisibility(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.setMeshVisibility(path, commands[++iterator]);
  return iterator;
}

function glRemoveMesh(context, path, commands, iterator) {
  if (!context._webGLRenderer) context._initWebGLRenderer();
  context._webGLRenderer.removeMesh(path);
  return iterator;
}

function pinholeProjection(context, path, commands, iterator) {
  context._renderState.projectionType = _componentsCamera.Camera.PINHOLE_PROJECTION;
  context._renderState.perspectiveTransform[11] = -1 / commands[++iterator];
  context._renderState.perspectiveDirty = true;
  return iterator;
}

function orthographicProjection(context, path, commands, iterator) {
  context._renderState.projectionType = _componentsCamera.Camera.ORTHOGRAPHIC_PROJECTION;
  context._renderState.perspectiveTransform[11] = 0;
  context._renderState.perspectiveDirty = true;
  return iterator;
}

function changeViewTransform(context, path, commands, iterator) {
  context._renderState.viewTransform[0] = commands[++iterator];
  context._renderState.viewTransform[1] = commands[++iterator];
  context._renderState.viewTransform[2] = commands[++iterator];
  context._renderState.viewTransform[3] = commands[++iterator];

  context._renderState.viewTransform[4] = commands[++iterator];
  context._renderState.viewTransform[5] = commands[++iterator];
  context._renderState.viewTransform[6] = commands[++iterator];
  context._renderState.viewTransform[7] = commands[++iterator];

  context._renderState.viewTransform[8] = commands[++iterator];
  context._renderState.viewTransform[9] = commands[++iterator];
  context._renderState.viewTransform[10] = commands[++iterator];
  context._renderState.viewTransform[11] = commands[++iterator];

  context._renderState.viewTransform[12] = commands[++iterator];
  context._renderState.viewTransform[13] = commands[++iterator];
  context._renderState.viewTransform[14] = commands[++iterator];
  context._renderState.viewTransform[15] = commands[++iterator];

  context._renderState.viewDirty = true;
  return iterator;
}

exports.Context = Context;

},{"../components/Camera":1,"../core/Commands":6,"../dom-renderers/DOMRenderer":21,"../webgl-renderers/WebGLRenderer":82}],49:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _coreCommands = require('../core/Commands');

/**
 * The UIManager is being updated by an Engine by consecutively calling its
 * `update` method. It can either manage a real Web-Worker or the global
 * FamousEngine core singleton.
 *
 * @example
 * var compositor = new Compositor();
 * var engine = new Engine();
 *
 * // Using a Web Worker
 * var worker = new Worker('worker.bundle.js');
 * var threadmanger = new UIManager(worker, compositor, engine);
 *
 * // Without using a Web Worker
 * var threadmanger = new UIManager(Famous, compositor, engine);
 *
 * @class  UIManager
 * @constructor
 *
 * @param {Famous|Worker} thread The thread being used to receive messages
 * from and post messages to. Expected to expose a WebWorker-like API, which
 * means providing a way to listen for updates by setting its `onmessage`
 * property and sending updates using `postMessage`.
 * @param {Compositor} compositor an instance of Compositor used to extract
 * enqueued draw commands from to be sent to the thread.
 * @param {RenderLoop} renderLoop an instance of Engine used for executing
 * the `ENGINE` commands on.
 */

var UIManager = (function () {
  function UIManager(thread, compositor, renderLoop) {
    _classCallCheck(this, UIManager);

    this._thread = thread;
    this._compositor = compositor;
    this._renderLoop = renderLoop;

    this._renderLoop.update(this);

    var _this = this;
    this._thread.onmessage = function (ev) {
      var message = ev.data ? ev.data : ev;
      if (message[0] === _coreCommands.Commands.ENGINE) {
        switch (message[1]) {
          case _coreCommands.Commands.START:
            _this._engine.start();
            break;
          case _coreCommands.Commands.STOP:
            _this._engine.stop();
            break;
          default:
            console.error('Unknown ENGINE command "' + message[1] + '"');
            break;
        }
      } else {
        _this._compositor.receiveCommands(message);
      }
    };
    this._thread.onerror = function (error) {
      console.error(error);
    };
  }

  /**
   * Returns the thread being used by the UIManager.
   * This could either be an an actual web worker or a `FamousEngine` singleton.
   *
   * @method
   *
   * @return {Worker|FamousEngine} Either a web worker or a `FamousEngine` singleton.
   */

  _createClass(UIManager, [{
    key: 'getThread',
    value: function getThread() {
      return this._thread;
    }
  }, {
    key: 'getCompositor',

    /**
     * Returns the compositor being used by this UIManager.
     *
     * @method
     *
     * @return {Compositor} The compositor used by the UIManager.
     */
    value: function getCompositor() {
      return this._compositor;
    }
  }, {
    key: 'getEngine',

    /**
     * Returns the engine being used by this UIManager.
     *
     * @method
     * @deprecated Use {@link UIManager#getRenderLoop instead!}
     *
     * @return {Engine} The engine used by the UIManager.
     */
    value: function getEngine() {
      return this._renderLoop;
    }
  }, {
    key: 'getRenderLoop',

    /**
     * Returns the render loop currently being used by the UIManager.
     *
     * @method
     *
     * @return {RenderLoop}  The registered render loop used for updating the
     * UIManager.
     */
    value: function getRenderLoop() {
      return this._renderLoop;
    }
  }, {
    key: 'update',

    /**
     * Update method being invoked by the Engine on every `requestAnimationFrame`.
     * Used for updating the notion of time within the managed thread by sending
     * a FRAME command and sending messages to
     *
     * @method
     *
     * @param  {Number} time unix timestamp to be passed down to the worker as a
     * FRAME command
     * @return {undefined} undefined
     */
    value: function update(time) {
      this._thread.postMessage([_coreCommands.Commands.FRAME, time]);
      var threadMessages = this._compositor.drawCommands();
      this._thread.postMessage(threadMessages);
      this._compositor.clearCommands();
    }
  }]);

  return UIManager;
})();

exports.UIManager = UIManager;

},{"../core/Commands":6}],50:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var css = '.famous-dom-renderer {' + 'width:100%;' + 'height:100%;' + 'transform-style:preserve-3d;' + '-webkit-transform-style:preserve-3d;' + '}' + '.famous-dom-element {' + '-webkit-transform-origin:0% 0%;' + 'transform-origin:0% 0%;' + '-webkit-backface-visibility:visible;' + 'backface-visibility:visible;' + '-webkit-transform-style:preserve-3d;' + 'transform-style:preserve-3d;' + '-webkit-tap-highlight-color:transparent;' + 'pointer-events:auto;' + 'z-index:1;' + '}' + '.famous-dom-element-content,' + '.famous-dom-element {' + 'position:absolute;' + 'box-sizing:border-box;' + '-moz-box-sizing:border-box;' + '-webkit-box-sizing:border-box;' + '}' + '.famous-webgl-renderer {' + '-webkit-transform:translateZ(1000000px);' + /* TODO: Fix when Safari Fixes*/
'transform:translateZ(1000000px);' + 'pointer-events:none;' + 'position:absolute;' + 'z-index:1;' + 'top:0;' + 'width:100%;' + 'height:100%;' + '}';

var INJECTED = typeof document === 'undefined';

var injectCSS = function injectCSS() {
  if (INJECTED) return;
  INJECTED = true;
  if (document.createStyleSheet) {
    var sheet = document.createStyleSheet();
    sheet.cssText = css;
  } else {
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    (head ? head : document.documentElement).appendChild(style);
  }
};

exports.injectCSS = injectCSS;

},{}],51:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*jshint -W008 */

'use strict';

/**
 * A library of curves which map an animation explicitly as a function of time.
 *
 * @namespace
 * @property {Function} linear
 * @property {Function} easeIn
 * @property {Function} easeOut
 * @property {Function} easeInOut
 * @property {Function} easeOutBounce
 * @property {Function} spring
 * @property {Function} inQuad
 * @property {Function} outQuad
 * @property {Function} inOutQuad
 * @property {Function} inCubic
 * @property {Function} outCubic
 * @property {Function} inOutCubic
 * @property {Function} inQuart
 * @property {Function} outQuart
 * @property {Function} inOutQuart
 * @property {Function} inQuint
 * @property {Function} outQuint
 * @property {Function} inOutQuint
 * @property {Function} inSine
 * @property {Function} outSine
 * @property {Function} inOutSine
 * @property {Function} inExpo
 * @property {Function} outExpo
 * @property {Function} inOutExp
 * @property {Function} inCirc
 * @property {Function} outCirc
 * @property {Function} inOutCirc
 * @property {Function} inElastic
 * @property {Function} outElastic
 * @property {Function} inOutElastic
 * @property {Function} inBounce
 * @property {Function} outBounce
 * @property {Function} inOutBounce
 * @property {Function} flat            - Useful for delaying the execution of
 *                                        a subsequent transition.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
var Curves = {
  linear: function linear(t) {
    return t;
  },

  easeIn: function easeIn(t) {
    return t * t;
  },

  easeOut: function easeOut(t) {
    return t * (2 - t);
  },

  easeInOut: function easeInOut(t) {
    if (t <= 0.5) return 2 * t * t;else return -2 * t * t + 4 * t - 1;
  },

  easeOutBounce: function easeOutBounce(t) {
    return t * (3 - 2 * t);
  },

  spring: function spring(t) {
    return (1 - t) * Math.sin(6 * Math.PI * t) + t;
  },

  inQuad: function inQuad(t) {
    return t * t;
  },

  outQuad: function outQuad(t) {
    return -(t -= 1) * t + 1;
  },

  inOutQuad: function inOutQuad(t) {
    if ((t /= .5) < 1) return .5 * t * t;
    return -.5 * (--t * (t - 2) - 1);
  },

  inCubic: function inCubic(t) {
    return t * t * t;
  },

  outCubic: function outCubic(t) {
    return --t * t * t + 1;
  },

  inOutCubic: function inOutCubic(t) {
    if ((t /= .5) < 1) return .5 * t * t * t;
    return .5 * ((t -= 2) * t * t + 2);
  },

  inQuart: function inQuart(t) {
    return t * t * t * t;
  },

  outQuart: function outQuart(t) {
    return -(--t * t * t * t - 1);
  },

  inOutQuart: function inOutQuart(t) {
    if ((t /= .5) < 1) return .5 * t * t * t * t;
    return -.5 * ((t -= 2) * t * t * t - 2);
  },

  inQuint: function inQuint(t) {
    return t * t * t * t * t;
  },

  outQuint: function outQuint(t) {
    return --t * t * t * t * t + 1;
  },

  inOutQuint: function inOutQuint(t) {
    if ((t /= .5) < 1) return .5 * t * t * t * t * t;
    return .5 * ((t -= 2) * t * t * t * t + 2);
  },

  inSine: function inSine(t) {
    return -1.0 * Math.cos(t * (Math.PI / 2)) + 1.0;
  },

  outSine: function outSine(t) {
    return Math.sin(t * (Math.PI / 2));
  },

  inOutSine: function inOutSine(t) {
    return -.5 * (Math.cos(Math.PI * t) - 1);
  },

  inExpo: function inExpo(t) {
    return t === 0 ? 0.0 : Math.pow(2, 10 * (t - 1));
  },

  outExpo: function outExpo(t) {
    return t === 1.0 ? 1.0 : -Math.pow(2, -10 * t) + 1;
  },

  inOutExpo: function inOutExpo(t) {
    if (t === 0) return 0.0;
    if (t === 1.0) return 1.0;
    if ((t /= .5) < 1) return .5 * Math.pow(2, 10 * (t - 1));
    return .5 * (-Math.pow(2, -10 * --t) + 2);
  },

  inCirc: function inCirc(t) {
    return -(Math.sqrt(1 - t * t) - 1);
  },

  outCirc: function outCirc(t) {
    return Math.sqrt(1 - --t * t);
  },

  inOutCirc: function inOutCirc(t) {
    if ((t /= .5) < 1) return -.5 * (Math.sqrt(1 - t * t) - 1);
    return .5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
  },

  inElastic: function inElastic(t) {
    var s = 1.70158;
    var p = 0;
    var a = 1.0;
    if (t === 0) return 0.0;
    if (t === 1) return 1.0;
    if (!p) p = .3;
    s = p / (2 * Math.PI) * Math.asin(1.0 / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
  },

  outElastic: function outElastic(t) {
    var s = 1.70158;
    var p = 0;
    var a = 1.0;
    if (t === 0) return 0.0;
    if (t === 1) return 1.0;
    if (!p) p = .3;
    s = p / (2 * Math.PI) * Math.asin(1.0 / a);
    return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1.0;
  },

  inOutElastic: function inOutElastic(t) {
    var s = 1.70158;
    var p = 0;
    var a = 1.0;
    if (t === 0) return 0.0;
    if ((t /= .5) === 2) return 1.0;
    if (!p) p = .3 * 1.5;
    s = p / (2 * Math.PI) * Math.asin(1.0 / a);
    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * .5 + 1.0;
  },

  inBack: function inBack(t, s) {
    if (s === undefined) s = 1.70158;
    return t * t * ((s + 1) * t - s);
  },

  outBack: function outBack(t, s) {
    if (s === undefined) s = 1.70158;
    return --t * t * ((s + 1) * t + s) + 1;
  },

  inOutBack: function inOutBack(t, s) {
    if (s === undefined) s = 1.70158;
    if ((t /= .5) < 1) return .5 * (t * t * (((s *= 1.525) + 1) * t - s));
    return .5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
  },

  inBounce: function inBounce(t) {
    return 1.0 - Curves.outBounce(1.0 - t);
  },

  outBounce: function outBounce(t) {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + .75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + .9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
    }
  },

  inOutBounce: function inOutBounce(t) {
    if (t < .5) return Curves.inBounce(t * 2) * .5;
    return Curves.outBounce(t * 2 - 1.0) * .5 + .5;
  },

  flat: function flat() {
    return 0;
  }
};

exports.Curves = Curves;

},{}],52:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Curves = require('./Curves');

var _coreFamousEngine = require('../core/FamousEngine');

/**
 * A state maintainer for a smooth transition between
 *    numerically-specified states. Example numeric states include floats and
 *    arrays of floats objects.
 *
 * An initial state is set with the constructor or using
 *     {@link Transitionable#from}. Subsequent transitions consist of an
 *     intermediate state, easing curve, duration and callback. The final state
 *     of each transition is the initial state of the subsequent one. Calls to
 *     {@link Transitionable#get} provide the interpolated state along the way.
 *
 * Note that there is no event loop here - calls to {@link Transitionable#get}
 *    are the only way to find state projected to the current (or provided)
 *    time and are the only way to trigger callbacks and mutate the internal
 *    transition queue.
 *
 * @example
 * var t = new Transitionable([0, 0]);
 * t
 *     .to([100, 0], 'linear', 1000)
 *     .delay(1000)
 *     .to([200, 0], 'outBounce', 1000);
 *
 * var div = document.createElement('div');
 * div.style.background = 'blue';
 * div.style.width = '100px';
 * div.style.height = '100px';
 * document.body.appendChild(div);
 *
 * div.addEventListener('click', function() {
 *     t.isPaused() ? t.resume() : t.pause();
 * });
 *
 * requestAnimationFrame(function loop() {
 *     div.style.transform = 'translateX(' + t.get()[0] + 'px)' + ' translateY(' + t.get()[1] + 'px)';
 *     requestAnimationFrame(loop);
 * });
 *
 * @class Transitionable
 * @constructor
 * @param {Number|Array.Number} initialState    initial state to transition
 *                                              from - equivalent to a pursuant
 *                                              invocation of
 *                                              {@link Transitionable#from}
 */

var Transitionable = (function () {
  function Transitionable(initialState) {
    _classCallCheck(this, Transitionable);

    this._queue = [];
    this._from = null;
    this._state = null;
    this._startedAt = null;
    this._pausedAt = null;
    if (initialState != null) this.from(initialState);
  }

  /**
   * Internal Clock used for determining the current time for the ongoing
   * transitions.
   *
   * @type {Performance|Date|Clock}
   */

  /**
   * Registers a transition to be pushed onto the internal queue.
   *
   * @method to
   * @chainable
   *
   * @param  {Number|Array.Number}    finalState              final state to
   *                                                          transiton to
   * @param  {String|Function}        [curve=Curves.linear]   easing function
   *                                                          used for
   *                                                          interpolating
   *                                                          [0, 1]
   * @param  {Number}                 [duration=100]          duration of
   *                                                          transition
   * @param  {Function}               [callback]              callback function
   *                                                          to be called after
   *                                                          the transition is
   *                                                          complete
   * @param  {String}                 [method]                method used for
   *                                                          interpolation
   *                                                          (e.g. slerp)
   * @return {Transitionable}         this
   */

  _createClass(Transitionable, [{
    key: 'to',
    value: function to(finalState, curve, duration, callback, method) {
      curve = curve != null && curve.constructor === String ? _Curves.Curves[curve] : curve;
      if (this._queue.length === 0) {
        this._startedAt = this.constructor.Clock.now();
        this._pausedAt = null;
      }
      this._queue.push(finalState, curve != null ? curve : _Curves.Curves.linear, duration != null ? duration : 100, callback, method);
      return this;
    }
  }, {
    key: 'from',

    /**
     * Resets the transition queue to a stable initial state.
     *
     * @method from
     * @chainable
     *
     * @param  {Number|Array.Number}    initialState    initial state to
     *                                                  transition from
     * @return {Transitionable}         this
     */
    value: function from(initialState) {
      this._state = initialState;
      this._from = this._sync(null, this._state);
      this._queue.length = 0;
      this._startedAt = this.constructor.Clock.now();
      this._pausedAt = null;
      return this;
    }
  }, {
    key: 'delay',

    /**
     * Delays the execution of the subsequent transition for a certain period of
     * time.
     *
     * @method delay
     * @chainable
     *
     * @param {Number}      duration    delay time in ms
     * @param {Function}    [callback]  Zero-argument function to call on observed
     *                                  completion (t=1)
     * @return {Transitionable}         this
     */
    value: function delay(duration, callback) {
      var endState = this._queue.length > 0 ? this._queue[this._queue.length - 5] : this._state;
      return this.to(endState, _Curves.Curves.flat, duration, callback);
    }
  }, {
    key: 'override',

    /**
     * Overrides current transition.
     *
     * @method override
     * @chainable
     *
     * @param  {Number|Array.Number}    [finalState]    final state to transiton to
     * @param  {String|Function}        [curve]         easing function used for
     *                                                  interpolating [0, 1]
     * @param  {Number}                 [duration]      duration of transition
     * @param  {Function}               [callback]      callback function to be
     *                                                  called after the transition
     *                                                  is complete
     * @param {String}                  [method]        optional method used for
     *                                                  interpolating between the
     *                                                  values. Set to `slerp` for
     *                                                  spherical linear
     *                                                  interpolation.
     * @return {Transitionable}         this
     */
    value: function override(finalState, curve, duration, callback, method) {
      if (this._queue.length > 0) {
        if (finalState != null) this._queue[0] = finalState;
        if (curve != null) this._queue[1] = curve.constructor === String ? _Curves.Curves[curve] : curve;
        if (duration != null) this._queue[2] = duration;
        if (callback != null) this._queue[3] = callback;
        if (method != null) this._queue[4] = method;
      }
      return this;
    }
  }, {
    key: '_interpolate',

    /**
     * Used for interpolating between the start and end state of the currently
     * running transition
     *
     * @method  _interpolate
     * @private
     *
     * @param  {Object|Array|Number} output     Where to write to (in order to avoid
     *                                          object allocation and therefore GC).
     * @param  {Object|Array|Number} from       Start state of current transition.
     * @param  {Object|Array|Number} to         End state of current transition.
     * @param  {Number} progress                Progress of the current transition,
     *                                          in [0, 1]
     * @param  {String} method                  Method used for interpolation (e.g.
     *                                          slerp)
     * @return {Object|Array|Number}            output
     */
    value: function _interpolate(output, from, to, progress, method) {
      if (to instanceof Object) {
        if (method === 'slerp') {
          var x, y, z, w;
          var qx, qy, qz, qw;
          var omega, cosomega, sinomega, scaleFrom, scaleTo;

          x = from[0];
          y = from[1];
          z = from[2];
          w = from[3];

          qx = to[0];
          qy = to[1];
          qz = to[2];
          qw = to[3];

          if (progress === 1) {
            output[0] = qx;
            output[1] = qy;
            output[2] = qz;
            output[3] = qw;
            return output;
          }

          cosomega = w * qw + x * qx + y * qy + z * qz;
          if (1.0 - cosomega > 1e-5) {
            omega = Math.acos(cosomega);
            sinomega = Math.sin(omega);
            scaleFrom = Math.sin((1.0 - progress) * omega) / sinomega;
            scaleTo = Math.sin(progress * omega) / sinomega;
          } else {
            scaleFrom = 1.0 - progress;
            scaleTo = progress;
          }

          output[0] = x * scaleFrom + qx * scaleTo;
          output[1] = y * scaleFrom + qy * scaleTo;
          output[2] = z * scaleFrom + qz * scaleTo;
          output[3] = w * scaleFrom + qw * scaleTo;
        } else if (to instanceof Array) {
          for (var i = 0, len = to.length; i < len; i++) {
            output[i] = this._interpolate(output[i], from[i], to[i], progress, method);
          }
        } else {
          for (var key in to) {
            output[key] = this._interpolate(output[key], from[key], to[key], progress, method);
          }
        }
      } else {
        output = from + progress * (to - from);
      }
      return output;
    }
  }, {
    key: '_sync',

    /**
     * Internal helper method used for synchronizing the current, absolute state of
     * a transition to a given output array, object literal or number. Supports
     * nested state objects by through recursion.
     *
     * @method  _sync
     * @private
     *
     * @param  {Number|Array|Object} output     Where to write to (in order to avoid
     *                                          object allocation and therefore GC).
     * @param  {Number|Array|Object} input      Input state to proxy onto the
     *                                          output.
     * @return {Number|Array|Object} output     Passed in output object.
     */
    value: function _sync(output, input) {
      if (typeof input === 'number') output = input;else if (input instanceof Array) {
        if (output == null) output = [];
        for (var i = 0, len = input.length; i < len; i++) {
          output[i] = this._sync(output[i], input[i]);
        }
      } else if (input instanceof Object) {
        if (output == null) output = {};
        for (var key in input) {
          output[key] = this._sync(output[key], input[key]);
        }
      }
      return output;
    }
  }, {
    key: 'get',

    /**
     * Get interpolated state of current action at provided time. If the last
     *    action has completed, invoke its callback.
     *
     * @method get
     *
     * @param {Number=} t               Evaluate the curve at a normalized version
     *                                  of this time. If omitted, use current time
     *                                  (Unix epoch time retrieved from Clock).
     * @return {Number|Array.Number}    Beginning state interpolated to this point
     *                                  in time.
     */
    value: function get(t) {
      if (this._queue.length === 0) return this._state;

      t = this._pausedAt ? this._pausedAt : t;
      t = t ? t : this.constructor.Clock.now();

      var progress = (t - this._startedAt) / this._queue[2];
      this._state = this._interpolate(this._state, this._from, this._queue[0], this._queue[1](progress > 1 ? 1 : progress), this._queue[4]);
      var state = this._state;
      if (progress >= 1) {
        this._startedAt = this._startedAt + this._queue[2];
        this._from = this._sync(this._from, this._state);
        this._queue.shift();
        this._queue.shift();
        this._queue.shift();
        var callback = this._queue.shift();
        this._queue.shift();
        if (callback) callback();
      }
      return progress > 1 ? this.get() : state;
    }
  }, {
    key: 'isActive',

    /**
     * Is there at least one transition pending completion?
     *
     * @method isActive
     *
     * @return {Boolean}    Boolean indicating whether there is at least one pending
     *                      transition. Paused transitions are still being
     *                      considered active.
     */
    value: function isActive() {
      return this._queue.length > 0;
    }
  }, {
    key: 'halt',

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     * @chainable
     *
     * @return {Transitionable} this
     */
    value: function halt() {
      return this.from(this.get());
    }
  }, {
    key: 'pause',

    /**
     * Pause transition. This will not erase any actions.
     *
     * @method pause
     * @chainable
     *
     * @return {Transitionable} this
     */
    value: function pause() {
      this._pausedAt = this.constructor.Clock.now();
      return this;
    }
  }, {
    key: 'isPaused',

    /**
     * Has the current action been paused?
     *
     * @method isPaused
     * @chainable
     *
     * @return {Boolean} if the current action has been paused
     */
    value: function isPaused() {
      return !!this._pausedAt;
    }
  }, {
    key: 'resume',

    /**
     * Resume a previously paused transition.
     *
     * @method resume
     * @chainable
     *
     * @return {Transitionable} this
     */
    value: function resume() {
      var diff = this._pausedAt - this._startedAt;
      this._startedAt = this.constructor.Clock.now() - diff;
      this._pausedAt = null;
      return this;
    }
  }, {
    key: 'reset',

    /**
     * Cancel all transitions and reset to a stable state
     *
     * @method reset
     * @chainable
     * @deprecated Use `.from` instead!
     *
     * @param {Number|Array.Number|Object.<number, number>} start
     *    stable state to set to
     * @return {Transitionable}                             this
     */
    value: function reset(start) {
      return this.from(start);
    }
  }, {
    key: 'set',

    /**
     * Add transition to end state to the queue of pending transitions. Special
     *    Use: calling without a transition resets the object to that state with
     *    no pending actions
     *
     * @method set
     * @chainable
     * @deprecated Use `.to` instead!
     *
     * @param {Number|FamousEngineMatrix|Array.Number|Object.<number, number>} state
     *    end state to which we interpolate
     * @param {transition=} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {function()=} callback Zero-argument function to call on observed
     *    completion (t=1)
     * @return {Transitionable} this
     */
    value: function set(state, transition, callback) {
      if (transition == null) {
        this.from(state);
        if (callback) callback();
      } else {
        this.to(state, transition.curve, transition.duration, callback, transition.method);
      }
      return this;
    }
  }]);

  return Transitionable;
})();

Transitionable.Clock = _coreFamousEngine.FamousEngine.getClock();

exports.Transitionable = Transitionable;

},{"../core/FamousEngine":9,"./Curves":51}],53:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * A lightweight, featureless EventEmitter.
 *
 * @class CallbackStore
 * @constructor
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CallbackStore = (function () {
  function CallbackStore() {
    _classCallCheck(this, CallbackStore);

    this._events = {};
  }

  /**
   * Adds a listener for the specified event (= key).
   *
   * @method on
   * @chainable
   *
   * @param  {String}   key       The event type (e.g. `click`).
   * @param  {Function} callback  A callback function to be invoked whenever `key`
   *                              event is being triggered.
   * @return {Function} destroy   A function to call if you want to remove the
   *                              callback.
   */

  _createClass(CallbackStore, [{
    key: 'on',
    value: function on(key, callback) {
      if (!this._events[key]) this._events[key] = [];
      var callbackList = this._events[key];
      callbackList.push(callback);
      return function () {
        callbackList.splice(callbackList.indexOf(callback), 1);
      };
    }
  }, {
    key: 'off',

    /**
     * Removes a previously added event listener.
     *
     * @method off
     * @chainable
     *
     * @param  {String} key         The event type from which the callback function
     *                              should be removed.
     * @param  {Function} callback  The callback function to be removed from the
     *                              listeners for key.
     * @return {CallbackStore} this
     */
    value: function off(key, callback) {
      var events = this._events[key];
      if (events) events.splice(events.indexOf(callback), 1);
      return this;
    }
  }, {
    key: 'trigger',

    /**
     * Invokes all the previously for this key registered callbacks.
     *
     * @method trigger
     * @chainable
     *
     * @param  {String}        key      The event type.
     * @param  {Object}        payload  The event payload (event object).
     * @return {CallbackStore} this
     */
    value: function trigger(key, payload) {
      var events = this._events[key];
      if (events) {
        var i = 0;
        var len = events.length;
        for (; i < len; i++) events[i](payload);
      }
      return this;
    }
  }]);

  return CallbackStore;
})();

exports.CallbackStore = CallbackStore;

},{}],54:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _transitionsTransitionable = require('../transitions/Transitionable');

/**
 * @class Color
 * @constructor
 *
 * @param {Color|String|Array} color Optional argument for setting color using Hex, a Color instance, color name or RGB.
 * @param {Object} transition Optional transition.
 * @param {Function} cb Callback function to be called on completion of the initial transition.
 *
 * @return {undefined} undefined
 */

var Color = (function () {
  function Color(color, transition, cb) {
    _classCallCheck(this, Color);

    this._r = new _transitionsTransitionable.Transitionable(0);
    this._g = new _transitionsTransitionable.Transitionable(0);
    this._b = new _transitionsTransitionable.Transitionable(0);
    this._opacity = new _transitionsTransitionable.Transitionable(1);
    if (color) this.set(color, transition, cb);
  }

  /**
   * Converts a number to a hex value
   *
   * @method
   *
   * @param {Number} num Number
   *
   * @returns {String} Hex value
   */

  /**
   * Returns the definition of the Class: 'Color'.
   *
   * @method
   *
   * @return {String} "Color"
   */

  _createClass(Color, [{
    key: 'toString',
    value: function toString() {
      return 'Color';
    }
  }, {
    key: 'set',

    /**
     * Sets the color. It accepts an optional transition parameter and callback.
     * set(Color, transition, callback)
     * set('#000000', transition, callback)
     * set('black', transition, callback)
     * set([r, g, b], transition, callback)
     *
     * @method
     *
     * @param {Color|String|Array} color Sets color using Hex, a Color instance, color name or RGB.
     * @param {Object} transition Optional transition
     * @param {Function} cb Callback function to be called on completion of the transition.
     *
     * @return {Color} Color
     */
    value: function set(color, transition, cb) {
      switch (Color.determineType(color)) {
        case 'hex':
          return this.setHex(color, transition, cb);
        case 'colorName':
          return this.setColor(color, transition, cb);
        case 'instance':
          return this.changeTo(color, transition, cb);
        case 'rgb':
          return this.setRGB(color[0], color[1], color[2], transition, cb);
      }
      return this;
    }
  }, {
    key: 'isActive',

    /**
     * Returns whether Color is still in an animating (transitioning) state.
     *
     * @method
     *
     * @returns {Boolean} Boolean value indicating whether the there is an active transition.
     */
    value: function isActive() {
      return this._r.isActive() || this._g.isActive() || this._b.isActive() || this._opacity.isActive();
    }
  }, {
    key: 'halt',

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method
     *
     * @return {Color} Color
     */
    value: function halt() {
      this._r.halt();
      this._g.halt();
      this._b.halt();
      this._opacity.halt();
      return this;
    }
  }, {
    key: 'changeTo',

    /**
     * Sets the color values from another Color instance.
     *
     * @method
     *
     * @param {Color} color Color instance.
     * @param {Object} transition Optional transition.
     * @param {Function} cb Optional callback function.
     *
     * @return {Color} Color
     */
    value: function changeTo(color, transition, cb) {
      if (Color.isColorInstance(color)) {
        var rgb = color.getRGB();
        this.setRGB(rgb[0], rgb[1], rgb[2], transition, cb);
      }
      return this;
    }
  }, {
    key: 'setColor',

    /**
     * Sets the color based on static color names.
     *
     * @method
     *
     * @param {String} name Color name
     * @param {Object} transition Optional transition parameters
     * @param {Function} cb Optional callback
     *
     * @return {Color} Color
     */
    value: function setColor(name, transition, cb) {
      if (colorNames[name]) {
        this.setHex(colorNames[name], transition, cb);
      }
      return this;
    }
  }, {
    key: 'getColor',

    /**
     * Returns the color in either RGB or with the requested format.
     *
     * @method
     *
     * @param {String} option Optional argument for determining which type of color to get (default is RGB)
     *
     * @returns {Object} Color in either RGB or specific option value
     */
    value: function getColor(option) {
      if (Color.isString(option)) option = option.toLowerCase();
      return option === 'hex' ? this.getHex() : this.getRGB();
    }
  }, {
    key: 'setR',

    /**
     * Sets the R of the Color's RGB
     *
     * @method
     *
     * @param {Number} r R channel of color
     * @param {Object} transition Optional transition parameters
     * @param {Function} cb Optional callback
     *
     * @return {Color} Color
     */
    value: function setR(r, transition, cb) {
      this._r.set(r, transition, cb);
      return this;
    }
  }, {
    key: 'setG',

    /**
     * Sets the G of the Color's RGB
     *
     * @method
     *
     * @param {Number} g G channel of color
     * @param {Object} transition Optional transition parameters
     * @param {Function} cb Optional callback
     *
     * @return {Color} Color
     */
    value: function setG(g, transition, cb) {
      this._g.set(g, transition, cb);
      return this;
    }
  }, {
    key: 'setB',

    /**
     * Sets the B of the Color's RGB
     *
     * @method
     *
     * @param {Number} b B channel of color
     * @param {Object} transition Optional transition parameters
     * @param {Function} cb Optional callback
     *
     * @return {Color} Color
     */
    value: function setB(b, transition, cb) {
      this._b.set(b, transition, cb);
      return this;
    }
  }, {
    key: 'setOpacity',

    /**
     * Sets opacity value
     *
     * @method
     *
     * @param {Number} opacity Opacity value
     * @param {Object} transition Optional transition parameters
     * @param {Function} cb Optional callback
     *
     * @return {Color} Color
     */
    value: function setOpacity(opacity, transition, cb) {
      this._opacity.set(opacity, transition, cb);
      return this;
    }
  }, {
    key: 'setRGB',

    /**
     * Sets RGB
     *
     * @method
     *
     * @param {Number} r R channel of color
     * @param {Number} g G channel of color
     * @param {Number} b B channel of color
     * @param {Object} transition Optional transition parameters
     * @param {Function} cb Optional callback
     *
     * @return {Color} Color
     */
    value: function setRGB(r, g, b, transition, cb) {
      this.setR(r, transition);
      this.setG(g, transition);
      this.setB(b, transition, cb);
      return this;
    }
  }, {
    key: 'getR',

    /**
     * Returns R of RGB
     *
     * @method
     *
     * @returns {Number} R of Color
     */
    value: function getR() {
      return this._r.get();
    }
  }, {
    key: 'getG',

    /**
     * Returns G of RGB
     *
     * @method
     *
     * @returns {Number} G of Color
     */
    value: function getG() {
      return this._g.get();
    }
  }, {
    key: 'getB',

    /**
     * Returns B of RGB
     *
     * @method
     *
     * @returns {Number} B of Color
     */
    value: function getB() {
      return this._b.get();
    }
  }, {
    key: 'getOpacity',

    /**
     * Returns Opacity value
     *
     * @method
     *
     * @returns {Number} Opacity
     */
    value: function getOpacity() {
      return this._opacity.get();
    }
  }, {
    key: 'getRGB',

    /**
     * Returns RGB
     *
     * @method
     *
     * @returns {Array} RGB
     */
    value: function getRGB() {
      return [this.getR(), this.getG(), this.getB()];
    }
  }, {
    key: 'getNormalizedRGB',

    /**
     * Returns Normalized RGB
     *
     * @method
     *
     * @returns {Array} Normalized RGB
     */
    value: function getNormalizedRGB() {
      var r = this.getR() / 255.0;
      var g = this.getG() / 255.0;
      var b = this.getB() / 255.0;
      return [r, g, b];
    }
  }, {
    key: 'getNormalizedRGBA',

    /**
     * Returns Normalized RGBA
     *
     * @method
     *
     * @returns {Array} Normalized RGBA
     */
    value: function getNormalizedRGBA() {
      var r = this.getR() / 255.0;
      var g = this.getG() / 255.0;
      var b = this.getB() / 255.0;
      var opacity = this.getOpacity();
      return [r, g, b, opacity];
    }
  }, {
    key: 'getHex',

    /**
     * Returns the current color in Hex
     *
     * @method
     *
     * @returns {String} Hex value
     */
    value: function getHex() {
      var r = Color.toHex(this.getR());
      var g = Color.toHex(this.getG());
      var b = Color.toHex(this.getB());
      return '#' + r + g + b;
    }
  }, {
    key: 'setHex',

    /**
     * Sets color using Hex
     *
     * @method
     *
     * @param {String} hex Hex value
     * @param {Object} transition Optional transition parameters
     * @param {Function} cb Optional callback
     *
     * @return {Color} Color
     */
    value: function setHex(hex, transition, cb) {
      hex = hex.charAt(0) === '#' ? hex.substring(1, hex.length) : hex;

      if (hex.length === 3) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b;
        });
      }

      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);
      this.setRGB(r, g, b, transition, cb);
      return this;
    }
  }]);

  return Color;
})();

Color.toHex = function toHex(num) {
  var hex = num.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

/**
 * Determines the given input with the appropriate configuration
 *
 * @method
 *
 * @param {Color|String|Array} type Color type
 *
 * @returns {String} Appropriate color type
 */
Color.determineType = function determineType(type) {
  if (Color.isColorInstance(type)) return 'instance';
  if (colorNames[type]) return 'colorName';
  if (Color.isHex(type)) return 'hex';
  if (Array.isArray(type)) return 'rgb';
};

/**
 * Returns a boolean checking whether input is a 'String'
 *
 * @method
 *
 * @param {String} val String value
 *
 * @returns {Boolean} Boolean
 */
Color.isString = function isString(val) {
  return typeof val === 'string';
};

/**
 * Returns a boolean checking whether string input has a hash (#) symbol
 *
 * @method
 *
 * @param {String} val Value
 *
 * @returns {Boolean} Boolean
 */
Color.isHex = function isHex(val) {
  if (!Color.isString(val)) return false;
  return val[0] === '#';
};

/**
 * Returns boolean whether the input is a Color instance
 *
 * @method
 *
 * @param {Color} val Value
 *
 * @returns {Boolean} Boolean
 */
Color.isColorInstance = function isColorInstance(val) {
  return !!val.getColor;
};

/**
 * Common color names with their associated Hex values
 */
var colorNames = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
};

exports.Color = Color;

},{"../transitions/Transitionable":52}],55:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Registry = (function () {
  function Registry() {
    _classCallCheck(this, Registry);

    this._keyToValue = {};
    this._values = [];
    this._keys = [];
    this._keyToIndex = {};
    this._freedIndices = [];
  }

  _createClass(Registry, [{
    key: 'register',
    value: function register(key, value) {
      var index = this._keyToIndex[key];
      if (index == null) {
        index = this._freedIndices.pop();
        if (index === undefined) index = this._values.length;

        this._values[index] = value;
        this._keys[index] = key;

        this._keyToIndex[key] = index;
        this._keyToValue[key] = value;
      } else {
        this._keyToValue[key] = value;
        this._values[index] = value;
      }
    }
  }, {
    key: 'unregister',
    value: function unregister(key) {
      var index = this._keyToIndex[key];

      if (index != null) {
        this._freedIndices.push(index);
        this._keyToValue[key] = null;
        this._keyToIndex[key] = null;
        this._values[index] = null;
        this._keys[index] = null;
      }
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this._keyToValue[key];
    }
  }, {
    key: 'getValues',
    value: function getValues() {
      return this._values;
    }
  }, {
    key: 'getKeys',
    value: function getKeys() {
      return this._keys;
    }
  }, {
    key: 'getKeyToValue',
    value: function getKeyToValue() {
      return this._keyToValue;
    }
  }]);

  return Registry;
})();

exports.Registry = Registry;

},{}],56:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * Deep clone an object.
 *
 * @method  clone
 *
 * @param {Object} b       Object to be cloned.
 * @return {Object} a      Cloned object (deep equality).
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
var clone = function clone(b) {
  var a;
  if (typeof b === 'object') {
    a = b instanceof Array ? [] : {};
    for (var key in b) {
      if (typeof b[key] === 'object' && b[key] !== null) {
        if (b[key] instanceof Array) {
          a[key] = new Array(b[key].length);
          for (var i = 0; i < b[key].length; i++) {
            a[key][i] = clone(b[key][i]);
          }
        } else {
          a[key] = clone(b[key]);
        }
      } else {
        a[key] = b[key];
      }
    }
  } else {
    a = b;
  }
  return a;
};

exports.clone = clone;

},{}],57:[function(require,module,exports){
'use strict';

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Takes an object containing keys and values and returns an object
 * comprising two "associate" arrays, one with the keys and the other
 * with the values.
 *
 * @method keyValuesToArrays
 *
 * @param {Object} obj                      Objects where to extract keys and values
 *                                          from.
 * @return {Object}         result
 *         {Array.<String>} result.keys     Keys of `result`, as returned by
 *                                          `Object.keys()`
 *         {Array}          result.values   Values of passed in object.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
var keyValueToArrays = function keyValueToArrays(obj) {
  var keysArray = [],
      valuesArray = [];
  var i = 0;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keysArray[i] = key;
      valuesArray[i] = obj[key];
      i++;
    }
  }
  return {
    keys: keysArray,
    values: valuesArray
  };
};

exports.keyValueToArrays = keyValueToArrays;

},{}],58:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var PREFIXES = ['', '-ms-', '-webkit-', '-moz-', '-o-'];

/**
 * A helper function used for determining the vendor prefixed version of the
 * passed in CSS property.
 *
 * Vendor checks are being conducted in the following order:
 *
 * 1. (no prefix)
 * 2. `-mz-`
 * 3. `-webkit-`
 * 4. `-moz-`
 * 5. `-o-`
 *
 * @method vendorPrefix
 *
 * @param {String} property     CSS property (no camelCase), e.g.
 *                              `border-radius`.
 * @return {String} prefixed    Vendor prefixed version of passed in CSS
 *                              property (e.g. `-webkit-border-radius`).
 */
var vendorPrefix = function vendorPrefix(property) {
  for (var i = 0; i < PREFIXES.length; i++) {
    var prefixed = PREFIXES[i] + property;
    if (document.documentElement.style[prefixed] === '') {
      return prefixed;
    }
  }
  return property;
};

exports.vendorPrefix = vendorPrefix;

},{}],59:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GeometryIds = 0;

/**
 * Geometry is a component that defines and manages data
 * (vertex data and attributes) that is used to draw to WebGL.
 *
 * @class Geometry
 * @constructor
 *
 * @param {Object} options instantiation options
 * @return {undefined} undefined
 */

var Geometry = function Geometry(options) {
  _classCallCheck(this, Geometry);

  this.options = options || {};
  this.DEFAULT_BUFFER_SIZE = 3;

  this.spec = {
    id: GeometryIds++,
    dynamic: false,
    type: this.options.type || 'TRIANGLES',
    bufferNames: [],
    bufferValues: [],
    bufferSpacings: [],
    invalidations: []
  };

  if (this.options.buffers) {
    var len = this.options.buffers.length;
    for (var i = 0; i < len; i++) {
      this.spec.bufferNames.push(this.options.buffers[i].name);
      this.spec.bufferValues.push(this.options.buffers[i].data);
      this.spec.bufferSpacings.push(this.options.buffers[i].size || this.DEFAULT_BUFFER_SIZE);
      this.spec.invalidations.push(i);
    }
  }
};

exports.Geometry = Geometry;

},{}],60:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _mathVec3 = require('../math/Vec3');

var _mathVec2 = require('../math/Vec2');

var outputs = [new _mathVec3.Vec3(), new _mathVec3.Vec3(), new _mathVec3.Vec3(), new _mathVec2.Vec2(), new _mathVec2.Vec2()];

/**
 * A helper object used to calculate buffers for complicated geometries.
 * Tailored for the WebGLRenderer, used by most primitives.
 *
 * @static
 * @class GeometryHelper
 * @return {undefined} undefined
 */
var GeometryHelper = {};

/**
 * A function that iterates through vertical and horizontal slices
 * based on input detail, and generates vertices and indices for each
 * subdivision.
 *
 * @static
 * @method
 *
 * @param  {Number} detailX Amount of slices to iterate through.
 * @param  {Number} detailY Amount of stacks to iterate through.
 * @param  {Function} func Function used to generate vertex positions at each point.
 * @param  {Boolean} wrap Optional parameter (default: Pi) for setting a custom wrap range
 *
 * @return {Object} Object containing generated vertices and indices.
 */
GeometryHelper.generateParametric = function generateParametric(detailX, detailY, func, wrap) {
  var vertices = [];
  var i;
  var theta;
  var phi;
  var j;

  // We can wrap around slightly more than once for uv coordinates to look correct.

  var offset = Math.PI / (detailX - 1);
  var Xrange = wrap ? Math.PI + offset : Math.PI;

  var out = [];

  for (i = 0; i < detailX + 1; i++) {
    theta = (i === 0 ? 0.0001 : i) * Math.PI / detailX;
    for (j = 0; j < detailY; j++) {
      phi = j * 2.0 * Xrange / detailY;
      func(theta, phi, out);
      vertices.push(out[0], out[1], out[2]);
    }
  }

  var indices = [],
      v = 0,
      next;
  for (i = 0; i < detailX; i++) {
    for (j = 0; j < detailY; j++) {
      next = (j + 1) % detailY;
      indices.push(v + j, v + j + detailY, v + next);
      indices.push(v + next, v + j + detailY, v + next + detailY);
    }
    v += detailY;
  }

  return {
    vertices: vertices,
    indices: indices
  };
};

/**
 * Calculates normals belonging to each face of a geometry.
 * Assumes clockwise declaration of vertices.
 *
 * @static
 * @method
 *
 * @param {Array} vertices Vertices of all points on the geometry.
 * @param {Array} indices Indices declaring faces of geometry.
 * @param {Array} out Array to be filled and returned.
 *
 * @return {Array} Calculated face normals.
 */
GeometryHelper.computeNormals = function computeNormals(vertices, indices, out) {
  var normals = out || [];
  var indexOne;
  var indexTwo;
  var indexThree;
  var normal;
  var j;
  var len = indices.length / 3;
  var i;
  var x;
  var y;
  var z;
  var length;

  for (i = 0; i < len; i++) {
    indexTwo = indices[i * 3 + 0] * 3;
    indexOne = indices[i * 3 + 1] * 3;
    indexThree = indices[i * 3 + 2] * 3;

    outputs[0].set(vertices[indexOne], vertices[indexOne + 1], vertices[indexOne + 2]);
    outputs[1].set(vertices[indexTwo], vertices[indexTwo + 1], vertices[indexTwo + 2]);
    outputs[2].set(vertices[indexThree], vertices[indexThree + 1], vertices[indexThree + 2]);

    normal = outputs[2].subtract(outputs[0]).cross(outputs[1].subtract(outputs[0])).normalize();

    normals[indexOne + 0] = (normals[indexOne + 0] || 0) + normal.x;
    normals[indexOne + 1] = (normals[indexOne + 1] || 0) + normal.y;
    normals[indexOne + 2] = (normals[indexOne + 2] || 0) + normal.z;

    normals[indexTwo + 0] = (normals[indexTwo + 0] || 0) + normal.x;
    normals[indexTwo + 1] = (normals[indexTwo + 1] || 0) + normal.y;
    normals[indexTwo + 2] = (normals[indexTwo + 2] || 0) + normal.z;

    normals[indexThree + 0] = (normals[indexThree + 0] || 0) + normal.x;
    normals[indexThree + 1] = (normals[indexThree + 1] || 0) + normal.y;
    normals[indexThree + 2] = (normals[indexThree + 2] || 0) + normal.z;
  }

  for (i = 0; i < normals.length; i += 3) {
    x = normals[i];
    y = normals[i + 1];
    z = normals[i + 2];
    length = Math.sqrt(x * x + y * y + z * z);
    for (j = 0; j < 3; j++) {
      normals[i + j] /= length;
    }
  }

  return normals;
};

/**
 * Divides all inserted triangles into four sub-triangles. Alters the
 * passed in arrays.
 *
 * @static
 * @method
 *
 * @param {Array} indices Indices declaring faces of geometry
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} textureCoords Texture coordinates of all points on the geometry
 * @return {undefined} undefined
 */
GeometryHelper.subdivide = function subdivide(indices, vertices, textureCoords) {
  var triangleIndex = indices.length / 3;
  var face;
  var i;
  var j;
  var k;
  var pos;
  var tex;

  while (triangleIndex--) {
    face = indices.slice(triangleIndex * 3, triangleIndex * 3 + 3);

    pos = face.map(function (vertIndex) {
      return new _mathVec3.Vec3(vertices[vertIndex * 3], vertices[vertIndex * 3 + 1], vertices[vertIndex * 3 + 2]);
    });
    vertices.push.apply(vertices, _mathVec3.Vec3.scale(_mathVec3.Vec3.add(pos[0], pos[1], outputs[0]), 0.5, outputs[1]).toArray());
    vertices.push.apply(vertices, _mathVec3.Vec3.scale(_mathVec3.Vec3.add(pos[1], pos[2], outputs[0]), 0.5, outputs[1]).toArray());
    vertices.push.apply(vertices, _mathVec3.Vec3.scale(_mathVec3.Vec3.add(pos[0], pos[2], outputs[0]), 0.5, outputs[1]).toArray());

    if (textureCoords) {
      tex = face.map(function (vertIndex) {
        return new _mathVec2.Vec2(textureCoords[vertIndex * 2], textureCoords[vertIndex * 2 + 1]);
      });
      textureCoords.push.apply(textureCoords, _mathVec2.Vec2.scale(_mathVec2.Vec2.add(tex[0], tex[1], outputs[3]), 0.5, outputs[4]).toArray());
      textureCoords.push.apply(textureCoords, _mathVec2.Vec2.scale(_mathVec2.Vec2.add(tex[1], tex[2], outputs[3]), 0.5, outputs[4]).toArray());
      textureCoords.push.apply(textureCoords, _mathVec2.Vec2.scale(_mathVec2.Vec2.add(tex[0], tex[2], outputs[3]), 0.5, outputs[4]).toArray());
    }

    i = vertices.length - 3;
    j = i + 1;
    k = i + 2;

    indices.push(i, j, k);
    indices.push(face[0], i, k);
    indices.push(i, face[1], j);
    indices[triangleIndex] = k;
    indices[triangleIndex + 1] = j;
    indices[triangleIndex + 2] = face[2];
  }
};

/**
 * Creates duplicate of vertices that are shared between faces.
 * Alters the input vertex and index arrays.
 *
 * @static
 * @method
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} indices Indices declaring faces of geometry
 * @return {undefined} undefined
 */
GeometryHelper.getUniqueFaces = function getUniqueFaces(vertices, indices) {
  var triangleIndex = indices.length / 3,
      registered = [],
      index;

  while (triangleIndex--) {
    for (var i = 0; i < 3; i++) {

      index = indices[triangleIndex * 3 + i];

      if (registered[index]) {
        vertices.push(vertices[index * 3], vertices[index * 3 + 1], vertices[index * 3 + 2]);
        indices[triangleIndex * 3 + i] = vertices.length / 3 - 1;
      } else {
        registered[index] = true;
      }
    }
  }
};

/**
 * Divides all inserted triangles into four sub-triangles while maintaining
 * a radius of one. Alters the passed in arrays.
 *
 * @static
 * @method
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} indices Indices declaring faces of geometry
 * @return {undefined} undefined
 */
GeometryHelper.subdivideSpheroid = function subdivideSpheroid(vertices, indices) {
  var triangleIndex = indices.length / 3,
      abc,
      face,
      i,
      j,
      k;

  while (triangleIndex--) {
    face = indices.slice(triangleIndex * 3, triangleIndex * 3 + 3);
    abc = face.map(function (vertIndex) {
      return new _mathVec3.Vec3(vertices[vertIndex * 3], vertices[vertIndex * 3 + 1], vertices[vertIndex * 3 + 2]);
    });

    vertices.push.apply(vertices, _mathVec3.Vec3.normalize(_mathVec3.Vec3.add(abc[0], abc[1], outputs[0]), outputs[1]).toArray());
    vertices.push.apply(vertices, _mathVec3.Vec3.normalize(_mathVec3.Vec3.add(abc[1], abc[2], outputs[0]), outputs[1]).toArray());
    vertices.push.apply(vertices, _mathVec3.Vec3.normalize(_mathVec3.Vec3.add(abc[0], abc[2], outputs[0]), outputs[1]).toArray());

    i = vertices.length / 3 - 3;
    j = i + 1;
    k = i + 2;

    indices.push(i, j, k);
    indices.push(face[0], i, k);
    indices.push(i, face[1], j);
    indices[triangleIndex * 3] = k;
    indices[triangleIndex * 3 + 1] = j;
    indices[triangleIndex * 3 + 2] = face[2];
  }
};

/**
 * Divides all inserted triangles into four sub-triangles while maintaining
 * a radius of one. Alters the passed in arrays.
 *
 * @static
 * @method
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} out Optional array to be filled with resulting normals.
 *
 * @return {Array} New list of calculated normals.
 */
GeometryHelper.getSpheroidNormals = function getSpheroidNormals(vertices, out) {
  out = out || [];
  var length = vertices.length / 3;
  var normalized;

  for (var i = 0; i < length; i++) {
    normalized = new _mathVec3.Vec3(vertices[i * 3 + 0], vertices[i * 3 + 1], vertices[i * 3 + 2]).normalize().toArray();

    out[i * 3 + 0] = normalized[0];
    out[i * 3 + 1] = normalized[1];
    out[i * 3 + 2] = normalized[2];
  }

  return out;
};

/**
 * Calculates texture coordinates for spheroid primitives based on
 * input vertices.
 *
 * @static
 * @method
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} out Optional array to be filled with resulting texture coordinates.
 *
 * @return {Array} New list of calculated texture coordinates
 */
GeometryHelper.getSpheroidUV = function getSpheroidUV(vertices, out) {
  out = out || [];
  var length = vertices.length / 3;
  var vertex;

  var uv = [];

  for (var i = 0; i < length; i++) {
    vertex = outputs[0].set(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]).normalize().toArray();

    var azimuth = this.getAzimuth(vertex);
    var altitude = this.getAltitude(vertex);

    uv[0] = azimuth * 0.5 / Math.PI + 0.5;
    uv[1] = altitude / Math.PI + 0.5;

    out.push.apply(out, uv);
  }

  return out;
};

/**
 * Iterates through and normalizes a list of vertices.
 *
 * @static
 * @method
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} out Optional array to be filled with resulting normalized vectors.
 *
 * @return {Array} New list of normalized vertices
 */
GeometryHelper.normalizeAll = function normalizeAll(vertices, out) {
  out = out || [];
  var len = vertices.length / 3;

  for (var i = 0; i < len; i++) {
    Array.prototype.push.apply(out, new _mathVec3.Vec3(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]).normalize().toArray());
  }

  return out;
};

/**
 * Normalizes a set of vertices to model space.
 *
 * @static
 * @method
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} out Optional array to be filled with model space position vectors.
 *
 * @return {Array} Output vertices.
 */
GeometryHelper.normalizeVertices = function normalizeVertices(vertices, out) {
  out = out || [];
  var len = vertices.length / 3;
  var vectors = [];
  var minX;
  var maxX;
  var minY;
  var maxY;
  var minZ;
  var maxZ;
  var v;
  var i;

  for (i = 0; i < len; i++) {
    v = vectors[i] = new _mathVec3.Vec3(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);

    if (minX == null || v.x < minX) minX = v.x;
    if (maxX == null || v.x > maxX) maxX = v.x;

    if (minY == null || v.y < minY) minY = v.y;
    if (maxY == null || v.y > maxY) maxY = v.y;

    if (minZ == null || v.z < minZ) minZ = v.z;
    if (maxZ == null || v.z > maxZ) maxZ = v.z;
  }

  var translation = new _mathVec3.Vec3(getTranslationFactor(maxX, minX), getTranslationFactor(maxY, minY), getTranslationFactor(maxZ, minZ));

  var scale = Math.min(getScaleFactor(maxX + translation.x, minX + translation.x), getScaleFactor(maxY + translation.y, minY + translation.y), getScaleFactor(maxZ + translation.z, minZ + translation.z));

  for (i = 0; i < vectors.length; i++) {
    out.push.apply(out, vectors[i].add(translation).scale(scale).toArray());
  }

  return out;
};

/**
 * Determines translation amount for a given axis to normalize model coordinates.
 *
 * @method
 * @private
 *
 * @param {Number} max Maximum position value of given axis on the model.
 * @param {Number} min Minimum position value of given axis on the model.
 *
 * @return {Number} Number by which the given axis should be translated for all vertices.
 */
function getTranslationFactor(max, min) {
  return -(min + (max - min) / 2);
}

/**
 * Determines scale amount for a given axis to normalize model coordinates.
 *
 * @method
 * @private
 *
 * @param {Number} max Maximum scale value of given axis on the model.
 * @param {Number} min Minimum scale value of given axis on the model.
 *
 * @return {Number} Number by which the given axis should be scaled for all vertices.
 */
function getScaleFactor(max, min) {
  return 1 / ((max - min) / 2);
}

/**
 * Finds the azimuth, or angle above the XY plane, of a given vector.
 *
 * @static
 * @method
 *
 * @param {Array} v Vertex to retreive azimuth from.
 *
 * @return {Number} Azimuth value in radians.
 */
GeometryHelper.getAzimuth = function azimuth(v) {
  return Math.atan2(v[2], -v[0]);
};

/**
 * Finds the altitude, or angle above the XZ plane, of a given vector.
 *
 * @static
 * @method
 *
 * @param {Array} v Vertex to retreive altitude from.
 *
 * @return {Number} Altitude value in radians.
 */
GeometryHelper.getAltitude = function altitude(v) {
  return Math.atan2(-v[1], Math.sqrt(v[0] * v[0] + v[2] * v[2]));
};

/**
 * Converts a list of indices from 'triangle' to 'line' format.
 *
 * @static
 * @method
 *
 * @param {Array} indices Indices of all faces on the geometry
 * @param {Array} out Indices of all faces on the geometry
 *
 * @return {Array} New list of line-formatted indices
 */
GeometryHelper.trianglesToLines = function triangleToLines(indices, out) {
  var numVectors = indices.length / 3;
  out = out || [];
  var i;

  for (i = 0; i < numVectors; i++) {
    out.push(indices[i * 3 + 0], indices[i * 3 + 1]);
    out.push(indices[i * 3 + 1], indices[i * 3 + 2]);
    out.push(indices[i * 3 + 2], indices[i * 3 + 0]);
  }

  return out;
};

/**
 * Adds a reverse order triangle for every triangle in the mesh. Adds extra vertices
 * and indices to input arrays.
 *
 * @static
 * @method
 *
 * @param {Array} vertices X, Y, Z positions of all vertices in the geometry
 * @param {Array} indices Indices of all faces on the geometry
 * @return {undefined} undefined
 */
GeometryHelper.addBackfaceTriangles = function addBackfaceTriangles(vertices, indices) {
  var nFaces = indices.length / 3;

  var maxIndex = 0;
  var i = indices.length;
  while (i--) if (indices[i] > maxIndex) maxIndex = indices[i];

  maxIndex++;

  for (i = 0; i < nFaces; i++) {
    var indexOne = indices[i * 3],
        indexTwo = indices[i * 3 + 1],
        indexThree = indices[i * 3 + 2];

    indices.push(indexOne + maxIndex, indexThree + maxIndex, indexTwo + maxIndex);
  }

  // Iterating instead of .slice() here to avoid max call stack issue.

  var nVerts = vertices.length;
  for (i = 0; i < nVerts; i++) {
    vertices.push(vertices[i]);
  }
};

exports.GeometryHelper = GeometryHelper;

},{"../math/Vec2":37,"../math/Vec3":38}],61:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

function pickOctant(i) {
  return [(i & 1) * 2 - 1, (i & 2) - 1, (i & 4) / 2 - 1];
}

var boxData = [[0, 4, 2, 6, -1, 0, 0], [1, 3, 5, 7, +1, 0, 0], [0, 1, 4, 5, 0, -1, 0], [2, 6, 3, 7, 0, +1, 0], [0, 2, 1, 3, 0, 0, -1], [4, 5, 6, 7, 0, 0, +1]];

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class BoxGeometry
 * @constructor
 *
 * @param {Object}  options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var Box = (function (_Geometry) {
  _inherits(Box, _Geometry);

  function Box(options) {
    _classCallCheck(this, Box);

    //handled by es6 transpiler
    //if (!(this instanceof BoxGeometry)) return new BoxGeometry(options);

    options = options || {};

    var vertices = [];
    var textureCoords = [];
    var normals = [];
    var indices = [];

    var data;
    var d;
    var v;
    var i;
    var j;

    for (i = 0; i < boxData.length; i++) {
      data = boxData[i];
      v = i * 4;
      for (j = 0; j < 4; j++) {
        d = data[j];
        var octant = pickOctant(d);
        vertices.push(octant[0], octant[1], octant[2]);
        textureCoords.push(j & 1, (j & 2) / 2);
        normals.push(data[4], data[5], data[6]);
      }
      indices.push(v, v + 1, v + 2);
      indices.push(v + 2, v + 1, v + 3);
    }

    options.buffers = [{
      name: 'a_pos',
      data: vertices
    }, {
      name: 'a_texCoord',
      data: textureCoords,
      size: 2
    }, {
      name: 'a_normals',
      data: normals
    }, {
      name: 'indices',
      data: indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(Box.prototype), 'constructor', this).call(this, options);
  }

  return Box;
})(_Geometry2.Geometry);

exports.Box = Box;

},{"../Geometry":59}],62:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

var _GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Circle
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var Circle = (function (_Geometry) {
  _inherits(Circle, _Geometry);

  function Circle(options) {
    _classCallCheck(this, Circle);

    //handled by es6 transpiler
    //if (!(this instanceof Circle)) return new Circle(options);

    options = options || {};
    var detail = options.detail || 30;
    var buffers = getCircleBuffers(detail, true);

    if (options.backface !== false) {
      _GeometryHelper.GeometryHelper.addBackfaceTriangles(buffers.vertices, buffers.indices);
    }

    var textureCoords = getCircleTexCoords(buffers.vertices);
    var normals = _GeometryHelper.GeometryHelper.computeNormals(buffers.vertices, buffers.indices);

    options.buffers = [{
      name: 'a_pos',
      data: buffers.vertices
    }, {
      name: 'a_texCoord',
      data: textureCoords,
      size: 2
    }, {
      name: 'a_normals',
      data: normals
    }, {
      name: 'indices',
      data: buffers.indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(Circle.prototype), 'constructor', this).call(this, options);
  }

  return Circle;
})(_Geometry2.Geometry);

function getCircleTexCoords(vertices) {
  var textureCoords = [];
  var nFaces = vertices.length / 3;

  for (var i = 0; i < nFaces; i++) {
    var x = vertices[i * 3],
        y = vertices[i * 3 + 1];

    textureCoords.push(0.5 + x * 0.5, 0.5 + -y * 0.5);
  }

  return textureCoords;
}

/**
 * Calculates and returns all vertex positions, texture
 * coordinates and normals of the circle primitive.
 *
 * @method
 *
 * @param {Number} detail Amount of detail that determines how many
 * vertices are created and where they are placed
 *
 * @return {Object} constructed geometry
 */
function getCircleBuffers(detail) {
  var vertices = [0, 0, 0];
  var indices = [];
  var counter = 1;
  var theta;
  var x;
  var y;

  for (var i = 0; i < detail + 1; i++) {
    theta = i / detail * Math.PI * 2;

    x = Math.cos(theta);
    y = Math.sin(theta);

    vertices.push(x, y, 0);

    if (i > 0) indices.push(0, counter, ++counter);
  }

  return {
    vertices: vertices,
    indices: indices
  };
}

exports.Circle = Circle;

},{"../Geometry":59,"../GeometryHelper":60}],63:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

var _GeometryHelper = require('../GeometryHelper');

/**
 * This class creates a new geometry instance and sets
 * its vertex positions, texture coordinates, normals,
 * and indices to based on the primitive.
 *
 * @class Cylinder
 * @constructor
 *
 * @param {Object} options Parameters that alter thed
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var Cylinder = (function (_Geometry) {
  _inherits(Cylinder, _Geometry);

  function Cylinder(options) {
    _classCallCheck(this, Cylinder);

    //handled by es6 transpiler
    //if (!(this instanceof Cylinder)) return new Cylinder(options);

    options = options || {};
    var radius = options.radius || 1;
    var detail = options.detail || 15;
    var buffers;

    buffers = _GeometryHelper.GeometryHelper.generateParametric(detail, detail, Cylinder.generator.bind(null, radius));

    if (options.backface !== false) {
      _GeometryHelper.GeometryHelper.addBackfaceTriangles(buffers.vertices, buffers.indices);
    }

    options.buffers = [{
      name: 'a_pos',
      data: buffers.vertices
    }, {
      name: 'a_texCoord',
      data: _GeometryHelper.GeometryHelper.getSpheroidUV(buffers.vertices),
      size: 2
    }, {
      name: 'a_normals',
      data: _GeometryHelper.GeometryHelper.computeNormals(buffers.vertices, buffers.indices)
    }, {
      name: 'indices',
      data: buffers.indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(Cylinder.prototype), 'constructor', this).call(this, options);
  }

  /**
   * Function used in iterative construction of parametric primitive.
   *
   * @static
   * @method
   * @param {Number} r Cylinder radius.
   * @param {Number} u Longitudal progress from 0 to PI.
   * @param {Number} v Latitudal progress from 0 to PI.
   * @param {Array} pos X, Y, Z position of vertex at given slice and stack.
   *
   * @return {undefined} undefined
   */
  return Cylinder;
})(_Geometry2.Geometry);

Cylinder.generator = function generator(r, u, v, pos) {
  pos[1] = r * Math.sin(v);
  pos[0] = r * Math.cos(v);
  pos[2] = r * (-1 + u / Math.PI * 2);
};

exports.Cylinder = Cylinder;

},{"../Geometry":59,"../GeometryHelper":60}],64:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

var _GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class GeodesicSphere
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var GeodesicSphere = (function (_Geometry) {
  _inherits(GeodesicSphere, _Geometry);

  function GeodesicSphere(options) {
    _classCallCheck(this, GeodesicSphere);

    //handled by es6 transpiler
    //if (!(this instanceof GeodesicSphere)) return new GeodesicSphere(options);

    var t = (1 + Math.sqrt(5)) * 0.5;

    var vertices = [-1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, -t, 0, 1, -t, 0, -1, t, 0, 1, t, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, -1];
    var indices = [0, 5, 11, 0, 1, 5, 0, 7, 1, 0, 10, 7, 0, 11, 10, 1, 9, 5, 5, 4, 11, 11, 2, 10, 10, 6, 7, 7, 8, 1, 3, 4, 9, 3, 2, 4, 3, 6, 2, 3, 8, 6, 3, 9, 8, 4, 5, 9, 2, 11, 4, 6, 10, 2, 8, 7, 6, 9, 1, 8];

    vertices = _GeometryHelper.GeometryHelper.normalizeAll(vertices);

    options = options || {};
    var detail = options.detail || 3;

    while (--detail) _GeometryHelper.GeometryHelper.subdivideSpheroid(vertices, indices);
    _GeometryHelper.GeometryHelper.getUniqueFaces(vertices, indices);

    var normals = _GeometryHelper.GeometryHelper.computeNormals(vertices, indices);
    var textureCoords = _GeometryHelper.GeometryHelper.getSpheroidUV(vertices);

    options.buffers = [{
      name: 'a_pos',
      data: vertices
    }, {
      name: 'a_texCoord',
      data: textureCoords,
      size: 2
    }, {
      name: 'a_normals',
      data: normals
    }, {
      name: 'indices',
      data: indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(GeodesicSphere.prototype), 'constructor', this).call(this, options);
  }

  return GeodesicSphere;
})(_Geometry2.Geometry);

exports.GeodesicSphere = GeodesicSphere;

},{"../Geometry":59,"../GeometryHelper":60}],65:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

var _GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Icosahedron
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var Icosahedron = (function (_Geometry) {
  _inherits(Icosahedron, _Geometry);

  function Icosahedron(options) {
    _classCallCheck(this, Icosahedron);

    //handled by es6 transpiler
    //if (!(this instanceof Icosahedron)) return new Icosahedron(options);

    options = options || {};
    var t = (1 + Math.sqrt(5)) / 2;

    var vertices = [-1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, -t, 0, 1, -t, 0, -1, t, 0, 1, t, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, -1];
    var indices = [0, 5, 11, 0, 1, 5, 0, 7, 1, 0, 10, 7, 0, 11, 10, 1, 9, 5, 5, 4, 11, 11, 2, 10, 10, 6, 7, 7, 8, 1, 3, 4, 9, 3, 2, 4, 3, 6, 2, 3, 8, 6, 3, 9, 8, 4, 5, 9, 2, 11, 4, 6, 10, 2, 8, 7, 6, 9, 1, 8];

    _GeometryHelper.GeometryHelper.getUniqueFaces(vertices, indices);

    var normals = _GeometryHelper.GeometryHelper.computeNormals(vertices, indices);
    var textureCoords = _GeometryHelper.GeometryHelper.getSpheroidUV(vertices);

    vertices = _GeometryHelper.GeometryHelper.normalizeAll(vertices);

    options.buffers = [{
      name: 'a_pos',
      data: vertices
    }, {
      name: 'a_texCoord',
      data: textureCoords,
      size: 2
    }, {
      name: 'a_normals',
      data: normals
    }, {
      name: 'indices',
      data: indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(Icosahedron.prototype), 'constructor', this).call(this, options);
  }

  return Icosahedron;
})(_Geometry2.Geometry);

exports.Icosahedron = Icosahedron;

},{"../Geometry":59,"../GeometryHelper":60}],66:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

var _GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class ParametricCone
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var ParametricCone = (function (_Geometry) {
  _inherits(ParametricCone, _Geometry);

  function ParametricCone(options) {
    _classCallCheck(this, ParametricCone);

    //handled by es6 transpiler
    //if (!(this instanceof ParametricCone)) return new ParametricCone(options);

    options = options || {};
    var detail = options.detail || 15;
    var radius = options.radius || 1 / Math.PI;

    var buffers = _GeometryHelper.GeometryHelper.generateParametric(detail, detail, ParametricCone.generator.bind(null, radius));

    if (options.backface !== false) {
      _GeometryHelper.GeometryHelper.addBackfaceTriangles(buffers.vertices, buffers.indices);
    }

    options.buffers = [{
      name: 'a_pos',
      data: buffers.vertices
    }, {
      name: 'a_texCoord',
      data: _GeometryHelper.GeometryHelper.getSpheroidUV(buffers.vertices),
      size: 2
    }, {
      name: 'a_normals',
      data: _GeometryHelper.GeometryHelper.computeNormals(buffers.vertices, buffers.indices)
    }, {
      name: 'indices',
      data: buffers.indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(ParametricCone.prototype), 'constructor', this).call(this, options);
  }

  /**
   * function used in iterative construction of parametric primitive.
   *
   * @static
   * @method
   * @param {Number} r Cone Radius.
   * @param {Number} u Longitudal progress from 0 to PI.
   * @param {Number} v Latitudal progress from 0 to PI.
   * @return {Array} x, y and z coordinate of geometry.
   */

  return ParametricCone;
})(_Geometry2.Geometry);

ParametricCone.generator = function generator(r, u, v, pos) {
  pos[0] = -r * u * Math.cos(v);
  pos[1] = r * u * Math.sin(v);
  pos[2] = -u / (Math.PI / 2) + 1;
};

exports.ParametricCone = ParametricCone;

},{"../Geometry":59,"../GeometryHelper":60}],67:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

var _GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Plane
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var Plane = (function (_Geometry) {
  _inherits(Plane, _Geometry);

  function Plane(options) {
    _classCallCheck(this, Plane);

    //handled by es6 transpiler
    //if (!(this instanceof Plane)) return new Plane(options);

    options = options || {};
    var detailX = options.detailX || options.detail || 1;
    var detailY = options.detailY || options.detail || 1;

    var vertices = [];
    var textureCoords = [];
    var normals = [];
    var indices = [];

    var i;

    for (var y = 0; y <= detailY; y++) {
      var t = y / detailY;
      for (var x = 0; x <= detailX; x++) {
        var s = x / detailX;
        vertices.push(2. * (s - .5), 2 * (t - .5), 0);
        textureCoords.push(s, 1 - t);
        if (x < detailX && y < detailY) {
          i = x + y * (detailX + 1);
          indices.push(i, i + 1, i + detailX + 1);
          indices.push(i + detailX + 1, i + 1, i + detailX + 2);
        }
      }
    }

    if (options.backface !== false) {
      _GeometryHelper.GeometryHelper.addBackfaceTriangles(vertices, indices);

      // duplicate texture coordinates as well

      var len = textureCoords.length;
      for (i = 0; i < len; i++) textureCoords.push(textureCoords[i]);
    }

    normals = _GeometryHelper.GeometryHelper.computeNormals(vertices, indices);

    options.buffers = [{
      name: 'a_pos',
      data: vertices
    }, {
      name: 'a_texCoord',
      data: textureCoords,
      size: 2
    }, {
      name: 'a_normals',
      data: normals
    }, {
      name: 'indices',
      data: indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(Plane.prototype), 'constructor', this).call(this, options);
  }

  return Plane;
})(_Geometry2.Geometry);

exports.Plane = Plane;

},{"../Geometry":59,"../GeometryHelper":60}],68:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

var _GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Sphere
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var Sphere = (function (_Geometry) {
  _inherits(Sphere, _Geometry);

  function Sphere(options) {
    _classCallCheck(this, Sphere);

    //handled by es6 transpiler
    //if (!(this instanceof Sphere)) return new Sphere(options);

    options = options || {};
    var detail = options.detail || 10;
    var detailX = options.detailX || detail;
    var detailY = options.detailY || detail;

    var buffers = _GeometryHelper.GeometryHelper.generateParametric(detailX, detailY, Sphere.generator, true);

    options.buffers = [{
      name: 'a_pos',
      data: buffers.vertices
    }, {
      name: 'a_texCoord',
      data: _GeometryHelper.GeometryHelper.getSpheroidUV(buffers.vertices),
      size: 2
    }, {
      name: 'a_normals',
      data: _GeometryHelper.GeometryHelper.getSpheroidNormals(buffers.vertices)
    }, {
      name: 'indices',
      data: buffers.indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(Sphere.prototype), 'constructor', this).call(this, options);
  }

  /**
   * Function used in iterative construction of parametric primitive.
   *
   * @static
   * @method
   * @param {Number} u Longitudal progress from 0 to PI.
   * @param {Number} v Latitudal progress from 0 to PI.
   * @param {Array} pos X, Y, Z position of vertex at given slice and stack.
   *
   * @return {undefined} undefined
   */
  return Sphere;
})(_Geometry2.Geometry);

Sphere.generator = function generator(u, v, pos) {
  var x = Math.sin(u) * Math.cos(v);
  var y = Math.cos(u);
  var z = -Math.sin(u) * Math.sin(v);

  pos[0] = x;
  pos[1] = y;
  pos[2] = z;
};

exports.Sphere = Sphere;

},{"../Geometry":59,"../GeometryHelper":60}],69:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

var _GeometryHelper = require('../GeometryHelper');

/**
 * This function generates custom buffers and passes them to
 * a new static geometry, which is returned to the user.
 *
 * @class Tetrahedron
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var Tetrahedron = (function (_Geometry) {
  _inherits(Tetrahedron, _Geometry);

  function Tetrahedron(options) {
    _classCallCheck(this, Tetrahedron);

    //handled by es6 transpiler
    //if (!(this instanceof Tetrahedron)) return new Tetrahedron(options);

    var textureCoords = [];
    var normals = [];
    var detail;
    var i;
    var t = Math.sqrt(3);

    var vertices = [
    // Back
    1, -1, -1 / t, -1, -1, -1 / t, 0, 1, 0,

    // Right
    0, 1, 0, 0, -1, t - 1 / t, 1, -1, -1 / t,

    // Left
    0, 1, 0, -1, -1, -1 / t, 0, -1, t - 1 / t,

    // Bottom
    0, -1, t - 1 / t, -1, -1, -1 / t, 1, -1, -1 / t];

    var indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    for (i = 0; i < 4; i++) {
      textureCoords.push(0.0, 0.0, 0.5, 1.0, 1.0, 0.0);
    }

    options = options || {};

    while (--detail) _GeometryHelper.GeometryHelper.subdivide(indices, vertices, textureCoords);
    normals = _GeometryHelper.GeometryHelper.computeNormals(vertices, indices);

    options.buffers = [{
      name: 'a_pos',
      data: vertices
    }, {
      name: 'a_texCoord',
      data: textureCoords,
      size: 2
    }, {
      name: 'a_normals',
      data: normals
    }, {
      name: 'indices',
      data: indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(Tetrahedron.prototype), 'constructor', this).call(this, options);
  }

  return Tetrahedron;
})(_Geometry2.Geometry);

exports.Tetrahedron = Tetrahedron;

},{"../Geometry":59,"../GeometryHelper":60}],70:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

var _GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Torus
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var Torus = (function (_Geometry) {
  _inherits(Torus, _Geometry);

  function Torus(options) {
    _classCallCheck(this, Torus);

    //handled by es6 transpiler
    //if (!(this instanceof Torus)) return new Torus(options);

    options = options || {};
    var detail = options.detail || 30;
    var holeRadius = options.holeRadius || 0.80;
    var tubeRadius = options.tubeRadius || 0.20;

    var buffers = _GeometryHelper.GeometryHelper.generateParametric(detail, detail, Torus.generator.bind(null, holeRadius, tubeRadius));

    options.buffers = [{
      name: 'a_pos',
      data: buffers.vertices
    }, {
      name: 'a_texCoord',
      data: _GeometryHelper.GeometryHelper.getSpheroidUV(buffers.vertices),
      size: 2
    }, {
      name: 'a_normals',
      data: _GeometryHelper.GeometryHelper.computeNormals(buffers.vertices, buffers.indices)
    }, {
      name: 'indices',
      data: buffers.indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(Torus.prototype), 'constructor', this).call(this, options);
  }

  /**
   * function used in iterative construction of parametric primitive.
   *
   * @static
   * @method
   * @param {Number} c Radius of inner hole.
   * @param {Number} a Radius of tube.
   * @param {Number} u Longitudal progress from 0 to PI.
   * @param {Number} v Latitudal progress from 0 to PI.
   * @param {Array} pos X, Y, Z position of vertex at given slice and stack.
   *
   * @return {undefined} undefined
   */
  return Torus;
})(_Geometry2.Geometry);

Torus.generator = function generator(c, a, u, v, pos) {
  pos[0] = (c + a * Math.cos(2 * v)) * Math.sin(2 * u);
  pos[1] = -(c + a * Math.cos(2 * v)) * Math.cos(2 * u);
  pos[2] = a * Math.sin(2 * v);
};

exports.Torus = Torus;

},{"../Geometry":59,"../GeometryHelper":60}],71:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Geometry2 = require('../Geometry');

var _GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Triangle
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */

var Triangle = (function (_Geometry) {
  _inherits(Triangle, _Geometry);

  function Triangle(options) {
    _classCallCheck(this, Triangle);

    //handled by es6 transpiler
    //if (!(this instanceof Triangle)) return new Triangle(options);

    options = options || {};
    var detail = options.detail || 1;
    var normals = [];
    var textureCoords = [0.0, 0.0, 0.5, 1.0, 1.0, 0.0];
    var indices = [0, 1, 2];
    var vertices = [-1, -1, 0, 0, 1, 0, 1, -1, 0];

    while (--detail) _GeometryHelper.GeometryHelper.subdivide(indices, vertices, textureCoords);

    if (options.backface !== false) _GeometryHelper.GeometryHelper.addBackfaceTriangles(vertices, indices);

    normals = _GeometryHelper.GeometryHelper.computeNormals(vertices, indices);

    options.buffers = [{
      name: 'a_pos',
      data: vertices
    }, {
      name: 'a_texCoord',
      data: textureCoords,
      size: 2
    }, {
      name: 'a_normals',
      data: normals
    }, {
      name: 'indices',
      data: indices,
      size: 1
    }];

    _get(Object.getPrototypeOf(Triangle.prototype), 'constructor', this).call(this, options);
  }

  return Triangle;
})(_Geometry2.Geometry);

exports.Triangle = Triangle;

},{"../Geometry":59,"../GeometryHelper":60}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Box = require('./Box');

var _Circle = require('./Circle');

var _Cylinder = require('./Cylinder');

var _GeodesicSphere = require('./GeodesicSphere');

var _Icosahedron = require('./Icosahedron');

var _ParametricCone = require('./ParametricCone');

var _Plane = require('./Plane');

var _Sphere = require('./Sphere');

var _Tetrahedron = require('./Tetrahedron');

var _Torus = require('./Torus');

var _Triangle = require('./Triangle');

exports.Box = _Box.Box;
exports.Circle = _Circle.Circle;
exports.Cylinder = _Cylinder.Cylinder;
exports.GeodesicSphere = _GeodesicSphere.GeodesicSphere;
exports.Icosahedron = _Icosahedron.Icosahedron;
exports.ParametricCone = _ParametricCone.ParametricCone;
exports.Plane = _Plane.Plane;
exports.Sphere = _Sphere.Sphere;
exports.Tetrahedron = _Tetrahedron.Tetrahedron;
exports.Torus = _Torus.Torus;
exports.Triangle = _Triangle.Triangle;

},{"./Box":61,"./Circle":62,"./Cylinder":63,"./GeodesicSphere":64,"./Icosahedron":65,"./ParametricCone":66,"./Plane":67,"./Sphere":68,"./Tetrahedron":69,"./Torus":70,"./Triangle":71}],73:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

// TODO This will be removed once `Mesh#setGeometry` no longer accepts
// geometries defined by name.
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _webglGeometriesPrimitives = require('../webgl-geometries/primitives');

var Geometry = _interopRequireWildcard(_webglGeometriesPrimitives);

var _coreCommands = require('../core/Commands');

var _coreTransformSystem = require('../core/TransformSystem');

var _webglGeometriesPrimitivesPlane = require('../webgl-geometries/primitives/Plane');

var _coreOpacitySystem = require('../core/OpacitySystem');

/**
 * The Mesh class is responsible for providing the API for how
 * a RenderNode will interact with the WebGL API by adding
 * a set of commands to the renderer.
 *
 * @class Mesh
 * @constructor
 * @renderable
 *
 * @param {Node} node Dispatch LocalDispatch to be retrieved
 * @param {Object} options Optional params for configuring Mesh
 *
 * @return {undefined} undefined
 */

var INPUTS = ['baseColor', 'normals', 'glossiness', 'positionOffset'];

var Mesh = (function () {
  function Mesh(node, options) {
    _classCallCheck(this, Mesh);

    this._node = null;
    this._id = null;
    this._changeQueue = [];
    this._initialized = false;
    this._requestingUpdate = false;
    this._inDraw = false;
    this.value = {
      geometry: new _webglGeometriesPrimitivesPlane.Plane(),
      drawOptions: null,
      color: null,
      expressions: {},
      flatShading: null,
      glossiness: null,
      positionOffset: null,
      normals: null
    };
    if (node) node.addComponent(this);
    if (options) this.setDrawOptions(options);
  }

  /**
   * Pass custom options to Mesh, such as a 3 element map
   * which displaces the position of each vertex in world space.
   *
   * @method
   *
   * @param {Object} options Draw options
   * @return {Mesh} Current mesh
   */

  _createClass(Mesh, [{
    key: 'setDrawOptions',
    value: function setDrawOptions(options) {
      this._changeQueue.push(_coreCommands.Commands.GL_SET_DRAW_OPTIONS);
      this._changeQueue.push(options);

      this.value.drawOptions = options;
      return this;
    }
  }, {
    key: 'getDrawOptions',

    /**
     * Get the mesh's custom options.
     *
     * @method
     *
     * @returns {Object} Options
     */
    value: function getDrawOptions() {
      return this.value.drawOptions;
    }
  }, {
    key: 'setGeometry',

    /**
     * Assigns a geometry to be used for this mesh. Sets the geometry from either
     * a 'Geometry' or a valid primitive (string) name. Queues the set command for this
     * geometry and looks for buffers to send to the renderer to update geometry.
     *
     * @method
     *
     * @param {Geometry|String} geometry Geometry to be associated with the mesh.
     * @param {Object} options Various configurations for geometries.
     *
     * @return {Mesh} Mesh
     */
    value: function setGeometry(geometry, options) {
      if (typeof geometry === 'string') {
        if (!Geometry[geometry]) throw 'Invalid geometry: "' + geometry + '".';else {
          console.warn('Mesh#setGeometry using the geometry registry is deprecated!\n' + 'Instantiate the geometry directly via `new ' + geometry + '(options)` instead!');

          geometry = new Geometry[geometry](options);
        }
      }

      if (this.value.geometry !== geometry || this._inDraw) {
        if (this._initialized) {
          this._changeQueue.push(_coreCommands.Commands.GL_SET_GEOMETRY);
          this._changeQueue.push(geometry.spec.id);
          this._changeQueue.push(geometry.spec.type);
          this._changeQueue.push(geometry.spec.dynamic);
        }
        this._requestUpdate();
        this.value.geometry = geometry;
      }

      if (this._initialized) {
        if (this._node) {
          var i = this.value.geometry.spec.invalidations.length;
          if (i) this._requestUpdate();
          while (i--) {
            this.value.geometry.spec.invalidations.pop();
            this._changeQueue.push(_coreCommands.Commands.GL_BUFFER_DATA);
            this._changeQueue.push(this.value.geometry.spec.id);
            this._changeQueue.push(this.value.geometry.spec.bufferNames[i]);
            this._changeQueue.push(this.value.geometry.spec.bufferValues[i]);
            this._changeQueue.push(this.value.geometry.spec.bufferSpacings[i]);
            this._changeQueue.push(this.value.geometry.spec.dynamic);
          }
        }
      }
      return this;
    }
  }, {
    key: 'getGeometry',

    /**
     * Gets the geometry of a mesh.
     *
     * @method
     *
     * @returns {Geometry} Geometry
     */
    value: function getGeometry() {
      return this.value.geometry;
    }
  }, {
    key: 'setBaseColor',

    /**
    * Changes the color of Mesh, passing either a material expression or
    * color using the 'Color' utility component.
    *
    * @method
    *
    * @param {Object|Color} color Material, image, vec3, or Color instance
    *
    * @return {Mesh} Mesh
    */
    value: function setBaseColor(color) {
      var uniformValue;
      var isMaterial = color.__isAMaterial__;
      var isColor = !!color.getNormalizedRGBA;

      if (isMaterial) {
        addMeshToMaterial(this, color, 'baseColor');
        this.value.color = null;
        this.value.expressions.baseColor = color;
        uniformValue = color;
      } else if (isColor) {
        this.value.expressions.baseColor = null;
        this.value.color = color;
        uniformValue = color.getNormalizedRGBA();
      }

      if (this._initialized) {

        // If a material expression

        if (color.__isAMaterial__) {
          this._changeQueue.push(_coreCommands.Commands.MATERIAL_INPUT);
        }

        // If a color component
        else if (color.getNormalizedRGB) {
            this._changeQueue.push(_coreCommands.Commands.GL_UNIFORMS);
          }

        this._changeQueue.push('u_baseColor');
        this._changeQueue.push(uniformValue);
      }

      this._requestUpdate();

      return this;
    }
  }, {
    key: 'getBaseColor',

    /**
     * Returns either the material expression or the color instance of Mesh.
     *
     * @method
     *
     * @returns {MaterialExpress|Color} MaterialExpress or Color instance
     */
    value: function getBaseColor() {
      return this.value.expressions.baseColor || this.value.color;
    }
  }, {
    key: 'setFlatShading',

    /**
     * Change whether the Mesh is affected by light. Default is true.
     *
     * @method
     *
     * @param {boolean} bool Boolean for setting flat shading
     *
     * @return {Mesh} Mesh
     */
    value: function setFlatShading(bool) {
      if (this._inDraw || this.value.flatShading !== bool) {
        this.value.flatShading = bool;
        if (this._initialized) {
          this._changeQueue.push(_coreCommands.Commands.GL_UNIFORMS);
          this._changeQueue.push('u_flatShading');
          this._changeQueue.push(bool ? 1 : 0);
        }
        this._requestUpdate();
      }

      return this;
    }
  }, {
    key: 'getFlatShading',

    /**
     * Returns a boolean for whether Mesh is affected by light.
     *
     * @method
     *
     * @returns {Boolean} Boolean
     */
    value: function getFlatShading() {
      return this.value.flatShading;
    }
  }, {
    key: 'setNormals',

    /**
     * Defines a 3-element map which is used to provide significant physical
     * detail to the surface by perturbing the facing direction of each individual
     * pixel.
     *
     * @method
     *
     * @param {Object|Array} materialExpression Material, Image or vec3
     *
     * @return {Mesh} Mesh
     */
    value: function setNormals(materialExpression) {
      var isMaterial = materialExpression.__isAMaterial__;

      if (isMaterial) {
        addMeshToMaterial(this, materialExpression, 'normals');
        this.value.expressions.normals = materialExpression;
      }

      if (this._initialized) {
        this._changeQueue.push(materialExpression.__isAMaterial__ ? _coreCommands.Commands.MATERIAL_INPUT : _coreCommands.Commands.GL_UNIFORMS);
        this._changeQueue.push('u_normals');
        this._changeQueue.push(materialExpression);
      }

      this._requestUpdate();

      return this;
    }
  }, {
    key: 'getNormals',

    /**
     * Returns the Normals expression of Mesh
     *
     * @method
     *
     * @param {materialExpression} materialExpression Normals Material Expression
     *
     * @returns {Array} The normals expression for Mesh
     */
    value: function getNormals(materialExpression) {
      return this.value.expressions.normals;
    }
  }, {
    key: 'setGlossiness',

    /**
     * Defines the glossiness of the mesh from either a material expression or a
     * scalar value
     *
     * @method
     *
     * @param {MaterialExpression|Color} glossiness Accepts either a material expression or Color instance
     * @param {Number} strength Optional value for changing the strength of the glossiness
     *
     * @return {Mesh} Mesh
     */
    value: function setGlossiness(glossiness, strength) {
      var isMaterial = glossiness.__isAMaterial__;
      var isColor = !!glossiness.getNormalizedRGB;

      if (isMaterial) {
        addMeshToMaterial(this, glossiness, 'glossiness');
        this.value.glossiness = [null, null];
        this.value.expressions.glossiness = glossiness;
      } else if (isColor) {
        this.value.expressions.glossiness = null;
        this.value.glossiness = [glossiness, strength || 20];
        glossiness = glossiness ? glossiness.getNormalizedRGB() : [0, 0, 0];
        glossiness.push(strength || 20);
      }

      if (this._initialized) {
        this._changeQueue.push(glossiness.__isAMaterial__ ? _coreCommands.Commands.MATERIAL_INPUT : _coreCommands.Commands.GL_UNIFORMS);
        this._changeQueue.push('u_glossiness');
        this._changeQueue.push(glossiness);
      }

      this._requestUpdate();
      return this;
    }
  }, {
    key: 'getGlossiness',

    /**
     * Returns material expression or scalar value for glossiness.
     *
     * @method
     *
     * @returns {MaterialExpress|Number} MaterialExpress or Number
     */
    value: function getGlossiness() {
      return this.value.expressions.glossiness || this.value.glossiness;
    }
  }, {
    key: 'setPositionOffset',

    /**
     * Defines 3 element map which displaces the position of each vertex in world
     * space.
     *
     * @method
     *
     * @param {MaterialExpression|Array} materialExpression Position offset expression
     *
     * @return {Mesh} Mesh
     */
    value: function setPositionOffset(materialExpression) {
      var uniformValue;
      var isMaterial = materialExpression.__isAMaterial__;

      if (isMaterial) {
        addMeshToMaterial(this, materialExpression, 'positionOffset');
        this.value.expressions.positionOffset = materialExpression;
        uniformValue = materialExpression;
      } else {
        this.value.expressions.positionOffset = null;
        this.value.positionOffset = materialExpression;
        uniformValue = this.value.positionOffset;
      }

      if (this._initialized) {
        this._changeQueue.push(materialExpression.__isAMaterial__ ? _coreCommands.Commands.MATERIAL_INPUT : _coreCommands.Commands.GL_UNIFORMS);
        this._changeQueue.push('u_positionOffset');
        this._changeQueue.push(uniformValue);
      }

      this._requestUpdate();

      return this;
    }
  }, {
    key: 'getPositionOffset',

    /**
     * Returns position offset.
     *
     * @method
     *
     * @returns {MaterialExpress|Number} MaterialExpress or Number
     */
    value: function getPositionOffset() {
      return this.value.expressions.positionOffset || this.value.positionOffset;
    }
  }, {
    key: 'getMaterialExpressions',

    /**
     * Get the mesh's expressions
     *
     * @method
     *
     * @returns {Object} Object
     */
    value: function getMaterialExpressions() {
      return this.value.expressions;
    }
  }, {
    key: 'getValue',

    /**
     * Get the mesh's value
     *
     * @method
     *
     * @returns {Number} Value
     */
    value: function getValue() {
      return this.value;
    }
  }, {
    key: '_pushInvalidations',

    /**
     * Queues the invalidations for Mesh
     *
     * @param {String} expressionName Expression Name
     *
     * @return {Mesh} Mesh
     */
    value: function _pushInvalidations(expressionName) {
      var uniformKey;
      var expression = this.value.expressions[expressionName];
      var sender = this._node;
      if (expression) {
        expression.traverse(function (node) {
          var i = node.invalidations.length;
          while (i--) {
            uniformKey = node.invalidations.pop();
            sender.sendDrawCommand(_coreCommands.Commands.GL_UNIFORMS);
            sender.sendDrawCommand(uniformKey);
            sender.sendDrawCommand(node.uniforms[uniformKey]);
          }
        });
      }
      return this;
    }
  }, {
    key: 'onUpdate',

    /**
    * Sends draw commands to the renderer
    *
    * @private
    * @method
    *
    * @return {undefined} undefined
    */
    value: function onUpdate() {
      var node = this._node;
      var queue = this._changeQueue;

      if (node && node.isMounted()) {
        node.sendDrawCommand(_coreCommands.Commands.WITH);
        node.sendDrawCommand(node.getLocation());

        // If any invalidations exist, push them into the queue
        if (this.value.color && this.value.color.isActive()) {
          this._node.sendDrawCommand(_coreCommands.Commands.GL_UNIFORMS);
          this._node.sendDrawCommand('u_baseColor');
          this._node.sendDrawCommand(this.value.color.getNormalizedRGBA());
          this._node.requestUpdateOnNextTick(this._id);
        }
        if (this.value.glossiness && this.value.glossiness[0] && this.value.glossiness[0].isActive()) {
          this._node.sendDrawCommand(_coreCommands.Commands.GL_UNIFORMS);
          this._node.sendDrawCommand('u_glossiness');
          var glossiness = this.value.glossiness[0].getNormalizedRGB();
          glossiness.push(this.value.glossiness[1]);
          this._node.sendDrawCommand(glossiness);
          this._node.requestUpdateOnNextTick(this._id);
        } else {
          this._requestingUpdate = false;
        }

        // If any invalidations exist, push them into the queue
        this._pushInvalidations('baseColor');
        this._pushInvalidations('positionOffset');
        this._pushInvalidations('normals');
        this._pushInvalidations('glossiness');

        for (var i = 0; i < queue.length; i++) {
          node.sendDrawCommand(queue[i]);
        }

        queue.length = 0;
      }
    }
  }, {
    key: 'onMount',

    /**
     * Save reference to node, set its ID and call draw on Mesh.
     *
     * @method
     *
     * @param {Node} node Node
     * @param {Number} id Identifier for Mesh
     *
     * @return {undefined} undefined
     */
    value: function onMount(node, id) {
      this._node = node;
      this._id = id;

      _coreTransformSystem.TransformSystem.makeCalculateWorldMatrixAt(node.getLocation());
      _coreOpacitySystem.OpacitySystem.makeCalculateWorldOpacityAt(node.getLocation());

      this.draw();
    }
  }, {
    key: 'onDismount',

    /**
     * Queues the command for dismounting Mesh
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function onDismount() {
      this._initialized = false;
      this._inDraw = false;

      this._node.sendDrawCommand(_coreCommands.Commands.WITH);
      this._node.sendDrawCommand(this._node.getLocation());
      this._node.sendDrawCommand(_coreCommands.Commands.GL_REMOVE_MESH);

      this._node = null;
      this._id = null;
    }
  }, {
    key: 'onShow',

    /**
     * Makes Mesh visible
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function onShow() {
      this._changeQueue.push(_coreCommands.Commands.GL_MESH_VISIBILITY, true);

      this._requestUpdate();
    }
  }, {
    key: 'onHide',

    /**
     * Makes Mesh hidden
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function onHide() {
      this._changeQueue.push(_coreCommands.Commands.GL_MESH_VISIBILITY, false);

      this._requestUpdate();
    }
  }, {
    key: 'onTransformChange',

    /**
     * Receives transform change updates from the scene graph.
     *
     * @method
     * @private
     *
     * @param {Array} transform Transform matric
     *
     * @return {undefined} undefined
     */
    value: function onTransformChange(transform) {
      if (this._initialized) {
        this._changeQueue.push(_coreCommands.Commands.GL_UNIFORMS);
        this._changeQueue.push('u_transform');
        this._changeQueue.push(transform.getWorldTransform());
      }

      this._requestUpdate();
    }
  }, {
    key: 'onSizeChange',

    /**
     * Receives size change updates from the scene graph.
     *
     * @method
     * @private
     *
     * @param {Number} x width of the Node the Mesh is attached to
     * @param {Number} y height of the Node the Mesh is attached to
     * @param {Number} z depth of the Node the Mesh is attached to
     *
     * @return {undefined} undefined
     */
    value: function onSizeChange(x, y, z) {
      if (this._initialized) {
        this._changeQueue.push(_coreCommands.Commands.GL_UNIFORMS);
        this._changeQueue.push('u_size');
        this._changeQueue.push([x, y, z]);
      }

      this._requestUpdate();
    }
  }, {
    key: 'onOpacityChange',

    /**
     * Receives opacity change updates from the scene graph.
     *
     * @method
     * @private
     *
     * @param {Number} opacity Opacity
     *
     * @return {undefined} undefined
     */
    value: function onOpacityChange(opacity) {
      if (this._initialized) {
        this._changeQueue.push(_coreCommands.Commands.GL_UNIFORMS);
        this._changeQueue.push('u_opacity');
        this._changeQueue.push(opacity.getWorldOpacity());
      }

      this._requestUpdate();
    }
  }, {
    key: 'onAddUIEvent',

    /**
     * Adds functionality for UI events (TODO)
     *
     * @method
     *
     * @param {String} UIEvent UI Event
     *
     * @return {undefined} undefined
     */
    value: function onAddUIEvent(UIEvent) {
      //TODO
    }
  }, {
    key: '_requestUpdate',

    /**
     * Queues instance to be updated.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function _requestUpdate() {
      if (!this._requestingUpdate && this._node) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }
    }
  }, {
    key: 'init',

    /**
     * Initializes the mesh with appropriate listeners.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function init() {
      this._initialized = true;
      this.onTransformChange(_coreTransformSystem.TransformSystem.get(this._node.getLocation()));
      this.onOpacityChange(_coreOpacitySystem.OpacitySystem.get(this._node.getLocation()));
      var size = this._node.getSize();
      this.onSizeChange(size[0], size[1], size[2]);
      this._requestUpdate();
    }
  }, {
    key: 'draw',

    /**
     * Draws given Mesh's current state.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function draw() {
      this._inDraw = true;

      this.init();

      var value = this.getValue();

      if (value.geometry != null) this.setGeometry(value.geometry);
      if (value.color != null) this.setBaseColor(value.color);
      if (value.glossiness != null) this.setGlossiness.apply(this, value.glossiness);
      if (value.drawOptions != null) this.setDrawOptions(value.drawOptions);
      if (value.flatShading != null) this.setFlatShading(value.flatShading);

      if (value.expressions.normals != null) this.setNormals(value.expressions.normals);
      if (value.expressions.baseColor != null) this.setBaseColor(value.expressions.baseColor);
      if (value.expressions.glossiness != null) this.setGlossiness(value.expressions.glossiness);
      if (value.expressions.positionOffset != null) this.setPositionOffset(value.expressions.positionOffset);

      this._inDraw = false;
    }
  }]);

  return Mesh;
})();

function addMeshToMaterial(mesh, material, name) {
  var expressions = mesh.value.expressions;
  var previous = expressions[name];
  var shouldRemove = true;
  var len = material.inputs;

  while (len--) addMeshToMaterial(mesh, material.inputs[len], name);

  len = INPUTS.length;

  while (len--) shouldRemove |= name !== INPUTS[len] && previous !== expressions[INPUTS[len]];

  if (shouldRemove) material.meshes.splice(material.meshes.indexOf(previous), 1);

  if (material.meshes.indexOf(mesh) === -1) material.meshes.push(mesh);
}

exports.Mesh = Mesh;

},{"../core/Commands":6,"../core/OpacitySystem":12,"../core/TransformSystem":19,"../webgl-geometries/primitives":72,"../webgl-geometries/primitives/Plane":67}],74:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _coreCommands = require('../../core/Commands');

/**
 * The blueprint for all light components.
 *
 * @class Light
 * @constructor
 * @abstract
 *
 * @param {Node} node The controlling node from the corresponding Render Node
 *
 * @return {undefined} undefined
 */

var Light = (function () {
  function Light(node) {
    _classCallCheck(this, Light);

    this._node = node;
    this._requestingUpdate = false;
    this._color = null;
    this.queue = [];
    this.commands = {
      color: _coreCommands.Commands.GL_LIGHT_COLOR,
      position: _coreCommands.Commands.GL_LIGHT_POSITION
    };
    this._id = node.addComponent(this);
  }

  /**
  * Changes the color of the light, using the 'Color' utility component.
  *
  * @method
  *
  * @param {Color} color Color instance
  *
  * @return {Light} Light
  */

  _createClass(Light, [{
    key: 'setColor',
    value: function setColor(color) {
      if (!color.getNormalizedRGB) return false;
      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }
      this._color = color;
      this.queue.push(this.commands.color);
      var rgb = this._color.getNormalizedRGB();
      this.queue.push(rgb[0]);
      this.queue.push(rgb[1]);
      this.queue.push(rgb[2]);
      return this;
    }
  }, {
    key: 'getColor',

    /**
    * Returns the current color.
      * @method
    *
    * @returns {Color} Color
    */
    value: function getColor() {
      return this._color;
    }
  }, {
    key: 'onUpdate',

    /**
    * Sends draw commands to the renderer
    *
    * @private
    * @method
    *
    * @return {undefined} undefined
    */
    value: function onUpdate() {
      var path = this._node.getLocation();

      this._node.sendDrawCommand(_coreCommands.Commands.WITH).sendDrawCommand(path);

      var i = this.queue.length;
      while (i--) {
        this._node.sendDrawCommand(this.queue.shift());
      }

      if (this._color && this._color.isActive()) {
        this._node.sendDrawCommand(this.commands.color);
        var rgb = this._color.getNormalizedRGB();
        this._node.sendDrawCommand(rgb[0]);
        this._node.sendDrawCommand(rgb[1]);
        this._node.sendDrawCommand(rgb[2]);
        this._node.requestUpdateOnNextTick(this._id);
      } else {
        this._requestingUpdate = false;
      }
    }
  }]);

  return Light;
})();

exports.Light = Light;

},{"../../core/Commands":6}],75:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Light2 = require('./Light');

var _coreTransformSystem = require('../../core/TransformSystem');

/**
 * PointLight extends the functionality of Light. PointLight is a light source
 * that emits light in all directions from a point in space.
 *
 * @class PointLight
 * @constructor
 * @augments Light
 *
 * @param {Node} node LocalDispatch to be retrieved from the corresponding Render Node
 *
 * @return {undefined} undefined
 */

var PointLight = (function (_Light) {
  _inherits(PointLight, _Light);

  function PointLight(node) {
    _classCallCheck(this, PointLight);

    _get(Object.getPrototypeOf(PointLight.prototype), 'constructor', this).call(this, node);
  }

  /**
   * Receive the notice that the node you are on has been mounted.
   *
   * @param {Node} node Node that the component has been associated with
   * @param {Number} id ID associated with the node
   *
   * @return {undefined} undefined
   */

  _createClass(PointLight, [{
    key: 'onMount',
    value: function onMount(node, id) {
      this._id = id;
      _coreTransformSystem.TransformSystem.makeBreakPointAt(this._node.getLocation());
      this.onTransformChange(_coreTransformSystem.TransformSystem.get(this._node.getLocation()));
    }
  }, {
    key: 'onTransformChange',

    /**
     * Receives transform change updates from the scene graph.
     *
     * @private
     *
     * @param {Array} transform Transform matrix
     *
     * @return {undefined} undefined
     */
    value: function onTransformChange(transform) {
      if (!this._requestingUpdate) {
        this._node.requestUpdate(this._id);
        this._requestingUpdate = true;
      }
      transform = transform.getWorldTransform();
      this.queue.push(this.commands.position);
      this.queue.push(transform[12]);
      this.queue.push(transform[13]);
      this.queue.push(transform[14]);
    }
  }]);

  return PointLight;
})(_Light2.Light);

exports.PointLight = PointLight;

},{"../../core/TransformSystem":19,"./Light":74}],76:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * Buffer is a private class that wraps the vertex data that defines
 * the the points of the triangles that webgl draws. Each buffer
 * maps to one attribute of a mesh.
 *
 * @class Buffer
 * @constructor
 *
 * @param {Number} target The bind target of the buffer to update: ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER
 * @param {Object} type Array type to be used in calls to gl.bufferData.
 * @param {WebGLContext} gl The WebGL context that the buffer is hosted by.
 *
 * @return {undefined} undefined
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Buffer = (function () {
  function Buffer(target, type, gl) {
    _classCallCheck(this, Buffer);

    this.buffer = null;
    this.target = target;
    this.type = type;
    this.data = [];
    this.gl = gl;
  }

  /**
   * Creates a WebGL buffer if one does not yet exist and binds the buffer to
   * to the context. Runs bufferData with appropriate data.
   *
   * @method
   *
   * @return {undefined} undefined
   */

  _createClass(Buffer, [{
    key: 'subData',
    value: function subData() {
      var gl = this.gl;
      this.buffer = this.buffer || gl.createBuffer();
      gl.bindBuffer(this.target, this.buffer);
      gl.bufferData(this.target, new this.type(this.data), gl.STATIC_DRAW);
    }
  }]);

  return Buffer;
})();

exports.Buffer = Buffer;

},{}],77:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Buffer = require('./Buffer');

/**
 * BufferRegistry is a class that manages allocation of buffers to
 * input geometries.
 *
 * @class BufferRegistry
 * @constructor
 *
 * @param {WebGLContext} context WebGL drawing context to be passed to buffers.
 *
 * @return {undefined} undefined
 */
var INDICES = 'indices';

var BufferRegistry = (function () {
  function BufferRegistry(context) {
    _classCallCheck(this, BufferRegistry);

    this.gl = context;

    this.registry = {};
    this._dynamicBuffers = [];
    this._staticBuffers = [];

    this._arrayBufferMax = 30000;
    this._elementBufferMax = 30000;
  }

  /**
   * Binds and fills all the vertex data into webgl buffers.  Will reuse buffers if
   * possible.  Populates registry with the name of the buffer, the WebGL buffer
   * object, spacing of the attribute, the attribute's offset within the buffer,
   * and finally the length of the buffer.  This information is later accessed by
   * the root to draw the buffers.
   *
   * @method
   *
   * @param {Number} geometryId Id of the geometry instance that holds the buffers.
   * @param {String} name Key of the input buffer in the geometry.
   * @param {Array} value Flat array containing input data for buffer.
   * @param {Number} spacing The spacing, or itemSize, of the input buffer.
   * @param {Boolean} dynamic Boolean denoting whether a geometry is dynamic or static.
   *
   * @return {undefined} undefined
   */

  _createClass(BufferRegistry, [{
    key: 'allocate',
    value: function allocate(geometryId, name, value, spacing, dynamic) {
      var vertexBuffers = this.registry[geometryId] || (this.registry[geometryId] = {
        keys: [],
        values: [],
        spacing: [],
        offset: [],
        length: []
      });

      var j = vertexBuffers.keys.indexOf(name);
      var isIndex = name === INDICES;
      var bufferFound = false;
      var newOffset;
      var offset = 0;
      var length;
      var buffer;
      var k;

      if (j === -1) {
        j = vertexBuffers.keys.length;
        length = isIndex ? value.length : Math.floor(value.length / spacing);

        if (!dynamic) {

          // Use a previously created buffer if available.

          for (k = 0; k < this._staticBuffers.length; k++) {

            if (isIndex === this._staticBuffers[k].isIndex) {
              newOffset = this._staticBuffers[k].offset + value.length;
              if (!isIndex && newOffset < this._arrayBufferMax || isIndex && newOffset < this._elementBufferMax) {
                buffer = this._staticBuffers[k].buffer;
                offset = this._staticBuffers[k].offset;
                this._staticBuffers[k].offset += value.length;
                bufferFound = true;
                break;
              }
            }
          }

          // Create a new static buffer in none were found.

          if (!bufferFound) {
            buffer = new _Buffer.Buffer(isIndex ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER, isIndex ? Uint16Array : Float32Array, this.gl);

            this._staticBuffers.push({
              buffer: buffer,
              offset: value.length,
              isIndex: isIndex
            });
          }
        } else {

          // For dynamic geometries, always create new buffer.

          buffer = new _Buffer.Buffer(isIndex ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER, isIndex ? Uint16Array : Float32Array, this.gl);

          this._dynamicBuffers.push({
            buffer: buffer,
            offset: value.length,
            isIndex: isIndex
          });
        }

        // Update the registry for the spec with buffer information.

        vertexBuffers.keys.push(name);
        vertexBuffers.values.push(buffer);
        vertexBuffers.spacing.push(spacing);
        vertexBuffers.offset.push(offset);
        vertexBuffers.length.push(length);
      }

      var len = value.length;
      for (k = 0; k < len; k++) {
        vertexBuffers.values[j].data[offset + k] = value[k];
      }
      vertexBuffers.values[j].subData();
    }
  }]);

  return BufferRegistry;
})();

exports.BufferRegistry = BufferRegistry;

},{"./Buffer":76}],78:[function(require,module,exports){
'use strict';

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Takes the original rendering contexts' compiler function
 * and augments it with added functionality for parsing and
 * displaying errors.
 *
 * @method
 *
 * @returns {Function} Augmented function
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
function Debug() {
  return _augmentFunction(this.gl.compileShader, function (shader) {
    if (!this.getShaderParameter(shader, this.COMPILE_STATUS)) {
      var errors = this.getShaderInfoLog(shader);
      var source = this.getShaderSource(shader);
      _processErrors(errors, source);
    }
  });
}

// Takes a function, keeps the reference and replaces it by a closure that
// executes the original function and the provided callback.
function _augmentFunction(func, callback) {
  return function () {
    var res = func.apply(this, arguments);
    callback.apply(this, arguments);
    return res;
  };
}

// Parses errors and failed source code from shaders in order
// to build displayable error blocks.
// Inspired by Jaume Sanchez Elias.
function _processErrors(errors, source) {

  var css = 'body,html{background:#e3e3e3;font-family:monaco,monospace;font-size:14px;line-height:1.7em}' + '#shaderReport{left:0;top:0;right:0;box-sizing:border-box;position:absolute;z-index:1000;color:' + '#222;padding:15px;white-space:normal;list-style-type:none;margin:50px auto;max-width:1200px}' + '#shaderReport li{background-color:#fff;margin:13px 0;box-shadow:0 1px 2px rgba(0,0,0,.15);' + 'padding:20px 30px;border-radius:2px;border-left:20px solid #e01111}span{color:#e01111;' + 'text-decoration:underline;font-weight:700}#shaderReport li p{padding:0;margin:0}' + '#shaderReport li:nth-child(even){background-color:#f4f4f4}' + '#shaderReport li p:first-child{margin-bottom:10px;color:#666}';

  var el = document.createElement('style');
  document.getElementsByTagName('head')[0].appendChild(el);
  el.textContent = css;

  var report = document.createElement('ul');
  report.setAttribute('id', 'shaderReport');
  document.body.appendChild(report);

  var re = /ERROR: [\d]+:([\d]+): (.+)/gmi;
  var lines = source.split('\n');

  var m;
  while ((m = re.exec(errors)) != null) {
    if (m.index === re.lastIndex) re.lastIndex++;
    var li = document.createElement('li');
    var code = '<p><span>ERROR</span> "' + m[2] + '" in line ' + m[1] + '</p>';
    code += '<p><b>' + lines[m[1] - 1].replace(/^[ \t]+/g, '') + '</b></p>';
    li.innerHTML = code;
    report.appendChild(li);
  }
}

exports.Debug = Debug;

},{}],79:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilitiesClone = require('../utilities/clone');

var _utilitiesKeyValueToArrays = require('../utilities/keyValueToArrays');

var _webglShaders = require('../webgl-shaders');

var _Debug = require('./Debug');

var vertexWrapper = _webglShaders.webglShaders.vertex;
var fragmentWrapper = _webglShaders.webglShaders.fragment;

var identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

var header = 'precision mediump float;\n';

var TYPES = {
  undefined: 'float ',
  1: 'float ',
  2: 'vec2 ',
  3: 'vec3 ',
  4: 'vec4 ',
  16: 'mat4 '
};

var inputTypes = {
  u_baseColor: 'vec4',
  u_normals: 'vert',
  u_glossiness: 'vec4',
  u_positionOffset: 'vert'
};

var masks = {
  vert: 1,
  vec3: 2,
  vec4: 4,
  float: 8
};

/**
 * Uniform keys and values
 */
var uniforms = (0, _utilitiesKeyValueToArrays.keyValueToArrays)({
  u_perspective: identityMatrix,
  u_view: identityMatrix,
  u_resolution: [0, 0, 0],
  u_transform: identityMatrix,
  u_size: [1, 1, 1],
  u_time: 0,
  u_opacity: 1,
  u_metalness: 0,
  u_glossiness: [0, 0, 0, 0],
  u_baseColor: [1, 1, 1, 1],
  u_normals: [1, 1, 1],
  u_positionOffset: [0, 0, 0],
  u_lightPosition: identityMatrix,
  u_lightColor: identityMatrix,
  u_ambientLight: [0, 0, 0],
  u_flatShading: 0,
  u_numLights: 0
});

/**
 * Attributes keys and values
 */
var attributes = (0, _utilitiesKeyValueToArrays.keyValueToArrays)({
  a_pos: [0, 0, 0],
  a_texCoord: [0, 0],
  a_normals: [0, 0, 0]
});

/**
 * Varyings keys and values
 */
var varyings = (0, _utilitiesKeyValueToArrays.keyValueToArrays)({
  v_textureCoordinate: [0, 0],
  v_normal: [0, 0, 0],
  v_position: [0, 0, 0],
  v_eyeVector: [0, 0, 0]
});

/**
 * A class that handles interactions with the WebGL shader program
 * used by a specific context.  It manages creation of the shader program
 * and the attached vertex and fragment shaders.  It is also in charge of
 * passing all uniforms to the WebGLContext.
 *
 * @class Program
 * @constructor
 *
 * @param {WebGL_Context} gl Context to be used to create the shader program
 * @param {Object} options Program options
 *
 * @return {undefined} undefined
 */

var Program = (function () {
  function Program(gl, options) {
    _classCallCheck(this, Program);

    this.gl = gl;
    this.options = options || {};

    this.registeredMaterials = {};
    this.cachedUniforms = {};
    this.uniformTypes = [];

    this.definitionVec4 = [];
    this.definitionVec3 = [];
    this.definitionFloat = [];
    this.applicationVec3 = [];
    this.applicationVec4 = [];
    this.applicationFloat = [];
    this.applicationVert = [];
    this.definitionVert = [];

    if (this.options.debug) {
      this.gl.compileShader = _Debug.Debug.call(this);
    }

    this.resetProgram();
  }

  /**
   * Determines whether a material has already been registered to
   * the shader program.
   *
   * @method
   *
   * @param {String} name Name of target input of material.
   * @param {Object} material Compiled material object being verified.
   *
   * @return {Program} this Current program.
   */

  _createClass(Program, [{
    key: 'registerMaterial',
    value: function registerMaterial(name, material) {
      var compiled = material;
      var type = inputTypes[name];
      var mask = masks[type];

      if ((this.registeredMaterials[material._id] & mask) === mask) return this;

      var k;

      for (k in compiled.uniforms) {
        if (uniforms.keys.indexOf(k) === -1) {
          uniforms.keys.push(k);
          uniforms.values.push(compiled.uniforms[k]);
        }
      }

      for (k in compiled.varyings) {
        if (varyings.keys.indexOf(k) === -1) {
          varyings.keys.push(k);
          varyings.values.push(compiled.varyings[k]);
        }
      }

      for (k in compiled.attributes) {
        if (attributes.keys.indexOf(k) === -1) {
          attributes.keys.push(k);
          attributes.values.push(compiled.attributes[k]);
        }
      }

      this.registeredMaterials[material._id] |= mask;

      switch (type) {
        case 'float':
          this.definitionFloat.push(material.defines);
          this.definitionFloat.push('float fa_' + material._id + '() {\n ' + compiled.glsl + ' \n}');
          this.applicationFloat.push('if (int(abs(ID)) == ' + material._id + ') return fa_' + material._id + '();');
          break;
        case 'vec3':
          this.definitionVec3.push(material.defines);
          this.definitionVec3.push('vec3 fa_' + material._id + '() {\n ' + compiled.glsl + ' \n}');
          this.applicationVec3.push('if (int(abs(ID.x)) == ' + material._id + ') return fa_' + material._id + '();');
          break;
        case 'vec4':
          this.definitionVec4.push(material.defines);
          this.definitionVec4.push('vec4 fa_' + material._id + '() {\n ' + compiled.glsl + ' \n}');
          this.applicationVec4.push('if (int(abs(ID.x)) == ' + material._id + ') return fa_' + material._id + '();');
          break;
        case 'vert':
          this.definitionVert.push(material.defines);
          this.definitionVert.push('vec3 fa_' + material._id + '() {\n ' + compiled.glsl + ' \n}');
          this.applicationVert.push('if (int(abs(ID.x)) == ' + material._id + ') return fa_' + material._id + '();');
          break;
      }

      return this.resetProgram();
    }
  }, {
    key: 'resetProgram',

    /**
     * Clears all cached uniforms and attribute locations.  Assembles
     * new fragment and vertex shaders and based on material from
     * currently registered materials.  Attaches said shaders to new
     * shader program and upon success links program to the WebGL
     * context.
     *
     * @method
     *
     * @return {Program} Current program.
     */
    value: function resetProgram() {
      var vertexHeader = [header];
      var fragmentHeader = [header];

      var fragmentSource;
      var vertexSource;
      var program;
      var name;
      var value;
      var i;

      this.uniformLocations = [];
      this.attributeLocations = {};

      this.uniformTypes = {};

      this.attributeNames = (0, _utilitiesClone.clone)(attributes.keys);
      this.attributeValues = (0, _utilitiesClone.clone)(attributes.values);

      this.varyingNames = (0, _utilitiesClone.clone)(varyings.keys);
      this.varyingValues = (0, _utilitiesClone.clone)(varyings.values);

      this.uniformNames = (0, _utilitiesClone.clone)(uniforms.keys);
      this.uniformValues = (0, _utilitiesClone.clone)(uniforms.values);

      this.cachedUniforms = {};

      fragmentHeader.push('uniform sampler2D u_textures[7];\n');

      if (this.applicationVert.length) vertexHeader.push('uniform sampler2D u_textures[7];\n');

      for (i = 0; i < this.uniformNames.length; i++) {
        name = this.uniformNames[i];
        value = this.uniformValues[i];
        vertexHeader.push('uniform ' + TYPES[value.length] + name + ';\n');
        fragmentHeader.push('uniform ' + TYPES[value.length] + name + ';\n');
      }

      for (i = 0; i < this.attributeNames.length; i++) {
        name = this.attributeNames[i];
        value = this.attributeValues[i];
        vertexHeader.push('attribute ' + TYPES[value.length] + name + ';\n');
      }

      for (i = 0; i < this.varyingNames.length; i++) {
        name = this.varyingNames[i];
        value = this.varyingValues[i];
        vertexHeader.push('varying ' + TYPES[value.length] + name + ';\n');
        fragmentHeader.push('varying ' + TYPES[value.length] + name + ';\n');
      }

      vertexSource = vertexHeader.join('') + vertexWrapper.replace('#vert_definitions', this.definitionVert.join('\n')).replace('#vert_applications', this.applicationVert.join('\n'));

      fragmentSource = fragmentHeader.join('') + fragmentWrapper.replace('#vec3_definitions', this.definitionVec3.join('\n')).replace('#vec3_applications', this.applicationVec3.join('\n')).replace('#vec4_definitions', this.definitionVec4.join('\n')).replace('#vec4_applications', this.applicationVec4.join('\n')).replace('#float_definitions', this.definitionFloat.join('\n')).replace('#float_applications', this.applicationFloat.join('\n'));

      program = this.gl.createProgram();

      this.gl.attachShader(program, this.compileShader(this.gl.createShader(this.gl.VERTEX_SHADER), vertexSource));

      this.gl.attachShader(program, this.compileShader(this.gl.createShader(this.gl.FRAGMENT_SHADER), fragmentSource));

      this.gl.linkProgram(program);

      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        console.error('link error: ' + this.gl.getProgramInfoLog(program));
        this.program = null;
      } else {
        this.program = program;
        this.gl.useProgram(this.program);
      }

      this.setUniforms(this.uniformNames, this.uniformValues);

      var textureLocation = this.gl.getUniformLocation(this.program, 'u_textures[0]');
      this.gl.uniform1iv(textureLocation, [0, 1, 2, 3, 4, 5, 6]);

      return this;
    }
  }, {
    key: 'uniformIsCached',

    /**
     * Compares the value of the input uniform value against
     * the cached value stored on the Program class.  Updates and
     * creates new entries in the cache when necessary.
     *
     * @method
     * @param {String} targetName Key of uniform spec being evaluated.
     * @param {Number|Array} value Value of uniform spec being evaluated.
     *
     * @return {Boolean} boolean Indicating whether the uniform being set is cached.
     */
    value: function uniformIsCached(targetName, value) {
      if (this.cachedUniforms[targetName] == null) {
        if (value.length) {
          this.cachedUniforms[targetName] = new Float32Array(value);
        } else {
          this.cachedUniforms[targetName] = value;
        }
        return false;
      } else if (value.length) {
        var i = value.length;
        while (i--) {
          if (value[i] !== this.cachedUniforms[targetName][i]) {
            i = value.length;
            while (i--) this.cachedUniforms[targetName][i] = value[i];
            return false;
          }
        }
      } else if (this.cachedUniforms[targetName] !== value) {
        this.cachedUniforms[targetName] = value;
        return false;
      }

      return true;
    }
  }, {
    key: 'setUniforms',

    /**
     * Handles all passing of uniforms to WebGL drawing context.  This
     * function will find the uniform location and then, based on
     * a type inferred from the javascript value of the uniform, it will call
     * the appropriate function to pass the uniform to WebGL.  Finally,
     * setUniforms will iterate through the passed in shaderChunks (if any)
     * and set the appropriate uniforms to specify which chunks to use.
     *
     * @method
     * @param {Array} uniformNames Array containing the keys of all uniforms to be set.
     * @param {Array} uniformValue Array containing the values of all uniforms to be set.
     *
     * @return {Program} Current program.
     */
    value: function setUniforms(uniformNames, uniformValue) {
      var gl = this.gl;
      var location;
      var value;
      var name;
      var len;
      var i;

      if (!this.program) return this;

      len = uniformNames.length;
      for (i = 0; i < len; i++) {
        name = uniformNames[i];
        value = uniformValue[i];

        // Retrieve the cached location of the uniform,
        // requesting a new location from the WebGL context
        // if it does not yet exist.

        location = this.uniformLocations[name];

        if (location === null) continue;
        if (location === undefined) {
          location = gl.getUniformLocation(this.program, name);
          this.uniformLocations[name] = location;
        }

        // Check if the value is already set for the
        // given uniform.
        if (this.uniformIsCached(name, value)) continue;

        // Determine the correct function and pass the uniform
        // value to WebGL.
        if (!this.uniformTypes[name]) {
          this.uniformTypes[name] = this.getUniformTypeFromValue(value);
        }

        // Call uniform setter function on WebGL context with correct value

        switch (this.uniformTypes[name]) {
          case 'uniform4fv':
            gl.uniform4fv(location, value);
            break;
          case 'uniform3fv':
            gl.uniform3fv(location, value);
            break;
          case 'uniform2fv':
            gl.uniform2fv(location, value);
            break;
          case 'uniform1fv':
            gl.uniform1fv(location, value);
            break;
          case 'uniform1f':
            gl.uniform1f(location, value);
            break;
          case 'uniformMatrix3fv':
            gl.uniformMatrix3fv(location, false, value);
            break;
          case 'uniformMatrix4fv':
            gl.uniformMatrix4fv(location, false, value);
            break;
        }
      }

      return this;
    }
  }, {
    key: 'getUniformTypeFromValue',

    /**
     * Infers uniform setter function to be called on the WebGL context, based
     * on an input value.
     *
     * @method
     *
     * @param {Number|Array} value Value from which uniform type is inferred.
     *
     * @return {String} Name of uniform function for given value.
     */
    value: function getUniformTypeFromValue(value) {
      if (Array.isArray(value) || value instanceof Float32Array) {
        switch (value.length) {
          case 1:
            return 'uniform1fv';
          case 2:
            return 'uniform2fv';
          case 3:
            return 'uniform3fv';
          case 4:
            return 'uniform4fv';
          case 9:
            return 'uniformMatrix3fv';
          case 16:
            return 'uniformMatrix4fv';
        }
      } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
        return 'uniform1f';
      }

      throw 'cant load uniform "' + name + '" with value:' + JSON.stringify(value);
    }
  }, {
    key: 'compileShader',

    /**
     * Adds shader source to shader and compiles the input shader.  Checks
     * compile status and logs error if necessary.
     *
     * @method
     *
     * @param {Object} shader Program to be compiled.
     * @param {String} source Source to be used in the shader.
     *
     * @return {Object} Compiled shader.
     */
    value: function compileShader(shader, source) {
      var i = 1;

      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        console.error('compile error: ' + this.gl.getShaderInfoLog(shader));
        console.error('1: ' + source.replace(/\n/g, function () {
          return '\n' + (i += 1) + ': ';
        }));
      }

      return shader;
    }
  }]);

  return Program;
})();

exports.Program = Program;

},{"../utilities/clone":56,"../utilities/keyValueToArrays":57,"../webgl-shaders":86,"./Debug":78}],80:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * Texture is a private class that stores image data
 * to be accessed from a shader or used as a render target.
 *
 * @class Texture
 * @constructor
 *
 * @param {GL} gl GL
 * @param {Object} options Options
 *
 * @return {undefined} undefined
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Texture = (function () {
  function Texture(gl, options) {
    _classCallCheck(this, Texture);

    options = options || {};
    this.id = gl.createTexture();
    this.width = options.width || 0;
    this.height = options.height || 0;
    this.mipmap = options.mipmap;
    this.format = options.format || 'RGBA';
    this.type = options.type || 'UNSIGNED_BYTE';
    this.gl = gl;

    this.bind();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options.flipYWebgl || false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlphaWebgl || false);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[options.magFilter] || gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[options.minFilter] || gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[options.wrapS] || gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[options.wrapT] || gl.CLAMP_TO_EDGE);
  }

  /**
   * Binds this texture as the selected target.
   *
   * @method
   * @return {Object} Current texture instance.
   */

  _createClass(Texture, [{
    key: 'bind',
    value: function bind() {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
      return this;
    }
  }, {
    key: 'unbind',

    /**
     * Erases the texture data in the given texture slot.
     *
     * @method
     * @return {Object} Current texture instance.
     */
    value: function unbind() {
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      return this;
    }
  }, {
    key: 'setImage',

    /**
     * Replaces the image data in the texture with the given image.
     *
     * @method
     *
     * @param {Image}   img     The image object to upload pixel data from.
     * @return {Object}         Current texture instance.
     */
    value: function setImage(img) {
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl[this.format], this.gl[this.format], this.gl[this.type], img);
      if (this.mipmap) this.gl.generateMipmap(this.gl.TEXTURE_2D);
      return this;
    }
  }, {
    key: 'setArray',

    /**
     * Replaces the image data in the texture with an array of arbitrary data.
     *
     * @method
     *
     * @param {Array}   input   Array to be set as data to texture.
     * @return {Object}         Current texture instance.
     */
    value: function setArray(input) {
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl[this.format], this.width, this.height, 0, this.gl[this.format], this.gl[this.type], input);
      return this;
    }
  }, {
    key: 'readBack',

    /**
     * Dumps the rgb-pixel contents of a texture into an array for debugging purposes
     *
     * @method
     *
     * @param {Number} x        x-offset between texture coordinates and snapshot
     * @param {Number} y        y-offset between texture coordinates and snapshot
     * @param {Number} width    x-depth of the snapshot
     * @param {Number} height   y-depth of the snapshot
     *
     * @return {Array}          An array of the pixels contained in the snapshot.
     */
    value: function readBack(x, y, width, height) {
      var gl = this.gl;
      var pixels;
      x = x || 0;
      y = y || 0;
      width = width || this.width;
      height = height || this.height;
      var fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        pixels = new Uint8Array(width * height * 4);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      }
      return pixels;
    }
  }]);

  return Texture;
})();

exports.Texture = Texture;

},{}],81:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Texture = require('./Texture');

var _createCheckerBoard = require('./createCheckerBoard');

/**
 * Handles loading, binding, and resampling of textures for WebGLRenderer.
 *
 * @class TextureManager
 * @constructor
 *
 * @param {WebGL_Context} gl Context used to create and bind textures.
 *
 * @return {undefined} undefined
 */

var TextureManager = (function () {
  function TextureManager(gl) {
    _classCallCheck(this, TextureManager);

    this.registry = [];
    this._needsResample = [];

    this._activeTexture = 0;
    this._boundTexture = null;

    this._checkerboard = (0, _createCheckerBoard.createCheckerBoard)();

    this.gl = gl;
  }

  /**
   * Loads an image from a string or Image object and executes a callback function.
   *
   * @method
   * @private
   *
   * @param {Object|String} input The input image data to load as an asset.
   * @param {Function} callback The callback function to be fired when the image has finished loading.
   *
   * @return {Object} Image object being loaded.
   */

  /**
   * Update function used by WebGLRenderer to queue resamples on
   * registered textures.
   *
   * @method
   *
   * @param {Number}      time    Time in milliseconds according to the compositor.
   * @return {undefined}          undefined
   */

  _createClass(TextureManager, [{
    key: 'update',
    value: function update(time) {
      var registryLength = this.registry.length;

      for (var i = 1; i < registryLength; i++) {
        var texture = this.registry[i];

        if (texture && texture.isLoaded && texture.resampleRate) {
          if (!texture.lastResample || time - texture.lastResample > texture.resampleRate) {
            if (!this._needsResample[texture.id]) {
              this._needsResample[texture.id] = true;
              texture.lastResample = time;
            }
          }
        }
      }
    }
  }, {
    key: 'register',

    /**
     * Creates a spec and creates a texture based on given texture data.
     * Handles loading assets if necessary.
     *
     * @method
     *
     * @param {Object}  input   Object containing texture id, texture data
     *                          and options used to draw texture.
     * @param {Number}  slot    Texture slot to bind generated texture to.
     * @return {undefined}      undefined
     */
    value: function register(input, slot) {
      var _this = this;

      var source = input.data;
      var textureId = input.id;
      var options = input.options || {};
      var texture = this.registry[textureId];
      var spec;

      if (!texture) {

        texture = new _Texture.Texture(this.gl, options);
        texture.setImage(this._checkerboard);

        // Add texture to registry

        spec = this.registry[textureId] = {
          resampleRate: options.resampleRate || null,
          lastResample: null,
          isLoaded: false,
          texture: texture,
          source: source,
          id: textureId,
          slot: slot
        };

        // Handle array

        if (Array.isArray(source) || source instanceof Uint8Array || source instanceof Float32Array) {
          this.bindTexture(textureId);
          texture.setArray(source);
          spec.isLoaded = true;
        }

        // Handle video
        else if (source instanceof HTMLVideoElement) {
            source.addEventListener('loadeddata', function () {
              _this.bindTexture(textureId);
              texture.setImage(source);

              spec.isLoaded = true;
              spec.source = source;
            });
          }

          // Handle image url
          else if (typeof source === 'string') {
              loadImage(source, function (img) {
                _this.bindTexture(textureId);
                texture.setImage(img);

                spec.isLoaded = true;
                spec.source = img;
              });
            }
      }

      return textureId;
    }
  }, {
    key: 'bindTexture',

    /**
     * Sets active texture slot and binds target texture.  Also handles
     * resampling when necessary.
     *
     * @method
     *
     * @param {Number} id Identifier used to retreive texture spec
     *
     * @return {undefined} undefined
     */
    value: function bindTexture(id) {
      var spec = this.registry[id];

      if (this._activeTexture !== spec.slot) {
        this.gl.activeTexture(this.gl.TEXTURE0 + spec.slot);
        this._activeTexture = spec.slot;
      }

      if (this._boundTexture !== id) {
        this._boundTexture = id;
        spec.texture.bind();
      }

      if (this._needsResample[spec.id]) {

        // TODO: Account for resampling of arrays.

        spec.texture.setImage(spec.source);
        this._needsResample[spec.id] = false;
      }
    }
  }]);

  return TextureManager;
})();

function loadImage(input, callback) {
  var image = (typeof input === 'string' ? new Image() : input) || {};
  image.crossOrigin = 'anonymous';

  if (!image.src) image.src = input;
  if (!image.complete) {
    image.onload = function () {
      callback(image);
    };
  } else {
    callback(image);
  }

  return image;
}

exports.TextureManager = TextureManager;

},{"./Texture":80,"./createCheckerBoard":84}],82:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Program = require('./Program');

var _BufferRegistry = require('./BufferRegistry');

var _radixSort = require('./radixSort');

var _utilitiesKeyValueToArrays = require('../utilities/keyValueToArrays');

var _TextureManager = require('./TextureManager');

var _compileMaterial = require('./compileMaterial');

var _utilitiesRegistry = require('../utilities/Registry');

var identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

var globalUniforms = (0, _utilitiesKeyValueToArrays.keyValueToArrays)({
  'u_numLights': 0,
  'u_ambientLight': new Array(3),
  'u_lightPosition': new Array(3),
  'u_lightColor': new Array(3),
  'u_perspective': new Array(16),
  'u_time': 0,
  'u_view': new Array(16)
});

/**
 * WebGLRenderer is a private class that manages all interactions with the WebGL
 * API. Each frame it receives commands from the compositor and updates its
 * registries accordingly. Subsequently, the draw function is called and the
 * WebGLRenderer issues draw calls for all meshes in its registry.
 *
 * @class WebGLRenderer
 * @constructor
 *
 * @param {Element} canvas The DOM element that GL will paint itself onto.
 * @param {Compositor} compositor Compositor used for querying the time from.
 *
 * @return {undefined} undefined
 */

var WebGLRenderer = (function () {
  function WebGLRenderer(canvas, compositor) {
    _classCallCheck(this, WebGLRenderer);

    canvas.classList.add('famous-webgl-renderer');

    this.canvas = canvas;
    this.compositor = compositor;

    var gl = this.getWebGLContext(this.canvas);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.polygonOffset(0.1, 0.1);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    this.meshRegistry = {};
    this.meshRegistryKeys = [];

    this.cutoutRegistry = new _utilitiesRegistry.Registry();
    this.lightRegistry = new _utilitiesRegistry.Registry();

    this.numLights = 0;
    this.ambientLightColor = [0, 0, 0];
    this.lightPositions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.lightColors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.textureManager = new _TextureManager.TextureManager(gl);
    this.bufferRegistry = new _BufferRegistry.BufferRegistry(gl);
    this.program = new _Program.Program(gl, {
      debug: true
    });

    this.state = {
      boundArrayBuffer: null,
      boundElementBuffer: null,
      lastDrawn: null,
      enabledAttributes: {},
      enabledAttributesKeys: []
    };

    this.resolutionName = ['u_resolution'];
    this.resolutionValues = [[0, 0, 0]];

    this.cachedSize = [];

    /*
    The projectionTransform has some constant components, i.e. the z scale, and the x and y translation.
      The z scale keeps the final z position of any vertex within the clip's domain by scaling it by an
    arbitrarily small coefficient. This has the advantage of being a useful default in the event of the
    user forgoing a near and far plane, an alien convention in dom space as in DOM overlapping is
    conducted via painter's algorithm.
      The x and y translation transforms the world space origin to the top left corner of the screen.
      The final component (this.projectionTransform[15]) is initialized as 1 because certain projection models,
    e.g. the WC3 specified model, keep the XY plane as the projection hyperplane.
    */
    this.projectionTransform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -0.000001, 0, -1, 1, 0, 1];

    // TODO: remove this hack

    var cutout = this.cutoutGeometry = {
      spec: {
        id: -1,
        bufferValues: [[-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]],
        bufferNames: ['a_pos'],
        type: 'TRIANGLE_STRIP'
      }
    };

    this.bufferRegistry.allocate(this.cutoutGeometry.spec.id, cutout.spec.bufferNames[0], cutout.spec.bufferValues[0], 3);
  }

  /**
   * Attempts to retreive the WebGLRenderer context using several
   * accessors. For browser compatability. Throws on error.
   *
   * @method
   *
   * @param {Object} canvas Canvas element from which the context is retreived
   *
   * @return {Object} WebGLContext WebGL context
   */

  _createClass(WebGLRenderer, [{
    key: 'getWebGLContext',
    value: function getWebGLContext(canvas) {
      if (this.gl) return this.gl;

      var names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];

      for (var i = 0, len = names.length; i < len && !this.gl; i++) this.gl = canvas.getContext(names[i]);

      if (!this.gl) throw new Error('Could not retrieve WebGL context. Please refer to https://www.khronos.org/webgl/ for requirements');

      return this.gl;
    }
  }, {
    key: 'createLight',

    /**
     * Adds a new base spec to the light registry at a given path.
     *
     * @method
     *
     * @param {String} path Path used as id of new light in lightRegistry
     *
     * @return {Object} Newly created light spec
     */
    value: function createLight(path) {
      this.numLights++;
      var light = {
        color: [0, 0, 0],
        position: [0, 0, 0]
      };
      this.lightRegistry.register(path, light);
      return light;
    }
  }, {
    key: 'createMesh',

    /**
     * Adds a new base spec to the mesh registry at a given path.
     *
     * @method
     *
     * @param {String} path Path used as id of new mesh in meshRegistry.
     *
     * @return {Object} Newly created mesh spec.
     */
    value: function createMesh(path) {
      var uniforms = (0, _utilitiesKeyValueToArrays.keyValueToArrays)({
        u_opacity: 1,
        u_transform: identity,
        u_size: [0, 0, 0],
        u_baseColor: [0.5, 0.5, 0.5, 1],
        u_positionOffset: [0, 0, 0],
        u_normals: [0, 0, 0],
        u_flatShading: 0,
        u_glossiness: [0, 0, 0, 0]
      });
      var mesh = {
        depth: null,
        uniformKeys: uniforms.keys,
        uniformValues: uniforms.values,
        buffers: {},
        geometry: null,
        drawType: null,
        textures: [],
        visible: true
      };

      this.meshRegistry[path] = mesh;
      this.meshRegistryKeys.push(path);
      return mesh;
    }
  }, {
    key: 'setCutoutState',

    /**
     * Sets flag on indicating whether to do skip draw phase for
     * cutout mesh at given path.
     *
     * @method
     *
     * @param {String} path Path used as id of target cutout mesh.
     * @param {Boolean} usesCutout Indicates the presence of a cutout mesh
     *
     * @return {undefined} undefined
     */
    value: function setCutoutState(path, usesCutout) {
      var cutout = this.getOrSetCutout(path);

      cutout.visible = usesCutout;
    }
  }, {
    key: 'getOrSetCutout',

    /**
     * Creates or retreives cutout
     *
     * @method
     *
     * @param {String} path Path used as id of target cutout mesh.
     *
     * @return {Object} Newly created cutout spec.
     */
    value: function getOrSetCutout(path) {
      var cutout = this.cutoutRegistry.get(path);

      if (!cutout) {
        var uniforms = (0, _utilitiesKeyValueToArrays.keyValueToArrays)({
          u_opacity: 0,
          u_transform: identity.slice(),
          u_size: [0, 0, 0],
          u_origin: [0, 0, 0],
          u_baseColor: [0, 0, 0, 1]
        });

        cutout = {
          uniformKeys: uniforms.keys,
          uniformValues: uniforms.values,
          geometry: this.cutoutGeometry.spec.id,
          drawType: this.cutoutGeometry.spec.type,
          visible: true
        };

        this.cutoutRegistry.register(path, cutout);
      }

      return cutout;
    }
  }, {
    key: 'setMeshVisibility',

    /**
     * Sets flag on indicating whether to do skip draw phase for
     * mesh at given path.
     *
     * @method
     * @param {String} path Path used as id of target mesh.
     * @param {Boolean} visibility Indicates the visibility of target mesh.
     *
     * @return {undefined} undefined
     */
    value: function setMeshVisibility(path, visibility) {
      var mesh = this.meshRegistry[path] || this.createMesh(path);

      mesh.visible = visibility;
    }
  }, {
    key: 'removeMesh',

    /**
     * Deletes a mesh from the meshRegistry.
     *
     * @method
     * @param {String} path Path used as id of target mesh.
     *
     * @return {undefined} undefined
     */
    value: function removeMesh(path) {
      delete this.meshRegistry[path];
      var index = this.meshRegistryKeys.indexOf(path);

      if (index !== -1) this.meshRegistryKeys.splice(index, 1);
    }
  }, {
    key: 'setCutoutUniform',

    /**
     * Creates or retreives cutout
     *
     * @method
     * @param {String} path Path used as id of cutout in cutout registry.
     * @param {String} uniformName Identifier used to upload value
     * @param {Array} uniformValue Value of uniform data
     *
     * @return {undefined} undefined
     */
    value: function setCutoutUniform(path, uniformName, uniformValue) {
      var cutout = this.getOrSetCutout(path);

      var index = cutout.uniformKeys.indexOf(uniformName);

      if (uniformValue.length) {
        for (var i = 0, len = uniformValue.length; i < len; i++) {
          cutout.uniformValues[index][i] = uniformValue[i];
        }
      } else {
        cutout.uniformValues[index] = uniformValue;
      }
    }
  }, {
    key: 'setMeshOptions',

    /**
     * Edits the options field on a mesh
     *
     * @method
     * @param {String} path Path used as id of target mesh
     * @param {Object} options Map of draw options for mesh
     *
     * @return {WebGLRenderer} this
     */
    value: function setMeshOptions(path, options) {
      var mesh = this.meshRegistry[path] || this.createMesh(path);

      mesh.options = options;
      return this;
    }
  }, {
    key: 'setAmbientLightColor',

    /**
     * Changes the color of the fixed intensity lighting in the scene
     *
     * @method
     *
     * @param {String} path Path used as id of light
     * @param {Number} r red channel
     * @param {Number} g green channel
     * @param {Number} b blue channel
     *
     * @return {WebGLRenderer} this
     */
    value: function setAmbientLightColor(path, r, g, b) {
      this.ambientLightColor[0] = r;
      this.ambientLightColor[1] = g;
      this.ambientLightColor[2] = b;
      return this;
    }
  }, {
    key: 'setLightPosition',

    /**
     * Changes the location of the light in the scene
     *
     * @method
     *
     * @param {String} path Path used as id of light
     * @param {Number} x x position
     * @param {Number} y y position
     * @param {Number} z z position
     *
     * @return {WebGLRenderer} this
     */
    value: function setLightPosition(path, x, y, z) {
      var light = this.lightRegistry.get(path) || this.createLight(path);
      light.position[0] = x;
      light.position[1] = y;
      light.position[2] = z;
      return this;
    }
  }, {
    key: 'setLightColor',

    /**
     * Changes the color of a dynamic intensity lighting in the scene
     *
     * @method
     *
     * @param {String} path Path used as id of light in light Registry.
     * @param {Number} r red channel
     * @param {Number} g green channel
     * @param {Number} b blue channel
     *
     * @return {WebGLRenderer} this
     */
    value: function setLightColor(path, r, g, b) {
      var light = this.lightRegistry.get(path) || this.createLight(path);

      light.color[0] = r;
      light.color[1] = g;
      light.color[2] = b;
      return this;
    }
  }, {
    key: 'handleMaterialInput',

    /**
     * Compiles material spec into program shader
     *
     * @method
     *
     * @param {String} path Path used as id of cutout in cutout registry.
     * @param {String} name Name that the rendering input the material is bound to
     * @param {Object} material Material spec
     *
     * @return {WebGLRenderer} this
     */
    value: function handleMaterialInput(path, name, material) {
      var mesh = this.meshRegistry[path] || this.createMesh(path);
      material = (0, _compileMaterial.compileMaterial)(material, mesh.textures.length);

      // Set uniforms to enable texture!

      mesh.uniformValues[mesh.uniformKeys.indexOf(name)][0] = -material._id;

      // Register textures!

      var i = material.textures.length;
      while (i--) {
        mesh.textures.push(this.textureManager.register(material.textures[i], mesh.textures.length + i));
      }

      // Register material!

      this.program.registerMaterial(name, material);

      return this.updateSize();
    }
  }, {
    key: 'setGeometry',

    /**
     * Changes the geometry data of a mesh
     *
     * @method
     *
     * @param {String} path Path used as id of cutout in cutout registry.
     * @param {Object} geometry Geometry object containing vertex data to be drawn
     * @param {Number} drawType Primitive identifier
     * @param {Boolean} dynamic Whether geometry is dynamic
     *
     * @return {undefined} undefined
     */
    value: function setGeometry(path, geometry, drawType, dynamic) {
      var mesh = this.meshRegistry[path] || this.createMesh(path);

      mesh.geometry = geometry;
      mesh.drawType = drawType;
      mesh.dynamic = dynamic;

      return this;
    }
  }, {
    key: 'setMeshUniform',

    /**
     * Uploads a new value for the uniform data when the mesh is being drawn
     *
     * @method
     *
     * @param {String} path Path used as id of mesh in mesh registry
     * @param {String} uniformName Identifier used to upload value
     * @param {Array} uniformValue Value of uniform data
     *
     * @return {undefined} undefined
     */
    value: function setMeshUniform(path, uniformName, uniformValue) {
      var mesh = this.meshRegistry[path] || this.createMesh(path);

      var index = mesh.uniformKeys.indexOf(uniformName);

      if (index === -1) {
        mesh.uniformKeys.push(uniformName);
        mesh.uniformValues.push(uniformValue);
      } else {
        mesh.uniformValues[index] = uniformValue;
      }
    }
  }, {
    key: 'bufferData',

    /**
     * Allocates a new buffer using the internal BufferRegistry.
     *
     * @method
     *
     * @param {Number} geometryId Id of geometry in geometry registry
     * @param {String} bufferName Attribute location name
     * @param {Array} bufferValue Vertex data
     * @param {Number} bufferSpacing The dimensions of the vertex
     * @param {Boolean} isDynamic Whether geometry is dynamic
     *
     * @return {undefined} undefined
     */
    value: function bufferData(geometryId, bufferName, bufferValue, bufferSpacing, isDynamic) {
      this.bufferRegistry.allocate(geometryId, bufferName, bufferValue, bufferSpacing, isDynamic);
    }
  }, {
    key: 'draw',

    /**
     * Triggers the 'draw' phase of the WebGLRenderer. Iterates through registries
     * to set uniforms, set attributes and issue draw commands for renderables.
     *
     * @method
     *
     * @param {Object} renderState Parameters provided by the compositor, that affect the rendering of all renderables.
     *
     * @return {undefined} undefined
     */
    value: function draw(renderState) {
      var time = this.compositor.getTime();

      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      this.textureManager.update(time);

      this.meshRegistryKeys = (0, _radixSort.radixSort)(this.meshRegistryKeys, this.meshRegistry);

      this.setGlobalUniforms(renderState);
      this.drawCutouts();
      this.drawMeshes();
    }
  }, {
    key: 'drawMeshes',

    /**
     * Iterates through and draws all registered meshes. This includes
     * binding textures, handling draw options, setting mesh uniforms
     * and drawing mesh buffers.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function drawMeshes() {
      var gl = this.gl;
      var buffers;
      var mesh;

      var paths = this.meshRegistryKeys;

      for (var i = 0; i < paths.length; i++) {
        mesh = this.meshRegistry[paths[i]];

        if (!mesh) continue;

        buffers = this.bufferRegistry.registry[mesh.geometry];

        if (!mesh.visible) continue;

        if (mesh.uniformValues[0] < 1) {
          gl.depthMask(false);
          gl.enable(gl.BLEND);
        } else {
          gl.depthMask(true);
          gl.disable(gl.BLEND);
        }

        if (!buffers) continue;

        var j = mesh.textures.length;
        while (j--) this.textureManager.bindTexture(mesh.textures[j]);

        if (mesh.options) this.handleOptions(mesh.options, mesh);

        this.program.setUniforms(mesh.uniformKeys, mesh.uniformValues);
        this.drawBuffers(buffers, mesh.drawType, mesh.geometry);

        if (mesh.options) this.resetOptions(mesh.options);
      }
    }
  }, {
    key: 'drawCutouts',

    /**
     * Iterates through and draws all registered cutout meshes. Blending
     * is disabled, cutout uniforms are set and finally buffers are drawn.
     *
     * @method
     *
     * @return {undefined} undefined
     */
    value: function drawCutouts() {
      var cutout;
      var buffers;
      var cutouts = this.cutoutRegistry.getValues();
      var len = cutouts.length;

      this.gl.disable(this.gl.CULL_FACE);
      this.gl.enable(this.gl.BLEND);
      this.gl.depthMask(true);

      for (var i = 0; i < len; i++) {
        cutout = cutouts[i];

        if (!cutout) continue;

        buffers = this.bufferRegistry.registry[cutout.geometry];

        if (!cutout.visible) continue;

        this.program.setUniforms(cutout.uniformKeys, cutout.uniformValues);
        this.drawBuffers(buffers, cutout.drawType, cutout.geometry);
      }

      this.gl.enable(this.gl.CULL_FACE);
    }
  }, {
    key: 'setGlobalUniforms',

    /**
     * Sets uniforms to be shared by all meshes.
     *
     * @method
     *
     * @param {Object} renderState Draw state options passed down from compositor.
     *
     * @return {undefined} undefined
     */
    value: function setGlobalUniforms(renderState) {
      var light;
      var stride;
      var lights = this.lightRegistry.getValues();
      var len = lights.length;

      for (var i = 0; i < len; i++) {
        light = lights[i];

        if (!light) continue;

        stride = i * 4;

        // Build the light positions' 4x4 matrix

        this.lightPositions[0 + stride] = light.position[0];
        this.lightPositions[1 + stride] = light.position[1];
        this.lightPositions[2 + stride] = light.position[2];

        // Build the light colors' 4x4 matrix

        this.lightColors[0 + stride] = light.color[0];
        this.lightColors[1 + stride] = light.color[1];
        this.lightColors[2 + stride] = light.color[2];
      }

      globalUniforms.values[0] = this.numLights;
      globalUniforms.values[1] = this.ambientLightColor;
      globalUniforms.values[2] = this.lightPositions;
      globalUniforms.values[3] = this.lightColors;

      /*
       * Set time and projection uniforms
       * projecting world space into a 2d plane representation of the canvas.
       * The x and y scale (this.projectionTransform[0] and this.projectionTransform[5] respectively)
       * convert the projected geometry back into clipspace.
       * The perpective divide (this.projectionTransform[11]), adds the z value of the point
       * multiplied by the perspective divide to the w value of the point. In the process
       * of converting from homogenous coordinates to NDC (normalized device coordinates)
       * the x and y values of the point are divided by w, which implements perspective.
       */
      this.projectionTransform[0] = 1 / (this.cachedSize[0] * 0.5);
      this.projectionTransform[5] = -1 / (this.cachedSize[1] * 0.5);
      this.projectionTransform[11] = renderState.perspectiveTransform[11];

      globalUniforms.values[4] = this.projectionTransform;
      globalUniforms.values[5] = this.compositor.getTime() * 0.001;
      globalUniforms.values[6] = renderState.viewTransform;

      this.program.setUniforms(globalUniforms.keys, globalUniforms.values);
    }
  }, {
    key: 'drawBuffers',

    /**
     * Loads the buffers and issues the draw command for a geometry.
     *
     * @method
     *
     * @param {Object} vertexBuffers All buffers used to draw the geometry.
     * @param {Number} mode Enumerator defining what primitive to draw
     * @param {Number} id ID of geometry being drawn.
     *
     * @return {undefined} undefined
     */
    value: function drawBuffers(vertexBuffers, mode, id) {
      var gl = this.gl;
      var length = 0;
      var attribute;
      var location;
      var spacing;
      var offset;
      var buffer;
      var iter;
      var j;
      var i;

      iter = vertexBuffers.keys.length;
      for (i = 0; i < iter; i++) {
        attribute = vertexBuffers.keys[i];

        // Do not set vertexAttribPointer if index buffer.

        if (attribute === 'indices') {
          j = i;continue;
        }

        // Retreive the attribute location and make sure it is enabled.

        location = this.program.attributeLocations[attribute];

        if (location === -1) continue;
        if (location === undefined) {
          location = gl.getAttribLocation(this.program.program, attribute);
          this.program.attributeLocations[attribute] = location;
          if (location === -1) continue;
        }

        if (!this.state.enabledAttributes[attribute]) {
          gl.enableVertexAttribArray(location);
          this.state.enabledAttributes[attribute] = true;
          this.state.enabledAttributesKeys.push(attribute);
        }

        // Retreive buffer information used to set attribute pointer.

        buffer = vertexBuffers.values[i];
        spacing = vertexBuffers.spacing[i];
        offset = vertexBuffers.offset[i];
        length = vertexBuffers.length[i];

        // Skip bindBuffer if buffer is currently bound.

        if (this.state.boundArrayBuffer !== buffer) {
          gl.bindBuffer(buffer.target, buffer.buffer);
          this.state.boundArrayBuffer = buffer;
        }

        if (this.state.lastDrawn !== id) {
          gl.vertexAttribPointer(location, spacing, gl.FLOAT, gl.FALSE, 0, 4 * offset);
        }
      }

      // Disable any attributes that not currently being used.

      var len = this.state.enabledAttributesKeys.length;
      for (i = 0; i < len; i++) {
        var key = this.state.enabledAttributesKeys[i];
        if (this.state.enabledAttributes[key] && vertexBuffers.keys.indexOf(key) === -1) {
          gl.disableVertexAttribArray(this.program.attributeLocations[key]);
          this.state.enabledAttributes[key] = false;
        }
      }

      if (length) {

        // If index buffer, use drawElements.

        if (j !== undefined) {
          buffer = vertexBuffers.values[j];
          offset = vertexBuffers.offset[j];
          spacing = vertexBuffers.spacing[j];
          length = vertexBuffers.length[j];

          // Skip bindBuffer if buffer is currently bound.

          if (this.state.boundElementBuffer !== buffer) {
            gl.bindBuffer(buffer.target, buffer.buffer);
            this.state.boundElementBuffer = buffer;
          }

          gl.drawElements(gl[mode], length, gl.UNSIGNED_SHORT, 2 * offset);
        } else {
          gl.drawArrays(gl[mode], 0, length);
        }
      }

      this.state.lastDrawn = id;
    }
  }, {
    key: 'updateSize',

    /**
     * Updates the width and height of parent canvas, sets the viewport size on
     * the WebGL context and updates the resolution uniform for the shader program.
     * Size is retreived from the container object of the renderer.
     *
     * @method
     *
     * @param {Array} size width, height and depth of canvas
     *
     * @return {undefined} undefined
     */
    value: function updateSize(size) {
      if (size) {
        var pixelRatio = window.devicePixelRatio || 1;
        var displayWidth = ~ ~(size[0] * pixelRatio);
        var displayHeight = ~ ~(size[1] * pixelRatio);
        this.canvas.width = displayWidth;
        this.canvas.height = displayHeight;
        this.gl.viewport(0, 0, displayWidth, displayHeight);

        this.cachedSize[0] = size[0];
        this.cachedSize[1] = size[1];
        this.cachedSize[2] = size[0] > size[1] ? size[0] : size[1];
        this.resolutionValues[0] = this.cachedSize;
      }

      this.program.setUniforms(this.resolutionName, this.resolutionValues);

      return this;
    }
  }, {
    key: 'handleOptions',

    /**
     * Updates the state of the WebGL drawing context based on custom parameters
     * defined on a mesh.
     *
     * @method
     *
     * @param {Object} options Draw state options to be set to the context.
     * @param {Mesh} mesh Associated Mesh
     *
     * @return {undefined} undefined
     */
    value: function handleOptions(options, mesh) {
      var gl = this.gl;
      if (!options) return;

      if (options.blending) gl.enable(gl.BLEND);

      switch (options.side) {
        case 'double':
          this.gl.cullFace(this.gl.FRONT);
          this.drawBuffers(this.bufferRegistry.registry[mesh.geometry], mesh.drawType, mesh.geometry);
          this.gl.cullFace(this.gl.BACK);
          break;
        case 'back':
          gl.cullFace(gl.FRONT);
          break;
      }
    }
  }, {
    key: 'resetOptions',

    /**
     * Resets the state of the WebGL drawing context to default values.
     *
     * @method
     *
     * @param {Object} options Draw state options to be set to the context.
     *
     * @return {undefined} undefined
     */
    value: function resetOptions(options) {
      var gl = this.gl;
      if (!options) return;
      if (options.blending) gl.disable(gl.BLEND);
      if (options.side === 'back') gl.cullFace(gl.BACK);
    }
  }]);

  return WebGLRenderer;
})();

exports.WebGLRenderer = WebGLRenderer;

},{"../utilities/Registry":55,"../utilities/keyValueToArrays":57,"./BufferRegistry":77,"./Program":79,"./TextureManager":81,"./compileMaterial":83,"./radixSort":85}],83:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var types = {
  1: 'float ',
  2: 'vec2 ',
  3: 'vec3 ',
  4: 'vec4 '
};

/**
 * Traverses material to create a string of glsl code to be applied in
 * the vertex or fragment shader.
 *
 * @method
 *
 * @param {Object} material Material to be compiled.
 * @param {Number} textureSlot Next available texture slot for Mesh.
 *
 * @return {undefined} undefined
 */
function compileMaterial(material, textureSlot) {
  var glsl = '';
  var uniforms = {};
  var varyings = {};
  var attributes = {};
  var defines = [];
  var textures = [];

  material.traverse(function (node, depth) {
    if (!node.chunk) return;

    var type = types[_getOutputLength(node)];
    var label = _makeLabel(node);
    var output = _processGLSL(node.chunk.glsl, node.inputs, textures.length + textureSlot);

    glsl += type + label + ' = ' + output + '\n ';

    if (node.uniforms) _extend(uniforms, node.uniforms);
    if (node.varyings) _extend(varyings, node.varyings);
    if (node.attributes) _extend(attributes, node.attributes);
    if (node.chunk.defines) defines.push(node.chunk.defines);
    if (node.texture) textures.push(node.texture);
  });

  return {
    _id: material._id,
    glsl: glsl + 'return ' + _makeLabel(material) + ';',
    defines: defines.join('\n'),
    uniforms: uniforms,
    varyings: varyings,
    attributes: attributes,
    textures: textures
  };
}

// Helper function used to infer length of the output
// from a given material node.
function _getOutputLength(node) {

  // Handle constant values

  if (typeof node === 'number') return 1;
  if (Array.isArray(node)) return node.length;

  // Handle materials

  var output = node.chunk.output;
  if (typeof output === 'number') return output;

  // Handle polymorphic output

  var key = node.inputs.map(function recurse(node) {
    return _getOutputLength(node);
  }).join(',');

  return output[key];
}

// Helper function to run replace inputs and texture tags with
// correct glsl.
function _processGLSL(str, inputs, textureSlot) {
  return str.replace(/%\d/g, function (s) {
    return _makeLabel(inputs[s[1] - 1]);
  }).replace(/\$TEXTURE/, 'u_textures[' + textureSlot + ']');
}

// Helper function used to create glsl definition of the
// input material node.
function _makeLabel(n) {
  if (Array.isArray(n)) return _arrayToVec(n);
  if (typeof n === 'object') return 'fa_' + n._id;else return n.toFixed(6);
}

// Helper to copy the properties of an object onto another object.
function _extend(a, b) {
  for (var k in b) a[k] = b[k];
}

// Helper to create glsl vector representation of a javascript array.
function _arrayToVec(array) {
  var len = array.length;
  return 'vec' + len + '(' + array.join(',') + ')';
}

exports.compileMaterial = compileMaterial;

},{}],84:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * Generates a checkerboard pattern to be used as a placeholder texture while
 * an image loads over the network.
 *
 * @method  createCheckerBoard
 *
 * @return {HTMLCanvasElement} The `canvas` element that has been used in order
 *                             to generate the pattern.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
function createCheckerBoard() {
  var context = document.createElement('canvas').getContext('2d');
  context.canvas.width = context.canvas.height = 128;
  for (var y = 0; y < context.canvas.height; y += 16) {
    for (var x = 0; x < context.canvas.width; x += 16) {
      context.fillStyle = (x ^ y) & 16 ? '#FFF' : '#DDD';
      context.fillRect(x, y, 16, 16);
    }
  }

  return context.canvas;
}

exports.createCheckerBoard = createCheckerBoard;

},{}],85:[function(require,module,exports){
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var radixBits = 11,
    maxRadix = 1 << radixBits,
    radixMask = maxRadix - 1,
    buckets = new Array(maxRadix * Math.ceil(64 / radixBits)),
    msbMask = 1 << (32 - 1) % radixBits,
    lastMask = (msbMask << 1) - 1,
    passCount = 32 / radixBits + 0.999999999999999 | 0,
    maxOffset = maxRadix * (passCount - 1),
    normalizer = Math.pow(20, 6);

var buffer = new ArrayBuffer(4);
var floatView = new Float32Array(buffer, 0, 1);
var intView = new Int32Array(buffer, 0, 1);

// comparator pulls relevant sorting keys out of mesh
function comp(list, registry, i) {
  var key = list[i];
  var item = registry[key];
  return (item.depth ? item.depth : registry[key].uniformValues[1][14]) + normalizer;
}

//mutator function records mesh's place in previous pass
function mutator(list, registry, i, value) {
  var key = list[i];
  registry[key].depth = intToFloat(value) - normalizer;
  return key;
}

//clean function removes mutator function's record
function clean(list, registry, i) {
  registry[list[i]].depth = null;
}

//converts a javascript float to a 32bit integer using an array buffer
//of size one
function floatToInt(k) {
  floatView[0] = k;
  return intView[0];
}
//converts a 32 bit integer to a regular javascript float using an array buffer
//of size one
function intToFloat(k) {
  intView[0] = k;
  return floatView[0];
}

/**
 * Sorts an array of mesh IDs according to their z-depth.
 *
 * @param  {Array} list         An array of meshes.
 * @param  {Object} registry    A registry mapping the path names to meshes.
 * @return {Array}              An array of the meshes sorted by z-depth.
 */
function radixSort(list, registry) {
  var pass = 0;
  var out = [];

  var i, j, k, n, div, offset, swap, id, sum, tsum, size;

  passCount = 32 / radixBits + 0.999999999999999 | 0;

  for (i = 0, n = maxRadix * passCount; i < n; i++) buckets[i] = 0;

  for (i = 0, n = list.length; i < n; i++) {
    div = floatToInt(comp(list, registry, i));
    div ^= div >> 31 | 0x80000000;
    for (j = 0, k = 0; j < maxOffset; j += maxRadix, k += radixBits) {
      buckets[j + (div >>> k & radixMask)]++;
    }
    buckets[j + (div >>> k & lastMask)]++;
  }

  for (j = 0; j <= maxOffset; j += maxRadix) {
    for (id = j, sum = 0; id < j + maxRadix; id++) {
      tsum = buckets[id] + sum;
      buckets[id] = sum - 1;
      sum = tsum;
    }
  }
  if (--passCount) {
    for (i = 0, n = list.length; i < n; i++) {
      div = floatToInt(comp(list, registry, i));
      out[++buckets[div & radixMask]] = mutator(list, registry, i, div ^= div >> 31 | 0x80000000);
    }

    swap = out;
    out = list;
    list = swap;
    while (++pass < passCount) {
      for (i = 0, n = list.length, offset = pass * maxRadix, size = pass * radixBits; i < n; i++) {
        div = floatToInt(comp(list, registry, i));
        out[++buckets[offset + (div >>> size & radixMask)]] = list[i];
      }

      swap = out;
      out = list;
      list = swap;
    }
  }

  for (i = 0, n = list.length, offset = pass * maxRadix, size = pass * radixBits; i < n; i++) {
    div = floatToInt(comp(list, registry, i));
    out[++buckets[offset + (div >>> size & lastMask)]] = mutator(list, registry, i, div ^ (~div >> 31 | 0x80000000));
    clean(list, registry, i);
  }

  return out;
}

exports.radixSort = radixSort;

},{}],86:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var webglShaders = {
  "vertex": "#define GLSLIFY 1\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Calculates transpose inverse matrix from transform\r\n * \r\n * @method random\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n\r\nmat3 getNormalMatrix_1_0(in mat4 t) {\r\n   mat3 matNorm;\r\n   mat4 a = t;\r\n\r\n   float a00 = a[0][0], a01 = a[0][1], a02 = a[0][2], a03 = a[0][3],\r\n   a10 = a[1][0], a11 = a[1][1], a12 = a[1][2], a13 = a[1][3],\r\n   a20 = a[2][0], a21 = a[2][1], a22 = a[2][2], a23 = a[2][3],\r\n   a30 = a[3][0], a31 = a[3][1], a32 = a[3][2], a33 = a[3][3],\r\n   b00 = a00 * a11 - a01 * a10,\r\n   b01 = a00 * a12 - a02 * a10,\r\n   b02 = a00 * a13 - a03 * a10,\r\n   b03 = a01 * a12 - a02 * a11,\r\n   b04 = a01 * a13 - a03 * a11,\r\n   b05 = a02 * a13 - a03 * a12,\r\n   b06 = a20 * a31 - a21 * a30,\r\n   b07 = a20 * a32 - a22 * a30,\r\n   b08 = a20 * a33 - a23 * a30,\r\n   b09 = a21 * a32 - a22 * a31,\r\n   b10 = a21 * a33 - a23 * a31,\r\n   b11 = a22 * a33 - a23 * a32,\r\n\r\n   det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\r\n   det = 1.0 / det;\r\n\r\n   matNorm[0][0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;\r\n   matNorm[0][1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;\r\n   matNorm[0][2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;\r\n\r\n   matNorm[1][0] = (a02 * b10 - a01 * b11 - a03 * b09) * det;\r\n   matNorm[1][1] = (a00 * b11 - a02 * b08 + a03 * b07) * det;\r\n   matNorm[1][2] = (a01 * b08 - a00 * b10 - a03 * b06) * det;\r\n\r\n   matNorm[2][0] = (a31 * b05 - a32 * b04 + a33 * b03) * det;\r\n   matNorm[2][1] = (a32 * b02 - a30 * b05 - a33 * b01) * det;\r\n   matNorm[2][2] = (a30 * b04 - a31 * b02 + a33 * b00) * det;\r\n\r\n   return matNorm;\r\n}\r\n\r\n\n\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Calculates a matrix that creates the identity when multiplied by m\r\n * \r\n * @method inverse\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n\r\nfloat inverse_2_1(float m) {\r\n    return 1.0 / m;\r\n}\r\n\r\nmat2 inverse_2_1(mat2 m) {\r\n    return mat2(m[1][1],-m[0][1],\r\n               -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);\r\n}\r\n\r\nmat3 inverse_2_1(mat3 m) {\r\n    float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\r\n    float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\r\n    float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\r\n\r\n    float b01 =  a22 * a11 - a12 * a21;\r\n    float b11 = -a22 * a10 + a12 * a20;\r\n    float b21 =  a21 * a10 - a11 * a20;\r\n\r\n    float det = a00 * b01 + a01 * b11 + a02 * b21;\r\n\r\n    return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),\r\n                b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),\r\n                b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\r\n}\r\n\r\nmat4 inverse_2_1(mat4 m) {\r\n    float\r\n        a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\r\n        a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\r\n        a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\r\n        a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\r\n\r\n        b00 = a00 * a11 - a01 * a10,\r\n        b01 = a00 * a12 - a02 * a10,\r\n        b02 = a00 * a13 - a03 * a10,\r\n        b03 = a01 * a12 - a02 * a11,\r\n        b04 = a01 * a13 - a03 * a11,\r\n        b05 = a02 * a13 - a03 * a12,\r\n        b06 = a20 * a31 - a21 * a30,\r\n        b07 = a20 * a32 - a22 * a30,\r\n        b08 = a20 * a33 - a23 * a30,\r\n        b09 = a21 * a32 - a22 * a31,\r\n        b10 = a21 * a33 - a23 * a31,\r\n        b11 = a22 * a33 - a23 * a32,\r\n\r\n        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\r\n\r\n    return mat4(\r\n        a11 * b11 - a12 * b10 + a13 * b09,\r\n        a02 * b10 - a01 * b11 - a03 * b09,\r\n        a31 * b05 - a32 * b04 + a33 * b03,\r\n        a22 * b04 - a21 * b05 - a23 * b03,\r\n        a12 * b08 - a10 * b11 - a13 * b07,\r\n        a00 * b11 - a02 * b08 + a03 * b07,\r\n        a32 * b02 - a30 * b05 - a33 * b01,\r\n        a20 * b05 - a22 * b02 + a23 * b01,\r\n        a10 * b10 - a11 * b08 + a13 * b06,\r\n        a01 * b08 - a00 * b10 - a03 * b06,\r\n        a30 * b04 - a31 * b02 + a33 * b00,\r\n        a21 * b02 - a20 * b04 - a23 * b00,\r\n        a11 * b07 - a10 * b09 - a12 * b06,\r\n        a00 * b09 - a01 * b07 + a02 * b06,\r\n        a31 * b01 - a30 * b03 - a32 * b00,\r\n        a20 * b03 - a21 * b01 + a22 * b00) / det;\r\n}\r\n\r\n\n\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Reflects a matrix over its main diagonal.\r\n * \r\n * @method transpose\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n\r\nfloat transpose_3_2(float m) {\r\n    return m;\r\n}\r\n\r\nmat2 transpose_3_2(mat2 m) {\r\n    return mat2(m[0][0], m[1][0],\r\n                m[0][1], m[1][1]);\r\n}\r\n\r\nmat3 transpose_3_2(mat3 m) {\r\n    return mat3(m[0][0], m[1][0], m[2][0],\r\n                m[0][1], m[1][1], m[2][1],\r\n                m[0][2], m[1][2], m[2][2]);\r\n}\r\n\r\nmat4 transpose_3_2(mat4 m) {\r\n    return mat4(m[0][0], m[1][0], m[2][0], m[3][0],\r\n                m[0][1], m[1][1], m[2][1], m[3][1],\r\n                m[0][2], m[1][2], m[2][2], m[3][2],\r\n                m[0][3], m[1][3], m[2][3], m[3][3]);\r\n}\r\n\r\n\n\n\r\n/**\r\n * Converts vertex from modelspace to screenspace using transform\r\n * information from context.\r\n *\r\n * @method applyTransform\r\n * @private\r\n *\r\n *\r\n */\r\n\r\nvec4 applyTransform(vec4 pos) {\r\n    //TODO: move this multiplication to application code. \r\n\r\n    /**\r\n     * Currently multiplied in the vertex shader to avoid consuming the complexity of holding an additional\r\n     * transform as state on the mesh object in WebGLRenderer. Multiplies the object's transformation from object space\r\n     * to world space with its transformation from world space to eye space.\r\n     */\r\n    mat4 MVMatrix = u_view * u_transform;\r\n\r\n    //TODO: move the origin, sizeScale and y axis inversion to application code in order to amortize redundant per-vertex calculations.\r\n\r\n    /**\r\n     * The transform uniform should be changed to the result of the transformation chain:\r\n     *\r\n     * view * modelTransform * invertYAxis * sizeScale * origin\r\n     *\r\n     * which could be simplified to:\r\n     *\r\n     * view * modelTransform * convertToDOMSpace\r\n     *\r\n     * where convertToDOMSpace represents the transform matrix:\r\n     *\r\n     *                           size.x 0       0       size.x \r\n     *                           0      -size.y 0       size.y\r\n     *                           0      0       1       0\r\n     *                           0      0       0       1\r\n     *\r\n     */\r\n\r\n    /**\r\n     * Assuming a unit volume, moves the object space origin [0, 0, 0] to the \"top left\" [1, -1, 0], the DOM space origin.\r\n     * Later in the transformation chain, the projection transform negates the rigidbody translation.\r\n     * Equivalent to (but much faster than) multiplying a translation matrix \"origin\"\r\n     *\r\n     *                           1 0 0 1 \r\n     *                           0 1 0 -1\r\n     *                           0 0 1 0\r\n     *                           0 0 0 1\r\n     *\r\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\r\n     */\r\n    pos.x += 1.0;\r\n    pos.y -= 1.0;\r\n\r\n    /**\r\n     * Assuming a unit volume, scales an object to the amount of pixels in the size uniform vector's specified dimensions.\r\n     * Later in the transformation chain, the projection transform transforms the point into clip space by scaling\r\n     * by the inverse of the canvas' resolution.\r\n     * Equivalent to (but much faster than) multiplying a scale matrix \"sizeScale\"\r\n     *\r\n     *                           size.x 0      0      0 \r\n     *                           0      size.y 0      0\r\n     *                           0      0      size.z 0\r\n     *                           0      0      0      1\r\n     *\r\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\r\n     */\r\n    pos.xyz *= u_size * 0.5;\r\n\r\n    /**\r\n     * Inverts the object space's y axis in order to match DOM space conventions. \r\n     * Later in the transformation chain, the projection transform reinverts the y axis to convert to clip space.\r\n     * Equivalent to (but much faster than) multiplying a scale matrix \"invertYAxis\"\r\n     *\r\n     *                           1 0 0 0 \r\n     *                           0 -1 0 0\r\n     *                           0 0 1 0\r\n     *                           0 0 0 1\r\n     *\r\n     * in the transform chain: projection * view * modelTransform * invertYAxis * sizeScale * origin * positionVector.\r\n     */\r\n    pos.y *= -1.0;\r\n\r\n    /**\r\n     * Exporting the vertex's position as a varying, in DOM space, to be used for lighting calculations. This has to be in DOM space\r\n     * since light position and direction is derived from the scene graph, calculated in DOM space.\r\n     */\r\n\r\n    v_position = (MVMatrix * pos).xyz;\r\n\r\n    /**\r\n    * Exporting the eye vector (a vector from the center of the screen) as a varying, to be used for lighting calculations.\r\n    * In clip space deriving the eye vector is a matter of simply taking the inverse of the position, as the position is a vector\r\n    * from the center of the screen. However, since our points are represented in DOM space,\r\n    * the position is a vector from the top left corner of the screen, so some additional math is needed (specifically, subtracting\r\n    * the position from the center of the screen, i.e. half the resolution of the canvas).\r\n    */\r\n\r\n    v_eyeVector = (u_resolution * 0.5) - v_position;\r\n\r\n    /**\r\n     * Transforming the position (currently represented in dom space) into view space (with our dom space view transform)\r\n     * and then projecting the point into raster both by applying a perspective transformation and converting to clip space\r\n     * (the perspective matrix is a combination of both transformations, therefore it's probably more apt to refer to it as a\r\n     * projection transform).\r\n     */\r\n\r\n    pos = u_perspective * MVMatrix * pos;\r\n\r\n    return pos;\r\n}\r\n\r\n/**\r\n * Placeholder for positionOffset chunks to be templated in.\r\n * Used for mesh deformation.\r\n *\r\n * @method calculateOffset\r\n * @private\r\n *\r\n *\r\n */\r\n#vert_definitions\r\nvec3 calculateOffset(vec3 ID) {\r\n    #vert_applications\r\n    return vec3(0.0);\r\n}\r\n\r\n/**\r\n * Writes the position of the vertex onto the screen.\r\n * Passes texture coordinate and normal attributes as varyings\r\n * and passes the position attribute through position pipeline.\r\n *\r\n * @method main\r\n * @private\r\n *\r\n *\r\n */\r\nvoid main() {\r\n    v_textureCoordinate = a_texCoord;\r\n    vec3 invertedNormals = a_normals + (u_normals.x < 0.0 ? calculateOffset(u_normals) * 2.0 - 1.0 : vec3(0.0));\r\n    invertedNormals.y *= -1.0;\r\n    v_normal = transpose_3_2(mat3(inverse_2_1(u_transform))) * invertedNormals;\r\n    vec3 offsetPos = a_pos + calculateOffset(u_positionOffset);\r\n    gl_Position = applyTransform(vec4(offsetPos, 1.0));\r\n}\r\n",
  "fragment": "#define GLSLIFY 1\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Placeholder for fragmentShader  chunks to be templated in.\r\n * Used for normal mapping, gloss mapping and colors.\r\n * \r\n * @method applyMaterial\r\n * @private\r\n *\r\n *\r\n */\r\n\r\n#float_definitions\r\nfloat applyMaterial_1_0(float ID) {\r\n    #float_applications\r\n    return 1.;\r\n}\r\n\r\n#vec3_definitions\r\nvec3 applyMaterial_1_0(vec3 ID) {\r\n    #vec3_applications\r\n    return vec3(0);\r\n}\r\n\r\n#vec4_definitions\r\nvec4 applyMaterial_1_0(vec4 ID) {\r\n    #vec4_applications\r\n\r\n    return vec4(0);\r\n}\r\n\r\n\n\n/**\r\n * The MIT License (MIT)\r\n * \r\n * Copyright (c) 2015 Famous Industries Inc.\r\n * \r\n * Permission is hereby granted, free of charge, to any person obtaining a copy\r\n * of this software and associated documentation files (the \"Software\"), to deal\r\n * in the Software without restriction, including without limitation the rights\r\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\n * copies of the Software, and to permit persons to whom the Software is\r\n * furnished to do so, subject to the following conditions:\r\n * \r\n * The above copyright notice and this permission notice shall be included in\r\n * all copies or substantial portions of the Software.\r\n * \r\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\n * THE SOFTWARE.\r\n */\r\n\r\n/**\r\n * Calculates the intensity of light on a surface.\r\n *\r\n * @method applyLight\r\n * @private\r\n *\r\n */\r\nvec4 applyLight_2_1(in vec4 baseColor, in vec3 normal, in vec4 glossiness, int numLights, vec3 ambientColor, vec3 eyeVector, mat4 lightPosition, mat4 lightColor, vec3 v_position) {\r\n    vec3 diffuse = vec3(0.0);\r\n    bool hasGlossiness = glossiness.a > 0.0;\r\n    bool hasSpecularColor = length(glossiness.rgb) > 0.0;\r\n\r\n    for(int i = 0; i < 4; i++) {\r\n        if (i >= numLights) break;\r\n        vec3 lightDirection = normalize(lightPosition[i].xyz - v_position);\r\n        float lambertian = max(dot(lightDirection, normal), 0.0);\r\n\r\n        if (lambertian > 0.0) {\r\n            diffuse += lightColor[i].rgb * baseColor.rgb * lambertian;\r\n            if (hasGlossiness) {\r\n                vec3 halfVector = normalize(lightDirection + eyeVector);\r\n                float specularWeight = pow(max(dot(halfVector, normal), 0.0), glossiness.a);\r\n                vec3 specularColor = hasSpecularColor ? glossiness.rgb : lightColor[i].rgb;\r\n                diffuse += specularColor * specularWeight * lambertian;\r\n            }\r\n        }\r\n\r\n    }\r\n\r\n    return vec4(ambientColor + diffuse, baseColor.a);\r\n}\r\n\r\n\n\n\r\n\r\n/**\r\n * Writes the color of the pixel onto the screen\r\n *\r\n * @method main\r\n * @private\r\n *\r\n *\r\n */\r\nvoid main() {\r\n    vec4 material = u_baseColor.r >= 0.0 ? u_baseColor : applyMaterial_1_0(u_baseColor);\r\n\r\n    /**\r\n     * Apply lights only if flat shading is false\r\n     * and at least one light is added to the scene\r\n     */\r\n    bool lightsEnabled = (u_flatShading == 0.0) && (u_numLights > 0.0 || length(u_ambientLight) > 0.0);\r\n\r\n    vec3 normal = normalize(v_normal);\r\n    vec4 glossiness = u_glossiness.x < 0.0 ? applyMaterial_1_0(u_glossiness) : u_glossiness;\r\n\r\n    vec4 color = lightsEnabled ?\r\n    applyLight_2_1(material, normalize(v_normal), glossiness,\r\n               int(u_numLights),\r\n               u_ambientLight * u_baseColor.rgb,\r\n               normalize(v_eyeVector),\r\n               u_lightPosition,\r\n               u_lightColor,   \r\n               v_position)\r\n    : material;\r\n\r\n    gl_FragColor = color;\r\n    gl_FragColor.a *= u_opacity;   \r\n}\r\n"
};
exports.webglShaders = webglShaders;

},{}],87:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var _infamousEngineSrcCoreFamousEngine = require('infamous-engine/src/core/FamousEngine');

var _jsModulesHome = require('./js/modules/Home');

var _jsModulesHome2 = _interopRequireDefault(_jsModulesHome);

// Boilerplate code to make your life easier
_infamousEngineSrcCoreFamousEngine.FamousEngine.init();

// Create a scene for the FamousEngine to render
var scene = _infamousEngineSrcCoreFamousEngine.FamousEngine.createScene();
var nextNode = scene.addChild();

// Get a node of the Famous Logo
var home = new _jsModulesHome2['default'](nextNode);
console.log('home', home);

},{"./js/modules/Home":88,"infamous-engine/src/core/FamousEngine":9}],88:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) {
  var _again = true;_function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;desc = parent = getter = undefined;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);if (parent === null) {
        return undefined;
      } else {
        _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
      }
    } else if ('value' in desc) {
      return desc.value;
    } else {
      var getter = desc.get;if (getter === undefined) {
        return undefined;
      }return getter.call(receiver);
    }
  }
};

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var _infamousEngineSrcWebglRenderablesLightsPointLight = require('infamous-engine/src/webgl-renderables/lights/PointLight');

var _infamousEngineSrcCoreFamousEngine = require('infamous-engine/src/core/FamousEngine');

var _infamousEngineSrcComponentsCamera = require('infamous-engine/src/components/Camera');

var _infamousEngineSrcUtilitiesColor = require('infamous-engine/src/utilities/Color');

var _infamousEngineSrcTransitionsTransitionable = require('infamous-engine/src/transitions/Transitionable');

var _infamousEngineSrcMathVec3 = require('infamous-engine/src/math/Vec3');

var _infamousEngineSrcDomRenderablesDOMElement = require('infamous-engine/src/dom-renderables/DOMElement');

var _infamousEngineSrcPhysicsPhysicsEngine = require('infamous-engine/src/physics/PhysicsEngine');

var _infamousEngineSrcComponentsMountPoint = require('infamous-engine/src/components/MountPoint');

var _infamousEngineSrcPhysicsBodiesSphere = require('infamous-engine/src/physics/bodies/Sphere');

var _infamousEngineSrcWebglRenderablesMesh = require('infamous-engine/src/webgl-renderables/Mesh');

var _infamousEngineSrcCoreNode = require('infamous-engine/src/core/Node');

var ExplodingTriangles = (function () {
  function ExplodingTriangles(rootNode, amount) {
    _classCallCheck(this, ExplodingTriangles);

    this.rootNode = rootNode;
    this.nodes = {};
    this.children = amount;
    this.simulation = new _infamousEngineSrcPhysicsPhysicsEngine.PhysicsEngine();
    this.tDuration = 2000;

    var self = this;

    this.graphNode = this.rootNode.addChild();

    this.graphNode.addComponent({
      id: null,
      node: null,
      onMount: function onMount(node) {
        this.id = node.addComponent(this);
        node.requestUpdate(this.id);
        this.scalar = 72;
        this.node = node;
      },
      onUpdate: function onUpdate(time) {

        var spherePosition;

        if (self.nodes) {

          for (var prop in self.nodes) {

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

  _createClass(ExplodingTriangles, [{
    key: 'createGraph',
    value: function createGraph(row, col) {
      var self = this;
      var node, elem, sphere, top, left, z, color, line, lineNode, hoverColor, rotate, lastId;

      for (var x = 0; x < col; x++) {
        for (var y = 0; y < row; y++) {

          left = x * (1.25 / col) - 0.1;
          top = y * (1.25 / row) - 0.1;
          z = Math.random() * 0.25 + 0.1;
          rotate = {
            x: Math.random() * 360,
            y: Math.random() * 360,
            z: Math.random() * 360
          };

          node = this.rootNode.addChild().setOrigin(0.5, 0.5, 0.5).setMountPoint(0.5, 0.5, 0.5).setAlign(left, top, z).setSizeMode(1, 1, 1).setRotation(rotate.x, rotate.y, rotate.z).setAbsoluteSize(100, 100).setOpacity(z);
          sphere = new _infamousEngineSrcPhysicsBodiesSphere.Sphere({
            mass: 50,
            radius: 100,
            position: new _infamousEngineSrcMathVec3.Vec3(left, top)
          });
          color = 'rgba(' + (255 - Math.floor(Math.random() * 255) + 190) + ',' + (255 - Math.floor(Math.random() * 255) + 150) + ',' + (255 - Math.floor(Math.random() * 255) + 150) + ',' + (z - 0.2) + ')';

          elem = new _infamousEngineSrcDomRenderablesDOMElement.DOMElement(node, {
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

          node.onReceive = function (event, payload) {

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

          this.nodes[node._id] = {
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
              transform: new _infamousEngineSrcTransitionsTransitionable.Transitionable([-3.0, 0, 0]),
              opacity: new _infamousEngineSrcTransitionsTransitionable.Transitionable(0.0)
            }
          };

          this.nodes[node._id].t.opacity.from(0.0).to(self.nodes[node._id].opacity, 'outCubic', 1600);
          this.nodes[node._id].t.transform.from([-3.0, 0.5, 0.5]).to([self.nodes[node._id].position.x, self.nodes[node._id].position.y, self.nodes[node._id].position.z], 'outExpo', this.tDuration);

          this.nodes[node._id].sphere.setVelocity(4, 0);
          this.simulation.addBody(this.nodes[node._id].sphere);
          lastId = node._id;
        }
      }
    }
  }]);

  return ExplodingTriangles;
})();

var _Home = (function () {
  function _Home(rootNode) {
    _classCallCheck(this, _Home);

    this.items = [];

    this.rootNode = rootNode;

    this.cameraNode = this.rootNode.addChild();

    this.camera = new _infamousEngineSrcComponentsCamera.Camera(this.cameraNode).setDepth(1000);

    // Save reference to our Famous clock
    this.clock = _infamousEngineSrcCoreFamousEngine.FamousEngine.getClock();
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
    this.title.node = this.rootNode.addChild().setOrigin(0.5, 0.5, 0.5).setMountPoint(0.5, 0.5, 0.5).setAlign(0.5, 0.5, -5.0).setSizeMode(0, 0, 0).setProportionalSize(0.5, 0.2);
    this.title.elem = new _infamousEngineSrcDomRenderablesDOMElement.DOMElement(this.title.node, {
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

    this.title.t.fade = new _infamousEngineSrcTransitionsTransitionable.Transitionable(0.0);
    this.title.t.fade.from(0.0).to(1.0, 'inQuad', 1200);

    this.title.t.transformIn = new _infamousEngineSrcTransitionsTransitionable.Transitionable([0.5, 0.5, -0.6]);
    this.title.t.transformIn.from([0.5, 0.5, -5.0]).to([0.5, 0.4, 0.5], 'outQuad', 1200);

    // Create the footer

    this.footer = {};

    this.footer.node = this.rootNode.addChild().setOrigin(0.0, 1.0, 0.0).setMountPoint(0.0, 1.0, 0.0).setAlign(0.0, 2.0, 0.0).setSizeMode(0, 1).setAbsoluteSize(window.innerWidth, 40).setProportionalSize(1.0, 40).setOpacity(1.0);

    this.footer.engineButton = {};
    this.footer.engineButton.node = this.footer.node.addChild().setOrigin(0.0, 0.0, 0.0).setMountPoint(0.0, 0.0, 0.0).setAlign(0.0, 0.0, 0.0).setSizeMode(0, 0).setProportionalSize(0.5, 1.0).setOpacity(0.8);

    this.footer.engineButton.node.addUIEvent('mouseover');
    this.footer.engineButton.node.addUIEvent('mouseleave');

    this.footer.engineButton.node.onReceive = function (event, payload) {
      if (event === 'mouseover') {
        this.setOpacity(1.0);
      }
      if (event === 'mouseleave') {
        this.setOpacity(0.8);
      }
    };

    this.footer.engineButton.elem = new _infamousEngineSrcDomRenderablesDOMElement.DOMElement(this.footer.engineButton.node, {
      classes: ['footer-link']
    });
    this.footer.engineButton.elem.setProperty('background-color', 'rgba(2,2,2,1.0)');
    this.footer.engineButton.elem.setProperty('user-select', 'none');
    this.footer.engineButton.elem.setProperty('-webkit-user-select', 'none');
    this.footer.engineButton.elem.setProperty('-ms-user-select', 'none');
    this.footer.engineButton.elem.setProperty('-moz-user-select', 'none');
    this.footer.engineButton.elem.setContent('<a href="https://github.com/infamous/engine">Engine</a>');

    this.footer.frameworkButton = {};
    this.footer.frameworkButton.node = this.footer.node.addChild().setOrigin(0.0, 0.0, 0.0).setMountPoint(0.0, 0.0, 0.0).setAlign(0.5, 0.0, 0.0).setSizeMode(0, 0).setProportionalSize(0.5, 1.0).setOpacity(0.8);
    this.footer.frameworkButton.elem = new _infamousEngineSrcDomRenderablesDOMElement.DOMElement(this.footer.frameworkButton.node, {
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

    this.footer.frameworkButton.node.onReceive = function (event, payload) {
      if (event === 'mouseover') {
        this.setOpacity(1.0);
      }
      if (event === 'mouseleave') {
        this.setOpacity(0.8);
      }
    };

    // Create the transitionable for the footer

    this.footer.t = new _infamousEngineSrcTransitionsTransitionable.Transitionable([0, 2.0, 0]);
    this.footer.t.from([0, 2.0, 0]).to([0, 1.0, 0], 'linear', 2000);

    //Request an update from the Engine.

    _infamousEngineSrcCoreFamousEngine.FamousEngine.requestUpdateOnNextTick(this);
  }

  _createClass(_Home, [{
    key: 'onUpdate',
    value: function onUpdate(time) {
      this.title.node.setOpacity(this.title.t.fade.get());
      this.title.node.setAlign(this.title.t.transformIn.get()[0], this.title.t.transformIn.get()[1], this.title.t.transformIn.get()[2]);
      //this.header.node.setAlign(this.header.t.get()[0], this.header.t.get()[1], this.header.t.get()[2]);
      this.footer.node.setAlign(this.footer.t.get()[0], this.footer.t.get()[1], this.footer.t.get()[2]);
      _infamousEngineSrcCoreFamousEngine.FamousEngine.requestUpdateOnNextTick(this);
    }
  }]);

  return _Home;
})();

var Home = (function (_Node) {
  _inherits(Home, _Node);

  function Home(node) {
    _classCallCheck(this, Home);

    _get(Object.getPrototypeOf(Home.prototype), 'constructor', this).call(this);

    this.rootNode = node.addChild();
    var bootstrap = new _Home(this.rootNode);
    var web = new ExplodingTriangles(this.rootNode, 128);

    return this.rootNode;
  }

  return Home;
})(_infamousEngineSrcCoreNode.Node);

exports['default'] = Home;
module.exports = exports['default'];

},{"infamous-engine/src/components/Camera":1,"infamous-engine/src/components/MountPoint":2,"infamous-engine/src/core/FamousEngine":9,"infamous-engine/src/core/Node":10,"infamous-engine/src/dom-renderables/DOMElement":20,"infamous-engine/src/math/Vec3":38,"infamous-engine/src/physics/PhysicsEngine":39,"infamous-engine/src/physics/bodies/Sphere":41,"infamous-engine/src/transitions/Transitionable":52,"infamous-engine/src/utilities/Color":54,"infamous-engine/src/webgl-renderables/Mesh":73,"infamous-engine/src/webgl-renderables/lights/PointLight":75}]},{},[87]);
