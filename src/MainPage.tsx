// src/MainPage.tsx

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MapView from "./components/MapView";

export default function MainPage() {
  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-1 flex justify-center">
        <div className="w-full h-full flex flex-col mx-auto" style={{margin:"1rem"}}>
          <header className="p-4 bg-white shadow text-lg font-bold">
            DateTrip
          </header>

          <main className="flex-1">
            <MapView />
          </main>

          <nav className="h-16 bg-white border-t shadow-inner flex justify-around items-center text-sm">
            <Button className="flex flex-col items-center">
              <span>홈</span>
            </Button>
            <Button className="flex flex-col items-center">
              <span>루트</span>
            </Button>
            <Button className="flex flex-col items-center">
              <span>내 정보</span>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}
