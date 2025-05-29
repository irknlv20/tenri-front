"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Upload, Eye, CheckCircle, Clock } from "lucide-react"
import { DocumentsService, type StoredDocument } from "@/lib/localStorage"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<StoredDocument[]>([])
  const [requiredDocuments, setRequiredDocuments] = useState<StoredDocument[]>([])
  const [uploadedDocuments, setUploadedDocuments] = useState<StoredDocument[]>([])
  const [signedDocuments, setSignedDocuments] = useState<StoredDocument[]>([])

  const searchParams = useSearchParams()

  useEffect(() => {
    const purchaseId = searchParams.get("purchaseId")
    if (purchaseId) {
      loadDocumentsForPurchase(purchaseId)
    } else {
      loadDocuments()
    }
    initializeRequiredDocuments()
  }, [])

  const loadDocumentsForPurchase = (purchaseId: string) => {
    const purchaseDocs = DocumentsService.getByPurchase(purchaseId)
    setDocuments(purchaseDocs)
    setRequiredDocuments(purchaseDocs.filter((doc) => doc.status === "required"))
    setUploadedDocuments(purchaseDocs.filter((doc) => ["uploaded", "verified"].includes(doc.status)))
    setSignedDocuments(purchaseDocs.filter((doc) => doc.status === "signed"))
  }

  const loadDocuments = () => {
    const allDocs = DocumentsService.getAll()
    setDocuments(allDocs)
    setRequiredDocuments(allDocs.filter((doc) => doc.status === "required"))
    setUploadedDocuments(allDocs.filter((doc) => ["uploaded", "verified"].includes(doc.status)))
    setSignedDocuments(allDocs.filter((doc) => doc.status === "signed"))
  }

  const initializeRequiredDocuments = () => {
    const existingDocs = DocumentsService.getAll()
    const purchaseId = searchParams.get("purchaseId")

    // Если документов нет, создаем базовый набор требуемых документов
    if (existingDocs.length === 0 && purchaseId) {
      const requiredDocs = [
        {
          title: "Паспорт гражданина РК",
          type: "passport" as const,
          status: "required" as const,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Скан-копия паспорта (все страницы)",
          purchaseId: purchaseId,
        },
        {
          title: "Справка о доходах",
          type: "income" as const,
          status: "required" as const,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Справка с места работы за последние 6 месяцев",
          purchaseId: purchaseId,
        },
        {
          title: "Справка об отсутствии недвижимости",
          type: "other" as const,
          status: "required" as const,
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          description: "Справка из комитета по управлению земельными ресурсами",
          purchaseId: purchaseId,
        },
      ]

      requiredDocs.forEach((doc) => DocumentsService.add(doc))
      loadDocumentsForPurchase(purchaseId)
    }
  }

  const handleFileUpload = (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Проверяем размер файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Размер файла не должен превышать 10MB")
      return
    }

    // Проверяем тип файла
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Разрешены только файлы PDF, JPG, PNG")
      return
    }

    DocumentsService.uploadDocument(documentId, file)
    toast.success("Документ успешно загружен")
    loadDocuments()
  }

  const handleDownloadTemplate = (document: StoredDocument) => {
    const blob = DocumentsService.generateTemplate(document.type, document.title)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${document.title.replace(/\s+/g, "_")}_template.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Шаблон документа скачан")
  }

  const handleSignDocument = (documentId: string) => {
    DocumentsService.updateStatus(documentId, "signed")
    toast.success("Документ подписан электронной подписью")
    loadDocuments()
  }

  const getStatusColor = (status: StoredDocument["status"]) => {
    switch (status) {
      case "required":
        return "bg-red-500"
      case "uploaded":
        return "bg-blue-500"
      case "verified":
        return "bg-green-500"
      case "signed":
        return "bg-purple-500"
      case "rejected":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: StoredDocument["status"]) => {
    switch (status) {
      case "required":
        return "Требуется"
      case "uploaded":
        return "Загружен"
      case "verified":
        return "Проверен"
      case "signed":
        return "Подписан"
      case "rejected":
        return "Отклонен"
      default:
        return status
    }
  }

  const isDeadlineNear = (deadline?: string) => {
    if (!deadline) return false
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays > 0
  }

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Документы</h2>

        <Tabs defaultValue="required">
          <TabsList className="mb-6">
            <TabsTrigger value="required">Требуется загрузить ({requiredDocuments.length})</TabsTrigger>
            <TabsTrigger value="uploaded">Загруженные ({uploadedDocuments.length})</TabsTrigger>
            <TabsTrigger value="signed">Подписанные ({signedDocuments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="required">
            <div className="space-y-4">
              {requiredDocuments.length > 0 ? (
                  requiredDocuments.map((document) => (
                      <Card key={document.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex items-center gap-3 flex-grow">
                              <div className="bg-muted p-3 rounded-md">
                                <FileText className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium">{document.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{document.description}</p>
                                {document.deadline && (
                                    <div
                                        className={`flex items-center gap-1 text-xs mt-2 ${
                                            isOverdue(document.deadline)
                                                ? "text-red-500"
                                                : isDeadlineNear(document.deadline)
                                                    ? "text-orange-500"
                                                    : "text-muted-foreground"
                                        }`}
                                    >
                                      <Clock className="h-3 w-3" />
                                      <span>
                                Срок: {new Date(document.deadline).toLocaleDateString()}
                                        {isOverdue(document.deadline) && " (просрочен)"}
                                        {isDeadlineNear(document.deadline) &&
                                            !isOverdue(document.deadline) &&
                                            " (скоро истекает)"}
                              </span>
                                    </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto">
                              <Badge className={`${getStatusColor(document.status)} text-white border-0`}>
                                {getStatusText(document.status)}
                              </Badge>

                              <div className="flex gap-2 ml-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadTemplate(document)}
                                    className="gap-1"
                                >
                                  <Download className="h-4 w-4" />
                                  Шаблон
                                </Button>

                                <div className="relative">
                                  <input
                                      type="file"
                                      id={`upload-${document.id}`}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => handleFileUpload(document.id, e)}
                                  />
                                  <Button size="sm" className="gap-1">
                                    <Upload className="h-4 w-4" />
                                    Загрузить
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))
              ) : (
                  <div className="text-center py-8 text-muted-foreground">Все необходимые документы загружены</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="uploaded">
            <div className="space-y-4">
              {uploadedDocuments.map((document) => (
                  <Card key={document.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-center gap-3 flex-grow">
                          <div className="bg-muted p-3 rounded-md">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{document.title}</h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                              {document.fileName && <span>{document.fileName}</span>}
                              {document.fileSize && (
                                  <>
                                    <span>•</span>
                                    <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                  </>
                              )}
                              {document.uploadDate && (
                                  <>
                                    <span>•</span>
                                    <span>Загружен: {new Date(document.uploadDate).toLocaleDateString()}</span>
                                  </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Badge className={`${getStatusColor(document.status)} text-white border-0`}>
                            {getStatusText(document.status)}
                          </Badge>

                          <div className="flex gap-2 ml-auto">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" />
                              Просмотр
                            </Button>

                            {document.status === "verified" && (
                                <Button size="sm" onClick={() => handleSignDocument(document.id)} className="gap-1">
                                  <CheckCircle className="h-4 w-4" />
                                  Подписать
                                </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="signed">
            <div className="space-y-4">
              {signedDocuments.map((document) => (
                  <Card key={document.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-center gap-3 flex-grow">
                          <div className="bg-muted p-3 rounded-md">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{document.title}</h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                              {document.signDate && (
                                  <span>Подписан: {new Date(document.signDate).toLocaleDateString()}</span>
                              )}
                              {document.fileName && (
                                  <>
                                    <span>•</span>
                                    <span>{document.fileName}</span>
                                  </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Badge className={`${getStatusColor(document.status)} text-white border-0`}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {getStatusText(document.status)}
                          </Badge>

                          <div className="flex gap-2 ml-auto">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" />
                              Просмотр
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Download className="h-4 w-4" />
                              Скачать
                            </Button>
                          </div>
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
