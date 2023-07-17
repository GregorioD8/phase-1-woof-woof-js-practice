//base document elements
let barDiv = document.querySelector('#dog-bar')
let infoDiv = document.querySelector('#dog-info')
let filterBtn = document.querySelector('#good-dog-filter')
//card elements
let dCard = document.createElement('div')
let toggleButton = document.createElement('button')
let image = document.createElement('img')
let h2 = document.createElement('h2')
//creating card
dCard.appendChild(image)
dCard.appendChild(h2)
dCard.appendChild(toggleButton)

filterBtn.addEventListener('click', toggleFilter)
toggleButton.addEventListener('click', toggleMorality)

let filterOn = false
let doggoObj = {}
let goodBad = ''


function toggleFilter() {

    filterOn = !filterOn

    if (filterOn) {
        filterBtn.innerText = 'Filter good dogs: ON'
    } else {
        filterBtn.innerText = 'Filter good dogs: OFF'
    }

    getDogs()
}

///updates the card text and calls get dogs 
function updateCard() {

    if (doggoObj.isGoodDog) {
        goodBad = 'Good Dog!'
    } else {
        goodBad = 'Bad Dog!'
    }

    toggleButton.innerText = goodBad
    h2.innerText = doggoObj.name
    image.src = doggoObj.image

    infoDiv.appendChild(dCard)
    getDogs()

}

//Dom rendering function
function renderDogs(dogsArray) {

    dogArr = []
    for (const dog of dogsArray) {

        let dSpan = document.createElement('span')
        dSpan.textContent = dog.name

        // barDiv.appendChild(dSpan)
        dSpan.addEventListener('click', (e) => {
            e.preventDefault()

            doggoObj = {
                id: dog.id,
                name: dog.name,
                isGoodDog: dog.isGoodDog,
                image: dog.image
            }
            updateCard()

        })
        dogArr.push(dSpan)
    }
    barDiv.replaceChildren(...dogArr)
}


function getDogs() {

    fetch('http://localhost:3000/pups')
        .then(res => res.json())
        .then(dogData => {

            if (filterOn === true) {
                const filteredDogs = dogData.filter(dog => dog.isGoodDog)
                renderDogs(filteredDogs)
            } else {
                renderDogs(dogData)
            }
        })
}


function toggleMorality() {

    newMorals = !doggoObj.isGoodDog
    doggoObj.isGoodDog = newMorals

    fetch(`http://localhost:3000/pups/${doggoObj.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doggoObj)
    })
        .then(res => res.json())
        .then(dog => console.log(dog))

    updateCard()
    getDogs()
}


function initialize() {
    getDogs()
}

initialize()