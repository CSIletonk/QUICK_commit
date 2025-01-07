function parseMana(str) {
    return str.split(/\s*({\w*})\s*/g).filter(Boolean);
}

async function afficherCartesv2() {
    let url = "https://api.scryfall.com/cards/search?q=e:ltr%20lang:fr&format=json&order=set&unique=prints"
    let hasMore = true;
    let template = document.querySelector("#card-template");
    list_symb = await getSymbols();

    while (hasMore) {
        let reponse = await fetch(url);
        let donnees = await reponse.json();

        for (card of donnees.data) {
            let clone = document.importNode(template.content, true);

            let newContent = clone.firstElementChild.innerHTML
            .replace(/{{texte}}/g, card.printed_name)

            clone.firstElementChild.innerHTML = newContent;

            clone.querySelector(".card-img").src = card.image_uris.normal;

            symb_mana = parseMana(card.mana_cost)

            for (info_mana of symb_mana) {
                let img = document.createElement("img");
                img.classList.add("mana")
                img.src = list_symb[info_mana];
                clone.querySelector(".mana-img").appendChild(img);
            }

            document.querySelector("#grid-container").appendChild(clone); //Bien mettre cette ligne à la fin sinon ça marche pas
            
        }

        hasMore = donnees.has_more;
        url = donnees.next_page;

    }   
}

async function getSymbols() {
    let url = "https://api.scryfall.com/symbology";
    let dico = {};
    let reponse = await fetch(url);
    let donnees = await reponse.json();

    for (card_symbols of donnees.data) {
        dico[card_symbols.symbol] = card_symbols.svg_uri;
    }
    return dico


    
}

afficherCartesv2();