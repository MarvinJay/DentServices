import React from 'react'
import Lane from './Lane'
import ListView from './ListView'
import CaseDetail from './CaseDetail'
import { useState } from 'react'

type Item = any

const stages = ['In Queue', 'File Build', 'Estimating', 'QA', 'Completed', 'Archived']

function slug(s: string) {
  return s.toLowerCase().replace(/\s+/g,'-')
}

export default function Board({ items, setItems, view, caseTypeFilter }: { items: Item[]; setItems?: React.Dispatch<React.SetStateAction<Item[]>>; view: string; caseTypeFilter?: string }){
  const [selected, setSelected] = useState<any|null>(null)
  // determine if we should show swimlanes (only for All / Active)
  const showLanes = view === 'all' || view === 'active'

  // filter base on left-pane view selection
  const filtered = items.filter(i=>{
    // apply top-nav caseType filter if present
    if(caseTypeFilter === 'Estimates' && i.caseType !== 'Estimate') return false
    if(view === 'all') return true
    if(view === 'active') return i.stage !== 'Completed' && i.stage !== 'Archived'
    if(view === 'scrub') return (i.tags || []).includes('Scrub')
    if(view === 'translation') return i.subStatus?.toLowerCase().includes('translation') || i.stage === 'Estimating'
    // stage-specific views use slug, map back to stage name
    const stage = stages.find(s => slug(s) === view)
    if(stage) return i.stage === stage
    return true
  })

  function moveItemToStage(id: string, stage: string){
    if(setItems){
      setItems((prev:any[]) => {
        const next = prev.map(it => it.id === id ? {...it, stage, subStatus: ''} : it)
        const moved = next.find(it => it.id === id)
        if(moved) setSelected(moved)
        return next
      })
    } else {
      const moved = items.find(it => it.id === id)
      if(moved) setSelected({...moved, stage, subStatus: ''})
    }

    // persist change to API
    fetch(`/api/cases/${id}`, { method: 'PATCH', headers: { 'content-type':'application/json' }, body: JSON.stringify({ stage, subStatus: '', _editor: 'You' }) })
      .then(r=>r.json())
      .then(()=> {/* persisted */})
      .catch(err=> console.error('Failed to persist stage change', err))
  }

  // detect if the selected view is a stage-specific view
  const stageView = stages.find(s => slug(s) === view)
  const isSpecialList = view === 'scrub' || view === 'translation'

  return (
    <section className="board">
      <div className="board-header">
        <h2>{stageView ? `${stageView} — List` : 'Estimates'}</h2>
      </div>

      {showLanes ? (
        <div className="lanes">
          {stages.map(s=> <Lane key={s} title={s} items={filtered.filter((x:any)=>x.stage===s)} onItemClick={(it:any)=>setSelected(it)} onDropItem={(id:string, stage:string)=>moveItemToStage(id, stage)} />)}
        </div>
      ) : stageView || isSpecialList ? (
        <div className="list-container">
          <ListView items={filtered} title={stageView ?? (isSpecialList ? view.charAt(0).toUpperCase() + view.slice(1) : '')} onRowClick={(it:any)=>setSelected(it)} />
        </div>
      ) : (
        <div className="lanes single">
          <Lane title={'List'} items={filtered} onItemClick={(it:any)=>setSelected(it)} />
        </div>
      )}
      {selected && <CaseDetail item={selected} onClose={()=>setSelected(null)} onSave={(updated:any)=>{
        if(setItems) setItems((prev:any[]) => prev.map(it => it.id === updated.id ? updated : it))
        setSelected(updated)
      }} />}
    </section>
  )
}
