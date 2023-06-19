const moment = require('moment')
const config_utils = require('./config_utils')
const range_utils = require('./range_utils')
const suncalc = require('suncalc');

module.exports = function (RED) {

  function TimeGateNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // Read configuration entries
    var configEntries = config_utils.getConfigEntries(config);

    config_utils.showConfigErrors(configEntries, node);

    // Get the time from inputs, for unit testing
    var unittest_time = config.unittest_time;

    node.on('input', function (msg, send, done) {
      var isTime = false;
      var foundIndex =0 ;

      var now = moment();
      if (unittest_time) {
        now = moment(unittest_time, "YYYY/MM/DD hh:mm");
      }

      for (let index = 0; index < configEntries.length && !isTime; index++) {
        const configEntry = configEntries[index];

        if (configEntry.valid.all && !configEntry.empty.empty && configEntry.empty.correct) {
          if (range_utils.isInRange(configEntry, now)) {
            isTime = true;
            foundIndex = index + 1;
          }     
        }
      }

      showStatus(isTime, foundIndex, now, node) ;

      if (isTime) {
        send([msg, null]);
      } else {
        send([null, msg]);
      }

      if (done) {
        done();
      }

    });
  }

  RED.nodes.registerType("timegate", TimeGateNode);
}

function showStatus(isTime, index, now, node) {
  var text;

  if (isTime) {
    text = "Out 1 by config " + index;
  } else {
    text = "Out 2";
  }

  text += " at: " + now.format("MMM D, HH:mm");

  node.status({ fill: isTime ? "green": "yellow", shape: "ring", text: text });
  node.log(text);
}