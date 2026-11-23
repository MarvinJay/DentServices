export type CaseType = 'Estimate' | 'Support' | 'Conversion' | 'Supplement' | 'Audit'

export type CaseStage =
  | 'In Queue'
  | 'File Build'
  | 'Estimating'
  | 'QA'
  | 'Completed'
  | 'Archived'

export type CaseSubStatus =
  | 'Ready for File Build'
  | 'Building File'
  | 'File Build Complete'
  | 'Ready for Translation'
  | 'Translating'
  | 'Translation Complete'
  | 'Ready for Translation QA1'
  | 'Reviewing Translation QA1'
  | 'Translation QA1 Complete'

export type DemoCase = {
  id: string
  title: string
  caseType: CaseType
  stage: CaseStage
  subStatus?: CaseSubStatus
  partnerShopId: string
  amount?: number
  dateCreated: string
  lastUpdated: string
  assignedTo?: string
  tags?: string[]
  notes?: string
  activity?: {
    id: string
    field: string
    oldValue: any
    newValue: any
    who: string
    time: string
  }[]
}

export const mockCases: DemoCase[] = [
  {
    id: 'C-1001',
    title: 'Auto Hail & Dent Repair Estimate',
    caseType: 'Estimate',
    stage: 'File Build',
    subStatus: 'Building File',
    partnerShopId: 'PS-1001',
    amount: 1204.33,
    dateCreated: '2026-08-12T09:22:00Z',
    lastUpdated: '2026-08-13T14:10:00Z',
    assignedTo: 'Jofrey',
    tags: ['Translation','Scrub'],
    notes: 'Client provided photos; awaiting part codes.'
  },
  {
    id: 'C-1002',
    title: 'Hail Task Force - Large Loss',
    caseType: 'Estimate',
    stage: 'Estimating',
    subStatus: 'Translating',
    partnerShopId: 'PS-1002',
    amount: 4069.51,
    dateCreated: '2026-09-01T11:40:00Z',
    lastUpdated: '2026-09-16T08:30:00Z',
    assignedTo: 'Arnold',
    tags: ['Translation'],
    notes: 'High-priority; expedite translation.'
  },
  {
    id: 'C-1003',
    title: 'Captain Dent - Small Claim',
    caseType: 'Estimate',
    stage: 'QA',
    subStatus: 'Reviewing Translation QA1',
    partnerShopId: 'PS-1003',
    amount: 692.8,
    dateCreated: '2026-09-10T10:00:00Z',
    lastUpdated: '2026-09-16T09:00:00Z',
    assignedTo: 'QA Team',
    tags: ['QA1'],
    notes: 'Minor differences flagged in parts list.'
  },
  {
    id: 'C-1004',
    title: 'Storm Shield - Severe Hail Cluster',
    caseType: 'Estimate',
    stage: 'File Build',
    subStatus: 'File Build Complete',
    partnerShopId: 'PS-1004',
    amount: 5206.25,
    dateCreated: '2026-08-05T07:30:00Z',
    lastUpdated: '2026-08-06T12:15:00Z',
    assignedTo: 'File Team',
    tags: ['Translation','Scrub'],
    notes: 'File build complete; ready for estimating.'
  },
  {
    id: 'C-1005',
    title: 'McDowell Specialty - Complex Repair',
    caseType: 'Estimate',
    stage: 'Completed',
    subStatus: 'Translation QA1 Complete',
    partnerShopId: 'PS-1005',
    amount: 3523.0,
    dateCreated: '2026-07-22T13:44:00Z',
    lastUpdated: '2026-09-15T16:00:00Z',
    assignedTo: 'Completed Queue',
    tags: [],
    notes: 'Client approved estimate; invoiced.'
  },
  {
    id: 'C-2001',
    title: 'Support - Billing Question',
    caseType: 'Support',
    stage: 'In Queue',
    partnerShopId: 'PS-1006',
    dateCreated: '2026-09-10T09:00:00Z',
    lastUpdated: '2026-09-10T09:05:00Z',
    assignedTo: 'Support Team',
    tags: ['billing'],
    notes: 'Customer enquiring about invoice #4532'
  },
  {
    id: 'C-3001',
    title: 'Conversion - Legacy Estimate Import',
    caseType: 'Conversion',
    stage: 'File Build',
    subStatus: 'Ready for File Build',
    partnerShopId: 'PS-1007',
    dateCreated: '2026-06-02T08:20:00Z',
    lastUpdated: '2026-09-01T10:00:00Z',
    assignedTo: 'Conversion Team',
    tags: ['migration'],
    notes: 'Batch import from old system pending validation.'
  },
  {
    id: 'C-4001',
    title: 'Supplement - Paint Correction',
    caseType: 'Supplement',
    stage: 'Estimating',
    subStatus: 'Ready for Translation',
    partnerShopId: 'PS-1008',
    amount: 450.0,
    dateCreated: '2026-09-12T12:00:00Z',
    lastUpdated: '2026-09-13T09:10:00Z',
    assignedTo: 'Estimator',
    tags: ['supplement'],
    notes: 'Awaiting photos for finish matching.'
  },
  {
    id: 'C-5001',
    title: 'Audit - Warranty Review',
    caseType: 'Audit',
    stage: 'QA',
    subStatus: 'Ready for Translation QA1',
    partnerShopId: 'PS-1009',
    dateCreated: '2026-05-11T10:00:00Z',
    lastUpdated: '2026-09-14T11:50:00Z',
    assignedTo: 'Audit Team',
    notes: 'Reviewing warranty claims for compliance.'
  },
  {
    id: 'C-6001',
    title: 'Estimate - Low Value Quick Turn',
    caseType: 'Estimate',
    stage: 'In Queue',
    partnerShopId: 'PS-1010',
    amount: 220.0,
    dateCreated: '2026-09-16T08:00:00Z',
    lastUpdated: '2026-09-16T08:05:00Z',
    assignedTo: 'Unassigned',
    tags: ['fast-track'],
    notes: 'Fast turnaround requested by customer.'
  },
  {
    id: 'C-7001',
    title: 'Support - App Crash on Upload',
    caseType: 'Support',
    stage: 'Completed',
    partnerShopId: 'PS-1011',
    dateCreated: '2026-08-20T14:30:00Z',
    lastUpdated: '2026-08-21T09:00:00Z',
    assignedTo: 'Support Team',
    notes: 'Bug fixed; release v1.2.3 deployed.'
  }
]

export default mockCases

export type PartnerShop = {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  primaryContact?: string
  notes?: string
  attributionSource?: string
  ein?: string
  partnerUnique?: string
}

export const mockPartnerShops: PartnerShop[] = [
  {
    id: 'PS-1001',
    name: 'Auto Hail & Dent Repair',
    address: '12 Repair Rd, Springfield',
    phone: '+61 2 9000 1001',
    email: 'info@autohaildent.example',
    primaryContact: 'Mark Reynolds',
    notes: 'Preferred partner for hail repairs.',
    attributionSource: 'Referral',
    ein: '00-1111111',
    partnerUnique: 'PU-1001'
  },
  {
    id: 'PS-1002',
    name: 'Stewart Ave Collision & Repair',
    address: '58 Stewart Ave, Melbourne',
    phone: '+61 3 9000 2002',
    email: 'service@stewartave.example',
    primaryContact: 'Olivia Stewart',
    notes: 'Handles large-loss collision claims.',
    attributionSource: 'Direct',
    ein: '00-2222222',
    partnerUnique: 'PU-1002'
  },
  {
    id: 'PS-1003',
    name: 'Ras Auto Body',
    address: '7 Industrial Park, Perth',
    phone: '+61 8 9000 3003',
    email: 'hello@rasautobody.example',
    primaryContact: 'Ras Gomez',
    notes: 'Small-claim specialist.',
    attributionSource: 'Marketing',
    ein: '00-3333333',
    partnerUnique: 'PU-1003'
  },
  {
    id: 'PS-1004',
    name: 'Storm Shield Auto Hail Repair',
    address: '201 Coastal Hwy, Brisbane',
    phone: '+61 7 9000 4004',
    email: 'contact@stormshield.example',
    primaryContact: 'Tara Nguyen',
    notes: 'High-volume hail repair partner.',
    attributionSource: 'Referral',
    ein: '00-4444444',
    partnerUnique: 'PU-1004'
  },
  {
    id: 'PS-1005',
    name: "McDowell's Specialty Repairs",
    address: '9 Heritage Ln, Adelaide',
    phone: '+61 8 9000 5005',
    email: 'support@mcdowells.example',
    primaryContact: 'Ethan McDowell',
    notes: 'Handles complex restoration work.',
    attributionSource: 'Direct',
    ein: '00-5555555',
    partnerUnique: 'PU-1005'
  },
  {
    id: 'PS-1006',
    name: 'Customer A',
    address: 'Client Address Unknown',
    phone: '+61 400 000 006',
    email: 'customerA@example',
    primaryContact: 'Client Admin',
    notes: 'Support-only customer record.',
    attributionSource: 'Legacy Import',
    ein: '00-6666666',
    partnerUnique: 'PU-1006'
  },
  {
    id: 'PS-1007',
    name: 'Legacy Auto',
    address: '44 Archive St, Hobart',
    phone: '+61 3 9000 7007',
    email: 'legacy@legacyauto.example',
    primaryContact: 'Legacy Admin',
    notes: 'Legacy system migration source.',
    attributionSource: 'Legacy Import',
    ein: '00-7777777',
    partnerUnique: 'PU-1007'
  },
  {
    id: 'PS-1008',
    name: 'Precision Paints',
    address: '3 Color Way, Geelong',
    phone: '+61 3 9000 8008',
    email: 'sales@precisionpaints.example',
    primaryContact: 'Maya Patel',
    notes: 'Paint and finish specialist.',
    attributionSource: 'Marketing',
    ein: '00-8888888',
    partnerUnique: 'PU-1008'
  },
  {
    id: 'PS-1009',
    name: 'AuditCo',
    address: 'Level 2, 10 Audit Plaza, Sydney',
    phone: '+61 2 9000 9009',
    email: 'audit@auditco.example',
    primaryContact: 'Helen Brooks',
    notes: 'External audit partner.',
    attributionSource: 'Direct',
    ein: '00-9999999',
    partnerUnique: 'PU-1009'
  },
  {
    id: 'PS-1010',
    name: 'QuickFix',
    address: '1 Fast Ln, Darwin',
    phone: '+61 8 9000 1010',
    email: 'quickfix@example',
    primaryContact: 'Sam Turner',
    notes: 'Fast-turnaround small repairs.',
    attributionSource: 'Referral',
    ein: '00-1010101',
    partnerUnique: 'PU-1010'
  },
  {
    id: 'PS-1011',
    name: 'ShopTech',
    address: '88 Tech Park, Newcastle',
    phone: '+61 2 9000 1111',
    email: 'support@shoptech.example',
    primaryContact: 'Tech Support',
    notes: 'In-house software partner.',
    attributionSource: 'Direct',
    ein: '00-1110111',
    partnerUnique: 'PU-1011'
  }
]
