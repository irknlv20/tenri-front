"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function SearchSection() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  return (
    <div className="w-full bg-muted/50 py-8">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Main search bar */}
          <div className="flex flex-col md:flex-row rounded-lg bg-background shadow-md">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Жилые комплексы"
                className="pl-10 py-6 rounded-l-lg border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="flex border-l">
              <button
                onClick={() => setActiveFilter(activeFilter === "rooms" ? null : "rooms")}
                className="px-6 py-3 flex items-center justify-between min-w-[150px] border-r"
              >
                <span>Комнат</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${activeFilter === "rooms" ? "rotate-180" : ""}`}
                />
              </button>

              <button
                onClick={() => setActiveFilter(activeFilter === "price" ? null : "price")}
                className="px-6 py-3 flex items-center justify-between min-w-[150px] border-r"
              >
                <span>Цена</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${activeFilter === "price" ? "rotate-180" : ""}`}
                />
              </button>

              <button
                onClick={() => setActiveFilter(activeFilter === "more" ? null : "more")}
                className="px-6 py-3 flex items-center justify-between min-w-[150px]"
              >
                <span>Еще</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${activeFilter === "more" ? "rotate-180" : ""}`}
                />
              </button>

              <Button className="rounded-l-none rounded-r-lg px-8">Найти</Button>
            </div>
          </div>

          {/* Room filter */}
          {activeFilter === "rooms" && (
            <div className="mt-2 p-4 bg-background rounded-lg shadow-md grid grid-cols-3 md:grid-cols-6 gap-2">
              <button className="py-2 px-4 rounded-md hover:bg-muted transition-colors">Все</button>
              <button className="py-2 px-4 rounded-md bg-muted transition-colors">1</button>
              <button className="py-2 px-4 rounded-md hover:bg-muted transition-colors">2</button>
              <button className="py-2 px-4 rounded-md bg-muted transition-colors">3</button>
              <button className="py-2 px-4 rounded-md hover:bg-muted transition-colors">4</button>
              <button className="py-2 px-4 rounded-md hover:bg-muted transition-colors">5+</button>
            </div>
          )}

          {/* Price filter */}
          {activeFilter === "price" && (
            <div className="mt-2 p-4 bg-background rounded-lg shadow-md flex gap-4">
              <Input type="text" placeholder="3 500 000" className="flex-1" />
              <span className="flex items-center">₸</span>
              <Input type="text" placeholder="5 200 000" className="flex-1" />
              <span className="flex items-center">₸</span>
            </div>
          )}

          {/* More filters */}
          {activeFilter === "more" && (
            <div className="mt-2 p-4 bg-background rounded-lg shadow-md">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Срок сдачи</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button className="py-2 px-4 rounded-md hover:bg-muted transition-colors">2022</button>
                  <button className="py-2 px-4 rounded-md bg-muted transition-colors">2023</button>
                  <button className="py-2 px-4 rounded-md hover:bg-muted transition-colors">2024</button>
                  <button className="py-2 px-4 rounded-md hover:bg-muted transition-colors">2025</button>
                  <button className="py-2 px-4 rounded-md hover:bg-muted transition-colors">2025+</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Площадь квартиры</h3>
                  <Input type="text" placeholder="120" className="mb-1" />
                  <span className="text-xs text-muted-foreground">м²</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Площадь кухни</h3>
                  <Input type="text" placeholder="18" className="mb-1" />
                  <span className="text-xs text-muted-foreground">м²</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Опции</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="parking" className="mr-2" checked />
                    <label htmlFor="parking">Паркинг</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="river" className="mr-2" />
                    <label htmlFor="river">Вид с реки (до 1.5 км)</label>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Регион" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kyzylorda">Кызылорда</SelectItem>
                    <SelectItem value="center">Центральный</SelectItem>
                    <SelectItem value="north">Северный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
