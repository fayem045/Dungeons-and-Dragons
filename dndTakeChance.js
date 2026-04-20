//  DICE
function Dice(sides, type) {
    this.sides = sides;
    this.type = type;

    this.roll = function () {
        let result = Math.floor(Math.random() * this.sides) + 1;
        console.log(`🎲 d${this.sides} (${this.type}) rolled: ${result}`);
        return result;
    };
}

let regenDice = new Dice(6, "Regen");
let skillDice = new Dice(6, "Attack");

function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}


// PLAYERs Matic status

function Player(config) {
    this.name = config.name;
    this.hp = config.hp;
    this.maxHp = config.hp;
    this.mana = config.mana;
    this.maxMana = config.mana;
    this.skills = config.skills;

    // DICE 1 - REGEN

    this.rollDice1 = function () {
        console.log(`\n===== ${this.name} REGEN DICE =====`);
        let roll = regenDice.roll();

        if (roll <= 3) {
            let heal = roll * 5;
            this.hp += heal;
            if (this.hp > this.maxHp) this.hp = this.maxHp;
            console.log(`❤️ Heal +${heal}`);
        } else {
            let manaGain = roll * 5;
            this.mana += manaGain;
            if (this.mana > this.maxMana) this.mana = this.maxMana;
            console.log(`🔵 Mana +${manaGain}`);
        }

        this.printStatus();
    };

    //  DICE 2 - SKILL
    this.rollDice2 = function (target) {
        console.log(`\n===== ${this.name} ATTACK DICE =====`);
        let roll = skillDice.roll();

        let skill;
        if (roll <= 2) skill = this.skills[0];
        else if (roll <= 4) skill = this.skills[1];
        else skill = this.skills[2];

        if (this.mana < skill.cost) {
            console.log(`❌ Not enough mana for ${skill.name}`);
            return;
        }

        this.mana -= skill.cost;

        let dmg = skill.damage();
        target.hp -= dmg;

        console.log(`🔥 ${skill.name}`);
        console.log(`💥 ${target.name} takes ${dmg}`);

        this.printStatus();
        target.printStatus();
    };

    // 💀 DICE 3 - ALL IN

    this.rollDice3 = function (target) {
        console.log(`\n===== ${this.name} ALL IN DICE =====`);

        let roll = skillDice.roll();

        if (this.mana < 30) {
            console.log(`❌ Not enough mana for ALL IN!`);
            return;
        }

        if (this.hp <= 30) {
            console.log(`❌ Not enough HP for ALL IN!`);
            return;
        }

        this.mana = 0;
        this.hp -= 30;

        let damage = roll * 10; // ✅ FIXED
        target.hp -= damage;

        console.log(`🔥 ALL IN!!!`);
        console.log(`💥 ${target.name} takes ${damage}`);

        this.printStatus();
        target.printStatus();
    };


    //  STATUS
    this.printStatus = function () {
        console.log(`👉 ${this.name} | ❤️ ${this.hp} | 🔵 ${this.mana}`);
    };

    function checkLose(p1, p2) {

    if (p1.hp <= 0 && p2.hp <= 0) {
        console.log("\n💀 BOTH PLAYERS LOST!");
        return true;
    }

    if (p1.hp <= 0) {
        console.log(`\n💀 ${p1.name} LOST!`);
        console.log(`🏆 ${p2.name} WINS!`);
        return true;
    }

    if (p2.hp <= 0) {
        console.log(`\n💀 ${p2.name} LOST!`);
        console.log(`🏆 ${p1.name} WINS!`);
        return true;
    }

    return false; // no one lost yet
}
}

// ==========================
// 🧪 PLAYERS
// ==========================
let player1 = new Player({
    name: "Manio",
    hp: 45,
    mana: 100,
    skills: [
        { name: "Quick Jab", cost: 10, damage: () => rollDice(4) + rollDice(4) },
        { name: "Lightning Slash", cost: 25, damage: () => rollDice(6) + rollDice(6) },
        { name: "Thunder Burst", cost: 50, damage: () => rollDice(6) + rollDice(10) }
    ]
});

let player2 = new Player({
    name: "OralCom",
    hp: 60,
    mana: 70,
    skills: [
        { name: "Heavy Punch", cost: 5, damage: () => rollDice(6) },
        { name: "Crushing Blow", cost: 20, damage: () => rollDice(8) + rollDice(6) },
        { name: "Earth Breaker", cost: 40, damage: () => rollDice(12) + rollDice(6) }
    ]
});



function checkLose(p1, p2) {
    if (p1.hp <= 0 || p2.hp <= 0) {
        console.log("Game Over");
        return true;
    }
    return false;
}

function playRound() {
    console.log("ROUND");

    player1.rollDice2(player2);
    if (checkLose(player1, player2)) return;

    player2.rollDice2(player1);
    if (checkLose(player1, player2)) return;

    // console.log("Round continues...");

     player1.rollDice3(player2);
    if (checkLose(player1, player2)) return;

        player2.rollDice2(player1);
    if (checkLose(player1, player2)) return;

        player1.rollDice1(player2);
    if (checkLose(player1, player2)) return;

        player2.rollDice3(player1);
    if (checkLose(player1, player2)) return;

        player1.rollDice2(player2);
    if (checkLose(player1, player2)) return;

            player2.rollDice3(player1);
    if (checkLose(player1, player2)) return;

}

playRound();