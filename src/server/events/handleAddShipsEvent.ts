
import { WebSocket } from 'ws'
import { sendErrorResponse } from '../responses/index.js'
import { getUserSocket } from '../wsSessions.js'
import { sendResponse } from '../responses/index.js'
import { User } from '../../db/models/index.js'
import { addShipsToPlayer } from '../../db/services/gameService.js'
import { getGameById } from '../../db/services/gameService.js'
import { Player } from '../../db/models/index.js'
import { manageGameEvents } from '../../utils/constants.js'

export function handleAddShipsEvent(ws: WebSocket, dataObject: any, currentUser: User | null) {
  if (!currentUser) {
    sendErrorResponse(ws, 'User not registered')
    return
  }
  try {
    const jsonData = typeof dataObject.data === 'string' ? JSON.parse(dataObject.data) : dataObject.data
    const { gameId, ships, indexPlayer } = jsonData

    addShipsToPlayer(gameId, indexPlayer, ships)
    const game = getGameById(gameId)
    if (game && game.players.every((p: Player) => p.ships && p.ships.length > 0)) {
      for (const player of game.players) {
        const wsPlayer = getUserSocket(player.userId)
        if (wsPlayer) {
          sendResponse(wsPlayer, manageGameEvents.startGame, {
            ships: player.ships,
            currentPlayerIndex: player.idPlayer,
          })
        }
      }
    }
  } catch (err) {
    console.error('Error in addShipsToPlayer:', err)
    sendErrorResponse(ws, 'Error saving ships')
  }
}
