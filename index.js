const { ipcRenderer } = require('electron');

// DOM Controller

const jokesURL = "https://v2.jokeapi.dev/joke";
const requestFromAPI = document.getElementById("requestFromAPI");
const requestFromDB = document.getElementById("requestFromDB");
const cardJoke = document.getElementById("card-joke");
const categoryText = document.getElementById("category-text");
const setup = document.getElementById("setup");
const delivery = document.getElementById("delivery");
const radioAny = document.getElementById("radio-any");
const radioCustom = document.getElementById("radio-custom");
const categories = document.getElementsByClassName("category-checkbox");
const typeTwoPart = document.getElementById("type-twopart");
const typeSingle = document.getElementById("type-single");
const saveButton = document.getElementById("saveButton");

let parameters;
let catParam, flagParam, typeParam;
var currentJoke;

// Handle the click when the Request from API button is clicked.
requestFromAPI.addEventListener('click', function () {

    // HANDLE THE CATEGORY PARAMETERS
    catParam = null;
    // When the Submit button is clicked,
    // If the Any radio button is selected, select Any as the category.
    if (radioAny.checked) {
        catParam = "Any"
    } else {
        // If one or more categories are selected, select these as the categories.
        for (let i = 0; i < categories.length; i++) {
            var category = categories[i];
            if (category.checked) {
                if (!catParam) {
                    // If no categories have been added, simply add the first category.
                    catParam = category.value;
                } else {
                    // If there is already a category, add a comma and the new category.
                    catParam += `,${category.value}`;
                }
            }
        }
        // If no categories were selected, set Any category.
        if (!catParam) {
            catParam = "Any";
        }
    }


    // HANDLE THE JOKE TYPE PARAMETER
    typeParam = "";
    // If Single is checked, set the type to single
    if (typeSingle.checked) {
        if (!typeTwoPart.checked) {
            typeParam = "&type=single"
        }
    } else {
        // If only Two Part is checked, set the type to twopart.
        if (typeTwoPart.checked) {
            typeParam = "&type=twopart"
        }
    }
    // If both are checked, parameter will be null
    // If none are checked, parameter will be null

    console.log(`${jokesURL}/${catParam}?blacklistFlags=explicit${typeParam}`);
    // Make the API call.
    fetch(`${jokesURL}/${catParam}?blacklistFlags=explicit${typeParam}`)
        .then(results => {
            return results.json();
        })
        .then(resultsJson => {
            currentJoke = resultsJson;
            updateJoke(resultsJson);
            saveButton.disabled = false;
        });
});

// Handle the click when the Request from DB button is clicked.
requestFromDB.addEventListener('click', function () {

    // HANDLE THE CATEGORY PARAMETERS
    catParam = null;
    // When the Submit button is clicked,
    // If the Any radio button is selected, select Any as the category.
    if (radioAny.checked) {
        catParam = "Any"
    } else {
        // If one or more categories are selected, select these as the categories.
        for (let i = 0; i < categories.length; i++) {
            var category = categories[i];
            if (category.checked) {
                if (!catParam) {
                    // If no categories have been added, simply add the first category.
                    catParam = category.value;
                } else {
                    // If there is already a category, add a comma and the new category.
                    catParam += `,${category.value}`;
                }
            }
        }
        // If no categories were selected, set Any category.
        if (!catParam) {
            catParam = "Any";
        } else {
            let catArray = catParam.split(',');
            var catParamFinal = `("${catArray.join('", "')}")`;
            catParam = catParamFinal;
        }
    }


    // HANDLE THE JOKE TYPE PARAMETER
    typeParam = "";
    // If Single is checked, set the type to single
    if (typeSingle.checked) {
        if (!typeTwoPart.checked) {
            typeParam = "single"
        }
    } else {
        // If only Two Part is checked, set the type to twopart.
        if (typeTwoPart.checked) {
            typeParam = "twopart"
        }
    }
    // If both are checked, parameter will be null
    // If none are checked, parameter will be null


    // Make the MySQL Query;
    ipcRenderer.send('mySQLSelect', catParam, typeParam);

});

// Enable the custom categories checkboxes when the custom radio button is selected.
radioCustom.addEventListener('click', function () {
    if (!radioCustom.checked) {
        for (let i = 0; i < categories.length; i++) {
            var category = categories[i];
            category.checked = false;
            category.disabled = true;
        }
    } else {
        for (let i = 0; i < categories.length; i++) {
            var category = categories[i];
            category.disabled = false;
        }
    }
});

// Clear and disable the custom categories checkboxes when the Any radio button is checked.
radioAny.addEventListener('click', function () {
    if (!radioCustom.checked) {
        for (let i = 0; i < categories.length; i++) {
            var category = categories[i];
            category.checked = false;
            category.disabled = true;
        }
    } else {
        for (let i = 0; i < categories.length; i++) {
            var category = categories[i];
            category.disabled = false;
        }
    }
});

// Handle the click to the Save to DB button;
saveButton.addEventListener('click', function () {
    // Send query to Main process.
    ipcRenderer.send('mySQLInsert', currentJoke);
});

// Receive the signal when something is saved to the database successfully from the Main process.
ipcRenderer.on('insertSuccess', (event, arg) => {
    alert("The joke has been successfully saved to the database!");
});

ipcRenderer.on('insertFail', (event) => {
    alert("We were unable to save the joke.");
})

// Receive the signal when a joke is selected from the database in the Main process.
ipcRenderer.on('selectSuccess', (event, result) => {
    saveButton.disabled = true;
    console.log(result);
    updateJoke(result);
});

ipcRenderer.on('selectFail', (event) => {
    alert("No matching joke found! Try another search, or try adding new jokes from the API!");
});

// Function to Update the joke's HTML with the provided joke in JSON format.
function updateJoke(jokeJson) {
    categoryText.innerHTML = jokeJson.category;
    if (jokeJson.type == "twopart") {
        setup.innerHTML = jokeJson.setup;
        delivery.innerHTML = jokeJson.delivery;
    } else if (jokeJson.type == "single") {
        setup.innerHTML = "";
        delivery.innerHTML = jokeJson.joke;
    }
    // If the Jokes Result section is not visible, make it visible;
    if (cardJoke.style.display = "none") {
        cardJoke.style.display = "block";
    }
}