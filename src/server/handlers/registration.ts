import { WebSocket } from 'ws'
import { parseJSONData } from '../../helpers/utils.js'
import { createServerRegistrationResponse } from '../responses/registrationResponse.js'
import { getUserByName, createUser } from '../../db.ts/index.js'

export function handleRegistration(ws: WebSocket, dataObject: any) {
  const registrationData = parseJSONData(dataObject.data)
  const { name, password } = registrationData || {}

  if (!name || !password) {
    sendRegistrationResponse(ws, name || '', '', true, 'Name and password are required', dataObject.id)
    return
  }

  if (getUserByName(name)) {
    sendRegistrationResponse(ws, name, '', true, 'User already exists', dataObject.id)
    return
  }

  const user = createUser(name, password)
  sendRegistrationResponse(ws, user.name, user.id, false, '', dataObject.id)
}

function sendRegistrationResponse(
  ws: WebSocket,
  name: string,
  index: number | string,
  error: boolean,
  errorText: string,
  id: number | string,
) {
  const response = createServerRegistrationResponse(name, index, error, errorText, id)
  ws.send(JSON.stringify(response))
}
