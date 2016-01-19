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

var RhythmicDecayAttack = function () {
    var synth = app.sounds.poly;
    synth.decay = 22500 * app.pos.x;
    synth.attack = 22500 * app.pos.y;

    synth.resonance = 1;

    var note = [12, 14, 19, 24, 26, 29][Math.floor(Math.random() * 6)];
    synth.note(220 * Math.pow(1.059463094359, note));
};

var RhythmicDetuneAttack = function () {
    var synth = app.sounds.poly;
    synth.attack = 22500 * app.pos.y;
    synth.decay = 200;
    synth.resonance = 1;

    var note = [12, 14, 19, 24, 26, 29][Math.floor(Math.random() * 6)];
    synth.note(220 * Math.pow(1.059463094359, note) + app.pos.x * 50);
};

var RhythmicFixedRandom = function () {
    var synth = app.sounds.poly;
    synth.decay = 22500 * app.pos.x;
    synth.attack = 10000 * app.pos.y;
    synth.resonance = 1;

    var note = [12, 14, 19, 24, 26, 29][app.id];
    synth.note(220 * Math.pow(1.059463094359, note));
};

var RhythmicFixedRandomMorph = function () {
    var synth = app.sounds.poly;
    synth.decay = 200;
    synth.attack = 10000 * app.pos.y;
    synth.resonance = 1;
    synth.amp = 1. - app.pos.x;

    var saw = app.sounds.sawSynth;
    saw.decay = 200;
    saw.attack = 10000 * app.pos.y;
    saw.resonance = 1;
    saw.cutoff = 0.8;
    saw.amp = app.pos.x;

    var note = [12, 14, 19, 24, 26, 29][app.id];
    synth.note(220 * Math.pow(1.059463094359, note));
    saw.note(220 * Math.pow(1.059463094359, note));
};

// nr. 4
var RhythmicSawNoise = function () {
  //x : amp, y : attack,
    var id = app.id % 3;

    switch (id)
    {
      case 0:
      case 1:
        var synth = (id == 0) ? app.sounds.poly : app.sounds.sawSynth;
        synth.decay = 200;
        synth.attack = 10000 * app.pos.y;
        synth.resonance = 1;
        synth.cutoff = 0.8;
        synth.amp = 0.5 * app.pos.x;

        var note = [12, 14, 19, 24, 26, 30][app.id];
        synth.note(220 * Math.pow(1.059463094359, note));
      break;
      case 2:
        var noise = app.sounds.noise;
        noise.run();
      break;
      default:
        var noise = app.sounds.noise;
        noise.run();
    }
};

// nr. 5
// increase or decrease the probability of triggering the note
// move right to increase the probability of triggering the note
var RhythmicRandomNote = function () {
    if (app.pos.x >= Math.random())
    {
      var id = app.id % 2;
      var synth = (id) ? app.sounds.poly : app.sounds.sawSynth;

      synth.decay = 200;
      synth.attack = 10000 * app.pos.y;
      synth.resonance = 1;
      synth.cutoff = 0.8;
      //synth.amp = 0.5;

      if (id == 0)
      {
        // todo: change note sequence
        var note = [12, 14, 19, 33, 30, 31][Math.floor(Math.random() * 6)];
        synth.note(110 * Math.pow(1.059463094359, note));
      }
      else
      {
        var note = [12, 14, 19, 33, 30, 31][Math.floor(Math.random() * 6)];
        synth.note(124.3 * Math.pow(1.059463094359, note));
      }
    }
};

// nr. 6
// move left & right cutoff, up & down resonance
var RhythmicRandomNoteCutOff = function () {
    var id = app.id % 2;
    var synth = app.sounds.sawSynth;

    synth.decay = 20000;
    synth.attack = 2000;
    synth.resonance = 1;

    console.log(app.pos.x)
    app.soundFx.filter.cutoff = app.pos.x;
    app.soundFx.filter.resonance = 4 * app.pos.y;
    //synth.amp = 0.5;

    if (id == 0)
    {
      // todo: change note sequence
      var note = [12, 14, 19, 33, 30, 31][Math.floor(Math.random() * 6)];
      synth.note(110 * Math.pow(1.059463094359, note));
    }
    else
    {
      var note = [12, 14, 19, 33, 30, 31][Math.floor(Math.random() * 6)];
      synth.note(124.3 * Math.pow(1.059463094359, note));
    }
};

var APP = function() {
  this.sounds = {};
  this.soundFx = {};

  this.segments = [];
  this.segments.push(RhythmicDecayAttack);
  this.segments.push(RhythmicDetuneAttack);
  this.segments.push(RhythmicFixedRandom);
  this.segments.push(RhythmicFixedRandomMorph);
  this.segments.push(RhythmicSawNoise);
  this.segments.push(RhythmicRandomNote);
  this.segments.push(RhythmicRandomNoteCutOff);
  // this.segments.push();
  // this.segments.push();
  // this.segments.push();

  this.id = Math.floor(Math.random() * 6);

  this.pos = {x:0, y:0};

  // split the performance in segments, each with unique sound
  this.segmentCount = 30;

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

  this.gfx = new GFX(this.segmentCount);

  this.gfx.onCtrlUpdate = function(pos) {
    app.pos.x = pos.x;
    app.pos.y = pos.y;

    // test sinewaves
    var s = app.sounds.sine;
    s.frequency = 20 + 500 * pos.x;
    s.amp = 0;//1 - pos.y;

  }

  // SOUNDS

  //sound 0
  this.sounds.poly = new Gibberish.PolySynth({ attack:88200, decay:88200, maxVoices:10 });
  this.sounds.poly.connect();

  //sound 1
  this.sounds.sine = new Gibberish.Sine( 440, Add( .5 * this.pos.x));
  this.sounds.sine.connect();

  //sound 2
  this.sounds.sawSynth = new Gibberish.Synth({ attack:44, decay:44100 }).connect();
  this.sounds.sawSynth.waveform = "Saw";

  //sound 3
  adsr = new Gibberish.ADSR(200, 220, 0, 2050, 1, .35, false);
  synth_test = new Gibberish.Noise(Mul(.5, adsr)).connect();
  //this.sounds.push(new Gibberish.Noise(Mul(.5, adsr)).connect());
  this.sounds.noise = adsr;

  this.soundFx.vibrato = new Gibberish.Vibrato({
    input:this.sounds.poly,
    rate:4,
    amount:0.2 // try 100
  });
  this.soundFx.vibrato.connect();

  // soundFx[1]

  this.soundFx.filter = new Gibberish.Filter24({input:this.sounds.sawSynth, cutoff:.2, resonance:4});
  this.soundFx.filter.isLowPass = true;

  this.playSound = function() {
    var now = app.ts.now();
    var normTime = (now - app.startTime) / (app.endTime - app.startTime);

    // split full duration in smaller segments
    var timeInScore = normTime * app.segmentCount;
    var segment = Math.floor(timeInScore);
    var normSegmentTime = (timeInScore % 1);

    if(app.pointerDown && app.startTime > 0) {

      app.segments[6]();

      // show dot somewhere
      app.gfx.stage.children[0].x = Math.random() * window.innerWidth;
    } else {
      // hide dot
      app.gfx.stage.children[0].x = -20;
    }
    app.gfx.updateProgress(segment, normSegmentTime);

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


