// import { modulo_add, modulo_subtract } from "modulo";

console.log("app.js connected");

const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
                  "P","Q","R","S","T","U","V","W","X","Y","Z"];

const elements = {
    keyField: document.getElementById("key-input"),
    textField: document.getElementById("text-input"),
    encypherButton: document.getElementById("btn-encypher"),
    decypherButton: document.getElementById("btn-decypher"),
    textOutput: document.getElementById("text-output")
}

// Adjuted modulo functions that work for the alphabet
const modulo_add = (i, m, n = 26) => {
    return ((i + m - 1) % n + 1);
}

const modulo_subtract = (i, m, n = 26) => {
    return ((i - m + n - 1) % n + 1);
}

// Function to apply modular addition or subtraction to two arrays of numbers
const arrayModulo = (keyArray, textArray, direction) => {
    let result = [];
    if (direction == "add") {
        for (let i = 0; i < keyArray.length; i++) {
            result.push(modulo_add(textArray[i], keyArray[i]));
        }
    } else if (direction == "subtract") {
        for (let i = 0; i < keyArray.length; i++) {
            result.push(modulo_subtract(textArray[i], keyArray[i]));
        }
    }
    return result;
}

const getText = () => {
    let key = elements.keyField.value;
    let text = elements.textField.value;
    return { key: tidyText(key), inputText: tidyText(text) };
}

const tidyText = (string) => {
    // Remove all non-letter chars and convert to uppercase
    return string.toUpperCase().replace(/[^A-Z]/g, "");
}

const lettersToNumbers = (string) => {
    // Given a string, return an array of numbers representing position in
    // the alphabet. Requires an array called alphabet = ["A", "B", "C"...]
    const numbers = [];
    for (character of string) {
        numbers.push(alphabet.indexOf(character) + 1);
    }
    return numbers;
}

const numbersToLetters = (numbers) => {
    // Given an array of numbers, return a string of the corresponding letters
    const letters = [];
    for (number of numbers) {
        letters.push(alphabet[number - 1]);
    }
    return letters.join("");
}

const repeatArray = (array, n_repeats) => {
    let len = array.length;
    let result = [];
    for (let i = 0; i < n_repeats; i++) {
        result.push(array[i % len]);
    }
    return result;
}

const translate = (e, direction) => {
    e.preventDefault();

    let message = {};
    let keyRepeats = 0;
    message = getText();
    message.direction = direction;

    // Convert strings to numbers
    message.numericText = lettersToNumbers(message.inputText);

    // Extend the key to the same length as the message, if necessary
    if (message.key.length > message.numericText.length) {
        console.log("Key too long - truncating");
    } else {
        message.key = repeatArray(message.key, message.numericText.length)
        message.numericKey = lettersToNumbers(message.key);
    }

    // Depending on the direction we're going, perform modular conversion
    if (message.direction == "encypher") {
        message.numericCyphertext = arrayModulo(message.numericKey, message.numericText, "add");
        message.outputText = numbersToLetters(message.numericCyphertext);
    } else if (message.direction == "decypher") {
        message.numericPlaintext = arrayModulo(message.numericKey, message.numericText, "subtract");
        message.outputText = numbersToLetters(message.numericPlaintext);
    }

    console.log(message);
    console.log(message.outputText);

    // Format output text box to match buttons
    if (message.direction == "encypher") {
        // TODO: Make this neater
        elements.textOutput.classList.remove("alert-secondary");
        elements.textOutput.classList.remove("alert-warning");
        elements.textOutput.classList.add("alert-success");
        elements.decypherButton.classList = "btn btn-lg btn-warning";
        elements.encypherButton.classList = "btn btn-lg btn-outline-success";
        elements.encypherButton.innerHTML = "Encyphered"
        elements.decypherButton.innerHTML = "Decypher"
    } else if (message.direction == "decypher") {
        elements.textOutput.classList.remove("alert-secondary");
        elements.textOutput.classList.remove("alert-success");
        elements.textOutput.classList.add("alert-warning");
        elements.decypherButton.classList = "btn btn-lg btn-outline-warning";
        elements.encypherButton.classList = "btn btn-lg btn-success";
        elements.encypherButton.innerHTML = "Encypher"
        elements.decypherButton.innerHTML = "Decyphered"
    }

    elements.textOutput.innerHTML = message.outputText;
}

elements.encypherButton.addEventListener("click", (e) => {
    translate(e, "encypher");
});

elements.decypherButton.addEventListener("click", (e) =>{
    translate(e, "decypher");
});
