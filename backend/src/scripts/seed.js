import 'dotenv/config'
import { connectDB, listDbCollections } from '../db/connect.js'
import { ensureAllCollectionsPopulated, getAllDocumentCounts } from '../data/seedRunner.js'

await connectDB()
await ensureAllCollectionsPopulated()
const collections = await listDbCollections()
const counts = await getAllDocumentCounts()

console.log('\n=== Learnify Seed Report ===')
console.log('Database: learnify')
console.log('Collections:', collections.join(', '))
for (const [name, count] of Object.entries(counts)) {
  console.log(`  ${name}: ${count}`)
}
console.log('============================\n')

process.exit(0)
