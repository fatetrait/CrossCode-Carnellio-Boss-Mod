
ig.module("game.feature.combat.combat-action-steps.carnPre").requires("impact.base.action", "impact.base.actor-entity").defines(function () {
  ig.ACTION_STEP.MATCH_LEA_FACE = ig.ActionStepBase.extend({
    face: null,
    rotate: false,
    rotateSpeed: 3,
    _wm: new ig.Config({
      attributes: {
        rotate: {
          _type: "Boolean",
          _info: "Rotate entity toward direction",
          _default: true
        },
        rotateSpeed: {
          _type: "Number",
          _info: "Speed of rotation. Full circles per second",
          _default: 3
        }
      }
    }),
    init: function(a) {
      this.rotate =
        a.rotate || false;
      this.rotateSpeed = a.rotateSpeed || 3
    },
    start: function() {
    },
    run: function(b) {
      Vec2.assignC(b.coll.accelDir, 0, 0);
      var c = b.combatant.face;
      if (this.rotate) return Vec2.rotateToward(b.face, c, Math.PI * 2 * ig.system.tick * this.rotateSpeed);
      Vec2.assign(b.face, c);
      return true
    }
  });

  ig.ACTION_STEP.MATCH_LEA_FACE_SAVE = ig.ActionStepBase.extend({
    face: null,
    rotate: false,
    rotateSpeed: 3,
    _wm: new ig.Config({
      attributes: {
        rotate: {
          _type: "Boolean",
          _info: "Rotate entity toward direction",
          _default: true
        },
        rotateSpeed: {
          _type: "Number",
          _info: "Speed of rotation. Full circles per second",
          _default: 3
        }
      }
    }),
    init: function(a) {
      this.rotate =
        a.rotate || false;
      this.rotateSpeed = a.rotateSpeed || 3
    },
    start: function() {
    },
    run: function(b) {
      ig.vars.storage.tmp.saveFace = {
        x: b.face.x,
        y: b.face.y
      }
      Vec2.assignC(b.coll.accelDir, 0, 0);
      var c = b.combatant.face;
      if (this.rotate) return Vec2.rotateToward(b.face, c, Math.PI * 2 * ig.system.tick * this.rotateSpeed);
      Vec2.assign(b.face, c);
      console.log("saved face: ", ig.vars.storage.tmp.saveFace)
      console.log("set face: ", b.face)
      return true
    }
  });

  ig.ACTION_STEP.MATCH_LEA_FACE_LOAD = ig.ActionStepBase.extend({
    face: null,
    rotate: false,
    rotateSpeed: 3,
    _wm: new ig.Config({
      attributes: {
        rotate: {
          _type: "Boolean",
          _info: "Rotate entity toward direction",
          _default: true
        },
        rotateSpeed: {
          _type: "Number",
          _info: "Speed of rotation. Full circles per second",
          _default: 3
        }
      }
    }),
    init: function(a) {
      this.rotate =
        a.rotate || false;
      this.rotateSpeed = a.rotateSpeed || 3
    },
    start: function() {
    },
    run: function(b) {
      Vec2.assignC(b.coll.accelDir, 0, 0);
      var c = ig.vars.storage.tmp.saveFace;
      console.log("using saved face: ", c)
      if (this.rotate) return Vec2.rotateToward(b.face, c, Math.PI * 2 * ig.system.tick * this.rotateSpeed);
      Vec2.assign(b.face, c);
      return true
    }
  });
})