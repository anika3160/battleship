import { WebSocketServer, WebSocket } from 'ws'
import { handleRegistration, handleCreateRoom, getRoomsListHandler } from './handlers/index.js'
import { manageGameEvents } from '../helpers/constants.js'
import { parseJSONData } from '../helpers/utils.js'
import { User, Room, addUserToRoom, getRoomsList } from '../db/index.js'

export function startWebSocketServer(port: number) {
  const server = new WebSocketServer({ port })

  server.on('connection', (ws: WebSocket, request: any, client: any) => {
    ws.send('Welcome!')
    let currentUser: User | null = null;
    let currentRoom: Room | undefined = undefined;

    ws.on('message', (data: any) => {
      const stringData = data.toString()
      const dataObject = parseJSONData(stringData)
      console.log('Message from client:', dataObject)
      if (!dataObject?.type) {
        console.log('DATA:', dataObject)
        ws.send(JSON.stringify({ error: true, message: 'Invalid message format' }))
        return
      }

      switch (dataObject.type) {
        case manageGameEvents.registration:
          console.log('Registration event received:', dataObject)
          currentUser = handleRegistration(ws, dataObject)
          getRoomsListHandler(ws)
          break
        case manageGameEvents.createRoom:
          console.log('Create room event received:', dataObject)
          currentRoom = handleCreateRoom(ws);
          console.log('Current room:', currentRoom)
          if (currentUser && currentRoom) {
            addUserToRoom(currentRoom.roomId, {
              name: currentUser.name, id: currentUser.id,
            })
          }
          getRoomsListHandler(ws)
          break
        case manageGameEvents.getRoomsList:
          console.log('Get rooms list event received:', dataObject)
          getRoomsListHandler(ws)
          break
        case manageGameEvents.addUserToRoom:
          console.log('Add user to room event received:', dataObject)
          if (currentUser) {
            try {
              addUserToRoom(dataObject.indexRoom, {
                name: currentUser.name, id: currentUser.id,
              })
            } catch (error) {
              console.error('Error adding user to room:', error)
            }
          } 
  //start game
          break
        default:
          console.log('Unknown event type:', dataObject.type)
          ws.send(JSON.stringify({ error: true, message: 'Unknown event type' }))
          break
      }
    })

    ws.on('close', () => {
      console.log('Connection closed.')
    })
  })

  console.log(`WebSocket server started on port ${port}`)
}
