// --- Sockets - https://pixijs.github.io/docs/
var socket = io();
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});

// --- Graphics - https://pixijs.github.io/docs/
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

for(var i=0; i<2; i++) {
  var s = new PIXI.Sprite(texture);
  s.anchor.set(0.5);
  s.x = 50 + (window.innerWidth - 100) * Math.random();
  s.y = 50 + (window.innerHeight - 100) * Math.random();

  stage.addChild(s);
}

var nextEvent = (new Date()).getTime() + 1000;
var ts;

function animate() {
  renderer.render(stage);
  var len = stage.children.length;
  for(var i=0; i<len; i++) {
    var child = stage.children[i];
    var scale = child.scale.x * 0.9;
    if(scale > 1) {
      child.scale = { x:scale, y:scale };
    }
  }
  if(ts && ts.now() > nextEvent) {
    var now = ts.now();
    nextEvent = now + 133 - (now % 133);
    stage.children[1].x = Math.random() * window.innerWidth;
    trigger();
  }
  requestAnimationFrame(animate);
}

function trigger() {
  // socket
  //socket.emit('touch', 1);

  snd.attack = 20;
  snd.decay = 1000;
  snd.resonance = 1;
  snd.cutoff = 0.8;
  var n = [12, 14, 17][Math.floor(Math.random() * 3)];
  snd.note(220 * Math.pow(1.059463094359, n));
}

// --- Sound - http://www.charlie-roberts.com/gibberish/docs.html
Gibberish.init();
Gibberish.Time.export();
Gibberish.Binops.export();

var snd = new Gibberish.Synth2();
var fx = new Gibberish.Vibrato({
  input:snd, 
  rate:4, 
  amount:0.2 // try 100
}).connect();


/*
  Using PEP for touch compatibility events
  between desktop and mobile.
    pointermove    pointerdown    pointerup
    pointerover    pointerout     
    pointerenter   pointerleave   pointercancel
*/
// There's an issue in Firefox Linux 64bit
// with pointerdown being triggered only once
$('body').on('pointerdown', function(event) {
  stage.children[0].scale = { x:5, y:5 };
  trigger();
});

// create a timesync instance 
ts = timesync.create({
  server: '/timesync',
  interval: 10000
});

