import { User } from './users.js'

const rooms: Room[] = []

export interface Room {
  roomId: number | string,
  roomUsers?:
    [
      {
        name: string,
        index: number | string,
      }
    ],
}

export function createRoom() {
  const index = rooms.length + 1
  const room: Room = {
    roomId: index,
  }
  rooms.push(room)
  return room
}

export function getRoomByIndex(index: number | string) {
  return rooms.find((room) => room.roomId === index)
}

export function addUserToRoom(roomId: number | string, user: { name: string, id: number | string }) {
  const room = getRoomByIndex(roomId)
  if (!room) {
    return
  }
  room.roomUsers?.push({ name: user.name, index: user.id })
}