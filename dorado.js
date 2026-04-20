// 🐉 Dragon Fight (Player-Controlled)

let dragon1 = { name: "Dragon 1", hp: 300, mana: 100, extraTurns: 0 };
let dragon2 = { name: "Dragon 2", hp: 300, mana: 100
    , extraTurns: 0 };

let currentPlayer = dragon1;
let opponent = dragon2;

// 🎲 Roll Action
function rollAction() {
    let roll = Math.floor(Math.random() * 6) + 1;
    console.log(currentPlayer.name + " rolled: " + roll);

    if (hasEnoughMana(roll)) {
        executeMove(roll);
    } else {
        console.log("Not enough mana → Default Attack");
        defaultAttack();
    }

    endTurn();
}

// ⏭️ Skip Action
function skipAction() {
    console.log(currentPlayer.name + " skipped and gained 2 extra turns");
    currentPlayer.extraTurns = 2;
    endTurn(true);
}

// ⚔️ Execute Moves
function executeMove(roll) {
    switch (roll) {
        case 1:
            dealDamage(120);
            currentPlayer.mana -= 20;
            break;

        case 2:
            dealDamage(200);
            currentPlayer.mana -= 50;
            break;

        case 3:
            dealDamage(150);
            currentPlayer.mana -= 10;
            break;

        case 4:
            dealDamage(130);
            currentPlayer.mana -= 30;
            heal(50);
            break;

        case 5:
            dealDamage(50);
            console.log("Lucky Redraw! You can roll again.");
            currentPlayer.extraTurns++; // give 1 extra turn instead
            break;

        case 6:
            dealDamage(80);
            currentPlayer.mana += 60;
            break;
    }
}

// ⚙️ Default Attack (No Mana)
function defaultAttack() {
    dealDamage(60);
    currentPlayer.mana += 40;
}

// ❤️ Damage & Heal
function dealDamage(amount) {
    opponent.hp -= amount;
    if (opponent.hp < 0) opponent.hp = 0;
    console.log(opponent.name + " takes " + amount + " damage");
}

function heal(amount) {
    currentPlayer.hp += amount;
    if (currentPlayer.hp > 1000) currentPlayer.hp = 1000;
    console.log(currentPlayer.name + " heals " + amount);
}

// 🔍 Mana Check
function hasEnoughMana(roll) {
    return currentPlayer.mana >= getManaCost(roll);
}

// 🧠 Mana Cost
function getManaCost(roll) {
    switch (roll) {
        case 1: return 20;
        case 2: return 50;
        case 3: return 10;
        case 4: return 30;
        case 5: return 0;
        case 6: return 0;
    }
}

// 🔁 End Turn Logic
function endTurn(skipped = false) {
    if (checkWinner()) return;

    if (skipped) {
        switchTurn();
        updateUI();
        return;
    }

    if (currentPlayer.extraTurns > 0) {
        currentPlayer.extraTurns--;
        console.log(currentPlayer.name + " uses extra turn (" + currentPlayer.extraTurns + " left)");
    } else {
        switchTurn();
    }

    updateUI();
}

// 🔄 Switch Turn
function switchTurn() {
    if (currentPlayer === dragon1) {
        currentPlayer = dragon2;
        opponent = dragon1;
    } else {
        currentPlayer = dragon1;
        opponent = dragon2;
    }
}

// 🏆 Check Winner
function checkWinner() {
    if (dragon1.hp === 0 || dragon2.hp === 0) {
        console.log("Game Over!");
        console.log(dragon1.hp === 0 ? "Dragon 2 Wins!" : "Dragon 1 Wins!");
        return true;
    }
    return false;
}

// 🖥️ UI Update (for now console)
function updateUI() {
    console.log("\n--- STATUS ---");
    console.log("Dragon 1 → HP:", dragon1.hp, "Mana:", dragon1.mana);
    console.log("Dragon 2 → HP:", dragon2.hp, "Mana:", dragon2.mana);
    console.log(currentPlayer.name + "'s turn\n");
}

// 🚀 Start
updateUI();

rollAction() 
skipAction()
skipAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()
rollAction()

