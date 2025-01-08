// https://www.youtube.com/watch?v=drK6mdA9d_M

fetch('address').then((response) =>{
    return response.json(); // return a promise
}).then(data => { // takaes data from response.json()
    console.log(data);
}).catch((err) => {
    console.log('rejected', err);
    // On network error
})


// https://www.youtube.com/watch?v=37vxWr0WgQk

// find a pokemon name and show the image

async function fetchData(){
    try{
        const response = await fetch('httpspokemon.site:${name}');
        if(!response.ok){
            throw new Error("Could not fetch resource");
        }
        const data = await response.json();
        const pokemon_image = data.sprite.front_default;
        const imgHTML = document.getElementById("pokemonIMG");

        imgElement.src = pokemon_image;
        imgElement.style.display = "block";
        console.log(data);
    }
    catch(error){
        console.error(error);
    }
}
