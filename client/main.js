const booksContainer = document.querySelector('#books-container')
const form = document.querySelector('form')

const baseURL = `http://localhost:4004/api/books`

const booksCallback = ({ data: books }) => displayBooks(books)
const errCallback = err => console.log(err.response.data)

const getAllBooks = () => axios.get(baseURL).then(booksCallback).catch(errCallback)
const createBook = body => axios.post(baseURL, body).then(booksCallback).catch(errCallback)
const deleteBook = id => axios.delete(`${baseURL}/${id}`).then(booksCallback).catch(errCallback)
const updateBook = (id, type) => axios.put(`${baseURL}/${id}`, {type}).then(booksCallback).catch(errCallback)

function submitHandler(e) {
    e.preventDefault()

    let title = document.querySelector('#title')
    let finished = document.querySelector('input[name="finished"]:checked')
    let imageURL = document.querySelector('#img')

    let bodyObj = {
        title: title.value,
        finished: finished ? finished.value * 20 : null, 
        imageURL: imageURL.value
    }

    createBook(bodyObj)

    title.value = ''
    if (finished) {
        finished.checked = false;
    }
    imageURL.value = ''
}

function createBookCard(book) {
    const bookCard = document.createElement('div')
    bookCard.classList.add('book-card')

    const displayedRating = book.finished !== null ? `${book.finished}% finished` : '0% finished';

    bookCard.innerHTML = `<img alt='book cover' src=${book.imageURL} class="book-cover"/>
    <p class="book-title">${book.title}</p>
    <div class="btns-container">
        <button onclick="updateBook(${book.id}, 'minus')">-</button>
        <p class="book-rating">${displayedRating}</p>
        <button onclick="updateBook(${book.id}, 'plus')">+</button>
    </div>
    <button onclick="deleteBook(${book.id})">delete</button>
    `


    booksContainer.appendChild(bookCard)
}

function displayBooks(arr) {
    booksContainer.innerHTML = ``
    for (let i = 0; i < arr.length; i++) {
        createBookCard(arr[i])
    }
}

form.addEventListener('submit', submitHandler)

getAllBooks()