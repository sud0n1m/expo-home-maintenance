# Home Maintenance App - Product Requirements Document

## Executive Summary

The Home Maintenance App is a mobile application designed to help homeowners track, schedule, and manage routine maintenance tasks around their property. The app will provide automated reminders, supply tracking, and task organization to ensure critical maintenance activities are completed on time.

## Problem Statement

Homeowners struggle to keep track of routine maintenance tasks such as changing filters, scheduling seasonal services, and performing regular inspections. This leads to:
- Missed maintenance schedules resulting in equipment failure
- Inefficient purchasing of supplies
- Difficulty remembering task-specific details and procedures
- Lack of historical tracking for maintenance activities

## Goals & Objectives

### Primary Goals
- Simplify home maintenance task tracking and scheduling
- Reduce missed maintenance through automated reminders
- Provide centralized storage for maintenance-related information
- Demonstrate Customer.io integration capabilities

### Success Metrics
- User retention rate after 30 days
- Task completion rate following reminders
- Average time to complete setup of first maintenance task
- User engagement with reminder notifications

## User Stories

### Core User Stories
- **As a homeowner**, I want to add maintenance tasks with custom schedules so I never miss important upkeep
- **As a homeowner**, I want to receive timely reminders so I can complete tasks before they become urgent
- **As a homeowner**, I want to track my supply inventory so I know when to reorder items
- **As a homeowner**, I want to store photos and notes for each task so I have reference materials
- **As a homeowner**, I want to see overdue tasks prominently so I can prioritize urgent items

### Secondary User Stories
- **As a homeowner**, I want to link to supply sources so I can easily reorder materials
- **As a homeowner**, I want to track maintenance history so I can analyze patterns and costs

## Functional Requirements

### 1. Task Management
- **Add Maintenance Task**: Users can create new maintenance tasks with the following fields:
  - Task name and description
  - Last completion date
  - Frequency (Every [n] months / weeks / quarters / years)
  - Task notes
  - Photo attachment
  - Supply links/information
  - Supply usage tracking (advanced feature)
  - Current supply inventory (advanced feature)

- **Task List View**: Display all tasks organized by next due date
  - Highlight overdue tasks in red
  - Show upcoming tasks in chronological order
  - Provide quick actions for marking tasks complete

- **Task Completion**: Users can mark tasks as complete, automatically updating the next due date

### 2. Notification System
- **Reminder Scheduling**: Integrate with Customer.io to send:
  - Push notifications (if user opts in)
  - Email reminders (if user opts in)
  - Follow-up reminders: Weekly after the due date elapses

- **Notification Preferences**: Users can customize:
  - Reminder timing (days before due date)
  - Communication channel preferences
  - Frequency of follow-up reminders

### 3. Authentication & User Management
- **Simple Email Authentication**: 
  - Email-based magic link authentication sent through Customer.io
  - No password required
  - Authentication prompted after adding first task
  - Account confirmation required before saving tasks

- **Account Management**:
  - Email address as primary identifier
  - Re-authentication via magic link if logged out

### 4. Data Storage & Sync
- **Primary Storage Options** (to be determined):
  - Option A: Customer.io as primary data store
  - Option B: iCloud storage with Customer.io sync for notifications
  - Option C: Firebase/Supabase with Customer.io integration

- **Offline Capability**: 
  - View existing tasks when offline
  - Cache critical data locally
  - Sync changes when connectivity returns

## Technical Requirements

### Platform
- **Initial Release**: iOS mobile app
- **Future Consideration**: Android, web application

### Integration Requirements
- **Customer.io Integration**:
  - User profile management
  - Task data synchronization (if used as primary storage)
  - Notification trigger management
  - Campaign automation for reminder sequences

### Backend Services

If required, we'll need

- **Notification Processing**: Background service to:
  - Calculate due dates
  - Trigger reminder campaigns
  - Handle notification escalation
  - Process task completions

### Data Model
```
User {
  id: string
  email: string
  created_at: timestamp
  notification_preferences: object
}

MaintenanceTask {
  id: string
  user_id: string
  name: string
  description: string
  frequency: enum
  last_completed: timestamp
  next_due: timestamp
  device_category: string (optional)
  notes: text
  photo_url: string (optional)
  supply_links: array
  supply_usage: number (optional)
  current_inventory: number (optional)
  created_at: timestamp
  updated_at: timestamp
}

TaskCompletion {
  id: string
  task_id: string
  completed_at: timestamp
  notes: text (optional)
  supplies_used: number (optional)
}
```

## User Experience Flow

### 1. First-Time User Experience
1. App opens to minimal interface with "Add Maintenance Task" button
2. User creates their first maintenance task
3. After completing task creation, authentication prompt appears
4. User enters email address and confirms via magic link
5. Task is saved and user sees their first task in the list

### 2. Returning User Experience
1. User opens app to see task list sorted by due date
2. Overdue tasks prominently displayed in red
3. User can quickly mark tasks complete or view details
4. User receives push notifications and emails per their preferences

### 3. Task Management Flow
1. User taps "Add Maintenance Task"
2. Fills in task details form
3. Optionally adds photo and supply information
4. Saves task - automatically calculates next due date
5. Task appears in main list, sorted by due date

## Non-Functional Requirements

### Performance
- App launches within 3 seconds
- Task list loads within 2 seconds
- Offline functionality for viewing existing tasks

### Security
- Secure API communications (HTTPS)
- User data encryption at rest
- Proper authentication token management

### Reliability
- 99.9% uptime for notification services
- Graceful degradation when services are unavailable
- Data backup and recovery procedures

## Technical Considerations & Decisions

### Storage Architecture Decision
**Options to Evaluate:**
1. **Customer.io Primary**: Use Customer.io as main database with mobile app as interface
2. **Hybrid Approach**: iCloud for primary storage, Customer.io for notifications and sync
3. **Traditional Backend**: Firebase/Supabase for data, Customer.io for notifications

**Recommendation**: Start with hybrid approach (iCloud + Customer.io) for MVP, evaluate migration to dedicated backend based on user feedback and scale requirements.

### Notification Strategy
- Utilize Customer.io's campaign automation for reminder sequences
- Implement fallback notification system for critical reminders
- A/B test notification timing and content for optimal engagement

## Future Enhancements

### Phase 2 Features
- Device/system categorization and organization
- Advanced supply management with automatic reordering
- Maintenance cost tracking and budgeting
- Service provider contact management
- Maintenance history analytics and insights

### Phase 3 Features
- Social features (sharing maintenance schedules with family)
- Integration with smart home devices
- Predictive maintenance recommendations
- Professional service marketplace integration

## Launch Strategy

### MVP Features (Phase 1)
- Basic task creation and management
- Email authentication
- Customer.io notification integration
- Simple task list interface
- iOS app store release

### Success Criteria for MVP
- 100 active users within first month
- 70% task completion rate following reminders
- 4.0+ app store rating
- Successful demonstration of Customer.io integration capabilities

## Appendix

### Assumptions
- Users primarily manage 10-50 maintenance tasks
- Most tasks have monthly to annual frequencies
- Users prefer mobile-first experience
- Email is acceptable primary authentication method

### Dependencies
- Customer.io API capabilities and limitations
- Apple App Store approval process
- iCloud storage API functionality
- Push notification service reliability

### Risks
- Customer.io service limitations may impact core functionality
- User adoption of email-only authentication
- Complexity of notification timing and escalation logic
- Data synchronization challenges between storage systems