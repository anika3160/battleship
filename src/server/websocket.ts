import { WebSocketServer, WebSocket } from 'ws'
import { handleRegistration, handleCreateRoom } from './handlers/index.js'
import { manageGameEvents } from '../helpers/constants.js'
import { parseJSONData } from '../helpers/utils.js'
import { User, Room, addUserToRoom } from '../db/index.js'

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
          break
        case manageGameEvents.createRoom:
          console.log('Create room event received:', dataObject)
          currentRoom = handleCreateRoom(ws);
          if (currentUser && currentRoom) {
            addUserToRoom(currentRoom.roomId, {
              name: currentUser.name, id: currentUser.id,
            })
          }
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
