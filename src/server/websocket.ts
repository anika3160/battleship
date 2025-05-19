import { WebSocket, WebSocketServer } from 'ws'
import { Room, User } from '../db/models/index.js'
import { gameCommands, manageGameEvents } from '../utils/constants.js'
import { parseJSONData } from '../utils/utils.js'
import { handleRegistration } from './handlers/registration.js'
import { sendErrorResponse } from './responses/error.js'
import { sendRoomsListResponse } from './responses/index.js'
import { removeUserSocket } from './wsSessions.js'
import { handleCreateRoomEvent, handleAddUserToRoomEvent, handleAddShipsEvent } from './events/index.js'
import { handleAttackEvent } from './events/handleAttackEvent.js'

export function startWebSocketServer(port: number) {
  const server = new WebSocketServer({ port })

  server.on('connection', (ws: WebSocket) => {
    let currentUser: User | null = null
    let currentRoom: Room | undefined = undefined

    ws.on('message', (data: any) => {
      try {
        const dataObject = parseJSONData(data.toString())
        console.log('Message from client:', dataObject)
        if (!dataObject?.type) {
          sendErrorResponse(ws, 'Invalid message format')
          return
        }

        switch (dataObject.type) {
          case manageGameEvents.registration:
            currentUser = handleRegistration(ws, dataObject)
            break

          case manageGameEvents.createRoom:
            handleCreateRoomEvent(ws, currentUser)
            break

          case manageGameEvents.getRoomsList:
            sendRoomsListResponse(ws)
            break

          case manageGameEvents.addUserToRoom:
            handleAddUserToRoomEvent(ws, dataObject, currentUser)
            break

          case manageGameEvents.addShips:
            handleAddShipsEvent(ws, dataObject, currentUser)
            break

          case gameCommands.attack:
            handleAttackEvent(ws, dataObject, currentUser)
            break

          default:
            sendErrorResponse(ws, 'Unknown event type')
        }
      } catch (err: any) {
        console.error('WebSocket message error:', err)
        sendErrorResponse(ws, err?.message || 'Internal server error')
      }
    })

    ws.on('close', () => {
      console.log('Connection closed.')
      if (currentUser) {
        removeUserSocket(currentUser.id)
      }
      currentUser = null
      currentRoom = undefined
    })
  })

  console.log(`WebSocket server started on port ${port}`)
}
