"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Download, Trash2, Eye, File, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface UploadedDocument {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  uploadedBy: string
  status: "completed" | "uploading" | "failed"
  progress?: number
  category: string
}

interface DocumentUploadProps {
  category?: string
  onUploadComplete?: (document: UploadedDocument) => void
}

export default function DocumentUpload({ category = "Tài liệu chung", onUploadComplete }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([
    {
      id: "1",
      name: "Quyết định phê duyệt dự án.pdf",
      type: "PDF",
      size: 2400000,
      uploadDate: "2024-01-15",
      uploadedBy: "Nguyễn Văn A",
      status: "completed",
      category: "Quyết định",
    },
    {
      id: "2",
      name: "Hợp đồng thi công.docx",
      type: "DOCX",
      size: 1500000,
      uploadDate: "2024-01-20",
      uploadedBy: "Trần Thị B",
      status: "completed",
      category: "Pháp lý",
    },
    {
      id: "3",
      name: "Báo cáo tài chính Q2.xlsx",
      type: "XLSX",
      size: 1100000,
      uploadDate: "2024-07-15",
      uploadedBy: "Lê Văn C",
      status: "completed",
      category: "Tài chính",
    },
  ])

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadingFile, setUploadingFile] = useState<UploadedDocument | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFileName(file.name)
    }
  }

  // Simulate file upload
  const handleUpload = async () => {
    if (!selectedFile || !fileName) return

    const newDoc: UploadedDocument = {
      id: Date.now().toString(),
      name: fileName,
      type: selectedFile.name.split(".").pop()?.toUpperCase() || "FILE",
      size: selectedFile.size,
      uploadDate: new Date().toISOString().split("T")[0],
      uploadedBy: "Người dùng hiện tại",
      status: "uploading",
      progress: 0,
      category: category,
    }

    setUploadingFile(newDoc)
    setDocuments((prev) => [...prev, newDoc])

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setUploadingFile((prev) => (prev ? { ...prev, progress: i } : null))
      setDocuments((prev) => prev.map((doc) => (doc.id === newDoc.id ? { ...doc, progress: i } : doc)))
    }

    // Complete upload
    setUploadingFile(null)
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === newDoc.id ? { ...doc, status: "completed", progress: undefined } : doc)),
    )

    onUploadComplete?.(newDoc)
    setSelectedFile(null)
    setFileName("")
    setIsUploadOpen(false)

    console.log("[v0] Document uploaded successfully:", fileName)
  }

  // Handle download
  const handleDownload = (doc: UploadedDocument) => {
    console.log("[v0] Downloading document:", doc.name)
    // Simulate download
    const element = document.createElement("a")
    element.setAttribute("href", "#")
    element.setAttribute("download", doc.name)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Handle delete
  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    console.log("[v0] Document deleted:", id)
  }

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return "📄"
      case "DOCX":
      case "DOC":
        return "📝"
      case "XLSX":
      case "XLS":
        return "📊"
      case "DWG":
        return "🎨"
      case "JPG":
      case "PNG":
      case "JPEG":
        return "🖼️"
      default:
        return "📎"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý Tài liệu</h1>
          <p className="text-muted-foreground">
            Upload, download và quản lý các tài liệu dự án (PDF, Word, Excel, scan)
          </p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Upload size={20} />
              Tải lên tài liệu
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle>Tải lên tài liệu mới</DialogTitle>
              <DialogDescription>Hỗ trợ: PDF, Word, Excel, DWG, hình ảnh scan (tối đa 50MB)</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Tên tài liệu</label>
                <Input
                  placeholder="Nhập tên tài liệu"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="mt-1 bg-background border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Chọn file</label>
                <label className="mt-2 flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Nhấp để chọn</span> hoặc kéo file vào
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, DWG, JPG, PNG</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.jpg,.jpeg,.png,.gif"
                  />
                </label>
                {selectedFile && (
                  <div className="mt-2 p-2 bg-secondary rounded flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || !fileName}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              >
                <Upload size={16} className="mr-2" />
                Tải lên
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upload Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 flex gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Hỗ trợ các định dạng tài liệu:</p>
            <p>PDF, Word (DOC/DOCX), Excel (XLS/XLSX), AutoCAD (DWG), Hình ảnh scan (JPG/PNG)</p>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Tài liệu đã tải lên</h2>

        {documents.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <File className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">Chưa có tài liệu nào. Hãy tải lên tài liệu đầu tiên.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="bg-card border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl mt-1">{getFileIcon(doc.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground truncate">{doc.name}</p>
                          {doc.status === "uploading" && (
                            <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">Đang tải</span>
                          )}
                          {doc.status === "failed" && (
                            <span className="text-xs px-2 py-1 bg-destructive/20 text-destructive rounded">Lỗi</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                          <span>•</span>
                          <span>{doc.uploadedBy}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 bg-secondary rounded">{doc.category}</span>
                        </div>

                        {/* Upload Progress */}
                        {doc.status === "uploading" && doc.progress !== undefined && (
                          <div className="space-y-1">
                            <Progress value={doc.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">{doc.progress}%</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        title="Xem trước"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => handleDownload(doc)}
                        title="Tải xuống"
                      >
                        <Download size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(doc.id)}
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Tổng tài liệu</p>
            <p className="text-3xl font-bold text-primary">{documents.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Dung lượng sử dụng</p>
            <p className="text-3xl font-bold text-accent">
              {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Tài liệu hoàn thành</p>
            <p className="text-3xl font-bold text-primary">
              {documents.filter((doc) => doc.status === "completed").length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
