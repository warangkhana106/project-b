const bcrypt = require('bcryptjs')
const {PrismaClient} = require('@prisma/client')
// const { point, point } = require('../models/db')
const prisma = new PrismaClient()

const password = bcrypt.hashSync('123456')

const userData = [
  { username : 'admin', password, email: 'admin@gmail.com' ,role:'ADMIN'},
  { username : 'o', password, email: 'o@mail.com',role:'ADMIN' },
  { username : 'earth', password, email: 'earth@gmail.com',role:'USER' },
  { username : 'korneiei', password, email: 'k@mail.com',role:'USER' },
]

const typeGame = [
  {gametype_name: "FPS"},
  {gametype_name: "MOBA"},
  {gametype_name: "MMORPG"},
  {gametype_name: "PVP"},
  {gametype_name: "PVE"},
  {gametype_name: "Battle Royal"},
  {gametype_name: "Sport"},
]

const games = [
  {game_name: "Valorant", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/1200px-Valorant_logo_-_pink_color_version.svg.png", gametypeId: 1},
  {game_name: "EAFC24", img:"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/header.jpg?t=1723127153", gametypeId: 7}
]

const point = [
  {point: 20000, price: 500, gameId: 1},
  {point: 100000, price: 60, gameId: 2},

]

const run = async () => {
  await prisma.user.createMany({
    data : userData
  })

  await prisma.typeGames.createMany({
    data:typeGame
  })

await prisma.games.createMany({
  data:games
})

await prisma.point.createMany({
  data: point
})
}

run()
