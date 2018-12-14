const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
                  "P","Q","R","S","T","U","V","W","X","Y","Z"];

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

const translate = (inputText, key, direction) => {

    let message = {};
    let keyRepeats = 0;

    message.inputText = inputText;
    message.key = key;
    message.direction = direction;

    // Convert strings to numbers
    message.numericText = lettersToNumbers(message.inputText);

    // Extend the key to the same length as the message, or truncate if necessary
    if (message.key.length > message.numericText.length) {
        message.key.length = message.numericText.length;
        message.numericKey = lettersToNumbers(message.key);
        // TODO: This causes NaNs to appear in the numericCyphertext array when
        // arrayModulo is called below
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

    return message;
}
