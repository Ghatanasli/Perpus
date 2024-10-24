async function randomData(query, count) {
  const request = await fetch(`https://buku.glitch.me/random?query=${query}&count=${count}`);
  try {
    const response = await request.json();
    return response;
  } catch (except) {
    throw new Error(except);
  }
}

async function searchData(query) {
  const request = await fetch(`https://buku.glitch.me/search?query=${query}`);
  try {
    const response = await request.json();
    return response;
  } catch (_) {
    throw new Error(_);
  }
}

const libraryContainer = document.querySelector(".library-container");
const searchInput = document.querySelector("#search-input"); 
const searchButton = document.querySelector("#search-button"); 
const modal = document.getElementById("book-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalAuthors = document.getElementById("modal-authors");
const modalDescription = document.getElementById("modal-description");
const modalDownload = document.getElementById("modal-download");

const kategori = ["harry potter", "alice wonderland", "politik", "anime", "indonesia", "region", "religion"]

const random = Math.floor(Math.random() * kategori.length)

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await randomData(kategori[random], 9);
    if (Array.isArray(data)) {
      renderBooks(data);
    } else {
      console.error("Data yang diterima bukan array", data);
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data: ", error);
  }
});

const handleSearch = async () => {
  const query = searchInput.value.trim();
  if (!query) {
    return;
  }

  try {
    const data = await searchData(query);
    if (Array.isArray(data)) {
      renderBooks(data);
    } else {
      console.error("Data yang diterima bukan array", data);
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat melakukan pencarian: ", error);
  }
};

function renderBooks(books) {
  libraryContainer.innerHTML = ''; 

  books.forEach(book => {
    const { imageUrl, authors, title, description, infoLink } = book; 
    renderItem(imageUrl, authors, title, description, infoLink);
  });
}

function renderItem(imageUrl, authors, title, description, downloadUrl) {
  const element = document.createElement('div');
  element.classList.add('book-card');
  element.innerHTML = `
    <img src="${imageUrl}" alt="${title}">
    <div class="book-info">
      <h2>${title}</h2>
      <p>${authors.join(', ')}</p>
    </div>
  `;

  element.addEventListener('click', () => showModal(imageUrl, authors, title, description, downloadUrl));
  
  libraryContainer.appendChild(element);
}

function showModal(imageUrl, authors, title, description, downloadUrl) {
  modalImage.src = imageUrl;
  modalTitle.textContent = title;
  modalAuthors.textContent = authors.join(', ');
  modalDescription.textContent = description;
  modalDownload.href = downloadUrl;
  modal.style.display = "block";
}


closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

searchButton.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});