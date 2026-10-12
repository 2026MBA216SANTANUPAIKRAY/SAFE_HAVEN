import React, { useState, useEffect, useRef } from 'react';
import { InHomeCctvCamera, InHomeCctvEvent } from '../types';
import { IN_HOME_CAMERAS, IN_HOME_CCTV_EVENTS } from '../data/mockData';

interface InHomeCctvViewerProps {
  onShowToast?: (msg: string, icon?: string) => void;
  onClose?: () => void;
}

export const InHomeCctvViewer: React.FC<InHomeCctvViewerProps> = ({
  onShowToast,
  onClose
}) => {
  const [cameras, setCameras] = useState<InHomeCctvCamera[]>(IN_HOME_CAMERAS);
  const [activeCamId, setActiveCamId] = useState<string>('cam-living');
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [currentTime, setCurrentTime] = useState<string>('09:52:14 PM IST');
  const [isPttActive, setIsPttActive] = useState<boolean>(false);
  const [isSnapshotFlashing, setIsSnapshotFlashing] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTimer, setRecordTimer] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<InHomeCctvEvent | null>(null);
  const [eventFilter, setEventFilter] = useState<'all' | 'person' | 'pet' | 'motion'>('all');

  const activeCam = cameras.find((c) => c.id === activeCamId) || cameras[0];

  // Live timestamp clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setCurrentTime(`${timeStr} IST`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Recording counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle Motorized Privacy Shutter Toggle
  const handleToggleShutter = (camId: string) => {
    const targetCam = cameras.find((cam) => cam.id === camId);
    if (!targetCam) return;
    const nextState = targetCam.shutterState === 'open' ? 'closed' : 'open';

    setCameras((prev) =>
      prev.map((cam) =>
        cam.id === camId ? { ...cam, shutterState: nextState } : cam
      )
    );

    if (onShowToast) {
      if (nextState === 'closed') {
        onShowToast(
          `Motorized Shutter ENGAGED on ${targetCam.name}. Lens physically blocked & microphones cut.`,
          'lock'
        );
      } else {
        onShowToast(
          `Motorized Shutter OPENED on ${targetCam.name}. Live optical session initialized.`,
          'lock_open'
        );
      }
    }
  };

  // PTZ adjustments
  const handlePtzMove = (direction: 'up' | 'down' | 'left' | 'right' | 'center') => {
    if (activeCam.shutterState === 'closed') {
      if (onShowToast) onShowToast('Camera shutter is closed. Open shutter to adjust PTZ angle.', 'visibility_off');
      return;
    }

    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === activeCamId) {
          let newPan = c.panAngle;
          let newTilt = c.tiltAngle;

          if (direction === 'left') newPan = Math.max(-180, c.panAngle - 15);
          if (direction === 'right') newPan = Math.min(180, c.panAngle + 15);
          if (direction === 'up') newTilt = Math.min(45, c.tiltAngle + 8);
          if (direction === 'down') newTilt = Math.max(-45, c.tiltAngle - 8);
          if (direction === 'center') {
            newPan = 0;
            newTilt = 0;
          }

          return { ...c, panAngle: newPan, tiltAngle: newTilt };
        }
        return c;
      })
    );

    if (onShowToast && direction === 'center') {
      onShowToast(`PTZ camera centered to reference mark.`);
    }
  };

  // Zoom adjustments
  const handleSetZoom = (level: 1 | 2 | 4) => {
    if (activeCam.shutterState === 'closed') return;
    setCameras((prev) =>
      prev.map((c) => (c.id === activeCamId ? { ...c, zoomLevel: level } : c))
    );
    if (onShowToast) {
      onShowToast(`Optical zoom set to ${level}x.`);
    }
  };

  // Toggle Night Vision
  const handleCycleNightVision = () => {
    const targetCam = cameras.find((c) => c.id === activeCamId) || cameras[0];
    const modes: ('auto' | 'on' | 'off')[] = ['auto', 'on', 'off'];
    const next = modes[(modes.indexOf(targetCam.nightVision) + 1) % modes.length];

    setCameras((prev) =>
      prev.map((c) => (c.id === activeCamId ? { ...c, nightVision: next } : c))
    );

    if (onShowToast) {
      onShowToast(
        `Night Vision mode: ${next === 'auto' ? 'Auto Starlight IR' : next === 'on' ? 'Infrared Forced ON' : 'Standard Daytime'}`,
        'bedtime'
      );
    }
  };

  // Toggle Privacy Mask
  const handleTogglePrivacyMask = () => {
    const targetCam = cameras.find((c) => c.id === activeCamId) || cameras[0];
    const nextVal = !targetCam.privacyMaskEnabled;

    setCameras((prev) =>
      prev.map((c) => (c.id === activeCamId ? { ...c, privacyMaskEnabled: nextVal } : c))
    );

    if (onShowToast) {
      onShowToast(
        nextVal
          ? 'Privacy Zones Active: Sensitive zones masked with solid blackout overlay.'
          : 'Privacy Zones Disabled.',
        'shield'
      );
    }
  };

  // Snapshot
  const handleTakeSnapshot = () => {
    if (activeCam.shutterState === 'closed') {
      if (onShowToast) onShowToast('Cannot take snapshot while lens shutter is closed.', 'warning');
      return;
    }
    setIsSnapshotFlashing(true);
    setTimeout(() => setIsSnapshotFlashing(false), 200);
    if (onShowToast) {
      onShowToast(
        `High-Res Snapshot captured from ${activeCam.name} and encrypted to Apartment 402 Hub.`,
        'photo_camera'
      );
    }
  };

  // Local Recording
  const handleToggleRecord = () => {
    if (activeCam.shutterState === 'closed') return;
    if (isRecording) {
      setIsRecording(false);
      if (onShowToast) {
        onShowToast(
          `Encrypted clip (${recordTimer}s) saved to Local Vault. Zero cloud replication.`,
          'fiber_manual_record'
        );
      }
    } else {
      setIsRecording(true);
      if (onShowToast) {
        onShowToast(`Started local encrypted recording on ${activeCam.name}.`, 'videocam');
      }
    }
  };

  // Play Room Chime
  const handlePlayChime = () => {
    if (onShowToast) {
      onShowToast(
        `Broadcasting gentle 2-tone chime to ${activeCam.name} speaker...`,
        'notifications'
      );
    }
  };

  // Push to talk
  const handlePttStart = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsPttActive(true);
  };

  const handlePttEnd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isPttActive) {
      setIsPttActive(false);
      if (onShowToast) {
        onShowToast(`Audio transmission sent to ${activeCam.name} intercom speaker.`, 'record_voice_over');
      }
    }
  };

  // Filter events
  const filteredEvents = IN_HOME_CCTV_EVENTS.filter((evt) => {
    if (eventFilter === 'all') return true;
    return evt.type === eventFilter;
  });

  return (
    <div className="flex flex-col w-full gap-3.5 animate-in fade-in">
      {/* CCTV Header & Mode Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-white border border-[#e6e2da] shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-[#f1ede5] text-[#060810] flex items-center justify-center shrink-0 border border-[#e6e2da]">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              videocam
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-[17px] font-bold text-[#060810] leading-tight">
                In-Home CCTV Access
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#3E8F5D]/10 text-[#3E8F5D] border border-[#3E8F5D]/25 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D] animate-pulse"></span>
                4 Feeds Ready
              </span>
            </div>
            <p className="text-[11.5px] text-[#46464b] mt-0.5">
              Encrypted local RTSP video feeds with motorized hardware privacy shutters.
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode('single')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'single'
                ? 'bg-[#060810] text-white shadow-xs'
                : 'bg-[#f1ede5] text-[#46464b] hover:bg-[#ece8e0]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">fullscreen</span>
            PTZ View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-[#060810] text-white shadow-xs'
                : 'bg-[#f1ede5] text-[#46464b] hover:bg-[#ece8e0]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">grid_view</span>
            Quad Matrix
          </button>
        </div>
      </div>

      {/* Camera Selection Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {cameras.map((cam) => {
          const isSelected = activeCamId === cam.id;
          const isShuttered = cam.shutterState === 'closed';

          return (
            <button
              key={cam.id}
              type="button"
              onClick={() => {
                setActiveCamId(cam.id);
                if (viewMode === 'grid') setViewMode('single');
              }}
              className={`px-3 py-2 rounded-xl text-left shrink-0 transition-all border flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-white border-[#060810] shadow-sm ring-1 ring-[#060810]'
                  : 'bg-[#ffffff] hover:bg-[#f7f3eb] border-[#e6e2da]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isShuttered
                    ? 'bg-[#f1ede5] text-[#76777c]'
                    : isSelected
                    ? 'bg-[#060810] text-white'
                    : 'bg-[#f7f3eb] text-[#060810]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isShuttered ? 'lock' : cam.hasPtz ? 'videocam' : 'camera_indoor'}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans font-bold text-[12px] text-[#060810] whitespace-nowrap">
                    {cam.name}
                  </span>
                  {isShuttered && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#b81c37] bg-[#ffdada] px-1 rounded">
                      Shuttered
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#76777c] whitespace-nowrap">
                  {cam.zone} · {cam.resolution.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* VIEW MODE: QUAD MATRIX GRID */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cameras.map((cam) => {
            const isClosed = cam.shutterState === 'closed';

            return (
              <div
                key={cam.id}
                onClick={() => {
                  setActiveCamId(cam.id);
                  setViewMode('single');
                }}
                className="relative rounded-xl overflow-hidden bg-[#060810] border border-[#060810] shadow-sm aspect-[16/10] cursor-pointer group flex flex-col justify-between p-2.5"
              >
                {/* Background Video Simulator */}
                {isClosed ? (
                  <div className="absolute inset-0 bg-[#16181f] flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#242733] flex items-center justify-center text-[#b81c37] mb-2 border border-[#3b3f4f]">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                      Physical Shutter Closed
                    </span>
                    <span className="text-[9.5px] text-[#858793] mt-0.5">
                      Lens covered &middot; Microphones hardware-off
                    </span>
                  </div>
                ) : (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${cam.imageUrl}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060810]/80 via-transparent to-[#060810]/40 pointer-events-none" />
                  </>
                )}

                {/* Top overlay */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 bg-[#060810]/75 backdrop-blur-xs px-2 py-0.5 rounded text-white text-[10px] font-bold">
                    <span className={`w-1.5 h-1.5 rounded-full ${isClosed ? 'bg-[#76777c]' : 'bg-[#3E8F5D] animate-pulse'}`} />
                    <span>{cam.name}</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-white/80 bg-[#060810]/75 px-1.5 py-0.5 rounded">
                    {cam.resolution.split(' ')[0]}
                  </span>
                </div>

                {/* Bottom overlay */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="text-[10px] text-white/90 font-medium">
                    {cam.location}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#f2be71] bg-[#1d2029]/90 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">touch_app</span>
                    Select PTZ
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE: SINGLE FULL PTZ STREAM VIEWPORT */}
      {viewMode === 'single' && (
        <div className="flex flex-col gap-3">
          {/* Main Video Viewport */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-[#060810] shadow-md aspect-[16/10] sm:aspect-[16/9] flex flex-col justify-between p-3.5 border border-[#060810]">
            {/* Snapshot Flash Overlay */}
            {isSnapshotFlashing && (
              <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-200" />
            )}

            {/* When Shutter is CLOSED: Mechanical Security Wall */}
            {activeCam.shutterState === 'closed' ? (
              <div className="absolute inset-0 bg-gradient-to-b from-[#181a24] to-[#0c0d13] flex flex-col items-center justify-center p-6 text-center z-10">
                {/* Mechanical shutter slats design pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="w-14 h-14 rounded-2xl bg-[#232738] border border-[#3b415c] flex items-center justify-center text-[#b81c37] mb-3 shadow-inner">
                  <span
                    className="material-symbols-outlined text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    lock
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b81c37]/20 border border-[#b81c37]/40 text-[#fe5364] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fe5364]"></span>
                  Physical Shutter Engaged
                </div>
                <h3 className="font-serif text-[18px] font-bold text-white mb-1">
                  Optical Lens &amp; Microphone Hardware Blocked
                </h3>
                <p className="text-[12px] text-[#858793] max-w-sm mb-4 leading-relaxed">
                  The motorized aluminum blind is down. Zero optical light touches the sensor and microphone circuits are physically open-circuited.
                </p>
                <button
                  type="button"
                  onClick={() => handleToggleShutter(activeCam.id)}
                  className="px-4 py-2 rounded-xl bg-[#b81c37] hover:bg-[#920024] active:scale-95 text-white font-sans font-bold text-[13px] flex items-center gap-2 shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">lock_open</span>
                  Open Shutter for Live Session
                </button>
              </div>
            ) : (
              /* When Shutter is OPEN: Live Stream Video Canvas */
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300 pointer-events-none"
                  style={{
                    backgroundImage: `url('${activeCam.imageUrl}')`,
                    transform: `scale(${activeCam.zoomLevel}) translate(${activeCam.panAngle * -0.4}px, ${activeCam.tiltAngle * -0.4}px)`,
                    filter: activeCam.nightVision === 'on' ? 'grayscale(90%) contrast(120%)' : 'none'
                  }}
                />

                {/* Subtle Scanlines & Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060810]/95 via-transparent to-[#060810]/50 pointer-events-none" />

                {/* Privacy Mask Overlay if Enabled */}
                {activeCam.privacyMaskEnabled && (
                  <div className="absolute top-1/4 right-8 w-36 h-28 bg-[#060810]/95 border border-[#3b415c] rounded flex flex-col items-center justify-center text-center p-2 z-20 pointer-events-none">
                    <span className="material-symbols-outlined text-[18px] text-[#76777c]">visibility_off</span>
                    <span className="text-[9px] text-[#858793] font-bold uppercase tracking-wider mt-1">
                      Privacy Masked Zone
                    </span>
                  </div>
                )}

                {/* Simulated AI Object Detection Bounding Box */}
                {activeCam.motionDetected && (
                  <div className="relative z-10 mx-auto mt-6 w-44 h-40 rounded border-2 border-dashed border-[#3E8F5D]/90 bg-[#3E8F5D]/10 flex flex-col justify-between p-2 pointer-events-none">
                    <div className="inline-flex items-center gap-1 bg-[#3E8F5D] text-white px-2 py-0.5 rounded text-left self-start shadow-sm text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[12px]">accessibility</span>
                      <span>Family Member Safe</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#1d2029]/90 px-1.5 py-0.5 rounded text-white text-[9.5px]">
                      <span>Posture: Stable</span>
                      <span className="text-[#3E8F5D] font-bold">98% confidence</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Top Stream Telemetry Ribbon */}
            <div className="relative z-20 flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#060810]/80 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[10px] font-bold">
                  <span className={`w-2 h-2 rounded-full ${activeCam.shutterState === 'closed' ? 'bg-[#76777c]' : 'bg-[#b81c37] animate-ping'}`} />
                  <span className="uppercase tracking-wider">
                    {activeCam.shutterState === 'closed' ? 'MUTED' : `LIVE · ${currentTime}`}
                  </span>
                </div>
                {isRecording && (
                  <div className="flex items-center gap-1 bg-[#b81c37] text-white px-2 py-1 rounded-md text-[10px] font-bold animate-pulse">
                    <span className="material-symbols-outlined text-[13px]">fiber_manual_record</span>
                    <span>REC {recordTimer}s</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-[#060810]/80 backdrop-blur-md px-2 py-1 rounded-md text-white text-[10px] font-medium font-mono">
                  <span className="text-[#3E8F5D] font-bold">{activeCam.bitrate}</span>
                  <span>·</span>
                  <span>{activeCam.fps}fps</span>
                  <span>·</span>
                  <span className="text-[#f2be71]">{activeCam.resolution.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            {/* Bottom Stream Controls & Actions */}
            <div className="relative z-20 flex items-end justify-between w-full">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-[14px] text-white leading-tight">
                    {activeCam.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#858793] bg-[#16181f]/80 px-1.5 py-0.5 rounded">
                    Pan: {activeCam.panAngle}° | Tilt: {activeCam.tiltAngle}°
                  </span>
                </div>
                <span className="text-[11px] text-[#c7c6cc] mt-0.5">
                  {activeCam.location} · {activeCam.powerSource}
                </span>
              </div>

              {/* Viewport Control Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTakeSnapshot}
                  className="w-8 h-8 rounded-lg bg-[#1d2029]/90 hover:bg-[#2b2f3d] text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                  title="Take Encrypted Snapshot"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-95 ${
                    isRecording
                      ? 'bg-[#b81c37] text-white'
                      : 'bg-[#1d2029]/90 hover:bg-[#2b2f3d] text-white'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Record Local Video'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isRecording ? 'stop' : 'videocam'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCycleNightVision}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-95 ${
                    activeCam.nightVision === 'on'
                      ? 'bg-[#f2be71] text-[#060810]'
                      : 'bg-[#1d2029]/90 hover:bg-[#2b2f3d] text-white'
                  }`}
                  title="Night Vision Mode"
                >
                  <span className="material-symbols-outlined text-[18px]">bedtime</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleShutter(activeCam.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-95 ${
                    activeCam.shutterState === 'closed'
                      ? 'bg-[#3E8F5D] text-white'
                      : 'bg-[#b81c37] text-white hover:bg-[#920024]'
                  }`}
                  title={activeCam.shutterState === 'closed' ? 'Open Shutter' : 'Engage Physical Shutter'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {activeCam.shutterState === 'closed' ? 'lock_open' : 'lock'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive PTZ D-Pad Controller & Intercom Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* PTZ Pan-Tilt Controls */}
            <div className="bg-white p-3.5 rounded-xl border border-[#e6e2da] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#060810]">
                    control_camera
                  </span>
                  <span className="font-sans font-bold text-[13px] text-[#060810]">
                    PTZ Directional Control
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-[#76777c]">Zoom:</span>
                  {([1, 2, 4] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleSetZoom(lvl)}
                      className={`w-6 h-6 rounded text-[10px] font-bold transition-all ${
                        activeCam.zoomLevel === lvl
                          ? 'bg-[#060810] text-white'
                          : 'bg-[#f1ede5] text-[#46464b] hover:bg-[#ece8e0]'
                      }`}
                    >
                      {lvl}x
                    </button>
                  ))}
                </div>
              </div>

              {/* D-Pad Controller */}
              <div className="flex items-center justify-center py-1">
                <div className="grid grid-cols-3 gap-1.5 w-36 h-36">
                  <div />
                  <button
                    type="button"
                    onClick={() => handlePtzMove('up')}
                    className="rounded-lg bg-[#f1ede5] hover:bg-[#e6e2da] active:scale-90 text-[#060810] flex items-center justify-center border border-[#e6e2da] transition-all"
                    title="Tilt Up"
                  >
                    <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
                  </button>
                  <div />

                  <button
                    type="button"
                    onClick={() => handlePtzMove('left')}
                    className="rounded-lg bg-[#f1ede5] hover:bg-[#e6e2da] active:scale-90 text-[#060810] flex items-center justify-center border border-[#e6e2da] transition-all"
                    title="Pan Left"
                  >
                    <span className="material-symbols-outlined text-[20px]">keyboard_arrow_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePtzMove('center')}
                    className="rounded-lg bg-[#060810] hover:bg-[#1d2029] active:scale-90 text-white flex flex-col items-center justify-center text-[9px] font-bold transition-all shadow-xs"
                    title="Recenter"
                  >
                    <span>RESET</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePtzMove('right')}
                    className="rounded-lg bg-[#f1ede5] hover:bg-[#e6e2da] active:scale-90 text-[#060810] flex items-center justify-center border border-[#e6e2da] transition-all"
                    title="Pan Right"
                  >
                    <span className="material-symbols-outlined text-[20px]">keyboard_arrow_right</span>
                  </button>

                  <div />
                  <button
                    type="button"
                    onClick={() => handlePtzMove('down')}
                    className="rounded-lg bg-[#f1ede5] hover:bg-[#e6e2da] active:scale-90 text-[#060810] flex items-center justify-center border border-[#e6e2da] transition-all"
                    title="Tilt Down"
                  >
                    <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
                  </button>
                  <div />
                </div>
              </div>

              {/* Shutter Quick Toggle & Privacy Mask */}
              <div className="flex items-center justify-between pt-1 border-t border-[#f1ede5] text-[11px]">
                <button
                  type="button"
                  onClick={handleTogglePrivacyMask}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                    activeCam.privacyMaskEnabled
                      ? 'bg-[#060810] text-white'
                      : 'bg-[#f1ede5] text-[#46464b] hover:bg-[#ece8e0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  Privacy Zones {activeCam.privacyMaskEnabled ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={handlePlayChime}
                  className="px-2.5 py-1 rounded bg-[#f1ede5] hover:bg-[#ece8e0] text-[#060810] text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">notifications</span>
                  Play Chime
                </button>
              </div>
            </div>

            {/* In-Home 2-Way Intercom Talkback */}
            <div className="bg-white p-3.5 rounded-xl border border-[#e6e2da] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#3E8F5D]">
                    volume_up
                  </span>
                  <span className="font-sans font-bold text-[13px] text-[#060810]">
                    In-Home Room Intercom
                  </span>
                </div>
                <span className="text-[10px] text-[#3E8F5D] font-bold uppercase tracking-wider bg-[#3E8F5D]/10 px-1.5 py-0.5 rounded">
                  Speaker Active
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] text-[11.5px] text-[#46464b] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#060810]">speaker</span>
                <span>
                  Audio broadcasts directly into <strong>{activeCam.name}</strong> high-fidelity room speaker.
                </span>
              </div>

              {/* Hold to talk button */}
              <button
                type="button"
                onMouseDown={handlePttStart}
                onMouseUp={handlePttEnd}
                onTouchStart={handlePttStart}
                onTouchEnd={handlePttEnd}
                className={`w-full h-14 rounded-xl flex items-center justify-center gap-2.5 transition-all select-none shadow-sm cursor-pointer ${
                  isPttActive
                    ? 'bg-[#3E8F5D] text-white scale-[0.98] ring-4 ring-[#3E8F5D]/30'
                    : 'bg-[#060810] hover:bg-[#1d2029] text-white'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${isPttActive ? 'animate-ping' : ''}`}>
                  {isPttActive ? 'mic' : 'record_voice_over'}
                </span>
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-sans font-bold text-[14px]">
                    {isPttActive ? 'TRANSMITTING TO ROOM...' : 'HOLD TO TALK TO ROOM'}
                  </span>
                  <span className="text-[10px] opacity-80">
                    Two-way full-duplex room audio
                  </span>
                </div>
              </button>

              <div className="flex items-center justify-between text-[10.5px] text-[#76777c]">
                <span>Hardware model: {activeCam.hardwareModel}</span>
                <span className="text-[#3E8F5D] font-semibold">AES-256 WireGuard</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent In-Home CCTV Motion & Activity Log */}
      <div className="bg-white p-3.5 rounded-xl border border-[#e6e2da] shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#060810]">
              slow_motion_video
            </span>
            <span className="font-serif text-[17px] font-bold text-[#060810]">
              In-Home Activity Clips
            </span>
          </div>
          <div className="flex items-center gap-1">
            {(['all', 'person', 'pet', 'motion'] as const).map((filterType) => (
              <button
                key={filterType}
                type="button"
                onClick={() => setEventFilter(filterType)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  eventFilter === filterType
                    ? 'bg-[#060810] text-white'
                    : 'bg-[#f1ede5] text-[#46464b] hover:bg-[#ece8e0]'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => {
                setSelectedEvent(evt);
                if (onShowToast) {
                  onShowToast(`Playing encrypted 1080p clip: "${evt.title}" (${evt.durationSec}s).`, 'play_circle');
                }
              }}
              className="p-2.5 rounded-lg bg-[#f7f3eb] hover:bg-[#f1ede5] border border-[#e6e2da] transition-all cursor-pointer flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 bg-[#060810]">
                  <img
                    src={evt.thumbnailUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px] text-white drop-shadow">
                      play_arrow
                    </span>
                  </div>
                </div>
                <div>
                  <div className="font-sans font-bold text-[12px] text-[#060810] leading-snug">
                    {evt.title}
                  </div>
                  <div className="text-[10px] text-[#76777c]">
                    {evt.cameraName} &middot; {evt.time}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-[#b81c37] uppercase tracking-wider bg-[#ffdada] px-1.5 py-0.5 rounded">
                  {evt.durationSec > 0 ? `${evt.durationSec}s` : 'Audit'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
