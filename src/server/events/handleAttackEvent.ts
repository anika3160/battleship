import { WebSocket } from 'ws'
import { User } from '../../db/models/user.js'
import { handleAttack } from '../../db/services/index.js'
import { gameCommands } from '../../utils/constants.js'
import { sendErrorResponse, sendResponse, sendTurnInfo } from '../responses/index.js'

export function handleAttackEvent(ws: WebSocket, dataObject: any, currentUser: User | null) {
  if (!currentUser) {
    sendErrorResponse(ws, 'User not registered')
    return
  }
  try {
    const jsonData = typeof dataObject.data === 'string' ? JSON.parse(dataObject.data) : dataObject.data
    const { gameId, x, y, indexPlayer } = jsonData
    // validate required fields
    if (gameId === undefined || indexPlayer === undefined) {
      sendErrorResponse(ws, 'Invalid data for attack')
      return
    }
    // bounds and type check (10x10 field)
    if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y) || x < 0 || x > 9 || y < 0 || y > 9) {
      sendErrorResponse(ws, 'Attack out of bounds or invalid coordinates')
      return
    }
    const gId: string | number = gameId
    const idx: string | number = indexPlayer
    const result = handleAttack({ gameId: gId, x, y, indexPlayer: idx })
    if (!result) {
      sendErrorResponse(ws, 'Attack processing failed')
      return
    }
    sendResponse(ws, gameCommands.attack, {
      position: { x, y },
      currentPlayer: idx,
      status: result.data.status,
      gameId,
    })
    if (result?.data?.status === 'miss' || result?.data?.status === 'killed') {
      sendTurnInfo(ws, currentUser.id)
    }
  } catch (err: any) {
    sendErrorResponse(ws, err.message || 'Error processing attack')
  }
}
