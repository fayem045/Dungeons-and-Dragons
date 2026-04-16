// Dice Constructor (like Animal / Pokemon)
function Dice(sides) {
    this.sides = sides;

    this.roll = function() {
        return Math.floor(Math.random() * this.sides) + 1;
    }
}

// Create dice instances
let d4 = new Dice(4);
let d6 = new Dice(6);
let d8 = new Dice(8);
let d10 = new Dice(10);
let d12 = new Dice(12);
let d20 = new Dice(20);

// Object for DnD system (like grouping behavior)
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

    // DnD notation parser (e.g. "2d6+3")
    roll: function(notation) {
        let match = notation.match(/(\d*)d(\d+)([+-]\d+)?/);

        let num = parseInt(match[1]) || 1;
        let sides = parseInt(match[2]);
        let mod = match[3] ? parseInt(match[3]) : 0;

        let dice = new Dice(sides);
        let result = this.rollMany(dice, num);

        let final = result + mod;

        console.log(`Modifier: ${mod}`);
        console.log(`Final Total: ${final}`);
        return final;
    }
};


console.log("Single rolls:");
console.log("d20:", d20.roll());
console.log("d6:", d6.roll());

console.log("\nDnD notation:");
DnD.roll("1d20+5"); //1st no.: ilan dice na gagamitn; 2nd no.: d(dice) sides na meron ung each dice; 3rd no.: modifier
DnD.roll("2d6+3"); 