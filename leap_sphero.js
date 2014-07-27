//leap_sphero.js
var Cylon = require('cylon');

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
    my.leapmotion.on('hand', function(hand) {
     
      var handZ = Math.floor(hand.palmZ);
      var handX = Math.floor(hand.palmX);
      //絶対値を元に値を取得する
      var pz =  Math.abs(handZ).fromScale(0,150);
      var px =  Math.abs(handX).fromScale(0,150);
      //元値が-値だった場合には-値にする
      pz = (handZ < 0) ?pz * -1 : pz; 
      px = (handX < 0) ?px * -1 : px; 

      //移動力と角度を取得する
      var move = Math.sqrt(Math.pow(pz,2), Math.pow(px,2));
      var rad = Math.atan2(pz,px);

      move = Math.floor(move.toScale(0,255));
      rad = Math.floor(rad * 180/Math.PI) + 180;
      console.log(move + ':' + rad);
      my.sphero.roll(move, rad);
    });
  }
})

Cylon.start();
