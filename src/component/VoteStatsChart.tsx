'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

type Props = {
  blocks: {
    candidateIndex: number
  }[]
}

export default function VoteStatsChart({ blocks }: Props) {
  // 统计每个候选人的票数
  const counts: Record<number, number> = {}
  blocks.forEach(block => {
    const idx = block.candidateIndex
    if (idx >= 0) {
      counts[idx] = (counts[idx] || 0) + 1
    }
  })

  const data = Object.entries(counts).map(([index, count]) => ({
    candidate: `#${index}`,
    votes: count,
  }))

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">📊 候选人投票数</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="candidate" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="votes" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
