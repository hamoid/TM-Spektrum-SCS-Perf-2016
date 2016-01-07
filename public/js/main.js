// --- Sockets
var socket = io();
//  socket.emit('chat message', $('#m').val());
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});

// --- Graphics
var stage = new PIXI.Container();
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
requestAnimationFrame(animate);
document.body.appendChild(renderer.view);
animate();

var gfx = new PIXI.Graphics();
gfx.lineStyle(0);
gfx.beginFill(0xFFFFFF);
gfx.drawCircle(15, 15, 1.5);
gfx.endFill();

var texture = gfx.generateTexture(); 

var s = new PIXI.Sprite(texture);
s.anchor.set(0.5);
s.x = 100;
s.y = 100;

stage.addChild(s);

function animate() {
  renderer.render(stage);
  var len = stage.children.length;
  for(var i=0; i<len; i++) {
    stage.children[i].x += 3;
    if(stage.children[i].x > window.innerWidth) {
      stage.children[i].x = 0;
      snd.note(440 + 50 * Math.floor(12 * Math.random()));
    }
  }
  requestAnimationFrame(animate);
}

// --- Sound
Gibberish.init();
Gibberish.Time.export();
Gibberish.Binops.export();

var snd = new Gibberish.Synth2().connect();
