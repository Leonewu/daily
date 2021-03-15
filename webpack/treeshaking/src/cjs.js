const test1 = function() {
  console.log('esm-export-test1');
  if (min >= max) return false
  return min + Math.floor(Math.random() * (max - min))
}

const test2 = function() {
  console.log('esm-export-test2');
  if (min >= max) return false
  return min + Math.floor(Math.random() * (max - min))
}

module.exports = {
  test1, test2
}