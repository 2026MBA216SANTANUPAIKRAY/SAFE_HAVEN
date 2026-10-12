import React, { useState } from 'react';
import { INCIDENT_STEPS, POST_FALL_TASKS } from '../data/mockData';
import { IncidentAuditStep, PostFallChecklistItem } from '../types';
import { saveLocalIncident, getLocalIncidents } from '../utils/indexedDB';

interface IncidentDetailModalProps {
  isLocalOnlyMode?: boolean;
  onClose: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  isLocalOnlyMode = false,
  onClose,
  onShowToast
}) => {
  const [checklist, setChecklist] = useState<PostFallChecklistItem[]>(POST_FALL_TASKS);
  const [notes, setNotes] = useState([
    {
      id: 'n1',
      author: 'Ramesh (Guard Desk, Gate 1)',
      time: '8:45 PM',
      text: 'Reached Apartment 402, Tower A within 2 mins of intercom push. Mrs. Sen was resting on the floor with rug support. She was alert, speaking clearly, and helped into the armchair.'
    },
    {
      id: 'n2',
      author: 'Dr. V. Sharma (Consulting Geriatrician)',
      time: '8:52 PM',
      text: 'Tele-consulted with Santanu. Advised icing hip contusion, checking pupils, and monitoring night vitals via mmWave node. Clinic visit scheduled for 11:30 AM.'
    }
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev: PostFallChecklistItem[]) =>
      prev.map((item: PostFallChecklistItem) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newEntry = {
      id: `n-${Date.now()}`,
      author: 'Santanu Sen (Primary Caregiver)',
      time: 'Just now',
      text: newNoteText.trim()
    };
    const updatedNotes = [...notes, newEntry];
    setNotes(updatedNotes);
    setNewNoteText('');

    if (isLocalOnlyMode) {
      // Synchronize note count into IndexedDB
      const records = await getLocalIncidents();
      const existing = records.find((r) => r.id === 'FA-1048');
      if (existing) {
        existing.notesCount = updatedNotes.length;
        await saveLocalIncident(existing);
      }
      onShowToast('Clinical observation stored strictly into browser IndexedDB vault.', 'database');
    } else {
      onShowToast('Clinical observation appended to sovereign audit log.', 'note_add');
    }
  };

  const handleExportPdf = () => {
    setIsExporting(true);
    onShowToast('Compiling DPDP-verified clinical case record PDF...', 'picture_as_pdf');
    setTimeout(() => {
      setIsExporting(false);
      onShowToast('Report #FA-1048_Clinical_Summary.pdf downloaded.', 'download_done');
    }, 1500);
  };

  const completedCount = checklist.filter((i: PostFallChecklistItem) => i.done).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#060810]/80 backdrop-blur-md flex flex-col pt-safe pb-safe p-4 animate-in fade-in">
      <div className="max-w-2xl w-full mx-auto bg-[#ffffff] rounded-2xl shadow-2xl overflow-hidden flex flex-col gap-4 p-5 my-auto border border-[#e6e2da]">
        {/* Incident Resolved Banner */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f1ede5]">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#3E8F5D] text-[26px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#3E8F5D] block">
                  Incident Resolved · All Clear
                </span>
                {isLocalOnlyMode && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#3E8F5D]/15 text-[#3E8F5D] border border-[#3E8F5D]/30">
                    Local IndexedDB Vault
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-[20px] font-bold text-[#060810]">
                  Fall Alert #FA-1048: Hallway Pod 04
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-[#f1ede5] border border-[#e6e2da] text-[#060810] inline-flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D]"></span>
                  Apartment 402 · Tower A
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1ede5] hover:bg-[#ece8e0] text-[#060810] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Executive Summary */}
        <div className="p-3 rounded-xl bg-[#f7f3eb] border border-[#e6e2da] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-sans font-bold text-[13px] text-[#060810]">
              Patient Stable &amp; Assisted
            </span>
            <span className="text-[11px] font-semibold text-[#3E8F5D]">
              Resolved in 4m 12s
            </span>
          </div>
          <p className="text-[12px] text-[#46464b] leading-relaxed">
            Rapid postural drop detected in Hallway zone at 8:43 PM. Multi-channel audio bridge established; physical assistance provided by Society Guard Ramesh; tele-consulted with Dr. Sharma. Paramedics stood down.
          </p>
        </div>

        {/* DPDP Sovereign Point-Cloud Guarantee */}
        <div className="p-2.5 rounded-lg bg-[#ece8e0] flex items-center gap-2 text-[#060810] text-[11px] border border-[#e6e2da]">
          <span className="material-symbols-outlined text-[18px] text-[#b81c37]">shield</span>
          <span>
            <strong>Zero Optical Storage:</strong> Only 60GHz mmWave radar velocity, point-cloud vectors, and acoustic decibel logs were generated. {isLocalOnlyMode ? 'Stored strictly in local browser IndexedDB with cloud-sync disabled.' : 'No camera images exist.'}
          </span>
        </div>

        {/* Biometric & Impact Diagnostics Bento */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-[#f7f3eb] flex flex-col gap-1 border border-[#e6e2da] text-center">
            <span className="material-symbols-outlined text-[#b81c37] text-[20px] mx-auto">
              speed
            </span>
            <span className="text-[10px] text-[#46464b] font-medium">Peak Impact</span>
            <span className="font-sans font-bold text-[16px] text-[#060810]">74G</span>
            <span className="text-[10px] text-[#b81c37] font-semibold">Moderate Force</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f7f3eb] flex flex-col gap-1 border border-[#e6e2da] text-center">
            <span className="material-symbols-outlined text-[#ac7f39] text-[20px] mx-auto">
              volume_up
            </span>
            <span className="text-[10px] text-[#46464b] font-medium">Acoustic Peak</span>
            <span className="font-sans font-bold text-[16px] text-[#060810]">82 dB</span>
            <span className="text-[10px] text-[#46464b] font-semibold">Thud Clustered</span>
          </div>

          <div className="p-3 rounded-xl bg-[#f7f3eb] flex flex-col gap-1 border border-[#e6e2da] text-center">
            <span className="material-symbols-outlined text-[#3E8F5D] text-[20px] mx-auto">
              vital_signs
            </span>
            <span className="text-[10px] text-[#46464b] font-medium">Post-Drop Vitals</span>
            <span className="font-sans font-bold text-[16px] text-[#060810]">18 br/m</span>
            <span className="text-[10px] text-[#3E8F5D] font-bold">Stable Rhythm</span>
          </div>
        </div>

        {/* Sub-mm Chest Respiration Waveform */}
        <div className="p-3 rounded-xl bg-[#1d2029] text-white flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-[#f2be71] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D]"></span>
              Continuous Radar Respiration Rhythm
            </span>
            <span className="text-[#858793]">60s Window</span>
          </div>
          {/* Waveform SVG */}
          <svg className="w-full h-12 text-[#fe5364]" viewBox="0 0 300 48" fill="none">
            <path
              d="M0 24 Q 25 10, 50 24 T 100 24 T 150 24 T 200 24 T 250 24 T 300 24"
              stroke="#ffdada"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M120 24 L 130 6 L 140 42 L 150 16 L 160 28 L 170 24"
              stroke="#fe5364"
              strokeWidth="2.5"
              fill="none"
            />
          </svg>
        </div>

        {/* Incident Audit Timeline */}
        <div className="flex flex-col gap-2">
          <span className="font-serif text-[16px] font-bold text-[#060810]">
            Incident Audit Timeline
          </span>
          <div className="flex flex-col gap-2 pl-2 border-l-2 border-[#e6e2da]">
            {INCIDENT_STEPS.map((item: IncidentAuditStep, idx: number) => (
              <div key={item.id || idx} className="relative pl-3 flex flex-col gap-0.5">
                <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#060810] border-2 border-white"></span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#b81c37] font-mono">{item.time}</span>
                  <span className="font-sans font-semibold text-[12px] text-[#060810]">{item.title}</span>
                </div>
                <span className="text-[11px] text-[#46464b]">{item.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Responder Notes */}
        <div className="flex flex-col gap-2 pt-1">
          <span className="font-serif text-[16px] font-bold text-[#060810]">
            Verified Responder Notes
          </span>
          <div className="flex flex-col gap-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#060810]">{note.author}</span>
                  <span className="text-[#76777c]">{note.time}</span>
                </div>
                <p className="text-[12px] text-[#46464b] leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>

          {/* Add note input */}
          <form onSubmit={handleAddNote} className="flex gap-2 mt-1">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Add observation or care update..."
              className="flex-1 px-3 py-2 text-[12px] rounded-lg border border-[#c7c6cc] focus:outline-none focus:ring-2 focus:ring-[#060810]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-[#060810] hover:bg-[#1d2029] text-white text-[12px] font-bold"
            >
              Add Note
            </button>
          </form>
        </div>

        {/* Post-Fall Recovery Checklist */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="font-serif text-[16px] font-bold text-[#060810]">
              Post-Fall Protocol Checklist
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#f1ede5] text-[#060810]">
              {completedCount} / {checklist.length} Completed
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {checklist.map((item: PostFallChecklistItem) => (
              <label
                key={item.id}
                className="flex items-start gap-2.5 p-2 rounded bg-[#f7f3eb] border border-[#e6e2da]/60 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleChecklistItem(item.id)}
                  className="mt-1 rounded text-[#b81c37] focus:ring-[#b81c37]"
                />
                <div className="flex flex-col">
                  <span className={`text-[12px] font-semibold ${item.done ? 'line-through text-[#76777c]' : 'text-[#060810]'}`}>
                    {item.title}
                  </span>
                  <span className="text-[11px] text-[#46464b]">{item.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#f1ede5]">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex-1 py-2.5 px-4 rounded-lg bg-[#060810] hover:bg-[#1d2029] text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExporting ? 'sync' : 'picture_as_pdf'}
            </span>
            <span>{isExporting ? 'Compiling PDF...' : 'Export Clinical Incident Report'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-lg bg-[#f1ede5] hover:bg-[#ece8e0] text-[#060810] text-[13px] font-bold transition-all"
          >
            Done
          </button>
        </div>

        <div className="text-center text-[10px] text-[#76777c] pt-1">
          Statutory 7-Day Auto-Purge: This incident audit will be cryptographically erased in 6 days 19 hours.
        </div>
      </div>
    </div>
  );
};
