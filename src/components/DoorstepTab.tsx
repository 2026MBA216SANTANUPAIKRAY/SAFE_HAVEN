import React, { useState, useEffect, useRef } from 'react';
import { VoiceMaskType } from '../types';
import { DOORSTEP_LOGS } from '../data/mockData';
import { InHomeCctvViewer } from './InHomeCctvViewer';

interface DoorstepTabProps {
  activeVoiceMask: VoiceMaskType;
  onChangeVoiceMask: (mask: VoiceMaskType) => void;
  onOpenIncomingCallModal: () => void;
  onOpenActiveCallModal: () => void;
  onShowToast: (msg: string, icon?: string) => void;
  cctvSubMode?: 'doorstep' | 'in-home';
  onChangeCctvSubMode?: (mode: 'doorstep' | 'in-home') => void;
}

export const DoorstepTab: React.FC<DoorstepTabProps> = ({
  activeVoiceMask,
  onChangeVoiceMask,
  onOpenIncomingCallModal,
  onOpenActiveCallModal,
  onShowToast,
  cctvSubMode = 'in-home',
  onChangeCctvSubMode
}) => {
  const [internalMode, setInternalMode] = useState<'doorstep' | 'in-home'>(cctvSubMode);
  const currentMode = cctvSubMode ?? internalMode;

  const handleModeChange = (mode: 'doorstep' | 'in-home') => {
    setInternalMode(mode);
    if (onChangeCctvSubMode) {
      onChangeCctvSubMode(mode);
    }
  };

  const [isPttPressed, setIsPttPressed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLatchUnlocked, setIsLatchUnlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:42:18 PM IST');
  const [isFlashing, setIsFlashing] = useState(false);
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const latchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setCurrentTime(`${timeStr} IST`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePttStart = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsPttPressed(true);
  };

  const handlePttEnd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isPttPressed) {
      setIsPttPressed(false);
      onShowToast(`Dispatched voice transmission using ${activeVoiceMask.toUpperCase()} DSP filter.`);
    }
  };

  const handleTriggerSnapshot = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 250);
    onShowToast('Encrypted frame snapshot archived to Apartment 402, Tower A Hub.', 'photo_camera');
  };

  const handleAudioSiren = () => {
    onShowToast('85dB Deterrent Siren broadcasting at Front Doorbell.', 'e911_emergency');
  };

  const handleUnlockDoor = () => {
    if (isLatchUnlocked) {
      setIsLatchUnlocked(false);
      onShowToast('Apartment 402, Tower A Main Latch secured.', 'lock');
      return;
    }
    setIsLatchUnlocked(true);
    onShowToast('Apartment 402, Tower A Entrance unlatched. Auto-locking in 6 seconds.', 'lock_open');
    if (latchTimeoutRef.current) clearTimeout(latchTimeoutRef.current);
    latchTimeoutRef.current = setTimeout(() => {
      setIsLatchUnlocked(false);
    }, 6000);
  };

  const handleQuickReply = (replyTitle: string, phrase: string) => {
    setActiveReply(replyTitle);
    onShowToast(`Doorbell broadcast: "${phrase}"`, 'campaign');
    setTimeout(() => setActiveReply(null), 1500);
  };

  // Gate 1 Security Intercom States
  const [isGateIntercomOpen, setIsGateIntercomOpen] = useState(false);
  const [gateCallDuration, setGateCallDuration] = useState(0);
  const [gateVisitorApproved, setGateVisitorApproved] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGateIntercomOpen) {
      interval = setInterval(() => {
        setGateCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setGateCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isGateIntercomOpen]);

  const handleStartGateCall = () => {
    setIsGateIntercomOpen(true);
    onShowToast('VoIP Intercom line open to Gate 1 Security Desk (Guard Ramesh).', 'deskphone');
  };

  const handleEndGateCall = () => {
    setIsGateIntercomOpen(false);
    onShowToast('Gate 1 Intercom call concluded.', 'call_end');
  };

  const handleGateInstruction = (instruction: string) => {
    onShowToast(`Transmitted to Gate 1 Desk: "${instruction}"`, 'campaign');
    if (instruction.includes('Allow')) {
      setGateVisitorApproved(true);
    }
  };

  const handleIssueGatePass = () => {
    setGateVisitorApproved(true);
    onShowToast('Gate Pass #GP-4029 issued to Gate 1 Guard Ramesh. Turnstile entry authorized.', 'badge');
  };

  return (
    <div className="flex flex-col w-full gap-3.5 max-w-2xl mx-auto">
      {/* CCTV & Surveillance View Switcher */}
      <div className="flex items-center p-1 bg-[#ece8e0] rounded-xl border border-[#c7c6cc]/50 shadow-xs">
        <button
          type="button"
          onClick={() => handleModeChange('doorstep')}
          className={`flex-1 py-2 px-2 rounded-lg text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            currentMode === 'doorstep'
              ? 'bg-[#060810] text-white shadow-sm'
              : 'text-[#46464b] hover:text-[#060810]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">doorbell</span>
          <span>Gate &amp; Doorbell Intercom</span>
          <span
            className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
              currentMode === 'doorstep'
                ? 'bg-[#3E8F5D] text-white'
                : 'bg-[#e6e2da] text-[#46464b]'
            }`}
          >
            Live
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('in-home')}
          className={`flex-1 py-2 px-2 rounded-lg text-[12.5px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            currentMode === 'in-home'
              ? 'bg-[#060810] text-white shadow-sm'
              : 'text-[#46464b] hover:text-[#060810]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">videocam</span>
          <span>In-Home CCTV (4 Feeds)</span>
        </button>
      </div>

      {currentMode === 'in-home' ? (
        <InHomeCctvViewer onShowToast={onShowToast} />
      ) : (
        <>
          {/* Top Simulated Call Launch Strip */}
          <div className="flex items-center justify-between bg-[#ece8e0]/60 p-2 rounded-lg border border-[#c7c6cc]/40">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#060810]">
              <span className="material-symbols-outlined text-[16px] text-[#b81c37] animate-pulse">
                notifications_active
              </span>
              <span>Doorbell Simulator:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenIncomingCallModal}
                className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#b81c37] text-white hover:bg-[#920024] active:scale-95 transition-all shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">ring_volume</span>
                Simulate Ringing
              </button>
              <button
                type="button"
                onClick={onOpenActiveCallModal}
                className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#060810] text-white hover:bg-[#1d2029] active:scale-95 transition-all shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">call</span>
                Open 2-Way Call
              </button>
            </div>
          </div>

      {/* Status Banner */}
      <div className="flex items-center justify-between bg-[#ffffff] p-3 rounded-lg shadow-sm border border-[#e6e2da]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b81c37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#b81c37]"></span>
          </span>
          <div className="flex flex-col">
            <span className="font-sans font-semibold text-[14px] text-[#060810] leading-none">
              Front Doorbell
            </span>
            <span className="text-[11px] font-medium text-[#46464b] mt-0.5">
              Live Encrypted HD (1080p · 60fps)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#fe5364]/10 text-[#b81c37] border border-[#fe5364]/20">
          <span className="material-symbols-outlined text-[15px]">record_voice_over</span>
          <span className="text-[10px] uppercase font-bold tracking-wider">
            Voice-Mask: {activeVoiceMask.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Live Video Viewport Frame */}
      <div className="relative w-full rounded-xl overflow-hidden bg-[#060810] shadow-md aspect-[4/3] flex flex-col justify-between p-3 border border-[#060810]">
        {/* Shutter flash effect */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200"></div>
        )}

        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBeG44BvMp4E5Eh7d-NvU8WjRCl2sZT6LccnHzLNczaIEhngi1_4Unrhn3JwHSkKE4ckFRDpD9pAd1DUE-I5C4JNA21yTBmaja7A6kogNDjfq258_RMjUxbg-JkhJs8tCkWksFGBh-QjVtcK560iS2KK2fmSHXzx2BLP_Yn3rL8VdcAi9t4nO4mAnAfyUGGe1EpSBKeRtDO5ycaPXNcz_iUOT5bNDUSVuUPFO-I4dNiebn_LnZMfA')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#060810]/95 via-transparent to-[#060810]/40 pointer-events-none"></div>

        {/* Top Overlay Badges */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 bg-[#1d2029]/85 px-2.5 py-1 rounded backdrop-blur-sm text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b81c37]"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              LIVE · {currentTime}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#1d2029]/85 px-2 py-1 rounded backdrop-blur-sm text-white">
            <span className="material-symbols-outlined text-[14px] text-[#f2be71]">verified</span>
            <span className="text-[10px] font-bold tracking-wider text-white">
              DPDP On-Device Edge AI
            </span>
          </div>
        </div>

        {/* AI Bounding Box on Visitor */}
        <div className="relative z-10 mx-auto w-48 h-44 rounded border-2 border-dashed border-[#fe5364]/80 bg-[#fe5364]/10 flex flex-col justify-between p-2 pointer-events-none shadow-sm">
          <div className="inline-flex items-center gap-1 bg-[#b81c37] text-white px-2 py-0.5 rounded text-left self-start shadow-sm">
            <span className="material-symbols-outlined text-[13px]">local_shipping</span>
            <span className="text-[10px] font-bold tracking-wide">Blinkit / Shadowfax</span>
          </div>
          <div className="flex items-center justify-between bg-[#1d2029]/90 px-1.5 py-0.5 rounded text-white text-[10px]">
            <span className="font-medium text-white">Helmet &amp; Vest Verified</span>
            <span className="text-[#f2be71] font-bold ml-1">98% match</span>
          </div>
        </div>

        {/* Bottom Telemetry & Real-Time Waveform */}
        <div className="relative z-10 flex items-end justify-between w-full">
          <div className="flex items-center gap-2 bg-[#1d2029]/90 px-2.5 py-1.5 rounded backdrop-blur-sm">
            <span className="material-symbols-outlined text-[#fe5364] text-[16px]">graphic_eq</span>
            <div className="flex items-center gap-0.5 h-3.5">
              <span className="w-1 bg-[#fe5364] rounded-full h-2 animate-pulse"></span>
              <span className="w-1 bg-[#fe5364] rounded-full h-3.5 animate-pulse delay-75"></span>
              <span className="w-1 bg-[#fe5364] rounded-full h-1.5 animate-pulse delay-150"></span>
              <span className="w-1 bg-[#fe5364] rounded-full h-3 animate-pulse delay-100"></span>
              <span className="w-1 bg-[#fe5364] rounded-full h-2.5 animate-pulse delay-200"></span>
            </div>
            <span className="text-[10px] font-semibold text-white ml-1">
              Masked Pitch: {activeVoiceMask === 'deep' ? '84 Hz' : activeVoiceMask === 'neutral' ? '120 Hz' : activeVoiceMask === 'higher' ? '195 Hz' : 'Original'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleTriggerSnapshot}
              className="w-8 h-8 rounded bg-[#1d2029]/90 hover:bg-[#1d2029] text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
              title="Take Snapshot"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-8 h-8 rounded text-white flex items-center justify-center transition-all shadow-sm active:scale-95 ${
                isMuted ? 'bg-[#b81c37]' : 'bg-[#1d2029]/90 hover:bg-[#1d2029]'
              }`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Masking Profile Selector */}
      <div className="bg-[#ffffff] p-3 rounded-lg shadow-sm flex flex-col gap-2 border border-[#e6e2da]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#b81c37]">security</span>
            <span className="font-sans font-semibold text-[14px] text-[#060810]">
              Identity Voice Masking
            </span>
          </div>
          <span className="text-[11px] text-[#46464b] font-medium">Real-time DSP Filter</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => onChangeVoiceMask('deep')}
            className={`flex flex-col items-center justify-center p-2 rounded transition-all ${
              activeVoiceMask === 'deep'
                ? 'bg-[#060810] text-white shadow-sm ring-1 ring-[#060810]'
                : 'bg-[#f1ede5] hover:bg-[#ece8e0] text-[#1c1c17]'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${activeVoiceMask === 'deep' ? 'text-[#fe5364]' : 'text-[#46464b]'}`}>
              shield_person
            </span>
            <span className="text-[11px] mt-1 text-center font-bold">Deep</span>
            <span className={`text-[9px] ${activeVoiceMask === 'deep' ? 'text-[#858793]' : 'text-[#76777c]'}`}>Authoritative</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeVoiceMask('neutral')}
            className={`flex flex-col items-center justify-center p-2 rounded transition-all ${
              activeVoiceMask === 'neutral'
                ? 'bg-[#060810] text-white shadow-sm ring-1 ring-[#060810]'
                : 'bg-[#f1ede5] hover:bg-[#ece8e0] text-[#1c1c17]'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${activeVoiceMask === 'neutral' ? 'text-[#fe5364]' : 'text-[#46464b]'}`}>
              record_voice_over
            </span>
            <span className="text-[11px] mt-1 text-center font-bold">Neutral</span>
            <span className={`text-[9px] ${activeVoiceMask === 'neutral' ? 'text-[#858793]' : 'text-[#76777c]'}`}>Adult Tone</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeVoiceMask('higher')}
            className={`flex flex-col items-center justify-center p-2 rounded transition-all ${
              activeVoiceMask === 'higher'
                ? 'bg-[#060810] text-white shadow-sm ring-1 ring-[#060810]'
                : 'bg-[#f1ede5] hover:bg-[#ece8e0] text-[#1c1c17]'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${activeVoiceMask === 'higher' ? 'text-[#fe5364]' : 'text-[#46464b]'}`}>
              settings_voice
            </span>
            <span className="text-[11px] mt-1 text-center font-bold">Higher</span>
            <span className={`text-[9px] ${activeVoiceMask === 'higher' ? 'text-[#858793]' : 'text-[#76777c]'}`}>Clarity Boost</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeVoiceMask('original')}
            className={`flex flex-col items-center justify-center p-2 rounded transition-all ${
              activeVoiceMask === 'original'
                ? 'bg-[#060810] text-white shadow-sm ring-1 ring-[#060810]'
                : 'bg-[#f1ede5] hover:bg-[#ece8e0] text-[#1c1c17]'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${activeVoiceMask === 'original' ? 'text-[#fe5364]' : 'text-[#46464b]'}`}>
              mic
            </span>
            <span className="text-[11px] mt-1 text-center font-bold">Original</span>
            <span className={`text-[9px] ${activeVoiceMask === 'original' ? 'text-[#858793]' : 'text-[#76777c]'}`}>Unfiltered</span>
          </button>
        </div>
      </div>

      {/* Primary PTT Trigger & Emergency Actions */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onMouseDown={handlePttStart}
          onMouseUp={handlePttEnd}
          onTouchStart={handlePttStart}
          onTouchEnd={handlePttEnd}
          className={`relative w-full h-14 rounded bg-[#b81c37] hover:bg-[#920024] text-white shadow-md flex items-center justify-center gap-3 transition-all cursor-pointer select-none ${
            isPttPressed ? 'scale-[0.98] ring-4 ring-[#fe5364]/40 bg-[#920024]' : ''
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isPttPressed ? 'animate-ping' : 'animate-pulse'}`}>
            {isPttPressed ? 'record_voice_over' : 'mic'}
          </span>
          <div className="flex flex-col items-start leading-tight">
            <span className="font-sans text-[16px] font-bold tracking-wide">
              {isPttPressed ? 'TRANSMITTING VOICE...' : 'HOLD TO SPEAK'}
            </span>
            <span className="text-[10px] font-medium opacity-90">
              Transmitting with {activeVoiceMask.toUpperCase()} Voice Filter
            </span>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-2">
          {/* Snapshot Deterrent */}
          <button
            type="button"
            onClick={handleAudioSiren}
            className="h-11 rounded bg-[#ffffff] hover:bg-[#f7f3eb] text-[#b81c37] border border-[#ffdada] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
            <span className="font-sans text-[14px] font-semibold">Audio Warning</span>
          </button>
          {/* Smart Slider / Instant Unlock */}
          <button
            type="button"
            onClick={handleUnlockDoor}
            className={`h-11 rounded flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 ${
              isLatchUnlocked
                ? 'bg-[#2d6a4f] text-white'
                : 'bg-[#1d2029] text-white hover:bg-[#060810]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#f2be71]">
              {isLatchUnlocked ? 'check_circle' : 'lock_open'}
            </span>
            <span className="font-sans text-[14px] font-semibold">
              {isLatchUnlocked ? 'Latch Released (6s)' : 'Unlock Main Latch'}
            </span>
          </button>
        </div>
      </div>

      {/* Society Gate 1 Guard Intercom Hub */}
      <div className="bg-[#ffffff] p-3.5 rounded-xl shadow-sm flex flex-col gap-3 border border-[#e6e2da]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#060810] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">deskphone</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-[14px] text-[#060810]">
                  Gate 1 Security Intercom
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider bg-[#3E8F5D]/10 text-[#3E8F5D] border border-[#3E8F5D]/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D] animate-pulse"></span>
                  Ext #01 Online
                </span>
              </div>
              <span className="text-[11px] text-[#46464b]">
                Guard Ramesh (+91 98765 24001) &middot; Society Main Security
              </span>
            </div>
          </div>

          {gateVisitorApproved && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E8F5D] bg-[#3E8F5D]/10 px-2 py-0.5 rounded border border-[#3E8F5D]/20">
              Gate Pass Active
            </span>
          )}
        </div>

        {/* If Gate Call is In-Progress */}
        {isGateIntercomOpen ? (
          <div className="p-3 rounded-xl bg-[#060810] text-white flex flex-col gap-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3E8F5D] animate-ping"></span>
                <span className="font-sans font-bold text-[13px] text-white">
                  Connected to Gate 1 Guard Desk
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#f2be71] bg-[#1d2029] px-2 py-0.5 rounded">
                VoIP {gateCallDuration}s
              </span>
            </div>

            {/* Simulated Two-Way Voice Waveform */}
            <div className="flex items-center justify-between bg-[#1d2029] p-2 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#3E8F5D] text-[18px]">record_voice_over</span>
                <span className="text-[11px] text-white font-medium">Guard Ramesh (Live)</span>
              </div>
              <div className="flex items-center gap-1 h-3.5">
                <span className="w-1 bg-[#3E8F5D] rounded-full h-2.5 animate-pulse"></span>
                <span className="w-1 bg-[#3E8F5D] rounded-full h-4 animate-pulse delay-100"></span>
                <span className="w-1 bg-[#3E8F5D] rounded-full h-2 animate-pulse delay-75"></span>
                <span className="w-1 bg-[#3E8F5D] rounded-full h-3.5 animate-pulse delay-150"></span>
                <span className="w-1 bg-[#3E8F5D] rounded-full h-1.5 animate-pulse delay-200"></span>
              </div>
            </div>

            {/* Guard Dispatch Fast Actions */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => handleGateInstruction('Allow courier to Apartment 402, Tower A')}
                className="px-2.5 py-1.5 rounded bg-[#3E8F5D] hover:bg-[#34784e] text-white text-[11px] font-bold shrink-0 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">check</span>
                Allow to Apt 402 (Tower A)
              </button>
              <button
                type="button"
                onClick={() => handleGateInstruction('Hold package at security desk')}
                className="px-2.5 py-1.5 rounded bg-[#1d2029] hover:bg-[#2b2f3d] text-white text-[11px] font-bold shrink-0 transition-all flex items-center gap-1 border border-[#3b3f4f]"
              >
                <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                Hold at Gate Desk
              </button>
              <button
                type="button"
                onClick={() => handleGateInstruction('Visitor not authorized, please turn away')}
                className="px-2.5 py-1.5 rounded bg-[#b81c37] hover:bg-[#920024] text-white text-[11px] font-bold shrink-0 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">block</span>
                Deny Entry
              </button>
            </div>

            {/* End Call Button */}
            <button
              type="button"
              onClick={handleEndGateCall}
              className="w-full py-2 rounded-lg bg-[#b81c37] hover:bg-[#920024] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98"
            >
              <span className="material-symbols-outlined text-[16px]">call_end</span>
              <span>End Gate Intercom Call</span>
            </button>
          </div>
        ) : (
          /* Gate Quick Actions */
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleStartGateCall}
              className="h-11 rounded-lg bg-[#060810] hover:bg-[#1d2029] text-white font-sans font-bold text-[12.5px] flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] text-[#f2be71]">deskphone</span>
              <span>Call Gate 1 Desk</span>
            </button>

            <button
              type="button"
              onClick={handleIssueGatePass}
              className="h-11 rounded-lg bg-[#f1ede5] hover:bg-[#e6e2da] text-[#060810] font-sans font-bold text-[12.5px] flex items-center justify-center gap-2 transition-all active:scale-98 border border-[#e6e2da]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#3E8F5D]">badge</span>
              <span>Authorize Gate Pass</span>
            </button>
          </div>
        )}
      </div>

      {/* Automated Canned Audio Responses */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-serif text-[18px] font-semibold text-[#060810]">
            Quick Voice Replies
          </span>
          <span className="text-[11px] font-medium text-[#46464b]">One-Tap Broadcast</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickReply('Leave at Door', 'Please leave package by the gate.')}
            className={`text-left p-2.5 rounded bg-[#ffffff] hover:bg-[#f7f3eb] transition-all shadow-sm border border-[#e6e2da] flex flex-col gap-1 active:scale-[0.98] ${
              activeReply === 'Leave at Door' ? 'ring-2 ring-[#b81c37] bg-[#fe5364]/10' : ''
            }`}
          >
            <div className="flex items-center gap-1.5 text-[#b81c37]">
              <span className="material-symbols-outlined text-[16px]">inventory_2</span>
              <span className="font-sans text-[14px] font-semibold text-[#1c1c17]">Leave at Door</span>
            </div>
            <span className="text-[12px] text-[#46464b] line-clamp-1">
              "Please leave package by the gate."
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickReply('Wait a Moment', 'Please wait, opening in 1 minute.')}
            className={`text-left p-2.5 rounded bg-[#ffffff] hover:bg-[#f7f3eb] transition-all shadow-sm border border-[#e6e2da] flex flex-col gap-1 active:scale-[0.98] ${
              activeReply === 'Wait a Moment' ? 'ring-2 ring-[#b81c37] bg-[#fe5364]/10' : ''
            }`}
          >
            <div className="flex items-center gap-1.5 text-[#ac7f39]">
              <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
              <span className="font-sans text-[14px] font-semibold text-[#1c1c17]">Wait a Moment</span>
            </div>
            <span className="text-[12px] text-[#46464b] line-clamp-1">
              "Please wait, opening in 1 minute."
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickReply('Not Interested', 'No solicitations today, thank you.')}
            className={`text-left p-2.5 rounded bg-[#ffffff] hover:bg-[#f7f3eb] transition-all shadow-sm border border-[#e6e2da] flex flex-col gap-1 active:scale-[0.98] ${
              activeReply === 'Not Interested' ? 'ring-2 ring-[#b81c37] bg-[#fe5364]/10' : ''
            }`}
          >
            <div className="flex items-center gap-1.5 text-[#b81c37]">
              <span className="material-symbols-outlined text-[16px]">front_hand</span>
              <span className="font-sans text-[14px] font-semibold text-[#1c1c17]">Not Interested</span>
            </div>
            <span className="text-[12px] text-[#46464b] line-clamp-1">
              "No solicitations today, thank you."
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickReply('Coming to Door', 'Someone is walking to the front.')}
            className={`text-left p-2.5 rounded bg-[#ffffff] hover:bg-[#f7f3eb] transition-all shadow-sm border border-[#e6e2da] flex flex-col gap-1 active:scale-[0.98] ${
              activeReply === 'Coming to Door' ? 'ring-2 ring-[#b81c37] bg-[#fe5364]/10' : ''
            }`}
          >
            <div className="flex items-center gap-1.5 text-[#060810]">
              <span className="material-symbols-outlined text-[16px]">directions_walk</span>
              <span className="font-sans text-[14px] font-semibold text-[#1c1c17]">Coming to Door</span>
            </div>
            <span className="text-[12px] text-[#46464b] line-clamp-1">
              "Someone is walking to the front."
            </span>
          </button>
        </div>
      </div>

      {/* Recent Doorstep Audit Feed */}
      <div className="bg-[#ffffff] p-3 rounded-lg shadow-sm flex flex-col gap-2.5 border border-[#e6e2da] mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#060810] text-[18px]">history</span>
            <span className="font-serif text-[18px] font-semibold text-[#060810]">Doorstep Log</span>
          </div>
          <span className="text-[11px] font-medium text-[#46464b]">Today's Verifications</span>
        </div>
        <div className="flex flex-col gap-2">
          {DOORSTEP_LOGS.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded bg-[#f7f3eb] border border-[#e6e2da]/40"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#e6e2da] flex items-center justify-center text-[#060810]">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-[13px] text-[#1c1c17] leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-[#46464b]">{item.subtitle}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[12px] font-bold text-[#1c1c17]">{item.time}</span>
                <span className={`text-[10px] font-bold uppercase ${item.badgeColor || 'text-[#b81c37]'}`}>
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )}
</div>
);
};
