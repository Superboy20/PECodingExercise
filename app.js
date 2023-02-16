const people = document.getElementById("cards-wrap");
const peopleNext = document.getElementById("people_next");
const peoplePrevious = document.getElementById("people_previous");

let peopleURL = "https://swapi.dev/api/people/?page=1";
let nextPeoplePage;
let previousPeoplePage;

// nextPage and previousPage functions that grab the next/previous page based on the
// swapi keywords to grab the necessary data because swapi only gives 10 results per page
function nextPage() {
    if (nextPeople) {
        peopleURL = new URL(nextPeople);
    }
    fetchNames()
}

function previousPage() {
    if (previousPeople) {
        peopleURL = new URL(previousPeople);
    }
    fetchNames()
}

// Event listeners for buttons to navigate between next and previous pages
// using the functions nextPage() and previousPage()
if (peopleNext) {
    peopleNext.addEventListener("click", nextPage);
}

if (peoplePrevious) {
    peoplePrevious.addEventListener("click", previousPage);
}

// Function that fetches the data from the peopleURL that holds the API URL
async function fetchNames() {

    // On non-mobile view, shows a darkened screen with the word "Loading" as the data is being fetched
    document.querySelector('.overlay').classList.add('active');
    let results = await fetch(peopleURL);
    const data = await results.json();
    nextPeople = data.next;
    previousPeople = data.previous;
    let characters = data.results;

    // Output is set to an empty string before the loop, as it will paste the info dynamically as it is filled
    let output = '';

    // Loop through the characters array, and sets the item var to represent each character
    for (let i = 0; i < characters.length; i++) {
        let item = characters[i];

        // Vehicle names, manufactuerers, and cost are all set to an empty array
        let vehicleNames = [];
        let vehicleManufacturers = [];
        let vehicleCost = [];

        // If a character is NOT associated with any vehicles, provide 'N/A' in the text content
        if (item.vehicles.length === 0) {
            vehicleNames.push('N/A');
            vehicleManufacturers.push('N/A');
            vehicleCost.push('N/A');
        } else {
            // Loop through each character's vehicle info, push results into vehicleNames, vehicleManufacturers, vehicleCost arrays
            // with the necessary info
            for (let j = 0; j < item.vehicles.length; j++) {
                let vehicleResult = await fetch(item.vehicles[j]);
                let vehicleData = await vehicleResult.json();
                vehicleNames.push(vehicleData.name);
                vehicleManufacturers.push(vehicleData.manufacturer);
                vehicleCost.push(vehicleData.cost_in_credits);
            }
        }
        // Paste info dynamically into HTML with the necessary content filled out
        output += `<div class="card-item">
            <div class="card-inner">
              <div class="character-info">
              <button class="collapsible"> ${item.name}</button>
              </div>
              <div id="empty" class="content character-info">
              <p>Vehicle Name: ${vehicleNames.join(', ')}<p>
              <p>Vehicle Manufacturer: ${vehicleManufacturers.join(', ')}<p>
              <p> Vehicle Cost: ${vehicleCost.join(', ')}<p>
              </div>

              <div class="character-info">Height: ${item.height} cm</div>
              <div class="character-info">Weight: ${item.mass} kg</div>
              <div class="character-info">Birth Year: ${item.birth_year}</div>
              <div class="character-info">Gender: ${item.gender}</div>
              <div class="character-info">Hair Color: ${item.hair_color}</div>
              </div>
              </div>`
    }

    // Remove the darkend loading page after data is fetched and displayed
    document.querySelector('.overlay').classList.remove('active');
    people.innerHTML = output;
    showVehicles();
}

// Toggle function that hides/displays vehicle info based on the character name clicked
// On page load, it checks if the display is set to block, if so, set it to none.
function showVehicles() {
    let collection = document.getElementsByClassName("collapsible");
    let content = document.getElementsByClassName("content");
    for (let i = 0; i < collection.length; i++) {
        collection[i].addEventListener("click", function () {
            this.classList.toggle("active");
            if (content[i].style.display === "block") {
                content[i].style.display = "none";
            } else {
                content[i].style.display = "block";
            }
        });
    }
}

fetchNames();
