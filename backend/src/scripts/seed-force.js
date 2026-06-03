import 'dotenv/config'
import { connectDB, listDbCollections } from '../db/connect.js'
import { forceReseedDatabase, getAllDocumentCounts } from '../data/seedRunner.js'

await connectDB()
await forceReseedDatabase()
const collections = await listDbCollections()
const counts = await getAllDocumentCounts()

console.log('\n=== Learnify Full Seed Report ===')
console.log('Database: learnify')
console.log('Collections:', collections.length)
for (const [name, count] of Object.entries(counts)) {
  const status = count > 0 ? 'OK' : 'EMPTY'
  console.log(`  ${status}  ${name}: ${count}`)
}
const empty = Object.values(counts).filter((c) => c === 0).length
console.log(empty === 0 ? '\nAll collections populated!' : `\nWARNING: ${empty} collection(s) still empty`)
console.log('=================================\n')

process.exit(empty === 0 ? 0 : 1)
