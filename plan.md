# Home Maintenance App – Project Plan

This plan breaks down the project into small, sequential steps for a smooth, low-risk implementation of the Home Maintenance App, based on the Product Requirements Document (prd.md).

---

## 1. Project Setup & Planning
1.1. Review and finalize the Product Requirements Document (prd.md) ✅
1.2. Set up version control (Git, GitHub repository) ✅
1.3. Define branching strategy (e.g., main, develop, feature branches) ✅
1.4. Create initial project plan (this file) ✅

## 2. Project Scaffolding
2.1. Initialize Expo project (if not already done) ✅

## 3. Core Feature: Task Management
3.1. Add a navigation tab for "Tasks" in _layout.tsx and index.tsx ✅
3.2. Create a Tasks page stub with two example tasks: ✅
    - One recently completed and not due for several months
    - One overdue
3.3. Design data models for User, MaintenanceTask, TaskCompletion ✅
3.4. Implement local data storage (start with in-memory or simple file storage) ✅
3.5. Add sorting by due date to task list ✅
3.6. Implement add/edit/delete maintenance task functionality ✅
3.7. Add task completion flow (mark as complete, update next due date) ✅
3.8. Add support for task notes and photo attachments (UI only, stub storage) ✅
3.9. Highlight overdue tasks in UI ✅

## 4. Notification System (Customer.io Integration)
4.1. Research Customer.io API and SDK integration
4.2. Implement push notification setup (Expo Notifications)
4.3. Integrate Customer.io for email and push reminders
4.4. Add notification preferences UI (timing, channel, frequency)
4.5. Implement follow-up reminders for overdue tasks

## 5. Authentication & User Management
5.1. Implement email-based magic link authentication (Customer.io)
5.2. Prompt authentication after first task is added
5.3. Store user profile and preferences
5.4. Add account management UI (email, re-authentication)

## 6. Data Storage & Sync
6.1. Evaluate storage options (iCloud, Customer.io, Firebase/Supabase)
6.2. Implement MVP hybrid storage (iCloud for data, Customer.io for notifications)
6.3. Add offline capability (cache tasks locally)
6.4. Implement data sync logic (when connectivity returns)

## 7. MVP Polish & Testing
7.1. Test all user flows (first-time, returning, task management)
7.2. Test notification delivery and preferences
7.3. Test authentication and account flows
7.4. Test offline and sync scenarios
7.5. Fix bugs and polish UI/UX

## 8. App Store Preparation & Launch
8.1. Prepare app store assets (icon, screenshots, description)
8.2. Configure app.json for iOS release
8.3. Test on real devices
8.4. Submit to Apple App Store

## 9. Post-Launch & Future Enhancements
9.1. Monitor analytics and user feedback
9.2. Plan and prioritize Phase 2 features (advanced supply management, analytics, etc.)
9.3. Plan for Android and web versions

---

Each step should be completed and tested before moving to the next. Use feature branches for new features and merge only after review and testing. 