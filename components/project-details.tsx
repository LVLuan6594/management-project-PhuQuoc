"use client"

import { useMemo, useState, useEffect } from "react"
import {
  ArrowLeft,
  FileText,
  Download,
  Upload,
  Trash2,
  Folder,
  Plus,
  CheckCircle2,
  Circle,
  ChevronRight,
  Eye,
  Edit2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSubProcess } from "@/hooks/use-subprocess"
import { getProjectById, Project } from "@/lib/mock-projects"

const defaultProjectDetails: Project = {
  id: 0,
  name: "Dự án chưa chọn",
  code: "N/A",
  status: "Đang cập nhật",
  progress: 0,
  location: "Chưa xác định",
  investor: "Chưa xác định",
  startDate: "",
  endDate: "",
  description: "Chọn dự án để xem thông tin chi tiết.",
  budget: "",
  contractor: "",
}

// Document folders structure
const documentFolders = [
  {
    id: 1,
    name: "Quyết định",
    icon: "📋",
    description: "Các quyết định phê duyệt dự án",
    documents: [
      { id: 1, name: "Quyết định phê duyệt dự án", type: "PDF", size: "2.4 MB", date: "2024-01-15" },
      { id: 2, name: "Quyết định điều chỉnh vốn", type: "PDF", size: "1.8 MB", date: "2024-06-20" },
    ],
  },
  {
    id: 2,
    name: "Nghị định",
    icon: "📜",
    description: "Các nghị định liên quan",
    documents: [
      { id: 3, name: "Nghị định 98/2014/NĐ-CP", type: "PDF", size: "3.2 MB", date: "2024-02-10" },
      { id: 4, name: "Nghị định 63/2018/NĐ-CP", type: "PDF", size: "2.1 MB", date: "2024-03-15" },
    ],
  },
  {
    id: 3,
    name: "Pháp lý",
    icon: "⚖️",
    description: "Tài liệu pháp lý và hợp đồng",
    documents: [
      { id: 5, name: "Hợp đồng thi công", type: "DOCX", size: "1.5 MB", date: "2024-01-20" },
      { id: 6, name: "Giấy phép xây dựng", type: "PDF", size: "0.8 MB", date: "2024-01-25" },
      { id: 7, name: "Bảo hiểm dự án", type: "PDF", size: "2.3 MB", date: "2024-02-01" },
    ],
  },
  {
    id: 4,
    name: "Tài chính",
    icon: "💰",
    description: "Báo cáo tài chính và chi phí",
    documents: [
      { id: 8, name: "Báo cáo tài chính Q1", type: "XLSX", size: "0.9 MB", date: "2024-04-15" },
      { id: 9, name: "Báo cáo tài chính Q2", type: "XLSX", size: "1.1 MB", date: "2024-07-15" },
      { id: 10, name: "Dự toán chi phí", type: "XLSX", size: "2.5 MB", date: "2024-01-10" },
    ],
  },
  {
    id: 5,
    name: "Thiết kế & Bản vẽ",
    icon: "🎨",
    description: "Bản vẽ thiết kế và tài liệu kỹ thuật",
    documents: [
      { id: 11, name: "Bản vẽ tổng thể", type: "DWG", size: "15.8 MB", date: "2024-02-20" },
      { id: 12, name: "Bản vẽ chi tiết", type: "PDF", size: "8.4 MB", date: "2024-03-01" },
    ],
  },
  {
    id: 6,
    name: "Báo cáo & Thống kê",
    icon: "📊",
    description: "Báo cáo tiến độ và thống kê",
    documents: [
      { id: 13, name: "Báo cáo tiến độ tháng 6", type: "PDF", size: "3.5 MB", date: "2024-07-05" },
      { id: 14, name: "Báo cáo an toàn lao động", type: "PDF", size: "2.1 MB", date: "2024-06-30" },
    ],
  },
]

// Generate 16 default workflow stages
const generateDefaultWorkflowStages = () => {
  const stageNames = [
    //Bước 1
    "Xây dựng kế hoạch thu hồi đất",
    //Bước 2
    "Tổ chức họp với người có đất trong khu vực thu hồi",
    //Bước 3
    "Thông báo thu hồi đất và gửi Thông báo thu hồi đất",
    //Bước 4 
    "Vận động, thuyết phục để thực hiện kiểm đếm trong 15 ngày",
    //Bước 5
    "Lập phương án bồi thường, hỗ trợ, tái định cư",
    //Bước 6
    "Niêm yết công khai phương án bồi thường, hỗ trợ, tái định cư",
    //Bước 7 
    "Lấy ý kiến về phương án bồi thường, hỗ trợ, tái định cư",
    //Bước 8
    "Thẩm định phương án bồi thường, hỗ trợ, tái định cư",
    //Bước 9
    "Quyết định phê duyệt phương án bồi thường, hỗ trợ, tái định cư",
    //Bước 10
    "Phổ biến, niêm yết công khai quyết định phê duyệt phương án bồi thường, hỗ trợ, tái định c",
      //Bước 11
    "Gửi phương án bồi thường, hỗ trợ, tái định cư",
    //Bước 12
    "Thực hiện bồi thường, hỗ trợ, bố trí tái định cư",
    //Bước 13
    "Chủ tịch UBND cấp xã ban hành quyết định thu hồi đất theo quy định",
    //Bước 14
    "Giải quyết trường hợp người có đất thu hồi, chủ sở hữu tài sản gắn liền với đất không đồng ý hoặc không phối hợp thực hiện phương án bồi thường, hỗ trợ, tái định cư đã phê duyệt",
    //Bước 15
    "Giải quyết trường hợp người có đất thu hồi, chủ sở hữu tài sản gắn liền với đất, người có quyền lợi và nghĩa vụ liên quan không bàn giao đất cho đơn vị, tổ chức thực hiện nhiệm vụ bồi thường, hỗ trợ, tái định cư",
    //Bước 16
    "Quản lý đất đã được thu hồi"
  ]

  const subProcessesByStage = {
    1: [
      { name: "Khảo sát địa hình", content: "Thực hiện khảo sát địa hình chi tiết khu vực dự án" },
      { name: "Lập kế hoạch tổng thể", content: "Xây dựng kế hoạch quản lý và triển khai dự án" },
      { name: "Phân tích môi trường", content: "Đánh giá tác động môi trường của dự án" },
    ],
    2: [
      { name: "Thiết kế kiến trúc", content: "Thiết kế kiến trúc tổng thể công trình" },
      { name: "Thiết kế kỹ thuật", content: "Thiết kế các hệ thống kỹ thuật chi tiết" },
      { name: "Tính toán tải trọng", content: "Tính toán kỹ thuật tải trọng và độ bền" },
      { name: "Lập dự toán", content: "Lập dự toán chi phí xây dựng" },
    ],
    3: [
      { name: "Chuẩn bị hiện trường", content: "Chuẩn bị và thu dọn hiện trường xây dựng" },
      { name: "Triển khai công nhân", content: "Tuyển dụng và huấn luyện đội ngũ thi công" },
      { name: "Chuẩn bị vật liệu", content: "Thu mua và vận chuyển vật liệu xây dựng" },
      { name: "Lắp đặt công trình tạm", content: "Lắp đặt công trình tạm thời cần thiết" },
    ],
    4: [
      { name: "Đào móng", content: "Đào móng và xây dựng công trình ngầm" },
      { name: "Xây móng cọc", content: "Xây dựng và nhấn cọc nếu cần" },
      { name: "Thi công tường ngoài", content: "Xây tường bao bên ngoài" },
    ],
    5: [
      { name: "Cốt thép kết cấu", content: "Gia công và lắp đặt cốt thép kết cấu" },
      { name: "Đổ bê tông", content: "Đổ bê tông các phần kết cấu chính" },
      { name: "Xây tường", content: "Xây các tường chia cách trong" },
      { name: "Lắp mái", content: "Lắp đặt hệ thống mái che" },
    ],
    6: [
      { name: "Lắp đặt khung sắt", content: "Lắp đặt các khung sắt và thiết bị cơ học" },
      { name: "Cải tạo hệ thống", content: "Cải tạo hệ thống thông gió và khí hóa" },
      { name: "Lắp đặt thiết bị hoạt động", content: "Lắp đặt các thiết bị máy móc chính" },
    ],
    7: [
      { name: "Xác định tuyến đường", content: "Xác định tuyến đường và điểm lắp đặt" },
      { name: "Lắp đặt cáp điện", content: "Lắp đặt các tuyến cáp điện chính" },
      { name: "Lắp đặt tủ điện", content: "Lắp đặt tủ điện và thiết bị điều khiển" },
      { name: "Nối kết điện", content: "Nối kết điện và kiểm tra điện áp" },
    ],
    8: [
      { name: "Xác định tuyến ống", content: "Xác định tuyến ống nước và xử lý nước" },
      { name: "Lắp đặt ống nước", content: "Lắp đặt hệ thống ống nước toàn bộ" },
      { name: "Lắp đặt bơm nước", content: "Lắp đặt hệ thống bơm và lọc nước" },
      { name: "Thử áp suất nước", content: "Thử nghiệm áp suất và chất lượng nước" },
    ],
    9: [
      { name: "Nhập kho thiết bị", content: "Tiếp nhận và kiểm tra thiết bị nhập khẩu" },
      { name: "Lắp đặt máy móc", content: "Lắp đặt các máy móc chính theo bản vẽ" },
      { name: "Nối kết hệ thống", content: "Nối kết các hệ thống máy móc với nhau" },
    ],
    10: [
      { name: "Kiểm tra kết cấu", content: "Kiểm tra chất lượng và độ bền kết cấu" },
      { name: "Kiểm tra hệ thống", content: "Kiểm tra các hệ thống điện nước cơ khí" },
      { name: "Kiểm tra an toàn", content: "Kiểm tra các thiết bị an toàn và phòng cháy" },
    ],
    11: [
      { name: "Vận hành thử", content: "Vận hành thử các hệ thống với tải nhẹ" },
      { name: "Vận hành tải đầy", content: "Vận hành với tải đầy độ để kiểm tra" },
      { name: "Ghi nhận dữ liệu", content: "Ghi nhận dữ liệu vận hành và hiệu suất" },
    ],
    12: [
      { name: "Huấn luyện lý thuyết", content: "Đào tạo kiến thức lý thuyết cho đội vận hành" },
      { name: "Huấn luyện thực hành", content: "Đào tạo kỹ năng vận hành thực tế" },
      { name: "Trao bằng chứng chỉ", content: "Cấp chứng chỉ vận hành cho nhân viên" },
    ],
    13: [
      { name: "Soạn tài liệu kỹ thuật", content: "Soạn thảo tài liệu kỹ thuật hoàn thiện" },
      { name: "Soạn hướng dẫn vận hành", content: "Lập hướng dẫn vận hành chi tiết" },
      { name: "Giao hạn chế quyền", content: "Chuyên giao toàn bộ tài liệu cho chủ đầu tư" },
    ],
    14: [
      { name: "Lập lịch bảo dưỡng", content: "Xây dựng kế hoạch bảo dưỡng định kỳ" },
      { name: "Bảo dưỡng định kỳ", content: "Thực hiện các công việc bảo dưỡng theo lịch" },
      { name: "Sửa chữa sự cố", content: "Xử lý các sự cố phát sinh trong vận hành" },
    ],
    15: [
      { name: "Giám sát hiệu suất", content: "Giám sát hiệu suất vận hành sau chuyên giao" },
      { name: "Kiểm tra tuân thủ", content: "Kiểm tra tuân thủ các quy định an toàn" },
      { name: "Ghi nhận sự cố", content: "Ghi nhận và báo cáo các sự cố phát sinh" },
    ],
    16: [
      { name: "Hoàn thành dự án", content: "Hoàn thành tất cả các công việc còn lại" },
      { name: "Xác nhận bàn giao", content: "Xác nhận bàn giao chính thức cho chủ đầu tư" },
      { name: "Lập báo cáo kết thúc", content: "Lập báo cáo tổng kết dự án hoàn thành" },
    ],
  }

  return Array.from({ length: 16 }, (_, index) => {
    const stageId = index + 1
    const subProcs = subProcessesByStage[stageId as keyof typeof subProcessesByStage] || []
    
    return {
      id: stageId,
      name: stageNames[index],
      description: "Mô tả tiến trình thực hiện",
      status: "pending",
      progress: 0,
      subProcesses: subProcs.map((sp, idx) => ({
        id: idx + 1,
        name: sp.name,
        content: sp.content,
        progressReport: "",
        executionTime: "",
      })) as Array<{
        id: number
        name: string
        content: string
        progressReport: string
        executionTime: string
      }>,
      documents: [],
    }
  })
}

const workflowStages = generateDefaultWorkflowStages()

interface ProjectDetailsProps {
  projectId?: number
  onBack?: () => void
}

export default function ProjectDetails({ projectId, onBack }: ProjectDetailsProps) {
  const [selectedFolder, setSelectedFolder] = useState(documentFolders[0])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadFileName, setUploadFileName] = useState("")
  const [expandedStage, setExpandedStage] = useState<number | null>(null)
  const [stages, setStages] = useState<any[]>(generateDefaultWorkflowStages())
  const [stageDocuments, setStageDocuments] = useState<Record<number, any[]>>(
    generateDefaultWorkflowStages().reduce(
      (acc, stage) => {
        acc[stage.id] = stage.documents || []
        return acc
      },
      {} as Record<number, any[]>,
    ),
  )
  const [selectedStageForUpload, setSelectedStageForUpload] = useState<number | null>(null)
  const [documentPreview, setDocumentPreview] = useState<any>(null)
  const [isAddStageOpen, setIsAddStageOpen] = useState(false)
  const [isEditStageOpen, setIsEditStageOpen] = useState(false)
  const [editingStageId, setEditingStageId] = useState<number | null>(null)
  const [stageForm, setStageForm] = useState({
    name: "",
    description: "",
  })

  const project = useMemo(() => getProjectById(projectId) ?? defaultProjectDetails, [projectId])

  // Use custom hook for sub-process management
  const {
    subProcesses,
    selectedStageForSubProcess,
    setSelectedStageForSubProcess,
    subProcessForm,
    setSubProcessForm,
    isAddSubProcessOpen,
    setIsAddSubProcessOpen,
    expandedSubProcess,
    setExpandedSubProcess,
    deleteSubProcess,
    updateSubProcess,
    handleAddSubProcess: onAddSubProcess,
    initializeWithStages,
  } = useSubProcess()

  // Initialize sub-processes when stages are loaded
  useEffect(() => {
    initializeWithStages(stages)
  }, [])

  const handleUploadDocument = () => {
    if (uploadFileName && selectedStageForUpload) {
      const newDoc = {
        id: Math.random(),
        name: uploadFileName,
        type: uploadFileName.split(".").pop()?.toUpperCase() || "PDF",
        size: "1.2 MB",
        date: new Date().toISOString().split("T")[0],
        reviewed: false,
      }
      setStageDocuments((prev) => ({
        ...prev,
        [selectedStageForUpload]: [...(prev[selectedStageForUpload] || []), newDoc],
      }))
      setUploadFileName("")
      setIsUploadOpen(false)
    }
  }

  const handleDeleteDocument = (stageId: number, docId: number) => {
    setStageDocuments((prev) => ({
      ...prev,
      [stageId]: prev[stageId].filter((doc) => doc.id !== docId),
    }))
  }

  // Handle adding new sub-process
  const handleAddSubProcess = () => {
    if (selectedStageForSubProcess !== null) {
      onAddSubProcess()
    }
  }

  const handleDeleteSubProcess = (stageId: number, subProcessId: string | number) => {
    deleteSubProcess(stageId, subProcessId)
  }

  const handleUpdateSubProcess = (
    stageId: number,
    subProcessId: string | number,
    field: string,
    value: string,
  ) => {
    updateSubProcess(stageId, subProcessId, field as any, value)
  }

  const handleAddStage = () => {
    if (stageForm.name) {
      const newStage = {
        id: Math.max(...stages.map((s) => s.id), 0) + 1,
        name: stageForm.name,
        description: stageForm.description,
        status: "pending",
        progress: 0,
        subProcesses: [],
        documents: [],
      }
      setStages([...stages, newStage])
      if (!subProcesses[newStage.id]) {
        setSubProcesses((prev) => ({
          ...prev,
          [newStage.id]: [],
        }))
      }
      if (!stageDocuments[newStage.id]) {
        setStageDocuments((prev) => ({
          ...prev,
          [newStage.id]: [],
        }))
      }
      setStageForm({ name: "", description: "" })
      setIsAddStageOpen(false)
    }
  }

  const handleUpdateStage = () => {
    if (editingStageId && stageForm.name) {
      setStages(
        stages.map((s) =>
          s.id === editingStageId
            ? { ...s, name: stageForm.name, description: stageForm.description }
            : s,
        ),
      )
      setStageForm({ name: "", description: "" })
      setEditingStageId(null)
      setIsEditStageOpen(false)
    }
  }

  // const handleDeleteStage = (id: number) => {
  //   if (confirm("Bạn có chắc chắn muốn xóa tiến trình này? Tất cả quy trình con và tài liệu liên quan sẽ bị xóa.")) {
  //     setStages(stages.filter((s) => s.id !== id))
  //     setSubProcesses((prev) => {
  //       const newSubProcesses = { ...prev }
  //       delete newSubProcesses[id]
  //       return newSubProcesses
  //     })
  //     setStageDocuments((prev) => {
  //       const newDocs = { ...prev }
  //       delete newDocs[id]
  //       return newDocs
  //     })
  //     if (expandedStage === id) {
  //       setExpandedStage(null)
  //     }
  //   }
  // }

  const openEditStageDialog = (stage: any) => {
    setEditingStageId(stage.id)
    setStageForm({
      name: stage.name,
      description: stage.description,
    })
    setIsEditStageOpen(true)
  }

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary text-primary-foreground"
      case "in-progress":
        return "bg-accent text-accent-foreground"
      case "pending":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={18} className="text-primary" />
      case "in-progress":
        return <Circle size={18} className="text-accent fill-accent" />
      case "pending":
        return <Circle size={18} className="text-muted-foreground" />
      default:
        return <Circle size={18} className="text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="outline" size="icon" onClick={onBack} className="border-border bg-transparent">
              <ArrowLeft size={20} />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
            <p className="text-muted-foreground">Mã dự án: {project.code}</p>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Trạng thái</p>
            <p className="text-lg font-semibold text-primary">{project.status}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Tiến độ</p>
            <p className="text-lg font-semibold text-accent">{project.progress}%</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Chủ đầu tư</p>
            <p className="text-sm font-semibold text-foreground">{project.investor}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Ngân sách</p>
            <p className="text-sm font-semibold text-foreground">{project.budget}</p>
          </CardContent>
        </Card>
      </div>

      {/* Project Information */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Thông tin dự án</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Mô tả</p>
              <p className="text-foreground">{project.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nhà thầu</p>
              <p className="text-foreground">{project.contractor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ngày bắt đầu</p>
              <p className="text-foreground">{project.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dự kiến kết thúc</p>
              <p className="text-foreground">{project.endDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Section */}
      <div className="space-y-4">
        <h1 className="font-bold text-foreground">16 bước thực hiện thu hồi đất phục vụ quốc phòng, an ninh, phát triển KT-XH theo Luật Đất đai 2024 và các Nghị định liên quan</h1>
        {/* <div className="flex items-center justify-between">
          <Dialog open={isAddStageOpen} onOpenChange={setIsAddStageOpen}>
            Mặc định chỉ có 16 bước theo quy định của Luật đất đai, tuy nhiên bạn có thể thêm các tiến trình phụ trong từng bước lớn nếu cần thiết để quản lý dự án hiệu quả hơn.
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                onClick={() => setStageForm({ name: "", description: "" })}
              >
                <Plus size={14} />
                Thêm tiến trình
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Thêm tiến trình mới</DialogTitle>
                <DialogDescription>Tạo một tiến trình mới cho dự án</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Tên tiến trình *</label>
                  <Input
                    placeholder="Ví dụ: Tiến trình 17"
                    value={stageForm.name}
                    onChange={(e) => setStageForm({ ...stageForm, name: e.target.value })}
                    className="mt-1 bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Mô tả</label>
                  <textarea
                    placeholder="Nhập mô tả tiến trình"
                    value={stageForm.description}
                    onChange={(e) => setStageForm({ ...stageForm, description: e.target.value })}
                    className="mt-1 bg-background border border-border rounded-md p-2 text-sm text-foreground w-full"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddStage}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Thêm tiến trình
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddStageOpen(false)}
                    className="flex-1 border-border bg-transparent"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div> */}
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <Card key={stage.id} className="bg-card border-border">
              <CardContent className="pt-6">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                  onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedStage(expandedStage === stage.id ? null : stage.id) }}
                  className="w-full text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-sm font-semibold text-foreground">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{stage.name}</h3>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 mb-3">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${stage.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">{stage.progress}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStageStatusColor(stage.status)}`}
                        >
                          {stage.status === "completed"
                            ? "Hoàn thành"
                            : stage.status === "in-progress"
                              ? "Đang thực hiện"
                              : "Chưa bắt đầu"}
                        </span>
                        {stage.completedDate && (
                          <span className="text-xs text-muted-foreground">Hoàn thành: {stage.completedDate}</span>
                        )}
                        {stage.startDate && stage.status !== "completed" && (
                          <span className="text-xs text-muted-foreground">Bắt đầu: {stage.startDate}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {/* <Dialog open={isEditStageOpen && editingStageId === stage.id} onOpenChange={setIsEditStageOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-border bg-transparent h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditStageDialog(stage)
                            }}
                          >
                            <Edit2 size={14} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                          <DialogHeader>
                            <DialogTitle>Chỉnh sửa tiến trình</DialogTitle>
                            <DialogDescription>Cập nhật thông tin tiến trình</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-foreground">Tên tiến trình *</label>
                              <Input
                                placeholder="Ví dụ: Tiến trình 1"
                                value={stageForm.name}
                                onChange={(e) => setStageForm({ ...stageForm, name: e.target.value })}
                                className="mt-1 bg-background border-border"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">Mô tả</label>
                              <textarea
                                placeholder="Nhập mô tả tiến trình"
                                value={stageForm.description}
                                onChange={(e) =>
                                  setStageForm({ ...stageForm, description: e.target.value })
                                }
                                className="mt-1 bg-background border border-border rounded-md p-2 text-sm text-foreground w-full"
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={handleUpdateStage}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                Cập nhật
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setIsEditStageOpen(false)}
                                className="flex-1 border-border bg-transparent"
                              >
                                Hủy
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog> */}
                      {/* <Button
                        variant="outline"
                        size="icon"
                        className="border-border bg-transparent h-8 w-8 hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteStage(stage.id)
                        }}
                      >
                        <Trash2 size={14} />
                      </Button> */}
                    </div>
                    {/* <ChevronRight
                      size={20}
                      className={`text-muted-foreground transition-transform ${
                        expandedStage === stage.id ? "rotate-90" : ""
                      }`}
                    /> */}
                  </div>
                </div>

                {expandedStage === stage.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    {/* Sub-processes Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground text-sm">Quy trình con</h4>
                        <Dialog
                          open={isAddSubProcessOpen && selectedStageForSubProcess === stage.id}
                          onOpenChange={(open) => {
                            setIsAddSubProcessOpen(open)
                            if (open) setSelectedStageForSubProcess(stage.id)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                              onClick={() => setSelectedStageForSubProcess(stage.id)}
                            >
                              <Plus size={14} />
                              Thêm quy trình
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border max-w-md">
                            <DialogHeader>
                              <DialogTitle>Thêm quy trình con</DialogTitle>
                              <DialogDescription>
                                Thêm quy trình con mới cho "{stage.name}"
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-foreground">
                                  Tên quy trình
                                </label>
                                <Input
                                  placeholder="Nhập tên quy trình"
                                  value={subProcessForm.name}
                                  onChange={(e) =>
                                    setSubProcessForm({
                                      ...subProcessForm,
                                      name: e.target.value,
                                    })
                                  }
                                  className="mt-1 bg-background border-border"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-foreground">
                                  Nội dung quy trình
                                </label>
                                <textarea
                                  placeholder="Nhập nội dung chi tiết"
                                  value={subProcessForm.content}
                                  onChange={(e) =>
                                    setSubProcessForm({
                                      ...subProcessForm,
                                      content: e.target.value,
                                    })
                                  }
                                  className="mt-1 bg-background border border-border rounded-md p-2 text-sm text-foreground w-full"
                                  rows={3}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-foreground">
                                  Báo cáo tiến độ
                                </label>
                                <Input
                                  placeholder="Ví dụ: 50% hoàn thành"
                                  value={subProcessForm.progressReport}
                                  onChange={(e) =>
                                    setSubProcessForm({
                                      ...subProcessForm,
                                      progressReport: e.target.value,
                                    })
                                  }
                                  className="mt-1 bg-background border-border"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-foreground">
                                  Thời gian thực hiện
                                </label>
                                <Input
                                  type="datetime-local"
                                  value={subProcessForm.executionTime}
                                  onChange={(e) =>
                                    setSubProcessForm({
                                      ...subProcessForm,
                                      executionTime: e.target.value,
                                    })
                                  }
                                  className="mt-1 bg-background border-border"
                                />
                              </div>
                              <Button
                                onClick={handleAddSubProcess}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                Thêm quy trình
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {subProcesses[stage.id] && subProcesses[stage.id].length > 0 ? (
                        <div className="space-y-3">
                          {subProcesses[stage.id].map((subProcess) => (
                            <div
                              key={subProcess.id}
                              className="border border-border rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() =>
                                  setExpandedSubProcess(
                                    expandedSubProcess === `${stage.id}-${subProcess.id}`
                                      ? null
                                      : `${stage.id}-${subProcess.id}`,
                                  )
                                }
                                className="w-full text-left p-3 hover:bg-secondary/50 transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium text-foreground text-sm">
                                      {subProcess.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {subProcess.progressReport || "Chưa có báo cáo"}
                                    </p>
                                  </div>
                                  <ChevronRight
                                    size={18}
                                    className={`text-muted-foreground transition-transform flex-shrink-0 ${
                                      expandedSubProcess === `${stage.id}-${subProcess.id}`
                                        ? "rotate-90"
                                        : ""
                                    }`}
                                  />
                                </div>
                              </button>

                              {expandedSubProcess === `${stage.id}-${subProcess.id}` && (
                                <div className="p-3 border-t border-border space-y-3 bg-secondary/20">
                                  <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                      NỘI DUNG QUY TRÌNH
                                    </p>
                                    <textarea
                                      value={subProcess.content}
                                      onChange={(e) =>
                                        handleUpdateSubProcess(
                                          stage.id,
                                          subProcess.id,
                                          "content",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full text-xs p-2 bg-background border border-border rounded text-foreground"
                                      rows={3}
                                    />
                                  </div>

                                  <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                      BÁO CÁO TIẾN ĐỘ
                                    </p>
                                    <Input
                                      value={subProcess.progressReport}
                                      onChange={(e) =>
                                        handleUpdateSubProcess(
                                          stage.id,
                                          subProcess.id,
                                          "progressReport",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Ví dụ: 75% hoàn thành"
                                      className="text-xs bg-background border-border"
                                    />
                                  </div>

                                  <div>
                                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                                      THỜI GIAN THỰC HIỆN
                                    </p>
                                    <Input
                                      type="datetime-local"
                                      value={subProcess.executionTime}
                                      onChange={(e) =>
                                        handleUpdateSubProcess(
                                          stage.id,
                                          subProcess.id,
                                          "executionTime",
                                          e.target.value,
                                        )
                                      }
                                      className="text-xs bg-background border-border"
                                    />
                                  </div>

                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                      handleDeleteSubProcess(stage.id, subProcess.id)
                                    }
                                  >
                                    Xóa quy trình
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-3 bg-secondary/20 rounded">
                          Chưa có quy trình con. Nhấp "Thêm quy trình" để thêm.
                        </p>
                      )}
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground text-sm">Tài liệu liên quan</h4>
                        <Dialog
                          open={isUploadOpen && selectedStageForUpload === stage.id}
                          onOpenChange={(open) => {
                            setIsUploadOpen(open)
                            if (open) setSelectedStageForUpload(stage.id)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                              onClick={() => setSelectedStageForUpload(stage.id)}
                            >
                              <Plus size={14} />
                              Thêm
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle>Thêm tài liệu cho "{stage.name}"</DialogTitle>
                              <DialogDescription>Tải lên tài liệu liên quan đến giai đoạn này</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-foreground">Tên tài liệu</label>
                                <Input
                                  placeholder="Nhập tên tài liệu"
                                  value={uploadFileName}
                                  onChange={(e) => setUploadFileName(e.target.value)}
                                  className="mt-1 bg-background border-border"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-foreground">Chọn file</label>
                                <div className="mt-1 p-4 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:bg-secondary transition-colors">
                                  <FileText className="mx-auto mb-2 text-muted-foreground" size={24} />
                                  <p className="text-sm text-muted-foreground">Kéo file vào đây hoặc nhấp để chọn</p>
                                </div>
                              </div>
                              <Button
                                onClick={handleUploadDocument}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                Tải lên
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {stageDocuments[stage.id] && stageDocuments[stage.id].length > 0 ? (
                        <div className="space-y-2">
                          {stageDocuments[stage.id].map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FileText size={16} className="text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {doc.type} • {doc.size} • {doc.date}
                                  </p>
                                </div>
                                {doc.reviewed && (
                                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded flex-shrink-0">
                                    Đã review
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                  onClick={() => setDocumentPreview(doc)}
                                >
                                  <Eye size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                >
                                  <Download size={14} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDeleteDocument(stage.id, doc.id)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">Chưa có tài liệu</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Hồ sơ & Tài liệu</h2>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Upload size={18} />
                Tải lên tài liệu
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Tải lên tài liệu</DialogTitle>
                <DialogDescription>Thêm tài liệu mới vào thư mục "{selectedFolder.name}"</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Tên tài liệu</label>
                  <Input
                    placeholder="Nhập tên tài liệu"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    className="mt-1 bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Chọn file</label>
                  <div className="mt-1 p-4 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:bg-secondary transition-colors">
                    <FileText className="mx-auto mb-2 text-muted-foreground" size={24} />
                    <p className="text-sm text-muted-foreground">Kéo file vào đây hoặc nhấp để chọn</p>
                  </div>
                </div>
                <Button
                  onClick={handleUploadDocument}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Tải lên
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Folder Tabs */}
        <Tabs
          defaultValue={selectedFolder.id.toString()}
          onValueChange={(value) => {
            const folder = documentFolders.find((f) => f.id.toString() === value)
            if (folder) setSelectedFolder(folder)
          }}
          className="space-y-4"
        >
          <TabsList className="bg-secondary flex flex-wrap h-auto gap-2 p-2">
            {documentFolders.map((folder) => (
              <TabsTrigger key={folder.id} value={folder.id.toString()} className="text-sm">
                <span className="mr-2">{folder.icon}</span>
                {folder.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {documentFolders.map((folder) => (
            <TabsContent key={folder.id} value={folder.id.toString()}>
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">{folder.icon}</span>
                        {folder.name}
                      </CardTitle>
                      <CardDescription>{folder.description}</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                      onClick={() => setIsUploadOpen(true)}
                    >
                      <Plus size={16} />
                      Thêm
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {folder.documents.length > 0 ? (
                      folder.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 bg-background rounded">
                              <FileText className="text-primary" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.type} • {doc.size} • {doc.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                              <Download size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Folder className="mx-auto mb-2 text-muted-foreground" size={32} />
                        <p className="text-muted-foreground">Chưa có tài liệu trong thư mục này</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
