import * as express from 'express'
import { Server, IPlayer } from '../server/Server'
import * as _ from 'lodash'

let port = 4041
// let portWs = 4002
let title = 'LD41'
process.title = `${port}:${title}`

const app = express()

app.get('/', (req, res) => {
  res.send('Sockets Server V1.0.0 LD41')
})

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.get('/ping', (req, res) => {
  res.send('pong')
})

import * as socketIo from 'socket.io'

import * as http from 'http'
import { IMessage } from 'ludumDare41/server/IMessage'

var httpServ = new http.Server(app)
var io = socketIo(httpServ)

httpServ.listen(port, () => {
  console.log(`Sockets Server listening on port ${port}!`)

  let server = new Server()
  server.init(false)

  server.onSendToAllPlayers = (message: IMessage) => {
    io.emit('event', message)
  }
  server.onSendToPlayer = (player: IPlayer, message: IMessage) => {
    let s: socketIo.Socket = player.socket
    if (s) {
      s.emit('event', message)
    }
  }

  io.on('connection', (socket) => {
    console.log('W>', 'user connected')

    let player = server.addPlayer(false, socket, true)
    socket.emit('event', {
      command: 'welcome',
      id: player.id,
    })

    // Send map
    server.sendMapTo(player)

    socket.on('disconnect', () => {
      console.log('W>', 'user d/c')
      // Kill this player
      _.forEach(server.players, (c) => {
        if (c.socket === socket) {
          //c.isAlive = false
          c.isBot = true
          c.socket = null

          server.sendToAllPlayers({
            command: 'replaceSpawn',
            id: c.id,
            isBot: true,
            isAlive: c.isAlive,
          })
        }

        // TODO: send to client that they are dead
      })
    })
    socket.on('event', (data) => {
      console.log('W>', 'event: ', data)
      _.forEach(server.players, (c) => {
        if (c.socket === socket) {
          console.log('W>', 'processed: ', data)
          server.receive(c, data)
          return false
        }
      })
    })
  })
})
