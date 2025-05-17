import { WebSocket } from 'ws'
import { createRoom } from '../../db/index.js'
import { sendResponse } from '../responses/index.js'
import { manageGameEvents } from '../../helpers/constants.js'

export function handleCreateRoom(ws: WebSocket) {
  const room = createRoom()
  if (!room.roomId) {
    return
  }
    sendResponse(
      ws,
      manageGameEvents.createRoom,
      {
        roomIndex: room.roomId,
        error: false,
        errorText: ''
      },
    )
  return room
}

