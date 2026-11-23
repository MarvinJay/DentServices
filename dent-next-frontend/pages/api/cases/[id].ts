import type { NextApiRequest, NextApiResponse } from 'next'
import mockCases from '../../../data/mockCases'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string }
  const idx = mockCases.findIndex(c => c.id === id)
  if(idx === -1) return res.status(404).json({ error: 'Not found' })

  if(req.method === 'GET'){
    return res.status(200).json({ case: mockCases[idx] })
  }

  if(req.method === 'PATCH' || req.method === 'PUT'){
    try{
      const body = req.body || {}
      // shallow merge allowed fields
      const allowed = ['stage','subStatus','ownerName','vehicle','vin','originalEstimateTotal','estimatingTotal','partnerShopId','assignedTo','notes']

      // ensure activity array exists
      if(!mockCases[idx].activity) mockCases[idx].activity = []

      // special-case: add a comment entry when `_comment` is provided
      if(body._comment){
        const commentEntry = {
          id: `${Date.now()}-${Math.floor(Math.random()*1000)}`,
          field: 'comment',
          oldValue: '',
          newValue: body._comment,
          who: body._editor || 'User',
          time: new Date().toISOString()
        }
        mockCases[idx].activity = [commentEntry, ...(mockCases[idx].activity || [])]
      }

      // record changes for allowed fields
      Object.keys(body).forEach(k=>{
        if(allowed.includes(k)){
          // @ts-ignore
          const oldVal = mockCases[idx][k]
          const newVal = body[k]
          const changed = oldVal !== newVal && JSON.stringify(oldVal) !== JSON.stringify(newVal)
          if(changed){
            const entry = {
              id: `${Date.now()}-${Math.floor(Math.random()*1000)}`,
              field: k,
              oldValue: oldVal,
              newValue: newVal,
              who: body._editor || 'User',
              time: new Date().toISOString()
            }
            // prepend so newest first
            mockCases[idx].activity = [entry, ...(mockCases[idx].activity || [])]
          }
          // @ts-ignore
          mockCases[idx][k] = body[k]
        }
      })

      mockCases[idx].lastUpdated = new Date().toISOString()
      return res.status(200).json({ case: mockCases[idx] })
    }catch(err:any){
      return res.status(500).json({ error: err.message || 'Failed to update' })
    }
  }

  res.setHeader('Allow', ['GET','PATCH','PUT'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
