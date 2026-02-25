# API Integration Guide

## Overview

This directory contains service files and hooks for managing API calls in the frontend. The structure is designed to be easily integrated with a backend API.

## Project Structure

```
├── hooks/
│   ├── use-subprocess.ts      # Custom hook for managing sub-processes state
│   ├── use-mobile.ts
│   ├── use-toast.ts
│   └── ...
├── lib/
│   └── services/
│       ├── subprocess.service.ts   # Sub-process API service
│       ├── stage.service.ts        # Stage/Workflow API service
│       └── index.ts                # Central exports
└── components/
    └── project-details.tsx         # Component using these services
```

## Services

### SubProcessService (`lib/services/subprocess.service.ts`)

Handles all sub-process (quy trình con) API operations.

**Endpoints to implement on backend:**

```
GET    /api/stages/{stageId}/subprocesses
POST   /api/subprocesses
PUT    /api/subprocesses/{subProcessId}
DELETE /api/subprocesses/{subProcessId}
```

**Usage in components:**
```typescript
import { subProcessService } from '@/lib/services'

// Create sub-process
const newSubProcess = await subProcessService.createSubProcess({
  stageId: 1,
  name: 'Sub-process name',
  content: 'Detailed content',
})

// Get sub-processes for a stage
const subProcesses = await subProcessService.getSubProcessesByStage(1)

// Update
await subProcessService.updateSubProcess(subProcessId, {
  name: 'Updated name',
  content: 'Updated content',
})

// Delete
await subProcessService.deleteSubProcess(subProcessId)
```

### StageService (`lib/services/stage.service.ts`)

Handles all workflow stage (tiến trình) API operations.

**Endpoints to implement on backend:**

```
GET    /api/projects/{projectId}/stages
GET    /api/stages/{stageId}
POST   /api/stages
PUT    /api/stages/{stageId}
DELETE /api/stages/{stageId}
PUT    /api/stages/bulk-update
```

**Usage:**
```typescript
import { stageService } from '@/lib/services'

// Get stages for project
const stages = await stageService.getStagesByProject(projectId)

// Create stage
const newStage = await stageService.createStage({
  projectId: 1,
  name: 'New Stage',
  description: 'Stage description',
})

// Update
await stageService.updateStage(stageId, {
  name: 'Updated name',
  progress: 50,
})
```

## Hooks

### useSubProcess (`hooks/use-subprocess.ts`)

Custom React hook for managing sub-process state and operations locally (without API calls).

**Features:**
- State management for sub-processes
- Add, update, delete operations
- Form state management
- Expand/collapse functionality

**Usage:**
```typescript
const {
  subProcesses,           // Record<stageId, SubProcess[]>
  subProcessForm,         // Form state
  setSubProcessForm,      // Update form
  isAddSubProcessOpen,    // Dialog open state
  setIsAddSubProcessOpen, // Toggle dialog
  addSubProcess,          // Add locally
  deleteSubProcess,       // Delete locally
  updateSubProcess,       // Update locally
  expandedSubProcess,     // Expanded item tracking
  setExpandedSubProcess,  // Toggle expand
} = useSubProcess()
```

## Backend Integration Steps

### Step 1: Environment Setup

Add your backend API URL to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Or for production:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### Step 2: Update Services

The service files already have TODO comments for:
1. Replace API_BASE_URL (already using env var)
2. Add authentication headers (uncomment when ready)

Example with authentication:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
}
```

### Step 3: Handle API Responses in Components

When ready to use real API, update the component to:

```typescript
// Instead of local state updates:
const handleAddSubProcess = async () => {
  try {
    const newSubProcess = await subProcessService.createSubProcess({
      stageId: selectedStageForSubProcess,
      ...subProcessForm,
    })
    // API will handle the state update
    setSubProcessForm({ name: '', content: '', progressReport: '', executionTime: '' })
    setIsAddSubProcessOpen(false)
  } catch (error) {
    console.error('Failed to add sub-process:', error)
    // Show error toast
  }
}
```

## Data Models

### SubProcess
```typescript
interface SubProcess {
  id: string | number
  stageId: number
  name: string
  content: string
  progressReport: string
  executionTime: string
  createdAt?: string
  updatedAt?: string
}
```

### Stage
```typescript
interface Stage {
  id: number
  name: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  progress: number
  startDate?: string
  completedDate?: string
  projectId: number
  createdAt?: string
  updatedAt?: string
}
```

## Error Handling

All service methods throw errors that should be caught in components:

```typescript
try {
  const result = await subProcessService.createSubProcess(data)
} catch (error) {
  console.error('Error:', error.message)
  // Show error notification to user
}
```

## Authentication

When backend is ready with authentication:

1. Create `lib/services/auth.service.ts` for token management
2. Update each service to include auth headers
3. Handle 401 responses for expired tokens

Example:
```typescript
const token = localStorage.getItem('authToken')

headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
}
```

## Future Enhancements

- [ ] Add error boundary components
- [ ] Implement request/response interceptors
- [ ] Add request timeout handling
- [ ] Implement retry logic for failed requests
- [ ] Add request caching
- [ ] Add real-time updates with WebSocket
- [ ] Add pagination for large datasets
- [ ] Add search/filter capabilities
