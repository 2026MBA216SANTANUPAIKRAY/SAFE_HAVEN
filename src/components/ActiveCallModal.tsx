import React, { useState, useEffect, useRef } from 'react';
import { VoiceMaskType } from '../types';

interface ActiveCallModalProps {
  initialVoiceMask: VoiceMaskType;
  onEndCall: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const ActiveCallModal: React.FC<ActiveCallModalProps> = ({
  initialVoiceMask,
  onEndCall,
  onShowToast
}) => {
  const [seconds, setSeconds] = useState(52);
  const [activeVoiceMask, setActiveVoiceMask] = useState<VoiceMaskType>(initialVoiceMask);
  const [isMuted, setIsMuted] = useState(false);
  const [isBoosted, setIsBoosted] = useState(true);
  const [isHandsfree, setIsHandsfree] = useState(true);
  const [latchTaps, setLatchTaps] = useState(0);
  const [latchStatus, setLatchStatus] = useState('Apartment 402, Tower A Latch Locked');
  const [isLatchUnlocked, setIsLatchUnlocked] = useState(false);
  const [liveClock, setLiveClock] = useState('09:43:02 PM');
  const [activeMacro, setActiveMacro] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const callInterval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const clockInterval = setInterval(() => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);

    return () => {
      clearInterval(callInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = String(Math.floor(totalSecs / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleLatchClick = () => {
    if (latchTaps === 0) {
      setLatchTaps(1);
      setLatchStatus('Tap Again to Confirm');
      setTimeout(() => {
        setLatchTaps((current) => {
          if (current === 1) {
            setLatchStatus('Apartment 402, Tower A Latch Locked');
            return 0;
          }
          return current;
        });
      }, 3000);
    } else if (latchTaps >= 1) {
      setLatchTaps(0);
      setIsLatchUnlocked(true);
      setLatchStatus('Latch Released (5s)');
      onShowToast('Door Latch released for visitor.', 'lock_open');
      setTimeout(() => {
        setIsLatchUnlocked(false);
        setLatchStatus('Apartment 402, Tower A Latch Locked');
      }, 5000);
    }
  };

  const handleDeterrentChime = () => {
    onShowToast('85 dB Doorbell alert chime broadcast to doorstep speaker.', 'notifications_active');
  };

  const handleBroadcastMacro = (title: string, announcement: string) => {
    setActiveMacro(title);
    onShowToast(`Broadcasted to courier: "${announcement}"`, 'campaign');
    setTimeout(() => setActiveMacro(null), 1200);
  };

  const handleSnapshot = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);
    onShowToast('Frame captured to encrypted local session memory.', 'photo_camera');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#fdf9f1] flex flex-col pt-safe pb-safe animate-in fade-in">
      <div className="max-w-2xl w-full mx-auto p-4 flex flex-col gap-4">
        {/* TOP CALL METADATA & TELEMETRY STRIP */}
        <div className="flex flex-col gap-2 bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e6e2da]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-3 h-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b81c37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b81c37]"></span>
              </div>
              <span className="font-serif text-[20px] font-bold text-[#060810] tabular-nums tracking-tight">
                {formatTimer(seconds)}
              </span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#ece8e0] text-[#46464b] font-bold">
                2-Way Live
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f7f3eb] text-[#1c1c17] border border-[#e6e2da]">
              <span className="material-symbols-outlined text-[14px] text-[#b81c37]">
                verified_user
              </span>
              <span className="text-[10px] tracking-wider uppercase font-bold text-[#1c1c17]">
                DPDP Local Mesh
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[#46464b] pt-1">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#b81c37]">graphic_eq</span>
              <span className="text-[11px]">Latency 14ms · SRTP Encrypted</span>
            </div>
            <span className="text-[11px]">AES-256 GCM · No Cloud Logs</span>
          </div>

          {/* Verified Visitor Identification Plate */}
          <div className="flex items-center justify-between mt-1 pt-2 bg-[#f7f3eb] p-2.5 rounded-lg border border-[#e6e2da]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#e6e2da] flex items-center justify-center relative overflow-hidden text-[#060810]">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#b81c37] rounded-full"></div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-sans font-semibold text-[13px] text-[#060810] truncate">
                    Zepto Verified Delivery
                  </span>
                  <span
                    className="material-symbols-outlined text-[#b81c37] text-[15px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <span className="text-[11px] text-[#46464b]">
                  Order #ZP-9824 · Doorstep Terminal 01
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#f1ede5] text-[#060810] border border-[#e6e2da] inline-flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D]"></span>
              Apartment 402 · Tower A
            </span>
          </div>
        </div>

        {/* DOORSTEP LIVE VIDEO VIEWPORT WITH HUD & TRANSCRIPTION */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-md bg-[#060810] border border-[#060810]">
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200"></div>
          )}

          <div
            className="relative w-full aspect-[4/3] bg-cover bg-center overflow-hidden flex flex-col justify-between p-3"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0u49xjXjAqFLOXvydJcf5wZrh4KBudM84LNd6iD9kLDJgoDTHKI5l31-cHrqed4zDHs9LLUvO43gbVTmML9lBbzDOQhED5QOIFcsr3sJY36yg-UePVXZAnHgbTCwbz6dy1cXnqH9UZShGWQTVwEv0TakiBCQaioZ7kk1MWQS97cqoPqW3qdNdpGkV5dWhwIikV7354xXZ1OKl76UVm2LMwQ78T4l58OdjHABnHBZGjPv8He7urg')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#060810]/80 via-transparent to-[#060810]/85 pointer-events-none"></div>

            {/* Top Overlay Controls & Stamp */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#060810]/80 backdrop-blur-md text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe5364] animate-pulse"></span>
                  <span className="text-[10px] uppercase font-bold tracking-wider">LIVE</span>
                  <span className="text-[10px] opacity-80">{liveClock}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#060810]/70 backdrop-blur-md text-white font-medium">
                  1080p · 60fps
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSnapshot}
                  aria-label="Snapshot"
                  className="w-8 h-8 rounded-lg bg-[#060810]/70 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>
                <button
                  type="button"
                  aria-label="Fullscreen"
                  onClick={() => onShowToast('Intercom viewport maximized.', 'fullscreen')}
                  className="w-8 h-8 rounded-lg bg-[#060810]/70 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                </button>
              </div>
            </div>

            {/* Edge AI Parcel Detection Visual Box Overlay */}
            <div className="absolute top-[46%] left-[28%] w-36 h-28 pointer-events-none rounded border-dashed border-2 border-[#fe5364]/80 flex flex-col justify-between p-1">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#b81c37] text-white self-start tracking-wider">
                AI: PARCEL 98%
              </span>
              <span className="text-[10px] font-semibold text-white drop-shadow self-end">
                Shoe Rack Zone
              </span>
            </div>

            {/* Visitor Voice Real-Time Subtitle / Speech Transcription Bubble */}
            <div className="relative z-10 flex flex-col gap-1 w-full">
              <div className="bg-[#060810]/85 backdrop-blur-md p-2.5 rounded-lg shadow-sm max-w-[95%] self-start border border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[#fe5364] text-[14px]">hearing</span>
                  <span className="text-[10px] font-bold text-[#ffb3b4] uppercase tracking-wider">
                    Live Visitor Audio · Speech-to-Text
                  </span>
                </div>
                <p className="text-[13px] text-white leading-snug">
                  “Namaste, Zepto delivery for Apartment 402, Tower A. Should I place it on the shoe rack or wait?”
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* VOICE MASK DSP ENGINE & LIVE WAVEFORM DUAL VISUALIZER */}
        <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-sm gap-3 border border-[#e6e2da]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#1d2029] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-[#ffb3b4]">
                  record_voice_over
                </span>
              </div>
              <div>
                <span className="font-sans font-semibold text-[13px] text-[#060810] block leading-tight">
                  Live Pitch Masking DSP
                </span>
                <span className="text-[11px] text-[#46464b]">
                  Acoustic Identity Obfuscation active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#ece8e0] text-[#060810]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b81c37]"></span>
              <span className="text-[11px] font-bold">Active Filter</span>
            </div>
          </div>

          {/* Active Mask Telemetry Callout Card */}
          <div className="bg-[#f7f3eb] p-2.5 rounded-lg flex items-center justify-between border border-[#e6e2da]">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#b81c37] font-bold">
                {activeVoiceMask === 'deep'
                  ? 'DEEP (MASCULINE BARITONE)'
                  : activeVoiceMask === 'neutral'
                  ? 'NEUTRAL ADULT'
                  : activeVoiceMask === 'higher'
                  ? 'CARETAKER BOOST'
                  : 'BYPASS (UNFILTERED)'}
              </span>
              <span className="text-[12px] text-[#1c1c17]">
                {activeVoiceMask === 'deep'
                  ? 'Modulated Pitch: 84 Hz (-14 semitones)'
                  : activeVoiceMask === 'neutral'
                  ? 'Modulated Pitch: 125 Hz (-6 semitones)'
                  : activeVoiceMask === 'higher'
                  ? 'Modulated Pitch: 185 Hz (+4 semitones)'
                  : 'Modulated Pitch: Natural Direct Pass'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#46464b] px-2 py-1 rounded bg-[#e6e2da]">
              Hardware DSP
            </span>
          </div>

          {/* Dual Waveform Visualizer */}
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-[#ece8e0] border border-[#e6e2da]">
            {/* Input Mic Signal */}
            <div className="flex items-center justify-between text-[#46464b]">
              <span className="text-[10px] font-bold uppercase flex items-center gap-1 text-[#060810]">
                <span className="material-symbols-outlined text-[13px] text-[#46464b]">mic</span>
                Inward Voice (Your Real Mic)
              </span>
              <span className="text-[11px] tabular-nums font-mono">210 Hz · Raw</span>
            </div>
            <div className="flex items-end justify-between h-5 px-1 gap-1">
              {[8, 12, 16, 8, 20, 12, 8, 16, 12, 8, 16, 8].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 bg-[#76777c] rounded-full transition-all duration-150 ${
                    idx % 2 === 0 ? 'animate-pulse' : ''
                  }`}
                  style={{ height: `${h}px` }}
                ></div>
              ))}
            </div>

            {/* Output Masked Doorbell Broadcast */}
            <div className="flex items-center justify-between text-[#46464b] mt-1 pt-1">
              <span className="text-[10px] font-bold uppercase flex items-center gap-1 text-[#b81c37]">
                <span className="material-symbols-outlined text-[13px] text-[#b81c37]">
                  volume_up
                </span>
                Doorstep Output (Broadcast Mask)
              </span>
              <span className="text-[11px] tabular-nums text-[#b81c37] font-bold font-mono">
                84 Hz · Shifted
              </span>
            </div>
            <div className="flex items-end justify-between h-7 px-1 gap-1">
              {[20, 28, 16, 24, 28, 20, 24, 28, 20, 28, 24, 16].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 bg-[#b81c37] rounded-full transition-all duration-150 ${
                    idx % 3 === 0 ? 'animate-pulse' : ''
                  }`}
                  style={{ height: `${h}px` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Voice Filter Selection Tabs */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setActiveVoiceMask('deep')}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all ${
                activeVoiceMask === 'deep'
                  ? 'bg-[#060810] text-white'
                  : 'bg-[#f1ede5] text-[#060810] hover:bg-[#ece8e0]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">equalizer</span>
              <span className="text-[10px] mt-0.5 font-bold">Deep Voice</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveVoiceMask('neutral')}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all ${
                activeVoiceMask === 'neutral'
                  ? 'bg-[#060810] text-white'
                  : 'bg-[#f1ede5] text-[#060810] hover:bg-[#ece8e0]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">face</span>
              <span className="text-[10px] mt-0.5 font-bold">Neutral Adult</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveVoiceMask('higher')}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all ${
                activeVoiceMask === 'higher'
                  ? 'bg-[#060810] text-white'
                  : 'bg-[#f1ede5] text-[#060810] hover:bg-[#ece8e0]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">elderly</span>
              <span className="text-[10px] mt-0.5 font-bold">Caretaker</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveVoiceMask('original')}
              className={`flex flex-col items-center py-2 px-1 rounded-lg transition-all ${
                activeVoiceMask === 'original'
                  ? 'bg-[#060810] text-white'
                  : 'bg-[#f1ede5] text-[#060810] hover:bg-[#ece8e0]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span className="text-[10px] mt-0.5 font-bold">Bypass</span>
            </button>
          </div>
        </div>

        {/* ONE-TAP QUICK VOICE BROADCAST MACROS */}
        <div className="flex flex-col bg-[#ffffff] p-4 rounded-xl shadow-sm gap-2.5 border border-[#e6e2da]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#b81c37] text-[18px]">
                speaker_notes
              </span>
              <span className="font-serif text-[18px] font-semibold text-[#060810]">
                Quick Doorstep Broadcasts
              </span>
            </div>
            <span className="text-[11px] text-[#46464b] font-medium">Instant Synth Play</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleBroadcastMacro('Leave on shoe rack', 'Please place the package on the shoe rack, thank you.')}
              className={`flex items-start gap-2 p-2.5 rounded-lg bg-[#f7f3eb] text-left hover:bg-[#ece8e0] active:scale-[0.98] transition-all border border-[#e6e2da]/60 ${
                activeMacro === 'Leave on shoe rack' ? 'ring-2 ring-[#b81c37]' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[#060810] text-[18px] mt-0.5">
                inventory_2
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-sans font-semibold text-[13px] text-[#060810] leading-snug">
                  Leave on shoe rack
                </span>
                <span className="text-[11px] text-[#46464b]">Plays in Hindi + Eng</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleBroadcastMacro('Wait 1 min, coming', 'Please wait one minute, someone is coming to the door.')}
              className={`flex items-start gap-2 p-2.5 rounded-lg bg-[#f7f3eb] text-left hover:bg-[#ece8e0] active:scale-[0.98] transition-all border border-[#e6e2da]/60 ${
                activeMacro === 'Wait 1 min, coming' ? 'ring-2 ring-[#b81c37]' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[#060810] text-[18px] mt-0.5">
                hourglass_top
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-sans font-semibold text-[13px] text-[#060810] leading-snug">
                  Wait 1 min, coming
                </span>
                <span className="text-[11px] text-[#46464b]">Alert tone + pause</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleBroadcastMacro('Use OTP lockbox', 'Use smart lockbox: Enter PIN 8491 to place parcel.')}
              className={`flex items-start gap-2 p-2.5 rounded-lg bg-[#f7f3eb] text-left hover:bg-[#ece8e0] active:scale-[0.98] transition-all border border-[#e6e2da]/60 ${
                activeMacro === 'Use OTP lockbox' ? 'ring-2 ring-[#b81c37]' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[#060810] text-[18px] mt-0.5">
                lock_open
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-sans font-semibold text-[13px] text-[#060810] leading-snug">
                  Use OTP lockbox
                </span>
                <span className="text-[11px] text-[#46464b]">Transmits PIN: 8491</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleBroadcastMacro('Wrong address', 'This is Apartment 402, Tower A. Please double check the delivery address on your app.')}
              className={`flex items-start gap-2 p-2.5 rounded-lg bg-[#f7f3eb] text-left hover:bg-[#ece8e0] active:scale-[0.98] transition-all border border-[#e6e2da]/60 ${
                activeMacro === 'Wrong address' ? 'ring-2 ring-[#b81c37]' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[#b81c37] text-[18px] mt-0.5">
                wrong_location
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-sans font-semibold text-[13px] text-[#b81c37] leading-snug">
                  Wrong address
                </span>
                <span className="text-[11px] text-[#46464b]">Verify apt number</span>
              </div>
            </button>
          </div>
        </div>

        {/* HARDWARE PERIMETER CONTROLS: DIGITAL DOOR LATCH & DETERRENT */}
        <div className="grid grid-cols-2 gap-3">
          {/* Door Latch */}
          <button
            type="button"
            onClick={handleLatchClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-sm transition-all border ${
              isLatchUnlocked
                ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]'
                : 'bg-[#ffffff] hover:bg-[#f7f3eb] text-[#060810] border-[#e6e2da]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
                isLatchUnlocked ? 'bg-white/20 text-white' : 'bg-[#ece8e0] text-[#060810]'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {isLatchUnlocked ? 'lock_open' : 'lock'}
              </span>
            </div>
            <span
              className={`font-sans font-semibold text-[14px] ${
                latchTaps === 1 ? 'text-[#b81c37]' : ''
              }`}
            >
              {latchStatus}
            </span>
            <span
              className={`text-[11px] mt-0.5 ${
                isLatchUnlocked ? 'text-white/80' : 'text-[#46464b]'
              }`}
            >
              {latchTaps === 1 ? 'Tap once more' : 'Tap twice to disengage'}
            </span>
          </button>

          {/* Deterrent Chime */}
          <button
            type="button"
            onClick={handleDeterrentChime}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#ffffff] hover:bg-[#f7f3eb] shadow-sm active:bg-[#f1ede5] transition-all border border-[#e6e2da]"
          >
            <div className="w-10 h-10 rounded-full bg-[#ffdada] text-[#b81c37] flex items-center justify-center mb-1.5">
              <span className="material-symbols-outlined text-[22px]">notifications_active</span>
            </div>
            <span className="font-sans font-semibold text-[14px] text-[#060810]">
              Deterrent Chime
            </span>
            <span className="text-[11px] text-[#46464b] mt-0.5">85 dB Doorbell Alert</span>
          </button>
        </div>

        {/* CALL HANDLING COMMAND DOCK */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#060810] text-white shadow-lg mt-1 border border-[#1d2029]">
          <button
            type="button"
            onClick={() => {
              setIsMuted(!isMuted);
              onShowToast(isMuted ? 'Microphone active.' : 'Microphone muted.');
            }}
            aria-label="Mute Microphone"
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] rounded-lg transition-all active:scale-95 ${
              isMuted ? 'bg-[#b81c37]' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMuted ? 'mic_off' : 'mic'}
            </span>
            <span className="text-[10px] font-bold text-white mt-1">
              {isMuted ? 'Muted' : 'Mute'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsBoosted(!isBoosted);
              onShowToast(isBoosted ? 'Audio clarity standard.' : 'Audio clarity boost active.');
            }}
            aria-label="Audio Boost"
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] rounded-lg transition-all active:scale-95 ${
              isBoosted ? 'bg-[#ffddb1]/20 text-[#ffddb1]' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">hearing</span>
            <span className="text-[10px] font-bold mt-1">Boost</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsHandsfree(!isHandsfree);
              onShowToast(isHandsfree ? 'Push-To-Talk active.' : 'Handsfree mode enabled.');
            }}
            aria-label="Audio Mode"
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] rounded-lg transition-all active:scale-95 ${
              isHandsfree ? 'bg-white/10 text-white' : 'bg-[#b81c37]/30 text-[#ffb3b4]'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">settings_voice</span>
            <span className="text-[10px] font-bold mt-1">
              {isHandsfree ? 'Handsfree' : 'PTT Mode'}
            </span>
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={onEndCall}
            aria-label="End Intercom Call"
            className="flex items-center justify-center px-6 h-[56px] rounded-lg bg-[#b81c37] hover:bg-[#920024] text-white shadow-md active:scale-95 transition-all gap-2"
          >
            <span className="material-symbols-outlined text-[24px]">call_end</span>
            <span className="font-sans text-[14px] uppercase font-bold tracking-wide">
              End Call
            </span>
          </button>
        </div>

        {/* STATUTORY CHIP */}
        <div className="flex items-center justify-center gap-1.5 text-center text-[#46464b] py-1 text-[11px]">
          <span className="material-symbols-outlined text-[14px] text-[#b81c37]">security</span>
          <span>DPDP Act (India) · Micro-SD Edge Encrypted · Ephemeral Session</span>
        </div>
      </div>
    </div>
  );
};
