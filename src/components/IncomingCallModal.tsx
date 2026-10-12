import React, { useState } from 'react';
import { VoiceMaskType } from '../types';

interface IncomingCallModalProps {
  onClose: () => void;
  onAccept: (selectedMask: VoiceMaskType) => void;
  initialMask?: VoiceMaskType;
  onShowToast: (msg: string, icon?: string) => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  onClose,
  onAccept,
  initialMask = 'deep',
  onShowToast
}) => {
  const [selectedMask, setSelectedMask] = useState<VoiceMaskType>(initialMask);

  const handleLeaveAtDoor = () => {
    onShowToast('Automated Doorbell Chime: "Please leave package by the door. Thank you."', 'inventory_2');
    onClose();
  };

  const handlePlaySiren = () => {
    onShowToast('High-decibel warning audio siren triggered at doorbell.', 'e911_emergency');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[#060810]/75 backdrop-blur-md transition-all duration-300 px-4 pb-safe animate-in fade-in">
      <div className="w-full max-w-lg mx-auto bg-[#ffffff] border-t border-x border-[#ece8e0] rounded-t-2xl shadow-2xl overflow-hidden flex flex-col gap-3 p-4 mb-16 animate-in slide-in-from-bottom-8">
        {/* Header Ringing Strip */}
        <div className="flex items-center justify-between border-b border-[#f1ede5] pb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b81c37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#b81c37]"></span>
            </span>
            <span className="text-[11px] uppercase tracking-widest text-[#b81c37] font-bold">
              INCOMING CALL · RINGING
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#46464b] bg-[#f1ede5] px-2 py-0.5 rounded text-[11px] font-medium">
            <span className="material-symbols-outlined text-[14px] animate-pulse text-[#b81c37]">
              notifications_active
            </span>
            <span>Chime Active</span>
          </div>
        </div>

        {/* Visitor Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#f7f3eb] border border-[#e6e2da]">
          <div className="relative w-14 h-14 rounded-md overflow-hidden bg-[#060810] shrink-0 border border-[#c7c6cc]/40">
            <img
              alt="Visitor Snapshot"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeG44BvMp4E5Eh7d-NvU8WjRCl2sZT6LccnHzLNczaIEhngi1_4Unrhn3JwHSkKE4ckFRDpD9pAd1DUE-I5C4JNA21yTBmaja7A6kogNDjfq258_RMjUxbg-JkhJs8tCkWksFGBh-QjVtcK560iS2KK2fmSHXzx2BLP_Yn3rL8VdcAi9t4nO4mAnAfyUGGe1EpSBKeRtDO5ycaPXNcz_iUOT5bNDUSVuUPFO-I4dNiebn_LnZMfA"
            />
            <span className="absolute bottom-0 right-0 bg-[#b81c37] text-[9px] font-bold text-white px-1 rounded-tl">
              LIVE
            </span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-[#060810] text-[16px] truncate">
                Zepto Delivery Partner
              </span>
              <span className="text-[11px] text-[#46464b]">Just now</span>
            </div>
            <span className="text-[12px] text-[#46464b] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#b81c37]">verified_user</span>
              98% AI Match · Helmet &amp; Vest
            </span>
            <span className="text-[11px] text-[#46464b] mt-0.5">
              Apartment 402, Tower A · Front Doorbell
            </span>
          </div>
        </div>

        {/* Voice Mask Selector */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-[#46464b] font-bold">
              Pre-Select Mask (SafeHaven DSP)
            </span>
            <span className="text-[11px] text-[#b81c37] font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">lock</span> Identity Guard ON
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedMask('deep')}
              className={`py-1.5 px-1 rounded border flex flex-col items-center justify-center text-center transition-all ${
                selectedMask === 'deep'
                  ? 'border-[#060810] bg-[#060810] text-white shadow-sm ring-1 ring-[#060810]'
                  : 'border-[#c7c6cc] bg-[#f1ede5] text-[#1c1c17]'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${selectedMask === 'deep' ? 'text-[#fe5364]' : 'text-[#46464b]'}`}>
                shield_person
              </span>
              <span className="text-[10px] font-bold mt-0.5 leading-tight">Deep</span>
              <span className={`text-[8px] leading-none ${selectedMask === 'deep' ? 'opacity-80' : 'text-[#46464b]'}`}>
                Authoritative
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMask('neutral')}
              className={`py-1.5 px-1 rounded border flex flex-col items-center justify-center text-center transition-all ${
                selectedMask === 'neutral'
                  ? 'border-[#060810] bg-[#060810] text-white shadow-sm ring-1 ring-[#060810]'
                  : 'border-[#c7c6cc] bg-[#f1ede5] text-[#1c1c17]'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${selectedMask === 'neutral' ? 'text-[#fe5364]' : 'text-[#46464b]'}`}>
                record_voice_over
              </span>
              <span className="text-[10px] font-semibold mt-0.5 leading-tight">Neutral</span>
              <span className={`text-[8px] leading-none ${selectedMask === 'neutral' ? 'opacity-80' : 'text-[#46464b]'}`}>
                Adult Tone
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMask('higher')}
              className={`py-1.5 px-1 rounded border flex flex-col items-center justify-center text-center transition-all ${
                selectedMask === 'higher'
                  ? 'border-[#060810] bg-[#060810] text-white shadow-sm ring-1 ring-[#060810]'
                  : 'border-[#c7c6cc] bg-[#f1ede5] text-[#1c1c17]'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${selectedMask === 'higher' ? 'text-[#fe5364]' : 'text-[#46464b]'}`}>
                settings_voice
              </span>
              <span className="text-[10px] font-semibold mt-0.5 leading-tight">High</span>
              <span className={`text-[8px] leading-none ${selectedMask === 'higher' ? 'opacity-80' : 'text-[#46464b]'}`}>
                Clarity Boost
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMask('original')}
              className={`py-1.5 px-1 rounded border flex flex-col items-center justify-center text-center transition-all ${
                selectedMask === 'original'
                  ? 'border-[#060810] bg-[#060810] text-white shadow-sm ring-1 ring-[#060810]'
                  : 'border-[#c7c6cc] bg-[#f1ede5] text-[#1c1c17]'
              }`}
            >
              <span className={`material-symbols-outlined text-[16px] ${selectedMask === 'original' ? 'text-[#fe5364]' : 'text-[#46464b]'}`}>
                mic
              </span>
              <span className="text-[10px] font-semibold mt-0.5 leading-tight">Direct</span>
              <span className={`text-[8px] leading-none ${selectedMask === 'original' ? 'opacity-80' : 'text-[#46464b]'}`}>
                Unfiltered
              </span>
            </button>
          </div>
        </div>

        {/* Quick Canned Macros */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleLeaveAtDoor}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded bg-[#f1ede5] hover:bg-[#ece8e0] text-[#060810] border border-[#c7c6cc]/60 text-[12px] font-semibold transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[16px] text-[#b81c37]">inventory_2</span>
            <span>Auto: Leave at Door</span>
          </button>
          <button
            type="button"
            onClick={handlePlaySiren}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded bg-[#ffdada] hover:bg-[#ffb3b4] text-[#b81c37] border border-[#ffdada] text-[12px] font-semibold transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[16px]">e911_emergency</span>
            <span>Play Audio Siren</span>
          </button>
        </div>

        {/* Bottom Call Action Row */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#f1ede5]">
          <button
            type="button"
            onClick={onClose}
            title="Decline Call"
            className="w-12 h-12 rounded-full bg-[#f1ede5] hover:bg-[#ece8e0] border border-[#c7c6cc] text-[#ba1a1a] flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
          >
            <span className="material-symbols-outlined text-[24px]">call_end</span>
          </button>

          <button
            type="button"
            onClick={() => onAccept(selectedMask)}
            className="flex-1 h-12 rounded-full bg-[#060810] text-white hover:bg-[#1d2029] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-lg border border-[#c4c6d2]/20"
          >
            <span className="material-symbols-outlined text-[22px] text-[#fe5364] animate-pulse">
              call
            </span>
            <div className="flex flex-col items-start text-left leading-tight">
              <span className="font-sans font-bold text-white text-[14px]">
                ACCEPT &amp; TALK
              </span>
              <span className="text-[9px] text-[#fe5364] font-semibold uppercase tracking-wider">
                {selectedMask.toUpperCase()} Voice Filter Active
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onShowToast('Transmitted: "Please wait, coming to door in 1 minute."', 'chat_bubble');
            }}
            title="Quick Voice Canned Response"
            className="w-12 h-12 rounded-full bg-[#f1ede5] hover:bg-[#ece8e0] border border-[#c7c6cc] text-[#1c1c17] flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
          </button>
        </div>
      </div>
    </div>
  );
};
