# lru-generator


[![SCM](https://nahidakbar.github.io/lru-generator/coverage/public.svg)](https://github.com/nahidakbar/lru-generator)
[![Build Status](https://travis-ci.org/nahidakbar/lru-generator.svg?branch=master)](https://travis-ci.org/nahidakbar/lru-generator)
[![Documentation](https://nahidakbar.github.io/lru-generator/badge.svg)](https://nahidakbar.github.io/lru-generator/)
[![Coverage](https://nahidakbar.github.io/lru-generator/coverage/lines.svg)](https://nahidakbar.github.io/lru-generator/coverage/)
[![Coverage](https://nahidakbar.github.io/lru-generator/coverage/functions.svg)](https://nahidakbar.github.io/lru-generator/coverage/)
[![Coverage](https://nahidakbar.github.io/lru-generator/coverage/branches.svg)](https://nahidakbar.github.io/lru-generator/coverage/)
[![Coverage](https://nahidakbar.github.io/lru-generator/coverage/statements.svg)](https://nahidakbar.github.io/lru-generator/coverage/)

Least Recently Used Cache using generator.

## TL;DR

```
// sync

var generate_callback = function(key) {...} ; // something expensive to generate
var limit = 2; // say we are only caching 2 items
var generate = require('lru-generator')(limit, generate_callback)
...
generate(key1); // calls generate_callback(key1)
generate(key2); // calls generate_callback(key2)
generate(key3); // calls generate_callback(key3)
generate(key2); // returns previous results which is still in cache
generate(key1); // calls generate_callback(key1) as it is no longer in cache

// misc

generate.isCached(key);

generate.getCached(key);

generate.cache(key, value);

generate.purge(key, value);

```

## Complexity

Whatever complexity your JS engine has for accessing object properties.

## Asynchronous

I was going to write async functionality but then I realised that it
is not really needed for modern asynchronous programming.
You can just have a an async generator function or can just return
a promise from generator function.
This will allow you to await or .then the return value.
There is no need to add yet another level of indirection.

Current generate.async is more for you if you want old style callbacks for
generator function and want to be called back with generated value.
This is deprecated. Just keep things simple by using modern async/await.

```
// async

var generate_callback = function(key, callback) { ... callback(value) ... }; //
var generate = require('lru-generator')(limit, generate_callback, {async: true});

generate.sync(key, [custom_generate_callback]);

generate.async(key, callback, [custom_generate_callback]);

// generate(...) has the same signature as generate.sync or generate.async based on setting

```
