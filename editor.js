const editor = document.querySelector("#editor");
const fileInput = document.querySelector("#fileInput");
const notesContainer = document.querySelector("#notesContainer");

const settingsBtn = document.querySelector('#settings-btn');
const settingsModal = document.querySelector('#settings-modal');
const closeBtn = document.querySelector('.close-btn');
const fontSize = document.querySelector('#font-size');
const fontFamily = document.querySelector('#font-family');

settingsBtn.addEventListener('click', (event) => {
  event.preventDefault();
  settingsModal.style.display = 'block';
});

closeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  settingsModal.style.display = 'none';
});

fontSize.addEventListener('change', (event) => {
  editor.style.fontSize = fontSize.value + 'px';
});

fontFamily.addEventListener('change', (event) => {
  editor.style.fontFamily = fontFamily.value;
})

function createHeader() {
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    const header = document.createElement('h1');
    header.appendChild(selection.getRangeAt(0).extractContents());
    selection.getRangeAt(0).insertNode(header);
  }
}

function createParagraph() {
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    const header = document.createElement('p');
    header.appendChild(selection.getRangeAt(0).extractContents());
    selection.getRangeAt(0).insertNode(header);
  }
}

function uploadImage() {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = document.createElement("img");
    img.src = e.target.result;
    editor.appendChild(img);
  };
  reader.readAsDataURL(file);
}

function saveNote() {
  const noteHTML = editor.innerHTML;
  const note = document.createElement("div");
  note.classList.add("note");
  note.innerHTML = noteHTML;
  note.addEventListener("click", function () {
    editor.innerHTML = note.innerHTML;
  });
  notesContainer.appendChild(note);
  localStorage.setItem("notes", notesContainer.innerHTML);
}


editor.addEventListener("paste", (event) => {
  const items = (event.clipboardData || event.originalEvent.clipboardData).items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === "file") {
      const pasteFile = item.getAsFile();
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        editor.appendChild(img);
      };
      reader.readAsDataURL(pasteFile);
    }
  }
});

if (localStorage.getItem("notes")) {
  notesContainer.innerHTML = localStorage.getItem("notes");
  const savedNotes = document.querySelectorAll(".note");
  savedNotes.forEach((note) => {
    note.addEventListener("click", function () {
      editor.innerHTML = note.innerHTML;
    });
  });
}

// Save note on Ctrl + S
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    const notesArray = JSON.parse(localStorage.getItem('notes')) || [];
    const currentNote = document.querySelector('.current-note');
    const noteIndex = notesArray.indexOf(currentNote.querySelector('p').innerHTML);
    notesArray[noteIndex] = currentNote.querySelector('textarea').value;
    localStorage.setItem('notes', JSON.stringify(notesArray));
  }
});

