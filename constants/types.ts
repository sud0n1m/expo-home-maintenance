// Data models for Home Maintenance App

export interface User {
  id: string;
  email: string;
  created_at: string; // ISO timestamp
  notification_preferences: Record<string, any>;
}

export interface MaintenanceTask {
  id: string;
  user_id: string;
  name: string;
  description: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  last_completed: string; // ISO timestamp
  next_due: string; // ISO timestamp
  device_category?: string;
  notes: string;
  photo_url?: string;
  supply_links: string[];
  supply_usage?: number;
  current_inventory?: number;
  created_at: string;
  updated_at: string;
  category?: string; // Added for UI
  priority?: string; // Added for UI
}

export interface TaskCompletion {
  id: string;
  task_id: string;
  completed_at: string; // ISO timestamp
  notes?: string;
  supplies_used?: number;
} 