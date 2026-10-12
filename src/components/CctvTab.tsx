import React from 'react';
import { InHomeCctvViewer } from './InHomeCctvViewer';

interface CctvTabProps {
  onShowToast?: (msg: string, icon?: string) => void;
  onSwitchToGate?: () => void;
}

export const CctvTab: React.FC<CctvTabProps> = ({
  onShowToast,
  onSwitchToGate
}) => {
  return (
    <div className="flex flex-col w-full gap-3.5 max-w-2xl mx-auto animate-in fade-in">
      {/* Top Cross-Navigation Banner with Quick Switch to Gate & Doorbell */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#e6e2da] shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#3E8F5D]/10 text-[#3E8F5D] flex items-center justify-center shrink-0 border border-[#3E8F5D]/25">
            <span className="material-symbols-outlined text-[18px]">videocam</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12.5px] font-bold text-[#060810] leading-tight">
                In-Home CCTV Hub
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-[#f1ede5] border border-[#e6e2da] text-[#060810] inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D]"></span>
                Apartment 402 · Tower A
              </span>
            </div>
            <div className="text-[10.5px] text-[#46464b] mt-0.5">
              4 Optical Nodes &middot; Motorized Privacy Shutters &middot; Local RTSP
            </div>
          </div>
        </div>

        {onSwitchToGate && (
          <button
            type="button"
            onClick={onSwitchToGate}
            className="px-2.5 py-1.5 rounded-lg bg-[#f1ede5] hover:bg-[#e6e2da] text-[#060810] text-[11px] font-bold flex items-center gap-1.5 transition-all border border-[#e6e2da] shrink-0 active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">doorbell</span>
            <span>Gate &amp; Intercom</span>
          </button>
        )}
      </div>

      {/* Main CCTV Viewer Module */}
      <InHomeCctvViewer onShowToast={onShowToast} />

      {/* DPDP Compliance & Local Edge Guarantees Footer Card */}
      <div className="p-3 rounded-xl bg-white border border-[#e6e2da] shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#3E8F5D]">
              verified_user
            </span>
            <span className="font-sans font-bold text-[12px] text-[#060810]">
              DPDP Act 2023 Sovereign Privacy Architecture
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#3E8F5D] bg-[#3E8F5D]/10 px-1.5 py-0.5 rounded border border-[#3E8F5D]/25">
            Zero Cloud Leak
          </span>
        </div>
        <p className="text-[11px] text-[#46464b] leading-relaxed">
          All interior feeds are processed on-device via Apartment 402, Tower A edge neural accelerator. Motorized physical shutters mechanically block camera sensors when shuttered, physically cutting microphone power circuits.
        </p>
      </div>
    </div>
  );
};
