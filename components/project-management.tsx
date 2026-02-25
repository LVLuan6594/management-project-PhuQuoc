"use client"

import { useState } from "react"
import { Search, Plus, Edit2, Trash2, MapPin, Calendar, Filter, X } from "lucide-react"
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

interface ProjectManagementProps {
  onSelectProject?: (projectId: number) => void
}

interface Project {
  id: number
  name: string
  code: string
  status: string
  progress: number
  location: string
  investor: string
  startDate: string
  endDate: string
  description?: string
  contractor?: string
  budget?: string
}

const mockProjects: Project[] = [
  {
    id: 1,
    name: "Dự án Cảng Phú Quốc",
    code: "PQ-001",
    status: "Đang triển khai",
    progress: 65,
    location: "Phú Quốc",
    investor: "Bộ Giao thông",
    startDate: "2024-01-15",
    endDate: "2025-12-31",
  },
  {
    id: 2,
    name: "Dự án Sân bay Phú Quốc",
    code: "PQ-002",
    status: "Hoàn thành",
    progress: 100,
    location: "Phú Quốc",
    investor: "Bộ Giao thông",
    startDate: "2023-06-01",
    endDate: "2024-06-30",
  },
  {
    id: 3,
    name: "Dự án Đường cao tốc",
    code: "PQ-003",
    status: "Chậm tiến độ",
    progress: 45,
    location: "Phú Quốc",
    investor: "Bộ Giao thông",
    startDate: "2024-03-01",
    endDate: "2025-09-30",
  },
]

export default function ProjectManagement({ onSelectProject }: ProjectManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [showFilters, setShowFilters] = useState(false)
  const [filterCode, setFilterCode] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterStartDate, setFilterStartDate] = useState("")
  const [filterEndDate, setFilterEndDate] = useState("")
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isEditingOpen, setIsEditingOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "Đang triển khai",
    progress: 0,
    location: "",
    investor: "",
    startDate: "",
    endDate: "",
    description: "",
    contractor: "",
    budget: "",
  })

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCode = !filterCode || p.code.toLowerCase().includes(filterCode.toLowerCase())

    const matchesStatus = !filterStatus || p.status === filterStatus

    const projectStart = new Date(p.startDate)
    const projectEnd = new Date(p.endDate)
    const filterStart = filterStartDate ? new Date(filterStartDate) : null
    const filterEnd = filterEndDate ? new Date(filterEndDate) : null

    const matchesDateRange = (!filterStart || projectStart >= filterStart) && (!filterEnd || projectEnd <= filterEnd)

    return matchesSearch && matchesCode && matchesStatus && matchesDateRange
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang triển khai":
        return "bg-accent text-accent-foreground"
      case "Hoàn thành":
        return "bg-primary text-primary-foreground"
      case "Chậm tiến độ":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleResetFilters = () => {
    setFilterCode("")
    setFilterStatus("")
    setFilterStartDate("")
    setFilterEndDate("")
    setSearchTerm("")
  }

  const handleAddProject = () => {
    if (formData.name && formData.code && formData.location && formData.investor) {
      const newProject: Project = {
        id: Math.max(...projects.map((p) => p.id), 0) + 1,
        name: formData.name,
        code: formData.code,
        status: formData.status,
        progress: formData.progress,
        location: formData.location,
        investor: formData.investor,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        contractor: formData.contractor,
        budget: formData.budget,
      }
      setProjects([...projects, newProject])
      resetForm()
      setIsAddProjectOpen(false)
    }
  }

  const handleUpdateProject = () => {
    if (editingProject && formData.name && formData.code && formData.location && formData.investor) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id
            ? {
                ...p,
                name: formData.name,
                code: formData.code,
                status: formData.status,
                progress: formData.progress,
                location: formData.location,
                investor: formData.investor,
                startDate: formData.startDate,
                endDate: formData.endDate,
                description: formData.description,
                contractor: formData.contractor,
                budget: formData.budget,
              }
            : p,
        ),
      )
      resetForm()
      setEditingProject(null)
      setIsEditingOpen(false)
    }
  }

  const handleDeleteProject = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      setProjects(projects.filter((p) => p.id !== id))
    }
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      code: project.code,
      status: project.status,
      progress: project.progress,
      location: project.location,
      investor: project.investor,
      startDate: project.startDate,
      endDate: project.endDate,
      description: project.description || "",
      contractor: project.contractor || "",
      budget: project.budget || "",
    })
    setIsEditingOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      status: "Đang triển khai",
      progress: 0,
      location: "",
      investor: "",
      startDate: "",
      endDate: "",
      description: "",
      contractor: "",
      budget: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quản lý Dự án</h1>
          <p className="text-muted-foreground">Tra cứu và quản lý thông tin dự án</p>
        </div>
        <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={resetForm}>
              <Plus size={20} />
              Thêm dự án
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm dự án mới</DialogTitle>
              <DialogDescription>Nhập thông tin chi tiết về dự án</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Tên dự án *</label>
                  <Input
                    placeholder="Nhập tên dự án"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Mã dự án *</label>
                  <Input
                    placeholder="Ví dụ: PQ-001"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  >
                    <option value="Đang triển khai">Đang triển khai</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Chậm tiến độ">Chậm tiến độ</option>
                    <option value="Tạm dừng">Tạm dừng</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Tiến độ (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Địa điểm *</label>
                  <Input
                    placeholder="Nhập địa điểm"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Chủ đầu tư *</label>
                  <Input
                    placeholder="Nhập chủ đầu tư"
                    value={formData.investor}
                    onChange={(e) => setFormData({ ...formData, investor: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Ngày bắt đầu</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Ngày kết thúc</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nhà thầu</label>
                <Input
                  placeholder="Nhập tên nhà thầu"
                  value={formData.contractor}
                  onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Ngân sách</label>
                <Input
                  placeholder="Ví dụ: 5,000 tỷ đồng"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Mô tả</label>
                <textarea
                  placeholder="Nhập mô tả dự án"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddProject}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Thêm dự án
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="flex-1 border-border bg-transparent"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="pt-6 space-y-4">
          {/* Main search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <Input
              placeholder="Tìm theo tên hoặc mã dự án..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>

          {/* Filter toggle button */}
          <Button
            variant="outline"
            className="w-full border-border bg-transparent gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            {showFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc nâng cao"}
          </Button>

          {/* Advanced filters */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filter by code */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Mã dự án</label>
                  <Input
                    placeholder="Ví dụ: PQ-001"
                    value={filterCode}
                    onChange={(e) => setFilterCode(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                {/* Filter by status */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Trạng thái</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Đang triển khai">Đang triển khai</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Chậm tiến độ">Chậm tiến độ</option>
                  </select>
                </div>

                {/* Filter by start date */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Từ ngày</label>
                  <Input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                {/* Filter by end date */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Đến ngày</label>
                  <Input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              {/* Reset filters button */}
              <Button variant="outline" className="w-full border-border bg-transparent" onClick={handleResetFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Tìm thấy <span className="font-semibold text-foreground">{filteredProjects.length}</span> dự án
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectProject?.(project.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Mã: {project.code}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Chủ đầu tư</p>
                        <p className="text-sm font-medium text-foreground">{project.investor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Địa điểm</p>
                        <p className="text-sm font-medium text-foreground flex items-center gap-1">
                          <MapPin size={14} />
                          {project.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ngày bắt đầu</p>
                        <p className="text-sm font-medium text-foreground flex items-center gap-1">
                          <Calendar size={14} />
                          {project.startDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dự kiến kết thúc</p>
                        <p className="text-sm font-medium text-foreground flex items-center gap-1">
                          <Calendar size={14} />
                          {project.endDate}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-muted-foreground">Tiến độ</p>
                        <p className="text-sm font-medium text-foreground">{project.progress}%</p>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog open={isEditingOpen} onOpenChange={setIsEditingOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-border bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditDialog(project)
                          }}
                        >
                          <Edit2 size={18} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Chỉnh sửa dự án</DialogTitle>
                          <DialogDescription>Cập nhật thông tin dự án</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1 block">Tên dự án *</label>
                              <Input
                                placeholder="Nhập tên dự án"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-background border-border"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1 block">Mã dự án *</label>
                              <Input
                                placeholder="Ví dụ: PQ-001"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="bg-background border-border"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1 block">Trạng thái</label>
                              <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                              >
                                <option value="Đang triển khai">Đang triển khai</option>
                                <option value="Hoàn thành">Hoàn thành</option>
                                <option value="Chậm tiến độ">Chậm tiến độ</option>
                                <option value="Tạm dừng">Tạm dừng</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1 block">Tiến độ (%)</label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.progress}
                                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                                className="bg-background border-border"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1 block">Địa điểm *</label>
                              <Input
                                placeholder="Nhập địa điểm"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="bg-background border-border"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1 block">Chủ đầu tư *</label>
                              <Input
                                placeholder="Nhập chủ đầu tư"
                                value={formData.investor}
                                onChange={(e) => setFormData({ ...formData, investor: e.target.value })}
                                className="bg-background border-border"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1 block">Ngày bắt đầu</label>
                              <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="bg-background border-border"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1 block">Ngày kết thúc</label>
                              <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="bg-background border-border"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground mb-1 block">Nhà thầu</label>
                            <Input
                              placeholder="Nhập tên nhà thầu"
                              value={formData.contractor}
                              onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                              className="bg-background border-border"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground mb-1 block">Ngân sách</label>
                            <Input
                              placeholder="Ví dụ: 5,000 tỷ đồng"
                              value={formData.budget}
                              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                              className="bg-background border-border"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground mb-1 block">Mô tả</label>
                            <textarea
                              placeholder="Nhập mô tả dự án"
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleUpdateProject}
                              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              Cập nhật
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditingOpen(false)}
                              className="flex-1 border-border bg-transparent"
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border bg-transparent hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProject(project.id)
                      }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Không tìm thấy dự án phù hợp với bộ lọc của bạn</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
