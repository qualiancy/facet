/*!
 * Sample constructor
 */

function Obj () {
  // lolz
}

/*!
 * Bind facet helper methods
 */

facet(Obj.prototype);

/*!
 * Check for all mixin methods
 */

function checkMethods (obj) {
  obj.should.respondTo('set');
  obj.should.respondTo('get');
  obj.should.respondTo('enable');
  obj.should.respondTo('disable');
  obj.should.respondTo('enabled');
  obj.should.respondTo('disabled');
}

/*!
 * Tests
 */

describe('facet(obj)', function () {
  it('should mixin prototypes', function () {
    var obj = new Obj();
    checkMethods(obj);
  });

  it('should mixin objects', function () {
    var obj = {};
    facet(obj);
    checkMethods(obj);
  });

  it('should use \'settings\' as its property for storage', function () {
    var obj = new Obj();
    obj.set('hello', 'universe');
    obj.should.have.property('settings')
      .and.have.property('hello', 'universe');
  });
});

describe('facet(obj, \'options\')', function () {
  it('should use \'options\' as its property for storage', function () {
    function Opts () {};
    facet(Opts.prototype, 'options');
    var opts = new Opts();
    opts.set('hello', 'universe');
    opts.should.not.have.property('settings');
    opts.should.have.property('options')
      .and.have.property('hello', 'universe');
  });
});

describe('facet(obj, handle)', function () {
  it('should invoke function for each set', function () {
    function Opts () {};

    var handle = chai.spy('handle', function (key, value) {
      this.should.be.instanceof(Opts);
      checkMethods(this);
      this.should.have.property('settings');
      key.should.equal('key');
      value.should.equal('value');
    });

    facet(Opts.prototype, handle);

    var opts = new Opts();
    opts.set('key', 'value');
    handle.should.have.been.called.once;
    opts.get('key').should.equal('value');
    handle.should.have.been.called.once;
  });
});

describe('.set(key, value)', function () {
  it('should modify a setting', function () {
    var obj = new Obj();
    obj.set('hello', 'universe');
    obj.get('hello').should.equal('universe');
  });
});

describe('.set(obj)', function () {
  it('should modify multiple settings', function () {
    var obj = new Obj();
    obj.set({ hello: 'universe', say: 'hello' });
    obj.get('hello').should.equal('universe');
    obj.get('say').should.equal('hello');
  });
});

describe('.get(key)', function () {
  it('should return an existing value', function () {
    var obj = new Obj();
    obj.set('hello', 'universe');
    obj.get('hello').should.equal('universe');
  });

  it('should return undefined for values that do not exist', function () {
    var obj = new Obj();
    should.equal(obj.get('nullll'), undefined);
  });
});

describe('.enable(key)', function () {
  it('should set a value to true', function () {
    var obj = new Obj();
    obj.enable('hello');
    obj.get('hello').should.be.true;
  });
});

describe('.enabled(key)', function () {
  var obj = new Obj();
  obj.enable('hello');
  obj.disable('blah');

  it('should return true when a value is true', function () {
    obj.enabled('hello').should.be.true;
  });

  it('should return false when a value is false', function () {
    obj.enabled('blah').should.be.false;
  });

  it('should return false for non-existent values', function () {
    obj.enabled('noop').should.be.false;
  });
});

describe('.disable(key)', function () {
  it('should set a value to false', function () {
    var obj = new Obj();
    obj.disable('hello');
    obj.get('hello').should.be.false;
  });
});

describe('.disabled(key)', function () {
  var obj = new Obj();
  obj.enable('hello');
  obj.disable('blah');

  it('should return true when a value is false', function () {
    obj.disabled('blah').should.be.true;
  });

  it('should return true when a value does not exist', function () {
    obj.disabled('noop').should.be.true;
  });

  it('should return false when a value true', function () {
    obj.disabled('hello').should.be.false;
  });
});
