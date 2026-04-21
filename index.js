// DICE ROLLER
function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

//  CHARACTERS
let player = {
    name: "You",
    level: 1,
    hp: 30,
    maxHp: 30,
    mana: 15,
    maxMana: 15,
    attackBonus: 3,
    skillBonus: 5,
};

const MAX_LEVEL = 3;
let currentLevel = 1;

const enemiesByLevel = [
    { name: "Goblin Chief", hp: 24, mana: 10, attackBonus: 2, skillBonus: 4 },
    { name: "Dark Knight", hp: 32, mana: 14, attackBonus: 3, skillBonus: 6 },
    { name: "Dragon", hp: 40, mana: 18, attackBonus: 4, skillBonus: 8 }
];

function createEnemy(level) {
    const template = enemiesByLevel[level - 1];
    return {
        name: template.name,
        hp: template.hp,
        maxHp: template.hp,
        mana: template.mana,
        maxMana: template.mana,
        attackBonus: template.attackBonus,
        skillBonus: template.skillBonus
    };
}

let enemy = createEnemy(currentLevel);

let gameActive = false;

function updateNameDisplay() {
    const playerNameDisplay = document.getElementById("playerNameDisplay");
    const enemyNameDisplay = document.getElementById("enemyNameDisplay");

    if (playerNameDisplay) {
        playerNameDisplay.textContent = `${player.name} (Lv.${player.level})`;
    }

    if (enemyNameDisplay) {
        enemyNameDisplay.textContent = `${enemy.name} (Stage ${currentLevel})`;
    }
}

function disableActionButtons() {
    const buttons = document.querySelectorAll(".action-btn");
    buttons.forEach((button) => {
        button.disabled = true;
    });
}

function showEndModal(title, message) {
    const titleElement = document.getElementById("endGameModalLabel");
    const messageElement = document.getElementById("endGameMessage");

    if (!titleElement || !messageElement) {
        alert(`${title}\n${message}`);
        return;
    }

    titleElement.textContent = title;
    messageElement.textContent = message;

    if (window.bootstrap && bootstrap.Modal) {
        const modalElement = document.getElementById("endGameModal");
        const modal = new bootstrap.Modal(modalElement, {
            backdrop: "static",
            keyboard: false
        });
        modal.show();
    } else {
        alert(`${title}\n${message}`);
    }
}

function resetResources(character) {
    character.hp = character.maxHp;
    character.mana = character.maxMana;
}

function levelUpPlayer() {
    player.level += 1;
    player.maxHp += 8;
    player.maxMana += 4;
    player.attackBonus += 2;
    player.skillBonus += 3;
    resetResources(player);

    console.log(`\n🆙 LEVEL UP! You are now Level ${player.level}!`);
    console.log(`📈 New stats -> HP: ${player.maxHp}, Mana: ${player.maxMana}`);
    console.log(`⚔️ Attack Bonus: +${player.attackBonus}, ✨ Skill Bonus: +${player.skillBonus}`);
    console.log(`💖 HP and Mana fully restored!\n`);
}

// BATTLE ACTIONS (ROLL FIRST, THEN ATTACK)
let Actions = {
    attack: (attacker, target) => {
        let roll = rollDice(20);
        console.log(`🎲 ${attacker.name} rolled d20: ${roll}`);
        
        // Damage scales with dice roll
        let dmg = roll + (attacker.attackBonus || 3);
        target.hp = Math.max(0, target.hp - dmg);
        
        console.log(`⚔️ Attack! Damage: ${dmg}`);
        console.log(`💥 ${target.name} takes ${dmg} damage`);
    },

    skill: (attacker, target) => {
    let manaCost = 10;
    if (attacker.mana >= manaCost) {
        attacker.mana -= manaCost;

        let roll = rollDice(20);
        console.log(`🎲 ${attacker.name} rolled d20: ${roll}`);
        
        let dmg = roll + (attacker.skillBonus || 5);
        target.hp = Math.max(0, target.hp - dmg);
        
        console.log(`✨ Skill! Damage: ${dmg}`);
        console.log(`💥 ${target.name} takes ${dmg} damage`);
    } else {
        console.log(`❌ Not enough mana!`);
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

//  SHOW STATUS
function showStatus() {
    console.log("-------Player Status-------");
    console.log(`🏅 Level: ${player.level}/${MAX_LEVEL}`);
    console.log(`\n🦸 ${player.name}: ${player.hp}/${player.maxHp} HP`);
    console.log(`\n🦸 ${player.name}: ${player.mana}/${player.maxMana} Mana`);
    console.log(`⚔️ Attack Bonus: +${player.attackBonus} | ✨ Skill Bonus: +${player.skillBonus}`);
    console.log("-------Enemy Status-------");
    console.log(`🌍 Stage: ${currentLevel}/${MAX_LEVEL}`);
    console.log(`🤖 ${enemy.name}: ${enemy.hp}/${enemy.maxHp} HP\n`);
    console.log(`🤖 ${enemy.name}: ${enemy.mana}/${enemy.maxMana} Mana\n`);
}

//  ENEMY AI
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

//  INTERACTIVE GAME (CONSOLE ONLY)
function playerTurn() {
    if (player.hp <= 0 || enemy.hp <= 0) {
        endGame(player.hp > 0 && currentLevel >= MAX_LEVEL);
        return;
    }

    gameActive = true;
    console.log(`------------------------------------------------------------ YOUR TURN -----------------------------------------------`);
    console.log(`1) Attack - Roll d20 (damage = roll + ${player.attackBonus})`);
    console.log(`2) Skill - Roll d20 (damage = roll + ${player.skillBonus})`);
    console.log(`3) Regen - Roll d6 (heal = roll + 3)`);
    console.log(`\n⌨️ Type: action(1), action(2), or action(3)/ CHOOSE BUTTONS.\n`);
}

function advanceToNextLevel() {
    if (currentLevel >= MAX_LEVEL) {
        endGame(true);
        return;
    }

    currentLevel += 1;
    levelUpPlayer();
    enemy = createEnemy(currentLevel);
    updateNameDisplay();

    console.log(`🛡️ A new enemy appears: ${enemy.name} (Level ${currentLevel})!\n`);
    showStatus();
    playerTurn();
}


//  PLAYER ACTION HANDLER
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
        console.log(`\n✅ You cleared Level ${currentLevel}!`);
        advanceToNextLevel();
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

function endGame(playerWon) {
    gameActive = false;
    disableActionButtons();

    if (playerWon) {
        console.log(`\n🏆 YOU WIN THE CAMPAIGN! ${player.name} cleared all ${MAX_LEVEL} levels!`);
        showEndModal("YOU WIN", `Champion! You cleared all ${MAX_LEVEL} levels.`);
    } else {
        console.log(`\n💀 YOU LOST! ${enemy.name} defeated ${player.name}!`);
        showEndModal("GAME OVER", `Defeated by ${enemy.name}. Try again.`);
    }
}

//  WELCOME & START GAME
console.clear();
console.log(`
╔═══════════════════════════════════════════╗
║   ⚔️  DRAGONS DUNGEONS CONSOLE GAME  ⚔️  ║
╚═══════════════════════════════════════════╝
`);
console.log(`👋 Welcome to the D&D Console Battle!`);
console.log(`📖 Roll dice to determine your damage!`);
console.log(`🎲 Higher rolls = Higher damage`);
console.log(`🗺️ Defeat ${MAX_LEVEL} levels to win. Level up after each clear!`);
console.log(`🎮 Type actions directly in the console./ Click the Buttons.\n`);
console.log(`${player.name} (Lv.${player.level}) vs ${enemy.name} (Stage ${currentLevel})\n`);
updateNameDisplay();
showStatus();
playerTurn();
