import { WebSocket } from 'ws'
import { User } from '../../db/models/index.js'
import { sendRegistrationResponse, sendRoomsListResponse } from '../responses/index.js'

export function handleRegistration(ws: WebSocket, dataObject: any): User | null {
  console.log('Registration event received:', dataObject)
  const currentUser = sendRegistrationResponse(ws, dataObject)
  sendRoomsListResponse(ws)
  return currentUser
}
