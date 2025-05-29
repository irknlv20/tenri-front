"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight, Heart, Trash2, BarChart3 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FavoritesService, ComparisonService, type StoredFavorite } from "@/lib/localStorage"
import { toast } from "sonner"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<StoredFavorite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = FavoritesService.getAll()
        setFavorites(storedFavorites)
      } catch (error) {
        console.error("Error loading favorites:", error)
        toast.error("Ошибка при загрузке избранного")
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const handleRemoveFromFavorites = (id: string) => {
    try {
      FavoritesService.remove(id)
      setFavorites((prev) => prev.filter((fav) => fav.id !== id))
      toast.success("Объект удален из избранного")
    } catch (error) {
      console.error("Error removing from favorites:", error)
      toast.error("Ошибка при удалении из избранного")
    }
  }

  const handleAddToComparison = (favorite: StoredFavorite) => {
    try {
      if (ComparisonService.isInComparison(favorite.propertyId)) {
        toast.info("Объект уже добавлен в сравнение")
        return
      }

      ComparisonService.add(favorite)
      toast.success("Объект добавлен в сравнение")
    } catch (error) {
      console.error("Error adding to comparison:", error)
      toast.error(error instanceof Error ? error.message : "Ошибка при добавлении в сравнение")
    }
  }

  const handleClearAll = () => {
    if (window.confirm("Вы уверены, что хотите очистить все избранное?")) {
      try {
        favorites.forEach((fav) => FavoritesService.remove(fav.id))
        setFavorites([])
        toast.success("Избранное очищено")
      } catch (error) {
        console.error("Error clearing favorites:", error)
        toast.error("Ошибка при очистке избранного")
      }
    }
  }

  if (isLoading) {
    return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Избранное</h2>
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
    )
  }

  return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Избранное</h2>
          {favorites.length > 0 && (
              <div className="flex gap-2">
                <Link href="/cabinet/comparison">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Сравнение ({ComparisonService.getAll().length})
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Очистить все
                </Button>
              </div>
          )}
        </div>

        {favorites.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {favorites.map((favorite) => (
                  <Card key={favorite.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto">
                          <Image
                              src={favorite.image || "/placeholder.svg"}
                              alt={favorite.title}
                              fill
                              className="object-cover"
                          />
                          {favorite.badge && (
                              <Badge className="absolute top-2 left-2 bg-primary text-white border-0">{favorite.badge}</Badge>
                          )}
                        </div>

                        <div className="p-6 flex-1">
                          <h3 className="text-xl font-bold mb-2">{favorite.title}</h3>

                          <div className="flex items-center gap-2 text-muted-foreground mb-4">
                            <MapPin className="h-4 w-4" />
                            <span>{favorite.address}</span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Площадь</div>
                              <div className="font-medium">{favorite.area} м²</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Этаж</div>
                              <div className="font-medium">{favorite.floor}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Стоимость</div>
                              <div className="font-medium">{favorite.price.toLocaleString()} ₸</div>
                              <div className="text-xs text-muted-foreground">
                                {favorite.pricePerSqm.toLocaleString()} ₸/м²
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Сдача</div>
                              <div className="font-medium">{new Date(favorite.completionDate).toLocaleDateString()}</div>
                            </div>
                          </div>

                          <div className="text-sm text-muted-foreground mb-4">Застройщик: {favorite.developer}</div>

                          <div className="text-xs text-muted-foreground mb-4">
                            Добавлено: {new Date(favorite.addedDate).toLocaleDateString()}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Link href={`/property/${favorite.propertyId}`}>
                              <Button variant="default" size="sm" className="gap-1">
                                Подробнее
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => handleAddToComparison(favorite)}
                                disabled={ComparisonService.isInComparison(favorite.propertyId)}
                            >
                              <BarChart3 className="h-4 w-4" />
                              {ComparisonService.isInComparison(favorite.propertyId) ? "В сравнении" : "Сравнить"}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveFromFavorites(favorite.id)}
                            >
                              <Heart className="h-4 w-4 fill-current" />
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
        ) : (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Нет избранных объектов</h3>
              <p className="text-muted-foreground mb-4">
                Добавляйте понравившиеся объекты в избранное для быстрого доступа
              </p>
              <Link href="/novostroiki">
                <Button>Посмотреть объекты</Button>
              </Link>
            </div>
        )}
      </div>
  )
}
