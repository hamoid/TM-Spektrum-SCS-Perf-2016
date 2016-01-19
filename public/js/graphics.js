// --- Graphics - https://pixijs.github.io/docs/

var GFX = function() {
  this.stage = new PIXI.Container();
  this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
    clearBeforeRender: false,
    preserveDrawingBuffer: true
  });
  this.mousePos = { x:0, y:0 };
  this.normCtrlPos = { x:0, y:0 };
  this.onCtrlUpdate = function() {};

  // mouse tweener (higher speed interpolator)
  // trying to avoid clicking when interpolating the volume
  // (y value). When changing 0.001 every 5ms there's no clicking,
  // but it's too slow.
  var mousePos = this.mousePos;
  var normCtrlPos = this.normCtrlPos;
  this.mouseTweener = window.setInterval(function() {
    if(mousePos.x >= 0 && mousePos.x <= 1 && mousePos.y >= 0 && mousePos.y <= 1) {
      normCtrlPos.x = 0.95 * normCtrlPos.x + 0.05 * mousePos.x;
      normCtrlPos.y += normCtrlPos.y < mousePos.y ? 0.002 : -0.002;
    }
    if(app.gfx.onCtrlUpdate) {
      app.gfx.onCtrlUpdate(normCtrlPos);
    }
  }, 5);

  this.segmentGfx = null;
  this.timelineGfx = null;
}
GFX.prototype = {
  constructor: GFX,

  draw: function() {
    // This breaks oop. Only one instance possible.
    var self = app.gfx;

    self.renderer.render(self.stage);
    var len = self.stage.children.length;
    for(var i=0; i<len; i++) {
      var child = self.stage.children[i];
      var scale = child.scale.x * 0.9;
      if(scale > 1) {
        child.scale = { x:scale, y:scale };
      }
    }
    requestAnimationFrame(self.draw);
  },

  updateProgress: function(segment, normSegmentTime) {
    app.gfx.segmentGfx.x = app.gfx.timelineGfx.x + app.gfx.segmentGfx.width * segment;
  },

  getCircleTexture: function() {
    if(!this.circleTexture) {
      var circleShape = new PIXI.Graphics();
      circleShape.lineStyle(0);
      circleShape.beginFill(0xFFFFFF);
      circleShape.drawCircle(15, 15, 1.5);
      circleShape.endFill();

      this.circleTexture = circleShape.generateTexture();
    }

    return this.circleTexture;
  },

  populateStage: function() {
    var width = this.renderer.width;
    var height = this.renderer.height;
    var margin = 50;
    var timelineWidth = width - margin * 2;
    var timelineHeight = 100;
    var segmentWidth = timelineWidth / app.segmentCount;

    for(var i=0; i<1; i++) {
      var s = new PIXI.Sprite(this.getCircleTexture());
      s.anchor.set(0.5);
      s.x = 0;
      s.y = 100;
      this.stage.addChild(s);
    }

    // current segment indicator
    this.segmentGfx = new PIXI.Graphics();
    this.segmentGfx.beginFill(0xFFFFFF, 0.2);
    this.segmentGfx.drawRect(0, 0, segmentWidth, timelineHeight);
    this.segmentGfx.endFill();
    this.stage.addChild(this.segmentGfx);

    // fade out effect
    var cover = new PIXI.Graphics();
    cover.beginFill(0x000000, 0.03);
    cover.drawRect(0, 0, width, height);
    cover.endFill();
    this.stage.addChild(cover);

    // control surface for mouse interaction
    var ctrl = new PIXI.Graphics();
    ctrl.lineStyle(1, 0xCCCCCC, 1);
    ctrl.drawRect(100, 100, 400, 400);
    // interaction
    ctrl.interactive = true;
    var pos = this.mousePos;
    ctrl.on('mousemove', function(ev) {
      var g = ev.data.global;
      pos.x = (g.x - 100) / 400;
      pos.y = (g.y - 100) / 400;
    });
    this.stage.addChild(ctrl);

    this.timelineGfx= new PIXI.Graphics();
    this.timelineGfx.y = height - timelineHeight - margin;
    this.timelineGfx.x = margin;
    this.timelineGfx.lineStyle(1, 0x666462, 1);
    this.timelineGfx.drawRect(0, 0, timelineWidth, timelineHeight);
    for(var x=segmentWidth; x<timelineWidth-segmentWidth; x+=segmentWidth) {

      this.timelineGfx.moveTo(x, 0);
      this.timelineGfx.lineTo(x, timelineHeight);
    }
    this.stage.addChild(this.timelineGfx);

    this.segmentGfx.x = this.timelineGfx.x;
    this.segmentGfx.y = this.timelineGfx.y;
  }

}




