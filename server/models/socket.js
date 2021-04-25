const sharedSessions = require('express-socket.io-session')
const createMessage = require('./../controller/createMessage')
const getRandomCatFact = require('./../controller/returnCatFact')

const initSocketIO = (server, newSession) => {
  const io = require('socket.io')(server)

  io.on('connection', (socket) => {
    let userObj = {}
    // Use a session to work with the userName as params
    io.use(sharedSessions(newSession))

    // Join video-room,
    socket.on('join-room', (obj) => {
      userObj.roomID = obj.room_ID
      userObj.peerID = obj.peer_ID
      console.log(obj)
      console.log('user connected')
      socket.join(obj.room_ID)
      io.in(obj.room_ID).emit('user-connected', obj.peer_ID)
      // socket.broadcast.to(obj.room_ID).emit('user-connected', obj.peer_ID)
    })

    // Sends message to client
    socket.on('message', async (obj) => {
      // Send message to specific room ID, so room A doesn't receive messages from room B
      io.to(obj.room_ID).emit('createMessage', createMessage(obj))

      // If a message contains the word 'CatFact', the room will receive a randomized cat fact
      if (obj.message.includes('catfact')) {
        const catFact = await getRandomCatFact()
        io.to(obj.room_ID).emit('createMessage', createMessage(catFact))
      }
    })

    socket.on('disconnecting', () => {
      console.log(userObj.peerID)
      console.log('disconnected joejoe')
      socket.broadcast.emit('userDisconnecting', userObj.peerID)
    })
  })
}

module.exports = initSocketIO