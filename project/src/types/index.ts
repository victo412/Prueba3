export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  duration: number; // Duration in minutes
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  project?: string;
  contextTag?: string;
}

export interface TimeBlock {
  id: string;
  hour: number;
  tasks: Task[];
}

export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'social';
export type TaskStatus = 'scheduled' | 'in-progress' | 'completed' | 'postponed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface DailyStats {
  completedTasks: number;
  totalTasks: number;
  productivityScore: number;
  focusTime: number;
}

export interface LefiMessage {
  id: string;
  content: string;
  type: 'suggestion' | 'reminder' | 'congratulation' | 'tip';
  timestamp: Date;
}