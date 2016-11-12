(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    global.Helper = factory();
  }
})(this, function () {
  var Helper = {

    test: true

  };

  return Helper;
});
