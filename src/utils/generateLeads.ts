import type { Lead, LeadSource, LeadStatus } from '@/types/lead'

const statuses: LeadStatus[] = ['New', 'InProgress', 'Qualified', 'Won', 'Lost']
const sources: LeadSource[] = ['Facebook', 'Google', 'Referral', 'Organic', 'Other']

const owners = ['Alice', 'Bob', 'Charlie', 'Diana']

const firstNames = ['George', 'John', 'Anna', 'Maria', 'Donald', 'Kate']
const lastNames = ['Bush', 'Snow', 'Smith', 'Brown', 'Shevchenko']

const tagsPool = ['VIP', 'Hot', 'Cold', 'Returning', 'Priority']

function randomItem<T> (arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate (daysBack = 60) {
  const now = new Date()
  const past = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000)
  return past.toISOString()
}

export function generateLeads (count = 60): Lead[] {
  return Array.from({ length: count }).map((_, i) => {
    const createdAt = randomDate()
    const lastActivityAt = new Date(
      new Date(createdAt).getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000,
    ).toISOString()

    return {
      id: crypto.randomUUID(),
      fullName: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      phone: `+380${Math.floor(100_000_000 + Math.random() * 900_000_000)}`,
      email: Math.random() > 0.3 ? `user${i}@mail.com` : undefined,
      source: randomItem(sources),
      status: randomItem(statuses),
      owner: randomItem(owners),
      createdAt,
      lastActivityAt,
      budget: Math.random() > 0.5 ? Math.floor(Math.random() * 5000) : undefined,
      tags: Array.from({ length: Math.floor(Math.random() * 3) }, () =>
        randomItem(tagsPool),
      ),
    }
  })
}
