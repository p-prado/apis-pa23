// DOM Controller

const jokesURL = "https://v2.jokeapi.dev/joke";
const requestButton = document.getElementById("requestButton");
const cardJoke = document.getElementById("card-joke");
const categoryText = document.getElementById("category-text");
const setup = document.getElementById("setup");
const delivery = document.getElementById("delivery");
const radioAny = document.getElementById("radio-any");
const radioCustom = document.getElementById("radio-custom");
const categories = document.getElementsByClassName("category-checkbox");
const typeTwoPart = document.getElementById("type-twopart");
const typeSingle = document.getElementById("type-single");

let parameters;
let catParam, flagParam, typeParam;



// Handle the click when the Submit button is clicked.
requestButton.addEventListener('click', function () {

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
            categoryText.innerHTML = resultsJson.category;
            if (resultsJson.type == "twopart") {
                setup.innerHTML = resultsJson.setup;
                delivery.innerHTML = resultsJson.delivery;
            } else if (resultsJson.type == "single") {
                setup.innerHTML = "";
                delivery.innerHTML = resultsJson.joke;
            }

            // If the Jokes Result section is not visible, make it visible;
            if (cardJoke.style.display = "none") {
                cardJoke.style.display = "block";
            }
        });
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
