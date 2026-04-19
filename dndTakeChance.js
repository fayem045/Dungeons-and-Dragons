// ==========================
// 🎲 DICE
// ==========================
function Dice(sides) {
    this.sides = sides;

    this.roll = function() {
        let result = Math.floor(Math.random() * this.sides) + 1;
        console.log(`🎲 d${this.sides} → ${result}`);
        return result;
    };
}

let diceMap = {
    4: new Dice(4),
    6: new Dice(6),
    8: new Dice(8),
    10: new Dice(10),
    12: new Dice(12),
    20: new Dice(20)
};

// ==========================
// ⚔️ DnD SYSTEM
// ==========================
let DnD = {

    roll(notation) {
        let match = notation.match(/(\d*)d(\d+)([+-]\d+)?/);

        let num = parseInt(match[1]) || 1;
        let sides = parseInt(match[2]);
        let mod = match[3] ? parseInt(match[3]) : 0;

        let total = 0;
        for (let i = 0; i < num; i++) {
            total += diceMap[sides].roll();
        }

        let final = total + mod;
        console.log(`➕ ${mod} → ${final}`);
        return final;
    },

    attack(mod = 0) {
        console.log("\n⚔️ Rolling Attack...");
        return this.roll(`1d20+${mod}`);
    },

    damage(notation) {
        console.log("💥 Rolling Damage...");
        return this.roll(notation);
    },

    // ==========================
    // 🎮 COMMAND PARSER
    // ==========================
    parseCommand(cmd) {
        let parts = cmd.split(" ");
        return {
            action: parts[0],
            type: parts[1] || "safe"
        };
    },

    // ==========================
    // ⚔️ ACTION EXECUTION
    // ==========================
    executeCommand(attacker, target, cmd) {

        let parsed = this.parseCommand(cmd);

        if (parsed.action !== "attack") {
            console.log("❌ Unknown command!");
            return;
        }

        const Actions = {
            safe:  { mod: 0,  dmg: attacker.damage },
            power: { mod: -3, dmg: attacker.damage, bonus: 5 },
            wild:  { mod: 0,  dmg: attacker.damage, double: true, self: true },
            allin: { mod: 0,  dmg: "3d10", allin: true }
        };

        let action = Actions[parsed.type] || Actions.safe;

        console.log(`\n🧠 ${attacker.name} used command: "${cmd}"`);
        console.log(`👉 Action: ${parsed.type.toUpperCase()}`);

        let attackRoll = this.attack(attacker.attackMod + action.mod);

        // 💀 CRIT FAIL
        if (attackRoll <= 3) {
            console.log("💀 CRITICAL FAIL!");
            attacker.hp -= this.damage("1d4");
            return;
        }

        // 🎲 ALL-IN
        if (action.allin) {
            console.log("🎲 ALL-IN MOVE!");

            if (attackRoll >= target.AC) {
                let dmg = this.damage(action.dmg);
                console.log("💥 MASSIVE DAMAGE!");
                target.hp -= dmg;
            } else {
                console.log("💀 BACKFIRED!");
                attacker.hp -= this.damage("1d8");
            }
            return;
        }

        // ✅ HIT
        if (attackRoll >= target.AC) {
            console.log("✅ HIT!");

            let dmg = this.damage(action.dmg);

            if (action.bonus) {
                dmg += action.bonus;
                console.log("💥 +5 bonus");
            }

            if (action.double) {
                dmg *= 2;
                console.log("🔥 DOUBLE DAMAGE!");
            }

            if (Math.random() < attacker.luck * 0.05) {
                console.log("🍀 LUCK BONUS!");
                dmg += 3;
            }

            target.hp -= dmg;
            console.log(`💥 ${target.name} takes ${dmg}`);

        } else {
            console.log("❌ MISS!");

            if (action.self) {
                let self = this.damage("1d6");
                console.log(`💀 Self damage ${self}`);
                attacker.hp -= self;
            }
        }

        console.log(`❤️ ${attacker.name}: ${attacker.hp}`);
        console.log(`❤️ ${target.name}: ${target.hp}`);
    },

    // 🤖 Enemy AI (still command-based)
    enemyCommand(enemy) {
        let options = ["attack safe", "attack power", "attack wild", "attack allin"];
        return options[Math.floor(Math.random() * options.length)];
    }
};

// ==========================
// 🧍 CHARACTERS
// ==========================
let player = {
    name: "Manio",
    hp: 40,
    AC: 14,
    attackMod: 5,
    damage: "1d8+3",
    luck: 2
};

let enemy = {
    name: "OralCom",
    hp: 30,
    AC: 12,
    attackMod: 3,
    damage: "1d6+1",
    luck: 1
};

// ==========================
// 🔁 BATTLE SYSTEM
// ==========================
function battle(p, e, playerCommands) {

    console.log("💬 Type commands like: attack safe / attack wild / attack allin\n");
    console.log(`🔥 ${p.name} vs ${e.name} begins!\n`);

    let turn = 0;

    while (p.hp > 0 && e.hp > 0) {

        console.log(`\n===== TURN ${turn + 1} =====`);

        // 👤 PLAYER COMMAND FROM ARRAY
        let cmd = playerCommands[turn] || "attack safe";
        DnD.executeCommand(p, e, cmd);

        if (e.hp <= 0) break;

        // 🤖 ENEMY COMMAND
        let enemyCmd = DnD.enemyCommand(e);
        DnD.executeCommand(e, p, enemyCmd);

        turn++;
    }

    console.log(p.hp > 0 ? "\n🏆 YOU WIN!" : "\n💀 YOU LOST!");
}

// ==========================
// 🚀 RUN GAME
// ==========================
battle(player, enemy, [
    "attack safe",
    "attack power",
    "attack wild",
    "attack allin"
]);