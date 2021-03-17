const test1 = function() {
  console.log('esm-export-default-test1');
  if (min >= max) return false
  return min + Math.floor(Math.random() * (max - min))
}

const test2 = function() {
  console.log('esm-export-default-test2');
  if (min >= max) return false
  return min + Math.floor(Math.random() * (max - min))
}

export default {
  test1, test2
}