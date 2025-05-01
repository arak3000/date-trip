// src/MainPage.tsx

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MainPage() {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">데이트립</h1>
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6">
          <p className="text-lg">환영합니다! 🎉</p>
          <p className="text-sm text-gray-600 mt-2">현재 시각: {date.toLocaleTimeString()}</p>
          <Button className="mt-4 w-full">경로 탐색 시작하기</Button>
        </CardContent>
      </Card>
    </div>
  )
}
