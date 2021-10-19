const express = require('express')
const app = express()
const port = 8080

app.use(express.static('game'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})