const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()
const dbPath = path.join(__dirname, 'cricketTeam.db')
app.use(express.json())
let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()
app.get('/players/', async (request, response) => {
  const getCricketQuery = `select * from cricket_team order by player_id;`
  const player = await db.all(getCricketQuery)
  response.send(player)
})
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addCricketQuery = `insert into cricket_team (player_name,
        jersey_number,
        role) values 
                     ('${playerName}',
                       ${jerseyNumber},
                      '${role}');`
  const dbResponse = await db.run(addCricketQuery)
  const playerId = dbResponse.lastID
  response.send('Player Added to Team')
})
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getCricketQuery = `select * from cricket_team where player_id=${playerId};`
  const player = await db.get(getCricketQuery)
  response.send(player)
})
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updateCricketQuery = `update cricket_team set player_name='${playerName}', jersey_number=${jerseyNumber}, role='${role}' where player_id=${playerId};`
  await db.run(updateCricketQuery)
  response.send('Player Details Updated')
})
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteCricketQuery = `delete from cricket_team where player_id=${playerId};`
  await db.run(deleteCricketQuery)
  response.send('Player Removed')
})
module.exports = app
