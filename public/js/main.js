// --- Sockets - https://pixijs.github.io/docs/
// --- Sound - http://www.charlie-roberts.com/gibberish/docs.html

/*
  Using PEP for touch compatibility events
  between desktop and mobile.
    pointermove    pointerdown    pointerup
    pointerover    pointerout     
    pointerenter   pointerleave   pointercancel
*/

// Boot Gibberish
Gibberish.init();
Gibberish.Time.export();
Gibberish.Binops.export();

// Modulo that works with negative numbers
Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
}

var APP = function() {
  this.sounds = [];
  this.soundFx = [];

  // beats per minute
  this.bpm = 125;
  // notes per secord
  this.nps = 4 * this.bpm / 60;
  // ms per note (120)
  this.mspn = 1000 / this.nps;
  // samples per note
  this.smppn = 44100 / this.nps;
  // samples per ms
  this.smppms = this.smppn / this.mspn;
  // samples adjustment on timesync
  this.smppnNext = 0;

  this.socket = io();
  this.socket.on('test msg from server', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  this.gfx = new GFX();

  this.sounds.push(new Gibberish.Synth2());
  this.soundFx.push(new Gibberish.Vibrato({
    input:this.sounds[0], 
    rate:4, 
    amount:0.2 // try 100
  }).connect());

  this.ts = timesync.create({
    server: '/timesync',
    interval: 5000
  });

  //this.ts.on('change', function(offsetMs) {
    //console.log('offset:', offsetMs);
  //})

  this.playSound = function() {
    //this.socket.emit('touch', 1);
    
    var s = app.sounds[0];
    s.attack = 20;
    s.decay = 1000;
    s.resonance = 1;
    s.cutoff = 0.8;
    var note = [12, 14, 19][Math.floor(Math.random() * 3)];
    
    if(Math.random() < 0.5) {
      s.note(220 * Math.pow(1.059463094359, note));
    }

    var t = Math.floor(app.ts.now() % app.mspn);
    // This approach is not perfect, since the tempo oscillates
    // around the desired target. I could do some averaging in
    // the measurements to know the ideal location in time
    // and then stick to that location without changing the duration.
    // Maybe worth researching in the future.
    if(t < app.mspn / 2) {
      // if we are a bit late, shorten the loop duration by 5 samples
      app.seq.durations[0] = app.smppn - 5;
    } else {
      // if we are a bit early, lengthen the loop duration by 5 samples
      app.seq.durations[0] = app.smppn + 5;
    }

    app.gfx.stage.children[1].x = Math.random() * window.innerWidth;
  }

  this.seq = new Gibberish.Sequencer({
    values:[ this.playSound ], durations:[ this.smppn ]
  }).start()
}

// BOOT
var app = new APP();

document.body.appendChild(app.gfx.renderer.view);
requestAnimationFrame(app.gfx.draw);
app.gfx.draw();
app.gfx.populateStage();

// EVENTS
// Firefox Linux 64bit issue: 'pointerdown' triggered only once
$('body').on('pointerdown', function(event) {
  //app.gfx.stage.children[0].scale = { x:5, y:5 };
  //app.playSound();
  app.smppnNext = app.smppn + 100;
});


