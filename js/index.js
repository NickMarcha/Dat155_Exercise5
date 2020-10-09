"use strict";

import App from "./App.js";

//Strengt tatt ikke nødvendig med en egen index.js - men kan gi litt eksplisitt kontroll over hva som skjer når programmet startes
window.onload = () => {
    new App();
}