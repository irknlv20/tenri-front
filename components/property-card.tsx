import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building, MapPin } from "lucide-react"

interface PropertyCardProps {
  id: string
  title: string
  description: string
  price: number
  pricePerSqm: number
  image: string
  developer: string
  location: string
  badge?: string
}

export default function PropertyCard({
  id,
  title,
  description,
  price,
  pricePerSqm,
  image,
  developer,
  location,
  badge,
}: PropertyCardProps) {
  return (
    <Link href={`/property/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-[16/9]">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          {badge && <Badge className="absolute left-2 top-2 bg-secondary text-secondary-foreground">{badge}</Badge>}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-bold">{title}</h3>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">от {price.toLocaleString()} ₸</div>
              <div className="text-xs text-muted-foreground">от {pricePerSqm.toLocaleString()} ₸/м²</div>
            </div>
          </div>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Building className="h-3 w-3" />
            <span>{developer}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
