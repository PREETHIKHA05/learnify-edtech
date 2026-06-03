import fs from 'fs'
import path from 'path'

const root = path.join(process.cwd(), 'src')

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name)
    const d = path.join(dest, ent.name)
    if (ent.isDirectory()) copyRecursive(s, d)
    else fs.copyFileSync(s, d)
  }
}

function rm(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
}

const copyMoves = [
  ['components/ui', 'shared/ui'],
  ['components/common', 'shared/ui/common'],
  ['components/layout', 'widgets/layout'],
  ['components/charts', 'widgets/charts'],
  ['components/features/teacher', 'features/teacher'],
  ['lib', 'shared/lib'],
  ['hooks', 'shared/lib/hooks'],
  ['constants', 'shared/config'],
  ['mocks', 'shared/mocks'],
  ['types', 'shared/types'],
]

for (const [from, to] of copyMoves) {
  copyRecursive(path.join(root, from), path.join(root, to))
}

// Single file move
const authSrc = path.join(root, 'contexts/auth-context.tsx')
const authDest = path.join(root, 'features/auth/auth-context.tsx')
if (fs.existsSync(authSrc)) {
  fs.mkdirSync(path.dirname(authDest), { recursive: true })
  fs.copyFileSync(authSrc, authDest)
}

rm(path.join(root, 'components'))
rm(path.join(root, 'contexts'))
rm(path.join(root, 'lib'))
rm(path.join(root, 'hooks'))
rm(path.join(root, 'constants'))
rm(path.join(root, 'mocks'))
rm(path.join(root, 'types'))

for (const f of ['public/icon.svg', 'public/placeholder.svg', 'public/placeholder-logo.svg']) {
  try { fs.unlinkSync(path.join(process.cwd(), f)) } catch {}
}
try { fs.unlinkSync(path.join(root, 'shared/ui/common/theme-provider.tsx')) } catch {}

const replacements = [
  [/@\/components\/ui/g, '@/shared/ui'],
  [/@\/components\/layout/g, '@/widgets/layout'],
  [/@\/components\/charts/g, '@/widgets/charts'],
  [/@\/components\/common/g, '@/shared/ui/common'],
  [/@\/components\/features\/teacher/g, '@/features/teacher'],
  [/@\/contexts\/auth-context/g, '@/features/auth/auth-context'],
  [/@\/lib\//g, '@/shared/lib/'],
  [/@\/hooks\//g, '@/shared/lib/hooks/'],
  [/@\/constants\//g, '@/shared/config/'],
  [/@\/constants'/g, "@/shared/config'"],
  [/@\/mocks\//g, '@/shared/mocks/'],
  [/@\/types\//g, '@/shared/types/'],
  [/@\/types'/g, "@/shared/types'"],
]

function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p)
    else if (/\.(tsx|ts|json|css|mjs)$/.test(ent.name)) {
      let c = fs.readFileSync(p, 'utf8')
      const o = c
      for (const [re, rep] of replacements) c = c.replace(re, rep)
      if (c !== o) fs.writeFileSync(p, c)
    }
  }
}

walk(root)
walk(process.cwd())

const renames = [
  ['shared/ui/common/GapPill.tsx', 'shared/ui/common/gap-pill.tsx'],
  ['shared/ui/common/TopicCard.tsx', 'shared/ui/common/topic-card.tsx'],
  ['shared/ui/common/XPBar.tsx', 'shared/ui/common/xp-bar.tsx'],
  ['shared/ui/common/MasteryMeter.tsx', 'shared/ui/common/mastery-meter.tsx'],
]

for (const [from, to] of renames) {
  const src = path.join(root, from)
  const dest = path.join(root, to)
  if (fs.existsSync(src) && !fs.existsSync(dest)) fs.renameSync(src, dest)
}

fs.writeFileSync(
  path.join(root, 'shared/ui/common/index.ts'),
  `export { GapPill, type GapStatus } from './gap-pill'
export { TopicCard } from './topic-card'
export { XPBar } from './xp-bar'
export { MasteryMeter } from './mastery-meter'
`
)

for (const f of ['topic-card.tsx', 'shared/types/index.ts']) {
  const p = path.join(root, f === 'topic-card.tsx' ? 'shared/ui/common/topic-card.tsx' : f)
  if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8')
    c = c.replace(/from '\.\/GapPill'/g, "from './gap-pill'")
    c = c.replace(/@\/shared\/ui\/common\/GapPill/g, '@/shared/ui/common/gap-pill')
    fs.writeFileSync(p, c)
  }
}

console.log('FSD migration complete')
