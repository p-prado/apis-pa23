// DOM Controller

const jokesURL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=explicit";
const requestButton = document.getElementById("requestButton");
const category = document.getElementById("category");
const setup = document.getElementById("setup");
const delivery = document.getElementById("delivery");
const radioAny = document.getElementById("radio-any");
const radioCustom = document.getElementById("radio-custom");
const categories = document.getElementsByClassName("category-checkbox");

let parameters;
let catParam, flagParam, typeParam;



// Handle the click when the Submit button is clicked.
requestButton.addEventListener('click', function () {

    // When the Submit button is clicked,
    // If the Any radio button is selected, select Any as the category.
    if (radioAny.checked) {
        catParam = "Any"
    } else {
        // Else, if no categories are selected, select Any as the category.
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
        console.log(catParam);
    }
    // Send the categories as parameters



fetch(jokesURL)
    .then(results => {
        return results.json();
    })
    .then(resultsJson => {
        category.innerHTML = resultsJson.category;
        if (resultsJson.type == "twopart") {
            setup.innerHTML = resultsJson.setup;
            delivery.innerHTML = resultsJson.delivery;
        } else if (resultsJson.type == "single") {
            setup.innerHTML = "";
            delivery.innerHTML = resultsJson.joke;
        }
    });
});

// Enable the custom categories checkboxes when the custom radio button is selected.
radioCustom.addEventListener('click', function(){
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
radioAny.addEventListener('click', function(){
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
