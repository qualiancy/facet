/*!
 * Facet - Easy Prototype Configuration
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * .init (constructor)
 *
 * Invoked from inside the constructor function,
 * `init` will ensure that the constructor is
 * prepared for all the facet methods.
 *
 *     function MyConstructor () {
 *       facet.init(this);
 *     }
 *
 * @param {Context} this
 * @name init
 * @api public
 */

exports.init = function (obj) {
  obj.settings = {};
};

/**
 * .bind (prototype)
 *
 * Bind all of the facet methods to the object
 * or prototype.
 *
 *     facet.bind(MyConstructor);
 *
 * @param {Function|Object} object to bind methods to
 * @name bind
 * @api public
 */

exports.bind = function (obj) {
  var proto = 'function' === typeof obj
    ? obj.prototype
    : obj;

  /**
   * .set (key[, value])
   *
   * Modify a key/value pair of settings, or use
   * an object to modify many settings at once.
   *
   * @param {String|Object} key or object
   * @param {Mixed} value
   * @name set
   * @api public
   */

  proto.set = function (key, value) {
    var settings = this.settings || (this.settings = {});
    if (1 === arguments.length) {
      for (var name in key) {
        settings[name] = key[name];
      }
    } else {
      settings[key] = value;
    }

    return this;
  };

  /**
   * .get (key)
   *
   * Return the value of a stored setting.
   *
   * @param {String} key
   * @name get
   * @api public
   */

  proto.get = function (key) {
    var settings = this.settings || (this.settings = {});
    return settings[key];
  };

  /**
   * .enable (key)
   *
   * Mark a setting key as "enabled" (true).
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
   * Confirm that a given key is enabled (true).
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
   * Confirm that a setting key is disabled (false).
   *
   * @param {String} key
   * @name disabled
   * @api public
   */

  proto.disabled = function (key) {
    return ! this.get(key);
  };
};
