import { WebSocket, WebSocketServer } from 'ws'
import { Room, User } from '../db/models/index.js'
import { manageGameEvents } from '../utils/constants.js'
import { parseJSONData } from '../utils/utils.js'
import { handleAddUserToRoom } from './handlers/addUsersToRoom.js'
import { handleCreateRoom } from './handlers/createRoom.js'
import { handleRegistration } from './handlers/registration.js'
import { sendErrorResponse } from './responses/error.js'
import { sendCreateGameResponse } from './responses/game.js'
import { sendRoomsListResponse } from './responses/index.js'
import { getUserSocket, removeUserSocket } from './wsSessions.js'

export function startWebSocketServer(port: number) {
  const server = new WebSocketServer({ port })

  server.on('connection', (ws: WebSocket, request: any, client: any) => {
    let currentUser: User | null = null
    let currentRoom: Room | undefined = undefined

    ws.on('message', (data: any) => {
      try {
        const stringData = data.toString()
        const dataObject = parseJSONData(stringData)
        console.log('Message from client:', dataObject)
        if (!dataObject?.type) {
          console.log('DATA:', dataObject)
          sendErrorResponse(ws, 'Invalid message format')
          return
        }

        switch (dataObject.type) {
          case manageGameEvents.registration:
            currentUser = handleRegistration(ws, dataObject)
            break
          case manageGameEvents.createRoom:
            if (!currentUser) {
              sendErrorResponse(ws, 'User not registered')
              break
            }
            currentRoom = handleCreateRoom(ws, currentUser)
            break
          case manageGameEvents.getRoomsList:
            console.log('Get rooms list event received:', dataObject)
            sendRoomsListResponse(ws)
            break
          /*
        { <-
            type: "add_user_to_room",
            data:
                {
                    indexRoom: <number | string>,
                },
            id: 0,
        }
        */
          case manageGameEvents.addUserToRoom:
            if (!currentUser) {
              sendErrorResponse(ws, 'User not registered')
              break
            }
            let indexRoom
            try {
              indexRoom =
                typeof dataObject.data === 'string'
                  ? parseJSONData(dataObject.data).indexRoom
                  : dataObject.data.indexRoom
            } catch {
              sendErrorResponse(ws, 'Invalid data for addUserToRoom')
              break
            }
            // if 2 users in room, create game
            currentRoom = handleAddUserToRoom(ws, indexRoom, currentUser)
            if (!currentRoom || !currentUser) {
              sendErrorResponse(ws, 'Room or user not found')
              break
            }
            sendCreateGameResponse(ws, currentRoom.id, currentUser.id)
            for (const player of currentRoom.users) {
              const ws = getUserSocket(player.id)
              if (ws) {
                sendCreateGameResponse(ws, currentRoom.id, player.id)
              }
            }
            break
          default:
            console.log('Unknown event type:', dataObject.type)
            sendErrorResponse(ws, 'Unknown event type')
            break
        }
      } catch (err: any) {
        console.error('WebSocket message error:', err)
        sendErrorResponse(ws, err?.message || 'Internal server error')
      }
    })

    ws.on('close', () => {
      console.log('Connection closed.')
      if (!currentUser) {
        return
      }
      removeUserSocket(currentUser.id)
      currentUser = null
      currentRoom = undefined
    })
  })

  console.log(`WebSocket server started on port ${port}`)
}
