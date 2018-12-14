/**
 * @fileoverview A set of functions that togther provide functionality to
 * implement Vigenere cypher.
 */

 /**
  * Adjusted modulo addition function that works for the alphabet. Defaults to
  * adding numbers mod-26 but this is customisable.
  * `i` and `m` are added together mod `n`.
  * @param {!number} i
  * @param {!number} m
  * @param {number} [n=26] Modulus, defaults to 26.
  */
const modulo_add = (i, m, n = 26) => {
    return ((i + m - 1) % n + 1);
}

/**
 * Adjusted modulo subtraction function that works for the alphabet. Defaults to
 * adding numbers mod-26 but this is customisable.
 * `m` is subtracted from `i` mod `n`.
 * @param {!number} i
 * @param {!number} m
 * @param {number} [n=26] Modulus, defaults to 26 for use with the alphabet.
 * @returns {number}
 */
const modulo_subtract = (i, m, n = 26) => {
    return ((i - m + n - 1) % n + 1);
}

/**
 * Uses the {@link modulo_add} and {@link modulo_subtract} functions to perform
 * modular addition or subtraction of a pair of arrays.
 * @param {number[]} keyArray An array of numbers representing the message key.
 * @param {number[]}  textArray An array of numbers representing the message
        text.
 * @param {number} [n=26] Modulus, defaults to 26 for use with the alphabet.
 * @returns {number[]}
 */
const arrayModulo = (keyArray, textArray, direction, n = 26) => {
  // TODO: Add input type-checking
  // TODO: Ensure that arrays are the same length
  let result = [];
  if (direction == "add") {
      for (let i = 0; i < keyArray.length; i++) {
          result.push(modulo_add(textArray[i], keyArray[i], n));
      }
  } else if (direction == "subtract") {
      for (let i = 0; i < keyArray.length; i++) {
          result.push(modulo_subtract(textArray[i], keyArray[i], n));
      }
  }
  return result;
}

/**
 * Remove all non-letter chars and convert to uppercase
 * @param {!string} string The string to be converted.
 * @returns {string}
 */
const tidyText = (string) => {
  return string.toUpperCase().replace(/[^A-Z]/g, "");
}

/**
 * Given a string, return an array of numbers representing position in the
 * alphabet.
 * @param {!string} string The string to be converted.
 * @returns {number[]}
 */
const lettersToNumbers = (string) => {
  // TODO: Type checking
  // TODO: Ensure capitalisation and no spaces etc.
  const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
                    "P","Q","R","S","T","U","V","W","X","Y","Z"];
  const numbers = [];
  for (character of string) {
      numbers.push(alphabet.indexOf(character) + 1);
  }
  return numbers;
}

/**
 * Given an array of numbers representing positions in the alphabet, return the
 * relevant string.
 * @param {!number[]} numbers The array of numbers to be converted.
 * @returns {string}
 */
const numbersToLetters = (numbers) => {
  const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
                    "P","Q","R","S","T","U","V","W","X","Y","Z"];
  const letters = [];
  for (number of numbers) {
      letters.push(alphabet[number - 1]);
  }
  return letters.join("");
}

/**
 * Repeat an array.
 * @param {!*[]} array The array to be repeated.
 * @param {!number} n_repeats The number of times to repeat the array. Must be a
 *     whole number.
 * @returns {*[]}
 */
const repeatArray = (array, n_repeats) => {
  // TODO: Handle non-integer values of n_repeats.
  let len = array.length;
  let result = [];
  for (let i = 0; i < n_repeats; i++) {
      result.push(array[i % len]);
  }
  return result;
}

/**
 * Translate a message.
 * @param {!string} inputText The plaintext string.
 * @param {!string} key Key to be used to encypher / decypher `inputString`.
 * @param {!string} direction One of either `encypher'` or `'decypher'`.
 * @returns {string}
 */
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
