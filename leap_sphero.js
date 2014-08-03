//leap_sphero.js
var Cylon = require('cylon');
var isCalibration = false;
var co = 0;
var move = 0;
var deg  = 0; 
Cylon.robot({
  connections: [
    { name: 'leapmotion', adaptor: 'leapmotion', port: '127.0.0.1:6437' },
    { name: 'sphero', adaptor: 'sphero', port: '/dev/cu.sphero-AMP-SPP-3' }
  ],
  devices: [
    { name: 'leapmotion', driver: 'leapmotion', connection: 'leapmotion' },
    { name: 'sphero', driver: 'sphero', connection: 'sphero' }
  ],
  work: function(my) {
    every((1).second(), function() {
      if (!isCalibration) {
        console.log(move + ':' + deg);
        my.sphero.roll(move, deg);
      }
    });
    my.leapmotion.on('frame', function(frame) {
      if (frame.hands.length == 0 && !isCalibration) {
        isCalibration = true;
        console.log('start calibration');
        my.sphero.stop();
        my.sphero.setRGB(0xFF0000);
        my.sphero.startCalibration();
      }
    });
    my.leapmotion.on('hand', function(hand) {
        if (isCalibration) {
          isCalibration = false;
          my.sphero.finishCalibration();

          console.log('finish calibration');
        }

        switch(hand.fingers.length) {
            case 0:
                move = 255;
                my.sphero.setRandomColor();
                break;
            case 1: 
                move = 70;
                my.sphero.setRGB(0xeeeeff);
                break;
            case 2: 
                move = 110;
                my.sphero.setRGB(0x9999ff);
                break;
            case 3: 
                move = 140;
                my.sphero.setRGB(0x4444ff);
                break;
            case 4: 
                move = 180;
                my.sphero.setRGB(0x0000FF);
                break;
            case 5: 
                move = 250;
                my.sphero.setRandomColor();
                break;

        }

        var handX = hand.palmX;
        var handZ = hand.palmZ;
        //絶対値を元に値を取得する
        var pz =  Math.abs(handZ).fromScale(0,150);
        var px =  Math.abs(handX).fromScale(0,150);
        //元値が-値だった場合には-値にする
        pz = (handZ < 0) ?pz * -1 : pz; 
        px = (handX < 0) ?px * -1 : px; 

        //角度を取得する
        var rad = Math.atan2(pz,px);
        deg = Math.floor(rad * 180/Math.PI) + 90;
        if (deg < 0) {
            deg = 90 - deg;
        }

    });
  }
});

Cylon.start();
