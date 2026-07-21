ig.module("game.feature.combat.model.combat-condition.carn").requires("game.feature.combat.model.combat-params").defines(function() {
    sc.COMBAT_CONDITION.RESET_BLOCKED_HITS = ig.Class.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function(a) {
        if(a && a.combo) a.combo.guardedHits = 0;
    },
    check: function(a) {
      if(a && a.combo) a.combo.guardedHits = 0;
      return true;
    }
  });
});

ig.module("game.feature.combat.combat-action-steps.carn").requires("impact.base.animation", "impact.base.action", "impact.base.entity", "game.feature.combat.entities.drop", "game.feature.combat.entities.combatant", "game.feature.combat.entities.combat-proxy", "impact.feature.effect.effect-steps", "game.feature.combat.combat-sweep").defines(function() {
  ig.ACTION_STEP.CONSUME_SP_TARGET = ig.ActionStepBase.extend({
      _wm: new ig.Config({
        attributes: {
          sp: {
            _type: "Integer",
            _info: "Number of SP to consume"
          }
        }
      }),
      init: function(a) {
        this.sp = a.sp
      },
      start: function(a) {
        var b = a.getTarget();
        if (!b) return true;
        b.params.consumeSp(this.sp)
      }
    });
});

ig.module("impact.feature.navigation.navigation-steps.carn").requires("impact.feature.navigation.navigation", "impact.base.action", "impact.base.event").defines(function() {
  ig.ACTION_STEP.SET_ATTRIB_CLOSE_TARGET_POS_CONNECT = ig.ActionStepBase.extend({
    name: null,
    distance: 0,
    searchType: null,
    _wm: new ig.Config({
      attributes: {
        name: {
          _type: "String",
          _info: "Name of actor attribute to set"
        },
        searchType: {
          _type: "Number",
          _info: "Determines where position is searched relative to target",
          _select: ig.NAV_CLOSE_POINT_SEARCH
        },
        distance: {
          _type: "Number",
          _info: "Preferred distance to target. Might end up being smaller"
        },
        centralAngle: {
          _type: "Number",
          _info: "How much to circle around preferred position. 1 = full circle",
          _default: 0.7
        },
        dirRotate: {
          _type: "Number",
          _info: "Additional rotation to preferred placement direction (relative to target)",
          _optional: true
        },
        throwing: {
          _type: "Boolean",
          _info: "True entity should be able to throw at target from found position"
        },
        offset: {
          _type: "Offset",
          _info: "Offset to position",
          _optional: true
        },
        changeConnected: {
          _type: "String",
          _info: "Change attribute to an entity connected to this one",
          _select: ig.ACTOR_ATTRIB_CONNECTION,
          _optional: true
        }
      }
    }),
    init: function(a) {
      this.name = a.name;
      this.searchType = ig.NAV_CLOSE_POINT_SEARCH[a.searchType] || ig.NAV_CLOSE_POINT_SEARCH.RANDOM;
      this.distance = a.distance || 32;
      this.centralAngle = a.centralAngle || 0.7;
      this.dirRotate = a.dirRotate || 0;
      this.throwing = a.throwing || false;
      this.offset = a.offset || null
      this.a = a;
      if (a.changeConnected) this.changeConnected = ig.ACTOR_ATTRIB_CONNECTION[a.changeConnected]
    },
    run: function(b) {
      var c = Vec3.create(),
        d = b.getTarget();
        b = this.changeConnected && this.changeConnected(b) || b;
        var a = this.a || b;
      if (d) {
        ig.navigation.getClosePosition(c,
          b.getAlignedPos(ig.ENTITY_ALIGN.BOTTOM, a), b.coll.size, d, null, this.distance, this.centralAngle, this.dirRotate, this.searchType, this.throwing);
        this.offset && Vec3.add(c, this.offset);
        b.setAttribute(this.name, c)
      }
      return true
    }
  });
})
