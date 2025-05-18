import { Player } from './player.js'

export interface Game {
  idGame: number | string
  roomIndex: number | string
  players: Player[]
}
