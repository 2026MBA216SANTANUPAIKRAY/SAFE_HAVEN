import React, { useState, useCallback } from 'react';
import { TabType, VoiceMaskType, ToastNotification } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { DoorstepTab } from './components/DoorstepTab';
import { CctvTab } from './components/CctvTab';
import { FamilyCareTab } from './components/FamilyCareTab';
import { SosHubTab } from './components/SosHubTab';
import { DevicesDataTab } from './components/DevicesDataTab';
import { IncomingCallModal } from './components/IncomingCallModal';
import { ActiveCallModal } from './components/ActiveCallModal';
import { CriticalFallModal } from './components/CriticalFallModal';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { saveLocalIncident } from './utils/indexedDB';
import { HARDWARE_NODES } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('doorstep');
  const [cctvSubMode, setCctvSubMode] = useState<'doorstep' | 'in-home'>('doorstep');
  const [activeVoiceMask, setActiveVoiceMask] = useState<VoiceMaskType>('deep');

  // Local-Only Mode state (disables cloud-sync and keeps incident data in browser IndexedDB)
  const [isLocalOnlyMode, setIsLocalOnlyMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('safehaven_local_only_mode');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return true; // Default to true as requested
  });

  // Modals state
  const [isIncomingCallOpen, setIsIncomingCallOpen] = useState(false);
  const [isActiveCallOpen, setIsActiveCallOpen] = useState(false);
  const [isCriticalFallOpen, setIsCriticalFallOpen] = useState(false);
  const [isIncidentDetailOpen, setIsIncidentDetailOpen] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((message: string, icon?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, icon }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleToggleLocalOnly = (enabled: boolean) => {
    setIsLocalOnlyMode(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('safehaven_local_only_mode', String(enabled));
    }
    if (enabled) {
      showToast(
        'Local-Only Mode Enabled: Cloud-sync disabled. All incidents stored strictly in browser IndexedDB.',
        'shield_lock'
      );
    } else {
      showToast(
        'Cloud-Sync Re-enabled: Incident data replicated across Mumbai & Hyderabad Tier-IV datacenters.',
        'cloud_sync'
      );
    }
  };

  // Handlers for simulation & triggers
  const handleTriggerIncomingCall = () => {
    setIsIncomingCallOpen(true);
    showToast('Incoming Doorbell Call: Zepto Delivery Partner at Apartment 402, Tower A.', 'ring_volume');
  };

  const handleTriggerFallAlert = () => {
    setIsCriticalFallOpen(true);
    if (isLocalOnlyMode) {
      saveLocalIncident({
        id: `FA-${Math.floor(1048 + Math.random() * 50)}`,
        title: 'Emergency Fall Alert: Parents Suite',
        type: 'fall_alert',
        timestamp: 'Just now',
        rawTimestamp: Date.now(),
        status: 'Active',
        sensorZone: 'Parents Suite & Hallway (Pod 04)',
        peakImpact: '74G',
        acousticLevel: '82 dB',
        vitalsRate: '18 br/m (Monitoring)',
        notesCount: 0,
        syncStatus: 'local_indexeddb_only',
        description: 'mmWave velocity drop. Zero optical lenses. Spatial point-cloud vector stored strictly in browser IndexedDB.',
        encryptedVoxelHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      });
      showToast('CRITICAL mmWave ALERT: Fall detected. Stored strictly in browser IndexedDB.', 'emergency');
    } else {
      showToast('CRITICAL mmWave ALERT: Fall detected in Parents Suite & Hallway.', 'emergency');
    }
  };

  const handleOpenActiveCall = () => {
    setIsActiveCallOpen(true);
    setIsIncomingCallOpen(false);
    showToast('2-Way Encrypted Intercom connected with Voice Masking.', 'call');
  };

  const handleAcceptIncomingCall = (selectedMask: VoiceMaskType) => {
    setActiveVoiceMask(selectedMask);
    setIsIncomingCallOpen(false);
    setIsActiveCallOpen(true);
    showToast(`Call connected with ${selectedMask.toUpperCase()} DSP filter active.`, 'phone_in_talk');
  };

  const handleViewIncidentDetail = () => {
    setIsIncidentDetailOpen(true);
  };

  const handleOpenInHomeCctv = () => {
    setActiveTab('cctv');
    showToast('Switched to In-Home CCTV Surveillance Hub (4 Feeds).', 'videocam');
  };

  return (
    <div className="min-h-screen bg-[#fdf9f1] text-[#1c1c17] flex flex-col selection:bg-[#ffdada] selection:text-[#b81c37]">
      {/* Institutional Top Application Bar */}
      <Header
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        isLocalOnlyMode={isLocalOnlyMode}
        onTriggerIncomingCall={handleTriggerIncomingCall}
        onTriggerFallAlert={handleTriggerFallAlert}
        onOpenActiveCall={handleOpenActiveCall}
        onViewIncidentDetail={handleViewIncidentDetail}
        onOpenInHomeCctv={handleOpenInHomeCctv}
        onShowToast={showToast}
        nodes={HARDWARE_NODES}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-3 pb-24">
        {activeTab === 'doorstep' && (
          <DoorstepTab
            activeVoiceMask={activeVoiceMask}
            onChangeVoiceMask={setActiveVoiceMask}
            onOpenIncomingCallModal={handleTriggerIncomingCall}
            onOpenActiveCallModal={handleOpenActiveCall}
            onShowToast={showToast}
            cctvSubMode={cctvSubMode}
            onChangeCctvSubMode={setCctvSubMode}
          />
        )}

        {activeTab === 'cctv' && (
          <CctvTab
            onShowToast={showToast}
            onSwitchToGate={() => setActiveTab('doorstep')}
          />
        )}

        {activeTab === 'family-care' && (
          <FamilyCareTab
            onTriggerFallAlert={handleTriggerFallAlert}
            onViewIncidentDetail={handleViewIncidentDetail}
            onShowToast={showToast}
            onOpenCctv={handleOpenInHomeCctv}
          />
        )}

        {activeTab === 'sos-hub' && (
          <SosHubTab
            onTriggerFallAlert={handleTriggerFallAlert}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'devices-data' && (
          <DevicesDataTab
            isLocalOnlyMode={isLocalOnlyMode}
            onToggleLocalOnly={handleToggleLocalOnly}
            onShowToast={showToast}
            onViewIncidentDetail={handleViewIncidentDetail}
          />
        )}
      </main>

      {/* Bottom Sticky Tab Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Interactive Modals and Screens */}
      {isIncomingCallOpen && (
        <IncomingCallModal
          initialMask={activeVoiceMask}
          onClose={() => setIsIncomingCallOpen(false)}
          onAccept={handleAcceptIncomingCall}
          onShowToast={showToast}
        />
      )}

      {isActiveCallOpen && (
        <ActiveCallModal
          initialVoiceMask={activeVoiceMask}
          onEndCall={() => {
            setIsActiveCallOpen(false);
            showToast('Intercom session closed and local audio buffer shredded.');
          }}
          onShowToast={showToast}
        />
      )}

      {isCriticalFallOpen && (
        <CriticalFallModal
          onClose={() => setIsCriticalFallOpen(false)}
          onResolveToAudit={() => {
            setIsCriticalFallOpen(false);
            setIsIncidentDetailOpen(true);
          }}
          onShowToast={showToast}
        />
      )}

      {isIncidentDetailOpen && (
        <IncidentDetailModal
          isLocalOnlyMode={isLocalOnlyMode}
          onClose={() => setIsIncidentDetailOpen(false)}
          onShowToast={showToast}
        />
      )}

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
