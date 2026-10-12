import {
  DoorstepLogItem,
  EmergencyContact,
  HardwareNode,
  HouseholdMember,
  IncidentAuditStep,
  ResponderNote,
  PostFallChecklistItem,
  InHomeCctvCamera,
  InHomeCctvEvent
} from '../types';

export const DOORSTEP_LOGS: DoorstepLogItem[] = [
  {
    id: 'log-1',
    title: 'Amazon India Courier',
    subtitle: 'Box placed on doormat',
    time: '8:15 PM',
    badge: 'Verified',
    icon: 'local_shipping',
    badgeColor: 'text-[#b81c37]'
  },
  {
    id: 'log-2',
    title: 'Staff Entry: Sunita D.',
    subtitle: 'RFID Keyfob + Passcode',
    time: '6:30 PM',
    badge: 'Logged',
    icon: 'badge',
    badgeColor: 'text-on-surface-variant'
  },
  {
    id: 'log-3',
    title: 'Blinkit Instant Delivery',
    subtitle: '1 bag · Masked voice intercom used',
    time: '3:45 PM',
    badge: 'Verified',
    icon: 'shopping_bag',
    badgeColor: 'text-[#b81c37]'
  },
  {
    id: 'log-4',
    title: 'Society Facility Maintenance',
    subtitle: 'Water meter inspection entry pass',
    time: '11:20 AM',
    badge: 'Guest PIN',
    icon: 'engineering',
    badgeColor: 'text-[#ac7f39]'
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'c-1',
    name: 'Santanu Sen',
    relation: 'Primary (You)',
    details: 'Instant App Push + Voice Alert Call',
    avatar: 'S',
    icon: 'call',
    isPrimary: true
  },
  {
    id: 'c-2',
    name: 'Ananya Sen',
    relation: 'Daughter',
    details: 'SMS + Automated Voice Escalation',
    phone: '+91 98450 12890',
    avatar: 'A',
    icon: 'sms'
  },
  {
    id: 'c-3',
    name: 'Dr. V. Sharma',
    relation: 'Family Physician',
    details: 'SMS with Location & Vitals summary',
    avatar: 'DR',
    icon: 'medical_services'
  },
  {
    id: 'c-4',
    name: 'Society Guard Desk',
    relation: 'Intercom Gate 1',
    details: '+91 98765 24001 · Quick Physical Check',
    avatar: 'GD',
    icon: 'security'
  }
];

export const HARDWARE_NODES: HardwareNode[] = [
  {
    id: 'node-1',
    name: 'SafeHaven GigaHub',
    location: 'Gateway (Living Room)',
    badge: 'GATEWAY',
    badgeType: 'gateway',
    details: 'Firmware v4.8.2 · Sovereign Edge Coordinator',
    icon: 'router',
    extraInfo: 'Dual-Band 60GHz Mesh Coordinator · Hardware Firewall Active',
    status: 'online',
    batteryLevel: 100,
    batteryStatus: 'full',
    powerSource: 'Dual-Rail AC Mains + LiFePO4 UPS (48h Reserve)',
    batteryHealth: '100% Float Armed',
    mmWaveStatus: 'coordinator',
    mmWaveBand: '60-64 GHz Mesh Coordinator',
    mmWaveSignalDbm: -32,
    mmWaveLatencyMs: 0.2,
    mmWaveVoxelRate: '120 fps Central Aggregator',
    lastHeartbeat: 'Live < 1s',
    temperature: '32.1°C',
    macAddress: 'SH:402:HUB:01'
  },
  {
    id: 'node-2',
    name: 'mmWave Radar Pod 04',
    location: 'Hallway & Restroom Transit',
    badge: 'Non-Optical',
    badgeType: 'non-optical',
    details: '60GHz FMCW Sub-mm · Fall Velocity & Presence',
    icon: 'radar',
    extraInfo: 'Zero Optical Lenses · Privacy-Preserving Micro-Doppler Array',
    status: 'active',
    batteryLevel: 94,
    batteryStatus: 'mains_backup',
    powerSource: 'AC Line Float + 3,200mAh Li-ion (18h Reserve)',
    batteryHealth: '98% Cycle Life',
    mmWaveStatus: 'connected',
    mmWaveBand: '60 GHz FMCW Sub-mm',
    mmWaveSignalDbm: -38,
    mmWaveLatencyMs: 0.4,
    mmWaveVoxelRate: '120 fps point-cloud',
    lastHeartbeat: 'Live 1s ago',
    temperature: '29.8°C',
    macAddress: 'SH:402:POD:04'
  },
  {
    id: 'node-3',
    name: 'mmWave Radar Pod 01',
    location: 'Parents Suite (North Wall)',
    badge: 'Non-Optical',
    badgeType: 'non-optical',
    details: '60GHz High-Res FMCW · Micro-Vitals & Sleep Posture',
    icon: 'radar',
    extraInfo: 'Chest Expansion & Respiration Rate (0.1mm displacement sensing)',
    status: 'active',
    batteryLevel: 91,
    batteryStatus: 'mains_backup',
    powerSource: 'Internal Li-ion Cell (26-Day Autonomous Reserve)',
    batteryHealth: '99% Cycle Life',
    mmWaveStatus: 'synchronized',
    mmWaveBand: '60 GHz FMCW Sub-mm',
    mmWaveSignalDbm: -41,
    mmWaveLatencyMs: 0.6,
    mmWaveVoxelRate: '120 fps point-cloud',
    lastHeartbeat: 'Live 2s ago',
    temperature: '30.2°C',
    macAddress: 'SH:402:POD:01'
  },
  {
    id: 'node-4',
    name: 'mmWave Radar Pod 02',
    location: 'Living & Dining Area',
    badge: 'Non-Optical',
    badgeType: 'non-optical',
    details: '60GHz 3D Spatial Radar · Multi-Target Gait Tracking',
    icon: 'radar',
    extraInfo: 'Multi-Target Walking Velocity & Sudden Impact Deceleration Engine',
    status: 'active',
    batteryLevel: 96,
    batteryStatus: 'mains_backup',
    powerSource: 'AC Line Continuous + Li-ion UPS',
    batteryHealth: '100% Optimal',
    mmWaveStatus: 'synchronized',
    mmWaveBand: '60 GHz FMCW Sub-mm',
    mmWaveSignalDbm: -39,
    mmWaveLatencyMs: 0.5,
    mmWaveVoxelRate: '120 fps point-cloud',
    lastHeartbeat: 'Live 1s ago',
    temperature: '30.9°C',
    macAddress: 'SH:402:POD:02'
  },
  {
    id: 'node-5',
    name: 'Voice-Mask Cam',
    location: 'Doorstep & Intercom Entry',
    badge: 'Secured',
    badgeType: 'secured',
    details: 'Micro-Doppler Wake + Acoustic Scrambler',
    icon: 'door_front',
    extraInfo: 'Auxiliary 24GHz Doppler Radar for instant zero-optical wake-up',
    status: 'active',
    batteryLevel: 88,
    batteryStatus: 'discharging',
    powerSource: 'Heavy-Duty Li-ion Cell (38 Days Remaining)',
    batteryHealth: '96% Cycle Life',
    mmWaveStatus: 'standby',
    mmWaveBand: '24 GHz Doppler Radar',
    mmWaveSignalDbm: -45,
    mmWaveLatencyMs: 1.1,
    mmWaveVoxelRate: 'Radar-Wake Low Power',
    lastHeartbeat: 'Live 3s ago',
    temperature: '33.4°C',
    macAddress: 'SH:402:CAM:01'
  },
  {
    id: 'node-6',
    name: 'Satellite Cellular Relay',
    location: 'Tower A Rooftop',
    badge: 'FAILSAFE',
    badgeType: 'failsafe',
    details: 'Sub-GHz Mesh + Encrypted VoLTE Standby',
    icon: 'cell_tower',
    extraInfo: '100% Mesh Signal · Zero Reliance on Public Internet Infrastructure',
    status: 'mesh',
    batteryLevel: 99,
    batteryStatus: 'solar_float',
    powerSource: 'Rooftop Solar PV + Dual LiFePO4 Pack',
    batteryHealth: '100% Solar Float',
    mmWaveStatus: 'active',
    mmWaveBand: 'Sub-GHz Radar Mesh Backhaul',
    mmWaveSignalDbm: -44,
    mmWaveLatencyMs: 1.8,
    mmWaveVoxelRate: 'Direct RF Mesh Relay',
    lastHeartbeat: 'Live 4s ago',
    temperature: '34.6°C',
    macAddress: 'SH:402:RLY:01'
  }
];

export const HOUSEHOLD_MEMBERS: HouseholdMember[] = [
  {
    id: 'm-1',
    name: 'Santanu',
    role: 'Primary Fiduciary',
    permission: 'Master Hardware Keyring',
    initials: 'SK',
    icon: 'admin_panel_settings',
    isFiduciary: true
  },
  {
    id: 'm-2',
    name: 'Pooja',
    role: 'Full Access',
    permission: 'Biometric Intercom & Fall Monitor',
    initials: 'PK',
    icon: 'key'
  },
  {
    id: 'm-3',
    name: 'Lata Bai (Domestic Help)',
    role: 'Ephemeral PIN',
    permission: 'Gate Access: Mon–Sat 8:00 AM – 11:00 AM',
    initials: 'LR',
    icon: 'timer',
    isTemporary: true,
    schedule: 'Active'
  }
];

export const INCIDENT_STEPS: IncidentAuditStep[] = [
  {
    id: 's-1',
    title: 'mmWave Radar Pod Triggered',
    time: '08:43:12 PM',
    description: 'Sudden 0.4s vertical drop registered at 0.12m floor clearance plane.',
    color: 'bg-[#b81c37]'
  },
  {
    id: 's-2',
    title: 'Multi-channel Escalation Fired',
    time: '08:43:15 PM',
    description: 'High-priority push to Santanu; Auto-dialer IVR routed to Ananya.',
    color: 'bg-[#ac7f39]'
  },
  {
    id: 's-3',
    title: '2-Way Voice Intercom Connected',
    time: '08:43:40 PM',
    description: 'Acoustic speaker activated; patient acknowledged awareness and requested water.',
    color: 'bg-[#060810]'
  },
  {
    id: 's-4',
    title: 'Society Security Gate 1 Alerted',
    time: '08:44:10 PM',
    description: 'Guard Ramesh dispatched with physical emergency master keycard.',
    color: 'bg-[#060810]'
  },
  {
    id: 's-5',
    title: 'Smart Lock Remote Release',
    time: '08:46:05 PM',
    description: 'Apartment 402, Tower A entrance unlocked via verified biometric app authorization.',
    color: 'bg-[#2d6a4f]'
  },
  {
    id: 's-6',
    title: 'Stand-down Logged / Safe',
    time: '08:47:24 PM',
    description: 'Santanu confirmed stable posture. Emergency 112 trigger cancelled.',
    color: 'bg-[#2d6a4f]'
  }
];

export const RESPONDER_NOTES: ResponderNote[] = [
  {
    id: 'n-1',
    author: 'Guard Ramesh',
    role: 'Gate 1 Security',
    time: '8:46 PM Check',
    content: '“Assisted Smt. Sen to the living sofa. Conscious, oriented, drank a full glass of warm water. No visible lacerations.”',
    icon: 'shield_person'
  },
  {
    id: 'n-2',
    author: 'Dr. V. Sharma',
    role: 'On-call Physician',
    time: '8:55 PM Video',
    content: '“Pupils equal & reactive. Motor strength normal bilaterally. Mild left forearm contusion noted. Keep observation log for 12 hours.”',
    icon: 'stethoscope'
  }
];

export const POST_FALL_TASKS: PostFallChecklistItem[] = [
  {
    id: 't-1',
    title: 'Blood Pressure & Vitals Record',
    description: 'Recorded: 124/82 mmHg · Pulse 76 bpm (Stable)',
    done: true
  },
  {
    id: 't-2',
    title: 'Cold Gel Pack on Left Forearm',
    description: '15 min soothing application completed by caregiver',
    done: true
  },
  {
    id: 't-3',
    title: 'Gait Stability Diagnostic Recalibration',
    description: 'Scheduled for tomorrow, 10:00 AM via Hallway Node',
    done: false
  }
];

export const IN_HOME_CAMERAS: InHomeCctvCamera[] = [
  {
    id: 'cam-living',
    name: 'Living Room 360° PTZ',
    location: 'Central Living Ceiling Mount',
    zone: 'Indoor Common Area',
    resolution: '2K QHD (2560×1440)',
    fps: 30,
    bitrate: '2.4 Mbps',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    isOnline: true,
    shutterState: 'open',
    nightVision: 'auto',
    hasPtz: true,
    panAngle: 42,
    tiltAngle: -12,
    zoomLevel: 1,
    motionDetected: true,
    lastMotionTime: 'Live (2m ago)',
    powerSource: 'AC Line + 12h Li-ion UPS',
    hardwareModel: 'SafeHaven Sentry PTZ-2K',
    privacyMaskEnabled: false
  },
  {
    id: 'cam-balcony',
    name: 'Balcony & Perimeter',
    location: 'East Terrace Overlook',
    zone: 'Exterior Perimeter',
    resolution: '2K HDR Ultra-Wide',
    fps: 30,
    bitrate: '2.1 Mbps',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    isOnline: true,
    shutterState: 'open',
    nightVision: 'auto',
    hasPtz: true,
    panAngle: 180,
    tiltAngle: -20,
    zoomLevel: 1,
    motionDetected: false,
    lastMotionTime: '18m ago',
    powerSource: 'Solar Float + Battery Reserve',
    hardwareModel: 'SafeHaven Shield Outdoor-2K',
    privacyMaskEnabled: false
  },
  {
    id: 'cam-dining',
    name: 'Kitchen & Dining Area',
    location: 'Kitchen Island Entryway',
    zone: 'Utility & Dining',
    resolution: '1080p Full HD',
    fps: 30,
    bitrate: '1.6 Mbps',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    isOnline: true,
    shutterState: 'open',
    nightVision: 'auto',
    hasPtz: false,
    panAngle: 0,
    tiltAngle: 0,
    zoomLevel: 1,
    motionDetected: false,
    lastMotionTime: '1h 24m ago',
    powerSource: 'AC Mains Float',
    hardwareModel: 'SafeHaven Eye Fixed-1080',
    privacyMaskEnabled: true
  },
  {
    id: 'cam-corridor',
    name: 'Corridor & Foyer Transit',
    location: 'Bedrooms Antechamber',
    zone: 'Interior Transit',
    resolution: '1080p Infrared Low-Light',
    fps: 24,
    bitrate: '1.2 Mbps',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    isOnline: true,
    shutterState: 'closed', // Default closed for privacy!
    nightVision: 'auto',
    hasPtz: true,
    panAngle: 90,
    tiltAngle: -5,
    zoomLevel: 1,
    motionDetected: false,
    lastMotionTime: '4h ago',
    powerSource: 'AC Mains + Li-ion UPS',
    hardwareModel: 'SafeHaven PrivacyGuard-PTZ',
    privacyMaskEnabled: false
  }
];

export const IN_HOME_CCTV_EVENTS: InHomeCctvEvent[] = [
  {
    id: 'evt-1',
    cameraId: 'cam-living',
    cameraName: 'Living Room 360° PTZ',
    title: 'Caregiver Assisted Walk',
    time: '9:30 PM',
    type: 'person',
    durationSec: 42,
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    verified: true
  },
  {
    id: 'evt-2',
    cameraId: 'cam-living',
    cameraName: 'Living Room 360° PTZ',
    title: 'Pet Motion near Balcony Door',
    time: '8:48 PM',
    type: 'pet',
    durationSec: 18,
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    verified: true
  },
  {
    id: 'evt-3',
    cameraId: 'cam-balcony',
    cameraName: 'Balcony & Perimeter',
    title: 'Plant Foliage Motion / Gust',
    time: '7:15 PM',
    type: 'motion',
    durationSec: 25,
    thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    verified: false
  },
  {
    id: 'evt-4',
    cameraId: 'cam-corridor',
    cameraName: 'Corridor & Foyer Transit',
    title: 'Physical Privacy Shutter Engaged',
    time: '6:00 PM',
    type: 'shutter_change',
    durationSec: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    verified: true
  }
];

