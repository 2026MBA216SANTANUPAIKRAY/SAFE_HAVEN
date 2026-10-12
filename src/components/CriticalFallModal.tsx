import React, { useState, useEffect } from 'react';

interface CriticalFallModalProps {
  onClose: () => void;
  onResolveToAudit: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const CriticalFallModal: React.FC<CriticalFallModalProps> = ({
  onClose,
  onResolveToAudit,
  onShowToast
}) => {
  const [countdown, setCountdown] = useState(38);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isDoorUnlocked, setIsDoorUnlocked] = useState(false);
  const [isHoldingMic, setIsHoldingMic] = useState(false);

  useEffect(() => {
    if (isCancelled) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onShowToast('Emergency 112 statutory dispatch executed.', 'emergency');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCancelled, onShowToast]);

  const handleCancelDispatch = () => {
    setIsCancelled(true);
    onShowToast('Auto 112 Dispatch cancelled by Household Fiduciary.', 'cancel');
  };

  const handleUnlockEntrance = () => {
    setIsDoorUnlocked(!isDoorUnlocked);
    onShowToast(
      isDoorUnlocked
        ? 'Apartment 402, Tower A main door re-locked.'
        : 'Emergency Access: Apartment 402, Tower A main door unlocked for responders.',
      'lock_open'
    );
  };

  const handleBroadcastToRoom = (msg: string) => {
    onShowToast(`Dispatched to Parent's Suite Speaker: "${msg}"`, 'campaign');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#060810]/85 backdrop-blur-md flex flex-col pt-safe pb-safe p-4 animate-in fade-in">
      <div className="max-w-2xl w-full mx-auto flex flex-col gap-3 my-auto">
        {/* Emergency Alert Banner */}
        <div className="bg-[#b81c37] text-white p-4 rounded-xl shadow-2xl flex flex-col gap-3 border border-[#fe5364]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[26px] animate-bounce">emergency</span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest block opacity-90">
                  Priority 1 · SOS Incident
                </span>
                <h2 className="font-serif text-[20px] font-bold leading-tight">
                  CRITICAL ALERT · FALL DETECTED
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Countdown timer strip */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-black/25 backdrop-blur-sm border border-white/15">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-[#ffb3b4]">schedule</span>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold">
                  {isCancelled ? 'Dispatch Paused by User' : 'Auto 112 Statutory Dispatch'}
                </span>
                <span className="text-[11px] opacity-80">
                  {isCancelled ? 'Direct manual call available below' : 'Dialing National Emergency in:'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isCancelled ? (
                <span className="font-mono text-[24px] font-bold bg-[#ba1a1a] px-3 py-1 rounded shadow-inner tracking-tight animate-pulse">
                  00:{String(countdown).padStart(2, '0')}s
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-1 bg-white/20 rounded">
                  HOLD / PAUSED
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] opacity-90 pt-0.5">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              Apartment 402, Tower A · Parent’s Suite &amp; Hallway (8:43 PM · 2m ago)
            </span>
            <span>Node 04 · Height 2.2m</span>
          </div>
        </div>

        {/* Cancellation / False Alarm Override */}
        {!isCancelled && (
          <button
            type="button"
            onClick={handleCancelDispatch}
            className="w-full py-2.5 px-4 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[12px] font-bold flex items-center justify-center gap-2 border border-white/20 transition-all active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>I'm Okay / False Alarm (Cancel Auto 112 Dispatch)</span>
          </button>
        )}

        {/* Zero-Optical Radar Spatial Point-Cloud Reconstruction */}
        <div className="bg-[#1d2029] text-white p-4 rounded-xl shadow-sm flex flex-col gap-2.5 border border-[#1d2029]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2be71] text-[20px]">sensors</span>
              <span className="font-serif text-[17px] font-bold">Zero-Optical Spatial Radar</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#f2be71] bg-white/10 px-2 py-0.5 rounded">
              DPDP Point-Cloud
            </span>
          </div>

          {/* Wireframe spatial perspective map */}
          <div className="relative w-full h-40 bg-black/40 rounded-lg overflow-hidden flex items-center justify-center border border-white/10">
            {/* Grid wireframe SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 300 150">
              <line x1="0" y1="130" x2="300" y2="130" stroke="#f2be71" strokeWidth="1"></line>
              <line x1="0" y1="90" x2="300" y2="90" stroke="#76777c" strokeWidth="0.5"></line>
              <line x1="0" y1="50" x2="300" y2="50" stroke="#76777c" strokeWidth="0.5"></line>
              <line x1="50" y1="0" x2="20" y2="150" stroke="#76777c" strokeWidth="0.5"></line>
              <line x1="150" y1="0" x2="150" y2="150" stroke="#76777c" strokeWidth="0.5"></line>
              <line x1="250" y1="0" x2="280" y2="150" stroke="#76777c" strokeWidth="0.5"></line>
            </svg>

            {/* Fallen Subject Marker & Shockwave */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#b81c37] flex items-center justify-center text-white shadow-lg animate-pulse">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                </div>
                <div className="absolute w-16 h-16 rounded-full border-2 border-[#fe5364] animate-ping pointer-events-none"></div>
                <div className="absolute w-24 h-24 rounded-full border border-[#f2be71]/40 scale-75 pointer-events-none"></div>
              </div>
              <span className="text-[10px] font-bold text-[#ffb3b4] mt-1 bg-black/60 px-2 py-0.5 rounded">
                Elevation 0.12m (Floor Level) · Static
              </span>
            </div>

            {/* Telemetry Corner Tags */}
            <div className="absolute top-2 left-2 text-[10px] text-[#858793] font-mono bg-black/50 px-2 py-1 rounded">
              Drop Vector: 0.4s · 1.8 m/s
            </div>
            <div className="absolute top-2 right-2 text-[10px] text-[#f2be71] font-mono bg-black/50 px-2 py-1 rounded">
              Impact Thud: 82 dB
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] text-white font-mono bg-black/50 px-2 py-1 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D]"></span>
              Chest Vitals: 18 br/min
            </div>
          </div>
        </div>

        {/* Urgent Room Audio Bridge & Live Speech Transcription */}
        <div className="bg-[#ffffff] p-4 rounded-xl shadow-sm flex flex-col gap-2.5 border border-[#e6e2da]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#b81c37] text-[18px]">mic</span>
              <span className="font-serif text-[17px] font-bold text-[#060810]">
                Urgent Room Audio Bridge
              </span>
            </div>
            <span className="text-[10px] text-[#3E8F5D] font-bold bg-[#3E8F5D]/10 px-2 py-0.5 rounded">
              Speaker 100% Boosted
            </span>
          </div>

          {/* Live transcript card */}
          <div className="p-3 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#b81c37] uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b81c37] animate-ping"></span>
              Live Acoustic Transcript (Node 04)
            </span>
            <p className="text-[13px] text-[#060810] font-medium italic">
              “Aah... Santanu... main theek hoon, par uth nahi pa rahi... kamar mein dard hai...”
            </p>
          </div>

          {/* One-tap reassurance presets */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleBroadcastToRoom('Ma, help is on the way, Santanu speaking!')}
              className="py-2 px-1 rounded bg-[#ece8e0] hover:bg-[#e6e2da] text-[#060810] text-[11px] font-bold text-center leading-tight transition-all active:scale-95"
            >
              "Ma, help on way!"
            </button>
            <button
              type="button"
              onClick={() => handleBroadcastToRoom('Stay still, please do not try to get up.')}
              className="py-2 px-1 rounded bg-[#ece8e0] hover:bg-[#e6e2da] text-[#060810] text-[11px] font-bold text-center leading-tight transition-all active:scale-95"
            >
              "Stay still, do not move"
            </button>
            <button
              type="button"
              onClick={() => handleBroadcastToRoom('[Chime sound]')}
              className="py-2 px-1 rounded bg-[#ece8e0] hover:bg-[#e6e2da] text-[#060810] text-[11px] font-bold text-center leading-tight transition-all active:scale-95"
            >
              Play Soft Chime
            </button>
          </div>

          {/* Direct Push to Talk */}
          <button
            type="button"
            onMouseDown={() => setIsHoldingMic(true)}
            onMouseUp={() => {
              setIsHoldingMic(false);
              onShowToast('Voice broadcast transmitted to Parents Room.', 'record_voice_over');
            }}
            onTouchStart={() => setIsHoldingMic(true)}
            onTouchEnd={() => {
              setIsHoldingMic(false);
              onShowToast('Voice broadcast transmitted to Parents Room.', 'record_voice_over');
            }}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-[13px] shadow-sm transition-all select-none ${
              isHoldingMic
                ? 'bg-[#920024] text-white ring-4 ring-[#fe5364]/40'
                : 'bg-[#060810] hover:bg-[#1d2029] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isHoldingMic ? 'record_voice_over' : 'mic'}
            </span>
            <span>{isHoldingMic ? 'TRANSMITTING VOICE TO ROOM...' : 'HOLD TO TALK TO ROOM 04'}</span>
          </button>
        </div>

        {/* Immediate Responders Dispatch Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onShowToast('Connecting direct line to Ambulance 102/112...', 'ambulance')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#ffdada] hover:bg-[#ffb3b4] text-[#920024] shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">ambulance</span>
            <span className="text-[12px] font-bold mt-1 text-center leading-tight">
              Call Ambulance
            </span>
            <span className="text-[10px] opacity-80">102 / 112</span>
          </button>

          <button
            type="button"
            onClick={() => onShowToast('Ringing Gate 1 Guard Guard Ramesh on intercom...', 'shield')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#ffffff] hover:bg-[#f7f3eb] text-[#060810] border border-[#e6e2da] shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px] text-[#060810]">deskphone</span>
            <span className="text-[12px] font-bold mt-1 text-center leading-tight">
              Ring Guard Desk
            </span>
            <span className="text-[10px] text-[#46464b]">Gate 1 Intercom</span>
          </button>

          <button
            type="button"
            onClick={handleUnlockEntrance}
            className={`flex flex-col items-center justify-center p-3 rounded-xl shadow-sm transition-all active:scale-95 ${
              isDoorUnlocked
                ? 'bg-[#2d6a4f] text-white'
                : 'bg-[#ffffff] hover:bg-[#f7f3eb] text-[#060810] border border-[#e6e2da]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isDoorUnlocked ? 'lock_open' : 'key'}
            </span>
            <span className="text-[12px] font-bold mt-1 text-center leading-tight">
              {isDoorUnlocked ? 'Door Unlocked' : 'Unlock Apt 402 (Tower A)'}
            </span>
            <span className="text-[10px] opacity-80">For Responders</span>
          </button>
        </div>

        {/* View Full Historical Audit Action */}
        <button
          type="button"
          onClick={onResolveToAudit}
          className="w-full py-2.5 px-4 rounded-xl bg-[#ece8e0] hover:bg-[#e6e2da] text-[#060810] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
          <span>View Verified Incident Diagnostic &amp; Resolution Report (#FA-1048)</span>
        </button>
      </div>
    </div>
  );
};
