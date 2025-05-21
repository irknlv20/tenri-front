import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Eye, AlertCircle, Building, Upload, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DocumentsPage() {
  const documents = [
    {
      id: "1",
      title: "Договор купли-продажи",
      type: "Договор",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      date: "15.05.2025",
      status: "Подписан",
      statusColor: "bg-green-500",
      size: "2.4 МБ",
      format: "PDF",
    },
    {
      id: "2",
      title: "Акт приема-передачи",
      type: "Акт",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      date: "15.05.2025",
      status: "Ожидает подписания",
      statusColor: "bg-yellow-500",
      size: "1.8 МБ",
      format: "PDF",
    },
    {
      id: "3",
      title: "Технический паспорт",
      type: "Технический документ",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      date: "10.05.2025",
      status: "Доступен",
      statusColor: "bg-blue-500",
      size: "3.5 МБ",
      format: "PDF",
    },
    {
      id: "4",
      title: "Выписка из ЕГРН",
      type: "Выписка",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      date: "12.05.2025",
      status: "Доступен",
      statusColor: "bg-blue-500",
      size: "1.2 МБ",
      format: "PDF",
    },
    {
      id: "5",
      title: "Договор ипотечного кредитования",
      type: "Договор",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      date: "14.05.2025",
      status: "Подписан",
      statusColor: "bg-green-500",
      size: "4.1 МБ",
      format: "PDF",
    },
  ]

  const requiredDocuments = [
    {
      id: "6",
      title: "Справка о доходах",
      type: "Справка",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      deadline: "20.05.2025",
      status: "Требуется загрузить",
      statusColor: "bg-red-500",
      description: "Справка о доходах за последние 6 месяцев",
    },
    {
      id: "7",
      title: "Согласие на обработку персональных данных",
      type: "Согласие",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      deadline: "18.05.2025",
      status: "Требуется загрузить",
      statusColor: "bg-red-500",
      description: "Подписанное согласие на обработку персональных данных",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Документы</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Поиск документов" className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Загрузить
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Все документы</TabsTrigger>
          <TabsTrigger value="required">Требуется загрузить</TabsTrigger>
          <TabsTrigger value="signed">Подписанные</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {documents.map((document) => (
              <Card key={document.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex items-center gap-3 flex-grow">
                      <div className="bg-muted p-3 rounded-md">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{document.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                          <span>{document.type}</span>
                          <span>•</span>
                          <span>{document.date}</span>
                          <span>•</span>
                          <span>{document.size}</span>
                          <span>•</span>
                          <span>{document.format}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Badge className={`${document.statusColor} text-white border-0`}>{document.status}</Badge>

                      <div className="flex gap-2 ml-auto">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Просмотр</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Скачать</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{document.property}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="required">
          <div className="space-y-4">
            {requiredDocuments.map((document) => (
              <Card key={document.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex items-center gap-3 flex-grow">
                      <div className="bg-muted p-3 rounded-md">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{document.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                          <span>{document.type}</span>
                          <span>•</span>
                          <span>Срок: {document.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Badge className={`${document.statusColor} text-white border-0`}>{document.status}</Badge>

                      <div className="flex gap-2 ml-auto">
                        <Button size="sm" className="gap-1">
                          <Upload className="h-4 w-4" />
                          <span>Загрузить</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Building className="h-4 w-4" />
                      <span>{document.property}</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{document.description}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signed">
          <div className="space-y-4">
            {documents
              .filter((doc) => doc.status === "Подписан")
              .map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex items-center gap-3 flex-grow">
                        <div className="bg-muted p-3 rounded-md">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{document.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                            <span>{document.type}</span>
                            <span>•</span>
                            <span>{document.date}</span>
                            <span>•</span>
                            <span>{document.size}</span>
                            <span>•</span>
                            <span>{document.format}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <Badge className={`${document.statusColor} text-white border-0`}>{document.status}</Badge>

                        <div className="flex gap-2 ml-auto">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Просмотр</span>
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Скачать</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>{document.property}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
