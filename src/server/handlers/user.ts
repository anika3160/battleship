import { WebSocket } from 'ws'
import { parseJSONData } from '../../helpers/utils.js'
import { getUserByName, createUser } from '../../db/index.js'
import { sendResponse } from '../responses/index.js'
import { manageGameEvents } from '../../helpers/constants.js'


export function handleRegistration(ws: WebSocket, dataObject: any) {
  const registrationData = parseJSONData(dataObject.data)
  const { name, password } = registrationData || {}

  if (!name || !password) {
    sendResponse(
      ws,
      manageGameEvents.registration,
      {
        name,
        index: '',
        error: true,
        errorText: 'Name and password are required'
      },
    )
    return null
 }

  if (getUserByName(name)) {
    sendResponse(
      ws,
      manageGameEvents.registration,
      {
        name,
        index: '',
        error: true,
        errorText: 'User already exists'
      },
    )
    return null
  }

  const user = createUser(name, password)
  sendResponse(
    ws,
    manageGameEvents.registration,
    {
      name,
      index: user.id,
      error: false,
      errorText: ''
    },
  )
  return user
}
