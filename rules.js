class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        /*if (locationData.HasSpecialMechanism && locationData.MechanismType === "riddle") {
            this.engine.gotoScene(RiddleLocation, key);  
         }*/

        if (Engine.inventory.hasItem("Lantern") && key == "THE DRAGON") {  // Check if the player has the Lantern
            this.engine.addChoice("The Lantern glows fiercly, shaking you into action! You dart out of the dragon's mouth, falling into a cranny and right into an airduct! It shoots you up!", {Text: "Up You Go", Target: "Uppies!"});
        }

        if (locationData.Body == "Freedom!" ) {  // Check if the player has the key
            this.engine.addChoice( "Try the Rock Key", { 
                Text: "Let's Try the Rock Key", 
                Target: "Outside"
            });
        }

        if (Engine.inventory.hasItem("Key") && key == "Freedom!") {  // Check if the player has the useless key
            this.engine.addChoice("Try Tge Jet", { 
                Text: "Let's Try the Golden Key", 
                Target: "Hoard Tunnel"
            });
        }

        if(locationData.Choices) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
            Engine.inventory.addItem(choice);
        } else {
            this.engine.gotoScene(End);
        }
    }
    addItemToInventory(itemName) {
        // This should add the item to the player's inventory if they don't already have it
        if (!this.engine.inventory[itemName]) {
            this.engine.inventory[itemName] = true;  // Mark the item as collected
            this.engine.show(`You have obtained the ${itemName}!`);
        }
    }
}
/*
class RiddleLocation extends Location {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);  // Show the body of the riddle location

        // If the location has a special riddle mechanism, trigger it
        if (locationData.HasSpecialMechanism && locationData.MechanismType === "riddle") {
            this.triggerRiddleMechanism(key);
        }

        // Show choices if available
        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice) {
            if (choice.Target === "_riddleSolved") {
                this.engine.show("You solved the riddle! You feel a warmth and strength in your wings like never before! You could fly out like this!");
                this.engine.gotoScene(Location, "Flying Away");  // Move to the next location after solving
            } else if (choice.Target === "_riddleFailed") {
                this.engine.show("You failed the riddle. The book closes, all it's glowing and whispering disappearing. Not the end of the world I suppose.");
                this.engine.gotoScene(Location, "The Dragon Hoard");  // Go back to start if failed
            } else {
                this.engine.show("&gt; " + choice.Text);
                this.engine.gotoScene(Location, choice.Target); 
            }
        } else {
            this.engine.gotoScene(End);
        }
    }

    // Trigger the riddle mechanism
    triggerPuzzleMechanism(key) {
        this.engine.show("You have to solve this riddle! Who knows what the book will give you");
        this.addPuzzleChoices(key);
    }

    addPuzzleChoices(key) {
        this.engine.addChoice("Solve it", {
            Text: "David!", 
            Target: "_puzzleSolved"  // Target for solving the puzzle
        });
        this.engine.addChoice("Pop", {
            Text: "Fail it", 
            Target: "_puzzleFailed"  // Target for failing the puzzle
        });
        this.engine.addChoice("Who Cares?? Dumb Book", {
            Text: "Fail it", 
            Target: "_puzzleFailed"  // Target for failing the puzzle
        });
    }
}
*/
class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

class GameWorldItem {
    constructor() {
        // Keep inventory simple: just track names as keys
        this.inventory = {};
    }

    addItem(itemName) {
        if (!this.inventory[itemName]) {
            this.inventory[itemName] = true;
        }
    }

    hasItem(itemName) {
        return !!this.inventory[itemName];
    }
}

Engine.load(Start, 'myStory.json');
Engine.inventory = new GameWorldItem();