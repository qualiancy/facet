
/*!
 * Sample constructor
 */

function Obj () {
  facet.init(this);
}

/*!
 * Bind facet helper methods
 */

facet.bind(Obj);

describe('facet', function () {

  describe('construction', function () {

    function checkMethods (obj) {
      obj.should.have.property('settings')
        .an('object');
      obj.should.respondTo('set');
      obj.should.respondTo('get');
      obj.should.respondTo('enable');
      obj.should.respondTo('disable');
      obj.should.respondTo('enabled');
      obj.should.respondTo('disabled');
    }

    it('works with prototypes', function () {
      var obj = new Obj();
      checkMethods(obj);
    });

    it('works with objects', function () {
      var obj = {};
      facet.init(obj);
      facet.bind(obj);
      checkMethods(obj);
    });

  });

  describe('configuration', function () {

    it('can set (key/value)', function () {
      var obj = new Obj();
      obj.set('hello', 'universe');
      obj.settings.should.have.property('hello', 'universe');
    });

    it('can set (object)', function () {
      var obj = new Obj();
      obj.set({
          hello: 'universe'
        , say: 'hello'
      });

      obj.settings.should.have.property('hello', 'universe');
      obj.settings.should.have.property('say', 'hello');
    });

    it('can get', function () {
      var obj = new Obj();
      obj.settings.hello = 'universe';
      obj.get('hello').should.equal('universe');
    });

    it('can enable', function () {
      var obj = new Obj();
      obj.enable('hello');
      obj.settings.should.have.property('hello', true);
    });

    it('can disable', function () {
      var obj = new Obj();
      obj.disable('hello');
      obj.settings.should.have.property('hello', false);
    });

    it('can check enabled', function () {
      var obj = new Obj();
      obj.settings.hello = true;
      obj.settings.blah = false;

      obj.enabled('hello').should.be.true;
      obj.enabled('blah').should.be.false;
      obj.enabled('noop').should.be.false;
    });

    it('can check disabled', function () {
      var obj = new Obj();
      obj.settings.hello = true;
      obj.settings.blah = false;

      obj.disabled('hello').should.be.false;
      obj.disabled('blah').should.be.true;
      obj.disabled('noop').should.be.true;
    });

  });

});
