import React, { useState } from 'react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab?: TabType;
  onTriggerIncomingCall: () => void;
  onTriggerFallAlert: () => void;
  onOpenActiveCall?: () => void;
  onViewIncidentDetail: () => void;
  onOpenInHomeCctv?: () => void;
  isOnline?: boolean;
  isLocalOnlyMode?: boolean;
  onShowToast?: (msg: string, icon?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'doorstep',
  onTriggerIncomingCall,
  onTriggerFallAlert,
  onOpenActiveCall,
  onViewIncidentDetail,
  onOpenInHomeCctv,
  isOnline = true,
  isLocalOnlyMode = false,
  onShowToast
}) => {
  const [showSimMenu, setShowSimMenu] = useState(false);

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'doorstep':
        return 'Gate & Doorbell';
      case 'cctv':
        return 'In-Home CCTV';
      case 'family-care':
        return 'Family Care';
      case 'sos-hub':
        return 'SOS Hub';
      case 'devices-data':
        return 'Devices & Data';
      default:
        return 'Gate & Doorbell';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#fdf9f1]/92 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e6e2da]/40">
      <div className="max-w-2xl mx-auto h-20 px-5 flex flex-col justify-center gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt="SafeHaven Brand Shield"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1X0DRepxAGcY498W8WHavGq2FWRlqejZtucL86OuO8Taqoahn509N6rFY1XlJzhzrWQR5LtmKQJyqw7-CLbXN-oLTCabYztSEcKdsNufN348t_y4viChJPvwAWvOTtdXMpE4SkYU0UZZWznVMG45SWogPMZU4RaVn1_PvJHLHho6LsHrUviWY-V-3H9bAB6cl8PPTK8GEyO1eMm33oyUHVUz5x0KCOYbxIkZMQHg9dxCgZME2wKHA-K"
            />
            <div className="flex flex-col">
              <span className="font-sans text-[13px] font-semibold text-[#060810] tracking-tight leading-none">
                SafeHaven
              </span>
              <span className="font-serif text-[18px] font-bold text-[#1c1c17] leading-tight">
                {getSectionTitle()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Simulation Shortcuts Drawer Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSimMenu(!showSimMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ece8e0] hover:bg-[#e6e2da] text-[#1c1c17] text-[11px] font-bold tracking-wide transition-all shadow-sm"
                title="Simulation scenarios for testing"
              >
                <span className="w-2 h-2 rounded-full bg-[#3E8F5D] animate-pulse"></span>
                <span>Apartment 402 · Tower A</span>
                <span className="material-symbols-outlined text-[15px] opacity-70">
                  {showSimMenu ? 'expand_less' : 'tune'}
                </span>
              </button>

              {showSimMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#ffffff] border border-[#c7c6cc]/50 rounded-xl shadow-2xl p-2.5 z-50 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#f1ede5] px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#46464b]">
                      Hardware Event Triggers
                    </span>
                    <button
                      onClick={() => setShowSimMenu(false)}
                      className="text-[#76777c] hover:text-[#1c1c17]"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>

                  {onOpenInHomeCctv && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowSimMenu(false);
                        onOpenInHomeCctv();
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f3eb] text-left transition-colors text-[13px] font-semibold text-[#060810]"
                    >
                      <div className="w-7 h-7 rounded bg-[#3E8F5D]/15 text-[#3E8F5D] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                      </div>
                      <div>
                        <div className="leading-snug">In-Home CCTV Feeds</div>
                        <div className="text-[11px] font-normal text-[#46464b]">Living, Balcony, Kitchen, Corridor</div>
                      </div>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowSimMenu(false);
                      onTriggerIncomingCall();
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f3eb] text-left transition-colors text-[13px] font-semibold text-[#060810]"
                  >
                    <div className="w-7 h-7 rounded bg-[#b81c37]/10 text-[#b81c37] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">doorbell</span>
                    </div>
                    <div>
                      <div className="leading-snug">Doorbell Ring (Incoming)</div>
                      <div className="text-[11px] font-normal text-[#46464b]">Zepto courier delivery partner</div>
                    </div>
                  </button>

                  {onOpenActiveCall && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowSimMenu(false);
                        onOpenActiveCall();
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f3eb] text-left transition-colors text-[13px] font-semibold text-[#060810]"
                    >
                      <div className="w-7 h-7 rounded bg-[#060810] text-white flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">call</span>
                      </div>
                      <div>
                        <div className="leading-snug">Open 2-Way Active Call</div>
                        <div className="text-[11px] font-normal text-[#46464b]">Live DSP voice mask interface</div>
                      </div>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowSimMenu(false);
                      onTriggerFallAlert();
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f3eb] text-left transition-colors text-[13px] font-semibold text-[#b81c37]"
                  >
                    <div className="w-7 h-7 rounded bg-[#b81c37] text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">emergency</span>
                    </div>
                    <div>
                      <div className="leading-snug">Critical Fall SOS Alert</div>
                      <div className="text-[11px] font-normal text-[#46464b]">Hallway Pod 04 trigger (00:42s)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSimMenu(false);
                      onViewIncidentDetail();
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f7f3eb] text-left transition-colors text-[13px] font-semibold text-[#060810]"
                  >
                    <div className="w-7 h-7 rounded bg-[#ece8e0] text-[#060810] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                    </div>
                    <div>
                      <div className="leading-snug">Incident Audit #FA-1048</div>
                      <div className="text-[11px] font-normal text-[#46464b]">Resolved case & clinical report</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <div className="w-8 h-8 rounded-full bg-[#060810] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-0.5 text-[#46464b]">
          <div className="flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[14px] ${isLocalOnlyMode ? 'text-[#3E8F5D]' : 'text-[#b81c37]'}`}>
              {isLocalOnlyMode ? 'cloud_off' : 'bolt'}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isLocalOnlyMode
                ? 'Cloud-Sync: Disabled · Local IndexedDB Vault'
                : isOnline
                ? 'Fibre 1 Gbps · 4G Standby · Cloud-Sync Active'
                : 'Offline Mode · Local Sensor Mesh'}
            </span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
            isLocalOnlyMode ? 'text-[#3E8F5D]' : 'text-[#46464b]'
          }`}>
            {isLocalOnlyMode ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D] animate-pulse"></span>
                Local-Only Mode Active
              </>
            ) : (
              'Onshore Cloud Sync'
            )}
          </span>
        </div>
      </div>
    </header>
  );
};
