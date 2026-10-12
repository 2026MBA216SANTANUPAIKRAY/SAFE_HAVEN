import React, { useState } from 'react';
import { EMERGENCY_CONTACTS } from '../data/mockData';

interface FamilyCareTabProps {
  onTriggerFallAlert: () => void;
  onViewIncidentDetail: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  onOpenCctv?: () => void;
}

export const FamilyCareTab: React.FC<FamilyCareTabProps> = ({
  onTriggerFallAlert,
  onViewIncidentDetail,
  onShowToast,
  onOpenCctv
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const handleSimulatedTest = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    onShowToast('Executing dual-relay fall detection ping test...', 'sensors');

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
      onShowToast('Relay pipeline verified: 4 emergency contacts reachable in 1.8s.', 'verified');
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full gap-4 max-w-2xl mx-auto pb-6">
      {/* Quick Launch Shortcuts for Critical Scenarios */}
      <div className="flex items-center justify-between bg-[#ece8e0]/60 p-2.5 rounded-lg border border-[#c7c6cc]/40">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#060810]">
          <span className="material-symbols-outlined text-[16px] text-[#b81c37]">health_and_safety</span>
          <span>Safety Scenarios:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTriggerFallAlert}
            className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#b81c37] text-white hover:bg-[#920024] active:scale-95 transition-all shadow-sm flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">emergency</span>
            Trigger Fall Alert
          </button>
          <button
            type="button"
            onClick={onViewIncidentDetail}
            className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#060810] text-white hover:bg-[#1d2029] active:scale-95 transition-all shadow-sm flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">assignment_turned_in</span>
            Case #FA-1048
          </button>
        </div>
      </div>

      {/* Reassuring Compliance Pill */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#f7f3eb] rounded-lg shadow-sm border border-[#e6e2da]">
        <div className="flex items-center gap-1.5 text-[#1c1c17]">
          <span
            className="material-symbols-outlined text-[18px] text-[#b81c37]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            privacy_tip
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider">
            DPDP Act (2023) Sovereign Audit Verified
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#46464b]">Local Edge Sensor</span>
      </div>

      {/* In-Home CCTV Optical Check Shortcut for Family Caregivers */}
      {onOpenCctv && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e6e2da] shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#3E8F5D]/10 text-[#3E8F5D] flex items-center justify-center shrink-0 border border-[#3E8F5D]/20">
              <span className="material-symbols-outlined text-[20px]">videocam</span>
            </div>
            <div>
              <div className="font-sans font-bold text-[13px] text-[#060810]">
                Caregiver In-Home CCTV Access
              </div>
              <div className="text-[11px] text-[#46464b]">
                Living Room 360° PTZ &amp; 3 interior cameras available
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCctv}
            className="px-3 py-1.5 rounded-lg bg-[#060810] hover:bg-[#1d2029] text-white text-[11.5px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs shrink-0"
          >
            <span>Open CCTV</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Primary Safety Status Card */}
      <div className="relative overflow-hidden bg-[#ffffff] rounded-xl shadow-sm p-4 flex flex-col gap-3.5 border border-[#e6e2da]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3E8F5D] animate-ping"></span>
              <span className="text-[10px] text-[#3E8F5D] font-bold tracking-widest uppercase">
                Live Continuous Mesh
              </span>
            </div>
            <h2 className="font-serif text-[22px] font-semibold text-[#060810] mt-0.5 leading-tight">
              Parents’ Suite &amp; Hallway
            </h2>
            <p className="text-[12px] text-[#46464b]">Apartment 402, Tower A · Sector 62 Residency</p>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f1ede5] text-[#3E8F5D] shadow-sm">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
        </div>

        {/* mmWave Radar Rhythm Visualizer */}
        <div className="relative w-full h-32 bg-[#f7f3eb] rounded-lg flex items-center justify-center overflow-hidden border border-[#e6e2da]">
          {/* Radar Sweep Canvas SVG */}
          <svg
            className="absolute inset-0 w-full h-full opacity-30 text-[#76777c]"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 320 128"
          >
            <circle cx="160" cy="64" r="28" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1"></circle>
            <circle cx="160" cy="64" r="54" stroke="currentColor" strokeWidth="1"></circle>
            <circle cx="160" cy="64" r="80" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1"></circle>
            <line stroke="currentColor" strokeWidth="0.5" x1="0" x2="320" y1="64" y2="64"></line>
            <line stroke="currentColor" strokeWidth="0.5" x1="160" x2="160" y1="0" y2="128"></line>
          </svg>

          {/* Living mmWave Pulse Graphic */}
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#b81c37]/10 flex items-center justify-center animate-pulse">
                <div className="w-7 h-7 rounded-full bg-[#b81c37]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#b81c37] text-[20px]">sensors</span>
                </div>
              </div>
              {/* Ping Rings */}
              <div className="absolute w-20 h-20 rounded-full border border-[#b81c37]/30 scale-75 animate-ping pointer-events-none"></div>
            </div>
            <span className="text-[10px] text-[#060810] font-bold tracking-wider uppercase mt-1">
              Normal Activity Rhythm
            </span>
          </div>

          {/* Telemetry Sub-Tag overlay */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[#46464b] text-[10px]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#b81c37]">shield_lock</span>
              Zero Cameras · 60GHz mmWave
            </span>
            <span className="text-[#060810] font-bold">99.8% Reliability</span>
          </div>
        </div>

        {/* Last Active & Live Signal Strip */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded bg-[#f1ede5] flex flex-col gap-0.5 border border-[#e6e2da]/60">
            <span className="text-[10px] text-[#46464b] font-bold uppercase tracking-wider">
              Recent Mobility
            </span>
            <span className="font-sans font-semibold text-[14px] text-[#060810]">
              Living Room lounge
            </span>
            <span className="text-[11px] text-[#46464b]">Recorded 4 mins ago</span>
          </div>
          <div className="p-2.5 rounded bg-[#f1ede5] flex flex-col gap-0.5 border border-[#e6e2da]/60">
            <span className="text-[10px] text-[#46464b] font-bold uppercase tracking-wider">
              Fall Detection Engine
            </span>
            <div className="flex items-center gap-1">
              <span className="font-sans font-semibold text-[14px] text-[#b81c37]">
                Armed &amp; Ready
              </span>
            </div>
            <span className="text-[11px] text-[#46464b]">3s Dual SMS &amp; IVR Relay</span>
          </div>
        </div>
      </div>

      {/* Editorial Dignity & Privacy Strip */}
      <div className="bg-[#ece8e0] rounded-xl p-3.5 flex gap-3 items-start border border-[#e6e2da]">
        <div className="w-9 h-9 rounded-full bg-[#ffffff] flex items-center justify-center text-[#ac7f39] shrink-0 mt-0.5 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className="font-sans font-semibold text-[14px] text-[#1c1c17]">
            Uncompromised Dignity &amp; Privacy
          </h3>
          <p className="text-[12px] text-[#46464b] leading-relaxed">
            Equipped with discrete spatial micro-radar. No lens, visual camera feed, or intrusive microphones operate within private bed or bath areas.
          </p>
        </div>
      </div>

      {/* Activity & Mobility Rhythm Insights */}
      <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm flex flex-col gap-3.5 border border-[#e6e2da]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#46464b] font-bold uppercase tracking-wider">
              Today's Daily Patterns
            </span>
            <h3 className="font-serif text-[18px] font-semibold text-[#060810]">
              Biometric Mobility Rhythms
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#f1ede5] text-[11px] font-bold text-[#1c1c17]">
            Normal Range
          </span>
        </div>

        {/* Micro Cards Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Morning Walk */}
          <div className="p-2.5 rounded-lg bg-[#f7f3eb] flex flex-col gap-0.5 text-center border border-[#e6e2da]">
            <span className="material-symbols-outlined text-[#b81c37] text-[20px] mx-auto">
              directions_walk
            </span>
            <span className="text-[10px] text-[#46464b] font-medium">Morning Walk</span>
            <span className="font-sans font-semibold text-[14px] text-[#060810]">38 mins</span>
            <span className="text-[10px] font-bold text-[#3E8F5D]">07:15 - 07:53 AM</span>
          </div>
          {/* Afternoon Rest */}
          <div className="p-2.5 rounded-lg bg-[#f7f3eb] flex flex-col gap-0.5 text-center border border-[#e6e2da]">
            <span className="material-symbols-outlined text-[#ac7f39] text-[20px] mx-auto">
              bedtime
            </span>
            <span className="text-[10px] text-[#46464b] font-medium">Rest &amp; Nap</span>
            <span className="font-sans font-semibold text-[14px] text-[#060810]">1h 45m</span>
            <span className="text-[10px] font-medium text-[#46464b]">Steady &amp; Still</span>
          </div>
          {/* Night Bathroom Trips */}
          <div className="p-2.5 rounded-lg bg-[#f7f3eb] flex flex-col gap-0.5 text-center border border-[#e6e2da]">
            <span className="material-symbols-outlined text-[#b81c37] text-[20px] mx-auto">
              bathtub
            </span>
            <span className="text-[10px] text-[#46464b] font-medium">Night Trips</span>
            <span className="font-sans font-semibold text-[14px] text-[#060810]">2 recorded</span>
            <span className="text-[10px] font-bold text-[#3E8F5D]">Baseline Typical</span>
          </div>
        </div>

        {/* Rhythm Timeline Bar */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] text-[#46464b] font-bold">
            <span>06:00 AM</span>
            <span>12:00 PM</span>
            <span>06:00 PM</span>
            <span>Now (08:45 PM)</span>
          </div>
          {/* Segmented Bar */}
          <div className="h-3.5 w-full rounded-full bg-[#f1ede5] flex overflow-hidden p-0.5 gap-0.5">
            <div
              className="h-full bg-[#b81c37]/80 rounded-l-full"
              style={{ width: '25%' }}
              title="Morning Active (25%)"
            ></div>
            <div
              className="h-full bg-[#3E8F5D]/70"
              style={{ width: '20%' }}
              title="Gentle House Movement (20%)"
            ></div>
            <div
              className="h-full bg-[#e6e2da]"
              style={{ width: '15%' }}
              title="Afternoon Rest (15%)"
            ></div>
            <div
              className="h-full bg-[#3E8F5D]/80"
              style={{ width: '28%' }}
              title="Evening Rhythms (28%)"
            ></div>
            <div
              className="h-full bg-[#b81c37] animate-pulse rounded-r-full"
              style={{ width: '12%' }}
              title="Present Rhythm (12%)"
            ></div>
          </div>
          <div className="flex items-center justify-between text-[#46464b] text-[11px] pt-0.5">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#3E8F5D]"></span> Regular pace
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#e6e2da]"></span> Gentle dormancy
            </span>
            <span className="text-[#060810] font-bold">No Gait Stumbles</span>
          </div>
        </div>
      </div>

      {/* Fall Verification & Sensor Diagnostics Section */}
      <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#e6e2da]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#46464b] font-bold uppercase tracking-wider">
              Calibration &amp; Diagnostics
            </span>
            <h3 className="font-serif text-[18px] font-semibold text-[#060810]">
              Sensitivity Matrix
            </h3>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#f1ede5] text-[11px] text-[#060810] font-bold">
            <span className="material-symbols-outlined text-[14px] text-[#b81c37]">tune</span>
            Standard Metro Mode
          </div>
        </div>

        {/* Sensitivity Card */}
        <div className="p-3 rounded-lg bg-[#f7f3eb] flex flex-col gap-2 border border-[#e6e2da]">
          <div className="flex items-center justify-between">
            <span className="font-sans font-semibold text-[13px] text-[#060810]">
              Floor Reflection Filtering
            </span>
            <span className="text-[10px] text-[#b81c37] font-bold tracking-wider uppercase">
              OPTIMIZED (MARBLE / TILED)
            </span>
          </div>
          <p className="text-[12px] text-[#46464b] leading-relaxed">
            Filtered for Indian high-rise apartment floor acoustics, pet-filtering (under 12kg ignored), and rapid postural drops.
          </p>

          <button
            type="button"
            onClick={handleSimulatedTest}
            disabled={isSimulating}
            className="w-full mt-1 py-2.5 px-3 rounded bg-[#060810] hover:bg-[#1d2029] text-white text-[12px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] shadow-sm transition-all"
          >
            <span className={`material-symbols-outlined text-[16px] text-[#ffdada] ${isSimulating ? 'animate-spin' : ''}`}>
              {isSimulating ? 'sync' : 'notification_important'}
            </span>
            {isSimulating
              ? 'Simulating Dual Relay Test...'
              : simulationComplete
              ? 'Simulation Passed · Re-run Test'
              : 'Trigger Simulated Test Alert'}
          </button>

          {simulationComplete && (
            <div className="p-2 rounded bg-[#ece8e0] text-center text-[11px] font-bold text-[#b81c37] animate-in fade-in">
              Relay pipeline verified: 4 emergency contacts reachable in 1.8s.
            </div>
          )}
        </div>
      </div>

      {/* Priority Alert Dispatch Circle (Contacts) */}
      <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#e6e2da]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#46464b] font-bold uppercase tracking-wider">
              Automated Dispatch Loop
            </span>
            <h3 className="font-serif text-[18px] font-semibold text-[#060810]">
              Emergency Family Contacts
            </h3>
          </div>
          <span className="text-[10px] text-[#ac7f39] bg-[#ac7f39]/10 border border-[#ac7f39]/20 px-2 py-0.5 rounded font-bold uppercase">
            4 Active Relays
          </span>
        </div>

        {/* Contact List */}
        <div className="flex flex-col gap-1.5">
          {EMERGENCY_CONTACTS.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#f7f3eb] border border-[#e6e2da]/50"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] ${
                  contact.isPrimary
                    ? 'bg-[#060810] text-white'
                    : 'bg-[#f1ede5] text-[#060810]'
                }`}>
                  {contact.avatar}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-semibold text-[13px] text-[#060810]">
                      {contact.name}
                    </span>
                    {contact.isPrimary ? (
                      <span className="px-1.5 py-0.5 rounded bg-[#b81c37]/15 text-[#b81c37] text-[9px] font-bold">
                        Primary (You)
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#46464b]">
                        {contact.relation}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#46464b]">{contact.details}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onShowToast(`Testing relay handshake with ${contact.name}...`, contact.icon)}
                className="w-8 h-8 rounded-full bg-[#f1ede5] hover:bg-[#ece8e0] flex items-center justify-center text-[#060810] active:scale-95 transition-transform"
                title={`Ping ${contact.name}`}
              >
                <span className="material-symbols-outlined text-[17px]">{contact.icon}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Hardware Connection Telemetry Footer */}
      <div className="p-3 bg-[#f1ede5] rounded-xl flex items-center justify-between border border-[#e6e2da]">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#b81c37] text-[22px]">router</span>
          <div className="flex flex-col">
            <span className="font-sans font-semibold text-[13px] text-[#060810] leading-tight">
              Radar Node: Suite-Hall-04
            </span>
            <span className="text-[11px] text-[#46464b]">
              Firmware v4.2.1 · Battery Backup 98%
            </span>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded bg-[#ffffff] shadow-sm text-[10px] font-bold uppercase text-[#060810] border border-[#e6e2da]">
          Local Sync 0.4s
        </div>
      </div>
    </div>
  );
};
