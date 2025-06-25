'use client'

import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <h1 className="text-4xl font-bold mb-4">🎉 欢迎回来！</h1>
      <p className="text-lg text-gray-700">您已成功登录系统。</p>

      <div className="mt-6 space-x-4">
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          返回首页
        </button>
        <button
          onClick={() => router.push('/blocklist')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          查看区块链结构
        </button>
        <button
          onClick={() => router.push('/vote')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          去投票
        </button>
        <button
          onClick={() => router.push('/result')}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          查看投票结果
        </button>
      </div>
    </div>
  )
}
