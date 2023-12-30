const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4004;
const books = require('./db.json')
const BASE_URL = "/api/books"
let ID = 11

app.use(express.json())
app.use(cors())


app.get(BASE_URL, (req,res)=>{
    res.status(200).send(books)
})
app.post(BASE_URL,(req,res)=>{
    const newBook = req.body;
    newBook.id=ID
    ID++
    books.push(newBook)

    res.status(200).send(books)
})
app.delete(`${BASE_URL}/:id`,(req,res)=>{
    let index = books.findIndex(elem => elem.id === +req.params.id)
    books.splice(index, 1)
    res.status(200).send(books)
})

app.put(`${BASE_URL}/:id`,(req,res)=>{
    let { id } = req.params
        let { type } = req.body
        let index = books.findIndex(elem => +elem.id === +id)

        if (books[index].finished === 5 && type === 'plus') {
            res.status(400).send('cannot go above 5')
        } else if (books[index].finished === 0 && type === 'minus') {
            res.status(400).send('cannot go below 0')
        } else if (type === 'plus') {
            books[index].finished++
            res.status(200).send(books)
        } else if (type === 'minus') {
            books[index].finished--
            res.status(200).send(books)
        } else {
            res.sendStatus(400)
        }
})

app.listen(PORT,()=> console.log(`server listening on port ${PORT}`))