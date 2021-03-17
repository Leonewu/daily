const test1 = function() {
  console.log('cjs-test1');
  if (min >= max) return false
  return min + Math.floor(Math.random() * (max - min))
}

const test2 = function() {
  console.log('cjs-test2');
  if (min >= max) return false
  return min + Math.floor(Math.random() * (max - min))
}

module.exports = {
  test1, test2
}