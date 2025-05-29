import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileSignature, Clock, Info, Shield, Key, FileText, Download } from "lucide-react"
import Link from "next/link"

export default function SignaturePage() {
  const signatures = [
    {
      id: "1",
      title: "Квалифицированная электронная подпись",
      issuer: "АО «Национальные информационные технологии»",
      issuedDate: "01.01.2025",
      expiryDate: "01.01.2026",
      status: "Активна",
      statusColor: "bg-green-500",
      type: "Квалифицированная",
      documents: 5,
    },
  ]

  const pendingDocuments = [
    {
      id: "1",
      title: "Договор купли-продажи",
      type: "Договор",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      deadline: "20.05.2025",
      status: "Ожидает подписания",
      statusColor: "bg-yellow-500",
    },
    {
      id: "2",
      title: "Акт приема-передачи",
      type: "Акт",
      property: "2-комнатная квартира в ЖК «Кызылорда-Сити»",
      deadline: "25.05.2025",
      status: "Ожидает подписания",
      statusColor: "bg-yellow-500",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Электронная подпись</h2>

      <Tabs defaultValue="signatures">
        <TabsList className="mb-6">
          <TabsTrigger value="signatures">Мои подписи</TabsTrigger>
          <TabsTrigger value="pending">Ожидают подписания</TabsTrigger>
          <TabsTrigger value="info">Информация</TabsTrigger>
        </TabsList>

        <TabsContent value="signatures">
          {signatures.length > 0 ? (
            <div className="space-y-6">
              {signatures.map((signature) => (
                <Card key={signature.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <FileSignature className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{signature.title}</h3>
                        <div className="text-sm text-muted-foreground">{signature.issuer}</div>
                      </div>
                      <Badge className={`${signature.statusColor} text-white border-0 ml-auto`}>
                        {signature.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-muted-foreground">Тип подписи</div>
                        <div className="font-medium">{signature.type}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Дата выдачи</div>
                        <div className="font-medium">{signature.issuedDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Действительна до</div>
                        <div className="font-medium">{signature.expiryDate}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Подписано документов</div>
                          <div className="text-sm text-muted-foreground">{signature.documents} документов</div>
                        </div>
                      </div>
                      <Link href="/cabinet/documents?signed=true">
                        <Button variant="outline" size="sm">
                          Просмотреть
                        </Button>
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-6">
                      <Button variant="outline" className="gap-1">
                        <Download className="h-4 w-4" />
                        Скачать сертификат
                      </Button>
                      <Button variant="outline" className="gap-1">
                        <Key className="h-4 w-4" />
                        Обновить подпись
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-muted/50 p-6 rounded-lg mb-4 inline-flex">
                  <FileSignature className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2">У вас пока нет электронной подписи</h3>
                <p className="text-muted-foreground mb-4">
                  Электронная подпись позволяет подписывать документы онлайн без посещения офиса
                </p>
                <Button>Получить электронную подпись</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingDocuments.length > 0 ? (
            <div className="space-y-4">
              {pendingDocuments.map((document) => (
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
                            <span>{document.property}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <Badge className={`${document.statusColor} text-white border-0`}>{document.status}</Badge>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto mr-4">
                          <Clock className="h-4 w-4" />
                          <span>До: {document.deadline}</span>
                        </div>

                        <Button size="sm">Подписать</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">У вас нет документов, ожидающих подписания</div>
          )}
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Что такое электронная подпись?</h3>

              <div className="space-y-4 text-muted-foreground">
                <p>
                  Электронная подпись (ЭП) — это аналог собственноручной подписи, представленный в электронном виде. Она
                  позволяет подтвердить авторство электронного документа и гарантирует его неизменность после
                  подписания.
                </p>

                <div className="bg-muted/50 p-4 rounded-lg flex gap-4">
                  <div className="shrink-0">
                    <Info className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Преимущества использования ЭП</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Экономия времени — нет необходимости посещать офис для подписания документов</li>
                      <li>Безопасность — документы защищены от подделки</li>
                      <li>
                        Юридическая значимость — электронные документы имеют такую же юридическую силу, как и бумажные
                      </li>
                      <li>Удобство хранения — все документы хранятся в электронном виде</li>
                    </ul>
                  </div>
                </div>

                <h4 className="text-lg font-medium text-foreground">Типы электронных подписей</h4>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h5 className="font-medium text-foreground">Простая электронная подпись</h5>
                    </div>
                    <p className="text-sm">
                      Подтверждает факт формирования подписи определенным лицом. Используется для авторизации в
                      информационных системах.
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h5 className="font-medium text-foreground">Усиленная неквалифицированная подпись</h5>
                    </div>
                    <p className="text-sm">
                      Создается с помощью криптографических средств. Позволяет определить лицо, подписавшее документ, и
                      выявить изменения в документе.
                    </p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h5 className="font-medium text-foreground">Квалифицированная электронная подпись</h5>
                    </div>
                    <p className="text-sm">
                      Наиболее защищенный вид подписи. Выдается аккредитованными удостоверяющими центрами. Имеет полную
                      юридическую силу и может использоваться для подписания любых документов.
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Button>Получить электронную подпись</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
