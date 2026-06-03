import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import apiRouter from './routes/api.js'
import { connectDB, isConnected, listDbCollections } from './db/connect.js'
import { seedDatabase } from './data/seedRunner.js'

const app = express()
const PORT = process.env.PORT ?? 8000

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
    credentials: true,
  })
)
app.use(express.json())
app.use('/api', apiRouter)
app.use((err, _req, res, _next) => {
  console.error('[API Error]', err)
  res.status(500).json({ error: err.message ?? 'Internal server error' })
})

async function start() {
  await connectDB()
  const seeded = await seedDatabase()
  const collections = await listDbCollections()

  console.log('[Learnify Backend] Storage: MongoDB Atlas (persistent)')
  console.log(`[Learnify Backend] Collections (${collections.length}): ${collections.join(', ') || 'none yet'}`)
  if (seeded) console.log('[Learnify Backend] Initial seed completed')

  app.listen(PORT, () => {
    console.log(`[Learnify Backend] API running at http://localhost:${PORT}`)
    console.log(`[Learnify Backend] Health: http://localhost:${PORT}/api/health`)
    console.log(`[Learnify Backend] MongoDB ready: ${isConnected()}`)
  })
}

start().catch((err) => {
  console.error('[Learnify Backend] Startup failed:', err.message)
  console.error('[Learnify Backend] Fix MONGODB_URI in backend/.env and ensure Atlas IP whitelist allows your IP.')
  process.exit(1)
})
