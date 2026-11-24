# HOSPITAL AUTONOMY AI (SORA)
**AI-Powered Autonomous Hospital Assistance, Mobility, Avoidance & Navigation System**

> **College Innovation Competition & Prototype Demonstration Platform**  
> An advanced robotics control interface demonstrating how an intelligent hospital assistance robot (**SORA**) interacts with patients, interprets natural voice & touch commands, plans optimal obstacle-free paths across a virtual hospital floor plan using A*, and simulates autonomous clinical delivery workflows.

---

## 🌟 Key System Capabilities

### 1. 🗺️ Interactive Virtual Hospital Map (A* Grid-Based Digital Twin)
- **Grid Layout (28x20 Cells)** with designated zones:
  - Main Reception & SORA Docking Base
  - Emergency Department (ER Level-1 Trauma Bay)
  - OPD (Outpatient Clinical Suites)
  - ICU (Intensive Care Unit)
  - Central Pharmacy & Dispensary
  - MRI & CT Scan Diagnostic Suite
  - Pathology Laboratory
  - Billing & Cashless Insurance Counter
  - Visitor & Family Waiting Lounge
  - Smart Elevator Bank (Lift)
  - Emergency Exit & Ambulance Egress
- **A\* Pathfinding Algorithm** with wall collision boundaries and doorway routing.
- **Dynamic Obstacle Detection & Real-Time Rerouting**:
  - Spawn stretchers, cleaning carts, or visitors in corridors.
  - SORA detects obstacles with LiDAR range telemetry, plays alert sound, and recalculates an alternate route in sub-second time without wall clipping.

### 2. 🤖 3D Robot Physical Visualization (Three.js WebGL)
- **Futuristic 20-inch Hospital Robot (SORA)**:
  - Rounded white & cyan aerodynamic chassis.
  - Two powered differential drive wheels and two caster stabilization wheels.
  - Head unit with rotating LiDAR scanner, 1080p stereo camera, and animated eye visor.
  - Torso-mounted touchscreen display and secure automated front medicine vault.
  - Drag-to-orbit 360° interactive camera control with synchronized idle, navigation, and speech animations.

### 3. 📱 Mounted Robot Touchscreen Kiosk
- Mounted tablet interface reflecting the physical robot's onboard display:
  - **Find Department**: Interactive department directory with one-tap dispatch.
  - **Find Doctor**: Specialist list with direct OPD room escort.
  - **Book Appointment**: Outpatient consultation scheduling.
  - **Pharmacy**: Autonomous cart medication pickup.
  - **Medicine Information**: Hospital formulary search.
  - **Billing**: Guidance to accounts and discharge clearance.
  - **Emergency Help**: One-tap distress broadcast and staff alert.
  - **Talk to SORA**: Voice-activated natural language assistant.

### 4. 🎙️ AI Voice Assistant — SORA
- Built using browser **SpeechSynthesis API** (warm, clear, professional female voice) and **Web Speech Recognition API** with text-input fallback.
- Natural intent parsing for:
  - *"Take me to the pharmacy."*
  - *"Where is the emergency department?"*
  - *"Find the cardiology department."*
  - *"Show me available doctors."*
  - *"I want to book an appointment."*
  - *"Where is the MRI department?"*
  - *"Take me to the billing counter."*
  - *"Call hospital staff for assistance."*
- Voice selector dropdown, audio waveform pulse visualizer, and Web Audio API synthetic robotic chimes/alerts.

### 5. 🏥 Clinical Modules
- **Doctor Directory & Appointment Booking**:
  - Cardiology, Neurology, Orthopedics, General Medicine, Pediatrics, Dermatology.
  - Search, slot picker, simulated consultation token generation, and one-click SORA escort.
- **Central Pharmacy & Delivery Coordination**:
  - Sample medicine formulary with dosage, storage conditions, and stock levels.
  - 5-stage authorized delivery pipeline: *Request Received → Pharmacy Verification → Authorized Preparation → Robot Delivery In Transit → Completed & Verified*.
- **Emergency Assistance & Beacon**:
  - Code Blue (Cardiac Arrest) and Patient Fall protocols.
  - Automatic coordinate broadcast, response team ETA countdown, and hardware emergency stop.

### 6. 🏆 10-Step Guided Innovation Competition Demo Mode
Click the prominent **"Start Demo"** button on the header or dashboard:
1. **Step 1:** SORA vocal introduction: *"Hello! I am SORA, your hospital assistance robot. How can I help you today?"*
2. **Step 2:** Visitor selects Central Pharmacy on the touch interface.
3. **Step 3:** SORA speaks confirmation aloud.
4. **Step 4:** SORA starts moving along corridors on the virtual map.
5. **Step 5:** Real-time A* path trajectory and live coordinates trace on screen.
6. **Step 6:** A dynamic obstacle (Emergency Stretcher) blocks the route.
7. **Step 7:** Radar sensor detects hazard, sounds obstacle alert, and recalculates alternate path around obstacle.
8. **Step 8:** Robot safely reaches Central Pharmacy doorway.
9. **Step 9:** SORA announces arrival: *"We have arrived at the pharmacy. Is there anything else I can help you with?"*
10. **Step 10:** Mission logged in activity history with completion metrics and celebration confetti.

### 7. 🔌 Physical Microcontroller Readiness (Raspberry Pi 4 & ESP32)
- Clean Hardware Abstraction Layer (`HardwareBridgeAdapter`).
- Production C++ Arduino/FreeRTOS firmware snippet for ESP32 motor H-bridge control.
- Python FastAPI WebSocket bridge snippet for Raspberry Pi 4 ROS2/UART interfacing.
- Separation of concerns: Simulation mode is active by default without false claims of physical hardware connectivity.

---

## 🚀 Quick Start Instructions

### Prerequisites
- Node.js (v18 or higher; tested on Node.js v26)
- npm

### Installation & Launch
```bash
# 1. Install dependencies (already executed)
npm install

# 2. Build for production to verify compilation
npm run build

# 3. Start local development server
npm run dev
```

The application will start locally at:
👉 **http://localhost:5173**

---

## 📐 Technology Stack
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (Dark Navy & Neon Cyan Robotics Theme)
- **3D Graphics:** Three.js (WebGL Web-Standards Canvas)
- **Pathfinding:** Custom Grid A* Search Algorithm with Diagonal Costing & Corner Avoidance
- **Audio & Speech:** Web Audio API Sound Synthesizer + SpeechSynthesis + Web Speech API
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti

---

## 🛡️ Prototype Disclaimer
This is a college engineering innovation prototype platform. Medical consultation tokens, drug deliveries, and emergency pager broadcasts are simulated for demonstration purposes and do not replace physical clinical equipment or actual emergency services.
