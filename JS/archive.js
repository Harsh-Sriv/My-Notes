
const container = document.getElementById("archived-notes-container");

const LS_KEY = "notes";
let notes = JSON.parse(localStorage.getItem(LS_KEY)) || [];

// Card design for each archived note
/** HTML template for a single archived note card. */
const archiveCard = ({ id, title, note }) => `
  <div class="single-note" data-id="${id}">
    <h3>${title || "(no title)"}</h3>
    <p>${note || "(no content)"} </p>

    <button class="btn del-btn" data-type="delete" data-id="${id}">
      <img src="Assets/delete.svg" alt="Delete">
    </button>
    <button class="btn pin-btn" data-type="unarchive" data-id="${id}">
      <img src="Assets/unarchive.svg" alt="Unarchive">
    </button>
  </div>
`;

// Render archived notes
function renderArchivedNotes() {
  const archived = notes.filter(n => n.archived);

  container.innerHTML = archived.length
    ? archived.map(archiveCard).join("")
    : "<p style='text-align:center;'>No archived notes.</p>";

  localStorage.setItem(LS_KEY, JSON.stringify(notes));
}

// Handle Delete and Unarchive actions
document.body.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-type]");
  if (!btn) return;

  const { id, type } = btn.dataset;

  switch (type) {
    case "delete":
      notes = notes.filter(n => n.id != id);
      break;

    case "unarchive":
      notes = notes.map(n => n.id == id ? { ...n, archived: false } : n);
      break;
  }

  renderArchivedNotes();
});

// Initial load
renderArchivedNotes();
