module.exports = function if_eq (a, b, options) {
  if(a == b) {
    return options.fn(this);
  }
  return options.inverse(this);
};