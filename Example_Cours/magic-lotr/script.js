function parseMana(str) {
    return str.split(/\s*({\w*})\s*/g).filter(Boolean);
}

function ecrireCartes(){
    fetch("https://api.scryfall.com/cards/search?q=e:ltr%20lang:fr&format=json&order=set&unique=prints")
    .then(response => { return response.json();
    })
    .then(data =>{
        for (cartes of data.data){
            myP = document.createElement("p")
            myP.innerText = cartes.printed_name
            document.body.appendChild(myP)
        }
    })
}

async function ecrireCartesV2(){
    response = await fetch("https://api.scryfall.com/cards/search?q=e:ltr%20lang:fr&format=json&order=set&unique=prints")
    donnees = await response.json()
    for (cartes of donnees.data){
        myP = document.createElement("p")
        myP.innerText = cartes.printed_name
        document.body.appendChild(myP)
    }
}

