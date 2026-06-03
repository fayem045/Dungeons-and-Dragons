// DICE ROLLER
function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

// CHARACTERS
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
    { name: "Goblin", hp: 15, mana: 10, attackBonus: 2, skillBonus: 4 },
    { name: "Dark Knight", hp: 30, mana: 14, attackBonus: 3, skillBonus: 5 },
    { name: "Dragon", hp: 100, mana: 18, attackBonus: 4, skillBonus: 8 }
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

const playerImageUrl = "./images/player.jpg";

function getEnemyImageUrl(name) {
    switch (name) {
        case "Goblin":
            return "./images/goblin.jpg";
        case "Dark Knight":
            return "./images/darkKnight.jpg";
        case "Dragon":
            return "./images/dragon.jpg";
        default:
            return "./images/goblin.jpg";
    }
}

let gameActive = false;

// ==========================================
// BATTLE LOG
// ==========================================
function appendBattleLog(message) {
    const log = document.getElementById("battleMessages");

    if (!log) return;

    const line = document.createElement("div");

    line.textContent = message;
    line.className = "mb-1";

    log.prepend(line);

    // LIMIT LOG SIZE
    while (log.children.length > 12) {
        log.removeChild(log.lastChild);
    }
}

// ==========================================
// UPDATE BATTLE IMAGES
// ==========================================
function updateBattleImages() {
    const playerImage = document.getElementById("playerImage");
    const enemyImage = document.getElementById("enemyImage");

    const playerCardName = document.getElementById("playerCardName");
    const enemyCardName = document.getElementById("enemyCardName");

    if (playerImage) {
        playerImage.src = playerImageUrl;
        playerImage.alt = player.name;
    }

    if (enemyImage) {
        enemyImage.src = getEnemyImageUrl(enemy.name);
        enemyImage.alt = enemy.name;
    }

    if (playerCardName) {
        playerCardName.textContent = `${player.name} (P1)`;
    }

    if (enemyCardName) {
        enemyCardName.textContent = enemy.name;
    }
}

// ==========================================
// SHOW BATTLE SCENE
// ==========================================
function showBattleScene() {
    const scene = document.getElementById("battleScene");

    if (scene) {
        scene.classList.remove("d-none");
    }

    gameActive = true;
    updateBattleImages();

    appendBattleLog(
        `⚔️ Player 1 prepares to fight the ${enemy.name}!`
    );

    showStatus();
}

// ==========================================
// UPDATE UI DISPLAY
// ==========================================
function updateNameDisplay() {
    const playerNameDisplay =
        document.getElementById("playerNameDisplay");

    const enemyNameDisplay =
        document.getElementById("enemyNameDisplay");

    if (playerNameDisplay) {
        playerNameDisplay.textContent =
            `${player.name} (Lv.${player.level})`;
    }

    if (enemyNameDisplay) {
        enemyNameDisplay.textContent =
            `${enemy.name} (Stage ${currentLevel})`;
    }

    const playerHp = document.getElementById("playerHp");
    const playerMana = document.getElementById("playerMana");

    const enemyHp = document.getElementById("enemyHp");
    const enemyMana = document.getElementById("enemyMana");

    if (playerHp) {
        playerHp.textContent =
            `HP: ${player.hp}/${player.maxHp}`;
    }

    if (playerMana) {
        playerMana.textContent =
            `Mana: ${player.mana}/${player.maxMana}`;
    }

    if (enemyHp) {
        enemyHp.textContent =
            `HP: ${enemy.hp}/${enemy.maxHp}`;
    }

    if (enemyMana) {
        enemyMana.textContent =
            `Mana: ${enemy.mana}/${enemy.maxMana}`;
    }
}

// ==========================================
// DISABLE BUTTONS
// ==========================================
function disableActionButtons() {
    const buttons =
        document.querySelectorAll(".action-btn");

    buttons.forEach((button) => {
        button.disabled = true;
    });
}

// ==========================================
// END MODAL
// ==========================================
function showEndModal(title, message) {
    const titleElement =
        document.getElementById("endGameModalLabel");

    const messageElement =
        document.getElementById("endGameMessage");

    if (!titleElement || !messageElement) {
        alert(`${title}\n${message}`);
        return;
    }

    titleElement.textContent = title;
    messageElement.textContent = message;

    if (window.bootstrap && bootstrap.Modal) {
        const modalElement =
            document.getElementById("endGameModal");

        const modal = new bootstrap.Modal(
            modalElement,
            {
                backdrop: "static",
                keyboard: false
            }
        );

        modal.show();
    } else {
        alert(`${title}\n${message}`);
    }
}

// ==========================================
// RESET RESOURCES
// ==========================================
function resetResources(character) {
    character.hp = character.maxHp;
    character.mana = character.maxMana;
}

// ==========================================
// LEVEL UP
// ==========================================
function levelUpPlayer() {
    player.level += 1;

    player.maxHp += 8;
    player.maxMana += 4;

    player.attackBonus += 2;
    player.skillBonus += 3;

    resetResources(player);

    console.log(`\n🆙 LEVEL UP! You are now Level ${player.level}!`);

    console.log(
        `📈 New stats -> HP: ${player.maxHp}, Mana: ${player.maxMana}`
    );

    console.log(
        `⚔️ Attack Bonus: +${player.attackBonus}, ✨ Skill Bonus: +${player.skillBonus}`
    );

    console.log(`💖 HP and Mana fully restored!\n`);

    appendBattleLog(
        `🆙 LEVEL UP! ${player.name} reached Level ${player.level}!`
    );
}

// ==========================================
// SHOW STATUS
// ==========================================
function showStatus() {

    console.log(
        "%c============= Player Status =============",
        "color: blue; font-weight: bold;"
    );

    console.log(`🏅 Level: ${player.level}/${MAX_LEVEL}`);

    console.log(
        `\n🦸 ${player.name}: ${player.hp}/${player.maxHp} HP`
    );

    console.log(
        `🦸 ${player.name}: ${player.mana}/${player.maxMana} Mana`
    );

    console.log(
        `⚔️ Attack Bonus: +${player.attackBonus} | ✨ Skill Bonus: +${player.skillBonus}`
    );

    console.log(
        "%c-------Enemy Status-------",
        "color: red; font-weight: bold;"
    );

    console.log(`🌍 Stage: ${currentLevel}/${MAX_LEVEL}`);

    console.log(
        `🤖 ${enemy.name}: ${enemy.hp}/${enemy.maxHp} HP`
    );

    console.log(
        `🤖 ${enemy.name}: ${enemy.mana}/${enemy.maxMana} Mana\n`
    );

    // UPDATE UI
    updateNameDisplay();

    // SHOW STATUS IN BATTLE LOG
    appendBattleLog(
        `🦸 ${player.name}: ${player.hp}/${player.maxHp} HP (${player.mana}/${player.maxMana} Mana)`
    );

    appendBattleLog(
        ` 🤖 ${enemy.name}: ${enemy.hp}/${enemy.maxHp} HP (${enemy.mana}/${enemy.maxMana} Mana)`
    );
}

// ==========================================
// BATTLE ACTIONS
// ==========================================
let Actions = {

    attack: (attacker, target) => {

        let roll = rollDice(20);

        console.log(
            `🎲 ${attacker.name} rolled d20: ${roll}`
        );

        let dmg =
            roll + (attacker.attackBonus || 3);

        target.hp = Math.max(
            0,
            target.hp - dmg
        );

        console.log(`⚔️ Attack! Damage: ${dmg}`);

        console.log(
            `💥 ${target.name} takes ${dmg} damage`
        );

        appendBattleLog(
            `⚔️ ${attacker.name} hits ${target.name} for ${dmg} damage.`
        );
    },

    skill: (attacker, target) => {

        let manaCost = 10;

        if (attacker.mana >= manaCost) {

            attacker.mana -= manaCost;

            let roll = rollDice(20);

            console.log(
                `🎲 ${attacker.name} rolled d20: ${roll}`
            );

            let dmg =
                roll + (attacker.skillBonus || 5);

            target.hp = Math.max(
                0,
                target.hp - dmg
            );

            console.log(`✨ Skill! Damage: ${dmg}`);

            console.log(
                `💥 ${target.name} takes ${dmg} damage`
            );

            appendBattleLog(
                `✨ ${attacker.name} uses Skill and deals ${dmg} damage to ${target.name}.`
            );

        } else {

            console.log(`❌ Not enough mana!`);

            appendBattleLog(
                `❌ ${attacker.name} failed to cast a skill due to low mana.`
            );
        }
    },

    regen: (attacker) => {

        let roll = rollDice(6);

        console.log(
            `🎲 ${attacker.name} rolled d6: ${roll}`
        );

        let heal = roll + 3;

        attacker.hp = Math.min(
            attacker.hp + heal,
            attacker.maxHp
        );

        console.log(
            `💚 Regen! Healed: ${heal} HP`
        );

        console.log(
            `❤️ ${attacker.name} HP: ${attacker.hp}/${attacker.maxHp}`
        );

        appendBattleLog(
            `💚 ${attacker.name} regenerates ${heal} HP.`
        );
    }
};

// ==========================================
// ENEMY TURN
// ==========================================
function enemyTurn() {

    let choice = Math.random();

    if (enemy.hp < 10) {

        console.log(`\n🤖 Enemy uses: Regen`);

        appendBattleLog(
            `👾 ${enemy.name} uses Regen!`
        );

        Actions.regen(enemy);

    } else if (choice < 0.7) {

        console.log(`\n🤖 Enemy uses: Attack`);

        appendBattleLog(
            `👾 ${enemy.name} attacks!`
        );

        Actions.attack(enemy, player);

    } else {

        console.log(`\n🤖 Enemy uses: Skill`);

        appendBattleLog(
            `👾 ${enemy.name} casts Skill!`
        );

        Actions.skill(enemy, player);
    }
}

// ==========================================
// PLAYER TURN
// ==========================================
function playerTurn() {

    if (player.hp <= 0 || enemy.hp <= 0) {

        endGame(
            player.hp > 0 &&
            currentLevel >= MAX_LEVEL
        );

        return;
    }

    gameActive = true;

    console.log(
        "%c---------------- YOUR TURN ----------------",
        "color: green; font-weight: bold;"
    );

    console.log(
        `1) Attack - Roll d20 (damage = roll + ${player.attackBonus})`
    );

    console.log(
        `2) Skill - Roll d20 (damage = roll + ${player.skillBonus})`
    );

    console.log(
        `3) Regen - Roll d6 (heal = roll + 3)`
    );

    console.log(
        `\n⌨️ Type: action(1), action(2), or action(3)\n`
    );

    appendBattleLog(
        `🟢 Your turn! Choose Attack, Skill, or Regen.`
    );
}

// ==========================================
// NEXT LEVEL
// ==========================================
function advanceToNextLevel() {

    if (currentLevel >= MAX_LEVEL) {

        endGame(true);
        return;
    }

    currentLevel += 1;

    levelUpPlayer();

    enemy = createEnemy(currentLevel);

    updateNameDisplay();

    console.log(
        `🛡️ A new enemy appears: ${enemy.name} (Level ${currentLevel})!\n`
    );

    appendBattleLog(
        `🛡️ A new enemy appears: ${enemy.name}!`
    );

    showStatus();

    playerTurn();
}

// ==========================================
// PLAYER ACTION
// ==========================================
function action(choice) {

    if (!gameActive) {

        console.log(
            "❌ Game not active! Refresh page to start."
        );

        return;
    }

    if (choice === 1) {

        appendBattleLog(
            `🗡️ ${player.name} attacks ${enemy.name}!`
        );

        Actions.attack(player, enemy);

    } else if (choice === 2) {

        appendBattleLog(
            `✨ ${player.name} uses Skill!`
        );

        Actions.skill(player, enemy);

    } else if (choice === 3) {

        appendBattleLog(
            `💚 ${player.name} uses Regen!`
        );

        Actions.regen(player);

    } else {

        console.log(
            "❌ Invalid choice! Use action(1), action(2), or action(3)"
        );

        return;
    }

    showStatus();

    // ENEMY DEAD
    if (enemy.hp <= 0) {

        console.log(
            `\n✅ You cleared Level ${currentLevel}!`
        );

        appendBattleLog(
            `✅ ${enemy.name} was defeated!`
        );

        advanceToNextLevel();

        return;
    }

    // ENEMY TURN
    enemyTurn();

    showStatus();

    // PLAYER DEAD
    if (player.hp <= 0) {

        endGame(false);

        return;
    }

    // NEXT TURN
    playerTurn();
}

// ==========================================
// END GAME
// ==========================================
function endGame(playerWon) {

    gameActive = false;

    disableActionButtons();

    if (playerWon) {

        console.log(
            `\n🏆 YOU WIN THE CAMPAIGN!`
        );

        appendBattleLog(
            `🏆 YOU WIN THE CAMPAIGN!`
        );

        showEndModal(
            "YOU WIN",
            `Champion! You cleared all ${MAX_LEVEL} levels.`
        );

    } else {

        console.log(
            `\n💀 YOU LOST!`
        );

        appendBattleLog(
            `💀 GAME OVER! ${enemy.name} defeated ${player.name}.`
        );

        showEndModal(
            "GAME OVER",
            `Defeated by ${enemy.name}. Try again.`
        );
    }
}

// ==========================================
// START GAME
// ==========================================
console.clear();

console.log(`
╔═══════════════════════════════════════════╗
║   ⚔️  DRAGONS DUNGEONS CONSOLE GAME  ⚔️  ║
╚═══════════════════════════════════════════╝
`);

console.log(`👋 Welcome to the D&D Console Battle!`);

console.log(`📖 Roll dice to determine your damage!`);

console.log(`🎲 Higher rolls = Higher damage`);

console.log(
    `🗺️ Defeat ${MAX_LEVEL} levels to win.`
);

console.log(
    `🎮 Type actions directly in console or use buttons.\n`
);

console.log(
    `${player.name} (Lv.${player.level}) vs ${enemy.name} (Stage ${currentLevel})\n`
);

// INITIALIZE UI
updateNameDisplay();
updateBattleImages();
showBattleScene();

// START
showStatus();
playerTurn();