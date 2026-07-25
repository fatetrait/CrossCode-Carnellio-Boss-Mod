
ig.module("game.feature.combat.combat-action-steps.carn").requires("impact.base.animation", "impact.base.action", "impact.base.entity", "game.feature.combat.entities.drop", "game.feature.combat.entities.combatant", "game.feature.combat.entities.combat-proxy", "impact.feature.effect.effect-steps", "game.feature.combat.combat-sweep").defines(function () {
  ig.ACTION_STEP.CONSUME_SP_TARGET = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {
        sp: {
          _type: "Integer",
          _info: "Number of SP to consume"
        }
      }
    }),
    init: function (a) {
      this.sp = a.sp
    },
    start: function (a) {
      var b = a.getTarget();
      if (!b) return true;
      b.params.consumeSp(this.sp)
    }
  });

  ig.ACTION_STEP.PLAYER_PERFECT_PARRY_PRE = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function (a) {
      ig.vars.set("tmp.pShieldCheck", ig.vars.storage.playerVar.input.perfectShield);
    },
    start: function (a) {
      ig.vars.set("tmp.pShieldCheck", ig.vars.storage.playerVar.input.perfectShield);
    }
  });
});

ig.module("impact.feature.navigation.navigation-steps.carn").requires("impact.feature.navigation.navigation", "impact.base.action", "impact.base.event").defines(function () {
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
    init: function (a) {
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
    run: function (b) {
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


ig.module("game.feature.player.player-steps.carn").requires("impact.base.animation", "impact.base.action", "impact.base.entity", "game.feature.player.player-config", "game.feature.combat.model.combat-params", "impact.feature.camera.camera", "game.feature.combat.entities.food-icon", "game.feature.party.party").defines(function () {
  ig.ACTION_STEP.ADD_ELEMENT_LOAD = ig.ActionStepBase.extend({
    value: null,
    _wm: new ig.Config({
      attributes: {
        value: {
          _type: "Number",
          _info: "Value of load. 0=empty, 1=full (instant elemental overload)"
        }
      }
    }),
    init: function (a) {
      this.value = a.value || 0
    },
    start: function () {
      sc.model.player.addElementLoad(this.value)
    }
  });
})


ig.module("game.feature.combat.model.combat-condition.carn").requires("impact.base.action", "impact.base.actor-entity", "game.feature.combat.model.combat-params", "impact.base.animation", "impact.base.entity", "game.feature.player.player-config").defines(function () {
  sc.COMBAT_CONDITION.PLAYER_HAS_SHIELD = ig.Class.extend({
    name: null,
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function (a) {
    },
    check: function (a) {
      return ig.game.playerEntity.hasShield()
    }
  });

  sc.COMBAT_CONDITION.PLAYER_PERFECT_PARRY = ig.Class.extend({
    name: null,
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function (a) {
    },
    check: function (a) {
      return ig.vars.storage.playerVar.input.perfectShield > ig.vars.storage.tmp.pShieldCheck
    }
  });

  sc.COMBAT_CONDITION.RESET_BLOCKED_HITS = ig.Class.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function (a) {
      if (a && a.combo) a.combo.guardedHits = 0;
    },
    check: function (a) {
      if (a && a.combo) a.combo.guardedHits = 0;
      return true;
    }
  });


})


ig.module("game.feature.msg.msg-steps.carn").requires("impact.base.action", "impact.base.event", "game.feature.msg.message-model", "game.feature.character.character", "game.feature.gui.widget.demo-stats", "game.feature.gui.widget.demo-highscore", "game.feature.msg.gui.dream-msg").defines(function () {
  ig.ACTION_STEP.SHOW_SIDE_MSG = ig.ActionStepBase.extend({
    charExpression: null,
    message: null,
    hiCount: 0,
    _wm: new ig.Config({
      attributes: {
        person: {
          _type: "PersonExpression",
          _info: "Person + Exporession of message"
        },
        message: {
          _type: "LangLabel",
          _info: "Message to display",
          _large: true
        }
      },
      label: function () {
        return "<b>SHOW_SIDE_MSG</b> <em>" + wmPrint("PersonExpression", this.person) + "</em>: <i>" + wmPrint("LangLabel", this.message) + "</i>"
      }
    }),
    init: function (a) {
      this.charExpression = new sc.CharacterExpression(a.person.person, a.person.expression);
      this.message = new ig.LangLabel(a.message);
      ig.langEdit && ig.langEdit.submitMap("Side MSG " + this.charExpression.character.name, this.message);
    },
    clearCached: function () {
      this.charExpression.decreaseRef()
    },
    start: function () {
      ig.langEdit && ig.langEdit.submitRecent("Side MSG " + this.charExpression.character.name, this.message);
      sc.model.message.showSideMessage(this.charExpression, this.message)
    }
  });
  ig.ACTION_STEP.SET_LEA_HP_CRITICAL = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function() {},
    start: function(a) {
      sc.model.player.params.setCritical()
    }
  });

  ig.ACTION_STEP.BLOCK_CONSUMABLE_EXTEND = ig.ActionStepBase.extend({
    target: Vec2.create(),
    _wm: new ig.Config({
      attributes: {
        time: {
          _type: "Number",
          _info: "Time to extend block consumables"
        }
      }
    }),
    init: function (a) {
      this.time = a.time;
    },
    start: function (a) {
      sc.model.player.itemBlockTimer += this.time;
    },
  });
})