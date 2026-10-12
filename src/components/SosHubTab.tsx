import React, { useState, useRef, useEffect } from 'react';

interface SosHubTabProps {
  onTriggerFallAlert: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export const SosHubTab: React.FC<SosHubTabProps> = ({
  onTriggerFallAlert,
  onShowToast
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progressFraction, setProgressFraction] = useState(0);
  const [sosStatus, setSosStatus] = useState('System Ready · Hardware Link Active');
  const [isSosTriggered, setIsSosTriggered] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const TOTAL_MS = 3000;

  const handleStartHold = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsHolding(true);
    setIsSosTriggered(false);
    setSosStatus('HOLD FIRM... ARMED BROADCAST IMMINENT');
    const startTime = Date.now();

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const frac = Math.min(elapsed / TOTAL_MS, 1);
      setProgressFraction(frac);

      if (frac >= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        triggerSosBroadcast();
      }
    }, 40);
  };

  const handleReleaseHold = () => {
    if (!isSosTriggered) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      setIsHolding(false);
      setProgressFraction(0);
      setSosStatus('System Ready · Hardware Link Active');
    }
  };

  const triggerSosBroadcast = () => {
    setIsSosTriggered(true);
    setSosStatus('SOS TRANSMITTED · 112 & RELAY CALLS INITIATED');
    onShowToast('SOS Level-1 Dispatched to National 112 & Family Relay!', 'emergency');

    setTimeout(() => {
      onTriggerFallAlert();
      setIsHolding(false);
      setProgressFraction(0);
      setIsSosTriggered(false);
      setSosStatus('System Ready · Hardware Link Active');
    }, 1200);
  };

  const handleCellularPing = () => {
    setIsPinging(true);
    setPingResult(null);
    onShowToast('Pinging Tower Carrier Nodes over Airtel 4G LTE...', 'cell_tower');

    setTimeout(() => {
      setIsPinging(false);
      setPingResult('Ping Confirmed: 28ms · Airtel 4G VoLTE Ready');
      onShowToast('Cellular Ping Confirmed: 28ms latency.', 'check_circle');
    }, 1400);
  };

  const strokeDashoffset = 289 - 289 * progressFraction;
  const outerScale = 1 + progressFraction * 0.25;
  const midScale = 1 + progressFraction * 0.15;

  return (
    <div className="flex flex-col w-full gap-4 max-w-2xl mx-auto pb-6">
      {/* Redundant Signal Mesh */}
      <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm flex flex-col gap-2.5 border border-[#e6e2da]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#b81c37] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              cell_tower
            </span>
            <h2 className="font-serif text-[18px] font-semibold text-[#060810]">
              Redundant Signal Mesh
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#f1ede5] text-[#1c1c17] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fe5364] animate-pulse"></span>
            Failover Primed
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5 pt-1">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f7f3eb] border border-[#e6e2da]/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#060810]">router</span>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[13px] text-[#060810]">
                  Broadband Fibre
                </span>
                <span className="text-[11px] text-[#46464b]">Primary Uplink · Low Latency</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#060810] bg-[#e6e2da] px-2 py-1 rounded">
              1 Gbps (Active)
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f7f3eb] border border-[#e6e2da]/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#b81c37]">
                signal_cellular_alt
              </span>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[13px] text-[#060810]">
                  Carrier Cellular Relay
                </span>
                <span className="text-[11px] text-[#46464b]">
                  Airtel 4G VoLTE Standby · Blackout proof
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#b81c37] bg-[#ffdada] px-2 py-1 rounded">
              Standby Active
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f7f3eb] border border-[#e6e2da]/60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#ac7f39]">
                battery_charging_full
              </span>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[13px] text-[#060810]">
                  Hub LiFePO4 Battery
                </span>
                <span className="text-[11px] text-[#46464b]">
                  18 hrs autonomous continuous power
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#060810] bg-[#e6e2da] px-2 py-1 rounded">
              100% · 54.2V
            </span>
          </div>
        </div>
      </div>

      {/* Main Tactile 3-Second Hold SOS Button */}
      <div className="bg-[#ffffff] rounded-xl p-5 shadow-sm flex flex-col items-center text-center relative overflow-hidden border border-[#e6e2da]">
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#b81c37]/5 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-[#fe5364]/5 pointer-events-none"></div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdada] text-[#920024] mb-2">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Statutory Level-1 Dispatch Relay
          </span>
        </div>

        <p className="text-[12px] text-[#46464b] max-w-[280px] mb-4 leading-normal">
          Press &amp; hold below for 3 full seconds. Cancels accidental taps. Initiates instant multi-channel sirens.
        </p>

        {/* SOS Button Area */}
        <div className="relative flex items-center justify-center my-2 select-none">
          {/* Animated Background Ripples */}
          <div
            className="absolute w-56 h-56 rounded-full bg-[#ffdada] opacity-40 transition-transform duration-300 pointer-events-none"
            style={{ transform: `scale(${outerScale})` }}
          ></div>
          <div
            className="absolute w-44 h-44 rounded-full bg-[#fe5364] opacity-20 transition-transform duration-200 pointer-events-none"
            style={{ transform: `scale(${midScale})` }}
          ></div>

          {/* Core Interactive Push Button */}
          <button
            type="button"
            onMouseDown={handleStartHold}
            onMouseUp={handleReleaseHold}
            onMouseLeave={handleReleaseHold}
            onTouchStart={handleStartHold}
            onTouchEnd={handleReleaseHold}
            className={`relative z-10 w-36 h-36 rounded-full text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all duration-150 cursor-pointer outline-none select-none ${
              isSosTriggered ? 'bg-[#ba1a1a]' : 'bg-[#b81c37] hover:bg-[#920024]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[36px] mb-1 text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency
            </span>
            <span className="font-serif text-[18px] leading-tight font-bold tracking-tight">
              SOS
            </span>
            <span className="text-[10px] uppercase tracking-widest mt-1 opacity-90 font-sans font-bold">
              {isHolding ? `${Math.ceil((1 - progressFraction) * 3)}s` : 'Hold 3s'}
            </span>
          </button>

          {/* Radial SVG Progress Circle */}
          <svg
            className="absolute z-20 w-44 h-44 -rotate-90 pointer-events-none"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="46"
              stroke="#f1ede5"
              strokeWidth="4"
            ></circle>
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="46"
              stroke="#b81c37"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="289"
              style={{ strokeDashoffset: `${strokeDashoffset}` }}
              className="transition-all duration-75"
            ></circle>
          </svg>
        </div>

        <div className="mt-4 min-h-[24px]">
          <span
            className={`text-[12px] font-bold ${
              isHolding ? 'text-[#b81c37] animate-pulse' : 'text-[#46464b]'
            }`}
          >
            {sosStatus}
          </span>
        </div>
      </div>

      {/* Targeted Emergency Dispatch */}
      <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm flex flex-col gap-2.5 border border-[#e6e2da]">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#060810] text-[20px]">category</span>
          <h3 className="font-serif text-[18px] font-semibold text-[#060810]">
            Targeted Emergency Dispatch
          </h3>
        </div>
        <p className="text-[12px] text-[#46464b]">
          Immediate routing with pre-packaged diagnostic profiles
        </p>

        <div className="grid grid-cols-1 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => onShowToast('Calling Fortis Ambulance with GPS & Apartment 402, Tower A code...', 'ambulance')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-[#f7f3eb] hover:bg-[#f1ede5] active:scale-[0.99] transition-all text-left border border-[#e6e2da]/50"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#ffdada] flex items-center justify-center text-[#b81c37]">
                <span className="material-symbols-outlined text-[24px]">ambulance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[13px] text-[#060810]">
                  Medical Emergency (Ambulance)
                </span>
                <span className="text-[11px] text-[#46464b]">
                  Shares vitals profile + Apartment 402, Tower A access code
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#76777c] text-[20px]">chevron_right</span>
          </button>

          <button
            type="button"
            onClick={() => onShowToast('Activating silent deterrent strobe & alert to 112...', 'local_police')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-[#f7f3eb] hover:bg-[#f1ede5] active:scale-[0.99] transition-all text-left border border-[#e6e2da]/50"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#1d2029] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[24px]">local_police</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[13px] text-[#060810]">
                  Intruder / Security Threat
                </span>
                <span className="text-[11px] text-[#46464b]">
                  Activates silent deterrent strobe &amp; 112 siren
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#76777c] text-[20px]">chevron_right</span>
          </button>

          <button
            type="button"
            onClick={() => onShowToast('Connecting direct VoIP intercom to Gate 1 Guard Ramesh...', 'deskphone')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-[#f7f3eb] hover:bg-[#f1ede5] active:scale-[0.99] transition-all text-left border border-[#e6e2da]/50"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#ece8e0] flex items-center justify-center text-[#060810]">
                <span className="material-symbols-outlined text-[24px]">deskphone</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[13px] text-[#060810]">
                  Society Security Desk
                </span>
                <span className="text-[11px] text-[#46464b]">
                  Direct VoIP Intercom to Main Gate Guard
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#76777c] text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Broadcast Execution Matrix */}
      <div className="bg-[#1d2029] text-white rounded-xl p-4 shadow-sm flex flex-col gap-2.5 border border-[#1d2029]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#f2be71] text-[20px]">hub</span>
            <h3 className="font-serif text-[18px] font-semibold text-white">
              Broadcast Execution Matrix
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-white/10 text-[#ffddb1] text-[10px] font-bold uppercase">
            Parallel
          </span>
        </div>
        <p className="text-[12px] text-[#858793]">
          Triggering transmits telemetry instantaneously across multiple independent nodes:
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#f2be71] text-[18px] mt-0.5">
              location_on
            </span>
            <div className="flex flex-col">
              <span className="font-sans font-semibold text-[13px] text-white">
                Geofence &amp; Floor Tagging
              </span>
              <span className="text-[11px] text-[#858793]">
                Sub-meter GPS coordinates + Apartment 402, Tower A address bundle
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#f2be71] text-[18px] mt-0.5">
              camera_outdoor
            </span>
            <div className="flex flex-col">
              <span className="font-sans font-semibold text-[13px] text-white">
                Live Doorstep Visual Snapshot
              </span>
              <span className="text-[11px] text-[#858793]">
                Encrypted photo upload over fallback LTE network
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#f2be71] text-[18px] mt-0.5">
              ring_volume
            </span>
            <div className="flex flex-col">
              <span className="font-sans font-semibold text-[13px] text-white">
                4-Party Automated IVR Escalation
              </span>
              <span className="text-[11px] text-[#858793]">
                Sequential and SMS loop to emergency contacts + National 112 API
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics & Verification */}
      <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm flex flex-col gap-2.5 border border-[#e6e2da]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#060810] text-[20px]">network_ping</span>
            <h3 className="font-serif text-[18px] font-semibold text-[#060810]">
              Diagnostics &amp; Verification
            </h3>
          </div>
          <span className="text-[11px] font-medium text-[#46464b]">DPDP Sovereign Telemetry</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-[#f7f3eb] border border-[#e6e2da]/50">
          <div className="flex flex-col">
            <span className="font-sans font-semibold text-[13px] text-[#060810]">
              Last Autonomous Self-Test
            </span>
            <span className="text-[11px] text-[#46464b]">
              Today, 06:00 AM · Tower Cell ACK Received
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#060810] text-[11px] font-bold bg-[#e6e2da] px-2 py-1 rounded">
            <span className="material-symbols-outlined text-[16px] text-[#b81c37]">check_circle</span>
            Passed
          </div>
        </div>

        <button
          type="button"
          onClick={handleCellularPing}
          disabled={isPinging}
          className="w-full py-2.5 px-4 rounded-lg bg-[#f1ede5] hover:bg-[#ece8e0] text-[#060810] text-[13px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-all border border-[#e6e2da]"
        >
          <span className={`material-symbols-outlined text-[18px] ${isPinging ? 'animate-spin' : ''}`}>
            {isPinging ? 'refresh' : 'cell_merge'}
          </span>
          <span>{isPinging ? 'Pinging Tower Carrier Nodes...' : pingResult || 'Run Silent Cellular Ping Test'}</span>
        </button>
      </div>

      {/* Offline Emergency Directives */}
      <div className="bg-[#ffffff] rounded-xl p-4 shadow-sm flex flex-col gap-2.5 border border-[#e6e2da]">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#060810] text-[20px]">medical_services</span>
          <h3 className="font-serif text-[18px] font-semibold text-[#060810]">
            Offline Emergency Directives
          </h3>
        </div>
        <p className="text-[12px] text-[#46464b]">
          Validated first-aid protocols locally cached on device hub
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <div className="p-3 rounded-lg bg-[#f7f3eb] flex flex-col gap-1 border border-[#e6e2da]/40">
            <div className="flex items-center gap-2 text-[#b81c37]">
              <span className="material-symbols-outlined text-[18px]">cardiology</span>
              <span className="font-sans font-semibold text-[13px] text-[#060810]">
                Cardiac Event / Unresponsive
              </span>
            </div>
            <p className="text-[12px] text-[#46464b] leading-relaxed">
              Lay flat on hard surface. Check airway. Begin chest compressions at 100-120 bpm (2 inches depth) to the rhythm of 'Stayin Alive'. Do not stop until paramedics arrive.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#f7f3eb] flex flex-col gap-1 border border-[#e6e2da]/40">
            <div className="flex items-center gap-2 text-[#ac7f39]">
              <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
              <span className="font-sans font-semibold text-[13px] text-[#060810]">
                Thermal Burns &amp; Scalds
              </span>
            </div>
            <p className="text-[12px] text-[#46464b] leading-relaxed">
              Immerse affected skin under cool running water for at least 20 minutes. Do not apply ice or butter. Cover loosely with sterile plastic cling film or clean dry cloth.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#f7f3eb] flex flex-col gap-1 border border-[#e6e2da]/40">
            <div className="flex items-center gap-2 text-[#060810]">
              <span className="material-symbols-outlined text-[18px]">accessible_forward</span>
              <span className="font-sans font-semibold text-[13px] text-[#060810]">
                Fall Trauma / Suspected Fracture
              </span>
            </div>
            <p className="text-[12px] text-[#46464b] leading-relaxed">
              Do not move the individual if spinal, neck, or pelvic injury is suspected. Keep patient warm and support limbs with rolled towels in the position found.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
