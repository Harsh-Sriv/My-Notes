

const titleInput        = document.querySelector(".title");
const noteInput         = document.querySelector(".note");
const addBtn            = document.querySelector(".add-button");

const pinnedContainer   = document.querySelector(".pinned-notes");
const notesContainer    = document.querySelector(".notes-container");

const pinHeading        = document.querySelector(".pin-title");
const noteHeading       = document.querySelector(".note-title");

const LS_KEY = "notes";//Key to localStorage for notes

const loadNotes = () => JSON.parse(localStorage.getItem(LS_KEY)) || [];/** Load notes array from localStorage (or empty array). */


const saveNotes = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));/** Save notes array back to localStorage. */

let notes = loadNotes();//Loads notes from localStorage on page load.

//card design for each note
/** HTML template for a single note card. */
const noteCard = ({ id, title, note, pinned }) => `
  <div class="single-note" data-id="${id}">
      <h3>${title || "(no title)"} </h3>
      <p>${note || "(no content)"} </p>

      <button class="btn del-btn"     data-type="delete"  data-id="${id}">
          <img src="Assets/delete.svg"   alt="Delete">
      </button>
      <button class="btn archive-btn" data-type="archive" data-id="${id}">
          <img src="Assets/archive.svg"  alt="Archive">
      </button>
      <button class="btn pin-btn"     data-type="pin"     data-id="${id}">
          <img src="${pinned ? "Assets/unpin.svg" : "Assets/pin.svg"}"
               alt="${pinned ? "Unpin" : "Pin"}">
      </button>
  </div>
`;

//rendering notes based on their pinned and archived status
/** Render all notes, separating pinned and unpinned. */
function render() {
    const pinned   = notes.filter(n =>  n.pinned && !n.archived);
    const unpinned = notes.filter(n => !n.pinned && !n.archived);

    pinnedContainer.innerHTML = pinned.map(noteCard).join("");
    notesContainer .innerHTML = unpinned.map(noteCard).join("");

    /* Show / hide section headings */
    pinHeading .classList.toggle("d-none", pinned  .length === 0);
    noteHeading.classList.toggle("d-none", unpinned.length === 0);

    saveNotes(notes);                  // persist on every render
}

//to add a new note
addBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const titleTxt = titleInput.value.trim();
    const noteTxt  = noteInput .value.trim();

    if (!titleTxt && !noteTxt) {
        alert("Please enter at least a title or a note.");
        return;
    }

    notes.push({
        id: Date.now(),                // unique id
        title: titleTxt,
        note : noteTxt,
        pinned: false,
        archived: false
    });

    titleInput.value = "";
    noteInput .value = "";

    render();
});

//Delegate click actions (delete / pin / archive)
document.body.addEventListener("click", (e) => {
    const btn   = e.target.closest("button[data-type]");
    if (!btn) return;                  // clicked outside any relevant button

    const { type, id } = btn.dataset;

    switch (type) {
        case "delete":
            notes = notes.filter(n => n.id != id);
            break;

        case "pin":
            notes = notes.map(n => n.id == id ? { ...n, pinned: !n.pinned } : n);
            break;

        case "archive":
            notes = notes.map(n => n.id == id ? { ...n, archived: true } : n);
            break;
    }

    render();
});

// Initial load
render();
