/**
 * @file LRU cached generator utility.
 * 
 * @author Nahid Akbar
 * @year 2016
 * @copyright National ICT Australia (NICTA). All rights reserved.
 */

"use strict";

function print(t)
{
  while (t !== undefined)
  {
    console.log('item', t.key,
                t.prev? 'prev' : '', t.prev ? t.prev.key : '',
                t.next? 'next' : '', t.next ? t.next.key : '');
    t = t.next;
  }
}

function generator(limit, global_generate)
{
  limit = Math.max(1, limit);
  var index = {};
  var top = {next: null, key: 'top'};
  var bottom = {prev: top, key: 'bottom'};
  top.next = bottom;
  var count = 0;
  return function(key, local_generate)
  {
    if (index[key] !== undefined)
    {
      var i = index[key],
          n = i.next,
          p = i.prev;
      if (i.key !== top.next.key)
      {
        p.next = n;
        n.prev = p;
        top.next.prev = i;
        i.next = top.next;
        top.next = i;
      }
    }
    else
    {
      var n = index[key] = {next: top.next, prev: top, item: (local_generate || global_generate)(key), key: key};
      top.next.prev = n;
      top.next = n;
      if (++count > limit)
      {
        var i = bottom.prev;
        i.prev.next = i.next;
        bottom.prev = i.prev;
        delete index[i.key];
        count--;
      }
    }
    return top.next.item;
  };
}
 

module.exports = generator;
