/**
 * @file LRU cached generator utility.
 * 
 * @author Nahid Akbar
 * @year 2016
 * @copyright National ICT Australia (NICTA). All rights reserved.
 */

"use strict";


function generator(limit, global_generate)
{
  var index = {};
  var top = null;
  var bottom = null;
  var count = 0;
  return function(key, local_generate)
  {
    if (top === null)
    {
      bottom = top = index[key] = {next: null, prev: null, item: (local_generate || global_generate)(key), key: key};
    }
    else
    {
      if (index[key])
      {
        var i = index[key],
            n = i.next,
            p = i.prev;
        if (i.key !== top.key)
        {
          if (p !== null)
          {
            p.next = n;
            if (p.prev === null)
            {
              p.prev = i;
            }
          }
          else
          {
            top = i;
          }
          if (n != null)
          {
            n.prev = p;
          }
          else
          {
            bottom = p;
          }
          top.prev = i;
          i.prev = null;
          i.next = top;
          top = i;
        }
      }
      else
      {
        var ot = top;
        top = index[key] = {next: top, prev: null, item: (local_generate || global_generate)(key), key: key};
        ot.prev = top;
        if (++count > limit)
        {
          delete index[bottom.key];
          bottom = bottom.prev;
          bottom.next = null;
          count--;
        }
      }
    }
    /*
    console.log('key', key);
    var t = top;
    console.log('top', top.key);
    while (t != null)
    {
      console.log('item', t.key, 'prev', t.prev && t.prev.key, 'next', t.next && t.next.key);
      t = t.next;
    }
    console.log('bottom', bottom.key);
    */
    return top.item;
  };
}
 

module.exports = generator;
