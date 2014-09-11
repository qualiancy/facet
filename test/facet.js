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

describe('facet(obj)', function() {
  it('can mixin prototypes', function() {
    var obj = new Obj();
    checkMethods(obj);
  });

  it('can mixin objects', function() {
    var obj = {};
    facet(obj);
    checkMethods(obj);
  });

  it('can use \'settings\' as its property for storage', function() {
    var obj = new Obj();
    obj.set('hello', 'universe');
    obj.should.have.property('settings')
      .and.have.property('hello', 'universe');
  });
});

describe('facet(obj, \'options\')', function() {
  it('can use \'options\' as its property for storage', function() {
    function Opts () {};
    facet(Opts.prototype, 'options');
    var opts = new Opts();
    opts.set('hello', 'universe');
    opts.should.not.have.property('settings');
    opts.should.have.property('options')
      .and.have.property('hello', 'universe');
  });
});

describe('facet(obj, handle)', function() {
  it('can invoke function for each set', function() {
    function Opts () {};

    var handle = chai.spy('handle', function(key, value) {
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

describe('.set(key, value)', function() {
  it('can modify a setting', function() {
    var obj = new Obj();
    obj.set('hello', 'universe');
    obj.get('hello').should.equal('universe');
  });

  it('can modify a deep setting', function() {
    var obj = new Obj();
    obj.set('hello.universe', 'foo');
    obj.get('hello').should.deep.equal({ universe: 'foo' });
  });

  it('throws on invalid merge scenario', function() {
    var obj = new Obj();
    obj.set('hello.universe', 'foo');
    (function() {
      obj.set('hello', [ 'foo' ]);
    }).should.throw(/merge scenario/);
  });
});

describe('.set(obj)', function() {
  it('can modify multiple settings', function() {
    var obj = new Obj();
    obj.set({ hello: 'universe', say: 'hello' });
    obj.get('hello').should.equal('universe');
    obj.get('say').should.equal('hello');
  });

  it('can deeply merge settings', function() {
    var obj = new Obj();
    obj.set({ foo: { bar: { hello: 'universe' }}});
    obj.set({ foo: { baz: { hello: 'universe' }}});
    obj.get('foo').should.deep.equal({
      bar: { hello: 'universe' },
      baz: { hello: 'universe' }
    });
  });

  it('can forcefully replace settings', function() {
    var obj = new Obj();
    obj.set({ foo: { bar: { hello: 'universe' }}});
    obj.set({ fun: { bar: { hello: 'world' }}}, true);
    should.not.exist(obj.get('foo'));
    obj.get('fun').should.deep.equal({ bar: { hello: 'world' }});
  });
});

describe('.get(key)', function() {
  it('returns an existing value', function() {
    var obj = new Obj();
    obj.set('hello', 'universe');
    obj.get('hello').should.equal('universe');
  });

  it('returns undefined for values that do not exist', function() {
    var obj = new Obj();
    should.equal(obj.get('nullll'), undefined);
  });

  it('return an existing value at a deep path', function() {
    var obj = new Obj();
    obj.set({ foo: { bar: [ 'hello', 'universe' ] }});
    obj.get('foo.bar[1]').should.equal('universe');
  });
});

describe('.enable(key)', function() {
  it('can set a value to true', function() {
    var obj = new Obj();
    obj.enable('hello');
    obj.get('hello').should.be.true;
  });
});

describe('.enabled(key)', function() {
  var obj = new Obj();
  obj.enable('hello');
  obj.disable('blah');

  it('returns true when a value is true', function() {
    obj.enabled('hello').should.be.true;
  });

  it('returns false when a value is false', function() {
    obj.enabled('blah').should.be.false;
  });

  it('returns false for non-existent values', function() {
    obj.enabled('noop').should.be.false;
  });
});

describe('.disable(key)', function() {
  it('can set a value to false', function() {
    var obj = new Obj();
    obj.disable('hello');
    obj.get('hello').should.be.false;
  });
});

describe('.disabled(key)', function() {
  var obj = new Obj();
  obj.enable('hello');
  obj.disable('blah');

  it('returns true when a value is false', function() {
    obj.disabled('blah').should.be.true;
  });

  it('returns true when a value does not exist', function() {
    obj.disabled('noop').should.be.true;
  });

  it('returns false when a value true', function() {
    obj.disabled('hello').should.be.false;
  });
});
