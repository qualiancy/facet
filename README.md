# facet

> Configuration mixin for constructors.

## Installation

### Node.js

`facet` is available on [npm](http://npmjs.org).

    $ npm install facet

### Component

`facet` is available as a [component](https://github.com/component/component).

    $ component install qualiancy/facet

## Usage

### facet (object[, property])

* **@param** _{Object}_ Constructor or Object
* **@param** _{String}_ Object property to use as storage _(optional)_
* **@param** _{Boolean}_ Emit `settings` events. _(optional)_

This mixin provides a way to store arbitray key/value
pairs on a constructor or object. Furthermore, it provides
a number of helper methods to retrieve the stored values.

Begin by applying the mixin to a constructor or object.

```js
var facet = require('facet');

// on a constructor (prototype)
facet(MyConstructor);

// on an object
var obj = {};
facet(obj);
```

Facet will default to creating and using the `.settings`
property on the constructor or object to store the
key/value pairs. If you would like to use something else
you may specify a different property key.

```js
facet(MyConstructor, 'options');
```

Facet can also emit events anytime a setting has changed
by assuming the constructor that was extended has an `emit`
method that conforms to node.js standards. The event emitted
will equal the name of the storage property. This is **disabled**
by default.

```js
facet(MyConstructor, true);
// facet(MyConstructor, 'options', true);

var obj = new MyConstructor();

// obj.on('options', ...
obj.on('settings', function (key, value) {
  console.log(key + ' was set to: ', value);
});

obj.set('hello', 'universe');
// "hello was set to: universe"
```


Once an object is extended,
you may use any of the following methods.



#### .set (key[, value])

* **@param** _{String|Object}_ key or object
* **@param** _{Mixed}_ value 

Modify a key/value pair of settings, or use
an object to modify many settings at once.

```js
obj.set('hello', 'universe');
obj.set({ hello: 'universe', say: 'loudly' });
```


#### .get (key)

* **@param** _{String}_ key 

Return the value of a stored setting.

```js
obj.get('hello').should.equal('universe');
```


#### .enable (key)

* **@param** _{String}_ key 

Mark a setting key as "enabled" (true).

```js
obj.enable('loudly');
```


#### .disable (key)

* **@param** _{String}_ key 

Mark a setting key as "disabled" (false)

```js
obj.disable('whisper');
```


#### .enabled (key)

* **@param** _{String}_ key 

Confirm that a given key is enabled (=== true).
Settings that do not exist will return `false`.

```js
obj.enabled('loudly').should.be.true;
obj.enabled('whisper').should.be.false;
obj.enabled('scream').should.be.false;
```


#### .disabled (key)

* **@param** _{String}_ key 

Confirm that a setting key is disabled (=== false).
Settings that do not exists will return `true`.

```js
obj.disabled('loudly').should.be.false;
obj.disabled('whisper').should.be.true;
obj.disabled('scream').should.be.true;
```



## License

(The MIT License)

Copyright (c) 2012 Jake Luer <jake@qualiancy.com> (http://qualiancy.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
