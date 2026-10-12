import React, { useState, useEffect } from 'react';
import { MmWaveRoomSensitivity } from '../types';
import { MmWaveGlobalActivityChart } from './MmWaveGlobalActivityChart';

interface MmWaveSensitivityCardProps {
  onShowToast?: (msg: string, icon?: string) => void;
  initialShowGlobalView?: boolean;
}

const DEFAULT_ROOM_SETTINGS: MmWaveRoomSensitivity[] = [
  {
    id: 'parents-suite',
    roomName: "Parents' Suite & Hallway",
    nodeId: 'node-pod-01',
    nodeName: 'mmWave Radar Pod 01 (Ceiling 60GHz)',
    sensitivity: 88,
    confirmationWindowSec: 1.2,
    noiseFilter: true,
    petImmunity: true,
    zoneType: 'bed_sitting',
    lastCalibrated: 'Today, 08:30 AM'
  },
  {
    id: 'ensuite-bathroom',
    roomName: 'En-Suite Bathroom',
    nodeId: 'node-pod-04',
    nodeName: 'Non-Optical Pod 04 (Wet Zone Radar)',
    sensitivity: 92,
    confirmationWindowSec: 0.9,
    noiseFilter: true,
    petImmunity: false,
    zoneType: 'wet_area',
    lastCalibrated: 'Yesterday, 10:15 PM'
  },
  {
    id: 'living-foyer',
    roomName: 'Living Room & Entrance Foyer',
    nodeId: 'node-hub-01',
    nodeName: 'Sovereign Hub Integrated FMCW',
    sensitivity: 70,
    confirmationWindowSec: 1.8,
    noiseFilter: true,
    petImmunity: true,
    zoneType: 'living',
    lastCalibrated: '3 days ago'
  },
  {
    id: 'master-bedroom',
    roomName: 'Master Bedroom',
    nodeId: 'node-pod-02',
    nodeName: 'mmWave Radar Pod 02 (Ceiling 60GHz)',
    sensitivity: 75,
    confirmationWindowSec: 1.6,
    noiseFilter: true,
    petImmunity: true,
    zoneType: 'bed_sitting',
    lastCalibrated: '2 days ago'
  },
  {
    id: 'balcony-utility',
    roomName: 'Balcony & Utility Transit',
    nodeId: 'node-pod-03',
    nodeName: 'Perimeter mmWave Node 03',
    sensitivity: 60,
    confirmationWindowSec: 2.2,
    noiseFilter: true,
    petImmunity: true,
    zoneType: 'exterior',
    lastCalibrated: '5 days ago'
  }
];

const STORAGE_KEY = 'safehaven_mmwave_room_sensitivities_v1';

export const MmWaveSensitivityCard: React.FC<MmWaveSensitivityCardProps> = ({
  onShowToast,
  initialShowGlobalView
}) => {
  const [rooms, setRooms] = useState<MmWaveRoomSensitivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_ROOM_SETTINGS;
  });

  const [activeRoomId, setActiveRoomId] = useState<string>('parents-suite');
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showGlobalView, setShowGlobalView] = useState<boolean>(initialShowGlobalView ?? false);

  useEffect(() => {
    if (initialShowGlobalView !== undefined) {
      setShowGlobalView(initialShowGlobalView);
    }
  }, [initialShowGlobalView]);

  // Sync to local storage whenever rooms change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    } catch {
      // storage error ignored
    }
  }, [rooms]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  const handleSensitivityChange = (newVal: number) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === activeRoom.id ? { ...r, sensitivity: newVal } : r))
    );
  };

  const handleWindowChange = (newVal: number) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id ? { ...r, confirmationWindowSec: newVal } : r
      )
    );
  };

  const handleToggleNoiseFilter = () => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id ? { ...r, noiseFilter: !r.noiseFilter } : r
      )
    );
    if (onShowToast) {
      onShowToast(
        `${activeRoom.roomName}: Ceiling fan / Pet micro-Doppler filter ${
          !activeRoom.noiseFilter ? 'Enabled' : 'Bypassed'
        }.`,
        'filter_alt'
      );
    }
  };

  const handleTogglePetImmunity = () => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id ? { ...r, petImmunity: !r.petImmunity } : r
      )
    );
    if (onShowToast) {
      onShowToast(
        `${activeRoom.roomName}: Low-mass pet target suppression ${
          !activeRoom.petImmunity ? 'Activated (<15kg ignored)' : 'Deactivated'
        }.`,
        'pets'
      );
    }
  };

  const applyPreset = (presetType: 'senior' | 'balanced' | 'pet') => {
    let newSens = 75;
    let newWindow = 1.6;
    let label = 'Balanced Everyday';

    if (presetType === 'senior') {
      newSens = 92;
      newWindow = 1.0;
      label = 'Senior Fall Protocol (High Alertness)';
    } else if (presetType === 'pet') {
      newSens = 55;
      newWindow = 2.4;
      label = 'Pet & Motion Tolerant';
    }

    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoom.id
          ? {
              ...r,
              sensitivity: newSens,
              confirmationWindowSec: newWindow,
              noiseFilter: true,
              petImmunity: presetType === 'pet'
            }
          : r
      )
    );

    if (onShowToast) {
      onShowToast(
        `${activeRoom.roomName} tuned to preset: ${label} (${newSens}% sensitivity).`,
        'tune'
      );
    }
  };

  const handleApplyToAllRooms = () => {
    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        sensitivity: activeRoom.sensitivity,
        confirmationWindowSec: activeRoom.confirmationWindowSec,
        noiseFilter: activeRoom.noiseFilter,
        petImmunity: activeRoom.petImmunity
      }))
    );
    if (onShowToast) {
      onShowToast(
        `Applied ${activeRoom.sensitivity}% sensitivity threshold across all 5 rooms.`,
        'done_all'
      );
    }
  };

  const handleCalibrateNoiseFloor = () => {
    setIsCalibrating(true);
    if (onShowToast) {
      onShowToast(
        `Scanning 60 GHz ambient RF reflections in ${activeRoom.roomName}...`,
        'radar'
      );
    }

    setTimeout(() => {
      setIsCalibrating(false);
      const nowStr = `Today, ${new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
      setRooms((prev) =>
        prev.map((r) =>
          r.id === activeRoom.id ? { ...r, lastCalibrated: nowStr } : r
        )
      );
      if (onShowToast) {
        onShowToast(
          `Noise floor calibrated for ${activeRoom.roomName}. Static clutter zeroed at -42 dBm.`,
          'verified'
        );
      }
    }, 1200);
  };

  const handleResetDefaults = () => {
    setRooms(DEFAULT_ROOM_SETTINGS);
    if (onShowToast) {
      onShowToast(
        'Reset all room mmWave thresholds to factory medical standards.',
        'restart_alt'
      );
    }
  };

  const handleSaveAndSync = () => {
    setIsSaving(true);
    if (onShowToast) {
      onShowToast(
        `Pushing calibrated threshold matrix to Apartment 402, Tower A mesh nodes...`,
        'cloud_sync'
      );
    }
    setTimeout(() => {
      setIsSaving(false);
      if (onShowToast) {
        onShowToast(
          `All 60 GHz nodes synchronized: ${activeRoom.roomName} threshold active (${activeRoom.sensitivity}%).`,
          'check_circle'
        );
      }
    }, 800);
  };

  // Derived physics metrics
  const impactVelocityThreshold = (
    2.8 -
    (activeRoom.sensitivity / 100) * 1.55
  ).toFixed(2);
  const verticalDisplacementGating = (
    1.25 -
    (activeRoom.sensitivity / 100) * 0.55
  ).toFixed(2);
  const dopplerFrequencyShiftHz = Math.round(
    180 - (activeRoom.sensitivity / 100) * 85
  );

  // Status badge styling based on sensitivity value
  const getSensitivityBadge = (val: number) => {
    if (val >= 90) {
      return {
        label: 'Senior High Vigilance',
        color: 'text-[#920024] bg-[#ffdada] border-[#ffb3b4]'
      };
    }
    if (val >= 75) {
      return {
        label: 'Recommended Care Level',
        color: 'text-[#3E8F5D] bg-[#3E8F5D]/10 border-[#3E8F5D]/30'
      };
    }
    if (val >= 50) {
      return {
        label: 'Standard Balanced',
        color: 'text-[#825300] bg-[#fff0d4] border-[#f2be71]'
      };
    }
    return {
      label: 'Motion Tolerant (Low False Alarm)',
      color: 'text-[#46464b] bg-[#ece8e0] border-[#c7c6cc]'
    };
  };

  const currentBadge = getSensitivityBadge(activeRoom.sensitivity);

  return (
    <section className="w-full bg-[#ffffff] rounded-xl p-4 shadow-sm border border-[#e6e2da] flex flex-col gap-4">
      {/* Card Header with Standardized Apartment 402 · Tower A Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#f1ede5]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f7f3eb] text-[#060810] flex items-center justify-center shrink-0 border border-[#e6e2da]">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              radar
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-[18px] font-bold text-[#060810] leading-tight">
                mmWave Fall Sensitivity Gating
              </h2>
              {/* Standardized Residence Identifier Pill */}
              <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-[#f1ede5] border border-[#e6e2da] text-[#060810] inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D]"></span>
                Apartment 402 · Tower A
              </span>
            </div>
            <p className="text-[12px] text-[#46464b] mt-0.5 leading-relaxed">
              Fine-tune 60 GHz non-optical radar trigger velocities and post-fall stillness verification per room.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Global View Button */}
          <button
            type="button"
            id="mmwave-global-view-btn"
            onClick={() => {
              const nextVal = !showGlobalView;
              setShowGlobalView(nextVal);
              if (nextVal && onShowToast) {
                onShowToast(
                  'Generated 24-hour mmWave global activity summary across all rooms.',
                  'analytics'
                );
              }
            }}
            className={`px-2.5 py-1.5 rounded-lg text-[11.5px] font-bold flex items-center gap-1.5 transition-all border shrink-0 active:scale-95 shadow-2xs ${
              showGlobalView
                ? 'bg-[#060810] text-white border-[#060810]'
                : 'bg-[#3E8F5D] hover:bg-[#34784e] text-white border-[#3E8F5D]'
            }`}
            title="View 24-hour aggregate mmWave activity levels across all rooms"
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {showGlobalView ? 'close' : 'monitoring'}
            </span>
            <span>{showGlobalView ? 'Close Global View' : 'Global View'}</span>
          </button>

          <button
            type="button"
            onClick={handleCalibrateNoiseFloor}
            disabled={isCalibrating}
            className="px-2.5 py-1.5 rounded-lg bg-[#f1ede5] hover:bg-[#e6e2da] text-[#060810] text-[11.5px] font-bold flex items-center gap-1.5 transition-all border border-[#e6e2da] shrink-0 active:scale-95"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                isCalibrating ? 'animate-spin text-[#3E8F5D]' : 'text-[#46464b]'
              }`}
            >
              {isCalibrating ? 'sync' : 'auto_fix_high'}
            </span>
            <span>{isCalibrating ? 'Scanning RF...' : 'Calibrate Noise Floor'}</span>
          </button>
        </div>
      </div>

      {/* 24-Hour Recharts Global Activity Summary Chart (Toggled via Global View button) */}
      {showGlobalView && (
        <MmWaveGlobalActivityChart
          onClose={() => setShowGlobalView(false)}
          onShowToast={onShowToast}
        />
      )}

      {/* Room Selection Carousel / Tabs */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#46464b]">
            Select Room to Tune ({rooms.length} Zones)
          </span>
          <span className="text-[11px] text-[#76777c]">
            Last Calibrated: {activeRoom.lastCalibrated || 'Recent'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {rooms.map((room) => {
            const isSelected = room.id === activeRoom.id;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setActiveRoomId(room.id)}
                className={`px-3 py-2 rounded-lg text-[12px] font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#060810] text-white border-[#060810] shadow-sm'
                    : 'bg-[#f7f3eb] hover:bg-[#f1ede5] text-[#060810] border-[#e6e2da]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{
                    color: isSelected
                      ? '#f2be71'
                      : room.zoneType === 'wet_area'
                      ? '#3E8F5D'
                      : '#76777c'
                  }}
                >
                  {room.zoneType === 'wet_area'
                    ? 'shower'
                    : room.zoneType === 'exterior'
                    ? 'balcony'
                    : room.zoneType === 'living'
                    ? 'chair'
                    : 'bed'}
                </span>
                <span>{room.roomName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#e6e2da] text-[#46464b]'
                  }`}
                >
                  {room.sensitivity}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Room Tuner Console */}
      <div className="p-3.5 rounded-xl bg-[#f7f3eb] border border-[#e6e2da] flex flex-col gap-3.5">
        {/* Active Room Header & Fast Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-[14px] text-[#060810]">
                {activeRoom.roomName}
              </span>
              <span
                className={`text-[9.5px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${currentBadge.color}`}
              >
                {currentBadge.label}
              </span>
            </div>
            <div className="text-[11px] text-[#46464b] mt-0.5">
              Target Node: <span className="font-medium text-[#060810]">{activeRoom.nodeName}</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] uppercase font-bold text-[#76777c] mr-1 hidden sm:inline">
              Presets:
            </span>
            <button
              type="button"
              onClick={() => applyPreset('senior')}
              className="px-2 py-1 rounded text-[10.5px] font-bold bg-[#ffffff] hover:bg-[#ffdada] text-[#920024] border border-[#e6e2da] transition-all shadow-2xs"
              title="92% Sensitivity · 1.0s confirmation window"
            >
              🛡️ Senior High Alert
            </button>
            <button
              type="button"
              onClick={() => applyPreset('balanced')}
              className="px-2 py-1 rounded text-[10.5px] font-bold bg-[#ffffff] hover:bg-[#f1ede5] text-[#060810] border border-[#e6e2da] transition-all shadow-2xs"
              title="75% Sensitivity · 1.6s confirmation window"
            >
              ⚖️ Balanced
            </button>
            <button
              type="button"
              onClick={() => applyPreset('pet')}
              className="px-2 py-1 rounded text-[10.5px] font-bold bg-[#ffffff] hover:bg-[#ece8e0] text-[#46464b] border border-[#e6e2da] transition-all shadow-2xs"
              title="55% Sensitivity · 2.4s confirmation window"
            >
              🐾 Pet Safe
            </button>
          </div>
        </div>

        {/* 1. Main Fall Detection Sensitivity Slider */}
        <div className="flex flex-col gap-1.5 bg-[#ffffff] p-3 rounded-lg border border-[#e6e2da]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#3E8F5D]">
                speed
              </span>
              <label
                htmlFor="sensitivity-slider"
                className="font-sans font-semibold text-[13px] text-[#060810]"
              >
                Fall Velocity &amp; Impact Sensitivity
              </label>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[18px] font-mono font-bold text-[#060810]">
                {activeRoom.sensitivity}%
              </span>
              <span className="text-[11px] text-[#76777c]">threshold</span>
            </div>
          </div>

          <p className="text-[11.5px] text-[#46464b] leading-tight">
            Higher values detect slower collapses, soft carpet slides, or bed-edge slips. Lower values filter out vigorous exercise or sudden sitting.
          </p>

          <div className="pt-2 pb-1 flex flex-col gap-1">
            <input
              id="sensitivity-slider"
              type="range"
              min="15"
              max="98"
              step="1"
              value={activeRoom.sensitivity}
              onChange={(e) => handleSensitivityChange(Number(e.target.value))}
              className="w-full h-2 bg-[#e6e2da] rounded-lg appearance-none cursor-pointer accent-[#060810]"
            />

            <div className="flex items-center justify-between text-[10px] text-[#76777c] font-medium px-0.5">
              <span>15% (Coarse Impact Only)</span>
              <span>50% (Standard)</span>
              <span className="text-[#3E8F5D] font-bold">85% (Elderly Safe)</span>
              <span>98% (Ultra Sensitive)</span>
            </div>
          </div>
        </div>

        {/* 2. Secondary Slider: Post-Fall Stillness Confirmation Window */}
        <div className="flex flex-col gap-1.5 bg-[#ffffff] p-3 rounded-lg border border-[#e6e2da]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#060810]">
                timer
              </span>
              <label
                htmlFor="window-slider"
                className="font-sans font-semibold text-[13px] text-[#060810]"
              >
                Stillness Confirmation Window (Debounce)
              </label>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[16px] font-mono font-bold text-[#060810]">
                {activeRoom.confirmationWindowSec}s
              </span>
            </div>
          </div>

          <p className="text-[11.5px] text-[#46464b] leading-tight">
            Duration of motionless posture on the floor required to confirm an emergency trigger before dispatching local SOS chime.
          </p>

          <div className="pt-2 pb-1 flex flex-col gap-1">
            <input
              id="window-slider"
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={activeRoom.confirmationWindowSec}
              onChange={(e) => handleWindowChange(Number(e.target.value))}
              className="w-full h-2 bg-[#e6e2da] rounded-lg appearance-none cursor-pointer accent-[#060810]"
            />

            <div className="flex items-center justify-between text-[10px] text-[#76777c] font-medium px-0.5">
              <span>0.5s (Instant Trigger)</span>
              <span>1.5s (Recommended)</span>
              <span>3.0s (Delayed Confirmation)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Physics Thresholds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="bg-white p-2.5 rounded-lg border border-[#e6e2da] flex flex-col">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#76777c]">
              Velocity Drop Gate
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-[16px] font-bold text-[#060810]">
                &ge; {impactVelocityThreshold}
              </span>
              <span className="text-[11px] text-[#46464b]">m/s</span>
            </div>
            <span className="text-[10px] text-[#46464b] mt-0.5">
              Triggers on vertical downward plunge
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-[#e6e2da] flex flex-col">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#76777c]">
              Displacement Shift
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-[16px] font-bold text-[#060810]">
                &ge; {verticalDisplacementGating}
              </span>
              <span className="text-[11px] text-[#46464b]">meters</span>
            </div>
            <span className="text-[10px] text-[#46464b] mt-0.5">
              Vertical voxel centroid delta
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-[#e6e2da] flex flex-col">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#76777c]">
              Doppler Bandwidth
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-[16px] font-bold text-[#060810]">
                &plusmn;{dopplerFrequencyShiftHz}
              </span>
              <span className="text-[11px] text-[#46464b]">Hz</span>
            </div>
            <span className="text-[10px] text-[#46464b] mt-0.5">
              RF frequency shift threshold
            </span>
          </div>
        </div>

        {/* Environmental Clutter Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleToggleNoiseFilter}
            className={`p-2.5 rounded-lg border text-left flex items-start justify-between transition-all ${
              activeRoom.noiseFilter
                ? 'bg-white border-[#3E8F5D]/30 text-[#060810]'
                : 'bg-[#ece8e0]/60 border-[#e6e2da] text-[#76777c]'
            }`}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-sans font-semibold text-[12px]">
                <span className="material-symbols-outlined text-[16px] text-[#3E8F5D]">
                  filter_alt
                </span>
                <span>Ceiling Fan Micro-Clutter</span>
              </div>
              <span className="text-[10.5px] text-[#46464b] mt-0.5">
                Suppresses periodic Doppler hum of 3-blade fans
              </span>
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                activeRoom.noiseFilter
                  ? 'bg-[#3E8F5D]/10 text-[#3E8F5D]'
                  : 'bg-[#e6e2da] text-[#76777c]'
              }`}
            >
              {activeRoom.noiseFilter ? 'Active' : 'Off'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleTogglePetImmunity}
            className={`p-2.5 rounded-lg border text-left flex items-start justify-between transition-all ${
              activeRoom.petImmunity
                ? 'bg-white border-[#3E8F5D]/30 text-[#060810]'
                : 'bg-[#ece8e0]/60 border-[#e6e2da] text-[#76777c]'
            }`}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-sans font-semibold text-[12px]">
                <span className="material-symbols-outlined text-[16px] text-[#f2be71]">
                  pets
                </span>
                <span>Pet Mass Discrimination</span>
              </div>
              <span className="text-[10.5px] text-[#46464b] mt-0.5">
                Ignores low-centroid bodies under 18 kg
              </span>
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                activeRoom.petImmunity
                  ? 'bg-[#3E8F5D]/10 text-[#3E8F5D]'
                  : 'bg-[#e6e2da] text-[#76777c]'
              }`}
            >
              {activeRoom.petImmunity ? 'Active' : 'Off'}
            </span>
          </button>
        </div>

        {/* Live Radar Doppler Energy vs Threshold Visualizer */}
        <div className="bg-[#060810] text-white p-3 rounded-lg flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3E8F5D] animate-ping"></span>
              <span className="font-bold text-white">
                Live 60 GHz Point-Cloud Telemetry
              </span>
            </div>
            <span className="font-mono text-[#f2be71] text-[10px]">
              Noise: 0.08 m/s &middot; Gate: {impactVelocityThreshold} m/s
            </span>
          </div>

          <div className="relative w-full h-8 bg-[#1d2029] rounded flex items-center px-2 overflow-hidden">
            {/* Ambient noise jitter */}
            <div className="w-1/5 h-full flex items-center justify-around opacity-40">
              <span className="w-1 bg-[#3E8F5D] rounded-full h-2 animate-pulse"></span>
              <span className="w-1 bg-[#3E8F5D] rounded-full h-3 animate-pulse delay-75"></span>
              <span className="w-1 bg-[#3E8F5D] rounded-full h-1.5 animate-pulse delay-150"></span>
            </div>

            {/* Threshold Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#fe5364] z-10 transition-all duration-300"
              style={{ left: `${Math.min(95, Math.max(10, activeRoom.sensitivity))}%` }}
            >
              <div className="absolute top-0 -left-6 px-1 rounded bg-[#fe5364] text-[8px] font-mono text-white font-bold whitespace-nowrap">
                Trigger {activeRoom.sensitivity}%
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-between px-3 text-[9px] text-[#858793] font-mono pointer-events-none">
              <span>0.0 m/s</span>
              <span>1.5 m/s</span>
              <span>3.0 m/s</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyToAllRooms}
              className="text-[11px] font-bold text-[#060810] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span>Apply {activeRoom.sensitivity}% to All 5 Rooms</span>
            </button>
            <span className="text-[#c7c6cc]">&middot;</span>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-[11px] font-bold text-[#76777c] hover:text-[#060810] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              <span>Reset Standards</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveAndSync}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-lg bg-[#060810] hover:bg-[#1d2029] text-white font-sans font-bold text-[12px] flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ml-auto"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                isSaving ? 'animate-spin text-[#f2be71]' : 'text-[#3E8F5D]'
              }`}
            >
              {isSaving ? 'sync' : 'save'}
            </span>
            <span>{isSaving ? 'Syncing Nodes...' : 'Save & Sync Mesh'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
