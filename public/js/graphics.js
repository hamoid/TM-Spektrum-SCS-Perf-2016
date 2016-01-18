// --- Graphics - https://pixijs.github.io/docs/

var GFX = function() {
  this.stage = new PIXI.Container();
  this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
    clearBeforeRender: false,
    preserveDrawingBuffer: true
  });
}
GFX.prototype = {
  constructor: GFX,

  draw: function() {
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
    for(var i=0; i<1; i++) {
      var s = new PIXI.Sprite(this.getCircleTexture());
      s.anchor.set(0.5);
      s.x = 50 + (window.innerWidth - 100) * Math.random();
      s.y = 50 + (window.innerHeight - 100) * Math.random();

      this.stage.addChild(s);
    }
    var cover = new PIXI.Graphics();
    cover.beginFill(0x000000, 0.03);
    cover.drawRect(0, 0, this.renderer.width, this.renderer.height);
    cover.endFill();
    this.stage.addChild(cover);
  }

}




