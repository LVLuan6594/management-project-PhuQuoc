"use client"
import { useState } from "react"
import { Maximize2, ZoomIn, ZoomOut, Layers, X, ExternalLink, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

// Mock project locations with REAL Phu Quoc coordinates
const projectLocations = [
  {
    id: 1,
    name: "Dự án Cảng Phú Quốc",
    code: "PQ-001",
    lat: 10.1865,
    lng: 103.9854,
    status: "Đang triển khai",
    progress: 65,
    color: "#4CAF50",
    description: "Cảng quốc tế Phú Quốc",
    budget: "500 tỷ đồng",
    startDate: "2023-01-15",
    endDate: "2025-12-31",
  },
  {
    id: 2,
    name: "Dự án Sân bay Phú Quốc",
    code: "PQ-002",
    lat: 10.2167,
    lng: 103.8,
    status: "Hoàn thành",
    progress: 100,
    color: "#2196F3",
    description: "Sân bay quốc tế Phú Quốc",
    budget: "1,200 tỷ đồng",
    startDate: "2018-06-01",
    endDate: "2024-12-15",
  },
  {
    id: 3,
    name: "Dự án Đường cao tốc",
    code: "PQ-003",
    lat: 10.15,
    lng: 103.95,
    status: "Chậm tiến độ",
    progress: 45,
    color: "#FF9800",
    description: "Đường cao tốc Phú Quốc - Kiên Giang",
    budget: "800 tỷ đồng",
    startDate: "2022-03-20",
    endDate: "2025-06-30",
  },
  {
    id: 4,
    name: "Dự án Khu công nghiệp",
    code: "PQ-004",
    lat: 10.12,
    lng: 103.92,
    status: "Đang triển khai",
    progress: 55,
    color: "#4CAF50",
    description: "Khu công nghiệp Phú Quốc",
    budget: "300 tỷ đồng",
    startDate: "2023-09-01",
    endDate: "2025-09-01",
  },
  {
    id: 5,
    name: "Dự án Cấp nước sạch",
    code: "PQ-005",
    lat: 10.22,
    lng: 103.88,
    status: "Hoàn thành",
    progress: 100,
    color: "#2196F3",
    description: "Hệ thống cấp nước sạch Phú Quốc",
    budget: "150 tỷ đồng",
    startDate: "2021-01-10",
    endDate: "2024-06-30",
  },
]

const PHU_QUOC_CENTER = { lat: 10.1865, lng: 103.9854 }

interface GISMapProps {
  onSelectProject?: (projectId: number) => void
}

interface PopupProject {
  id: number
  name: string
  code: string
  status: string
  progress: number
  description: string
  budget: string
  startDate: string
  endDate: string
}

function MapMarker({
  project,
  isSelected,
  onClick,
}: { project: (typeof projectLocations)[0]; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-transform ${isSelected ? "scale-125" : "hover:scale-110"}`}
      style={{
        width: isSelected ? "40px" : "32px",
        height: isSelected ? "40px" : "32px",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-white"
        style={{ backgroundColor: project.color }}
      >
        {project.id}
      </div>
    </div>
  )
}

export default function GISMap({ onSelectProject }: GISMapProps) {
  const [selectedProject, setSelectedProject] = useState<(typeof projectLocations)[0] | null>(null)
  const [popupProject, setPopupProject] = useState<PopupProject | null>(null)
  const [zoom, setZoom] = useState(11)
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [visibleLayers, setVisibleLayers] = useState({
    projects: true,
    infrastructure: true,
    administrative: false,
  })

  const handleSelectProjectFromPopup = () => {
    if (popupProject) {
      onSelectProject?.(popupProject.id)
      setPopupProject(null)
    }
  }

  const toggleLayer = (layerId: string) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }))
  }

  const handleReset = () => {
    setZoom(11)
    setSelectedProject(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Bản đồ GIS Dự án</h1>
        <p className="text-muted-foreground">
          Xem vị trí địa lý các dự án trên bản đồ Phú Quốc (Google Maps Integration)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bản đồ vị trí dự án</CardTitle>
                  <CardDescription>Phú Quốc - Kiên Giang (Google Maps)</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(Math.min(zoom + 1, 18))}
                    className="border-border bg-transparent"
                  >
                    <ZoomIn size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(Math.max(zoom - 1, 8))}
                    className="border-border bg-transparent"
                  >
                    <ZoomOut size={18} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleReset} className="border-border bg-transparent">
                    <Maximize2 size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowLayerPanel(!showLayerPanel)}
                    className="border-border bg-transparent"
                  >
                    <Layers size={18} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div
                  className="relative w-full rounded-lg overflow-hidden border border-border"
                  style={{ height: "500px" }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62359.19234567!2d${PHU_QUOC_CENTER.lng}!3d${PHU_QUOC_CENTER.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0c8b8b8b8b8b9%3A0x1234567890abcdef!2sPhu%20Quoc%20Island!5e0!3m2!1sen!2s!4v1234567890`}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />

                  <div className="absolute inset-0 pointer-events-none">
                    {/* Project markers overlay */}
                    <div className="absolute inset-0">
                      {visibleLayers.projects &&
                        projectLocations.map((project) => {
                          // Calculate approximate pixel position on map
                          // This is a simplified calculation for demonstration
                          const mapWidth = 100
                          const mapHeight = 100
                          const centerLat = PHU_QUOC_CENTER.lat
                          const centerLng = PHU_QUOC_CENTER.lng

                          const latDiff = project.lat - centerLat
                          const lngDiff = project.lng - centerLng

                          const x = 50 + lngDiff * 100
                          const y = 50 - latDiff * 100

                          return (
                            <div
                              key={project.id}
                              className="absolute pointer-events-auto"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              <button
                                onClick={() => {
                                  setSelectedProject(project)
                                  setPopupProject(project)
                                }}
                                className={`transition-transform hover:scale-110 ${
                                  selectedProject?.id === project.id ? "scale-125" : ""
                                }`}
                              >
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-white hover:shadow-xl"
                                  style={{ backgroundColor: project.color }}
                                >
                                  {project.id}
                                </div>
                              </button>
                            </div>
                          )
                        })}
                    </div>

                    {/* Popup */}
                    {popupProject && (
                      <div className="absolute top-4 right-4 bg-white border border-border rounded-lg shadow-lg p-4 w-80 z-10 pointer-events-auto">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-foreground">{popupProject.code}</h3>
                            <p className="text-sm text-muted-foreground">{popupProject.name}</p>
                          </div>
                          <button
                            onClick={() => setPopupProject(null)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Trạng thái:</span>
                            <span className="font-medium text-foreground">{popupProject.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tiến độ:</span>
                            <span className="font-medium text-foreground">{popupProject.progress}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${popupProject.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ngân sách:</span>
                            <span className="font-medium text-foreground">{popupProject.budget}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Bắt đầu:</span>
                            <span className="font-medium text-foreground">{popupProject.startDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Kết thúc:</span>
                            <span className="font-medium text-foreground">{popupProject.endDate}</span>
                          </div>
                        </div>

                        <Button
                          onClick={handleSelectProjectFromPopup}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Xem chi tiết dự án
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Nhấp vào marker để xem thông tin • Sử dụng nút zoom để phóng to/thu nhỏ
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Layer Panel */}
          {showLayerPanel && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers size={18} />
                  Quản lý Layers
                </CardTitle>
                <CardDescription>Google Maps Layers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: "projects", name: "Dự án", description: "Lớp hiển thị các dự án" },
                  { id: "infrastructure", name: "Cơ sở hạ tầng", description: "Lớp cơ sở hạ tầng" },
                  { id: "administrative", name: "Hành chính", description: "Lớp ranh giới hành chính" },
                ].map((layer) => (
                  <div key={layer.id} className="flex items-start gap-3">
                    <Checkbox
                      id={layer.id}
                      checked={visibleLayers[layer.id as keyof typeof visibleLayers]}
                      onCheckedChange={() => toggleLayer(layer.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <label htmlFor={layer.id} className="text-sm font-medium text-foreground cursor-pointer">
                        {layer.name}
                      </label>
                      <p className="text-xs text-muted-foreground">{layer.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Project List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Danh sách dự án</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projectLocations.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project)
                      setPopupProject(project)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedProject?.id === project.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{project.code}</p>
                        <p className="text-xs opacity-80 truncate">{project.name}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Google Maps Integration Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin size={16} />
            Thông tin tích hợp Google Maps
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>
            <strong>Hiện tại:</strong> Sử dụng Google Maps Embed API (miễn phí, không cần API key)
          </p>
          <p>
            <strong>Tọa độ Phú Quốc:</strong> {PHU_QUOC_CENTER.lat.toFixed(4)}°N, {PHU_QUOC_CENTER.lng.toFixed(4)}°E
          </p>
          <p>
            <strong>Tính năng:</strong> Popup thông tin dự án, link chuyển sang tab quản lý dự án, hiển thị chi tiết dự
            án
          </p>
          <p className="mt-2">
            <strong>Để sử dụng Google Maps API nâng cao:</strong> Cài đặt package:
          </p>
          <code className="block bg-secondary p-2 rounded mt-1 text-foreground">
            npm install @react-google-maps/api
          </code>
        </CardContent>
      </Card>
    </div>
  )
}
