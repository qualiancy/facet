/*!
 * Facet
 * Copyright(c) 2012-2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/**
 * ### facet (object[, options])
 *
 * This mixin provides a way to store arbitray key/value
 * pairs on a constructor or object. Furthermore, it provides
 * a number of helper methods to retrieve the stored values.
 *
 * Begin by applying the mixin to a constructor or object.
 *
 * ```js
 * // on a constructor
 * facet(MyConstructor.prototype);
 *
 * // on an object
 * var obj = {};
 * facet(obj);
 * ```
 *
 * Facet will default to creating and using the `.settings`
 * property on the constructor or object to store the
 * key/value pairs. If you would like to use something else
 * you may specify a different property key.
 *
 * ```js
 * facet(MyConstructor, 'options');
 * ```
 *
 * Facet can also emit events anytime a setting has changed
 * by assuming the constructor that was extended has an `emit`
 * method that conforms to node.js standards. The event emitted
 * will equal the name of the storage property. This is **disabled**
 * by default.
 *
 * ```js
 * facet(MyConstructor, true);
 * // facet(MyConstructor, 'options', true);
 *
 * var obj = new MyConstructor();
 *
 * // obj.on('options', ...
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

module.exports = function (proto, opts) {
  // handle second argument
  if ('string' === typeof opts) {
    opts = { store: opts };
  } else if ('function' === typeof opts) {
    opts = { handle: opts };
  } else {
    opts = opts || {};
  }

  // fill in the blanks
  if (!opts.store) opts.store = 'settings';
  if (!opts.handle) opts.handle = function () {};

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

  proto.set = (function (opts) {
    var handle = opts.handle
      , prop = opts.store;

    return function (key, value) {
      var settings = this[prop] || (this[prop] = {});

      if (1 === arguments.length) {
        if ('string' === typeof key) {
          return settings[key];
        } else {
          for (var name in key) {
            this.set(name, key[name]);
          }
        }
      } else {
        settings[key] = value;
        handle.call(this, key, value);
      }

      return this;
    };
  })(opts);

  /**
   * #### .get (key)
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
   * #### .enable (key)
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
   * #### .disable (key)
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
   * #### .enabled (key)
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
   * #### .disabled (key)
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
