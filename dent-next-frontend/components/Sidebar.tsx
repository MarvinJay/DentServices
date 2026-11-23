import React, { useState } from 'react'

type Props = {
  view: string
  onChange: (v: string) => void
  counts: Record<string, number>
}

const views = [
  { id: 'all', label: 'All Estimates' },
  { id: 'active', label: 'All Active Estimates' },
  { id: 'in-queue', label: 'In Queue' },
  { id: 'file-build', label: 'File Build' },
  { id: 'estimating', label: 'Estimating' },
  { id: 'qa', label: 'QA' },
  { id: 'completed', label: 'Completed' },
  { id: 'archived', label: 'Archived' },
]

export default function Sidebar({ view, onChange, counts }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div className="views-header">Views</div>
        <button aria-label={collapsed? 'Expand views' : 'Collapse views'} className="collapse-btn" onClick={()=>setCollapsed(s=>!s)}>{collapsed? '›' : '‹'}</button>
      </div>

      <div className="views-list">
        {views.map(v => (
          <div key={v.id} className={`view ${view===v.id? 'active':''}`} onClick={()=>onChange(v.id)}>
            <span className="label">{v.label}</span>
            <span className="count">{counts[v.id] ?? 0}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
