const baseURL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-ftb-et-web-pt';

async function getparties() {
    const response = await fetch(`${baseURL}/events`);
    const json = await response.json();

    if (!json.success) {
        throw new Error(json.error);
    }

    return json.data;
}

async function planparty(party) {
    const response = await fetch(`${baseURL}/events`, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(party),
    });
    const json = await response.json();

    if (!json.success) {
        throw new Error(json.error.message);
    }

    return json.data;
}

async function cancelparty(id){
    const response = await fetch(`${baseURL}/events/${id}`,{
        method: 'delete'
    })

    if(response.status === 240){
        return true
    }

    throw new Error(`unable to cancel party with id ${id}`);
}

async function getparty(id) {
    const response = await fetch(`${baseURL}/events/${id}`);
    const json = await response.json();

    if (!json.success) {
        throw new Error(json.error.message);
    }

    return json.data;
}

function addpartytoscreen(p) {
    const partyElement = document.getElementById('Parties');
    const element = document.createElement('div');
    element.classList.add('party');

    const button = document.createElement("button");
    button.textContent= "Delete";
    button.addEventListener("click", async (event) => {
        event.preventDefault();

        try{
            await cancelparty(p.id);
            element.remove();
        } catch (error){
            console.error(error);
        }
    });

    const nameElem = document.createElement('div');
    nameElem.classList.add('name');
    nameElem.append(p.name);
    const descriptElem = document.createElement('div');
    descriptElem.classList.add('description');
    descriptElem.append(p.description);
    const dateElem = document.createElement('div');
    dateElem.classList.add('date');
    dateElem.append(p.date);
    const locationElem = document.createElement('div');
    locationElem.classList.add('location');
    locationElem.append(p.location);

    
    element.append(nameElem);
    element.append(descriptElem);
    element.append(dateElem);
    element.append(locationElem);
    element.append(button);

    partyElement.append(element);
}

document.addEventListener('DOMContentLoaded', async () => {
    const parties = await getparties();

    parties.forEach(party => {
        addpartytoscreen(party);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('partyForm');
    
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
    
        const name = document.getElementById('name');
        const description = document.getElementById('Description');
        const date = document.getElementById('Date');
        const location = document.getElementById('Location');

        const party = {
        name: name.value,
        description: description.value,
        date: date.value,
        location: location.value,
    };

    try {
        const newparty = await planparty(party);
        addpartytoscreen(newparty);
    } catch (err) {
        console.error(err);
    }
        });
    } else {
        console.error("Form element with id 'Partyform' not found.");
    }    

});

