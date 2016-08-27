# lru-generator

Least Recently Used Cache using generator.


## TL;DR

```
var generate_callback = function(key) {...} ; // something expensive to generate
var limit = 2; // say we are only caching 2 items
var generate = require('lru-generator')(limit, generate_callback)
...
generate(key1); // calls generate_callback(key1)
generate(key2); // calls generate_callback(key2)
generate(key3); // calls generate_callback(key3)
generate(key2); // returns previous results which is still in cache
generate(key1); // calls generate_callback(key1) as it is no longer in cache


// async

var generate_callback = function(key, callback) { ... callback(value) ... }; //
var generate = require('lru-generator')(limit, generate_callback, {async: true});


// misc

generate.sync(key, [custom_generate_callback]);

generate.async(key, callback, [custom_generate_callback]);

// generate(...) has the same signature as generate.sync or generate.async based on setting

generate.isCached(key);

generate.getCached(key);

generate.cache(key, value);

generate.purge(key, value);

```

## Complexity

Whatever complexity your JS engine has for accessing object properties.
