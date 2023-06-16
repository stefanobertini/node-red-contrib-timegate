const moment = require('moment')
const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

module.exports = {

  isInRange: function (configEntry, refMoment) {
    
    if (!isTimeInRange(configEntry, refMoment)) {
      return false;
    }

    if (!configEntry.empty.day && !isDayInRange(configEntry, refMoment)) {
      return false;
    }

    if (!configEntry.empty.week && !isWeekInRange(configEntry, refMoment)) {
      return false;
    }

    if (!configEntry.empty.month && !isMonthInRange(configEntry, refMoment)) {
      return false;
    }
    return true;
  },

}

function isMonthInRange(configEntry, refMoment) {
  
  const monthNumber = (refMoment.month() + 1).toString();
  
  for (let index = 0; index < configEntry.months.length; index++) {
    const entry = configEntry.months[index];
    if(entry === monthNumber) {
      return true;
    } 
  }
  return false;
}

function isWeekInRange(configEntry, refMoment) {
  const weekNumber = refMoment.week() - moment(refMoment).startOf('month').week() + 1;
  const weekOfMonth = weekNumber % 2 == 0 ? "EVEN" : "ODD";
  const weekOfYear = refMoment.week() % 2 == 0 ? "EVEN-YEAR" : "ODD-YEAR";
  const weekNumberString = weekNumber.toString();
  
  for (let index = 0; index < configEntry.weeks.length; index++) {
    const entry = configEntry.weeks[index];
    if(entry === weekOfMonth || entry === weekOfYear || entry === weekNumberString) {
      return true;
    } 
  }
  return false;
}

function isDayInRange(configEntry, refMoment) {
  const dayOfMonth = refMoment.date() % 2 == 0 ? "EVEN" : "ODD";
  const dayOfYear = refMoment.dayOfYear() % 2 == 0 ? "EVEN-YEAR" : "ODD-YEAR";
  const dayName = dayNames[refMoment.day()];
  const dayNumber = refMoment.date().toString();
  
  for (let index = 0; index < configEntry.days.length; index++) {
    const entry = configEntry.days[index];
    if(entry === dayOfMonth || entry === dayOfYear || entry === dayName || entry === dayNumber) {
      return true;
    } 
  }
  return false;
}

function isTimeInRange(configEntry, refMoment) {
  const time = refMoment.hours() * 60 + refMoment.minutes();
  for (let index = 0; index < configEntry.intervals.length; index++) {
    const interval = configEntry.intervals[index];
    if(time >= interval.from && time <= interval.to) {
      return true;
    } 
  }
  return false;
}
