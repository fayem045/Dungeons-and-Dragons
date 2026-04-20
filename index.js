// ==========================
// 🎲 DICE
// ==========================
function rollD6() {
    return Math.floor(Math.random() * 6) + 1;
}

function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

// ==========================
// 🐉 PLAYER
// ==========================
function Player(name) {
    this.name = name;
    this.hp = 1000;
    this.mana = 200;
    this.extraTurns = 0;

    // 🗡️ DEFAULT ATTACK (no mana)
    this.basicAttack = function (target) {
        let dmg = rollDice(10) + 5;
        target.hp -= dmg;
        console.log(`🗡️ ${this.name} uses BASIC ATTACK → ${dmg}`);
    };

    // 🎲 ACTION BASED ON ROLL
    this.performRoll = function (roll, target) {
        console.log(`🎲 Rolled: ${roll}`);

        let actions = {
            1: { cost: 10, dmg: () => rollDice(6) + rollDice(4), name: "Quick Hit" },
            2: { cost: 20, dmg: () => rollDice(6) + rollDice(6), name: "Slash" },
            3: { cost: 30, dmg: () => rollDice(8) + rollDice(6), name: "Heavy Strike" },
            4: { cost: 40, dmg: () => rollDice(10) + rollDice(6), name: "Fire Blast" },
            5: { cost: 50, dmg: () => rollDice(12) + rollDice(8), name: "Dragon Rage" },
            6: { cost: 0,  special: "ALLIN" }
        };

        let action = actions[roll];

        // 💀 ALL IN
        if (action.special === "ALLIN") {
            if (this.mana < 30 || this.hp <= 30) {
                console.log("❌ Cannot ALL IN → fallback");
                return this.basicAttack(target);
            }

            this.mana = 0;
            this.hp -= 30;

            let dmg = rollDice(6) * 20;
            target.hp -= dmg;

            console.log(`🔥 ALL IN!!! → ${dmg}`);
            return;
        }

        // ❌ NOT ENOUGH MANA
        if (this.mana < action.cost) {
            console.log(`❌ Not enough mana → BASIC ATTACK`);
            return this.basicAttack(target);
        }

        // ✅ NORMAL SKILL
        this.mana -= action.cost;
        let dmg = action.dmg();
        target.hp -= dmg;

        console.log(`⚔️ ${this.name} used ${action.name} → ${dmg}`);
    };

    this.printStatus = function () {
        console.log(`👉 ${this.name} | ❤️ ${this.hp} | 🔵 ${this.mana}`);
    };
}

// ==========================
// 🏁 CHECK WINNER
// ==========================
function checkWinner(p1, p2) {
    if (p1.hp <= 0 && p2.hp <= 0) {
        console.log("\n💀 DRAW!");
        return true;
    }
    if (p1.hp <= 0) {
        console.log(`\n🏆 ${p2.name} WINS!`);
        return true;
    }
    if (p2.hp <= 0) {
        console.log(`\n🏆 ${p1.name} WINS!`);
        return true;
    }
    return false;
}

// ==========================
// 🎮 GAME LOOP
// ==========================
function startGame(p1, p2) {

    let current = p1;
    let opponent = p2;

    let turn = 1;

    while (true) {

        console.log(`\n===== TURN ${turn}: ${current.name} =====`);

        // 🎮 AUTO CHOICE (replace with input later)
        let choice = Math.random() < 0.7 ? "roll" : "skip";
        console.log(`👉 Choice: ${choice}`);

        if (choice === "skip") {
            console.log(`⏭️ ${current.name} skipped!`);
            current.extraTurns = 2;
        } else {
            let roll = rollD6();
            current.performRoll(roll, opponent);
        }

        current.printStatus();
        opponent.printStatus();

        if (checkWinner(current, opponent)) break;

        // 🔁 TURN SWITCHING LOGIC
        if (current.extraTurns > 0) {
            current.extraTurns--;
            console.log(`⚡ EXTRA TURN for ${current.name}`);
        } else {
            // swap players
            [current, opponent] = [opponent, current];
        }

        turn++;
    }
}

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

}

playRound();