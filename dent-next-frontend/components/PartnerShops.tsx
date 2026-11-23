import React, { useState } from 'react'
import { mockPartnerShops, PartnerShop } from '../data/mockCases'

export default function PartnerShops() {
  const [view, setView] = useState('all')
  const [selected, setSelected] = useState<PartnerShop | null>(null)

  const items = mockPartnerShops

  const counts: Record<string, number> = {
    all: items.length,
    'preferred-pymnt': items.filter(i => (i.notes || '').toLowerCase().includes('preferred') || (i.attributionSource||'').toLowerCase().includes('preferred')).length
  }

  return (
    <div className="partner-shops">
      <div className="partner-list">
        <h3>Partner Shops</h3>
        <div className="list-rows">
          {items.map(p => (
            <div key={p.id} className="partner-row" onClick={()=>setSelected(p)}>
              <div className="row-left">
                <div className="name">{p.name}</div>
                <div className="meta">{p.address} • {p.phone}</div>
              </div>
              <div className="row-right">
                <div className="id">{p.id}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="partner-detail">
        {selected ? (
          <div>
            <h3>{selected.name}</h3>
            <p><strong>Contact:</strong> {selected.primaryContact} — {selected.phone}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Address:</strong> {selected.address}</p>
            <p><strong>Notes:</strong> {selected.notes}</p>
            <p><strong>Attribution:</strong> {selected.attributionSource}</p>
            <p><strong>EAN / EIN:</strong> {selected.ein} • {selected.partnerUnique}</p>
          </div>
        ) : (
          <div className="placeholder">Select a partner shop to view details</div>
        )}
      </div>
    </div>
  )
}
