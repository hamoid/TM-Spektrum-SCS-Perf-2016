/// --- Sockets - https://pixijs.github.io/docs/
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
        app.sounds.noiseAdsr.run();
      break;
      default:
        app.sounds.noiseAdsr.run();
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

  this.texts = [];
  this.segments = [];

  this.segments.push(RhythmicDecayAttack);
  this.texts.push('a');
  this.segments.push(RhythmicDetuneAttack);
  this.texts.push('b');
  this.segments.push(RhythmicFixedRandom);
  this.texts.push('c');
  this.segments.push(RhythmicFixedRandomMorph);
  this.texts.push('d');
  this.segments.push(RhythmicSawNoise);
  this.texts.push('e');
  this.segments.push(RhythmicRandomNote);
  this.texts.push('f');
  this.segments.push(RhythmicRandomNoteCutOff);
  this.texts.push('g');
  
  this.currentSegmentFunc = function() {};

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
  this.onPointerDown = function() {
    app.pointerDown = true;
    //if(app.segment == 0) {
    //  app.sounds.sinAdsr.run();
    //}
  }
  this.onPointerUp = function() {
    app.pointerDown = false;
    //app.sounds.sinAdsr.stop();
  }

  // sync count
  this.syncCount = 0;

  // time
  this.startTime = 0;
  this.endTime = 0;
  this.normTime = null;
  this.segment = null;
  this.segmentPrev = null;
  this.normSegmentTime = null;

  // SOCKET

  this.socket = io();

  this.socket.on('players', function(players){
    var list = _.map(players, function(obj, id) {
      return 'id:' + id + ' sync:' + obj.syncCount + ' ip:' + obj.ip;
    }).join('<br/>');
    $('#overlay').html('<b>participants</b><br/>' + list);
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
    //var s = app.sounds.sine;
    //s.frequency = 20 + 500 * pos.x;
    //s.amp = 0;//1 - pos.y;
    // here we should update playing sound

  }

  // SOUNDS

  //sound 0
  this.sounds.poly = new Gibberish.PolySynth({ attack:88200, decay:88200, maxVoices:10 });
  this.sounds.poly.connect();

  //sound 1
  //this.sounds.sine = new Gibberish.Sine( 440, Add( .5 * this.pos.x));
  //this.sounds.sine.connect();

  //sound 2
  this.sounds.sawSynth = new Gibberish.Synth({ attack:44, decay:44100 }).connect();
  this.sounds.sawSynth.waveform = "Saw";

  //sound 3
  this.sounds.noiseAdsr = new Gibberish.ADSR(200, 220, 0, 2050, 1, .35, false);
  this.sounds.noise = new Gibberish.Noise(Mul(.5, this.sounds.noiseAdsr)).connect();

  //sound 4 - (attack, decay, sustain, release,   attackLevel, sustainLevel, requireReleaseTrigger)
  //this.sounds.sinAdsr = new Gibberish.ADSR(200, 220, 0, 2050,  1, 1, true);
  //this.sounds.sinAbe = new Gibberish.Sine2(440, Mul(0.5, this.sounds.sinAdsr)).connect();
  // this.sounds.sinAbe.amp = 0;

  //fx 1
  this.soundFx.vibrato = new Gibberish.Vibrato({
    input:this.sounds.poly,
    rate:4,
    amount:0.2 // try 100
  });
  this.soundFx.vibrato.connect();

  //fx 2
  this.soundFx.filter = new Gibberish.Filter24({input:this.sounds.sawSynth, cutoff:.2, resonance:4});
  this.soundFx.filter.isLowPass = true;

  // ***

  this.playSound = function() {
    var now = app.ts.now();
    app.normTime = (now - app.startTime) / (app.endTime - app.startTime);

    // split full duration in smaller segments
    var timeInScore = app.normTime * app.segmentCount;
    app.segment = Math.floor(timeInScore);
    app.normSegmentTime = (timeInScore % 1);

    var currSegment = app.segment % app.segments.length;
    app.currentSegmentFunc = app.segments[currSegment];
    if(app.segment != app.segmentPrev) {
      app.segmentPrev = app.segment;
      $('#instructions').text(app.texts[currSegment]);
    }

    if(app.pointerDown && app.normTime > 0 && app.normTime < 1) {
      app.currentSegmentFunc();

      // show dot somewhere
      app.gfx.stage.children[0].x = Math.random() * window.innerWidth;
    } else {
      // hide dot
      app.gfx.stage.children[0].x = -20;
    }
    app.gfx.updateProgress(app.segment, app.normTime);

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

$('#instructions').text('please wait for the show to begin');

// EVENTS
// Firefox Linux 64bit issue: 'pointerdown' triggered only once
$('body').on('pointerdown', app.onPointerDown);
$('body').on('pointerup pointerout pointerleave', app.onPointerUp);
$('body').on('keypress', function(event) {
  if(event.which == 115) {
    app.socket.emit('start');
  }
});
