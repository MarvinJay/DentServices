import React, { useState } from 'react'
import { useAuth } from '../../components/AuthProvider'

export default function AdminLogin(){
  const { signInAdmin } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string|null>(null)

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setError(null)
    try{
      await signInAdmin(username, password)
    }catch(err:any){ setError(err.message || 'Failed to sign in') }
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'80vh'}}>
      <form onSubmit={submit} className="login-card center">
        <div className="login-logo">
          <svg width="72" height="44" viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
            <rect x="2" y="18" width="60" height="12" rx="3" fill="#2fb6b0" />
            <circle cx="18" cy="32" r="4" fill="#063" />
            <circle cx="46" cy="32" r="4" fill="#063" />
            <rect x="8" y="10" width="48" height="10" rx="3" fill="#6ee7e3" />
          </svg>
        </div>
        <h3 style={{textAlign:'center'}}>Admin Login</h3>
        {error && <div style={{color:'#b91c1c',marginBottom:10}}>{error}</div>}
        <div className="login-form-row">
          <label>Username</label>
          <input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div className="login-form-row">
          <label style={{marginTop:8}}>Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="login-actions">
          <button className="close-btn" type="submit">Sign in</button>
        </div>
      </form>
    </div>
  )
}
