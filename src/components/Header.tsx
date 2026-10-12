import React, { useState, useRef, useEffect } from 'react';
import { TabType, HardwareNode } from '../types';
import { HARDWARE_NODES } from '../data/mockData';
import { SafeHavenLogo } from './SafeHavenLogo';

interface HeaderProps {
  activeTab?: TabType;
  onNavigateTab?: (tab: TabType) => void;
  onTriggerIncomingCall: () => void;
  onTriggerFallAlert: () => void;
  onOpenActiveCall?: () => void;
  onViewIncidentDetail: () => void;
  onOpenInHomeCctv?: () => void;
  isOnline?: boolean;
  isLocalOnlyMode?: boolean;
  onShowToast?: (msg: string, icon?: string) => void;
  nodes?: HardwareNode[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'doorstep',
  onNavigateTab,
  onTriggerIncomingCall,
  onTriggerFallAlert,
  onOpenActiveCall,
  onViewIncidentDetail,
  onOpenInHomeCctv,
  isOnline = true,
  isLocalOnlyMode = false,
  onShowToast,
  nodes
}) => {
  const [showSimMenu, setShowSimMenu] = useState(false);
  const [showBatteryMenu, setShowBatteryMenu] = useState(false);
  const [isPingingPods, setIsPingingPods] = useState(false);

  const simMenuRef = useRef<HTMLDivElement>(null);
  const batteryMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (simMenuRef.current && !simMenuRef.current.contains(event.target as Node)) {
        setShowSimMenu(false);
      }
      if (batteryMenuRef.current && !batteryMenuRef.current.contains(event.target as Node)) {
        setShowBatteryMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter for mmWave non-optical radar sensors
  const hardwareList = nodes && nodes.length > 0 ? nodes : HARDWARE_NODES;
  const mmWaveSensors = hardwareList.filter(
    (n) =>
      n.badgeType === 'non-optical' ||
      n.name.toLowerCase().includes('radar') ||
      n.name.toLowerCase().includes('mmwave')
  );

  const avgBattery = Math.round(
    mmWaveSensors.reduce((acc, curr) => acc + curr.batteryLevel, 0) /
      (mmWaveSensors.length || 1)
  );

  const minBattery = mmWaveSensors.length
    ? Math.min(...mmWaveSensors.map((n) => n.batteryLevel))
    : 100;

  const getBatteryIcon = (level: number) => {
    if (level >= 90) return 'battery_full';
    if (level >= 75) return 'battery_6_bar';
    if (level >= 50) return 'battery_4_bar';
    if (level >= 25) return 'battery_2_bar';
    return 'battery_alert';
  };

  const getBatteryColor = (level: number) => {
    if (level >= 80) return 'text-[#3E8F5D]';
    if (level >= 40) return 'text-[#ac7f39]';
    return 'text-[#b81c37]';
  };

  const handlePingPods = () => {
    setIsPingingPods(true);
    if (onShowToast) {
      onShowToast(
        'Broadcasting RF battery & telemetry query to 3 mmWave radar pods...',
        'radar'
      );
    }
    setTimeout(() => {
      setIsPingingPods(false);
      if (onShowToast) {
        onShowToast(
          'Hardware Health Confirmed: All mmWave sensors nominal with >90% battery reserve.',
          'verified'
        );
      }
    }, 1000);
  };

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
          <div className="flex items-center gap-2.5">
            <SafeHavenLogo size={36} />
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
            {/* mmWave Sensor Battery Status Pill */}
            <div className="relative" ref={batteryMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowBatteryMenu(!showBatteryMenu);
                  setShowSimMenu(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ece8e0] hover:bg-[#e6e2da] text-[#1c1c17] text-[11px] font-bold tracking-wide transition-all shadow-sm cursor-pointer border ${
                  showBatteryMenu ? 'border-[#060810] ring-1 ring-[#060810]' : 'border-[#e6e2da]'
                }`}
                title="mmWave Sensors Battery Health & Status"
                aria-label="mmWave Sensors Battery Health"
              >
                <span
                  className="material-symbols-outlined text-[15px] text-[#3E8F5D]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  radar
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={`material-symbols-outlined text-[16px] ${getBatteryColor(avgBattery)}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {getBatteryIcon(avgBattery)}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#060810]">
                    {avgBattery}%
                  </span>
                </div>
                <span className="hidden xs:inline text-[9.5px] uppercase tracking-wider font-bold text-[#46464b] bg-[#dedad2] px-1 py-0.2 rounded">
                  {mmWaveSensors.length} Pods
                </span>
                <span className="material-symbols-outlined text-[14px] opacity-70">
                  {showBatteryMenu ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Battery Status & Hardware Health Popover */}
              {showBatteryMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#ffffff] border border-[#c7c6cc]/60 rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f1ede5]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#3E8F5D]">
                        vital_signs
                      </span>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#060810] block leading-none">
                          mmWave Hardware Health
                        </span>
                        <span className="text-[10px] text-[#76777c]">
                          60GHz FMCW Array · Apt 402
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowBatteryMenu(false)}
                      className="text-[#76777c] hover:text-[#1c1c17] p-0.5 rounded cursor-pointer"
                      aria-label="Close battery menu"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>

                  {/* Summary Status Strip */}
                  <div className="p-2 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#3E8F5D] animate-pulse"></span>
                        <span className="text-[11px] font-bold text-[#060810]">
                          {mmWaveSensors.length}/{mmWaveSensors.length} Sensors Online
                        </span>
                      </div>
                      <span className="text-[10px] text-[#46464b] block mt-0.5">
                        Dual AC Float + Li-ion Reserves
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[14px] font-bold text-[#3E8F5D]">
                        {avgBattery}%
                      </span>
                      <span className="text-[9.5px] text-[#76777c] block leading-none">
                        Avg Battery
                      </span>
                    </div>
                  </div>

                  {/* Individual Sensor Battery Breakdown */}
                  <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-0.5">
                    {mmWaveSensors.map((sensor) => {
                      const iconName = getBatteryIcon(sensor.batteryLevel);
                      const colorClass = getBatteryColor(sensor.batteryLevel);
                      return (
                        <div
                          key={sensor.id}
                          className="p-2 rounded-lg bg-[#ffffff] hover:bg-[#fbf8f2] border border-[#e6e2da] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className={`material-symbols-outlined text-[16px] ${colorClass}`}>
                                {iconName}
                              </span>
                              <div>
                                <span className="font-sans font-bold text-[11.5px] text-[#060810] block leading-tight">
                                  {sensor.name}
                                </span>
                                <span className="text-[10px] text-[#76777c]">
                                  {sensor.location}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-[12px] text-[#060810]">
                                {sensor.batteryLevel}%
                              </span>
                              <span className="text-[9.5px] text-[#3E8F5D] block font-medium">
                                {sensor.batteryStatus === 'mains_backup' ? 'UPS Float' : 'Armed'}
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-[#e6e2da] h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div
                              className={`h-full rounded-full ${
                                sensor.batteryLevel >= 80
                                  ? 'bg-[#3E8F5D]'
                                  : sensor.batteryLevel >= 40
                                  ? 'bg-[#ac7f39]'
                                  : 'bg-[#b81c37]'
                              }`}
                              style={{ width: `${sensor.batteryLevel}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[9.5px] text-[#76777c] mt-1">
                            <span>Latency: {sensor.mmWaveLatencyMs}ms</span>
                            <span>Temp: {sensor.temperature || '30.2°C'}</span>
                            <span className="text-[#3E8F5D] font-medium">100% Optical-Free</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions footer */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#f1ede5]">
                    <button
                      type="button"
                      onClick={handlePingPods}
                      disabled={isPingingPods}
                      className="px-2 py-1.5 rounded-md bg-[#f1ede5] hover:bg-[#ece8e0] text-[#060810] text-[11px] font-semibold flex items-center justify-center gap-1 transition-all border border-[#e6e2da] cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-[14px] ${isPingingPods ? 'animate-spin text-[#3E8F5D]' : 'text-[#060810]'}`}>
                        {isPingingPods ? 'sync' : 'network_ping'}
                      </span>
                      <span>{isPingingPods ? 'Querying...' : 'Ping Pods'}</span>
                    </button>
                    {onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowBatteryMenu(false);
                          onNavigateTab('devices-data');
                        }}
                        className="px-2 py-1.5 rounded-md bg-[#060810] hover:bg-[#202026] text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">tune</span>
                        <span>Full Matrix</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Simulation Shortcuts Drawer Trigger */}
            <div className="relative" ref={simMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setShowSimMenu(!showSimMenu);
                  setShowBatteryMenu(false);
                }}
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowBatteryMenu(!showBatteryMenu)}
              className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-[#060810] hover:text-[#3E8F5D] transition-colors cursor-pointer bg-[#f1ede5] px-1.5 py-0.5 rounded border border-[#e6e2da]"
              title="Click to view mmWave battery details"
            >
              <span className="material-symbols-outlined text-[12px] text-[#3E8F5D]">radar</span>
              <span>mmWave: {avgBattery}% Healthy</span>
            </button>
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
      </div>
    </header>
  );
};
