const suncalc_utils = require('./suncalc_utils')

const validDays = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31",
  "ODD", "EVEN", "ODD-YEAR", "EVEN-YEAR",
  "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const validWeeks = ["1", "2", "3", "4", "5", "6", "ODD", "EVEN", "ODD-YEAR", "EVEN-YEAR"];
const validMonths = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const regexTime = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/g;

module.exports = {

  getConfigEntry: function (config, id) {
    var configEntry = {
      "time": config['time_' + id],
      "day": config['day_' + id],
      "week": config['week_' + id],
      "month": config['month_' + id]
    };

    configEntry.valid = checkValidEntry(configEntry);
    configEntry.empty = checkEmptyEntry(configEntry);

    if (configEntry.valid.time && !configEntry.empty.time) {
      configEntry.intervals = getTimeIntervals(configEntry.time);
    }
    if (configEntry.valid.day && !configEntry.empty.day) {
      configEntry.days = splitEntriesInArray(configEntry.day);    
    }
    if (configEntry.valid.week && !configEntry.empty.week) {
      configEntry.weeks = splitEntriesInArray(configEntry.week);    
    }
    if (configEntry.valid.month && !configEntry.empty.month) {
      configEntry.months = splitEntriesInArray(configEntry.month);    
    }        
    return configEntry;
  },

  getConfigEntries: function (config) {
    var configEntries = new Array();
    for (let index = 1; index <= 5; index++) {
      configEntries.push(this.getConfigEntry(config, index));
    }
    return configEntries;
  },

  showConfigErrors: function (configEntries, node) {
    var errorFound = false;
    for (let index = 0; index < configEntries.length && !errorFound; index++) {
      const configEntry = configEntries[index];
      if (!configEntry.valid.time && !configEntry.empty.time) {
        showConfigErrorStatus("Invalid time", index, node);
        errorFound = true;
      }
      if (!configEntry.valid.day && !configEntry.empty.day) {
        showConfigErrorStatus("Invalid day", index, node);
        errorFound = true;
      }
      if (!configEntry.valid.week && !configEntry.empty.week) {
        showConfigErrorStatus("Invalid week", index, node);
        errorFound = true;
      }
      if (!configEntry.valid.month && !configEntry.empty.month) {
        showConfigErrorStatus("Invalid month", index, node);
        errorFound = true;
      }
      if (!configEntry.empty.correct) {
        showConfigErrorStatus("Time cannot be empty", index, node);
        errorFound = true;
      }
    }
  }
}

function getTime(time) {
  const split = time.split(":");
  if (split.length == 1) {
    if (suncalc_utils.isSunCalcKeyword(split)) {
      return suncalc_utils.getSunCalcKeywordId(split);
    } else {
      return -1;
    }
  } else if (split.length == 2) {
    try {
      const hour = Number(split[0]);
      const minute = Number(split[1]);
      if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return -1;
      }
      return hour * 60 + minute;
    } catch (error) {
      return -1;
    } 
  } else {
    return -1;
  }
}

function checkValidTime(item) {
  if (isEmpty(item)) {
    return true;
  }

  const split = item.split("-");
  if (split.length != 2) {
    return false;
  }


  const from = split[0].trim().toLowerCase();
  const to = split[1].trim().toLowerCase(); 

  return ((from.match(regexTime) || suncalc_utils.isSunCalcKeyword(from)) && (to.match(regexTime) || suncalc_utils.isSunCalcKeyword(to)));  
}

function showConfigErrorStatus(msg, index, node) {
  const text = "Config " + (index + 1) + ": " + msg + ".";
  node.status({ fill: "red", shape: "dot", text: text });
  node.error(text);
}

function isValidTime(timeEntry) {
  if (isEmpty(timeEntry)) {
    return true;
  }

  var valid = true;
  const split = timeEntry.split(",");
  split.forEach(item => {
    if (!checkValidTime(item.trim())) {
      valid = false;
    }
  });
  return valid;
}

function isValidDay(dayEntry) {
  if (isEmpty(dayEntry)) {
    return true;
  } else {
    return areSplitEntriesInArray(dayEntry, validDays);
  }
}

function isValidWeek(weekEntry) {
  if (isEmpty(weekEntry)) {
    return true;
  } else {
    return areSplitEntriesInArray(weekEntry, validWeeks);
  }
}

function isValidMonth(monthEntry) {
  if (isEmpty(monthEntry)) {
    return true;
  } else {
    return areSplitEntriesInArray(monthEntry, validMonths);
  }
}

function areSplitEntriesInArray(entry, checkAarray) {

  const split = splitEntriesInArray(entry);
  var valid = true;
  split.forEach(item => {
    if (!checkAarray.includes(item)) {
      valid = false;
    }
  });
  return valid;
}

function splitEntriesInArray(entry) {

  const split = entry.split(",");
  var ret = new Array();
  split.forEach(item => {
    ret.push(item.toUpperCase().trim());
    
  });
  return ret;
}

function isEmpty(str) {
  return (!str || str.trim().length === 0);
}

function getTimeIntervals(timeEntry) {

  const splitIntervals = (timeEntry || "").split(",");
  var intervals = [];
  splitIntervals.forEach(item => {
    if (!isEmpty(item)) {
      const split = item.split("-");

      intervals.push(
        {
          from: getTime(split[0]),
          to: getTime(split[1])
        }
      )
    }
  });
  return intervals;
}

function checkValidEntry(configEntry) {
  const validTime = isValidTime(configEntry.time);
  const validDay = isValidDay(configEntry.day);
  const validWeek = isValidWeek(configEntry.week);
  const validMonth = isValidMonth(configEntry.month);

  var ret = {
    "time": validTime,
    "day": validDay,
    "week": validWeek,
    "month": validMonth,
    "all": validTime && validDay && validWeek && validMonth
  };
  return ret;
}

function checkEmptyEntry(configEntry) {
  const emptyTime = isEmpty(configEntry.time);
  const emptyDay = isEmpty(configEntry.day);
  const emptyWeek = isEmpty(configEntry.week);
  const emptyMonth = isEmpty(configEntry.month);

  var ret = {
    "time": emptyTime,
    "day": emptyDay,
    "week": emptyWeek,
    "month": emptyMonth,
    "empty": emptyTime && emptyDay && emptyWeek && emptyMonth,
    "correct": ( emptyTime && emptyDay && emptyWeek && emptyMonth) || !emptyTime 
  };
  return ret;
}
