import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthProvider'

const TOP_ITEMS = ['Estimates','Activity','Support','Conversions','Supplements','Audit','Partner Shops','SOP','Shop Matrix']

export default function Header({ topNav, onTopNavChange }: { topNav?: string; onTopNavChange?: (s:string)=>void }){
  const [open, setOpen] = useState(false)
  const { state, signOut } = useAuth()
  const ref = useRef<HTMLDivElement|null>(null)

  useEffect(()=>{
    function onDoc(e: MouseEvent){
      if(!ref.current) return
      if(e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return ()=> document.removeEventListener('click', onDoc)
  },[])

  return (
    <>
      <header className="topbar header">
        <div className="header-left">
          {/* Temporarily commented out per request */}
          {/* <div className="logo">Dent Ops</div> */}
          <nav className="topmenu">
          </nav>
        </div>

        <div className="header-right">
          <div className="search-placeholder">🔍</div>
          <button className="icon-btn" aria-label="Notifications">🔔</button>
          <button className="icon-btn" aria-label="Settings">⚙️</button>
          <div className="profile" ref={ref} style={{position:'relative'}}>
            <button className="profile-trigger" onClick={()=>setOpen(s=>!s)} aria-expanded={open} aria-haspopup="menu">
              {state.authenticated ? (state.role === 'admin' ? (state.user.username || 'Admin') : state.user.name || state.user.primaryContact || 'Partner') : 'Sign in'}
            </button>

            {open && (
              <div className="profile-dropdown" role="menu">
                {state.authenticated ? (
                  <>
                    <div className="pd-item">Role: <strong>{state.role}</strong></div>
                    <div className="pd-item">{state.role === 'admin' ? `User: ${state.user.username}` : `Shop: ${state.user.name}`}</div>
                    <div className="pd-actions">
                      <button className="close-btn" onClick={()=>{ signOut(); setOpen(false) }}>Sign out</button>
                    </div>
                  </>
                ) : (
                  <>
                    <a className="pd-link" href="/login/admin">Sign in (admin)</a>
                    <a className="pd-link" href="/login/partner">Sign in (partner)</a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {state.authenticated && state.role === 'admin' ? (
        <nav className="subnav" aria-label="Main navigation">
          <div className="subnav-inner">
            {TOP_ITEMS.map(t => (
              <button
                key={t}
                className={`nav-item ${topNav === t ? 'active' : ''}`}
                onClick={() => onTopNavChange?.(t)}
              >{t}</button>
            ))}
          </div>
        </nav>
      ) : null}
    </>
  )
}
