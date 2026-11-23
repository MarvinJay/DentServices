import React from 'react'
import { mockPartnerShops } from '../data/mockCases'

export default function ListView({ items, title, onRowClick }: { items: any[]; title?: string; onRowClick?: (it:any)=>void }){
  return (
    <div className="list-view">
      <div className="list-header">
        <div className="col id">ID</div>
        <div className="col title">Title</div>
        <div className="col company">Shop</div>
        <div className="col stage">Stage</div>
        <div className="col amount">Amount</div>
        <div className="col date">Date</div>
      </div>

      <div className="list-body">
        {items.length === 0 && <div className="empty">No items</div>}
        {items.map(item => (
          <div key={item.id} className="list-row" role="button" tabIndex={0} onClick={()=>onRowClick?.(item)} onKeyDown={(e)=>{ if(e.key==='Enter') onRowClick?.(item)}}>
            <div className="col id">{item.id}</div>
            <div className="col title">{item.title}</div>
            <div className="col company">{(mockPartnerShops.find(s=>s.id===item.partnerShopId)?.name) || ''}</div>
            <div className="col stage">{item.stage}</div>
            <div className="col amount">{item.amount ? item.amount.toLocaleString(undefined,{minimumFractionDigits:2}) : ''}</div>
            <div className="col date">{item.date || item.dateCreated}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
