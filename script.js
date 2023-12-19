const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2308-FTB-MT-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}/players`);
        const playerList = await response.json();
        console.log(playerList);
        return playerList.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
    const response = await fetch(`${APIURL}/players/${playerId}`);
    const playerIds = await response.json();
    console.log(playerIds);
    return playerIds.data.playerId;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        console.log('Adding new player:', playerObj);
        const response = await fetch(`${APIURL}/players/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });

        const result = await response.json();
        console.log('API Response:', result);
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};


const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        console.log(result);

        // Fetch all players and render them after removing a player
        const players = (await fetchAllPlayers());
        renderAllPlayers(await fetchAllPlayers/** players **/);
    } catch (err) {
        console.error(`Oops, something went wrong with removing player ${playerId}!`, err);
    }
};


/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        const playerContainer = document.getElementById("all-players-container");
        let playerContainerHTML = "";
        playerList.forEach((player) => {
            playerContainerHTML += `<div class="container">
            <div class="player-card">
            <h2>${player.name}</h2>
            <img src="${player.imageUrl}" alt="${player.name}" class="player-image">
            <div class="player-details"></div>
            <button class="details-button" data-player-id=${player.id}>See Details</button>
            <button class="remove-button" data-player-id=${player.id}>Remove Player</button>
            </div>
            </div>`;
        });
        playerContainer.innerHTML = playerContainerHTML;

        const detailsButtons = document.querySelectorAll(".details-button");
        //const removeButtons = document.querySelectorAll(".remove-button");
        const removeButtons = document.querySelectorAll(".player-card .remove-button");
        const playerDetails = document.querySelectorAll(".player-details");

        detailsButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                if (playerDetails[index].innerHTML === "") {
                    playerDetails[index].innerHTML = `
                        <p>Breed: ${playerList[index].breed}</p>
                        <p>Status: ${playerList[index].status}</p>
                    `;
                } else {
                    playerDetails[index].innerHTML = "";
                }
            });
        });

        
        removeButtons.forEach((button) => {
            button.addEventListener('click', async () => {
                const playerId = button.dataset.playerId;
                await removePlayer(playerId);
            });
        });

    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};


const renderNewPlayerForm = () => {
    try {
        console.log('Rendering new player form');
        const newPlayerFormContainer = document.getElementById('new-player-container');
        const newPlayerForm = document.getElementById('add-player-form');

        let newPlayerContainerHTML = "";
        newPlayerContainerHTML += `
            <div id="new-player-form">
                <form id="add-player-form">
                    <label for="puppyName">Puppy Name:</label>
                    <input type="text" id="puppyName" name="puppyName" required>

                    <label for="puppyBreed">Puppy Breed:</label>
                    <input type="text" id="puppyBreed" name="puppyBreed" required>

                    <button type="submit">Add Player</button>
                </form>
            </div>`;

        newPlayerFormContainer.innerHTML = newPlayerContainerHTML;

        newPlayerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log('Form Submitted');
            const puppyName = document.getElementById('puppyName').value;
            const puppyBreed = document.getElementById('puppyBreed').value;

            const newPlayer = {
                name: puppyName,
                breed: puppyBreed,
            };

            await addNewPlayer(newPlayer);

            const players = await fetchAllPlayers();
            renderAllPlayers(players);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};




const init = async () => {
    renderNewPlayerForm();
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    
    
    
}

init();