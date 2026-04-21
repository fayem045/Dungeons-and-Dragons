// ==========================
// 🎲 DICE ROLLER
// ==========================
function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

// ==========================
// 🧍 CHARACTERS
// ==========================
let player = {
    name: "You",
    hp: 30,
    maxHp: 30,
    mana: 20,
    maxMana: 20,
};

let enemy = {
    name: "Enemy",
    hp: 25,
    maxHp: 25
};

let gameActive = false;

// ==========================
// ⚔️ BATTLE ACTIONS (ROLL FIRST, THEN ATTACK)
// ==========================
let Actions = {
    attack: (attacker, target) => {
        let roll = rollDice(20);
        console.log(`🎲 ${attacker.name} rolled d20: ${roll}`);
        
        // Damage scales with dice roll
        let dmg = roll + 3;
        target.hp -= dmg;
        
        console.log(`⚔️ Attack! Damage: ${dmg}`);
        console.log(`💥 ${target.name} takes ${dmg} damage`);
    },

    skill: (attacker, target) => {
        let manaCost = 5;
        if (attacker.mana >= manaCost) {
        let roll = rollDice(20);
        console.log(`🎲 ${attacker.name} rolled d20: ${roll}`);
        
        // Skill damage scales higher with dice roll
        let dmg = roll + 5;
        target.hp -= dmg;
        
        console.log(`✨ Skill! Damage: ${dmg}`);
        console.log(`💥 ${target.name} takes ${dmg} damage`);
        }
    },

    regen: (attacker, target) => {
        let roll = rollDice(6);
        console.log(`🎲 ${attacker.name} rolled d6: ${roll}`);
        
        let heal = roll + 3;
        attacker.hp = Math.min(attacker.hp + heal, attacker.maxHp);
        
        console.log(`💚 Regen! Healed: ${heal} HP`);
        console.log(`❤️ ${attacker.name} HP: ${attacker.hp}/${attacker.maxHp}`);
    }
};

// ==========================
// 📊 SHOW STATUS
// ==========================
function showStatus() {
    console.log(`\n❤️ ${player.name}: ${player.hp}/${player.maxHp} HP`);
    console.log(`❤️ ${enemy.name}: ${enemy.hp}/${enemy.maxHp} HP\n`);
}

// ==========================
// 🤖 ENEMY AI
// ==========================
function enemyTurn() {
    let choice = Math.random();
    
    if (enemy.hp < 10) {
        console.log(`\n🤖 Enemy uses: Regen`);
        Actions.regen(enemy, player);
    } else if (choice < 0.7) {
        console.log(`\n🤖 Enemy uses: Attack`);
        Actions.attack(enemy, player);
    } else {
        console.log(`\n🤖 Enemy uses: Skill`);
        Actions.skill(enemy, player);
    }
}

// ==========================
// 🎮 INTERACTIVE GAME (CONSOLE ONLY)
// ==========================
function playerTurn() {
    if (player.hp <= 0 || enemy.hp <= 0) {
        endGame();
        return;
    }

    gameActive = true;
    console.log(`--- YOUR TURN ---`);
    console.log(`1) Attack - Roll d20 (damage = roll + 3)`);
    console.log(`2) Skill - Roll d20 (damage = roll + 5)`);
    console.log(`3) Regen - Roll d6 (heal = roll + 3)`);
    // console.log(`\n⌨️ Type: action(1), action(2), or action(3)\n`);
}

// ==========================
// 🎯 PLAYER ACTION HANDLER
// ==========================
function action(choice) {
    if (!gameActive) {
        console.log("❌ Game not active! Refresh page to start.");
        return;
    }

    if (choice === 1) {
        console.log();
        Actions.attack(player, enemy);
    } else if (choice === 2) {
        console.log();
        Actions.skill(player, enemy);
    } else if (choice === 3) {
        console.log();
        Actions.regen(player, enemy);
    } else {
        console.log("❌ Invalid choice! Use: action(1), action(2), or action(3)\n");
        return;
    }

    showStatus();

    if (enemy.hp <= 0) {
        endGame();
        return;
    }

    // Enemy turn
    enemyTurn();
    showStatus();

    if (player.hp <= 0) {
        endGame();
        return;
    }

    // Next player turn
    playerTurn();
}

function endGame() {
    gameActive = false;
    if (player.hp > 0) {
        console.log(`\n🏆 YOU WIN! ${player.name} defeated ${enemy.name}!`);
    } else {
        console.log(`\n💀 YOU LOST! ${enemy.name} defeated ${player.name}!`);
    }
}

// ==========================
// 🚀 WELCOME & START GAME
// ==========================
console.clear();
console.log(`
╔═══════════════════════════════════════════╗
║   ⚔️  DUNGEONS & DRAGONS CONSOLE GAME  ⚔️   ║
╚═══════════════════════════════════════════╝
`);
console.log(`👋 Welcome to the D&D Console Battle!`);
console.log(`📖 Roll dice to determine your damage!`);
console.log(`🎲 Higher rolls = Higher damage`);
console.log(`🎮 Type actions directly in the console.\n`);
console.log(`${player.name} vs ${enemy.name}\n`);
showStatus();
playerTurn();
