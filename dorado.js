// 🐉 Simple Dragon Fight (Player vs Computer)

// PLAYER
let player = { hp: 1000, maxHP: 1000, mana: 200, maxMana: 200, extraTurns: 0 };

// STAGE & ENEMY STATS
let currentStage = 1;
let enemy = { hp: 800, maxHP: 800, mana: 150, maxMana: 150 };

let currentPlayer = "player";

// 📊 STAGE CONFIGURATION
let stageConfig = {
    1: { maxHP: 800, maxMana: 150, name: "Stage 1: Goblin" },
    2: { maxHP: 1200, maxMana: 200, name: "Stage 2: Orc" },
    3: { maxHP: 1800, maxMana: 300, name: "Stage 3: Dragon Boss" }
};

// 🎲 ROLL FUNCTION
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// ⚔️ BASIC ATTACK
function basicAttack() {
    let roll = rollDice();
    let damage = 0;
    let manaGain = 0;

    console.log("\n=== PLAYER ACTION ===");
    console.log("Action: Basic Attack");
    console.log("Dice Roll: " + roll);

    if (roll === 1) {
        damage = 80;
        manaGain = 30;
    } else if (roll === 2) {
        damage = 90;
        manaGain = 25;
    } else if (roll === 3) {
        damage = 100;
        manaGain = 20;
    } else if (roll === 4) {
        damage = 110;
        manaGain = 15;
    } else if (roll === 5) {
        damage = 120;
        manaGain = 10;
    } else if (roll === 6) {
        damage = 130;
        manaGain = 5;
    }

    enemy.hp -= damage;
    player.mana += manaGain;

    // Cap mana
    if (player.mana > player.maxMana) player.mana = player.maxMana;
    if (enemy.hp < 0) enemy.hp = 0;

    console.log("Effect: -" + damage + " enemy HP, +" + manaGain + " mana");
    showStats();

    endTurn();
}

// 🔥 SKILL
function skillAttack() {
    let roll = rollDice();
    let damage = 0;
    let manaCost = 0;

    console.log("\n=== PLAYER ACTION ===");
    console.log("Action: Skill");
    console.log("Dice Roll: " + roll);

    if (roll === 1) {
        damage = 150;
        manaCost = 20;
    } else if (roll === 2) {
        damage = 180;
        manaCost = 30;
    } else if (roll === 3) {
        damage = 210;
        manaCost = 40;
    } else if (roll === 4) {
        damage = 240;
        manaCost = 50;
    } else if (roll === 5) {
        damage = 270;
        manaCost = 60;
    } else if (roll === 6) {
        damage = 320;
        manaCost = 80;
    }

    // Check mana
    if (player.mana < manaCost) {
        console.log("Effect: NOT ENOUGH MANA - Using Basic Attack instead");
        basicAttack();
        return;
    }

    enemy.hp -= damage;
    player.mana -= manaCost;

    if (enemy.hp < 0) enemy.hp = 0;

    console.log("Effect: -" + damage + " enemy HP, -" + manaCost + " mana");
    showStats();

    endTurn();
}

// ❤️ HEAL + LUCKY REDRAW
function healAction() {
    let roll = rollDice();
    let healHP = 0;
    let healMana = 0;

    console.log("\n=== PLAYER ACTION ===");
    console.log("Action: Heal");
    console.log("Dice Roll: " + roll);

    if (roll === 1) {
        healHP = 80;
    } else if (roll === 2) {
        healHP = 70;
        healMana = 20;
    } else if (roll === 3) {
        healHP = 60;
        healMana = 30;
    } else if (roll === 4) {
        healHP = 50;
        healMana = 40;
    } else if (roll === 5) {
        healHP = 40;
        healMana = 50;
    } else if (roll === 6) {
        console.log("Effect: Lucky Redraw! Rolling again...");
        showStats();
        setTimeout(function() {
            healAction();
        }, 300);
        return;
    }

    player.hp += healHP;
    player.mana += healMana;

    // Cap stats
    if (player.hp > player.maxHP) player.hp = player.maxHP;
    if (player.mana > player.maxMana) player.mana = player.maxMana;

    console.log("Effect: +" + healHP + " HP, +" + healMana + " mana");
    showStats();

    endTurn();
}

// ⏭️ SKIP
function skipAction() {
    console.log("\n=== PLAYER ACTION ===");
    console.log("Action: Skip");
    console.log("Effect: Gained 2 extra turns");
    player.extraTurns = 1;
    showStats();
    
    // Skip turn - switch directly to enemy turn
    currentPlayer = "enemy";
    updateUI();
    setTimeout(enemyTurn, 500);
}

// 🤖 ENEMY TURN (SIMPLE AI - STAGE AWARE)
function enemyTurn() {
    // Stage 2+ can use skills/heal more often
    let actionChance = Math.floor(Math.random() * 3);
    let action = 0;

    if (currentStage === 1) {
        action = actionChance; // 0, 1, or 2
    } else if (currentStage === 2) {
        action = Math.floor(Math.random() * 4); // More varied: 0-3
    } else if (currentStage === 3) {
        action = Math.floor(Math.random() * 5); // Boss is more aggressive: 0-4
    }

    console.log("\n=== ENEMY ACTION ===");

    if (action === 0) {
        enemyBasic();
    } else if (action === 1) {
        enemySkill();
    } else {
        enemyHeal();
    }
}

// ENEMY ACTIONS (WITH CLEAR FEEDBACK)

function enemyBasic() {
    let roll = rollDice();
    let damage = 80 + (roll * 10);

    console.log("Action: Basic Attack");
    console.log("Dice Roll: " + roll);

    player.hp -= damage;
    enemy.mana += 20;

    if (enemy.mana > enemy.maxMana) enemy.mana = enemy.maxMana;
    if (player.hp < 0) player.hp = 0;

    console.log("Effect: -" + damage + " player HP, +" + 20 + " enemy mana");
    showStats();

    endTurn();
}

function enemySkill() {
    let roll = rollDice();
    let damage = 150 + (roll * 20);
    let manaCost = 30;

    console.log("Action: Skill");
    console.log("Dice Roll: " + roll);

    if (enemy.mana < manaCost) {
        console.log("Effect: NOT ENOUGH MANA - Using Basic Attack instead");
        showStats();
        enemyBasic();
        return;
    }

    player.hp -= damage;
    enemy.mana -= manaCost;

    if (player.hp < 0) player.hp = 0;

    console.log("Effect: -" + damage + " player HP, -" + manaCost + " enemy mana");
    showStats();

    endTurn();
}

function enemyHeal() {
    let roll = rollDice();
    let healAmount = 50 + (roll * 10);

    console.log("Action: Heal");
    console.log("Dice Roll: " + roll);

    enemy.hp += healAmount;

    if (enemy.hp > enemy.maxHP) enemy.hp = enemy.maxHP;

    console.log("Effect: +" + healAmount + " enemy HP");
    showStats();

    endTurn();
}

// 🔁 TURN SYSTEM
function endTurn() {
    if (checkWinner()) return;

    if (currentPlayer === "player") {
        // Check if player has extra turns left
        if (player.extraTurns > 0) {
            player.extraTurns -= 1;
            console.log("\n>>> Extra turn!");
            currentPlayer = "player";
            updateUI();
        } else {
            // Player's turn done, switch to enemy
            currentPlayer = "enemy";
            updateUI();
            setTimeout(enemyTurn, 500);
        }
    } else {
        // Enemy turn done, switch to player
        currentPlayer = "player";
        updateUI();
    }
}

// 🏆 WIN CHECK WITH STAGE PROGRESSION
function checkWinner() {
    if (player.hp <= 0) {
        console.log("\n❌❌ GAME OVER! You were defeated! ❌❌");
        return true;
    }

    if (enemy.hp <= 0) {
        if (currentStage === 1) {
            console.log("\n✅ Stage 1 Defeated! Advancing to Stage 2...");
            nextStage();
        } else if (currentStage === 2) {
            console.log("\n✅ Stage 2 Defeated! Advancing to Stage 3 (Final Boss)...");
            nextStage();
        } else if (currentStage === 3) {
            console.log("\n🎉🎉 YOU WIN! THE DRAGON BOSS IS DEFEATED! 🎉🎉");
            console.log("You are the ultimate champion!");
            return true;
        }
        return true;
    }
    return false;
}

// 📍 LOAD NEXT STAGE
function nextStage() {
    currentStage += 1;

    if (currentStage <= 3) {
        let config = stageConfig[currentStage];
        enemy = {
            hp: config.maxHP,
            maxHP: config.maxHP,
            mana: config.maxMana,
            maxMana: config.maxMana
        };

        console.log("\n" + config.name);
        currentPlayer = "player";
        updateUI();
    }
}

// 🖥️ UI DISPLAY
function updateUI() {
    let stageName = stageConfig[currentStage].name;
    console.log(stageName.padStart(25));
    console.log("==========================================");
    console.log("PLAYER: ".padStart(10) + player.hp + " / " + player.maxHP + " HP | " + player.mana + " / " + player.maxMana + " Mana");
    console.log("ENEMY:  ".padStart(10) + enemy.hp + " / " + enemy.maxHP + " HP | " + enemy.mana + " / " + enemy.maxMana + " Mana");
    console.log("==========================================");
    console.log("Turn: ".padStart(18) + currentPlayer.toUpperCase());
}

// 📊 SHOW UPDATED STATS (AFTER EACH ACTION)
function showStats() {
    console.log("--- UPDATED STATUS ---");
    console.log("Player: " + player.hp + " / " + player.maxHP + " HP | " + player.mana + " / " + player.maxMana + " Mana");
    console.log("Enemy:  " + enemy.hp + " / " + enemy.maxHP + " HP | " + enemy.mana + " / " + enemy.maxMana + " Mana");
}

function restartGame() {
    console.log("\n🔄 Restarting game...\n");

    // Reset player
    player = {
        hp: 1000,
        maxHP: 1000,
        mana: 200,
        maxMana: 200,
        extraTurns: 0
    };

    // Reset stage
    currentStage = 1;

    // Reset enemy using stage config
    let config = stageConfig[currentStage];
    enemy = {
        hp: config.maxHP,
        maxHP: config.maxHP,
        mana: config.maxMana,
        maxMana: config.maxMana
    };

    // Reset turn
    currentPlayer = "player";

    // Update UI
    updateUI();
}

// 🚀 START
console.log("🐉 Welcome to Dragon Fight!");
updateUI();