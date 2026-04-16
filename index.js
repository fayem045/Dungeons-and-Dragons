// Dice Constructor (like Animal / Pokemon)
function Dice(sides, use) {
    this.sides = sides;
    this.use = use;

    this.roll = function() {
        let result = Math.floor(Math.random() * this.sides) + 1;
        console.log(`d${this.sides} rolled: ${result}`);
        console.log(`Use: ${this.use}`);
        return result;
    }
}

// Create dice instances (NOW WITH PURPOSE)
let d4  = new Dice(4,  "Small damage, buffs, minor healing");
let d6  = new Dice(6,  "Common damage, spells, Wizard HP");
let d8  = new Dice(8,  "Weapon damage, healing, Cleric HP");
let d10 = new Dice(10, "Weapon damage, Fighter HP, percentile");
let d12 = new Dice(12, "Heavy damage, Barbarian HP");
let d20 = new Dice(20, "Attack rolls, skill checks, saving throws");

// d100 special (2 d10s)
let d100 = {
    roll: function() {
        let tens = Math.floor(Math.random() * 10) * 10;
        let ones = Math.floor(Math.random() * 10);
        let total = tens + ones;

        console.log(`d100 rolled: ${total}`);
        console.log("Use: Random events / tables");
        return total;
    }
};

// rolls of dice/s
let DnD = {
    rollMany: function(dice, times) {
        let rolls = [];
        let total = 0;

        for (let i = 0; i < times; i++) {
            let r = dice.roll();
            rolls.push(r);
            total += r;
        }

        console.log(`Rolls: [${rolls}] Total: ${total}`);
        return total;
    },

    // Roll detailed logic for dice/s
    roll: function(notation) {
        let match = notation.match(/(\d*)d(\d+)([+-]\d+)?/);

        let num = parseInt(match[1]) || 1;
        let sides = parseInt(match[2]);
        let mod = match[3] ? parseInt(match[3]) : 0;

        // 🔗 LINK: choose correct dice with meaning
        let diceMap = {
            4: d4,
            6: d6,
            8: d8,
            10: d10,
            12: d12,
            20: d20
        };

        let dice = diceMap[sides] || new Dice(sides, "Custom dice");

        let result = this.rollMany(dice, num);
        let final = result + mod;

        console.log(`Modifier: ${mod}`);
        console.log(`Final Total: ${final}`);
        return final;
    },

    // ⚔️ BASIC ATTACK ROLL ONLY
    attack: function(mod = 0) {
        console.log("\n⚔️ Attack Roll (d20)");
        return this.roll(`1d20+${mod}`);
    },

    // 💥 DAMAGE ONLY
    damage: function(notation) {
        console.log("\n💥 Damage Roll");
        return this.roll(notation);
    },

    // 🎲 RANDOM EVENT
    randomEvent: function() {
        console.log("\n🎲 Random Event (d100)");
        return d100.roll();
    },

    // ✅ FULL COMBAT (HIT → THEN DAMAGE)
    attackTarget: function(attackerName, target, attackMod, damageNotation) {
        console.log(`\n⚔️ ${attackerName} attacks ${target.name}!`);

        // Step 1: attack roll
        let attackRoll = this.attack(attackMod);

        // Step 2: check hit vs AC
        if (attackRoll >= target.AC) {
            console.log("✅ HIT!");

            // Step 3: damage ONLY if hit
            let dmg = this.damage(damageNotation);
            target.hp -= dmg;

            console.log(`💥 ${target.name} takes ${dmg} damage!`);
            console.log(`❤️ ${target.name} HP: ${target.hp}`);
        } else {
            console.log("❌ MISS! No damage.");
        }
    }
};
//Create an enemy
let enemy = {
    name: "enemy",
    hp: 30,
    AC: 12
};
//kung pano gusto attack ni
DnD.attackTarget("Hero", enemy, 5, "1d20+5");

// console.log("Single rolls:");
// console.log("d20:", d20.roll());
// console.log("d6:", d6.roll());

// console.log("\nDnD notation:");
// DnD.roll("1d20+5"); //1st no.: ilan dice na gagamitn; 2nd no.: d(dice) sides na meron ung each dice; 3rd no.: modifier
// DnD.roll("2d6+3"); ;

// // Applied meaning
// DnD.attack(5);        // uses d20
// DnD.damage("2d6+3"); // uses damage dice
// DnD.randomEvent();   // uses d100

// DnD.randomEvent();   // uses d100 again for another random event

