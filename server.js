const express = require("express")
const app = express()
const path = require("path")
const axios = require("axios")
const discord = require("discord.js")
const bodyParser = require("body-parser")
const res = require("express/lib/response")
require("dotenv").config()

app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())

const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILDS]})
client.login(process.env.BOT_TOKEN)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/views'))

app.get("/", (req, res) => {
    res.render("pages/mainpage")
})

app.post("/api/discord", async (req, res) => {
    discordData(res, req.body.id)
})

const discordData = async (res, id) => {
    try {
        const data = await axios.get(`https://discord.com/api/v10/users/${id}`, {
            headers: {
                "Authorization": `Bot ${process.env.BOT_TOKEN}`
            }
        })
        res.status(200).json(data.data)
    } catch(err) {
        res.status(403).json({msg: "User was not found!"})
    }
}

app.post("/api/steam", async (req, res) => {
    steamData(res, req.body.id)
})

const steamData = async (res, id) => {
    try {
        const data = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_KEY}&format=json&steamids=${id}`)
        res.status(200).json(data.data.response.players[0])
    } catch(err) {
        console.log(err)
        res.status(403).json({msg: "User was not found!"})
    }
}

app.listen("8000", () => {
    console.log("FiveM-Osint is running!")
})