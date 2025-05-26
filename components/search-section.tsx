"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const [projects, setProjects] = useState([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    name: "",
    rooms: "",
    minPrice: "",
    maxPrice: "",
    parking: false
  })

  const fetchProjects = async (newFilters = filters) => {
    const hasAnyFilter = newFilters.name || newFilters.rooms || newFilters.minPrice || newFilters.maxPrice || newFilters.parking
    if (!hasAnyFilter) {
      setProjects([])
      return
    }

    try {
      const query = new URLSearchParams()
      if (newFilters.name) query.append("name", newFilters.name)
      if (newFilters.rooms) query.append("rooms", newFilters.rooms)
      if (newFilters.minPrice) query.append("minPrice", newFilters.minPrice)
      if (newFilters.maxPrice) query.append("maxPrice", newFilters.maxPrice)
      if (newFilters.parking) query.append("parking", "true")

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/filter?${query.toString()}`)
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      console.error("Ошибка при загрузке проектов:", err)
    }
  }

  const updateFilters = (newPartialFilter: Partial<typeof filters>) => {
    const newFilters = { ...filters, ...newPartialFilter }
    setFilters(newFilters)
    fetchProjects(newFilters)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") fetchProjects()
  }

  return (
    <div className="w-full bg-muted/50 py-8">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row rounded-lg bg-background shadow-md">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Жилые комплексы"
                value={filters.name}
                onChange={(e) => updateFilters({ name: e.target.value })}
                onKeyDown={handleKeyDown}
                className="pl-10 py-6 rounded-l-lg border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="flex border-l">
              <button
                onClick={() => setActiveFilter(activeFilter === "rooms" ? null : "rooms")}
                className="px-6 py-3 flex items-center justify-between min-w-[150px] border-r"
              >
                <span>Комнат</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${activeFilter === "rooms" ? "rotate-180" : ""}`} />
              </button>

              <button
                onClick={() => setActiveFilter(activeFilter === "price" ? null : "price")}
                className="px-6 py-3 flex items-center justify-between min-w-[150px] border-r"
              >
                <span>Цена</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${activeFilter === "price" ? "rotate-180" : ""}`} />
              </button>

              <Button onClick={() => fetchProjects()} className="rounded-l-none rounded-r-lg px-8 h-full">Найти</Button>
            </div>
          </div>

          {activeFilter === "rooms" && (
            <div className="mt-2 p-4 bg-background rounded-lg shadow-md grid grid-cols-3 md:grid-cols-6 gap-2">
              {["", "1", "2", "3", "4", "5"].map((room) => (
                <button
                  key={room}
                  className={`py-2 px-4 rounded-md ${filters.rooms === room ? "bg-muted" : "hover:bg-muted"} transition-colors`}
                  onClick={() => updateFilters({ rooms: room })}
                >
                  {room === "" ? "Все" : room}
                </button>
              ))}
            </div>
          )}

          {activeFilter === "price" && (
            <div className="mt-2 p-4 bg-background rounded-lg shadow-md flex gap-4">
              <Input
                type="number"
                placeholder="от"
                value={filters.minPrice}
                onChange={(e) => updateFilters({ minPrice: e.target.value })}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <span className="flex items-center">₸</span>
              <Input
                type="number"
                placeholder="до"
                value={filters.maxPrice}
                onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <span className="flex items-center">₸</span>
            </div>
          )}

          {/* Dropdown menu auto-displaying below filter */}
          {projects.length > 0 && (
            <div className="relative mt-6">
              <div className="absolute left-0 right-0 bg-white border shadow-lg rounded-md z-10 max-h-96 overflow-y-auto">
                {projects.map((project: any) => (
                  <div
                    key={project.id}
                    className="p-4 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  >
                    <Link
                      href={`/property/${project.id}`}
                      key={project.id}
                      className=""
                    ><p className="font-medium text-sm">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.address}</p></Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
