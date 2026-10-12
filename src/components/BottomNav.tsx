import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange?: (tab: TabType) => void;
  onChangeTab?: (tab: TabType) => void;
  hasActiveAlert?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onChangeTab,
  hasActiveAlert
}) => {
  const handleSelect = (tab: TabType) => {
    if (onChangeTab) onChangeTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'doorstep', label: 'Gate & Intercom', icon: 'doorbell' },
    { id: 'cctv', label: 'In-Home CCTV', icon: 'videocam' },
    { id: 'family-care', label: 'Family Care', icon: 'elderly' },
    { id: 'sos-hub', label: 'SOS Hub', icon: 'fmd_bad' },
    { id: 'devices-data', label: 'Devices & Data', icon: 'verified_user' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-40 pb-safe bg-[#fdf9f1]/94 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)] border-t border-[#e6e2da]/60">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2.5 transition-colors relative ${
                isActive ? 'text-[#b81c37]' : 'text-[#46464b] hover:text-[#1c1c17]'
              }`}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
                {item.id === 'sos-hub' && hasActiveAlert && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#b81c37] animate-ping"></span>
                )}
              </div>
              <span
                className={`text-[11px] font-bold tracking-tight mt-0.5 whitespace-nowrap ${
                  isActive ? 'font-bold text-[#b81c37]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
