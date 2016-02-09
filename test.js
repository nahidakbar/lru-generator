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

console.log('done');
