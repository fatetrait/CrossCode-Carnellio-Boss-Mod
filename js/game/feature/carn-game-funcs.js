
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
      //console.log("CONSUME_SP_TARGET: " + this.sp, a, b);
      if (!b) return true;
      if (b.params.consumeSp) return b.params.consumeSp(this.sp)
      b.model && b.model.params && b.model.params.consumeSp && b.model.params.consumeSp(this.sp)
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

  ig.ACTION_STEP.SET_CURRENT_EXE_SIGIL = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {
      }
    }),
    init: function () {
    },
    start: function (a) {
      ig.vars.set("tmp.currentExe", ig.vars.storage.tmp["sigil" + ig.vars.storage.tmp.exeIndex]);
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
  ig.ACTION_STEP.FORCE_START_S_RANK = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function () { },
    start: function () {
      sc.model.forceStartSRank()
    }
  });
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
    start: function (a) {

      //console.log("ADD_ELEMENT_LOAD: " + this.value, a);

      var b = a.getTarget();
      if (!b || b.params.combatant.animSheet.cacheKey != "player") return true;
      sc.model.player.addElementLoad(this.value)
      // var b = a;
      // //console.log("b: ", b);
      // if (!b) return true;
      // var comb = b.combo || b.combatant.combo;
      // if (!b || !comb || !comb.hitCombatants) return true;
      // for (var c = 0; c < comb.hitCombatants.length; c++) {
      //   var m = comb.hitCombatants[c];
      //   m && (m.name == "Lea" || m.animSheet.cacheKey == "player") && sc.model.player.addElementLoad(this.value)
      // }
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


ig.module("game.feature.msg.msg-steps.carn").requires("game.feature.combat.model.combat-params", "impact.base.action", "impact.base.event", "game.feature.msg.message-model", "game.feature.character.character", "game.feature.gui.widget.demo-stats", "game.feature.gui.widget.demo-highscore", "game.feature.msg.gui.dream-msg").defines(function () {
  var j = Vec2.create(),
    o = Vec2.create(),
    d = Vec3.create();
  var target = null;
  ig.ACTION_STEP.SET_FACE_SPEED_PREDICT = ig.ActionStepBase.extend({
    projectileSpeed: false,
    _wm: new ig.Config({
      attributes: {
        moveTime: {
          _type: "Number",
          _info: "Time predicted for target to move to destination"
        },
        speedTime: {
          _type: "Number",
          _info: "Time to move to predicted location (affects speed)"
        },
        dontSlower: {
          _type: "Boolean",
          _info: "If true, only set face if the new speed would be slower"
        },
      }
    }),
    init: function (a) {
      this.moveTime = a.moveTime || 1;
      this.speedTime = a.speedTime || 1;
      this.dontSlower = a.dontSlower || false;
    },
    run: function (actor) {
      target = actor.getTarget();

      if (target) {
        Vec2.assignC(j, target.coll.pos.x + target.coll.size.x / 2, target.coll.pos.y + target.coll.size.y / 2);
        //j = target.getCenter();
        //o = actor.getCenter();
        Vec2.assignC(o, actor.coll.pos.x + actor.coll.size.x / 2, actor.coll.pos.y + actor.coll.size.y / 2);
        Vec2.addMulF(j, target.coll.vel, this.moveTime);
        Vec2.sub(j, o, actor.face);
        //newSpeed = ;
        (actor.coll.maxVel = Vec2.distance(j, o) / this.speedTime);
        return true;
        // if (this.dontSlower && newSpeed < actor.coll.maxVel) {
        //     return true;
        // }
        // actor.coll.maxVel = newSpeed;
      }
      return true;
    }
  });
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
    init: function () { },
    start: function (a) {
      sc.model.player.params.setCritical()
    }
  });

  ig.ACTION_STEP.SET_TEMP_TARGET_GUARDED_ALL = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {
      }
    }),
    init: function () {
    },
    start: function (a) {
      let x = a.combo.guardedEntity;
      if (x && (x.isBall || !x.animSheet || !x.animSheet.cacheKey)) {
        x = x.attackInfo.attackerParams.combatant;
      }
      a.tmpTarget = x;
    }
  });
  ig.ACTION_STEP.SAVE_TARGET = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function () { },
    start: function (a) {
      !ig.vars.storage.tmp.savedTarget && (ig.vars.storage.tmp.savedTarget = a.getTarget());
    }
  });
  ig.ACTION_STEP._LOAD_CURRENT_SIGIL = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function () { },
    start: function (a) {
      if (ig.vars.storage.tmp.sigilIndex < 0) return;
      ig.vars.storage.tmp.currentSigil = ig.vars.storage.tmp["sigil" + ig.vars.storage.tmp.sigilIndex];
    }
  });

  ig.ACTION_STEP.LOAD_TARGET = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function (a) { },
    start: function (a) {
      if (ig.vars.storage.tmp.savedTarget) {
        var updatedTarget = sc.combat.activeCombatants[1].find(c => c.animSheet.cacheKey == ig.vars.storage.tmp.savedTarget.animSheet.cacheKey);
        if (updatedTarget && !updatedTarget.isDefeated()) {
          a.setTarget(updatedTarget);
          a.tmpTarget = updatedTarget;
        }
        // a.setTarget(ig.vars.storage.tmp.savedTarget);
        //a.tmpTarget = ig.vars.storage.tmp.savedTarget;
      }
    }
  });

  ig.ACTION_STEP.ACTUALIZE_TARGET = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function () { },
    start: function (a) {
      //console.log("ACTUAL WAS CLALLED");
      a.tmpTarget && a.setTarget(a.tmpTarget);
    }
  });

  sc.COMBAT_CONDITION.NEED_NEW_TARGET = ig.Class.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function () { },
    check: function (a) {
      //return false;
      let tempTarg = a.getTarget();
      let returner = (!tempTarg || tempTarg.params.defeated);
      //console.log(returner, a, tempTarg)
      return returner
    }
  });

  ig.ACTION_STEP.CLEAR_FIRST_HIT = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function (a) { },
    start: function (a) {
      a.combo.hitCombatants = [];
      a.combo.guardedHits = 0;
    }
  });

  ig.ACTION_STEP.CARN_DEBUG = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    init: function () { },
    start: function (a) {
      console.log("WAS CLALLED");
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


      var b = a.getTarget();
      // console.log("BLOCK CONSUME: " + this.sp, a, b);
      if (b && b.model && b.model.healing) b.model.healing.cooldown += this.time
      if (!b || b.params.combatant.animSheet.cacheKey != "player") return true;
      sc.model.player.itemBlockTimer += this.time



      // var b = a;
      // if (!b) return true;
      // b.itemBlockTimer += this.time
      // var comb = b.combo || b.combatant.combo;
      // if (!b || !comb || !comb.hitCombatants) return true;
      // for (var c = 0; c < comb.hitCombatants.length; c++) {
      //   var m = comb.hitCombatants[c];
      //   m && (m.name == "Lea" || m.animSheet.cacheKey == "player") && sc.model.player.itemBlockTimer ? b.itemBlockTimer += this.time : null;
      // }
    },
  });

  var b = [{
    level: 1,
    base: 24,
    hp: 200,
    credits: 5
  }, {
    level: 6,
    base: 32,
    hp: 300,
    credits: 23
  }, {
    level: 11,
    base: 45,
    hp: 420,
    credits: 50
  }, {
    level: 16,
    base: 63,
    hp: 600,
    credits: 80
  }, {
    level: 21,
    base: 84,
    hp: 800,
    credits: 115
  }, {
    level: 26,
    base: 105,
    hp: 1100,
    credits: 160
  }, {
    level: 31,
    base: 132,
    hp: 1500,
    credits: 210
  }, {
    level: 36,
    base: 163,
    hp: 2E3,
    credits: 290
  }, {
    level: 41,
    base: 199,
    hp: 3E3,
    credits: 380
  }, {
    level: 46,
    base: 236,
    hp: 5E3,
    credits: 490
  }, {
    level: 51,
    base: 278,
    hp: 8E3,
    credits: 610
  },
  {
    level: 56,
    base: 323,
    hp: 1E4,
    credits: 750
  }, {
    level: 61,
    base: 372,
    hp: 12E3,
    credits: 900
  }, {
    level: 66,
    base: 425,
    hp: 13100,
    credits: 1200
  }, {
    level: 71,
    base: 484,
    hp: 15E3,
    credits: 1500
  }, {
    level: 76,
    base: 547,
    hp: 16900,
    credits: 1900
  }, {
    level: 81,
    base: 614,
    hp: 19E3,
    credits: 2400
  }, {
    level: 86,
    base: 687,
    hp: 21200,
    credits: 3E3
  }, {
    level: 91,
    base: 766,
    hp: 23700,
    credits: 3800
  }, {
    level: 96,
    base: 850,
    hp: 26300,
    credits: 4800
  }, {
    level: 99,
    base: 928,
    hp: 28700,
    credits: 6E3
  }
  ];
  ig.ACTION_STEP.INITIALIZE_CARN = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {}
    }),
    getAverageStat: function (a, d) {

      for (var a = a > 99 ? 99 : a, c = b.length; c--;) {
        var e =
          b[c];
        if (e.level <= a) {
          if (e.level == a) return e[d];
          c = b[c + 1];
          return e[d] + (c[d] - e[d]) * ((a - e.level) / (c.level - e.level))
        }
      }
      return 1
    },
    getLevelForAverageStat: function (a) {
      for (var d = b.length; d--;) {
        var c = b[d];
        if (c.base <= a) {
          d = b[d + 1];
          return !d ? 99 : Math.round(c.level + (d.level - c.level) * ((a - c.base) / (d.base - c.base)))
        }
      }
      return 1
    },
    getFactor: function (a, b, c) {
      return this.getAverageStat(b, c) / this.getAverageStat(a, c)
    },
    adaptParams: function (a, b, c) {
      var e = this.getFactor(b, c, "base"),
        a = ig.copy(a);
      //console.log(a, "a.attack: " + a.attack + ", e: " + e);
      a.attack = Math.round(a.attack || a.baseParams.attack * e);
      a.defense = Math.round(a.defense || a.baseParams.defense * e);
      a.focus = 1
      return a
    },
    updateParams: function (a) {
      var b = a.params;
      a.level.overrideCarn && (b = this.adaptParams(a.params, 40, a.level.overrideCarn));
      if (a.elementModes) {
        var c = [];
        c[sc.ELEMENT.NEUTRAL] = ig.copy(b);
        for (var d in sc.ELEMENT) {
          var e = ig.copy(b),
            f = a.elementModes[d],
            o;
          for (o in f)
            if (f[o])
              if (f[o] instanceof Array) {
                e[o] || (e[o] = [1, 1, 1, 1]);
                for (var m = 0; m < f[o].length; ++m) e[o][m] = f[o][m]
              } else e[o] =
                Math.round(f[o] * (e[o] / a.params[o]));
          c[sc.ELEMENT[d]] = e
        }
        a.elementModes.modes = c;
        b = c[a.elementModes.current]
      }
      a.params.setBaseParams(b, true)
    },
    init: function (a) { },
    start: function (a) {
      sc.pvp.points[sc.COMBATANT_PARTY.PLAYER] = 4;
      let newLevel = ig.Event.getExpressionValue(sc.model.player.getParamAvgLevel(4));
      //console.log("INITIALIZE_CARN: newLevel: " + newLevel, a);
      if (newLevel > 45 && !sc.newgame.get("scale-enemies")) {
        //let oldHp = a.params.baseParams.hp - 1;
        newLevel = Math.floor(newLevel / 1.02);
        a.level.overrideCarn = 1 * newLevel;
        //console.log("overrideCarn: " + a.level.overrideCarn, a);
        //a.setLevelOverride();
        this.updateParams(a);
        a.level.override = 1 * newLevel;
        //a.level = Number.parseInt(newLevel);
        a.params.tmpElemFactor = a.params.baseParams.elemFactor;
        a.params.tmpStatusInflict = a.params.baseParams.statusInflict;
        // a.params.baseParams.hp = oldHp;
        // a.params.currentHp = oldHp;
      }

    }
  });

  //i never tested this dont use it
  ig.ACTION_STEP.SHOW_SP_DRAIN = ig.ActionStepBase.extend({
    _wm: new ig.Config({
      attributes: {
        sp: {
          _type: "Number",
          _info: "sp to drain"
        }
      }
    }),
    init: function (a) {
      this.sp = a.sp || 0
    },
    start: function (a) {
      let target = a.getTarget();
      if (!target) return true;
      var e = target.getAlignedPos(ig.ENTITY_ALIGN.CENTER, d);
      ig.ENTITY.HitNumber.spawnSPDrainNumber(e, target, this.sp);

    }
  });
})

ig.module("game.feature.combat.entities.hit-number.carn").requires("impact.base.entity", "impact.base.entity-pool").defines(function () {
  ig.ENTITY.HitNumber.spawnSPDrainNumber =
    // a = this entities center  (?)
    // b = entity to show over
    // c = num to show
    function (a, b, c) {
      var d = sc.HIT_NUMBER_SIZE.M,
        e = sc.HIT_NUMBER_COLOR.PLAYER_CRITICAL;
      ig.game.spawnEntity(ig.ENTITY.HitNumber, a.x, a.y - 8, a.z, {
        number: Math.abs(c),
        numberSize: d,
        numberColor: e,
        numberAppendix: null,
        combatant: b
      })
    };


  let oldSpawnHitNumber = ig.ENTITY.HitNumber.spawnHitNumber;
  ig.ENTITY.HitNumber.spawnHitNumber = function (b, c, d, e, f, g, h, p) {
    oldSpawnHitNumber(b, c, d, e, f, g, h, p);
    console.log("spawning hit number", d, c, c.params.currentHp)
    c.stunData.overkill = c.stunData.overkill || 0;
    c.stunData.overkill = Math.abs(Math.min(0, c.params.currentHp)); // Math.max(0, d - c.params.currentHp);
  }
  // ig.ENTITY.HitNumber.inject({
  //   spawnHitNumber: function(b, c, d, e, f, g, h, p) {
  //     this.parent(b, c, d, e, f, g, h, p);
  //     console.log("spawning hit number", d, c, c.params.currentHp)
  //     c.stunData.overkill = c.stunData.overkill || 0;
  //     c.stunData.overkill += Math.max(0, d - c.params.currentHp);
  //   }
  // })
})

ig.module("impact.feature.base.event-steps.carn").requires("impact.base.utils", "impact.base.event", "impact.base.action").defines(function () {
  ig.EVENT_STEP.CHANGE_VAR_NUMBER_CARN = ig.EventStepBase.extend({
    varName: null,
    changeType: null,
    value: 0,
    _wm: new ig.Config({
      attributes: {
        varName: {
          _type: "VarName",
          _info: "Variable to change"
        },
        changeType: {
          _type: "String",
          _info: "Type of modification",
          _select: {
            set: 1,
            add: 1,
            sub: 1,
            mul: 1,
            div: 1,
            mod: 1
          }
        },
        value: {
          _type: "NumberExpression",
          _info: "Value to modify with"
        },
        map: {
          _type: "Maps",
          _info: "Change Var from within this map. Will replace map. prefix",
          _context: "Map",
          _optional: true
        }
      }
    }),
    init: function (a) {
      assertContent(a, "varName", "changeType",
        "value");
      this.varName = a.varName;
      this.changeType = a.changeType;
      this.value = a.value;
      this.map = a.map
    },
    start: function () {
      var a = ig.Event.getVarName(this.varName);
      if (this.map) {
        a.startsWith("map.") && (a = a.substr(4));
        a = "maps." + this.map.toPath("", "").toCamel() + "." + a
      }
      var b = ig.Event.getExpressionValue(this.value);
      ig.carnAddedValues = ig.carnAddedValues || [];
      ig.carnAddedValues.push(a);
      if (a) {
        b = b * 1;
        if (isNaN(b)) ig.log("CHANGE_VAR_NUMBER: Invalid value!");
        else if (this.changeType == "add") {
          ig[a] = (ig[a] || 0) + b;
        } else if (this.changeType == "sub") {
          ig[a] = (ig[a] || 0) - b;
        } else if (this.changeType == "mul") {
          ig[a] = (ig[a] || 0) * b;
        } else if (this.changeType == "set") {
          ig[a] = b;
        }
        else ig.log("CHANGE_VAR_NUMBER: Invalid change type")
      } else ig.log("CHANGE_VAR_NUMBER: Variable Name is not a String!")
    }
  });


  ig.EVENT_STEP.APPLY_LIFEBLEED = ig.EventStepBase.extend({
    _wm: new ig.Config({
      attributes: {
      }
    }),
    init: function () {
      if (!ig.vars.storage.tmp.isCarn) return;

    },
    start: function (a, b) {

      var p = ig.game.namedEntities.Lea, e = p, f = 3;


      let c = a._actionEntity ? a._actionEntity : a;
      console.log("APPLY_LIFEBLEED: " + p.stunData.overkill, a, b, c, p);
      if (!p.stunData.overkill) return
      let originalOverkill = p.stunData.overkill;
      ig.game.namedEntities.Carnellio.cancelAction();

      let livesLost = Math.floor(p.stunData.overkill / ig.game.namedEntities.Lea.params.baseParams.hp);
      p.stunData.overkill -= livesLost * ig.game.namedEntities.Lea.params.baseParams.hp;
      let extraDmg = Math.min(p.stunData.overkill, ig.game.namedEntities.Lea.params.currentHp - 1);
      e = new ig.GUI.ARBox(e, `Overkill Damage: ${originalOverkill}\nExtra Lives Lost: ${livesLost}\nExtra Damage Taken: ${extraDmg}`, f, "NO_FILL", "RED");
      ig.gui.addGuiElement(e);
      e.setAttachedEntity(p)
      p.stunData.overkill -= extraDmg;
      sc.pvp.points[sc.COMBATANT_PARTY.ENEMY] = Math.min(sc.pvp.points[sc.COMBATANT_PARTY.ENEMY] + livesLost, 5);
      ig.game.namedEntities.Lea.params.reduceHp(extraDmg);
      if (sc.pvp.points[sc.COMBATANT_PARTY.ENEMY] >= 5) {
        sc.pvp.state = 5;
      }
      // if (ig.game.namedEntities.Lea.params.currentHp <= 0) {

      //   // sc.pvp.state = 4;
      //   // //ig.vars.storage.tmp.loopBleed = true;
      //   // ig.game.namedEntities.Lea.params.setDefeated();
      //   // ig.game.namedEntities.Lea.cancelAction();
      //   // ig.game.namedEntities.Lea._onDeathHit(c);
      // } else {
      //   //ig.vars.storage.tmp.loopBleed = false;
      // }
    }
  });

  ig.EVENT_STEP.RESET_VAR_NUMBER_CARN = ig.EventStepBase.extend({
    varName: null,
    changeType: null,
    value: 0,
    _wm: new ig.Config({
      attributes: {
      }
    }),
    init: function (a) {
    },
    start: function () {
      if (ig.carnAddedValues) {
        for (var i = 0; i < ig.carnAddedValues.length; i++) {
          var a = ig.carnAddedValues[i];
          if (a) {
            ig.vars.storage.tmp[a] = ig[a];
            ig[a] = 0;
          }
        }
        ig.carnAddedValues = [];
      }
    }
  });

  ig.EVENT_STEP.PAYOUT_CARN = ig.EventStepBase.extend({
    varName: null,
    changeType: null,
    value: 0,
    _wm: new ig.Config({
      attributes: {
      }
    }),
    init: function (a) {
    },
    start: function (a, b) {
      this.entity = {
        "player": true
      }
      if (ig.berzRewards) {
        let item = "berzerker-memory"
        let amount = ig.berzRewards;
        var c = ig.Event.getEntity(this.entity, b);
        sc.ItemDropEntity.spawnDrops(c, ig.ENTITY_ALIGN.CENTER, ig.game.playerEntity, item, amount, sc.ITEM_DROP_TYPE.EVENT_PROP)
      }
      if (ig.dracRewards) {
        let item = "draconic-memory"
        let amount = ig.dracRewards;
        var c = ig.Event.getEntity(this.entity, b);
        sc.ItemDropEntity.spawnDrops(c, ig.ENTITY_ALIGN.CENTER, ig.game.playerEntity, item, amount, sc.ITEM_DROP_TYPE.EVENT_PROP)
      }
      ig.berzRewards = 0;
      ig.dracRewards = 0;
    }
  });
})


ig.module("game.feature.party.entities.party-member-entity.carn").requires("game.feature.player.entities.player-base").defines(function () {
  sc.PartyMemberEntity.inject({
    getDodgeProbability: function (a) {
      var b = 0.5;
      (a = a.getCombatant()) && (b = sc.EnemyAnno.getUnderstandFactor(a, this, 1));
      a = sc.party.getStrategy("BEHAVIOUR");
      return ((1 - b) * a.dodgeMin + b * a.dodgeMax) * (ig.vars.storage.tmp.isCarn ? 0.3 : 1)
    },
  })
})


ig.module("game.feature.combat.gui.status-bar.carn").requires("impact.feature.gui.gui").defines(function () {
  ig.GUI.StatusBar.inject({
    updateSubHpHandler: function () {
      if (ig.vars.storage.tmp.isCarn) {
        let oldState = sc.pvp.state;
        sc.pvp.state = 0;
        this.parent();
        sc.pvp.state = oldState;
      } else {
        this.parent();
      }
    },
  })
})

// ig.module("game.feature.gui.hud.combat-hud.carn").requires("impact.feature.gui.gui", "impact.feature.gui.base.box").defines(function() {
// var b = {};
//   sc.CombatUpperHud.inject({
//     init: function() {
//       this.parent();
//       this.sub.pvp = new b.PVP
//     },
//   })
//   b.PVP = ig.GuiElementBase.extend({
//     gfx: new ig.Image("media/gui/status-gui.png"),
//     heads: new ig.Image("media/gui/severed-heads.png"),
//     init: function() {
//       this.parent();
//       var a;
//       a = 110 + sc.pvp.winPoints * 10;
//       a = a + (sc.party.getPartySize() + 1) * 16;
//       a = a + sc.pvp.enemies.length * 16;
//       this.setSize(a, 20)
//     },
//     updateDrawables: function(a) {
//       var b = this.hook.size.x / 2;
//       a.addGfx(this.gfx, b - 8, 0, 136, 160, 16, 16);
//       var c = sc.pvp.winPoints;
//       this._renderPoints(a, b - 12 - 4, -1, c, sc.pvp.points[sc.COMBATANT_PARTY.PLAYER], 0);
//       this._renderPoints(a, b + 12, 1, c, sc.pvp.points[sc.COMBATANT_PARTY.ENEMY], 8);
//       for (var c = 12 + c * 5, e = [0], f = 0; f < sc.party.getPartySize(); ++f) e.push(sc.party.getPartyMemberModelByIndex(f).getHeadIdx());
//       this._renderHeads(a, b - c, true, e);
//       e = [];
//       for (f = 0; f < sc.pvp.enemies.length; ++f) e.push(sc.pvp.enemies[f].getHeadIdx());
//       this._renderHeads(a, b + c, false, e)
//     },
//     _renderPoints: function(a, b, c, e, f, g) {
//       for (var h = 0; h < e; ++h) {
//         a.addGfx(this.gfx, b, 2, (e - h > f ? 124 : 120) + g, 160, 4, 12);
//         b = b + 5 * c
//       }
//     },
//     _renderHeads: function(a, b, c, e) {
//       c && (b = b - 24);
//       for (var f = 0; f < e.length; ++f) {
//         a.addGfx(this.heads, b, -10, e[f] * 24, 0, 24, 24, c);
//         b = b + (c ? -16 : 16)
//       }
//     },
//     start: function() {},
//     end: function() {}
//   })
// })



ig.module("game.feature.combat.combat.carn").requires("impact.base.game", "impact.feature.effect.effect-sheet", "impact.feature.database.database", "impact.feature.navigation.navigation", "game.feature.model.game-model").defines(function () {
  sc.Combat.inject({
    onCombatantDeathHit: function (a, b) {
      let holder = 0;

      holder = ig.game.namedEntities.Lea.stunData.damageSum;

      this.parent(a, b);
      if (ig.vars.storage.tmp.isCarn) {
      }
    }
  })
})


ig.module("game.feature.combat.model.combat-params.carn").requires("game.feature.model.base-model").defines(function () {
  sc.CombatParams.inject({

    reduceHp: function (a) {
      if (a > 0 && ig.vars.storage.tmp.isCarn) {
        let realCurrentHp = this.currentHp - a;
        this.parent(a);
        this.currentHp = realCurrentHp;
      } else {
        this.parent(a);
      }
    },
    applyDamage: function (a, b, c) {
      //console.log('overkill was', c.combo.overkill, 'damage was', a.damage, 'current hp was', this.currentHp);
      c.combo.overkill = c.combo.overkill || 0;
      c.combo.overkill = c.combo.overkill + Math.max(0, a.damage - this.currentHp);
      //console.log('overkill is now', c.combo.overkill);
      this.parent(a, b, c);
    },
    setBaseParams: function(a, b) {
      if (!ig.vars.storage.tmp.isCarn || !ig.vars.storage.tmp.nrStacks) return this.parent(a,b);
      var c = this.getStat("hp") - this.currentHp, d;
      for (d in this.baseParams) this.baseParams[d] = a[d] || this.baseParams[d];
      this.baseParams.hp = this.baseParams.hp / (2 ** ig.vars.storage.tmp.nrStacks);
      this.currentHp = this.getStat("hp") - c;
      sc.Model.notifyObserver(this, sc.COMBAT_PARAM_MSG.STATS_CHANGED, b)
    },



  })

  ig.ENTITY.Combatant.inject({
    clearDamageSum: function () {
      this.parent();
      //this.stunData.overkill = 0;
    },
  })

})
// var origApply = ig.ACTOR_CONFIGS.COMBAT.apply;
// ig.ACTOR_CONFIGS.COMBAT.apply = function(a) {
//     a.combo.overkill = 0;
//     return origApply.call(this, a);
// };

// ig.module("game.feature.combat.entities.combatant.carn").requires("game.feature.npc.entities.sc-actor", "game.feature.combat.combat", "game.feature.combat.entities.hit-number", "game.feature.combat.model.combat-params", "impact.feature.effect.effect-sheet", "game.feature.model.options-model", "impact.feature.terrain.terrain", "game.feature.combat.model.proxy").defines(function() {
// })



ig.module("game.feature.combat.pvp.carn").requires("impact.base.game").defines(function () {
  sc.PvpModel.inject({
    getDmgFactor: function () {
      return (ig.vars.storage.tmp.isCarn ? 1 : this.parent());
    },
    onPostKO: function (b) {
      if (!ig.vars.storage.tmp.isCarn) return this.parent(b);
      for (let d = this.enemies.length; d--;) {
        this.enemies[d].temp_regenPvp = this.enemies[d].regenPvp
        this.enemies[d].regenPvp = function (a) { }
      }
      this.parent(b)
      for (let d = this.enemies.length; d--;) {
        this.enemies[d].regenPvp = this.enemies[d].temp_regenPvp
      }
    },
  })
})


ig.module("game.feature.combat.combat-sweep.carn").requires("impact.feature.effect.effect-sheet").defines(function() {
  sc.COMBAT_SWEEPS.CARN = {
    sheet: new ig.EffectSheet("sweeps"),
    keys: ["default", "heat", "cold", "shock", "wave"],
    force: {
      radius: 32,
      zHeight: 24,
      centralAngle: 0.5,
      duration: 0.1,
      attack: {
        type: "MEDIUM",
        damageFactor: 0.09,
        spFactor: 1,
        skillBonus: "MELEE_DMG"
      },
      checkCollision: true
    }
  };
})



ig.module("game.feature.quick-menu.gui.circle-menu.carn").requires("impact.base.image", "impact.feature.gui.gui", "impact.feature.gui.base.basic-gui", "impact.feature.interact.gui.focus-gui", "game.feature.interact.button-group").defines(function() {
sc.QuickRingMenu.inject({
  enter: function() {
    this.parent();
    if (!ig.vars.storage.tmp.isCarn) return;
     sc.model.player.itemBlockTimer > 0 || sc.quickmodel.itemsBlocked ? this.items.setActive(false) : this.items.setActive(true);
    },
})
})


// ig.module("game.feature.combat.combat-shield.carn").requires("game.feature.combat.model.combat-params").defines(function() {
// sc.COMBAT_SHIELDS.PLAYER.inject({
// getDamageFactor: function(a, b) {
//   if (!ig.vars.storage.tmp.isCarn) return this.parent(a,b);
  
//       var e = this.parent(a, b),
//         f = 1,
//         f = this.getDefenseRatio(a, b),
//         f = f <= 1 ? 0.2 - (1 - Math.pow(f, 0.3)) * 1 : 0.2 + (Math.pow(f, 1.1) - 1) * 0.35,
//         f = f - b.params.getModifier("GUARD_STRENGTH"),
//         f = f.limit(0, 1);
//       return e * f
//     },
// })
// })