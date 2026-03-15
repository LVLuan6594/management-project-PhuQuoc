"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  type: "user" | "bot"
  text: string
  projectLink?: { projectId: number; projectName: string }
  followUps?: string[]
}

import { mockProjects } from "@/lib/mock-projects"

interface ChatbotAssistantProps {
  onNavigateToProject: (projectId: number) => void
}

export default function ChatbotAssistant({ onNavigateToProject }: ChatbotAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: 'Xin chào 👋 Tôi là trợ lý ảo! Bạn có thể hỏi tôi về các dự án. Ví dụ: "Cho tôi biết về dự án Cảng" hoặc "Tìm dự án PQ001".',
      followUps: ["Danh sách tất cả dự án", "Tiến độ dự án Cảng", "Dự án nào đã hoàn thành?"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const projectDatabase = mockProjects.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    status: p.status,
    progress: p.progress,
    location: p.location,
    investor: p.investor,
    startDate: p.startDate,
    endDate: p.endDate,
    description: p.description,
    budget: p.budget,
    contractor: p.contractor,
  }))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = (msg?: string) => {
    const messageText = msg || inputValue
    if (!messageText.trim()) return

    const userMessage: Message = { id: Date.now().toString(), type: "user", text: messageText }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      let botResponse: Message
      const input = messageText.toLowerCase()
      let foundProject = projectDatabase.find(
        (p) => input.includes(p.name.toLowerCase()) || input.includes(p.code.toLowerCase()),
      )

      if (foundProject) {
        const summary = `📁 Dự án: ${foundProject.name}\nMã hồ sơ: ${foundProject.code}\nTrạng thái: ${foundProject.status}\nTiến độ: ${foundProject.progress}%\nVị trí: ${foundProject.location || "-"}\nNhà đầu tư: ${foundProject.investor || "-"}`

        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: `${summary}\n\nBạn muốn biết thêm thông tin nào? Chọn một mục bên dưới hoặc 'Xem chi tiết' để vào trang dự án.`,
          projectLink: { projectId: foundProject.id, projectName: foundProject.name },
          followUps: [
            "Tiến độ",
            "Mô tả",
            "Vị trí",
            "Nhà đầu tư",
            "Nhà thầu",
            "Ngày bắt đầu",
            "Ngày kết thúc",
            "Xem chi tiết",
          ],
        }
      } else if (input.includes("danh sách") || input.includes("tất cả")) {
        const projectList = projectDatabase.map((p) => `• ${p.name} (${p.code})`).join("\n")
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: `📋 Danh sách các dự án:\n${projectList}\n\nBạn muốn xem chi tiết dự án nào?`,
          followUps: ["Tiến độ dự án Cảng", "Dự án đã hoàn thành", "Tìm PQ002"],
        }
      } else if (input.includes("hoàn thành")) {
        const completed = projectDatabase.filter((p) => p.status === "Hoàn thành")
        const list = completed.map((p) => `• ${p.name} (${p.code})`).join("\n")
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: `✅ Dự án đã hoàn thành:\n${list}`,
          followUps: ["Xem dự án Đường cao tốc", "Danh sách tất cả dự án"],
        }
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          text: "🤔 Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi ví dụ: “Danh sách dự án”, “Tiến độ dự án Sân bay”, hoặc “Tìm PQ003”.",
          followUps: ["Danh sách tất cả dự án", "Tìm dự án PQ003", "Dự án nào hoàn thành?"],
        }
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, botResponse])
    }, 1200)
  }

  const handleFollowUpButton = (label: string, projectId?: number) => {
    // If the follow-up is project-specific and we have the projectId, show that field directly
    if (projectId) {
      const proj = projectDatabase.find((p) => p.id === projectId)
      if (!proj) return

      const lower = label.toLowerCase()
      if (lower.includes("tiến độ") || lower === "tiến độ") {
        const botMsg: Message = {
          id: (Date.now() + 2).toString(),
          type: "bot",
          text: `Tiến độ dự án ${proj.name}: ${proj.progress}%`,
        }
        setMessages((prev) => [...prev, { id: Date.now().toString(), type: "user", text: label }, botMsg])
        return
      }

      if (lower.includes("mô tả") || lower.includes("mô tả")) {
        const botMsg: Message = {
          id: (Date.now() + 3).toString(),
          type: "bot",
          text: `${proj.description || "Không có mô tả."}`,
        }
        setMessages((prev) => [...prev, { id: Date.now().toString(), type: "user", text: label }, botMsg])
        return
      }

      if (lower.includes("vị trí")) {
        const botMsg: Message = { id: (Date.now() + 4).toString(), type: "bot", text: `Vị trí: ${proj.location || "-"}` }
        setMessages((prev) => [...prev, { id: Date.now().toString(), type: "user", text: label }, botMsg])
        return
      }

      if (lower.includes("nhà đầu tư")) {
        const botMsg: Message = { id: (Date.now() + 5).toString(), type: "bot", text: `Nhà đầu tư: ${proj.investor || "-"}` }
        setMessages((prev) => [...prev, { id: Date.now().toString(), type: "user", text: label }, botMsg])
        return
      }

      if (lower.includes("nhà thầu")) {
        const botMsg: Message = { id: (Date.now() + 6).toString(), type: "bot", text: `Nhà thầu: ${proj.contractor || "-"}` }
        setMessages((prev) => [...prev, { id: Date.now().toString(), type: "user", text: label }, botMsg])
        return
      }

      if (lower.includes("ngày bắt đầu") || lower.includes("bắt đầu")) {
        const botMsg: Message = { id: (Date.now() + 7).toString(), type: "bot", text: `Ngày bắt đầu: ${proj.startDate || "-"}` }
        setMessages((prev) => [...prev, { id: Date.now().toString(), type: "user", text: label }, botMsg])
        return
      }

      if (lower.includes("ngày kết thúc") || lower.includes("kết thúc")) {
        const botMsg: Message = { id: (Date.now() + 8).toString(), type: "bot", text: `Ngày kết thúc: ${proj.endDate || "-"}` }
        setMessages((prev) => [...prev, { id: Date.now().toString(), type: "user", text: label }, botMsg])
        return
      }

      if (lower.includes("xem chi tiết") || lower.includes("chi tiết")) {
        handleProjectClick(projectId)
        return
      }
    }

    // fallback: send as a normal user query
    handleSendMessage(label)
  }

  const handleProjectClick = (projectId: number) => {
    onNavigateToProject(projectId)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {/* <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
      >
        <Bot size={24} />
      </Button> */}
{/* Floating Bot Button with Animation */}
    <motion.button
      onClick={() => setIsOpen(!isOpen)}
      className="rounded-full w-14 h-14 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white shadow-lg shadow-[0_0_15px_rgba(99,102,241,0.7)] flex items-center justify-center"
      animate={{
        y: [0, -3, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.5,
        rotate: [0, 5, -5, 0],
        transition: { duration: 0.5 },
      }}
    >
      <Bot size={26} className="drop-shadow-md" />
    </motion.button>

      {/* Chat Window with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`absolute bottom-20 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col ${
              isExpanded ? "w-[480px] h-[560px]" : "w-96 h-96"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-400 to-sky-500 text-white p-4 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <h3 className="font-semibold text-sm">Trợ lý AI Quản lý Dự án</h3>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-white hover:bg-sky-600"
                >
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-sky-600"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.type === "user"
                        ? "bg-sky-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>

                    {message.projectLink && (
                      <Button
                        onClick={() => handleProjectClick(message.projectLink!.projectId)}
                        className="mt-2 w-full bg-sky-500 hover:bg-sky-600 text-white text-xs h-8"
                      >
                        Xem chi tiết: {message.projectLink.projectName}
                      </Button>
                    )}

                    {message.followUps && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.followUps.map((q, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="text-xs border-gray-300"
                            onClick={() => handleSendMessage(q)}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-500 text-sm">
                    <span className="animate-pulse">Đang tra cứu thông tin...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3 bg-white flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhập câu hỏi..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Button onClick={() => handleSendMessage()} size="icon" className="bg-sky-500 hover:bg-sky-600 text-white">
                <Send size={18} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
