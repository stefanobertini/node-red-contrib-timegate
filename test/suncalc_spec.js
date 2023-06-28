const helper = require("node-red-node-test-helper");
const timegateNode = require("../timegate/timegate.js");
const suncalc_utils = require('../timegate/suncalc_utils.js')
const moment = require('moment')
const default_lat = 43.7729844;
const default_lon = 11.2567622;


describe('TimeGateNode Suncalc Functions', function () {

  before(function (done) {
    helper.startServer(done);
  });

  after(function (done) {
    helper.stopServer(done);
  });

  afterEach(function () {
    helper.unload();
  });


  // Time Tests
  it('check sunrise node1', function (done) {
    doTest("sunrise", true, done);
  });
  
  it('check sunrise node2', function (done) {
    doTest("sunrise", false, done);
  });
 

  it('check sunriseend node1', function (done) {
    doTest("sunriseend", true, done);
  });
  
  it('check sunriseend node2', function (done) {
    doTest("sunriseend", false, done);
  });

  
  it('check goldenhour node1', function (done) {
    doTest("goldenhour", true, done);
  });
  
  it('check goldenhour node2', function (done) {
    doTest("goldenhour", false, done);
  });


  it('check goldenhourend node1', function (done) {
    doTest("goldenhourend", true, done);
  });
  
  it('check goldenhourend node2', function (done) {
    doTest("goldenhourend", false, done);
  });


  it('check sunset node1', function (done) {
    doTest("sunset", true, done);
  });
  
  it('check sunset node2', function (done) {
    doTest("sunset", false, done);
  });


  it('check sunsetstart node1', function (done) {
    doTest("sunsetstart", true, done);
  });
  
  it('check sunsetstart node2', function (done) {
    doTest("sunsetstart", false, done);
  });


  it('check solarnoon node1', function (done) {
    doTest("solarnoon", true, done);
  });
  
  it('check solarnoon node2', function (done) {
    doTest("solarnoon", false, done);
  });


  it('check dusk node1', function (done) {
    doTest("dusk", true, done);
  });
  
  it('check dusk node2', function (done) {
    doTest("dusk", false, done);
  });


  it('check nauticaldusk node1', function (done) {
    doTest("nauticaldusk", true, done);
  });
  
  it('check nauticaldusk node2', function (done) {
    doTest("nauticaldusk", false, done);
  });


  it('check night node1', function (done) {
    doTest("night", true, done);
  });
  
  it('check night node2', function (done) {
    doTest("night", false, done);
  });


  it('check nightend node1', function (done) {
    doTest("nightend", true, done);
  });
  
  it('check nightend node2', function (done) {
    doTest("nightend", false, done);
  });


  it('check nadir node1', function (done) {
    doTest("nadir", true, done);
  });
  
  it('check nadir node2', function (done) {
    doTest("nadir", false, done);
  });


  it('check dawn node1', function (done) {
    doTest("dawn", true, done);
  });
  
  it('check dawn node2', function (done) {
    doTest("dawn", false, done);
  });


  it('check nauticaldawn node1', function (done) {
    doTest("nauticaldawn", true, done);
  });
  
  it('check nauticaldawn node2', function (done) {
    doTest("nauticaldawn", false, done);
  });


  it('check moonrise node1', function (done) {
    doTest("moonrise", true, done);
  });
  
  it('check moonrise node2', function (done) {
    doTest("moonrise", false, done);
  });


  it('check moonset node1', function (done) {
    doTest("moonset", true, done);
  });
  
  it('check moonset node2', function (done) {
    doTest("moonset", false, done);
  });



  function doTest(suncalcKeyword, testFirstNode, done) {
    const default_date = "2023/06/27"

    const refDate = moment(default_date + " 22:00", "YYYY/MM/DD HH:mm");
    const times = suncalc_utils.calcTimeStrings(refDate, default_lat, default_lon);

    var refTime;
    refTime = moment(default_date + " " + times.get(suncalcKeyword), "YYYY/MM/DD HH:mm");
    if (!testFirstNode) {
      refTime.subtract(1, 'm');
    }  

    var TimeGateNode = {
      ... { id: "tg", type: "timegate", name: "test name", wires: [["o1"], ["o2"]], z:"flowA" },
      ... {"time_1": suncalcKeyword + "-23:59"},
      ... { "targetDateTime": "targetDateTime", "targetDateTimeType": "msg" },
      ... {lat: default_lat, lon: default_lon}
    };
    
    var flow = [
      TimeGateNode,
      { id: "o1", type: "helper", wires: [], z:"flowA" },
      { id: "o2", type: "helper", wires: [], z:"flowA" },
    ];

    helper.load(timegateNode, flow, function () {
      var tg = helper.getNode("tg");
      var o1 = helper.getNode("o1");
      var o2 = helper.getNode("o2");

      var testNode = testFirstNode ? o1 : o2;

      testNode.on("input", function (msg) {
        msg.should.have.property('payload', 'test');
        done();
      });

      tg.receive({ payload: "test", targetDateTime: refTime.format("YYYY/MM/DD HH:mm") });      
    });
  }

});