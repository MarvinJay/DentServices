import type { NextApiRequest, NextApiResponse } from 'next'
import mockCases from '../../data/mockCases'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ cases: mockCases })
}
