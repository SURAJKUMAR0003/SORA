export type RobotStatus = 
  | 'idle' 
  | 'navigating' 
  | 'avoiding_obstacle' 
  | 'paused' 
  | 'emergency_stopped' 
  | 'charging' 
  | 'speaking' 
  | 'task_completed';

export interface GridPoint {
  x: number;
  y: number;
}

export interface SensorData {
  frontDistanceCm: number;
  leftDistanceCm: number;
  rightDistanceCm: number;
  lidarStatus: 'active' | 'warning' | 'blocked';
  cameraStatus: 'tracking' | 'obstacle_flag' | 'standby';
  detectedObject?: string | null;
  surfaceStatus: 'normal' | 'ramp' | 'threshold';
}

export interface RobotState {
  id: string;
  name: string;
  status: RobotStatus;
  position: GridPoint;
  currentFloor: string;
  currentZone: string;
  headingAngle: number; // 0 to 360 deg
  speedMps: number;
  batteryPct: number;
  isCharging: boolean;
  currentTask: string;
  targetDestinationId: string | null;
  targetDestinationName: string | null;
  screenMessage: string;
  screenExpression: 'friendly' | 'thinking' | 'navigating' | 'alert' | 'happy';
  completedTasksCount: number;
  totalDistanceTraveledM: number;
  sensors: SensorData;
  emergencyActive: boolean;
  isVoiceMuted: boolean;
  activePath: GridPoint[];
  currentPathIndex: number;
}

export interface DepartmentZone {
  id: string;
  name: string;
  code: string;
  category: 'clinical' | 'emergency' | 'diagnostic' | 'service' | 'general';
  grid: GridPoint;
  doorGrid: GridPoint;
  bounds: { x: number; y: number; w: number; h: number };
  color: string;
  description: string;
  iconName: string;
  staffOnDuty: string;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'stretcher' | 'cleaning_cart' | 'visitor' | 'medical_equipment' | 'spill';
  isDynamic?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  qualification: string;
  experienceYears: number;
  roomNumber: string;
  consultationFee: string;
  rating: number;
  availableDays: string[];
  slots: string[];
  avatarUrl: string;
}

export interface AppointmentRecord {
  id: string;
  patientName: string;
  patientPhone: string;
  department: string;
  doctorName: string;
  doctorRoom: string;
  date: string;
  timeSlot: string;
  tokenNumber: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
  createdAt: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  category: string;
  stockCount: number;
  dosageForm: string;
  shelfLocation: string;
  requiresPrescription: boolean;
  temperatureStorage: string;
}

export type DeliveryPipelineStage = 
  | 'request_received' 
  | 'pharmacy_verification' 
  | 'authorized_preparation' 
  | 'robot_delivery' 
  | 'delivery_completed';

export interface DeliveryMission {
  id: string;
  medicineName: string;
  quantity: number;
  destinationZone: string;
  priority: 'Routine' | 'Urgent' | 'STAT (Emergency)';
  stage: DeliveryPipelineStage;
  requestedBy: string;
  timestamp: string;
  estimatedArrivalMin: number;
  verificationDoctor: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  category: 'navigation' | 'voice' | 'delivery' | 'emergency' | 'system';
  level: 'info' | 'success' | 'warning' | 'emergency';
  title: string;
  details: string;
  location?: string;
}

export interface DemoStep {
  stepNumber: number;
  title: string;
  description: string;
  speechText?: string;
  actionType: 'voice_intro' | 'select_pharmacy' | 'confirm_speech' | 'navigate_start' | 'monitor_route' | 'spawn_obstacle' | 'detect_recalculate' | 'reach_destination' | 'announce_arrival' | 'log_complete';
  robotExpression: 'friendly' | 'thinking' | 'navigating' | 'alert' | 'happy';
}
