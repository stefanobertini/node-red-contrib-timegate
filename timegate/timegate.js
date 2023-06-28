const moment = require('moment')
const config_utils = require('./config_utils')
const range_utils = require('./range_utils')

module.exports = function (RED) {

  function TimeGateNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // Read configuration entries
    var configEntries = config_utils.getConfigEntries(config);

    const position = 
    { 
      lat: config.lat,
      lon: config.lon
    }

    config_utils.showConfigErrors(configEntries, position, node);

    node.on('input', function (msg, send, done) {
      var isTime = false;
      var foundIndex = 0;

      RED.util.evaluateNodeProperty(config.targetDateTime, config.targetDateTimeType, node, msg, (err, value) => {
        if (err) {
          showError(err.message, node);
        } else {

          var validDate = false;
          var now;
          
          if (value) {
            now = moment(value, "YYYY/MM/DD HH:mm");
            if (!now.isValid()) {
              now = moment(value, "YYYY/MM/DD");
            }
            validDate = now.isValid();
          } else {
            now = moment();
            validDate = true;
          }

          if (validDate) {
            for (let index = 0; index < configEntries.length && !isTime; index++) {
              const configEntry = configEntries[index];

              if (configEntry.valid.all && !configEntry.empty.empty && configEntry.empty.correct) {
                if (range_utils.isInRange(configEntry, now, position)) {
                  isTime = true;
                  foundIndex = index + 1;
                }
              }
            }

            showStatus(isTime, foundIndex, now, node);

            if (isTime) {
              send([msg, null]);
            } else {
              send([null, msg]);
            }
          } else {
            showError("Invalid date: " + value, node);
          }
        }
      });

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

  node.status({ fill: isTime ? "green" : "yellow", shape: "ring", text: text });
  node.log(text);
}

function showError(text, node) {
  text += " at: " + moment().format("MMM D, HH:mm");

  node.status({ fill: "red", shape: "dot", text: text });
  node.error(text);
}
