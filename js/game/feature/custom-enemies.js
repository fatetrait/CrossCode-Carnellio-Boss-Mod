ig.module("game.feature.combat.combat.carnCustoms").requires("impact.base.game", "impact.feature.effect.effect-sheet", "impact.feature.database.database", "impact.feature.navigation.navigation", "game.feature.model.game-model").defines(function () {

    for (var tmp in ig.carnellioDatabase.data.enemies) {
        ig.database.data.enemies[tmp] = ig.carnellioDatabase.data.enemies[tmp];
        sc.combat.enemyDataList[tmp] = ig.carnellioDatabase.data.enemies[tmp];
    }
    for (var a in ig.carnellioDatabase.data.enemies)
        if (sc.combat.enemyDataList[a].track)
            for (var b = sc.combat.enemyDataList[a].descriptions, c = b.length; c--;)
                if (b[c].condition) {
                    var d = new ig.VarCondition(b[c].condition);
                    b[c].condObj = d
                }
    ig.vars.registerVarAccessor("combat",
        sc.combat, "VarCombatEditor")
});