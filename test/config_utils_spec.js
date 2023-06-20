var helper = require("node-red-node-test-helper");
var timegateNode = require("../timegate/timegate.js");

describe('TimeGateNode Config', function () {

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

   // Time tests 
   it('valid single time', function (done) {
    var config = {
      "time_1": "10:00-11:00",
    };

    chechStatusEmpty(config, done);
  });

  it('valid multiple time', function (done) {
    var config = {
      "time_1": "10:00-11:00, 11:00 - 12:00 ",
    };

    chechStatusEmpty(config, done);
  });

  it('invalid time missing interval', function (done) {
    var config = {
      "time_1": "10:00", 
    };

    chechStatus(config, "Config 1: Invalid time.", done);
  });

  it('invalid time conversion error', function (done) {
    var config = {
      "time_1": "hh:mm", 
    };

    chechStatus(config, "Config 1: Invalid time.", done);
  });

  it('invalid time missing minutes', function (done) {
    var config = {
      "time_1": "10", 
    };

    chechStatus(config, "Config 1: Invalid time.", done);
  });


  it('invalid time missing ', function (done) {
    var config = {
      "month_1": "1", 
    };

    chechStatus(config, "Config 1: Time cannot be empty.", done);
  });  

  it('invalid time multiple interval ', function (done) {
    var config = {
      "time_1": "10:00-11:00-12:00", 
    };

    chechStatus(config, "Config 1: Invalid time.", done);
  });


  it('invalid time inverted interval', function (done) {
    var config = {
      "time_1": "11:00-10:00",
    };

    chechStatus(config, "Config 1: Invalid time.", done);
  });  
  it('invalid empty time', function (done) {
    var config = {
      "time_1": "10:00-", 
    };

    chechStatus(config, "Config 1: Invalid time.", done);
  });

  it('invalid time: hours', function (done) {
    var config = {
      "time_1": "30:00-10:00", 
    };

    chechStatus(config, "Config 1: Invalid time.", done);
  });

  it('invalid time: minutes', function (done) {
    var config = {
      "time_1": "10:70-10:00", 
    };

    chechStatus(config, "Config 1: Invalid time.", done);
  });

  it('valid suncal keywords', function (done) {
    var config = {
      "time_1": "sunrise - sunriseend,  goldenhour  -  goldenhourend  ,SUNset-sunsetSTART,solarnoon-dusk,nauticaldusk-night,nightend-nadir,dawn-nauticaldawn",
    };

    chechStatusEmpty(config, done);
  });
  
  
  // Day tests 
   it('valid single day', function (done) {
    var config = {
      "time_1": "10:00-11:00", "day_1": "1",
    };

    chechStatusEmpty(config, done);
  });

  it('valid multi day number', function (done) {
    var config = {
      "time_1": "10:00-11:00", "day_1": " 1,2 , 3 ,  4   ,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31",
    };

    chechStatusEmpty(config, done);
  });

  it('valid multi day text', function (done) {
    var config = {
      "time_1": "10:00-11:00", "day_1": "odd, EVEN, ODD-YEAR, EVEN-YEAR ,SUN,MON,TUE,WED,THU,FRI,SAT"
    };

    chechStatusEmpty(config, done);
  });

  it('invalid day', function (done) {
    var config = {
      "time_1": "10:00-11:00", "day_1": "32",
    };

    chechStatus(config, "Config 1: Invalid day.", done);
  });

  it('invalid empty day', function (done) {
    var config = {
      "time_1": "10:00-11:00", "day_1": "1,,2",
    };

    chechStatus(config, "Config 1: Invalid day.", done);
  });



  // Week tests 
  it('valid single week', function (done) {
    var config = {
      "time_1": "10:00-11:00", "week_1": "1",
    };

    chechStatusEmpty(config, done);
  });

  it('valid multi week', function (done) {
    var config = {
      "time_1": "10:00-11:00", "week_1": " 1,2 , 3 ,   4   ,5,6,odd, EVEN, ODD-YEAR, EVEN-YEAR",
    };

    chechStatusEmpty(config, done);
  });


  it('invalid week', function (done) {
    var config = {
      "time_1": "10:00-11:00", "week_1": "7,ODD",
    };

    chechStatus(config, "Config 1: Invalid week.", done);
  });

  it('invalid empty week', function (done) {
    var config = {
      "time_1": "10:00-11:00", "week_1": "1,,2",
    };

    chechStatus(config, "Config 1: Invalid week.", done);
  });


  // Month tests 
  it('valid single month', function (done) {
    var config = {
      "time_1": "10:00-11:00", "month_1": "1",
    };

    chechStatusEmpty(config, done);
  });

  it('valid multi month', function (done) {
    var config = {
      "time_1": "10:00-11:00", "month_1": "1,2,3,4,5,6,7,8,9,10,11,12",
    };

    chechStatusEmpty(config, done);
  });


  it('invalid month', function (done) {
    var config = {
      "time_1": "10:00-11:00", "month_1": "13,5,2",
    };

    chechStatus(config, "Config 1: Invalid month.", done);
  });

  it('invalid empty month', function (done) {
    var config = {
      "time_1": "10:00-11:00", "month_1": "1,,2",
    };

    chechStatus(config, "Config 1: Invalid month.", done);
  }); 
  
  function chechStatus(config, text, done) {
    var flow = [{
      ... { id: "tg", type: "timegate", name: "test name" },
      ...config
    }];

    helper.load(timegateNode, flow, function () {
      var tg = helper.getNode("tg");
      tg.status.should.be.calledWith({ fill: "red", shape: "dot", text: text });
      done();
    });
  }

  function chechStatusEmpty(config, done,) {
    var flow = [{
      ... { id: "tg", type: "timegate", name: "test name" },
      ...config
    }];

    helper.load(timegateNode, flow, function () {
      var tg = helper.getNode("tg");
      tg.status.called.should.be.false();
      done();
    });
  }

});