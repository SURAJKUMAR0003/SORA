# COLLEGE INNOVATION COMPETITION DEMONSTRATION GUIDE
**Hospital Autonomy AI — SORA Autonomous Hospital Robot**

This guide provides a structured pitch and live demo script for college competitions, hackathons, and project evaluations.

---

## 🎙️ 3-Minute Pitch Script

### Slide / Opening Pitch (30 seconds):
> *"Good morning, respected judges. Hospitals are often high-stress, complex mazes where patients lose precious time navigating corridors, and nursing staff walk miles every shift just transporting paperwork and medications.*  
> *We built **HOSPITAL AUTONOMY AI**, powered by our autonomous robotic assistant **SORA**. SORA combines multi-modal patient interaction, A* grid SLAM navigation, real-time dynamic obstacle avoidance, and supervised clinical logistics to transform hospital mobility."*

---

## 🎬 Live Step-by-Step Demonstration Sequence

### Action 1: One-Click Guided Demo (The Hero Feature)
1. Point to the glowing top header and click **"Start Demo"**.
2. **Step 1:** Hear SORA speak: *"Hello! I am SORA, your hospital assistance robot. How can I help you today?"*
3. **Step 2-3:** Watch SORA's screen display the Pharmacy selection, speak the destination confirmation, and calculate the path.
4. **Step 4-5:** Direct the judges' attention to the **Virtual Hospital Map**. Explain that SORA calculates a collision-free A* route across the 28x20 hospital grid.
5. **Step 6-7 (The Wow Factor):** Point out that an unexpected obstacle (stretcher) appears in the corridor. SORA's virtual LiDAR detects it at 45cm, sounds an alert tone, and dynamically recalculates an alternate route in milliseconds without wall collisions.
6. **Step 8-9:** SORA arrives at the Central Pharmacy doorway and announces completion: *"We have arrived at the pharmacy. Is there anything else I can help you with?"*
7. **Step 10:** Confetti triggers and the mission logs in the System Monitoring audit trail.

---

### Action 2: 3D Robot & Physical Touchscreen
1. Switch to **Robot Touchscreen** in the sidebar.
2. Show the **3D SORA Robot** on the left. Use the mouse to drag and orbit 360° to show the chassis, wheels, head camera, and front medicine compartment.
3. Show the mounted kiosk on the right. Tap **"Find Department"** → select **"MRI & CT Scan"** or **"ICU"**.
4. SORA speaks the escort confirmation and dispatches navigation on the digital twin map.

---

### Action 3: AI Voice Assistant (SORA)
1. Switch to **AI Voice Assistant**.
2. Either click the microphone and speak aloud:
   - *"Take me to the pharmacy"*
   - *"Where is the emergency department?"*
   - *"Show me available doctors"*
3. Or click any of the preset test command chips.
4. Point out the animated waveform, the state machine transition (Listening → Processing → Speaking), and the voice response spoken aloud by the browser's speech synthesis engine.

---

### Action 4: Clinical Modules (Appointments & Pharmacy)
1. **Doctor & Appointment:**
   - Filter by specialty (Cardiology, Neurology).
   - Click "Book Appointment", fill in sample name, pick a time slot.
   - Show the generated appointment token (e.g., `CARD-42`) with the disclaimer that it is a demonstration record.
   - Click "Have SORA Escort Me to OPD Chamber" to dispatch the robot.
2. **Pharmacy & Delivery:**
   - Show the medicine formulary with stock count and storage requirements.
   - Dispatch an automated delivery to ICU.
   - Click "Advance Stage" through the 5-step authorization pipeline to demonstrate supervised hospital compliance.

---

### Action 5: Emergency Assistance & Safety Stop
1. Switch to **Emergency Assistance**.
2. Click **"ACTIVATE CODE BLUE"**.
3. Hear the audio alarm, observe the emergency stop engagement (motors locked), and show that SORA broadcasts its live coordinates `[X, Y]` and zone to the trauma staff.
4. Click **"Clear Emergency"** to safely return SORA to normal standby.

---

### Action 6: Hardware Integration & Physical Robot Readiness
1. Switch to **Hardware Bridge**.
2. Explain the hardware architecture:
   - **Raspberry Pi 4:** Runs high-level navigation, digital twin sync, and FastAPI WebSocket bridge.
   - **ESP32:** Dual-core microcontroller executing real-time FreeRTOS motor control and LiDAR polling.
3. Show the provided C++ Arduino and Python code snippets, demonstrating that this is designed to be deployed onto physical robotic hardware.

---

## 💡 Typical Judge Questions & Winning Answers

**Q1: How does SORA ensure it doesn't collide with patients in crowded corridors?**
> *Answer: SORA uses a layered costmap approach. Our A* pathfinding accounts for static walls, while a simulated 360° LiDAR continuously sweeps a 30cm safety halo around the robot. If a human or trolley steps into the trajectory, the robot halts immediately and recalculates an alternate route.*

**Q2: Can this connect to actual physical hardware?**
> *Answer: Yes. We designed a clean Hardware Abstraction Layer (HAL). As shown in the Hardware Bridge tab, the exact telemetry and command JSON packets are structured to transmit over WebSockets or MQTT to an ESP32 motor driver and Raspberry Pi 4.*

**Q3: Does SORA work offline?**
> *Answer: Yes. The speech synthesis, Web Audio synthesizer, A* pathfinding, and UI state are entirely client-side and operate without external paid APIs.*
