const express = require("express")
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('<h1>Hello World!2</h1>')
})



app.get('/dashboard', (req, res) => {
    res.send('home')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})