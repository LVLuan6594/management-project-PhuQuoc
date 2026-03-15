import { useState, useCallback } from 'react'

export interface SubProcess {
  id: string | number
  name: string
  content: string
  progressReport: string
  executionTime: string
  startDate: string
  endDate: string
}

export interface SubProcessFormData {
  name: string
  content: string
  progressReport: string
  executionTime: string
  startDate: string
  endDate: string
}

type EditableSubProcessField = Exclude<keyof SubProcess, 'id'>

export const useSubProcess = () => {
  const [subProcesses, setSubProcesses] = useState<Record<number, SubProcess[]>>({})
  const [selectedStageForSubProcess, setSelectedStageForSubProcess] = useState<number | null>(null)
  const [subProcessForm, setSubProcessForm] = useState<SubProcessFormData>({
    name: '',
    content: '',
    progressReport: '',
    executionTime: '',
    startDate: '',
    endDate: '',
  })
  const [isAddSubProcessOpen, setIsAddSubProcessOpen] = useState(false)
  const [expandedSubProcess, setExpandedSubProcess] = useState<string | null>(null)

  const addSubProcess = useCallback((stageId: number, formData: SubProcessFormData) => {
    if (!formData.name.trim() || !formData.content.trim()) {
      return false
    }

    const newSubProcess: SubProcess = {
      id: `${stageId}-${Date.now()}-${Math.random()}`,
      ...formData,
    }

    setSubProcesses((prev) => ({
      ...prev,
      [stageId]: [...(prev[stageId] || []), newSubProcess],
    }))

    return true
  }, [])

  const deleteSubProcess = useCallback((stageId: number, subProcessId: string | number) => {
    setSubProcesses((prev) => ({
      ...prev,
      [stageId]: prev[stageId]?.filter((sp) => sp.id !== subProcessId) || [],
    }))
  }, [])

  const updateSubProcess = useCallback(
    (stageId: number, subProcessId: string | number, field: EditableSubProcessField, value: string) => {
      setSubProcesses((prev) => ({
        ...prev,
        [stageId]: prev[stageId]?.map((sp) =>
          sp.id === subProcessId ? { ...sp, [field]: value } : sp
        ) || [],
      }))
    },
    []
  )

  const handleAddSubProcess = useCallback(() => {
    if (selectedStageForSubProcess === null) return

    if (addSubProcess(selectedStageForSubProcess, subProcessForm)) {
      setSubProcessForm({
        name: '',
        content: '',
        progressReport: '',
        executionTime: '',
        startDate: '',
        endDate: '',
      })
      setIsAddSubProcessOpen(false)
    }
  }, [selectedStageForSubProcess, subProcessForm, addSubProcess])

  const initializeWithStages = useCallback((stages: Array<{ id: number; subProcesses?: SubProcess[] }>) => {
    const initialSubProcesses: Record<number, SubProcess[]> = {}
    stages.forEach((stage) => {
      initialSubProcesses[stage.id] = stage.subProcesses || []
    })
    setSubProcesses(initialSubProcesses)
  }, [])

  const ensureStageSubProcesses = useCallback((stageId: number) => {
    setSubProcesses((prev) => {
      if (prev[stageId]) return prev
      return {
        ...prev,
        [stageId]: [],
      }
    })
  }, [])

  return {
    subProcesses,
    selectedStageForSubProcess,
    setSelectedStageForSubProcess,
    subProcessForm,
    setSubProcessForm,
    isAddSubProcessOpen,
    setIsAddSubProcessOpen,
    expandedSubProcess,
    setExpandedSubProcess,
    addSubProcess,
    deleteSubProcess,
    updateSubProcess,
    handleAddSubProcess,
    initializeWithStages,
    ensureStageSubProcesses,
  }
}
