import dotenv from 'dotenv'
import { startWebSocketServer } from './server/websocket.js'

dotenv.config()

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

startWebSocketServer(PORT)
