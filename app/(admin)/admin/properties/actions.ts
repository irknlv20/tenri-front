"use server"

import { revalidatePath } from "next/cache"

export type PropertyFormData = {
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  status: string
  features: string[]
  images: string[]
}

export async function addProperty(formData: FormData) {
  try {
    // В реальном приложении вы бы:
    // 1. Проверяли входные данные
    // 2. Подключались к базе данных
    // 3. Загружали изображения в хранилище
    // 4. Сохраняли данные об объекте

    const property = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      location: formData.get("location") as string,
      bedrooms: Number.parseInt(formData.get("bedrooms") as string),
      bathrooms: Number.parseInt(formData.get("bathrooms") as string),
      area: Number.parseFloat(formData.get("area") as string),
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      features: (formData.get("features") as string).split(",").map((f) => f.trim()),
      images: ["/placeholder.svg?height=600&width=800"],
      createdAt: new Date().toISOString(),
    }

    console.log("Новый объект:", property)

    // Имитация сохранения в базу данных
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Ревалидация страницы объектов для отображения нового объекта
    revalidatePath("/properties")
    revalidatePath("/admin/properties")

    return { success: true, message: "Объект успешно добавлен" }
  } catch (error) {
    console.error("Ошибка при добавлении объекта:", error)
    return { success: false, message: "Не удалось добавить объект" }
  }
}
