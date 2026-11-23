import React, { useState } from 'react'

type Props = {
  view: string
  onChange: (v: string) => void
  counts: Record<string, number>
}

const stages = ['In Queue', 'File Build', 'Estimating', 'QA', 'Completed', 'Archived']

function slug(s: string){
  return s.toLowerCase().replace(/\s+/g,'-')
}

export default function PartnerSidebar({ view, onChange, counts }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  const views = [
    { id: 'all', label: 'All Cases' },
    { id: 'active', label: 'Active' },
    ...stages.map(s => ({ id: slug(s), label: s })),
    { id: 'preferred-pymnt', label: 'Preferred Pymnt Issuing Method' },
  ]

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
