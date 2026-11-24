import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  RobotState, 
  GridPoint, 
  Obstacle, 
  Doctor, 
  AppointmentRecord, 
  MedicineItem, 
  DeliveryMission, 
  ActivityLog,
  DepartmentZone
} from '../types';
import { 
  HOSPITAL_DEPARTMENTS, 
  INITIAL_OBSTACLES, 
  SAMPLE_DOCTORS, 
  SAMPLE_MEDICINES 
} from '../data/hospitalLayout';
import { findPathAStar, calculateHeading } from '../utils/pathfinding';
import { playSound } from '../utils/audioEffects';
import { speechService } from '../utils/speechService';
import confetti from 'canvas-confetti';

interface HospitalContextType {
  // Navigation & View
  activeSection: string;
  setActiveSection: (sec: string) => void;

  // Robot State
  robotState: RobotState;
  departments: DepartmentZone[];
  obstacles: Obstacle[];
  activeDestination: DepartmentZone | null;
  
  // Controls
  navigateTo: (destinationId: string, customTaskDescription?: string) => void;
  pauseNavigation: () => void;
  resumeNavigation: () => void;
  cancelNavigation: () => void;
  returnToReception: () => void;
  emergencyStop: () => void;
  clearEmergency: () => void;
  setRobotSpeed: (speed: number) => void;
  
  // Obstacles
  addObstacle: (x: number, y: number, label?: string) => void;
  removeObstacle: (id: string) => void;
  clearDynamicObstacles: () => void;

  // Voice & Interaction
  speakSora: (text: string, expression?: RobotState['screenExpression'], onEnd?: () => void) => void;
  handleVoiceCommand: (transcript: string) => string;
  isVoiceSpeaking: boolean;
  isVoiceMuted: boolean;
  toggleMuteVoice: () => void;

  // Modules Data
  doctors: Doctor[];
  appointments: AppointmentRecord[];
  bookAppointment: (apt: Omit<AppointmentRecord, 'id' | 'tokenNumber' | 'status' | 'createdAt'>) => AppointmentRecord;
  
  medicines: MedicineItem[];
  deliveries: DeliveryMission[];
  requestMedicineDelivery: (medicineName: string, destinationZone: string, priority: DeliveryMission['priority']) => void;
  advanceDeliveryStage: (deliveryId: string) => void;

  // System Logs
  activityLogs: ActivityLog[];
  addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;

  // Demonstration Mode
  isDemoRunning: boolean;
  demoStepNumber: number;
  startDemo: () => void;
  stopDemo: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  // Initial Robot State at Main Reception
  const [robotState, setRobotState] = useState<RobotState>({
    id: 'SORA-MED-04',
    name: 'SORA',
    status: 'idle',
    position: { x: 13, y: 15 },
    currentFloor: 'Ground Floor (Level 1)',
    currentZone: 'Main Reception & SORA Dock',
    headingAngle: 0,
    speedMps: 0.8,
    batteryPct: 94,
    isCharging: false,
    currentTask: 'Autonomous Patrol & Hospital Escort Ready',
    targetDestinationId: null,
    targetDestinationName: null,
    screenMessage: 'Hello, I am SORA. Tap touchscreen or speak to begin.',
    screenExpression: 'friendly',
    completedTasksCount: 14,
    totalDistanceTraveledM: 342.8,
    sensors: {
      frontDistanceCm: 280,
      leftDistanceCm: 150,
      rightDistanceCm: 165,
      lidarStatus: 'active',
      cameraStatus: 'tracking',
      surfaceStatus: 'normal'
    },
    emergencyActive: false,
    isVoiceMuted: false,
    activePath: [],
    currentPathIndex: 0
  });

  const [obstacles, setObstacles] = useState<Obstacle[]>(INITIAL_OBSTACLES);
  const [doctors] = useState<Doctor[]>(SAMPLE_DOCTORS);
  const [medicines] = useState<MedicineItem[]>(SAMPLE_MEDICINES);

  const [appointments, setAppointments] = useState<AppointmentRecord[]>([
    {
      id: 'apt-101',
      patientName: 'Jane Doe',
      patientPhone: '+1 (555) 019-2834',
      department: 'Cardiology',
      doctorName: 'Dr. Marcus Vance, MD',
      doctorRoom: 'OPD-102 (Wing B)',
      date: '2026-11-25',
      timeSlot: '11:00 AM',
      tokenNumber: 'CARD-42',
      status: 'Confirmed',
      createdAt: '10 mins ago'
    },
    {
      id: 'apt-102',
      patientName: 'Alex Carter',
      patientPhone: '+1 (555) 014-9981',
      department: 'Neurology',
      doctorName: 'Dr. Elena Rostova, MD',
      doctorRoom: 'OPD-105 (Wing B)',
      date: '2026-11-25',
      timeSlot: '03:00 PM',
      tokenNumber: 'NEUR-19',
      status: 'Confirmed',
      createdAt: '45 mins ago'
    }
  ]);

  const [deliveries, setDeliveries] = useState<DeliveryMission[]>([
    {
      id: 'del-8801',
      medicineName: 'Emergency Epinephrine Auto-Injector',
      quantity: 2,
      destinationZone: 'Emergency Department (ER)',
      priority: 'STAT (Emergency)',
      stage: 'authorized_preparation',
      requestedBy: 'Nurse R. Gable (ER Triage)',
      timestamp: '5 mins ago',
      estimatedArrivalMin: 2,
      verificationDoctor: 'Dr. Marcus Vance'
    },
    {
      id: 'del-8802',
      medicineName: 'Sterile Normal Saline 0.9%',
      quantity: 4,
      destinationZone: 'ICU (Intensive Care Unit)',
      priority: 'Routine',
      stage: 'delivery_completed',
      requestedBy: 'ICU Care Station',
      timestamp: '32 mins ago',
      estimatedArrivalMin: 0,
      verificationDoctor: 'Dr. Ananya Sharma'
    }
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 'log-1',
      timestamp: '15:28:10',
      category: 'system',
      level: 'info',
      title: 'Autonomous System Initialized',
      details: 'SORA autonomous firmware v4.2 online. LiDAR & stereo vision calibrated.',
      location: 'Main Reception & SORA Dock'
    },
    {
      id: 'log-2',
      timestamp: '15:28:45',
      category: 'navigation',
      level: 'success',
      title: 'Completed Patient Escort',
      details: 'Guided visitor from Entrance to OPD Consultation Suite 102.',
      location: 'OPD (Outpatient Department)'
    }
  ]);

  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);

  // Demo Mode state
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoStepNumber, setDemoStepNumber] = useState<number>(0);

  // Navigation timer ref
  const navIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync voice speaking state
  useEffect(() => {
    speechService.onSpeakingChange((speaking) => {
      setIsVoiceSpeaking(speaking);
    });
  }, []);

  const addLog = useCallback((log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, []);

  const speakSora = useCallback((
    text: string, 
    expression: RobotState['screenExpression'] = 'friendly',
    onEnd?: () => void
  ) => {
    setRobotState(prev => ({
      ...prev,
      screenMessage: text,
      screenExpression: expression
    }));
    speechService.speak(text, onEnd);
  }, []);

  const toggleMuteVoice = () => {
    const next = !isVoiceMuted;
    setIsVoiceMuted(next);
    speechService.setMuted(next);
    setRobotState(prev => ({ ...prev, isVoiceMuted: next }));
    addLog({
      category: 'voice',
      level: 'info',
      title: next ? 'Voice Assistant Muted' : 'Voice Assistant Unmuted',
      details: `SORA speech output ${next ? 'silenced' : 'enabled'}.`
    });
  };

  // Active destination object
  const activeDestination = HOSPITAL_DEPARTMENTS.find(
    d => d.id === robotState.targetDestinationId
  ) || null;

  // Emergency Stop
  const emergencyStop = useCallback(() => {
    if (navIntervalRef.current) {
      clearInterval(navIntervalRef.current);
      navIntervalRef.current = null;
    }
    playSound.emergencyAlarm();
    setRobotState(prev => ({
      ...prev,
      status: 'emergency_stopped',
      emergencyActive: true,
      speedMps: 0,
      screenMessage: 'EMERGENCY STOP ACTIVATED — ALL MOTORS HALTED',
      screenExpression: 'alert',
      sensors: {
        ...prev.sensors,
        lidarStatus: 'blocked',
        cameraStatus: 'obstacle_flag'
      }
    }));
    speechService.speak("Emergency stop activated. All robot movements halted.");
    addLog({
      category: 'emergency',
      level: 'emergency',
      title: 'EMERGENCY STOP TRIGGERED',
      details: 'Manual E-Stop invoked. Motors locked. Staff alert broadcasted.',
      location: robotState.currentZone
    });
  }, [addLog, robotState.currentZone]);

  const clearEmergency = useCallback(() => {
    setRobotState(prev => ({
      ...prev,
      status: 'idle',
      emergencyActive: false,
      speedMps: 0.8,
      screenMessage: 'Emergency cleared. System returned to standby operational state.',
      screenExpression: 'friendly',
      sensors: {
        ...prev.sensors,
        lidarStatus: 'active',
        cameraStatus: 'tracking'
      }
    }));
    playSound.confirm();
    speechService.speak("Emergency cleared. SORA is ready for autonomous assistance.");
    addLog({
      category: 'emergency',
      level: 'success',
      title: 'Emergency State Cleared',
      details: 'Safety diagnostics verified. Normal operational status restored.'
    });
  }, [addLog]);

  // Navigate To Function with dynamic path planning
  const navigateTo = useCallback((destinationId: string, customTaskDescription?: string) => {
    const targetDept = HOSPITAL_DEPARTMENTS.find(d => d.id === destinationId);
    if (!targetDept) return;

    if (robotState.emergencyActive) {
      speechService.speak("Cannot navigate while emergency stop is active. Please clear emergency first.");
      return;
    }

    playSound.confirm();

    // Use doorway coordinate of the destination
    const targetPoint = targetDept.doorGrid;
    const currentPoint = robotState.position;

    // Calculate A* path
    const calculatedPath = findPathAStar(currentPoint, targetPoint, obstacles);

    if (calculatedPath.length <= 1) {
      // Already at destination or no path found
      const msg = `Already at ${targetDept.name} doorway.`;
      speakSora(msg, 'friendly');
      return;
    }

    const taskText = customTaskDescription || `Guiding to ${targetDept.name}`;
    
    setRobotState(prev => ({
      ...prev,
      status: 'navigating',
      targetDestinationId: targetDept.id,
      targetDestinationName: targetDept.name,
      currentTask: taskText,
      activePath: calculatedPath,
      currentPathIndex: 0,
      screenMessage: `En route to ${targetDept.name}. Please follow me safely.`,
      screenExpression: 'navigating'
    }));

    addLog({
      category: 'navigation',
      level: 'info',
      title: `Navigation Dispatched: ${targetDept.name}`,
      details: `Generated A* trajectory with ${calculatedPath.length} waypoints. Est. travel: ${Math.round(calculatedPath.length * 1.2)} sec.`,
      location: targetDept.name
    });

    const verbalMsg = `Certainly! I will guide you to ${targetDept.name}. Please follow me safely.`;
    speakSora(verbalMsg, 'navigating');
  }, [obstacles, robotState.emergencyActive, robotState.position, speakSora, addLog]);

  // Obstacle Management
  const addObstacle = useCallback((x: number, y: number, label: string = 'Temporary Obstacle') => {
    const newObs: Obstacle = {
      id: `obs-dyn-${Date.now()}`,
      x,
      y,
      label,
      type: 'stretcher',
      isDynamic: true
    };
    setObstacles(prev => [...prev, newObs]);
    playSound.obstacleAlert();
    addLog({
      category: 'navigation',
      level: 'warning',
      title: `Obstacle Detected at (${x}, ${y})`,
      details: `${label} positioned in corridor path. Sensor radar triggered.`,
      location: `Corridor Grid (${x}, ${y})`
    });
  }, [addLog]);

  const removeObstacle = useCallback((id: string) => {
    setObstacles(prev => prev.filter(o => o.id !== id));
    addLog({
      category: 'navigation',
      level: 'info',
      title: 'Obstacle Removed',
      details: `Corridor cleared of obstacle ID ${id}.`
    });
  }, [addLog]);

  const clearDynamicObstacles = useCallback(() => {
    setObstacles(INITIAL_OBSTACLES);
    addLog({
      category: 'navigation',
      level: 'info',
      title: 'Dynamic Obstacles Reset',
      details: 'Corridors reset to default hospital baseline.'
    });
  }, [addLog]);

  const pauseNavigation = useCallback(() => {
    setRobotState(prev => ({
      ...prev,
      status: 'paused',
      speedMps: 0,
      screenMessage: 'Navigation paused. Standing by for resumption.',
      screenExpression: 'thinking'
    }));
    playSound.click();
    speakSora("Navigation paused.");
    addLog({
      category: 'navigation',
      level: 'info',
      title: 'Navigation Paused',
      details: 'Robot motion held at current position.'
    });
  }, [addLog, speakSora]);

  const resumeNavigation = useCallback(() => {
    setRobotState(prev => ({
      ...prev,
      status: 'navigating',
      speedMps: 0.8,
      screenMessage: `Resuming journey to ${prev.targetDestinationName || 'destination'}.`,
      screenExpression: 'navigating'
    }));
    playSound.confirm();
    speakSora("Resuming navigation.");
    addLog({
      category: 'navigation',
      level: 'info',
      title: 'Navigation Resumed',
      details: 'Trajectory tracking continued.'
    });
  }, [addLog, speakSora]);

  const cancelNavigation = useCallback(() => {
    setRobotState(prev => ({
      ...prev,
      status: 'idle',
      activePath: [],
      currentPathIndex: 0,
      targetDestinationId: null,
      targetDestinationName: null,
      currentTask: 'Autonomous Patrol & Hospital Escort Ready',
      screenMessage: 'Navigation cancelled. SORA is on standby.',
      screenExpression: 'friendly'
    }));
    playSound.click();
    speakSora("Navigation cancelled. Standing by.");
    addLog({
      category: 'navigation',
      level: 'info',
      title: 'Navigation Cancelled',
      details: 'Active mission aborted by user command.'
    });
  }, [addLog, speakSora]);

  const returnToReception = useCallback(() => {
    navigateTo('reception', 'Returning to Main Reception Base Dock');
  }, [navigateTo]);

  const setRobotSpeed = useCallback((speed: number) => {
    setRobotState(prev => ({ ...prev, speedMps: speed }));
  }, []);

  // Main Simulation Loop for Robot Movement & Dynamic Obstacle Avoidance
  useEffect(() => {
    if (robotState.status !== 'navigating') {
      if (navIntervalRef.current) {
        clearInterval(navIntervalRef.current);
        navIntervalRef.current = null;
      }
      return;
    }

    navIntervalRef.current = setInterval(() => {
      setRobotState(prevState => {
        const { activePath, currentPathIndex, targetDestinationId, targetDestinationName } = prevState;

        if (activePath.length === 0 || currentPathIndex >= activePath.length - 1) {
          // Journey completed!
          playSound.arrival();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });

          const destName = targetDestinationName || 'your destination';
          const arrivalSpeech = `We have arrived at ${destName}. Is there anything else I can help you with?`;
          speechService.speak(arrivalSpeech);

          addLog({
            category: 'navigation',
            level: 'success',
            title: `Arrived at ${destName}`,
            details: `Successfully completed autonomous escort mission. SORA docked in safety zone.`,
            location: destName
          });

          // Check which department zone we are currently in
          const reachedDept = HOSPITAL_DEPARTMENTS.find(d => d.id === targetDestinationId);

          return {
            ...prevState,
            status: 'task_completed',
            currentTask: `Arrived at ${destName}`,
            currentZone: reachedDept ? reachedDept.name : prevState.currentZone,
            screenMessage: arrivalSpeech,
            screenExpression: 'happy',
            completedTasksCount: prevState.completedTasksCount + 1,
            totalDistanceTraveledM: Number((prevState.totalDistanceTraveledM + activePath.length * 1.2).toFixed(1)),
            activePath: [],
            currentPathIndex: 0
          };
        }

        // Check the next immediate waypoint for dynamic obstacle collision
        const nextIndex = currentPathIndex + 1;
        const nextPoint = activePath[nextIndex];

        // Obstacle detection check: is next point or adjacent blocked?
        const obstacleAhead = obstacles.find(
          obs => obs.x === nextPoint.x && obs.y === nextPoint.y
        );

        if (obstacleAhead) {
          // Obstacle detected! Recalculate route using A*
          playSound.obstacleAlert();
          const targetDept = HOSPITAL_DEPARTMENTS.find(d => d.id === targetDestinationId);
          const targetDoor = targetDept ? targetDept.doorGrid : activePath[activePath.length - 1];

          // Recalculate path avoiding this obstacle
          const recalculated = findPathAStar(prevState.position, targetDoor, obstacles);

          if (recalculated.length > 1) {
            speechService.speak("Obstacle detected ahead. Recalculating safe alternative route.");
            addLog({
              category: 'navigation',
              level: 'warning',
              title: `Obstacle Avoidance Triggered`,
              details: `Detected ${obstacleAhead.label} at (${obstacleAhead.x}, ${obstacleAhead.y}). Recalculated alternate path (${recalculated.length} nodes).`,
              location: prevState.currentZone
            });

            return {
              ...prevState,
              status: 'avoiding_obstacle',
              activePath: recalculated,
              currentPathIndex: 0,
              screenMessage: `Obstacle detected! Rerouting safely around ${obstacleAhead.label}...`,
              screenExpression: 'alert',
              sensors: {
                ...prevState.sensors,
                frontDistanceCm: 45,
                lidarStatus: 'warning',
                cameraStatus: 'obstacle_flag',
                detectedObject: obstacleAhead.label
              }
            };
          } else {
            // Path completely blocked
            speechService.speak("Path blocked by obstacle. Awaiting clearance.");
            return {
              ...prevState,
              status: 'paused',
              screenMessage: 'Path blocked! Please clear corridor to resume.',
              screenExpression: 'alert',
              sensors: {
                ...prevState.sensors,
                frontDistanceCm: 30,
                lidarStatus: 'blocked'
              }
            };
          }
        }

        // Normal movement along waypoint
        const currentCoord = activePath[currentPathIndex];
        const nextCoord = activePath[nextIndex];
        const heading = calculateHeading(currentCoord, nextCoord);

        // Radar ping sound occasionally
        if (nextIndex % 4 === 0) {
          playSound.radarPing();
        }

        // Simulate realistic sensor readings based on distance
        const simulatedFrontDist = Math.max(120, Math.floor(250 + (Math.random() * 40 - 20)));
        const simulatedLeftDist = Math.max(80, Math.floor(140 + (Math.random() * 30 - 15)));
        const simulatedRightDist = Math.max(80, Math.floor(155 + (Math.random() * 30 - 15)));

        // Battery slowly depletes over continuous travel
        const newBattery = Math.max(15, prevState.batteryPct - (Math.random() < 0.1 ? 1 : 0));

        // Determine current room/corridor zone
        const inDept = HOSPITAL_DEPARTMENTS.find(
          d => nextCoord.x >= d.bounds.x && 
               nextCoord.x < d.bounds.x + d.bounds.w && 
               nextCoord.y >= d.bounds.y && 
               nextCoord.y < d.bounds.y + d.bounds.h
        );
        const zoneName = inDept ? inDept.name : 'Central Corridor Concourse';

        return {
          ...prevState,
          status: 'navigating',
          position: nextCoord,
          currentPathIndex: nextIndex,
          headingAngle: heading,
          batteryPct: newBattery,
          currentZone: zoneName,
          screenExpression: 'navigating',
          sensors: {
            ...prevState.sensors,
            frontDistanceCm: simulatedFrontDist,
            leftDistanceCm: simulatedLeftDist,
            rightDistanceCm: simulatedRightDist,
            lidarStatus: 'active',
            cameraStatus: 'tracking',
            detectedObject: null
          }
        };
      });
    }, 700);

    return () => {
      if (navIntervalRef.current) {
        clearInterval(navIntervalRef.current);
      }
    };
  }, [robotState.status, obstacles, addLog]);

  // Voice Command Parsing with intelligent action matching
  const handleVoiceCommand = useCallback((transcript: string): string => {
    const text = transcript.toLowerCase().trim();
    addLog({
      category: 'voice',
      level: 'info',
      title: 'Voice Command Received',
      details: `Heard: "${transcript}"`
    });

    // 1. Emergency
    if (text.includes('emergency') || text.includes('call staff') || text.includes('code blue') || text.includes('help me') || text.includes('call assistance')) {
      setActiveSection('emergency');
      const resp = "Initiating emergency hospital assistance protocols. Hospital staff notified.";
      speakSora(resp, 'alert');
      return resp;
    }

    // 2. Pharmacy navigation
    if (text.includes('pharmacy') || text.includes('medicine') || text.includes('drugs')) {
      navigateTo('pharmacy');
      return "Navigating to Central Pharmacy.";
    }

    // 3. Cardiology
    if (text.includes('cardiology') || text.includes('heart doctor')) {
      navigateTo('opd', 'Guiding to Cardiology Consultation (OPD)');
      return "Navigating to OPD Cardiology Department.";
    }

    // 4. Doctors / Appointment
    if (text.includes('doctor') || text.includes('physician') || text.includes('specialist')) {
      setActiveSection('doctors');
      const resp = "Opening the hospital doctors directory and availability schedule.";
      speakSora(resp, 'friendly');
      return resp;
    }

    if (text.includes('appointment') || text.includes('book')) {
      setActiveSection('doctors');
      const resp = "Opening appointment booking portal. Please select your specialist and preferred time slot.";
      speakSora(resp, 'friendly');
      return resp;
    }

    // 5. MRI & CT Scan
    if (text.includes('mri') || text.includes('ct scan') || text.includes('radiology') || text.includes('x-ray')) {
      navigateTo('mri_ct');
      return "Navigating to MRI and CT Scan suite.";
    }

    // 6. Billing
    if (text.includes('billing') || text.includes('counter') || text.includes('payment') || text.includes('discharge')) {
      navigateTo('billing');
      return "Guiding you to the Billing and Insurance Counter.";
    }

    // 7. Pathology Lab
    if (text.includes('pathology') || text.includes('lab') || text.includes('blood test') || text.includes('sample')) {
      navigateTo('pathology');
      return "Navigating to Pathology and Diagnostic Laboratory.";
    }

    // 8. ICU
    if (text.includes('icu') || text.includes('intensive care')) {
      navigateTo('icu');
      return "Navigating to Intensive Care Unit.";
    }

    // 9. Lift / Elevator
    if (text.includes('lift') || text.includes('elevator')) {
      navigateTo('lift');
      return "Guiding you to the Smart Elevator Bank.";
    }

    // 10. Exit
    if (text.includes('exit') || text.includes('leave') || text.includes('outside') || text.includes('ambulance bay')) {
      navigateTo('exit');
      return "Guiding you to the Hospital Exit.";
    }

    // 11. Reception / Dock
    if (text.includes('reception') || text.includes('dock') || text.includes('lobby') || text.includes('go home') || text.includes('return')) {
      returnToReception();
      return "Returning to Main Reception Base Dock.";
    }

    // 12. Stop / Pause
    if (text.includes('stop') || text.includes('halt')) {
      emergencyStop();
      return "Emergency stop activated.";
    }

    // 13. Status report
    if (text.includes('status') || text.includes('battery') || text.includes('report')) {
      const resp = `Battery is at ${robotState.batteryPct}%. Current status is ${robotState.status}. Location: ${robotState.currentZone}. All sensors operational.`;
      speakSora(resp, 'friendly');
      return resp;
    }

    // Fallback friendly reply
    const fallback = `I heard "${transcript}". You can ask me to guide you to Pharmacy, OPD, Emergency, MRI, Billing, find doctors, or book appointments.`;
    speakSora(fallback, 'thinking');
    return fallback;
  }, [addLog, navigateTo, returnToReception, emergencyStop, robotState.batteryPct, robotState.currentZone, robotState.status, speakSora]);

  // Book Appointment
  const bookAppointment = useCallback((apt: Omit<AppointmentRecord, 'id' | 'tokenNumber' | 'status' | 'createdAt'>): AppointmentRecord => {
    const token = `${apt.department.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: AppointmentRecord = {
      ...apt,
      id: `apt-${Date.now()}`,
      tokenNumber: token,
      status: 'Confirmed',
      createdAt: 'Just now'
    };

    setAppointments(prev => [newRecord, ...prev]);
    playSound.confirm();
    addLog({
      category: 'system',
      level: 'success',
      title: `Appointment Booked: ${token}`,
      details: `${apt.patientName} scheduled with ${apt.doctorName} for ${apt.date} at ${apt.timeSlot}.`,
      location: apt.doctorRoom
    });

    speakSora(`Appointment confirmed for ${apt.patientName} with ${apt.doctorName}. Token number is ${token}.`, 'happy');
    return newRecord;
  }, [addLog, speakSora]);

  // Request Medicine Delivery
  const requestMedicineDelivery = useCallback((
    medicineName: string, 
    destinationZone: string, 
    priority: DeliveryMission['priority']
  ) => {
    const newMission: DeliveryMission = {
      id: `del-${Math.floor(8000 + Math.random() * 1000)}`,
      medicineName,
      quantity: 1,
      destinationZone,
      priority,
      stage: 'request_received',
      requestedBy: 'Clinical Nurse Station',
      timestamp: 'Just now',
      estimatedArrivalMin: priority.includes('STAT') ? 2 : 5,
      verificationDoctor: 'Duty Pharmacist'
    };

    setDeliveries(prev => [newMission, ...prev]);
    playSound.confirm();
    addLog({
      category: 'delivery',
      level: priority.includes('STAT') ? 'warning' : 'info',
      title: `Delivery Requested: ${medicineName}`,
      details: `Destination: ${destinationZone}. Priority: ${priority}. Pending pharmacy authorization.`,
      location: 'Central Pharmacy & Dispensary'
    });

    speakSora(`Delivery request logged for ${medicineName} to ${destinationZone}. Awaiting pharmacy verification.`, 'thinking');
  }, [addLog, speakSora]);

  // Advance Delivery Stage Simulation
  const advanceDeliveryStage = useCallback((deliveryId: string) => {
    setDeliveries(prev => prev.map(del => {
      if (del.id !== deliveryId) return del;

      let nextStage: DeliveryMission['stage'] = del.stage;
      if (del.stage === 'request_received') nextStage = 'pharmacy_verification';
      else if (del.stage === 'pharmacy_verification') nextStage = 'authorized_preparation';
      else if (del.stage === 'authorized_preparation') nextStage = 'robot_delivery';
      else if (del.stage === 'robot_delivery') nextStage = 'delivery_completed';

      playSound.confirm();
      addLog({
        category: 'delivery',
        level: nextStage === 'delivery_completed' ? 'success' : 'info',
        title: `Delivery ${del.id} Updated`,
        details: `Stage updated to: ${nextStage.replace('_', ' ').toUpperCase()}`,
        location: del.destinationZone
      });

      if (nextStage === 'robot_delivery') {
        // Dispatch robot to the delivery zone
        const targetDept = HOSPITAL_DEPARTMENTS.find(d => del.destinationZone.includes(d.name) || del.destinationZone.includes(d.id));
        if (targetDept) {
          navigateTo(targetDept.id, `Autonomous Delivery: ${del.medicineName} -> ${del.destinationZone}`);
        }
      }

      return {
        ...del,
        stage: nextStage
      };
    }));
  }, [addLog, navigateTo]);

  // 10-Step Guided Innovation Competition Demo Mode
  const startDemo = useCallback(() => {
    setIsDemoRunning(true);
    setDemoStepNumber(1);
    setActiveSection('map');

    // Step 1: SORA Introduction
    const introText = "Hello! I am SORA, your hospital assistance robot. How can I help you today?";
    speakSora(introText, 'happy', () => {
      // Step 2 & 3: Selection of Pharmacy
      setTimeout(() => {
        setDemoStepNumber(2);
        const step2Text = "Visitor has selected Central Pharmacy on the touch interface.";
        setRobotState(prev => ({
          ...prev,
          screenMessage: "Selected: Central Pharmacy & Dispensary",
          screenExpression: 'thinking'
        }));

        setTimeout(() => {
          setDemoStepNumber(3);
          const confirmText = "Certainly! I will guide you to the central pharmacy.";
          speakSora(confirmText, 'navigating', () => {
            // Step 4 & 5: Robot starts moving on virtual hospital map
            setDemoStepNumber(4);
            const pharmacyDept = HOSPITAL_DEPARTMENTS.find(d => d.id === 'pharmacy')!;
            const path = findPathAStar(robotState.position, pharmacyDept.doorGrid, obstacles);

            setRobotState(prev => ({
              ...prev,
              status: 'navigating',
              targetDestinationId: 'pharmacy',
              targetDestinationName: 'Central Pharmacy & Dispensary',
              currentTask: 'Guided Demo: Escorting Visitor to Pharmacy',
              activePath: path,
              currentPathIndex: 0,
              screenMessage: "En route to Pharmacy. Real-time path tracing active.",
              screenExpression: 'navigating'
            }));

            // Step 6: Spawn dynamic obstacle right along the corridor after 3.5 seconds
            setTimeout(() => {
              setDemoStepNumber(6);
              // Spawn obstacle near coordinate (11, 10) or in front
              addObstacle(10, 8, 'Emergency Stretcher in Transit');

              // Step 7: Obstacle detection & automatic recalculation
              setTimeout(() => {
                setDemoStepNumber(7);
                // The simulation loop naturally detects this obstacle, sounds alert, and recalculates A* path!
              }, 1200);
            }, 3500);
          });
        }, 1800);
      }, 2500);
    });
  }, [speakSora, robotState.position, obstacles, addObstacle]);

  const stopDemo = useCallback(() => {
    setIsDemoRunning(false);
    setDemoStepNumber(0);
    cancelNavigation();
    clearDynamicObstacles();
    speakSora("Demonstration mode reset. SORA returned to standby.", 'friendly');
  }, [cancelNavigation, clearDynamicObstacles, speakSora]);

  return (
    <HospitalContext.Provider
      value={{
        activeSection,
        setActiveSection,
        robotState,
        departments: HOSPITAL_DEPARTMENTS,
        obstacles,
        activeDestination,
        navigateTo,
        pauseNavigation,
        resumeNavigation,
        cancelNavigation,
        returnToReception,
        emergencyStop,
        clearEmergency,
        setRobotSpeed,
        addObstacle,
        removeObstacle,
        clearDynamicObstacles,
        speakSora,
        handleVoiceCommand,
        isVoiceSpeaking,
        isVoiceMuted,
        toggleMuteVoice,
        doctors,
        appointments,
        bookAppointment,
        medicines,
        deliveries,
        requestMedicineDelivery,
        advanceDeliveryStage,
        activityLogs,
        addLog,
        isDemoRunning,
        demoStepNumber,
        startDemo,
        stopDemo
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
