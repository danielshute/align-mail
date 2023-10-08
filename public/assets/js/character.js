var notyf = new Notyf();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/characters/fetch', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                const characterContainer = document.querySelector('.characters-container')
                response.characters.forEach(async (character) => {
                    characterContainer.innerHTML = characterContainer.innerHTML + `
                    <div class="character"> <img src="${character.photo}" alt="" class="character-image">
                        <div class="text">
                            <p>${character.forename} ${character.surname}</p>
                            <p class="address">${character.address}@mail.align</p>
                        </div>
                        <div class="character-button-container">
                            <button onclick=select(${character.id});>Select</button>
                        </div>
                    </div>`
                })
                if (response.characters.length < 5) {
                    characterContainer.innerHTML = characterContainer.innerHTML + `<div class="add">
                    <h1><i class="fa-solid fa-plus"></i></h1>
                    <div class="character-button-container">
                        <button onclick=select(${character.id});>New Character</button>
                    </div>
                </div>`
                }
            } else if (response.success == false) {
                notyf.error("Failed to get characters");
            }
        })
})

function select(id) {
    fetch('/character/select', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                notyf.success('Character Selected');
                sleep(1000).then(() => { window.location.href = '/dashboard' });
            } else if (response.success == false) {
                notyf.error(response.message);
            }
        })
}