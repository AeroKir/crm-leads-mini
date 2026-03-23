import fs from 'node:fs'
import { generateLeads } from '../src/utils/generateLeads.ts'

const leads = generateLeads(60)

fs.writeFileSync('./src/data/leads.json', JSON.stringify(leads, null, 2))

console.log('Leads generated ✅')
