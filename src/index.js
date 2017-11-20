/**
 * @file LRU cached generator utility.
 *
 * @author Nahid Akbar
 * @year 2016
 * @copyright National ICT Australia (NICTA). All rights reserved.
 */

"use strict";
//
// function print(t)
// {
//   while (t !== undefined)
//   {
//     console.log('item', t.key,
//       t.prev ? 'prev' : '', t.prev ? t.prev.key : '',
//       t.next ? 'next' : '', t.next ? t.next.key : '');
//     t = t.next;
//   }
// }

function generator(limit, global_generate, options)
{
  options = options || {};

  limit = Math.max(1, limit);
  var index = {};
  var top = {
    next: null,
    key: 'top'
  };
  var bottom = {
    prev: top,
    key: 'bottom'
  };
  top.next = bottom;
  var count = 0;

  function isCached(key)
  {
    return index[key] !== undefined;
  }

  function getCached(key)
  {
    var i = index[key];
    if (i !== undefined)
    {
      var n = i.next,
        p = i.prev;
      if (i.key !== top.next.key)
      {
        p.next = n;
        n.prev = p;
        top.next.prev = i;
        i.next = top.next;
        top.next = i;
      }
      return top.next.item;
    }
  }

  function cache(key, value)
  {
    var n = index[key] = {
      next: top.next,
      prev: top,
      item: value,
      key: key
    };
    top.next.prev = n;
    top.next = n;
    if (++count > limit)
    {
      var i = bottom.prev;
      i.prev.next = i.next;
      i.next.prev = i.prev;
      delete index[i.key];
      count--;
    }
  }

  function purge(key)
  {
    var i = index[key];
    if (i !== undefined)
    {
      i.prev.next = i.next;
      i.next.prev = i.prev
      delete index[key];
      count--;
    }
  }

  function sync_generate(key, local_generate)
  {
    if (index[key] !== undefined)
    {
      return getCached(key);
    }
    else
    {
      var value = (local_generate || global_generate)(key);
      cache(key, value);
      return value;
    }
  }

  function async_generate(key, callback, local_generate)
  {
    if (index[key] !== undefined)
    {
      callback(getCached(key));
    }
    else
    {
      (local_generate || global_generate)(key, function (value)
      {
        cache(key, value);
        callback(value);
      });
    }
  }

  var result = options.async ? async_generate : sync_generate;
  result.sync = sync_generate;
  result.async = async_generate;
  result.cache = cache;
  result.purge = purge;
  result.isCached = isCached;
  result.getCached = getCached;
  return result;
}

module.exports = generator;
