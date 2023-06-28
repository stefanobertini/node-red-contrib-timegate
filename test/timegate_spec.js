const helper = require("node-red-node-test-helper");
const timegateNode = require("../timegate/timegate.js");

describe('TimeGateNode Node', function () {

  before(function (done) {
    helper.startServer(done);
  });

  after(function (done) {
    helper.stopServer(done);
  });

  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "tg", type: "timegate", name: "test name" }];
    helper.load(timegateNode, flow, function () {
      var tg = helper.getNode("tg");
      tg.should.have.property('name', 'test name');
      done();
    });
  });

  // it('should have default label', function (done) {
  //   var flow = [{ id: "tg", type: "timegate" }];
  //   helper.load(timegateNode, flow, function () {
  //     var tg = helper.getNode("tg");
  //     tg.should.have.property('label', 'TimeGate');
  //     done();
  //   });
  // });

  // it('should change label', function (done) {
  //   var flow = [{ id: "tg", type: "timegate", name: "test name" }];
  //   helper.load(timegateNode, flow, function () {
  //     var tg = helper.getNode("tg");
  //     tg.should.have.property('label', 'test name');
  //     done();
  //   });
  // });

  // Time Tests
  it('check time node1 single interval 1 message', function (done) {
    var config = {
      "time_1": "01:00-02:00",
      "time_2": "04:00-05:00",
      "time_4": "06:00-07:00",
    };

    doTest(config, "2023/06/03 04:50", "msg", true, done);
  });

  it('check time node1 24h format', function (done) {
    var config = {
      "time_1": "12:00-23:00",
    };

    doTest(config, "2023/06/03 15:00", "msg", true, done);
  });


  it('check time node1 single interval 1 message date only', function (done) {
    var config = {
      "time_1": "00:00-23:59",
    };

    doTest(config, "2023/06/03", "msg", true, done);
  });

  it('check time node1 currentime', function (done) {
    var config = {
      "time_1": "00:00-23:59",
    };

    doTest(config, "", "msg", true, done);
  });

  it('check time node1 single interval 1 flow', function (done) {
    var config = {
      "time_1": "01:00-02:00",
      "time_2": "04:00-05:00",
      "time_4": "06:00-07:00",
    };

    doTest(config, "2023/06/03 04:50", "flow", true, done);
  });

  it('check time node1 single interval 1 global', function (done) {
    var config = {
      "time_1": "01:00-02:00",
      "time_2": "04:00-05:00",
      "time_4": "06:00-07:00",
    };

    doTest(config, "2023/06/03 04:50", "global", true, done);
  });


  it('check time node1 multiple interval 1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
    };

    doTest(config, "2023/06/03 04:50", "msg", true, done);
  });

  it('check time node2 single interval 1', function (done) {
    var config = {
      "time_1": "01:00-02:00",
      "time_2": "04:00-05:00",
      "time_4": "06:00-07:00",
    };

    doTest(config, "2023/06/03 02:50", "msg", false, done);
  });

  it('check time node2 multiple interval 1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
    };

    doTest(config, "2023/06/03 02:50", "msg", false, done);
  });

  // Day Tests
  it('check day number node1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "1,2,3"
    };

    doTest(config, "2023/06/03 04:50", "msg", true, done);
  });

  it('check day odd node1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "oDd"
    };

    doTest(config, "2023/06/03 04:50", "msg", true, done);
  });

  it('check day even-year node1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "even-YEAR"
    };

    doTest(config, "2023/06/03 04:50", "msg", true, done);
  });

  it('check day name node1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "Sat,suN"
    };

    doTest(config, "2023/06/03 04:50", "msg", true, done);
  });

  it('check day even node2', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "evEN"
    };

    doTest(config, "2023/06/03 04:50", "msg", false, done);
  });

  it('check day odd-year node2', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "Odd-YEAR"
    };

    doTest(config, "2023/06/03 04:50", "msg", false, done);
  });

  it('check day name node1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "suN,mon"
    };

    doTest(config, "2023/06/03 04:50", "msg", false, done);
  });

  it('check day number node2', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "4,5,6"
    };

    doTest(config, "2023/06/03 04:50", "msg", false, done);
  });

  it('check time node1 should work with inverted range', function (done) {
    var config = {
      "time_1": "05:00-04:00",
    };

    doTest(config, "2023/06/03 04:50", "msg", true, done);
  });

  // Week Tests
  it('check week number node1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "week_1": "3"
    };

    doTest(config, "2023/06/12 04:50", "msg", true, done);
  });

  it('check week odd node1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "week_1": "oDd"
    };

    doTest(config, "2023/06/12 04:50", "msg", true, done);
  });

  it('check week even-year node1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "week_1": "even-YEAR"
    };

    doTest(config, "2023/06/12 04:50", "msg", true, done);
  });

  it('check week even node2', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "week_1": "evEN"
    };

    doTest(config, "2023/06/12 04:50", "msg", false, done);
  });

  it('check week odd-year node2', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "week_1": "Odd-YEAR"
    };

    doTest(config, "2023/06/12 04:50", "msg", false, done);
  });

  it('check week number node2', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "week_1": "1"
    };

    doTest(config, "2023/06/12 04:50", "msg", false, done);
  });


  // Month Tests
  it('check month number node1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "month_1": "6"
    };

    doTest(config, "2023/06/12 04:50", "msg", true, done);
  });

  it('check month number node2', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "month_1": "7"
    };

    doTest(config, "2023/06/12 04:50", "msg", false, done);
  });

  // Complete Tests
  it('check complete node1', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "12",
      "week_1": "3",
      "month_1": "6"
    };

    doTest(config, "2023/06/12 04:50", "msg", true, done);
  });

  it('check complete bad day node2', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "13",
      "week_1": "3",
      "month_1": "6"
    };

    doTest(config, "2023/06/12 04:50", "msg", false, done);
  });

  it('check complete bad week node2', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "12",
      "week_1": "4",
      "month_1": "6"
    };

    doTest(config, "2023/06/12 04:50", "msg", false, done);
  });


  it('check complete bad month node2', function (done) {
    var config = {
      "time_1": "01:00-02:00,04:00-05:00,06:00-07:00",
      "day_1": "12",
      "week_1": "3",
      "month_1": "7"
    };

    doTest(config, "2023/06/12 04:50", "msg", false, done);
  });
 
    it('check invalid date', function (done) {
      var config = {
        "time_1": "01:00-02:00",
        "time_2": "04:00-05:00",
        "time_4": "06:00-07:00",
      };
  
      var TimeGateNode = {
        ... { id: "tg", type: "timegate", name: "test name", wires: [["o1"], ["o2"]], z:"flowA" },
        ...config,
        ... { "targetDateTime": "targetDateTime", "targetDateTimeType": "msg" }
      };
      
      var flow = [
        TimeGateNode,
        { id: "o1", type: "helper", wires: [], z:"flowA" },
        { id: "o2", type: "helper", wires: [], z:"flowA" },
      ];
  
      helper.load(timegateNode, flow, function () {
        var tg = helper.getNode("tg");

        tg.receive({ payload: "test", targetDateTime: "this is not a valid date" });

        try {
          helper.log().called.should.be.true();
          var logEvents = helper.log().args.filter(function(evt) {
              return evt[0].type == 'timegate' && evt[0].level == helper.log().ERROR;
          });
          logEvents.should.have.length(1);
          var msg = logEvents[0][0];
          msg.should.have.property('id', 'tg');
          msg.msg.should.startWith('Invalid date:');
          done();
      } catch(err) {
          done(err);
      }

      });
    });


  function doTest(config, refTime, refTimeType, testFirstNode, done) {
    var TimeGateNode = {
      ... { id: "tg", type: "timegate", name: "test name", wires: [["o1"], ["o2"]], z:"flowA" },
      ...config,
      ... { "targetDateTime": "targetDateTime", "targetDateTimeType": refTimeType },
      ... {lat: 43.7729844, lon: 11.2567622}
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

      if (refTimeType === "msg") {
        if (refTime) {
          tg.receive({ payload: "test", targetDateTime: refTime });
        } else {
          tg.receive({ payload: "test"});
        }
      } else  if (refTimeType === "flow") {
        o1.context().flow.set("targetDateTime", refTime);
        tg.receive({ payload: "test"});
      } else  if (refTimeType === "global") {
        o1.context().global.set("targetDateTime", refTime);
        tg.receive({ payload: "test"});
      } 
    });
  }

});