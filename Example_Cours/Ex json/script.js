class Personnage {
    constructor(nom, profession, createur) {
        this._nom = nom
        this._profession = profession
        this._createur = createur
    }
}

fetch("données.json")
.then(reponse => reponse.json())
.then(donnees => {
    for(perso of donnees){
        tableauPersonnages.push(new Personnage(perso.nom,perso.job,perso.créateur))
    }
    remplirPageHTML()
}
function remplirPageHTML(){
    let template = document.querySelector("#mon_template");

    for (const p of tableauPersonnages) {					                      // itère sur le tableau
        let clone = document.importNode(template.content, true);      // clone le template

        newContent = clone.firstElementChild.innerHTML		        // remplace {{modèle}}
            .replace(/{{nom}}/g, p._nom)				        
            .replace(/{{profession}}/g, p._profession)
            .replace(/{{createur}}/g, p._createur)		        

        clone.firstElementChild.innerHTML = newContent;		

        document.getElementById("body_table").appendChild(clone);				// On ajoute le clone créé
}


}
