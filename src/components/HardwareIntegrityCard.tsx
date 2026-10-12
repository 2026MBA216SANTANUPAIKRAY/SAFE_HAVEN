import React, { useState } from 'react';
import { HardwareNode } from '../types';

interface HardwareIntegrityCardProps {
  nodes: HardwareNode[];
  onShowToast?: (msg: string, icon?: string) => void;
}

export const HardwareIntegrityCard: React.FC<HardwareIntegrityCardProps> = ({
  nodes,
  onShowToast
}) => {
  const [filter, setFilter] = useState<'all' | 'mmwave' | 'infrastructure'>('all');
  const [isPinging, setIsPinging] = useState(false);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [lastPingTime, setLastPingTime] = useState('Just now');

  const filteredNodes = nodes.filter((node) => {
    if (filter === 'mmwave') {
      return node.badgeType === 'non-optical' || node.name.toLowerCase().includes('radar');
    }
    if (filter === 'infrastructure') {
      return (
        node.badgeType === 'gateway' ||
        node.badgeType === 'failsafe' ||
        node.badgeType === 'secured'
      );
    }
    return true;
  });

  // Calculate summary metrics
  const avgBattery = Math.round(
    nodes.reduce((acc, curr) => acc + curr.batteryLevel, 0) / nodes.length
  );
  const totalMmWaveActive = nodes.filter(
    (n) => n.mmWaveStatus === 'connected' || n.mmWaveStatus === 'synchronized' || n.mmWaveStatus === 'coordinator'
  ).length;

  const handlePingMesh = () => {
    setIsPinging(true);
    if (onShowToast) {
      onShowToast('Broadcasting 60GHz RF ping to all 6 registered hardware nodes...', 'radar');
    }

    setTimeout(() => {
      setIsPinging(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastPingTime(timeStr);
      if (onShowToast) {
        onShowToast('Mesh Heartbeat Verified: All 6 nodes responding with 0.4ms avg latency.', 'verified');
      }
    }, 1200);
  };

  const getBatteryColor = (level: number) => {
    if (level >= 80) return 'text-[#3E8F5D] bg-[#3E8F5D]';
    if (level >= 40) return 'text-[#ac7f39] bg-[#ac7f39]';
    return 'text-[#b81c37] bg-[#b81c37]';
  };

  const getBatteryIcon = (level: number, status: string) => {
    if (status === 'full' || status === 'solar_float') return 'battery_charging_full';
    if (level >= 90) return 'battery_full';
    if (level >= 60) return 'battery_5_bar';
    if (level >= 30) return 'battery_3_bar';
    return 'battery_alert';
  };

  return (
    <section className="w-full bg-[#ffffff] rounded-xl p-4.5 shadow-sm border border-[#e6e2da] relative overflow-hidden flex flex-col gap-4">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#f1ede5]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f7f3eb] text-[#060810] flex items-center justify-center shrink-0 border border-[#e6e2da]">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              vital_signs
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-[18px] font-bold text-[#060810] leading-tight">
                Hardware Integrity
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-[#f1ede5] border border-[#e6e2da] text-[#060810] inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D]"></span>
                Apartment 402 · Tower A
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#3E8F5D]/10 text-[#3E8F5D] border border-[#3E8F5D]/25 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D] animate-pulse"></span>
                6/6 Nodes Operational
              </span>
            </div>
            <p className="text-[12px] text-[#46464b] mt-0.5 leading-relaxed">
              Battery reserves &amp; 60 GHz sub-millimeter wave telemetry across all Apartment 402, Tower A nodes.
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handlePingMesh}
          disabled={isPinging}
          className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-[#f1ede5] hover:bg-[#ece8e0] active:scale-[0.98] text-[#060810] text-[12px] font-semibold flex items-center gap-1.5 transition-all border border-[#e6e2da] shrink-0"
        >
          <span className={`material-symbols-outlined text-[16px] ${isPinging ? 'animate-spin text-[#3E8F5D]' : 'text-[#060810]'}`}>
            {isPinging ? 'sync' : 'network_ping'}
          </span>
          <span>{isPinging ? 'Querying Mesh...' : 'Ping All Nodes'}</span>
        </button>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#76777c]">
            <span>Average Battery</span>
            <span className="material-symbols-outlined text-[16px] text-[#3E8F5D]">battery_full</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif text-[18px] font-bold text-[#060810]">{avgBattery}%</span>
            <span className="text-[10px] text-[#3E8F5D] font-semibold">Healthy</span>
          </div>
          <span className="text-[10px] text-[#76777c] truncate mt-0.5">Dual UPS + Solar Armed</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#76777c]">
            <span>mmWave Status</span>
            <span className="material-symbols-outlined text-[16px] text-[#3E8F5D]">radar</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif text-[18px] font-bold text-[#060810]">{totalMmWaveActive}/{nodes.length}</span>
            <span className="text-[10px] text-[#3E8F5D] font-semibold">Synced</span>
          </div>
          <span className="text-[10px] text-[#76777c] truncate mt-0.5">60 GHz FMCW Sub-mm</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#76777c]">
            <span>Avg RF Latency</span>
            <span className="material-symbols-outlined text-[16px] text-[#060810]">speed</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-serif text-[18px] font-bold text-[#060810]">0.4 ms</span>
            <span className="text-[10px] text-[#3E8F5D] font-semibold">&lt; 1ms Target</span>
          </div>
          <span className="text-[10px] text-[#76777c] truncate mt-0.5">Local Edge Bus</span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-[#76777c]">
            <span>Last Heartbeat</span>
            <span className="material-symbols-outlined text-[16px] text-[#3E8F5D]">check_circle</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-sans text-[13px] font-bold text-[#060810]">{lastPingTime}</span>
          </div>
          <span className="text-[10px] text-[#3E8F5D] font-semibold truncate mt-0.5">Zero Packet Loss</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-colors ${
              filter === 'all'
                ? 'bg-[#060810] text-white shadow-xs'
                : 'bg-[#f1ede5] text-[#46464b] hover:bg-[#ece8e0]'
            }`}
          >
            All Registered Nodes ({nodes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('mmwave')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1 ${
              filter === 'mmwave'
                ? 'bg-[#060810] text-white shadow-xs'
                : 'bg-[#f1ede5] text-[#46464b] hover:bg-[#ece8e0]'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">radar</span>
            mmWave Pods (3)
          </button>
          <button
            type="button"
            onClick={() => setFilter('infrastructure')}
            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1 ${
              filter === 'infrastructure'
                ? 'bg-[#060810] text-white shadow-xs'
                : 'bg-[#f1ede5] text-[#46464b] hover:bg-[#ece8e0]'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">router</span>
            Hub &amp; Relay (3)
          </button>
        </div>

        <span className="text-[11px] text-[#76777c] hidden sm:inline">
          Tap node to view RF diagnostics
        </span>
      </div>

      {/* Registered Nodes Integrity Matrix */}
      <div className="flex flex-col gap-2.5">
        {filteredNodes.map((node) => {
          const isExpanded = expandedNodeId === node.id;
          const batteryColorClass = getBatteryColor(node.batteryLevel);
          const batteryIconName = getBatteryIcon(node.batteryLevel, node.batteryStatus);

          return (
            <div
              key={node.id}
              onClick={() => setExpandedNodeId(isExpanded ? null : node.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isExpanded
                  ? 'bg-[#fdf9f1] border-[#060810] shadow-sm'
                  : 'bg-[#ffffff] hover:bg-[#fbf8f2] border-[#e6e2da]'
              }`}
            >
              {/* Primary Node Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Node Identity */}
                <div className="flex items-start gap-3 min-w-[200px]">
                  <div className="w-9 h-9 rounded-lg bg-[#f1ede5] text-[#060810] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">{node.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-bold text-[13px] text-[#060810]">
                        {node.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          node.badgeType === 'gateway'
                            ? 'bg-[#3E8F5D]/15 text-[#3E8F5D]'
                            : node.badgeType === 'failsafe'
                            ? 'bg-[#ffdada] text-[#b81c37]'
                            : node.badgeType === 'non-optical'
                            ? 'bg-[#ece8e0] text-[#060810]'
                            : 'bg-[#f1ede5] text-[#46464b]'
                        }`}
                      >
                        {node.badge}
                      </span>
                    </div>
                    <span className="text-[11.5px] text-[#46464b] block">{node.location}</span>
                  </div>
                </div>

                {/* Battery Level Metric Block */}
                <div className="flex items-center gap-3 bg-[#f7f3eb] px-3 py-1.5 rounded-lg border border-[#e6e2da]/70 min-w-[175px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        node.batteryLevel >= 80 ? 'text-[#3E8F5D]' : 'text-[#ac7f39]'
                      }`}
                    >
                      {batteryIconName}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-sans font-bold text-[13px] text-[#060810]">
                          {node.batteryLevel}%
                        </span>
                        <span className="text-[10px] text-[#76777c]">
                          {node.batteryStatus === 'full'
                            ? 'AC Float'
                            : node.batteryStatus === 'solar_float'
                            ? 'Solar Float'
                            : node.batteryStatus === 'mains_backup'
                            ? 'UPS Armed'
                            : 'Batt'}
                        </span>
                      </div>
                      {/* Visual Micro Battery Meter */}
                      <div className="w-16 bg-[#e6e2da] h-1.5 rounded-full overflow-hidden mt-0.5">
                        <div
                          className={`h-full rounded-full ${
                            node.batteryLevel >= 80
                              ? 'bg-[#3E8F5D]'
                              : node.batteryLevel >= 40
                              ? 'bg-[#ac7f39]'
                              : 'bg-[#b81c37]'
                          }`}
                          style={{ width: `${node.batteryLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#76777c] border-l border-[#e6e2da] pl-2 leading-tight hidden xs:block">
                    <span className="block font-medium text-[#46464b]">{node.batteryHealth}</span>
                  </div>
                </div>

                {/* mmWave Sensor Connectivity Status Block */}
                <div className="flex items-center gap-3 justify-between md:justify-end min-w-[210px]">
                  <div className="flex flex-col items-start md:items-end">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#3E8F5D] animate-pulse"></span>
                      <span className="font-sans font-semibold text-[12px] text-[#060810]">
                        {node.mmWaveStatus === 'coordinator'
                          ? 'Coordinator Link'
                          : node.mmWaveStatus === 'connected'
                          ? '60GHz Connected'
                          : node.mmWaveStatus === 'synchronized'
                          ? 'Synchronized'
                          : node.mmWaveStatus === 'standby'
                          ? 'Radar Standby'
                          : 'Mesh Active'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#76777c]">
                      <span className="font-mono">{node.mmWaveBand}</span>
                      <span>·</span>
                      <span className="text-[#3E8F5D] font-bold">{node.mmWaveLatencyMs}ms</span>
                    </div>
                  </div>

                  {/* Signal meter icon indicator */}
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#f7f3eb] border border-[#e6e2da]/70 text-[11px] font-mono font-semibold text-[#060810]">
                    <span className="material-symbols-outlined text-[15px] text-[#3E8F5D]">
                      signal_cellular_alt
                    </span>
                    <span>{node.mmWaveSignalDbm} dBm</span>
                  </div>

                  {/* Expand chevron */}
                  <span className="material-symbols-outlined text-[18px] text-[#76777c] hidden md:inline">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>

              {/* Expandable RF Diagnostics Panel */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#e6e2da] flex flex-col gap-2 text-[11.5px] animate-in fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 rounded bg-white border border-[#e6e2da]">
                      <span className="text-[10px] text-[#76777c] block uppercase tracking-wider font-semibold">
                        Power Details
                      </span>
                      <span className="font-sans font-semibold text-[#060810] text-[11px] block mt-0.5">
                        {node.powerSource}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-white border border-[#e6e2da]">
                      <span className="text-[10px] text-[#76777c] block uppercase tracking-wider font-semibold">
                        Voxel Stream
                      </span>
                      <span className="font-mono font-semibold text-[#060810] text-[11px] block mt-0.5">
                        {node.mmWaveVoxelRate}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-white border border-[#e6e2da]">
                      <span className="text-[10px] text-[#76777c] block uppercase tracking-wider font-semibold">
                        Operating Temp
                      </span>
                      <span className="font-mono font-semibold text-[#3E8F5D] text-[11px] block mt-0.5">
                        {node.temperature || '30.4°C'} · Nominal
                      </span>
                    </div>

                    <div className="p-2 rounded bg-white border border-[#e6e2da]">
                      <span className="text-[10px] text-[#76777c] block uppercase tracking-wider font-semibold">
                        Node MAC ID
                      </span>
                      <span className="font-mono font-semibold text-[#060810] text-[11px] block mt-0.5">
                        {node.macAddress || 'SH:402:NOD:XX'}
                      </span>
                    </div>
                  </div>

                  {node.extraInfo && (
                    <div className="p-2 rounded bg-[#f7f3eb] flex items-center gap-2 text-[#46464b] border border-[#e6e2da]">
                      <span className="material-symbols-outlined text-[16px] text-[#3E8F5D]">
                        verified_user
                      </span>
                      <span className="text-[11px] leading-snug">{node.extraInfo}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Privacy Architecture Footnote */}
      <div className="p-2.5 rounded-lg bg-[#f7f3eb] flex items-center justify-between text-[11px] text-[#46464b] border border-[#e6e2da]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#3E8F5D]">shield</span>
          <span>
            <strong>Hardware Verification:</strong> mmWave FMCW radar utilizes 60 GHz sub-millimeter photons. Lenses, sensors, and optical cameras are physically absent from all private quarters.
          </span>
        </div>
      </div>
    </section>
  );
};
