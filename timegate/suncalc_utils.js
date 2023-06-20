const suncalc = require('suncalc');

const specialTimes = new Map([
  ["sunrise", -100],
  ["sunriseend", -101],
  ["goldenhour", -102],
  ["goldenhourend", -103],
  ["sunset", -104],
  ["sunsetstart", -105],
  ["solarnoon", -106],
  ["dusk", -107],
  ["nauticaldusk", -108],
  ["night", -109],
  ["nightend", -110],
  ["nadir", -111],
  ["dawn", -112],
  ["nauticaldawn", -113]
]);

module.exports = {

  isSunCalcKeyword: function(item) {    
    return specialTimes.has(item);
  },

  getSunCalcKeywordId: function(item) {    
    return specialTimes.get(item);
  },
}