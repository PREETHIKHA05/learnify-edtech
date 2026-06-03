import dns from 'dns'
import mongoose from 'mongoose'

// Node on Windows often fails SRV lookups with system DNS — use public resolvers
dns.setServers(['1.1.1.1', '8.8.8.8', '8.8.4.4'])
dns.setDefaultResultOrder('ipv4first')

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is required in backend/.env')
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(uri, {
    dbName: 'learnify',
    serverSelectionTimeoutMS: 20000,
    socketTimeoutMS: 45000,
  })

  console.log('[Learnify Backend] MongoDB connected → database: learnify')
  return mongoose.connection
}

export function isConnected() {
  return mongoose.connection.readyState === 1
}

export async function listDbCollections() {
  if (!isConnected()) return []
  const collections = await mongoose.connection.db.listCollections().toArray()
  return collections.map((c) => c.name).sort()
}
