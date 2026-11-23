import React from 'react'
import { mockPartnerShops } from '../data/mockCases'

export default function Card({ item, onClick }: { item: any, onClick?: (it:any)=>void }){
  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="card" role="button" tabIndex={0} draggable onDragStart={handleDragStart} onClick={()=>onClick?.(item)} onKeyDown={(e)=>{ if(e.key==='Enter') onClick?.(item)}}>
      <h4>{item.title}</h4>
      <div className="meta">
        <div>{(mockPartnerShops.find(s=>s.id===item.partnerShopId)?.name) || ''}</div>
        <div className="badge">{item.subStatus ?? item.tags?.[0] ?? ''}</div>
      </div>
      <div style={{marginTop:8,fontSize:13,color:'#6b7280'}}>
        {item.amount !== undefined && item.amount !== null ? item.amount.toLocaleString(undefined,{minimumFractionDigits:2}) : ''}
        {item.amount ? ' • ' : ''}
        {item.date || item.dateCreated || ''}
      </div>
    </div>
  )
}
