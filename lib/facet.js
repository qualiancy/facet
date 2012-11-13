/**
 * ### facet (object[, property])
 *
 * This mixin provides
 *
 * ```js
 * // on a constructor (prototype)
 * facet(MyConstructor);
 *
 * // on an object
 * var obj = {};
 * facet(obj);
 * ```
 *
 * Facet will default to creating and using `.settings`
 * property on the constructor or object to store the
 * key/value pairs. If you would like to use something else
 * you may specify a different property key.
 *
 * ```js
 * facet(MyConstructor, '_options');
 * ```
 *
 * Facet can also emit events anytime a setting has changed
 * by assuming the constructor that was extended has an `emit`
 * method that conforms to node.js standards. The event emitted
 * will equal the name of the storage property. This is disabled
 * by default.
 *
 * ```js
 * facet(MyConstructor, true);
 *
 * var obj = new MyConstructor();
 *
 * obj.on('settings', function (key, value) {
 *   console.log(key + ' was set to: ', value);
 * });
 *
 * obj.set('hello', 'universe');
 * // "hello was set to: universe"
 * ```
 *
 * @param {Object} Constructor or Object
 * @param {String} Object property to use as storage  _(optional)_
 * @param {Boolean} Emit `settings` events. _(optional)_
 */

module.exports = function (obj, prop, events) {
  if ('string' !== typeof prop) events = prop, prop = 'settings';
  var proto = 'function' === typeof obj
    ? obj.prototype
    : obj;

  /**
   * Once an object is extended,
   * you may use any of the following methods.
   */

  /**
   * #### .set (key[, value])
   *
   * Modify a key/value pair of settings, or use
   * an object to modify many settings at once.
   *
   * ```js
   * obj.set('hello', 'universe');
   * obj.set({ hello: 'universe', say: 'loudly' });
   * ```
   *
   * @param {String|Object} key or object
   * @param {Mixed} value
   * @name set
   * @api public
   */

  proto.set = (function (prop, events) {
    events = 'boolean' === typeof events ? events: false;
    var emit = function () {};

    if (events) {
      emit = function (obj, key, value) {
        obj.emit(prop, key, value);
      };
    }

    return function (key, value) {
      var settings = this[prop] || (this[prop] = {});

      if (1 === arguments.length) {
        if ('string' === typeof key) {
          return settings[key];
        } else {
          for (var name in key) {
            settings[name] = key[name];
            emit(this, name, key[name]);
          }
        }
      } else {
        settings[key] = value;
        emit(this, key, value);
      }

      return this;
    };
  })(prop, events);

  /**
   * .get (key)
   *
   * Return the value of a stored setting.
   *
   * ```js
   * obj.get('hello').should.equal('universe');
   * ```
   *
   * @param {String} key
   * @name get
   * @api public
   */

  proto.get = function (key) {
    return this.set(key);
  };

  /**
   * .enable (key)
   *
   * Mark a setting key as "enabled" (true).
   *
   * ```js
   * obj.enable('loudly');
   * ```
   *
   * @param {String} key
   * @name enable
   * @api public
   */

  proto.enable = function (key) {
    return this.set(key, true);
  };

  /**
   * .disable (key)
   *
   * Mark a setting key as "disabled" (false)
   *
   * ```js
   * obj.disable('whisper');
   * ```
   *
   * @param {String} key
   * @name disable
   * @api public
   */

  proto.disable = function (key) {
    return this.set(key, false);
  };

  /**
   * .enabled (key)
   *
   * Confirm that a given key is enabled (=== true).
   * Settings that do not exist will return `false`.
   *
   * ```js
   * obj.enabled('loudly').should.be.true;
   * obj.enabled('whisper').should.be.false;
   * obj.enabled('scream').should.be.false;
   * ```
   *
   * @param {String} key
   * @name enabled
   * @api public
   */

  proto.enabled = function (key) {
    return !! this.get(key);
  };

  /**
   * .disabled (key)
   *
   * Confirm that a setting key is disabled (=== false).
   * Settings that do not exists will return `true`.
   *
   * ```js
   * obj.disabled('loudly').should.be.false;
   * obj.disabled('whisper').should.be.true;
   * obj.disabled('scream').should.be.true;
   * ```
   *
   * @param {String} key
   * @name disabled
   * @api public
   */

  proto.disabled = function (key) {
    return !!! this.get(key);
  };
};
