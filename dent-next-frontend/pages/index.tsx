import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import PartnerSidebar from '../components/PartnerSidebar'
import PartnerShops from '../components/PartnerShops'
import Board from '../components/Board'
import ListView from '../components/ListView'
import CaseDetail from '../components/CaseDetail'
import Header from '../components/Header'
import Welcome from '../components/Welcome'
import { useAuth } from '../components/AuthProvider'
import mockCases, { DemoCase } from '../data/mockCases'

type Estimate = {
  id: number
  title: string
  company: string
  status: string
  amount: number
  date: string
  tags: string[]
}

const sample: DemoCase[] = mockCases

export default function Home() {
  const [view, setView] = useState('all')
  const [topNav, setTopNav] = useState('Estimates')
  // keep items in page state so Sidebar counts stay accurate when Board mutates items
  const [items, setItems] = useState<DemoCase[]>(sample)
  const { state } = useAuth()
  const [selected, setSelected] = useState<DemoCase | null>(null)

  // build counts dynamically from current `items`, scoped to top-nav case type when active
  const stages = ['In Queue', 'File Build', 'Estimating', 'QA', 'Completed', 'Archived']
  const itemsForCounts = topNav === 'Estimates' ? items.filter(i => i.caseType === 'Estimate') : items
  const counts: Record<string, number> = {
    all: itemsForCounts.length,
    active: itemsForCounts.filter(c => c.stage !== 'Completed' && c.stage !== 'Archived').length,
    scrub: itemsForCounts.filter(s => (s.tags || []).includes('Scrub')).length,
    translation: itemsForCounts.filter(s => s.subStatus?.toLowerCase().includes('translation') || s.stage === 'Estimating').length,
  }
  stages.forEach(s => { counts[s.toLowerCase().replace(/\s+/g,'-')] = itemsForCounts.filter(c => c.stage === s).length })
  // partner-specific derived lists when a partner is signed in
  let partnerItems: DemoCase[] = []
  const partnerCounts: Record<string, number> = { all: 0, 'preferred-pymnt': 0 }
  if (state.authenticated && state.role === 'partner') {
    partnerItems = items.filter(i => i.partnerShopId === state.user.id)
    partnerCounts.all = partnerItems.length
    partnerCounts['preferred-pymnt'] = partnerItems.filter(pi => (pi.tags || []).includes('preferred') || (pi.notes || '').toLowerCase().includes('preferred')).length
  }
  return (
    <div className="app-root">
      <Header topNav={topNav} onTopNavChange={setTopNav} />
      <div className="command-bar">
        <div className="actions" style={{marginLeft: 'auto'}}>
          <button className="btn-new-case">New case</button>
        </div>
      </div>

      <main className="container">
        {!state.authenticated ? (
          <div style={{flex:1}}>
            <Welcome />
          </div>
        ) : state.role === 'partner' ? (
          // partner view: left 'Views' pane and a list of cases filtered for this partner
          <>
            <PartnerSidebar view={view} onChange={setView} counts={partnerCounts} />
            <div style={{flex:1}}>
              {(() => {
                let filtered = partnerItems
                if(view === 'preferred-pymnt'){
                  filtered = partnerItems.filter(pi => (pi.tags || []).includes('preferred') || (pi.notes || '').toLowerCase().includes('preferred'))
                }
                return (
                  <div>
                    <div className="list-container">
                      <ListView items={filtered} title="My Cases" onRowClick={(it:any)=>setSelected(it)} />
                    </div>
                    {selected && <CaseDetail item={selected} onClose={()=>setSelected(null)} onSave={(updated:any)=>{ setItems(prev=> prev.map(p=> p.id === updated.id ? updated : p)); setSelected(updated) }} />}
                  </div>
                )
              })()}
            </div>
          </>
        ) : topNav === 'Partner Shops' ? (
          <>
            <PartnerSidebar view={view} onChange={setView} counts={counts} />
            <div style={{flex:1}}>
              <PartnerShops />
            </div>
          </>
        ) : (
          <>
            <Sidebar view={view} onChange={setView} counts={counts} />
            <Board items={items} setItems={setItems} view={view} caseTypeFilter={topNav} />
          </>
        )}
      </main>
    </div>
  )
}
