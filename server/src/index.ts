import express from "express"
import bodyParser from "body-parser"
import { listings } from "./listing"

const app = express()
const port = 9000
app.use(bodyParser.json())
app.get("/", (req, res) => {
  res.send("Hello World!")
})
app.get("/listing", (_req, res) => {
  res.send(listings)
})
app.post("/delete", (req, res) => {
  let id: string = req.body.id
  let index: number = listings.findIndex(p => p.id === id)
  listings.splice(index, 1)
  res.send(listings)
})

app.listen(port)
console.log("Server is running at https://localhost:9000")
