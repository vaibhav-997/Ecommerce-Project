
import {app} from './app.js'
import { connectToDB } from './db/connect.js'
import dotenv from 'dotenv'
dotenv.config({
  path:"/.env"
})


const PORT = process.env.PORT 

app.get('/', (req, res) => {
    res.send('hello eccommerce!')
})


connectToDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`server listening on http://localhost:${PORT}`)
    })
})
.catch((err) => console.log(`server connection error: ${err}`))