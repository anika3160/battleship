const rooms: Room[] = []

export interface Room {
  roomId: number | string
  roomUsers: {
    name: string
    index: number | string 
}[]
}

export function createRoom() {
  const index = rooms.length + 1
  const room: Room = {
    roomId: index,
    roomUsers: [],
  }
  rooms.push(room)
  return room
}

export function getRoomIdInDBbyIndex(index: number | string) {
  return rooms.findIndex((room) => room.roomId === index)
}

export function addUserToRoom(roomId: number | string, user: { name: string, id: number | string }) {
  const roomIndex = getRoomIdInDBbyIndex(roomId)
  if (roomIndex === -1) {
    return
  }
  const currentRoomUsersList = rooms[roomIndex].roomUsers
  if (currentRoomUsersList.length === 2) {
    return rooms[roomIndex].roomUsers.push({
      name: user.name, index: user.id,
    })
  }
  return Error('Room is full')
}

export const getRoomsList = (isOnlyOneUserInRoom: boolean = false) => {
  if (isOnlyOneUserInRoom) {
    return rooms.filter((room) => room.roomUsers?.length === 1)
  }
  return rooms
}

export function getUsersInRoomByRoomId (roomId: number | string) {
  const roomIndex = getRoomIdInDBbyIndex(roomId)
  if (roomIndex === -1) {
    return
  }
  return rooms[roomIndex].roomUsers
}