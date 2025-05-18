import { Game, Player } from '../models/index.js'
import { games } from '../storage/games.js'
import { getUsersInRoomByRoomId } from './roomService.js'

const createPlayer = (userId: number | string, idPlayer: number | string, idGame: number | string): Player => {
  return {
    userId,
    idPlayer,
    idGame,
    ships: [],
  }
}

export function createGame(roomId: number | string): Game | undefined {
  const gameId = 100
  const usersInRoom = getUsersInRoomByRoomId(roomId)
  if (!usersInRoom) {
    return undefined
  }
  console.log('\n')
  console.log('--------------------------')
  console.log('Users in room:', usersInRoom)
  const player1 = usersInRoom[0]
  const player2 = usersInRoom[1]
  const game: Game = {
    idGame: gameId,
    roomIndex: roomId,
    players: [/* ... */],
  }
  games.push(game)
  game.players = [createPlayer(player1.id, player1.id, gameId), createPlayer(player2.id, player2.id, gameId)]
  console.log('Game created:', game)
  return game
}
