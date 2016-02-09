# lru-generator

Least Recently Used Cache using generator.


## TL;DR

```
var generation_function = function(key) {...} ; // something expensive to generate
var limit = 2; // say we are only caching 2 items
var generate = require('lru-generator')(limit, generation_function)
...
generate(key1); // calls generation_function(key1)
generate(key2); // calls generation_function(key2)
generate(key3); // calls generation_function(key3)
generate(key2); // returns previous results which is still in cache
generate(key1); // calls generation_function(key1) as it is no longer in cache

```

## Complexity

Whatever complexity your JS engine has for accessing object properties.
