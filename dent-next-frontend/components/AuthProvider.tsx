import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { mockPartnerShops, PartnerShop } from '../data/mockCases'

type AuthState =
  | { authenticated: false }
  | { authenticated: true; role: 'admin'; user: { username: string } }
  | { authenticated: true; role: 'partner'; user: PartnerShop }

type AuthContextShape = {
  state: AuthState
  signInAdmin: (username: string, password: string) => Promise<void>
  signInPartner: (partnerId: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextShape | null>(null)

const STORAGE_KEY = 'dentops_auth_v1'

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [state, setState] = useState<AuthState>({ authenticated:false })
  const router = useRouter()

  useEffect(()=>{
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      if(raw){
        const parsed = JSON.parse(raw)
        setState(parsed)
      }
    }catch(e){ /* ignore */ }
  },[])

  useEffect(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }catch(e){}
  },[state])

  async function signInAdmin(username: string, password: string){
    // simple mock auth: password must be 'admin'
    if(password === 'admin'){
      const next: AuthState = { authenticated:true, role:'admin', user:{ username } }
      setState(next)
      router.push('/')
      return
    }
    throw new Error('Invalid admin credentials')
  }

  async function signInPartner(partnerId: string){
    const p = mockPartnerShops.find(x=>x.id === partnerId)
    if(p){
      const next: AuthState = { authenticated:true, role:'partner', user:p }
      setState(next)
      router.push('/')
      return
    }
    throw new Error('Partner not found')
  }

  function signOut(){
    setState({ authenticated:false })
    try{ localStorage.removeItem(STORAGE_KEY) }catch(e){}
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ state, signInAdmin, signInPartner, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  const ctx = useContext(AuthContext)
  if(!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthProvider
