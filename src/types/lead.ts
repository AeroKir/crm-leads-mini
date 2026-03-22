export type LeadStatus = 'New' | 'InProgress' | 'Qualified' | 'Won' | 'Lost'

export type LeadSource = 'Facebook' | 'Google' | 'Referral' | 'Organic' | 'Other'

export interface Lead {
  id: string
  fullName: string
  phone: string
  email?: string
  source: LeadSource
  status: LeadStatus
  owner: string
  createdAt: string
  lastActivityAt: string
  budget?: number
  tags: string[]
}

export interface LeadNote {
  id: string
  type: 'call' | 'email' | 'comment'
  text: string
  createdAt: string
}
