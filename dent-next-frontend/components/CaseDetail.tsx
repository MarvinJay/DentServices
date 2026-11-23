import React, { useState, useEffect } from 'react'
import { mockPartnerShops } from '../data/mockCases'

export default function CaseDetail({ item, onClose, onSave }: { item: any | null; onClose: ()=>void; onSave?: (updated:any)=>void }){
  if(!item) return null

  // compose activity list: include recorded activity entries, plus created/lastUpdated markers
  const fieldLabels: Record<string,string> = {
    ownerName: "Owner's Name",
    vehicle: 'Vehicle',
    vin: 'VIN',
    originalEstimateTotal: 'Original Estimate',
    estimatingTotal: 'Estimating Total',
    company: 'Shop Name',
    attributionSource: 'Attribution Source',
    ein: 'EIN',
    shopAddress: 'Shop Address',
    partnerUnique: 'Partner Unique',
    subStatus: 'Case Sub-Status',
    stage: 'Stage',
    assignedTo: 'Assigned To',
    notes: 'Notes'
  }

  // build recorded activity entries with parsed labels/values
  const recordedRaw = (item.activity || []).map((a:any) => {
    const label = fieldLabels[a.field] ?? a.field
    const oldVal = a.oldValue === undefined || a.oldValue === null ? '' : String(a.oldValue)
    const newVal = a.newValue === undefined || a.newValue === null ? '' : String(a.newValue)
    return { id: a.id, who: a.who, time: a.time, field: a.field, label, oldVal, newVal }
  })

  // group recorded entries by who+time so multiple field edits in one save show as one card
  // exclude comment entries from activity grouping — comments belong in Comment tab only
  const recordedForGrouping = recordedRaw.filter((r:any) => r.field !== 'comment')
  const groupsMap = new Map<string, any[]>()
  recordedForGrouping.forEach((r:any) => {
    const key = `${r.who}|${r.time}`
    const arr = groupsMap.get(key) || []
    arr.push(r)
    groupsMap.set(key, arr)
  })

  const recordedGroups = Array.from(groupsMap.entries()).map(([key, arr]) => {
    const [who, time] = key.split('|')
    return { id: key, who, time, items: arr }
  }).sort((a:any,b:any)=> new Date(b.time).getTime() - new Date(a.time).getTime())

  // extract plain comments (field === 'comment') for the Comment tab
  const comments = recordedRaw.filter((r:any)=> r.field === 'comment').sort((a:any,b:any)=> new Date(b.time).getTime() - new Date(a.time).getTime())

  const activities = [
    { id: 'created', time: item.dateCreated || 'N/A', text: 'Created' },
    { id: 'last', time: item.lastUpdated || 'N/A', text: 'Last updated' },
    // recordedGroups will be rendered specially in the UI
    ...recordedGroups
  ]

  const [ownerName, setOwnerName] = useState(item.ownerName || '')
  const [vehicle, setVehicle] = useState(item.vehicle || '')
  const [vin, setVin] = useState(item.vin || '')
  const [originalEstimate, setOriginalEstimate] = useState(item.originalEstimateTotal ?? item.amount ?? '')
  const [estimatingTotal, setEstimatingTotal] = useState(item.estimatingTotal ?? '')
  const [shopName, setShopName] = useState('')
  const [attributionSource, setAttributionSource] = useState('')
  const [ein, setEin] = useState('')
  const [shopAddress, setShopAddress] = useState('')
  const [partnerUnique, setPartnerUnique] = useState('')
  const [subStatus, setSubStatus] = useState(item.subStatus || '')

  useEffect(()=>{
    setOwnerName(item.ownerName || '')
    setVehicle(item.vehicle || '')
    setVin(item.vin || '')
    setOriginalEstimate(item.originalEstimateTotal ?? item.amount ?? '')
    setEstimatingTotal(item.estimatingTotal ?? '')
    // Resolve partner shop values by partnerShopId
    const shopId = (item.partnerShopId || item.partnerShop || '')
    const shop = mockPartnerShops.find(s => s.id === shopId)
    setShopName(shop?.name || '')
    setAttributionSource(shop?.attributionSource || '')
    setEin(shop?.ein || '')
    setShopAddress(shop?.address || '')
    setPartnerUnique(shop?.partnerUnique || '')
    setSubStatus(item.subStatus || '')
  },[item])

  function isDirty(){
    if(!item) return false
    const orig = {
      ownerName: item.ownerName || '',
      vehicle: item.vehicle || '',
      vin: item.vin || '',
      originalEstimate: item.originalEstimateTotal ?? item.amount ?? '',
      estimatingTotal: item.estimatingTotal ?? '',
      partnerShopId: item.partnerShopId || '',
      shopName: (() => {
        const shop = mockPartnerShops.find(s => s.id === (item.partnerShopId || ''))
        return shop?.name || ''
      })(),
      attributionSource: (() => {
        const shop = mockPartnerShops.find(s => s.id === (item.partnerShopId || ''))
        return shop?.attributionSource || ''
      })(),
      ein: (() => {
        const shop = mockPartnerShops.find(s => s.id === (item.partnerShopId || ''))
        return shop?.ein || ''
      })(),
      shopAddress: (() => {
        const shop = mockPartnerShops.find(s => s.id === (item.partnerShopId || ''))
        return shop?.address || ''
      })(),
      partnerUnique: (() => {
        const shop = mockPartnerShops.find(s => s.id === (item.partnerShopId || ''))
        return shop?.partnerUnique || ''
      })(),
      subStatus: item.subStatus || ''
    }
    return (
      orig.ownerName !== ownerName ||
      orig.vehicle !== vehicle ||
      orig.vin !== vin ||
      String(orig.originalEstimate) !== String(originalEstimate) ||
      String(orig.estimatingTotal) !== String(estimatingTotal) ||
      orig.partnerShopId !== (item.partnerShopId || '') ||
      orig.shopName !== shopName ||
      orig.attributionSource !== attributionSource ||
      orig.ein !== ein ||
      orig.shopAddress !== shopAddress ||
      orig.partnerUnique !== partnerUnique ||
      orig.subStatus !== subStatus
    )
  }

  function handleAttemptClose(){
    if(isDirty()){
      setShowConfirm(true)
      return
    }
    onClose()
  }

  const [showConfirm, setShowConfirm] = React.useState(false)
  const [showToast, setShowToast] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'activity'|'comment'>('activity')
  const [commentText, setCommentText] = React.useState('')

  function discardAndClose(){
    setShowConfirm(false)
    onClose()
  }

  function cancelConfirm(){
    setShowConfirm(false)
  }

  function handleSave(closeAfter = false){
    // Persist to API - only include fields that actually changed to avoid noisy activity entries
    const original = item || {}
    // Shop fields are read-only on the case and stored on the PartnerShop entity.
    const candidate: any = {
      ownerName,
      vehicle,
      vin,
      originalEstimateTotal: originalEstimate,
      estimatingTotal,
      subStatus,
      _editor: 'You'
    }
    const payload: any = {}
    Object.keys(candidate).forEach(k => {
      const origVal = original[k]
      const newVal = candidate[k]
      const origStr = origVal === undefined || origVal === null ? '' : String(origVal)
      const newStr = newVal === undefined || newVal === null ? '' : String(newVal)
      if(origStr !== newStr){
        payload[k] = candidate[k]
      }
    })

    // If there's nothing to save, just return
    if(Object.keys(payload).length === 0){
      return
    }

    fetch(`/api/cases/${item.id}`, { method: 'PATCH', headers: { 'content-type':'application/json' }, body: JSON.stringify(payload) })
      .then(r=>r.json())
      .then(data => {
        const updated = data.case || data
        onSave?.(updated)
        // show toast
        setShowToast(true)
        setTimeout(()=>setShowToast(false), 1800)
        if(closeAfter){
          // give the toast a moment to show before closing
          setTimeout(()=>onClose(), 700)
        }
      })
      .catch(err => {
        console.error('Failed to save', err)
      })
  }

  function submitComment(){
    const text = (commentText || '').trim()
    if(!text) return
    const payload = { _comment: text, _editor: 'You' }
    fetch(`/api/cases/${item.id}`, { method: 'PATCH', headers: { 'content-type':'application/json' }, body: JSON.stringify(payload) })
      .then(r=>r.json())
      .then(data => {
        const updated = data.case || data
        onSave?.(updated)
        setCommentText('')
        setActiveTab('activity')
      })
      .catch(err => console.error('Failed to add comment', err))
  }

  return (
    <div className="detail-overlay" onClick={handleAttemptClose}>
      <div className="detail-panel" onClick={e=>e.stopPropagation()} role="dialog" aria-modal>
        <div className="detail-main">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3>{item.title}</h3>
              <div style={{display:'flex',alignItems:'center'}}>
                <button className="close-btn" onClick={()=>handleSave(false)}>Save</button>
                <button className="close-btn" style={{marginLeft:8}} onClick={()=>handleSave(true)}>Save & Close</button>
              </div>
            </div>
            <button aria-label="Close" className="modal-x" onClick={handleAttemptClose}>×</button>
          <div style={{marginTop:8,color:'#6b7280'}}>{item.id} • {shopName}</div>

          <div className="form-row">
            {(() => {
              const stage = item.stage || ''
              let options: string[] = []
              let label = 'Case Sub-Status'
              if (stage === 'File Build') {
                label = 'File Build Status'
                options = ['Ready for File Build','Building File','File Build Complete']
              } else if (stage === 'Estimating') {
                label = 'Estimating Status'
                options = ['Ready for Translation','Translating','Translation Complete']
              } else if (stage === 'QA') {
                label = 'QA Status'
                options = ['Ready for Translation QA1','Reviewing Translation QA1','Translation QA1 Complete']
              }

              return (
                <>
                  <label>{label}</label>
                  {options.length > 0 ? (
                    <select className="input" value={subStatus} onChange={e=>setSubStatus(e.target.value)}>
                      <option value="">—</option>
                      {options.map(o=> <option key={o} value={o}>{o}</option>)}
                      {subStatus && !options.includes(subStatus) ? <option value={subStatus}>{subStatus}</option> : null}
                    </select>
                  ) : (
                    <input className="input readonly" value={subStatus || item.subStatus || ''} readOnly />
                  )}
                </>
              )
            })()}
          </div>

          <div className="form-row">
            <label>Assigned To</label>
            <div className="field-value">{item.assignedTo || 'Unassigned'}</div>
          </div>

          <div className="form-section">
            <h4 style={{marginTop:14, marginBottom:6, color:'#6b7280', fontSize:13, fontWeight:600}}>Shop Details</h4>
            <div className="form-row">
              <label>Shop Name</label>
              <input className="input readonly" value={shopName} readOnly />
            </div>
            <div className="form-row">
              <label>Attribution Source</label>
              <input className="input readonly" value={attributionSource} readOnly />
            </div>
            <div className="form-row">
              <label>EIN</label>
              <input className="input readonly" value={ein} readOnly />
            </div>
            <div className="form-row">
              <label>Shop Address</label>
              <input className="input readonly" value={shopAddress} readOnly />
            </div>
            <div className="form-row">
              <label>Partner Unique</label>
              <input className="input readonly" value={partnerUnique} readOnly />
            </div>
            <h4 style={{marginTop:14, marginBottom:6, color:'#6b7280', fontSize:13, fontWeight:600}}>Vehicle Details</h4>
            <div className="form-row">
              <label>Owner's Name</label>
              <input className="input" value={ownerName} onChange={e=>setOwnerName(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Vehicle</label>
              <input className="input" value={vehicle} onChange={e=>setVehicle(e.target.value)} />
            </div>
            <div className="form-row">
              <label>VIN</label>
              <input className="input" value={vin} onChange={e=>setVin(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Original Estimate Total</label>
              <input className="input" type="number" value={originalEstimate as any} onChange={e=>setOriginalEstimate(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Estimating Total</label>
              <input className="input" type="number" value={estimatingTotal as any} onChange={e=>setEstimatingTotal(e.target.value)} />
            </div>
          </div>
        </div>

        <aside className="detail-activity">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',gap:8}}>
              <button className={`close-btn ${activeTab==='activity'?'active':''}`} onClick={()=>setActiveTab('activity')}>Activity</button>
              <button className={`close-btn ${activeTab==='comment'?'active':''}`} onClick={()=>setActiveTab('comment')}>Comment</button>
            </div>
          </div>
          {activeTab === 'activity' ? (
            <div className="activity-list">
            {activities.map((a:any)=> {
              // created/last are simple entries
              if(a.id === 'created' || a.id === 'last'){
                let t = a.time
                try{ t = new Date(a.time).toLocaleString() }catch(e){}
                return (
                  <div key={a.id} className="activity-item">
                    <div className="act-time">{t}</div>
                    <div className="act-text">{a.text}</div>
                  </div>
                )
              }

              // recorded group entry (edits grouped by who+time)
              const who = a.who
              let t = a.time
              try{ t = new Date(a.time).toLocaleString() }catch(e){}
              return (
                <div key={a.id} className="activity-group-card">
                  <div className="activity-group-header"><strong>{who}</strong> <span className="act-time">{t}</span></div>
                  <div className="activity-group-items">
                    {a.items.map((it:any)=>{
                      // per-field message without repeating who/time
                      if(it.newVal){
                        return <div key={it.id} className="activity-group-item">changed {it.label} from "{it.oldVal}" to "{it.newVal}"</div>
                      } else if(it.oldVal && !it.newVal){
                        return <div key={it.id} className="activity-group-item">cleared {it.label} (was "{it.oldVal}")</div>
                      }
                      return <div key={it.id} className="activity-group-item">updated {it.label}</div>
                    })}
                  </div>
                </div>
              )
            })}
            </div>
                ) : (
                  <div className="comment-tab" style={{marginTop:12}}>
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                      {comments.length === 0 ? <div className="empty">No comments yet</div> : (
                        comments.map((c:any)=> (
                          <div key={c.id} className="activity-group-card">
                            <div className="activity-group-header"><strong>{c.who}</strong> <span className="act-time">{new Date(c.time).toLocaleString()}</span></div>
                            <div style={{paddingTop:8}} className="activity-group-item">{c.newVal}</div>
                          </div>
                        ))
                      )}
                    </div>
                    <div style={{marginTop:12}}>
                      <textarea className="input" rows={6} value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add a comment..." />
                      <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:8}}>
                        <button className="close-btn" onClick={()=>{ setCommentText(''); setActiveTab('activity') }}>Cancel</button>
                        <button className="close-btn" onClick={submitComment}>Add Comment</button>
                      </div>
                    </div>
                  </div>
          )}
        </aside>
        {showConfirm ? (
          <div className="confirm-overlay" onClick={cancelConfirm}>
            <div className="confirm-dialog" onClick={e=>e.stopPropagation()}>
              <h4 style={{margin:0, marginBottom:8}}>Discard changes?</h4>
              <div style={{color:'#6b7280', marginBottom:12}}>You have unsaved changes. Discard and close?</div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
                <button className="close-btn" onClick={discardAndClose}>Discard & Close</button>
                <button className="close-btn" onClick={cancelConfirm}>Cancel</button>
              </div>
            </div>
          </div>
        ) : null}
        {showToast ? (
          <div className="save-toast">Saved</div>
        ) : null}
      </div>
    </div>
  )
}
