const SunCalc = require('suncalc');

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
  ["nauticaldawn", -113],
  ["moonrise", -114],
  ["moonset", -115]
]);

module.exports = {

  isSunCalcKeyword: function(item) {    
    return specialTimes.has(item);
  },

  getSunCalcKeywordId: function(item) {    
    return specialTimes.get(item);
  },

  calcTimes: function(date, lat, lon) {
    var times = SunCalc.getTimes(date, lat, lon);
    var moons = SunCalc.getMoonTimes(date, lat, lon);

    var ret = new Map();
    ret.set(specialTimes.get("sunrise"), times.sunrise.getHours() * 60 + times.sunrise.getMinutes());
    ret.set(specialTimes.get("sunriseend"), times.sunriseEnd.getHours() * 60 + times.sunriseEnd.getMinutes());
    ret.set(specialTimes.get("goldenhour"), times.goldenHour.getHours() * 60 + times.goldenHour.getMinutes());
    ret.set(specialTimes.get("goldenhourend"), times.goldenHourEnd.getHours() * 60 + times.goldenHourEnd.getMinutes());
    ret.set(specialTimes.get("sunset"), times.sunset.getHours() * 60 + times.sunset.getMinutes());
    ret.set(specialTimes.get("sunsetstart"), times.sunsetStart.getHours() * 60 + times.sunsetStart.getMinutes());
    ret.set(specialTimes.get("solarnoon"), times.solarNoon.getHours() * 60 + times.solarNoon.getMinutes());
    ret.set(specialTimes.get("dusk"), times.dusk.getHours() * 60 + times.dusk.getMinutes());
    ret.set(specialTimes.get("nauticaldusk"), times.nauticalDusk.getHours() * 60 + times.nauticalDusk.getMinutes());
    ret.set(specialTimes.get("night"), times.night.getHours() * 60 + times.night.getMinutes());
    ret.set(specialTimes.get("nightend"), times.nightEnd.getHours() * 60 + times.nightEnd.getMinutes());
    ret.set(specialTimes.get("nadir"), times.nadir.getHours() * 60 + times.nadir.getMinutes());
    ret.set(specialTimes.get("dawn"), times.dawn.getHours() * 60 + times.dawn.getMinutes());
    ret.set(specialTimes.get("nauticaldawn"), times.nauticalDawn.getHours() * 60 + times.nauticalDawn.getMinutes());

    ret.set(specialTimes.get("moonrise"), moons.rise.getHours() * 60 + moons.rise.getMinutes());
    ret.set(specialTimes.get("moonset"), moons.set.getHours() * 60 + moons.set.getMinutes());

    return ret;
  },

  calcTimeStrings: function(date, lat, lon) {
    var times = SunCalc.getTimes(date, lat, lon);
    var moons = SunCalc.getMoonTimes(date, lat, lon);

    var ret = new Map();
    ret.set("sunrise", formatTime(times.sunrise.getHours()) + ":" +formatTime(times.sunrise.getMinutes()));
    ret.set("sunriseend", formatTime(times.sunriseEnd.getHours()) + ":" +formatTime(times.sunriseEnd.getMinutes()));
    ret.set("goldenhour", formatTime(times.goldenHour.getHours()) + ":" +formatTime(times.goldenHour.getMinutes()));
    ret.set("goldenhourend", formatTime(times.goldenHourEnd.getHours()) + ":" +formatTime(times.goldenHourEnd.getMinutes()));
    ret.set("sunset", formatTime(times.sunset.getHours()) + ":" +formatTime(times.sunset.getMinutes()));
    ret.set("sunsetstart", formatTime(times.sunsetStart.getHours()) + ":" +formatTime(times.sunsetStart.getMinutes()));
    ret.set("solarnoon", formatTime(times.solarNoon.getHours()) + ":" +formatTime(times.solarNoon.getMinutes()));
    ret.set("dusk", formatTime(times.dusk.getHours()) + ":" +formatTime(times.dusk.getMinutes()));
    ret.set("nauticaldusk", formatTime(times.nauticalDusk.getHours()) + ":" +formatTime(times.nauticalDusk.getMinutes()));
    ret.set("night", formatTime(times.night.getHours()) + ":" +formatTime(times.night.getMinutes()));
    ret.set("nightend", formatTime(times.nightEnd.getHours()) + ":" +formatTime(times.nightEnd.getMinutes()));
    ret.set("nadir", formatTime(times.nadir.getHours()) + ":" +formatTime(times.nadir.getMinutes()));
    ret.set("dawn", formatTime(times.dawn.getHours()) + ":" +formatTime(times.dawn.getMinutes()));
    ret.set("nauticaldawn", formatTime(times.nauticalDawn.getHours()) + ":" +formatTime(times.nauticalDawn.getMinutes()));

    ret.set("moonrise", formatTime(moons.rise.getHours()) + ":" +formatTime(moons.rise.getMinutes()));
    ret.set("moonset", formatTime(moons.set.getHours()) + ":" +formatTime(moons.set.getMinutes()));

    return ret;
  },
  decodeSuncalcKeyword: function(keyword) {
    return specialTimes.get(keyword);
  }
}

function formatTime(time) {
  if (time < 10) {
    return "0" + time.toString();
  } else {
    return time.toString();
  }
}
