import fs from 'fs'
import path from 'path'

const root = path.join(process.cwd(), 'src')

const reps = [
  [/bg-gradient-to-br from-green-500\/20 to-blue-500\/20/g, 'bg-muted'],
  [/from-green-500\/20 to-blue-500\/20 border-green-500\/50/g, 'bg-muted border-border'],
  [/from-purple-500\/20 to-pink-500\/20 border-purple-500\/50/g, 'bg-card border-border'],
  [/bg-gradient-to-br/g, 'bg-muted'],
  [/bg-green-500\/10/g, 'bg-muted'],
  [/bg-blue-500\/10/g, 'bg-muted'],
  [/bg-purple-500\/10/g, 'bg-muted'],
  [/bg-red-500\/10/g, 'bg-muted'],
  [/bg-yellow-500\/10/g, 'bg-muted'],
  [/bg-amber-500\/10/g, 'bg-muted'],
  [/border-green-500\/50/g, 'border-border'],
  [/border-blue-500\/50/g, 'border-border'],
  [/border-purple-500\/50/g, 'border-border'],
  [/border-red-500\/50/g, 'border-border'],
  [/border-amber-500\/50/g, 'border-border'],
  [/border-l-blue-500/g, 'border-l-primary'],
  [/border-l-green-500/g, 'border-l-primary'],
  [/border-l-yellow-500/g, 'border-l-border'],
  [/border-l-purple-500/g, 'border-l-border'],
  [/border-l-red-500/g, 'border-l-destructive'],
  [/border-l-amber-500/g, 'border-l-border'],
  [/bg-green-500\/20/g, 'bg-muted'],
  [/bg-red-500\/20/g, 'bg-muted'],
  [/bg-amber-500\/20/g, 'bg-muted'],
  [/bg-blue-500\/20/g, 'bg-muted'],
  [/bg-purple-500\/20/g, 'bg-muted'],
  [/bg-green-500 hover:bg-green-600/g, 'bg-primary hover:bg-primary/90'],
  [/bg-green-500 text-white/g, 'bg-primary text-primary-foreground'],
  [/bg-green-500 h-full/g, 'bg-primary h-full'],
  [/bg-green-500'/g, "bg-primary'"],
  [/bg-yellow-500'/g, "bg-[#ddd0a8]'"],
  [/bg-red-500'/g, "bg-destructive'"],
  [/border-green-500 bg-green-500/g, 'border-primary bg-primary'],
  [/border-green-500'/g, "border-primary'"],
  [/border-blue-500/g, 'border-border'],
  [/bg-purple-600 hover:bg-purple-700/g, ''],
  [/text-green-400/g, 'text-foreground'],
  [/text-amber-400/g, 'text-foreground'],
  [/text-red-400/g, 'text-destructive'],
  [/text-amber-500/g, 'text-muted-foreground'],
  [/AI Tutor/g, 'Tutor'],
  [/AI Summaries/g, 'Summaries'],
  [/AI Generated Summary/g, 'Generated Summary'],
  [/Start AI Tutor/g, 'Start Tutor'],
  [/hover:shadow-primary\/20/g, ''],
  [/border-l-2 border-blue-500/g, 'border-l-2 border-border'],
]

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p)
    else if (/\.(tsx|ts)$/.test(ent.name)) {
      let c = fs.readFileSync(p, 'utf8')
      const o = c
      for (const [re, rep] of reps) c = c.replace(re, rep)
      if (c !== o) fs.writeFileSync(p, c)
    }
  }
}

walk(root)
console.log('Color cleanup done')
