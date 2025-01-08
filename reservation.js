var total = 0;
var checked_all = 0;

var adult_night_cost = 0;
const child_percent = 40 / 100;
const pets_percent = 25 / 100;
const breakfast_const = 15;
const lunch_const = 20;
const dinner_const = 25;
const TVA = 8/100;
const cancelation_price = 45;
const healthcare_price = 50;

// Choix du jour pour les selecteurs de date du voyage
document.getElementById('start').valueAsDate = new Date();
document.getElementById('end').valueAsDate = new Date(+new Date() + 86400000);

function get_city_query() {
    const url = window.location.href;
    const query = url.split('?id=')[1];  
    
    fetch('/js/destinations.json')
        .then(response => response.json())
        .then(data => {
            const city = data.find(city => city.id === query);
            dict_cities = {}
            pets_cities = {}
            child_cities = {}
            breakfast_cities = {}
            meals_cities = {}
            data.forEach(city => {
                dict_cities[city.city_id] = city.name
                child_cities[city.city_id]  = city.children
                pets_cities[city.city_id] = city.pets
                breakfast_cities[city.city_id] = city.breakfast
                meals_cities[city.city_id] = city.meals
            });
        var numQuery = (query)
        if (numQuery in dict_cities) {
            console.log("Query found");
            document.getElementById("Stay_title").textContent = `Your stay at ${dict_cities[numQuery]}`;

            document.getElementById("pets").hidden = !pets_cities[numQuery];
            document.getElementById("pets_title").hidden = !pets_cities[numQuery];

            document.getElementById("children").hidden = !child_cities[numQuery];
            document.getElementById("children_title").hidden = !child_cities[numQuery];

            document.getElementById("breakfast").hidden = !breakfast_cities[numQuery];
            document.getElementById("breakfast_title").hidden = !breakfast_cities[numQuery];
            document.getElementById("breakfast_text").hidden = !breakfast_cities[numQuery];

            document.getElementById("lunch").hidden = !meals_cities[numQuery];
            document.getElementById("lunch_title").hidden = !meals_cities[numQuery];
            document.getElementById("lunch_text").hidden = !meals_cities[numQuery];
            
            document.getElementById("dinner").hidden = !meals_cities[numQuery];
            document.getElementById("dinner_title").hidden = !meals_cities[numQuery];
            document.getElementById("dinner_text").hidden = !meals_cities[numQuery];

            if (breakfast_cities[numQuery]) {
                if (meals_cities[numQuery]){
                    document.getElementById("restauration").hidden = false;
                }
            } else {
                document.getElementById("restauration").hidden = true;
            }

        } else {
            console.log("No query found");
            document.getElementById("Stay_title").textContent = `Please choose a destination.`;
            document.getElementById("Stay_text").textContent = `=====>(click me)<=====`;            
            document.getElementById("Stay_text").setAttribute('href', "../html/index.html");
        }
        })
    .catch(error => console.error('Error loading the file:', error));  
}

get_city_query()

function get_adultprice() {
    const url = window.location.href;
    const query = url.split('?id=')[1];  
    
    fetch('/js/destinations.json')
        .then(response => response.json())
        .then(data => {
            const city = data.find(city => city.id === query);
            dict_cities = {}
            data.forEach(city => {
                dict_cities[city.city_id] = city.adult_price
            });
        var numQuery = (query)
        if (numQuery in dict_cities) {
            console.log("Price Query found");
            console.log(dict_cities[numQuery])
            room_price_per_adult = dict_cities[numQuery];
            adult_night_cost = room_price_per_adult;
        } else {
            console.log("Price No query found");
        }
        })
    .catch(error => console.error('Error loading the file:', error));  
}

get_adultprice()
var room_price_per_adult = adult_night_cost;

function calc_total() {
    // Toutes les constantes
    var checked_all = 2;
    const checkIn = new Date(document.getElementById("start").value);
    const checkOut = new Date(document.getElementById("end").value);

    const num_adults = parseInt(document.getElementById("adults").value) || 0;
    const num_children = parseInt(document.getElementById("children").value) || 0;
    const num_pets = parseInt(document.getElementById("pets").value) || 0;

    const breakfastSelected = document.getElementById("breakfast").checked;
    const lunchSelected = document.getElementById("lunch").checked;
    const dinnerSelected = document.getElementById("dinner").checked;

    const cancelation = document.getElementById("cancelation").checked;
    const healthcare = document.getElementById("healthcare").checked;

    // Prix du séjour
    const duration = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    const roomPrice = duration * (num_adults * room_price_per_adult + num_children * room_price_per_adult * child_percent + num_pets * pets_percent);

    // Prix repas
    let optionsPrice = 0;
    if (breakfastSelected) optionsPrice += breakfast_const * duration * (num_adults + num_children);
    if (lunchSelected) optionsPrice += lunch_const * duration * (num_adults + num_children);
    if (dinnerSelected) optionsPrice += dinner_const * duration * (num_adults + num_children);

    //Prix taxes
    let taxes_and_fees = TVA*(optionsPrice+roomPrice);
    if (cancelation) taxes_and_fees += cancelation_price;
    if (healthcare) taxes_and_fees += healthcare_price;

    // Prix total
    total = roomPrice + optionsPrice + taxes_and_fees
    
    //Affichage
    document.getElementById("Room_cost").innerHTML = `Room price = ${(roomPrice).toFixed(2)}€`;
    document.getElementById("Options_cost").innerHTML = `Price of options = ${(optionsPrice).toFixed(2)}€`;
    document.getElementById("Taxes_and_fees_cost").innerHTML = `Taxes & fees = ${(taxes_and_fees).toFixed(2)}€`;
    
    document.getElementById("Total_cost").innerHTML = `TOTAL = ${(total).toFixed(2)}€`;

    // Verifcation Check-out est après Check-in
    if (checkOut <= checkIn) {
        document.getElementById("Total_cost").innerHTML = "TOTAL = Invalid dates";
        checked_all -= 1;
    }
    // Verifcation du nombre d'adultes
    if (num_adults < 1) {
        document.getElementById("Total_cost").innerHTML = "TOTAL = Invalid travelers";
        checked_all -= 1;
    }
    if (checked_all == 2) {
        const anchor = document.getElementById("addtocheckout");
        anchor.setAttribute('onclick', "checkout_pressed()");
    }
}

/* ================== Cookies ================== */

// Fonction qui écrit les cookies
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days*24*60*60*1000));
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
}

// Fonction qui crée le code des cookies et envoie à la page du panier
function checkout_pressed(){

    const checkIn = new Date(document.getElementById("start").value);
    const checkOut = new Date(document.getElementById("end").value);
    const duration = (checkOut - checkIn) / (1000 * 60 * 60 * 24);    

    const num_adults = parseInt(document.getElementById("adults").value) || 0;
    const num_children = parseInt(document.getElementById("children").value) || 0;
    const num_pets = parseInt(document.getElementById("pets").value) || 0;

    const breakfastSelected = document.getElementById("breakfast").checked;
    const lunchSelected = document.getElementById("lunch").checked;
    const dinnerSelected = document.getElementById("dinner").checked;

    const cancelation = document.getElementById("cancelation").checked;
    const healthcare = document.getElementById("healthcare").checked;

    // Création du code id du voyage pour les cookies
    const destination_title = document.getElementById("Stay_title").innerText;
    const idp = {
        "dest": destination_title.split(" ").pop(),
        "in_date": checkIn.toISOString().split('T')[0],
        "duration": duration,
        "num_adults": num_adults,
        "num_children": num_children,
        "num_pets": num_pets,
        "breakfast": Number(breakfastSelected),
        "lunch": Number(lunchSelected),
        "dinner": Number(dinnerSelected),
        "cancelation": Number(cancelation),
        "healthcare": Number(healthcare),
        "total": total
    };

    if (checkOut > checkIn && num_adults >= 1) {
        const destination_title = document.getElementById("Stay_title").innerText;
        cookie_name = destination_title.split(" ").pop();
        setCookie(cookie_name, JSON.stringify([idp]), 0.25);
        console.log(document.cookie)
        console.log("Cookie saved successfully.");  
        
        document.getElementById("addtocheckout").setAttribute('href',"../html/panier.html")
    }
}