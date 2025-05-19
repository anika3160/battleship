import { games } from '../storage/games.js'

export function handleAttack({
  gameId,
  x,
  y,
  indexPlayer,
}: {
  gameId: string | number
  x: number
  y: number
  indexPlayer: string | number
}) {
  const game = games.find((g) => String(g.idGame) === String(gameId))
  if (!game) throw new Error('Game not found')

  const attacker = game.players.find((p) => String(p.idPlayer) === String(indexPlayer))
  const defender = game.players.find((p) => String(p.idPlayer) !== String(indexPlayer))
  if (!attacker || !defender) throw new Error('Players not found')

  let status: 'miss' | 'shot' | 'killed' = 'miss'
  let killedShipCells: { x: number; y: number }[] | undefined

  for (const ship of defender.ships) {
    if (!ship.hits) ship.hits = []
    const cells = getShipCells(ship)
    const isHit = cells.some((cell) => cell.x === x && cell.y === y)
    const alreadyHit = ship.hits?.some((hit) => hit.x === x && hit.y === y)
    if (isHit && !alreadyHit) {
      ship.hits.push({ x, y })
      const killed = cells.every((cell) =>
        ship.hits?.some((hit) => hit.x === cell.x && hit.y === cell.y)
      )
      if (killed) {
        status = 'killed'
        killedShipCells = cells
      } else {
        status = 'shot'
      }
      break
    }
  }

  // switch turn: miss or killed => defender, hit => attacker stays
  if (status === 'miss' || status === 'killed') {
    game.currentPlayer = defender.idPlayer
  } else {
    game.currentPlayer = attacker.idPlayer
  }

  return {
    type: 'attack',
    data: {
      position: { x, y },
      currentPlayer: game.currentPlayer,
      status,
    },
    id: 0,
  }
}

export function getShipCells(ship: any): { x: number; y: number }[] {
  const cells = []
  const { x, y } = ship.position
  for (let i = 0; i < ship.length; i++) {
    if (ship.direction) {
      cells.push({ x: x + i, y })
    } else {
      cells.push({ x, y: y + i })
    }
  }
  return cells
}

