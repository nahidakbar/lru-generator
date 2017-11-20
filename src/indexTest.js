"use strict";

const generator = require('./')
const assert = require('assert')

describe('synchrnous', function ()
{
  let instance;

  beforeEach(function ()
  {
    let count = 0;
    instance = generator(2, () => count++);
  });

  it('cache size', function ()
  {
    assert.equal(instance('a'), 0)
    assert.equal(instance('a'), 0)
  });

  it('cache size', function ()
  {
    assert.equal(instance('a'), 0)
    assert.equal(instance('b'), 1)
    assert.equal(instance('a'), 0)
  });

  it('cache size overflow', function ()
  {
    assert.equal(instance('a'), 0)
    assert.equal(instance('b'), 1)
    assert.equal(instance('c'), 2)
    assert.equal(instance('a'), 3)
  });

  it('custom generator', function ()
  {
    assert.equal(instance('a'), 0)
    assert.equal(instance('a', () => 5), 0)
    assert.equal(instance('b', () => 5), 5)
  });

  it('purge', function ()
  {
    assert.equal(instance('a'), 0)
    instance.purge('a')
    assert.equal(instance('a'), 1)
  });

  it('cached', function ()
  {
    assert.equal(instance.isCached('b'), false)
    assert.equal(instance.getCached('b'), undefined)
    assert.equal(instance('a'), 0)
    assert.equal(instance.getCached('b'), undefined)
    assert.equal(instance.getCached('a'), 0)
    assert.equal(instance.isCached('a'), true)
  })

  it('cache', function ()
  {
    instance.cache('b', 0)
    assert.equal(instance.getCached('b'), 0)
    assert.equal(instance('a'), 0)
  })

  it('error', function ()
  {
    assert.throws(() =>
    {
      instance('a', () =>
      {
        throw new Error('xxx')
      });
    })
  })

  it('error', function ()
  {
    assert.throws(() =>
    {
      instance('a', () =>
      {
        throw new Error('xxx')
      });
    })
  })
})

describe('asynchrnous', function ()
{
  let instance;

  beforeEach(function ()
  {
    let count = 0;
    instance = generator(2, (x, cb) => cb(count++), {
      async: true
    });
  });

  it('cache size', function (done)
  {
    instance('a', v => assert.equal(v, 0))
    instance('a', v => assert.equal(v, 0))
    instance('b', v =>
    {
      assert.equal(v, 1);
      done();
    })
  });
})

describe('stress', function ()
{
  it('test', function ()
  {
    for (var limit = 1; limit < 10; limit++)
    {
      for (var step = 1; step < 10; step++)
      {
        var generator = require('.')(limit, i => i * i);
        for (var x = 0; x < 1000; x++)
        {
          var input = Math.floor(Math.random() * step);
          (input * input == generator(input)) || console.error(input, generator(input));
        }
      }
    }
  })
})
