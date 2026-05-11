// i tried to do the psuedo code for almost everything to practice and help
//me understand too. im sorry i had to use a LITTLE ai to help me understand
// but I used the previous notes for the most part

// not 100% sure what these do but i changed the names
// on some of them and it changed some on the preview. I am using
// the gala assighnment as a template
/**
 * @typedef Puppy
 * @property {number} id
 * @property {string} name
 * @property {string} breed
 * @property {string} imageUrl
 * @property {string} status
 */

// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
// link to the api
const COHORT = "2803-MADELIENE";
// code for MY api
const RESOURCE = "players";
// needed help linking the api (puts all of these together)
const API = `${BASE}/${COHORT}/${RESOURCE}`;

// === State ===

// array to hold all puppies from api
let puppies = [];

// starts as nothing until user clicks a puppy
let selectedPuppy = null;

// === API Functions ===

// gets all puppies from api
async function getPuppies() {
  try {
    // asks api for puppy data
    const response = await fetch(API);
    const result = await response.json();
    puppies = result.data.players;
    // render page with new data
    render();
  } catch (error) {
    // if something breaks shows the error
    console.error(error);
  }
}

// gets specific puppy
async function getPuppy(id) {
  try {
    // gets puppy with its id
    const response = await fetch(`${API}/${id}`);
    const result = await response.json();
    // shows what puppy the user clicked on (and render)
    selectedPuppy = result.data.player;
    render();
  } catch (error) {
    // catch errors
    console.error(error);
  }
}

//lets user or owner add a new puppy
async function addPuppy(puppy) {
  try {
    // sends new puppy to api information
    await fetch(API, {
      method: "POST",
      // dont really understand this part but I think it tells the
      //api that it is interactive or to allow it to add a puppy to
      //enteract with
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(puppy),
    });
    // reloads puppy list after adding new puppy
    await getPuppies();
    //catches errors (i dont understand why we dont render again)
  } catch (error) {
    console.error(error);
  }
}

// to delete a puppy :(
async function removePuppy(id) {
  try {
    // the method lets users delete off the website
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    // wont show anymore because the puppy was deleted
    selectedPuppy = null;
    // shows the updated list of puppies
    await getPuppies();
  } catch (error) {
    // error stuff (still dk why we dont render again lol)
    console.error(error);
  }
}

// single puppy list item
function PuppyListItem(puppy) {
  // making it a list
  const $li = document.createElement("li");
  // putting puppy name inside
  $li.innerHTML = `
    <a href="#selected">${puppy.name}</a>
  `;
  // when puppy is clicked get that puppy's details
  $li.addEventListener("click", () => {
    getPuppy(puppy.id);
  });
  return $li;
}

// whole puppy list
function PuppyList() {
  // making ul list
  const $ul = document.createElement("ul");
  // looping through puppies array
  // turning each puppy into li list
  const $puppies = puppies.map(PuppyListItem);
  // putting all li lists into ul list
  $ul.replaceChildren(...$puppies);
  return $ul;
}

// selected puppy details section
function PuppyDetails() {
  // if no puppy selected
  if (!selectedPuppy) {
    // show message instead
    const $p = document.createElement("p");
    //the message
    $p.textContent = "Please select a puppy to learn more.";
    return $p;
  }

  // making section for puppy details
  const $section = document.createElement("section");
  // putting puppy info on page
  $section.innerHTML = `
  <h3>${selectedPuppy.name}</h3>
  <img 
  src="${selectedPuppy.imageUrl}" 
  alt="${selectedPuppy.name}"
  width="300"
  />


    <p><strong>Breed:</strong> ${selectedPuppy.breed}</p>
    <p><strong>Status:</strong> ${selectedPuppy.status}</p>
    <p><strong>ID:</strong> ${selectedPuppy.id}</p>
    <button>Remove Puppy</button>
    `;

  // when button clicked delete puppy
  $section.querySelector("button").addEventListener("click", () => {
    removePuppy(selectedPuppy.id);
  });

  return $section;
}

// form to add puppy
function NewPuppyForm() {
  // making form
  const $form = document.createElement("form");

  // form inputs
  $form.innerHTML = `
    <label>
      Name
      <input name="name" required />
    </label>

    <label>
      Breed
      <input name="breed" required />
    </label>

    <label>
      Image URL
      <input name="imageUrl" required />
    </label>

    <button>Add Puppy</button>
  `;

  // when form submitted
  $form.addEventListener("submit", async (event) => {
    // stops page refresh
    event.preventDefault();

    // getting form values
    const formData = new FormData($form);

    // grabbing each input value
    const name = formData.get("name");
    const breed = formData.get("breed");
    const imageUrl = formData.get("imageUrl");

    // adding puppy to api
    await addPuppy({
      name,
      breed,
      imageUrl,
    });

    // clears form after submit
    $form.reset();
  });

  return $form;
}

function render() {
  // grabbing app div
  const $app = document.querySelector("#app");

  // putting html on page (when i tried to color some things it wasnt allowing me or i didnt know how to do it .)
  $app.innerHTML = `
    <h1>Puppy Bowl</h1>

    <main>

      <section>
        <h2>Puppies</h2>

        <PuppyList></PuppyList>

        <h3 className= "pupName" >Add a Puppy</h3> 

        <NewPuppyForm></NewPuppyForm>
      </section>

      <section id="selected">
        <h2>Puppy Details</h2>

        <PuppyDetails></PuppyDetails>
      </section>

    </main>
  `;

  // replacing custom tags with components
  $app.querySelector("PuppyList").replaceWith(PuppyList());

  $app.querySelector("NewPuppyForm").replaceWith(NewPuppyForm());

  $app.querySelector("PuppyDetails").replaceWith(PuppyDetails());
}

async function init() {
  // get puppies when page first loads
  await getPuppies();
}

// starting app
init();
