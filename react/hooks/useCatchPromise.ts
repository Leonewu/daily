/*
  const [value1, error1] = await wrap(fetch1());
  const [value2, error2] = await wrap(fetch2());
*/
export default function(p) {
  return new Promise(async (resolve, reject) => {
    let value;
    let error;
    try {
      value = await p; 
      return [value, error];
    } catch (e) {
      error = e;
      return [value, error];
    }
  })
}
