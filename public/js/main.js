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
Number.prototype.map = function(a, b, c, d) {
  return c + (d - c) * ((this - a) / (b - a));
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

  // user interaction
  this.pointerDown = false;

  // sync count
  this.syncCount = 0;

  // show time span
  this.startTime = 0;
  this.endTime = 0;

  // SOCKET

  this.socket = io();

  this.socket.on('players', function(players){
    var list = _.map(players, function(obj, id) {
      return 'id:' + id + ' sync:' + obj.syncCount + ' ip:' + obj.ip;
    }).join('<br/>');
    $('#overlay').html(list);
  });

  this.socket.on('setTimeSpan', function(startTime, endTime) {
    app.startTime = startTime;
    app.endTime = endTime;

    if(app.startTime) {
      console.log(app.startTime, app.endTime);
    }
  });

  // GFX

  this.gfx = new GFX();

  this.gfx.onCtrlUpdate = function(pos) {
    var s = app.sounds[1];
    s.frequency = 20 + 500 * pos.x;
    s.amp = pos.y;
  }

  // SOUNDS

  this.sounds.push(new Gibberish.Synth2());
  this.sounds.push(new Gibberish.Sine2().connect());
  this.soundFx.push(new Gibberish.Vibrato({
    input:this.sounds[0], 
    rate:4, 
    amount:0.2 // try 100
  }).connect());

  this.playSound = function() {
    var now = app.ts.now();
    var normTime = (now - app.startTime) / (app.endTime - app.startTime);
    
    if(app.pointerDown && app.startTime > 0) {
      // split time in 30, 20 second segments
      var timeInScore = normTime * 30;
      var segment = Math.floor(timeInScore);
      var normSegmentTime = (timeInScore % 1);

      var s = app.sounds[0];
      s.attack = 20;
      s.decay = Math.floor(1000 + 10000 * normSegmentTime);
      s.resonance = 1;
      s.cutoff = 0.8;
      var note = [12, 14, 19, 24, 26, 29][Math.floor(1 + Math.random() * ( segment % 6))];

      s.note(220 * Math.pow(1.059463094359, note));

      app.gfx.stage.children[0].x = Math.random() * window.innerWidth;
    } else {
      app.gfx.stage.children[0].x = -20;
    }

    var t = Math.floor(now % app.mspn);
    // This approach is not perfect, since the tempo oscillates
    // around the desired target. I could do some averaging in
    // the measurements to know the ideal location in time
    // and then stick to that location without changing the duration.
    // Maybe worth researching in the future.
    if(t < app.mspn / 2) {
      // if we are a bit late, shorten the loop duration by N samples
      app.seq.durations[0] = app.smppn - t/10;
    } else {
      // if we are a bit early, lengthen the loop duration by N samples
      app.seq.durations[0] = app.smppn + (120-t)/10;
    }

  }

  // SEQUENCER

  this.seq = new Gibberish.Sequencer({
    values:[ this.playSound ], durations:[ this.smppn ]
  }).start()
  
  // TIME SYNC'ED WITH THE SERVER

  this.ts = timesync.create({
    server: '/timesync',
    interval: 5000
  });

  this.ts.on('change', function(offsetMs) {
    app.syncCount++;
    app.socket.emit('sync', app.syncCount);
  })

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
  app.pointerDown = true;
});
$('body').on('pointerup pointerout pointerleave', function(event) {
  app.pointerDown = false;
});


