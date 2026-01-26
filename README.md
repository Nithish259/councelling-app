🌿 HealSpace – Online Counseling Platform

HealSpace is a full-stack web application designed to connect clients with professional counsellors for secure and convenient online therapy sessions.
The platform enables appointment booking, real-time chat & email integration, WebRTC video sessions, session tracking, and secure sharing of session notes.

🚀 Core Features
👤 Client Features

 - Secure registration and login

 - Search counsellors by session type / specialization

 - View counsellor profiles and availability

 - Book appointments by selecting date and time slots

 - Confirm bookings using a test payment system (no real transactions)

 - Attend sessions through the Appointments page

 - Real-time communication:

 - Chat with counsellor before sessions

 - Temporary in-session chat during live sessions

 - Post-session communication

 - Access:Upcoming appointments

 - Session history

 - Update personal profile details

🧑‍⚕️ Counsellor Features

 - Role-based secure login

 - Professional dashboard with session insights

 - View and manage upcoming & past appointments

 - Conduct live video counselling sessions using WebRTC

 - Real-time chat with clients during sessions

 - Upload session notes and attachments (PDFs & images)

 - Session notes are counsellor-only accessible

 - Manage profile details

 - Set and update availability time slots

🎥 Real-Time Communication

HealSpace includes a complete real-time communication system:

Feature	Technology Used
Live Video Sessions	WebRTC
Real-time Messaging	Socket.IO
Session-based Chat	Persistent & in-session chat support

WebRTC enables peer-to-peer video communication directly in the browser without external plugins.

🔄 Application Workflow

1️⃣ Client Onboarding

Client registers and logs in.

Completes profile details.

2️⃣ Counsellor Discovery

Client searches counsellors by specialization or session type.

Views counsellor details and available slots.

3️⃣ Appointment Booking

Client selects a date and time slot.

Clicks “Pay & Book” (test payment flow).

Appointment is confirmed and visible my appointments section.

4️⃣ Pre-Session Interaction

Client can open appointment details by clicking a appointment.

Chat option is available for communication before the session.

5️⃣ Live Session

At the scheduled time, client joins the session.

Secure WebRTC video call is initiated.

Temporary live chat is available during the session.

6️⃣ Post-Session

Session is stored in history.

Counsellor uploads session notes and attachments.

Client can review past session details.

7️⃣ Automatic Session Handling

If a session is unattended, it is automatically cancelled 30 minutes after the scheduled start time.

👥 User Roles & Permissions

Role	Capabilities

Client	Book sessions, attend video calls, chat, manage profile, view history
Counsellor	Manage availability, conduct video sessions, upload notes, access session records

🛠 Tech Stack
Frontend

 - React.js

Backend

 - Node.js

 - Express.js

WebRTC 
 
  – Peer-to-peer video calling

Socket.IO 

  – Real-time chat & signaling

Cloud & Storage

  - Cloudinary – Image & PDF uploads (session notes, profile pictures)

Authentication & Security

 - JWT Authentication

 - Role-Based Authorization

 - Protected API Routes

📦 Key Modules

 - User Authentication & Authorization

 - Appointment Booking System

 - Test Payment Integration

 - WebRTC Video Session Handling

 - Real-Time Chat System

 - Session Notes & File Uploads

 - Auto Session Cancellation Logic

 - Profile & Availability Management

 <img width="1871" height="818" alt="image" src="https://github.com/user-attachments/assets/7863d2b2-e543-471d-848e-17c8b6ea67c3" />
 <img width="1877" height="828" alt="image" src="https://github.com/user-attachments/assets/c195fc0c-c79a-487e-b868-ba333bdcef8f" />
 <img width="1882" height="805" alt="image" src="https://github.com/user-attachments/assets/23610868-f6e9-419d-bf48-cbed9c9c2f0f" />
 <img width="1116" height="698" alt="image" src="https://github.com/user-attachments/assets/e854d263-913c-4f33-ae91-f1897ff6b05f" />







💚 Purpose

HealSpace aims to make mental health support more accessible, organized, and secure by providing a seamless digital experience for therapy sessions through real-time communication and structured session management.
