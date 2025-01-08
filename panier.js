
/*
Total global
*/

let destinations = []
async function load_destinations() {
    try {
        const response = await fetch('/js/destinations.json');
        const data = await response.json();
        destinations = data.map(city => city.name);
        console.log("Destinations loaded:", destinations);

        // Example: Perform actions after destinations are loaded
        destinations.forEach(destination => console.log(destination));
    } catch (error) {
        console.error('Error loading the file:', error);
    }
}
 load_destinations()

/* ================== Cookies ================== */

// Fonction qui cherche les cookies selon le nom de la destination et sépare les information
function get_cookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// Fonction qui parse et affiche les données de chaque voyage 
async function display_trips() {
    const fieldset = document.getElementById("options_fieldset");
    fieldset.innerHTML = "";

    // Liste des destinations
    await load_destinations();
    console.log("Destinations chargé");
    let trips = [];

    // Pour chaque destination trouvé dans les cookies il utilise get_cookie et parse le résultat
    destinations.forEach((destination) => {
        const tripCookie = get_cookie(destination);
        if (tripCookie) {
            try {
                const trip = JSON.parse(tripCookie);
                trips.push(...trip);
            } catch (e) {
                console.error(`Error parsing cookie info for ${destination}:`, e);
            }
        }
    });

    // Affichages des trips
    if (trips.length === 0) {
        fieldset.innerHTML = "<h2>No trips planned.</h2>";
    } else {
        trips.forEach((trip, index) => {
            const container = document.createElement("div");
            container.className = "trip-container";

            // Affichage des informations
            const details_title = document.createElement("h3");
            details_title.textContent = `Trip ${index + 1}: ${trip.dest}`;

            const details_date = document.createElement("p");
            details_date.textContent = `Arrival on the: ${trip.in_date} and staying for: ${trip.duration} days`;

            const details_num = document.createElement("p");
            details_num.textContent = `Adults: ${trip.num_adults}, Children: ${trip.num_children}`;

            const details_restauration = document.createElement("p");
            const breakfast = one_to_included(trip.breakfast);
            const lunch = one_to_included(trip.num_lunch);
            const dinner = one_to_included(trip.dinner);
            details_restauration.textContent = `Options Restauration: Breakfast - ${breakfast}, Lunch - ${lunch}, Dinner - ${dinner}`;

            const details_insurance = document.createElement("p");
            const cancelation = one_to_included(trip.num_cancelation);
            const healthcare = one_to_included(trip.healthcare);
            details_insurance.textContent = `Options Insurance: Cancellation - ${cancelation}, Healthcare - ${healthcare}`;

            const details_total = document.createElement("h4");
            details_total.textContent = `The total for the trip is: ${trip.total}€`;
            details_total.id = `total${trip.dest}`;
        
            // Boutton individuel pour enlever le voyage
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.onclick = () => removeTrip(trip.dest);

            const br = document.createElement("br");
            const brt = document.createElement("br");
            const brd = document.createElement("br");
            const brc = document.createElement("br");

            // Affichage en dans le HTML
            container.appendChild(brc);
            container.appendChild(details_title);
            container.appendChild(br);
            container.appendChild(details_date);
            container.appendChild(details_num);
            container.appendChild(details_restauration);
            container.appendChild(details_insurance);
            container.appendChild(brt);
            container.appendChild(details_total);
            container.appendChild(brd);
            container.appendChild(removeButton);
            
            fieldset.appendChild(container);
        });
    }
    calculate_total_from_elements() 
}

// Fonction qui sort chaque total de chaque id avec total pour calculer le total de tout les trips
function calculate_total_from_elements() {
    let total_total = 0;
    const allTotalElements = document.querySelectorAll('[id^="total"]');
    allTotalElements.forEach(element => {
        const value = sortir_nombre(element.textContent);
        if (!isNaN(value)) {
            total_total += value;
        }
    });

    document.getElementById("Total_cost").innerText = `TOTAL = ${total_total.toFixed(2)}€`;
}

// Fonction pour sortir le nombre de la phrase de total des trips
function sortir_nombre(phrase) {
    const match = phrase.match(/\d+(\.\d+)?/); 
    return match ? parseFloat(match[0]) : null;
}

// Fonction pour effacer le trip sur l'écran et dans les cookies
function removeTrip(destinationName) {
    deleteCookie(destinationName);
    // Refresh l'écran pour monter la nouvelle liste de voyages
    display_trips();
}

// Fonction qui efface les cookies (expiration dans le passé)
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// Fonction qui change les 1 et 0 des options en text
function one_to_included(value) {
    result = ""
    if (value === 1) {
        result = "Included";
    } else {
        result = "Not-Included";
    }
    return result
}

console.log(document.cookie)
display_trips();