export type TabType = 'doorstep' | 'cctv' | 'family-care' | 'sos-hub' | 'devices-data';

export type VoiceMaskType = 'deep' | 'neutral' | 'higher' | 'original';

export interface DoorstepLogItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  badge: string;
  icon: string;
  badgeColor?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  details: string;
  phone?: string;
  avatar: string;
  icon: string;
  statusText?: string;
  isPrimary?: boolean;
}

export interface HardwareNode {
  id: string;
  name: string;
  location: string;
  badge: string;
  badgeType?: 'gateway' | 'secured' | 'non-optical' | 'failsafe';
  details: string;
  icon: string;
  extraInfo?: string;
  status: 'online' | 'active' | 'mesh';
  // Hardware Integrity fields:
  batteryLevel: number; // percentage, e.g. 94
  batteryStatus: 'charging' | 'full' | 'mains_backup' | 'solar_float' | 'discharging';
  powerSource: string; // e.g. 'AC Mains + Li-ion UPS'
  batteryHealth: string; // e.g. '100% Optimal'
  mmWaveStatus: 'connected' | 'synchronized' | 'active' | 'coordinator' | 'standby';
  mmWaveBand: string; // e.g. '60 GHz FMCW'
  mmWaveSignalDbm: number; // e.g. -38
  mmWaveLatencyMs: number; // e.g. 0.4
  mmWaveVoxelRate: string; // e.g. '120 fps point-cloud'
  lastHeartbeat: string; // e.g. '1s ago'
  temperature?: string; // e.g. '31.4°C'
  macAddress?: string; // e.g. 'SH:402:NOD:04'
}

export interface HouseholdMember {
  id: string;
  name: string;
  role: string;
  permission: string;
  initials: string;
  icon: string;
  isFiduciary?: boolean;
  isTemporary?: boolean;
  schedule?: string;
}

export interface IncidentAuditStep {
  id: string;
  title: string;
  time: string;
  description: string;
  color: string;
}

export interface ResponderNote {
  id: string;
  author: string;
  role: string;
  time: string;
  content: string;
  icon: string;
}

export interface MmWaveRoomSensitivity {
  id: string;
  roomName: string;
  nodeId: string;
  nodeName: string;
  sensitivity: number; // 10 to 100 (%)
  confirmationWindowSec: number; // 0.5 to 3.0 (sec)
  noiseFilter: boolean;
  petImmunity: boolean;
  zoneType: 'bed_sitting' | 'wet_area' | 'corridor' | 'living' | 'exterior';
  lastCalibrated?: string;
}

export interface PostFallChecklistItem {
  id: string;
  title: string;
  description: string;
  done: boolean;
}

export interface ToastNotification {
  id: string;
  message: string;
  icon?: string;
}

export interface LocalIncidentRecord {
  id: string;
  title: string;
  type: 'fall_alert' | 'doorbell' | 'sos' | 'radar_anomaly';
  timestamp: string;
  rawTimestamp: number;
  status: 'Resolved' | 'Active' | 'Investigating';
  sensorZone: string;
  peakImpact?: string;
  acousticLevel?: string;
  vitalsRate?: string;
  notesCount: number;
  syncStatus: 'local_indexeddb_only' | 'cloud_synced';
  description: string;
  encryptedVoxelHash?: string;
}

export interface InHomeCctvCamera {
  id: string;
  name: string;
  location: string;
  zone: string;
  resolution: string;
  fps: number;
  bitrate: string;
  imageUrl: string;
  isOnline: boolean;
  shutterState: 'open' | 'closed'; // Physical privacy shutter
  nightVision: 'auto' | 'on' | 'off';
  hasPtz: boolean;
  panAngle: number; // degrees
  tiltAngle: number; // degrees
  zoomLevel: 1 | 2 | 4;
  motionDetected: boolean;
  lastMotionTime: string;
  powerSource: string;
  hardwareModel: string;
  privacyMaskEnabled: boolean;
}

export interface InHomeCctvEvent {
  id: string;
  cameraId: string;
  cameraName: string;
  title: string;
  time: string;
  type: 'motion' | 'person' | 'pet' | 'shutter_change';
  durationSec: number;
  thumbnailUrl: string;
  verified: boolean;
}


