// import { modulo_add, modulo_subtract } from "modulo";

console.log("app.js connected");



const elements = {
    keyField: document.getElementById("key-input"),
    textField: document.getElementById("text-input"),
    encypherButton: document.getElementById("btn-encypher"),
    decypherButton: document.getElementById("btn-decypher"),
    textOutput: document.getElementById("text-output")
}

const getText = () => {
    let key = elements.keyField.value;
    let text = elements.textField.value;
    return { key: tidyText(key), inputText: tidyText(text) };
}

const perform_translation = (e, direction) => {

    e.preventDefault();

    message = getText();
    message = translate(message.inputText, message.key, direction);

    // Format output text box to match buttons
    if (message.direction == "encypher") {
        // TODO: Make this neater
        elements.textOutput.classList.remove("alert-secondary");
        elements.textOutput.classList.remove("alert-warning");
        elements.textOutput.classList.add("alert-success");
        elements.decypherButton.classList = "btn btn-lg btn-warning btn-block";
        elements.encypherButton.classList = "btn btn-lg btn-outline-success btn-block";
        elements.encypherButton.innerHTML = "Encyphered"
        elements.decypherButton.innerHTML = "Decypher"
    } else if (message.direction == "decypher") {
        elements.textOutput.classList.remove("alert-secondary");
        elements.textOutput.classList.remove("alert-success");
        elements.textOutput.classList.add("alert-warning");
        elements.decypherButton.classList = "btn btn-lg btn-outline-warning btn-block";
        elements.encypherButton.classList = "btn btn-lg btn-success btn-block";
        elements.encypherButton.innerHTML = "Encypher"
        elements.decypherButton.innerHTML = "Decyphered"
    }

    elements.textOutput.innerHTML = message.outputText;
    elements.textOutput.classList.remove("invisible");
}

elements.encypherButton.addEventListener("click", (e) => {
    perform_translation(e, "encypher");
});

elements.decypherButton.addEventListener("click", (e) =>{
    perform_translation(e, "decypher");
});
