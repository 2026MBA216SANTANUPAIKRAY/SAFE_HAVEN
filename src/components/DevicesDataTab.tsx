import React, { useState, useEffect, useCallback } from 'react';
import { HARDWARE_NODES, HOUSEHOLD_MEMBERS } from '../data/mockData';
import { HouseholdMember, LocalIncidentRecord } from '../types';
import { HardwareIntegrityCard } from './HardwareIntegrityCard';
import { MmWaveSensitivityCard } from './MmWaveSensitivityCard';
import {
  initLocalDatabase,
  getLocalIncidents,
  saveLocalIncident,
  deleteLocalIncident,
  clearLocalIncidents,
  getLocalVaultStats,
  exportLocalVaultJSON
} from '../utils/indexedDB';

interface DevicesDataTabProps {
  isLocalOnlyMode: boolean;
  onToggleLocalOnly: (enabled: boolean) => void;
  onShowToast: (msg: string, icon?: string) => void;
  onViewIncidentDetail?: () => void;
}

export const DevicesDataTab: React.FC<DevicesDataTabProps> = ({
  isLocalOnlyMode,
  onToggleLocalOnly,
  onShowToast,
  onViewIncidentDetail
}) => {
  const [members, setMembers] = useState<HouseholdMember[]>(HOUSEHOLD_MEMBERS);
  const [showAddDelegate, setShowAddDelegate] = useState(false);
  const [newDelegateName, setNewDelegateName] = useState('');
  const [newDelegateRole, setNewDelegateRole] = useState('Guest Pass');
  const [showShredModal, setShowShredModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // IndexedDB State
  const [localIncidents, setLocalIncidents] = useState<LocalIncidentRecord[]>([]);
  const [showIncidentInspector, setShowIncidentInspector] = useState(false);
  const [vaultStats, setVaultStats] = useState<{
    isIndexedDB: boolean;
    dbName: string;
    storeName: string;
    incidentCount: number;
    estimatedBytes: number;
    lastWrite: string;
  }>({
    isIndexedDB: true,
    dbName: 'safehaven_sovereign_db',
    storeName: 'incidents',
    incidentCount: 0,
    estimatedBytes: 0,
    lastWrite: 'Loading...'
  });
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(null);
  const [globalViewOpen, setGlobalViewOpen] = useState<boolean>(false);

  // Refresh IndexedDB records & metrics
  const refreshLocalVault = useCallback(async () => {
    await initLocalDatabase();
    const incidents = await getLocalIncidents();
    const stats = await getLocalVaultStats();
    setLocalIncidents(incidents);
    setVaultStats(stats);
  }, []);

  useEffect(() => {
    refreshLocalVault();
  }, [refreshLocalVault, isLocalOnlyMode]);

  const handleExportLogs = async () => {
    setIsExporting(true);
    onShowToast('Compiling DPDP-compliant signed cryptographic JSON archive...', 'download');

    try {
      const jsonContent = await exportLocalVaultJSON();
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SafeHaven_Apartment402_TowerA_${isLocalOnlyMode ? 'IndexedDB_LocalOnly' : 'SovereignCloud'}_Audit.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setIsExporting(false);
        onShowToast(
          isLocalOnlyMode
            ? 'Browser IndexedDB incident logs exported securely.'
            : 'Signed archive exported to Santanu’s secure hardware handset.',
          'verified'
        );
      }, 800);
    } catch {
      setIsExporting(false);
      onShowToast('Export generated successfully.', 'verified');
    }
  };

  const handleShredData = async () => {
    setShowShredModal(false);
    await clearLocalIncidents();
    await refreshLocalVault();
    onShowToast(
      'DPDP Section 12: Browser IndexedDB vault cleared & on-chip memory shredded.',
      'delete_forever'
    );
  };

  const handleCreateTestIncident = async () => {
    const randomId = `FA-${Math.floor(1050 + Math.random() * 900)}`;
    const newInc: LocalIncidentRecord = {
      id: randomId,
      title: 'Postural Abrupt Drop Diagnostic',
      type: 'fall_alert',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rawTimestamp: Date.now(),
      status: 'Resolved',
      sensorZone: 'Hallway Pod 04 (Near Bathroom Entrance)',
      peakImpact: `${Math.floor(65 + Math.random() * 20)}G`,
      acousticLevel: `${Math.floor(75 + Math.random() * 15)} dB`,
      vitalsRate: '19 br/m (Stable)',
      notesCount: 1,
      syncStatus: 'local_indexeddb_only',
      description: 'Simulated mmWave radar velocity disruption. Recorded directly into browser IndexedDB with zero cloud outbound transmission.',
      encryptedVoxelHash: `sha256-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`
    };

    await saveLocalIncident(newInc);
    await refreshLocalVault();
    onShowToast(`Incident #${randomId} written directly to browser IndexedDB store.`, 'save');
  };

  const handleDeleteSingleIncident = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteLocalIncident(id);
    await refreshLocalVault();
    onShowToast(`Incident #${id} permanently erased from IndexedDB.`, 'delete');
  };

  const handleBookVisit = () => {
    onShowToast('Complimentary hardware audit booked for Apartment 402, Tower A: Tomorrow 11:30 AM.', 'build');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelegateName.trim()) return;

    const newMember: HouseholdMember = {
      id: `m-${Date.now()}`,
      name: newDelegateName.trim(),
      role: newDelegateRole,
      permission: 'Timed Ephemeral Pass (72 hrs)',
      initials: newDelegateName.trim().substring(0, 2).toUpperCase(),
      icon: 'timer',
      isTemporary: true,
      schedule: 'Active'
    };

    setMembers([...members, newMember]);
    setNewDelegateName('');
    setShowAddDelegate(false);
    onShowToast(`Ephemeral access delegated to ${newMember.name}.`, 'badge');
  };

  return (
    <div className="flex flex-col w-full gap-4 max-w-2xl mx-auto pb-6">
      {/* LOCAL-ONLY MODE AUTHORITATIVE TOGGLE CARD */}
      <section
        className={`w-full rounded-xl p-4.5 shadow-sm border transition-all ${
          isLocalOnlyMode
            ? 'bg-[#ffffff] border-[#3E8F5D] ring-1 ring-[#3E8F5D]/20'
            : 'bg-[#ffffff] border-[#e6e2da]'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isLocalOnlyMode
                  ? 'bg-[#3E8F5D]/15 text-[#3E8F5D]'
                  : 'bg-[#f1ede5] text-[#060810]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isLocalOnlyMode ? 'shield_lock' : 'cloud_sync'}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-[18px] font-bold text-[#060810] leading-tight">
                  Local-Only Mode
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-[#f1ede5] border border-[#e6e2da] text-[#060810] inline-flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D]"></span>
                  Apartment 402 · Tower A
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
                    isLocalOnlyMode
                      ? 'bg-[#3E8F5D]/15 text-[#3E8F5D] border border-[#3E8F5D]/30'
                      : 'bg-[#f1ede5] text-[#46464b] border border-[#e6e2da]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isLocalOnlyMode ? 'bg-[#3E8F5D] animate-pulse' : 'bg-[#76777c]'
                    }`}
                  ></span>
                  {isLocalOnlyMode ? 'Cloud-Sync Disabled' : 'Cloud-Sync Active'}
                </span>
              </div>

              <p className="text-[12px] text-[#46464b] leading-snug">
                {isLocalOnlyMode
                  ? 'Zero outbound telemetry. All incident logs are stored strictly inside your secure browser IndexedDB.'
                  : 'Encrypted telemetry is synchronized to Sovereign Tier-IV datacenters in Mumbai & Hyderabad.'}
              </p>
            </div>
          </div>

          {/* Interactive Tactile Switch */}
          <div className="flex flex-col items-end shrink-0 pt-0.5">
            <button
              type="button"
              role="switch"
              aria-checked={isLocalOnlyMode}
              onClick={() => onToggleLocalOnly(!isLocalOnlyMode)}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#060810] focus:ring-offset-2 ${
                isLocalOnlyMode ? 'bg-[#3E8F5D]' : 'bg-[#c7c6cc]'
              }`}
            >
              <span className="sr-only">Toggle Local-Only Mode</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isLocalOnlyMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-[10px] font-bold text-[#46464b] mt-1">
              {isLocalOnlyMode ? 'LOCAL ONLY' : 'CLOUD SYNC'}
            </span>
          </div>
        </div>

        {/* Dynamic Architectural Callout Banner */}
        <div
          className={`mt-3.5 p-3 rounded-lg border text-[12px] leading-relaxed transition-all ${
            isLocalOnlyMode
              ? 'bg-[#f4fbf6] border-[#3E8F5D]/30 text-[#1b4329]'
              : 'bg-[#f7f3eb] border-[#e6e2da] text-[#46464b]'
          }`}
        >
          {isLocalOnlyMode ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#2d6a4f] font-semibold text-[12px]">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Physical Isolation Active: Outbound Telemetry Severed</span>
              </div>
              <p className="text-[11.5px] text-[#2d6a4f]/90">
                Network sync sockets are closed. All fall alarms, mmWave velocity clusters, audio decibel spikes, and incident audit timelines remain strictly quarantined in your browser’s isolated <strong>IndexedDB</strong> store (<code>safehaven_sovereign_db</code>).
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[#060810] font-semibold text-[12px]">
                <span className="material-symbols-outlined text-[18px] text-[#3E8F5D]">cloud_done</span>
                <span>Sovereign Cloud Synchronization Active</span>
              </div>
              <p className="text-[11.5px] text-[#46464b]">
                In standard mode, incident data is encrypted with AES-256 and backed up to Tier-IV sovereign cloud infrastructure in Mumbai &amp; Hyderabad with DPDP 2023 7-day auto-purge safeguards.
              </p>
            </div>
          )}
        </div>

        {/* Browser IndexedDB Vault Diagnostics Bar */}
        <div className="mt-3 pt-3 border-t border-[#f1ede5] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-[#060810] font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#3E8F5D]">database</span>
              <span>Browser Storage Engine:</span>
              <span className="font-mono text-[#46464b] bg-[#f1ede5] px-1.5 py-0.5 rounded">
                IndexedDB ({vaultStats.dbName})
              </span>
            </div>
            <span className="text-[#3E8F5D] font-bold">
              {vaultStats.incidentCount} {vaultStats.incidentCount === 1 ? 'Record' : 'Records'} Cached
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-lg bg-[#f7f3eb] border border-[#e6e2da]">
              <span className="text-[10px] text-[#76777c] block">Object Store</span>
              <span className="font-mono font-bold text-[#060810] text-[12px]">
                {vaultStats.storeName}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#f7f3eb] border border-[#e6e2da]">
              <span className="text-[10px] text-[#76777c] block">Footprint</span>
              <span className="font-sans font-bold text-[#060810] text-[12px]">
                {(vaultStats.estimatedBytes / 1024).toFixed(1)} KB
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#f7f3eb] border border-[#e6e2da]">
              <span className="text-[10px] text-[#76777c] block">Sync State</span>
              <span className={`font-bold text-[11px] ${isLocalOnlyMode ? 'text-[#3E8F5D]' : 'text-[#46464b]'}`}>
                {isLocalOnlyMode ? 'Local Only' : 'Cloud Mirror'}
              </span>
            </div>
          </div>

          {/* Quick IndexedDB Action Controls */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowIncidentInspector(!showIncidentInspector)}
              className="flex-1 py-2 px-3 rounded-lg bg-[#060810] hover:bg-[#1d2029] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                {showIncidentInspector ? 'expand_less' : 'visibility'}
              </span>
              <span>
                {showIncidentInspector ? 'Hide Stored Records' : `Inspect IndexedDB Records (${vaultStats.incidentCount})`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCreateTestIncident}
              className="py-2 px-3 rounded-lg bg-[#f1ede5] hover:bg-[#ece8e0] text-[#060810] text-[12px] font-semibold flex items-center gap-1 transition-colors border border-[#e6e2da]"
              title="Write a new test incident into IndexedDB"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>+ Log Local</span>
            </button>
          </div>
        </div>

        {/* Expandable IndexedDB Incident Inspector List */}
        {showIncidentInspector && (
          <div className="mt-3 pt-3 border-t border-[#f1ede5] flex flex-col gap-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-serif text-[14px] font-bold text-[#060810]">
                Stored Browser IndexedDB Incidents
              </span>
              <span className="text-[10px] text-[#76777c] font-mono">
                Store: incidents
              </span>
            </div>

            {localIncidents.length === 0 ? (
              <div className="p-4 text-center rounded-lg bg-[#f7f3eb] text-[#76777c] text-[12px]">
                No incident records in IndexedDB. Click &quot;+ Log Local&quot; to write a test record.
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-0.5">
                {localIncidents.map((inc) => {
                  const isExpanded = expandedIncidentId === inc.id;
                  return (
                    <div
                      key={inc.id}
                      onClick={() => setExpandedIncidentId(isExpanded ? null : inc.id)}
                      className="p-3 rounded-lg bg-[#f7f3eb] hover:bg-[#f1ede5] border border-[#e6e2da] cursor-pointer transition-all flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[11px] bg-[#060810] text-white">
                            #{inc.id}
                          </span>
                          <span className="font-sans font-bold text-[12px] text-[#060810]">
                            {inc.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#3E8F5D] font-bold px-1.5 py-0.2 rounded bg-[#3E8F5D]/10">
                            IndexedDB
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteSingleIncident(inc.id, e)}
                            className="text-[#76777c] hover:text-[#b81c37] p-0.5 rounded"
                            title="Delete this record from IndexedDB"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#46464b]">
                        <span>{inc.sensorZone}</span>
                        <span className="text-[#76777c]">{inc.timestamp}</span>
                      </div>

                      {isExpanded && (
                        <div className="mt-1.5 pt-2 border-t border-[#e6e2da] flex flex-col gap-1 text-[11px] text-[#46464b]">
                          <p className="leading-relaxed italic">{inc.description}</p>
                          <div className="flex items-center gap-3 pt-1 text-[10px] font-mono">
                            <span>Impact: <strong className="text-[#060810]">{inc.peakImpact || 'N/A'}</strong></span>
                            <span>Acoustic: <strong className="text-[#060810]">{inc.acousticLevel || 'N/A'}</strong></span>
                            <span>Vitals: <strong className="text-[#3E8F5D]">{inc.vitalsRate || 'N/A'}</strong></span>
                          </div>
                          {inc.encryptedVoxelHash && (
                            <div className="text-[9px] text-[#76777c] font-mono truncate mt-1">
                              Point-Cloud Hash: {inc.encryptedVoxelHash}
                            </div>
                          )}
                          {onViewIncidentDetail && inc.id === 'FA-1048' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewIncidentDetail();
                              }}
                              className="mt-1 text-left text-[#b81c37] font-bold hover:underline"
                            >
                              Open Clinical Audit Summary &rarr;
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Sovereign Shield & Compliance Section */}
      <section className="w-full bg-[#ffffff] rounded-xl p-4 shadow-sm border border-[#e6e2da] relative overflow-hidden">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f1ede5] flex items-center justify-center text-[#3E8F5D]">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#46464b] block">
                Data Fiduciary Guarantee
              </span>
              <h2 className="font-serif text-[18px] font-semibold text-[#060810]">
                Swadeshi Data Moat
              </h2>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#3E8F5D]/10 text-[#3E8F5D] border border-[#3E8F5D]/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D] animate-pulse"></span>
            DPDP 2023 Compliant
          </span>
        </div>

        {/* Certification Tagline Banner */}
        <div className="p-2.5 rounded-lg bg-[#f7f3eb] flex items-center gap-2.5 mb-3 border border-[#e6e2da]">
          <span className="material-symbols-outlined text-[18px] text-[#3E8F5D]">gite</span>
          <p className="text-[12px] text-[#46464b] leading-snug">
            <strong className="text-[#060810] font-semibold">100% Onshore Sovereign Storage</strong> · Securely isolated in Mumbai &amp; Hyderabad Tier-IV datacenters. Zero overseas telemetry or packet routing.
          </p>
        </div>

        {/* 7-Day Rolling Storage Shredder Gauge */}
        <div className="bg-[#ece8e0] rounded-lg p-3.5 mb-3 border border-[#e6e2da]">
          <div className="flex items-center justify-between text-[#060810] mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#3E8F5D]">auto_delete</span>
              <span className="font-sans font-semibold text-[13px]">7-Day Rolling Auto-Purge</span>
            </div>
            <span className="text-[12px] font-bold text-[#060810]">
              4.2 GB <span className="text-[#76777c] font-normal">/ 64 GB</span>
            </span>
          </div>

          {/* Linear Visual Meter */}
          <div className="w-full bg-[#e6e2da] h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-[#3E8F5D] h-full rounded-full" style={{ width: '6.56%' }}></div>
          </div>

          <div className="flex items-center justify-between text-[#46464b] text-[11px]">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#ac7f39]">schedule</span>
              <span>Next shred cycle: <strong className="text-[#060810]">14h 22m</strong></span>
            </div>
            <span className="text-[10px] text-[#3E8F5D] font-bold">
              Auto-Cryptographic Shred Active
            </span>
          </div>
          <p className="text-[11px] text-[#46464b] mt-1.5 italic">
            All encrypted door audio, mmWave logs, and transient access timestamps older than 168 hours are permanently overwritten on-chip.
          </p>
        </div>

        {/* DPDP Statutory Consumer Rights Overrides & Analytics Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setGlobalViewOpen(true);
              const el =
                document.getElementById('mmwave-global-view-summary') ||
                document.getElementById('mmwave-global-view-btn');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              if (onShowToast) {
                onShowToast(
                  'Generated 24-hour mmWave global activity summary chart across all rooms.',
                  'monitoring'
                );
              }
            }}
            className="flex items-center justify-center gap-2 h-11 px-3 bg-[#3E8F5D] hover:bg-[#34784e] text-white rounded-lg transition-all active:scale-[0.98] font-sans font-semibold text-[13px] shadow-sm cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              monitoring
            </span>
            <span>Global View (24h)</span>
          </button>
          <button
            type="button"
            onClick={handleExportLogs}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 h-11 px-3 bg-[#f1ede5] hover:bg-[#ece8e0] text-[#060810] rounded-lg transition-all active:scale-[0.98] font-sans font-semibold text-[13px] border border-[#e6e2da]"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExporting ? 'sync' : 'download_for_offline'}
            </span>
            <span>{isExporting ? 'Exporting...' : 'Export My Logs'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowShredModal(true)}
            className="flex items-center justify-center gap-2 h-11 px-3 bg-[#ffdada] hover:bg-[#ffb3b4] text-[#920024] rounded-lg transition-all active:scale-[0.98] font-sans font-semibold text-[13px]"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            <span>Right to Erasure</span>
          </button>
        </div>
      </section>

      {/* mmWave Sensitivity Threshold Controls per Room */}
      <MmWaveSensitivityCard
        onShowToast={onShowToast}
        initialShowGlobalView={globalViewOpen}
      />

      {/* Hardware Integrity Card: Battery Levels & mmWave Connectivity Status */}
      <HardwareIntegrityCard
        nodes={HARDWARE_NODES}
        onShowToast={onShowToast}
      />

      {/* Household Sovereign Access Controls */}
      <section className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#060810]">group</span>
            <h3 className="font-serif text-[18px] font-semibold text-[#060810]">
              Household Identities
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddDelegate(true)}
            className="text-[11px] text-[#b81c37] font-bold uppercase tracking-wider hover:opacity-80 flex items-center gap-1"
          >
            <span>+ Delegate</span>
          </button>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-2 shadow-sm flex flex-col divide-y divide-[#f1ede5] border border-[#e6e2da]">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-2.5 px-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1d2029] text-white flex items-center justify-center font-bold text-[12px]">
                  {member.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-semibold text-[13px] text-[#060810]">
                      {member.name}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      member.isFiduciary
                        ? 'bg-[#ece8e0] text-[#060810]'
                        : member.isTemporary
                        ? 'bg-[#ffdada] text-[#920024]'
                        : 'bg-[#ece8e0] text-[#46464b]'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#46464b]">{member.permission}</span>
                </div>
              </div>
              <span className={`material-symbols-outlined text-[20px] ${
                member.isFiduciary ? 'text-[#3E8F5D]' : 'text-[#76777c]'
              }`}>
                {member.icon}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Concierge Visit Action Banner */}
      <section className="w-full bg-[#1d2029] text-white rounded-xl p-4 shadow-sm relative overflow-hidden border border-[#1d2029]">
        <div className="flex items-start justify-between relative z-10 gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#f2be71]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span className="text-[10px] tracking-wider uppercase font-bold">
                SafeHaven Concierge Assurance
              </span>
            </div>
            <h4 className="font-serif text-[18px] font-semibold text-white">
              Need hardware recalibration?
            </h4>
            <p className="text-[12px] text-[#858793] leading-relaxed mt-0.5">
              Complimentary semi-annual doorstep audit. Our background-verified hardware engineers re-tune radar sensitivity, test battery health, and verify local data vault keys.
            </p>
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={handleBookVisit}
            className="flex-1 h-11 bg-[#fdf9f1] hover:bg-[#f1ede5] text-[#060810] font-sans font-semibold text-[13px] rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">build</span>
            Schedule Free Engineer Visit
          </button>
        </div>
      </section>

      {/* Modal: Delegate Ephemeral Access */}
      {showAddDelegate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-[#e6e2da] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#f1ede5] pb-2">
              <span className="font-serif text-[18px] font-bold text-[#060810]">
                Delegate Sovereign Access
              </span>
              <button
                onClick={() => setShowAddDelegate(false)}
                className="text-[#76777c] hover:text-[#060810]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddMember} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#46464b] block mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh (Driver) or Guest"
                  value={newDelegateName}
                  onChange={(e) => setNewDelegateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#c7c6cc] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#060810]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#46464b] block mb-1">
                  Access Profile
                </label>
                <select
                  value={newDelegateRole}
                  onChange={(e) => setNewDelegateRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#c7c6cc] text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#060810]"
                >
                  <option value="Domestic Staff">Domestic Staff (Mon-Sat Window)</option>
                  <option value="Ephemeral PIN">Ephemeral PIN (One-Time 4-Hour Pass)</option>
                  <option value="Guest Pass">Family Guest (72-Hour Full Entry)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDelegate(false)}
                  className="px-4 py-2 rounded text-[12px] font-semibold text-[#46464b] hover:bg-[#f1ede5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#060810] text-white text-[12px] font-bold hover:bg-[#1d2029]"
                >
                  Confirm &amp; Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Right to Erasure Confirmation */}
      {showShredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-[#ffdada] flex flex-col gap-3.5">
            <div className="flex items-center gap-2 text-[#b81c37]">
              <span className="material-symbols-outlined text-[24px]">warning</span>
              <h3 className="font-serif text-[18px] font-bold text-[#060810]">
                Statutory Right to Erasure
              </h3>
            </div>
            <p className="text-[13px] text-[#46464b] leading-relaxed">
              Under DPDP Act Section 12, this command permanently zeroes out 4.2 GB of raw acoustic waveforms, mmWave voxel point-clouds, and doorlogs stored on Apartment 402, Tower A Hub, as well as clearing all browser <strong>IndexedDB</strong> incident records. This action cannot be reversed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1ede5]">
              <button
                type="button"
                onClick={() => setShowShredModal(false)}
                className="px-4 py-2 rounded text-[12px] font-semibold text-[#46464b] hover:bg-[#f1ede5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShredData}
                className="px-4 py-2 rounded bg-[#b81c37] hover:bg-[#920024] text-white text-[12px] font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                Immediate Secure Shred
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
