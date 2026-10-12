import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
  Line
} from 'recharts';

interface MmWaveGlobalActivityChartProps {
  onClose?: () => void;
  onShowToast?: (msg: string, icon?: string) => void;
}

interface HourlyActivityRecord {
  hour: string;
  displayTime: string;
  totalAverage: number;
  parentsSuite: number;
  ensuiteBathroom: number;
  livingRoom: number;
  masterBedroom: number;
  balcony: number;
  eventNote?: string;
}

// 24-hour realistic mmWave point-cloud telemetry sequence for Apartment 402
const LAST_24H_ACTIVITY_DATA: HourlyActivityRecord[] = [
  { hour: '16:00', displayTime: '4:00 PM', totalAverage: 38, parentsSuite: 32, ensuiteBathroom: 15, livingRoom: 55, masterBedroom: 22, balcony: 66, eventNote: 'Balcony tea & foyer transit' },
  { hour: '17:00', displayTime: '5:00 PM', totalAverage: 45, parentsSuite: 40, ensuiteBathroom: 20, livingRoom: 70, masterBedroom: 30, balcony: 65, eventNote: 'Evening ambulatory transition' },
  { hour: '18:00', displayTime: '6:00 PM', totalAverage: 58, parentsSuite: 50, ensuiteBathroom: 25, livingRoom: 85, masterBedroom: 45, balcony: 85, eventNote: 'Family gathering in Living Room' },
  { hour: '19:00', displayTime: '7:00 PM', totalAverage: 64, parentsSuite: 55, ensuiteBathroom: 30, livingRoom: 92, masterBedroom: 55, balcony: 88, eventNote: 'Peak evening movement & dinner' },
  { hour: '20:00', displayTime: '8:00 PM', totalAverage: 52, parentsSuite: 60, ensuiteBathroom: 40, livingRoom: 75, masterBedroom: 45, balcony: 40, eventNote: 'Dining completed, TV recreation' },
  { hour: '21:00', displayTime: '9:00 PM', totalAverage: 40, parentsSuite: 68, ensuiteBathroom: 52, livingRoom: 35, masterBedroom: 30, balcony: 15, eventNote: 'Bedtime prep, en-suite routine' },
  { hour: '22:00', displayTime: '10:00 PM', totalAverage: 24, parentsSuite: 42, ensuiteBathroom: 28, livingRoom: 18, masterBedroom: 26, balcony: 6, eventNote: 'Lights dimmed, reading in suite' },
  { hour: '23:00', displayTime: '11:00 PM', totalAverage: 12, parentsSuite: 18, ensuiteBathroom: 8, livingRoom: 8, masterBedroom: 20, balcony: 4, eventNote: 'Night stillness initiated' },
  { hour: '00:00', displayTime: '12:00 AM', totalAverage: 8, parentsSuite: 12, ensuiteBathroom: 5, livingRoom: 5, masterBedroom: 14, balcony: 4, eventNote: 'Resting respiratory baseline' },
  { hour: '01:00', displayTime: '1:00 AM', totalAverage: 6, parentsSuite: 8, ensuiteBathroom: 4, livingRoom: 4, masterBedroom: 10, balcony: 4, eventNote: 'Deep sleep phase' },
  { hour: '02:00', displayTime: '2:00 AM', totalAverage: 15, parentsSuite: 28, ensuiteBathroom: 36, livingRoom: 5, masterBedroom: 4, balcony: 2, eventNote: 'En-suite visit (safe transit)' },
  { hour: '03:00', displayTime: '3:00 AM', totalAverage: 7, parentsSuite: 10, ensuiteBathroom: 5, livingRoom: 4, masterBedroom: 12, balcony: 4, eventNote: 'Deep sleep phase' },
  { hour: '04:00', displayTime: '4:00 AM', totalAverage: 6, parentsSuite: 9, ensuiteBathroom: 4, livingRoom: 4, masterBedroom: 10, balcony: 3, eventNote: 'Deep sleep phase' },
  { hour: '05:00', displayTime: '5:00 AM', totalAverage: 10, parentsSuite: 16, ensuiteBathroom: 12, livingRoom: 6, masterBedroom: 12, balcony: 4, eventNote: 'Early morning posture shift' },
  { hour: '06:00', displayTime: '6:00 AM', totalAverage: 35, parentsSuite: 48, ensuiteBathroom: 58, livingRoom: 24, masterBedroom: 30, balcony: 15, eventNote: 'Morning wake-up & prayer' },
  { hour: '07:00', displayTime: '7:00 AM', totalAverage: 62, parentsSuite: 60, ensuiteBathroom: 45, livingRoom: 88, masterBedroom: 55, balcony: 52, eventNote: 'Kitchen & breakfast prep' },
  { hour: '08:00', displayTime: '8:00 AM', totalAverage: 78, parentsSuite: 72, ensuiteBathroom: 50, livingRoom: 95, masterBedroom: 75, balcony: 98, eventNote: 'Peak morning ambulatory movement' },
  { hour: '09:00', displayTime: '9:00 AM', totalAverage: 65, parentsSuite: 62, ensuiteBathroom: 35, livingRoom: 86, masterBedroom: 60, balcony: 82, eventNote: 'Work from home & domestic care' },
  { hour: '10:00', displayTime: '10:00 AM', totalAverage: 48, parentsSuite: 45, ensuiteBathroom: 22, livingRoom: 70, masterBedroom: 55, balcony: 48, eventNote: 'Mid-morning seated tasks' },
  { hour: '11:00', displayTime: '11:00 AM', totalAverage: 42, parentsSuite: 40, ensuiteBathroom: 20, livingRoom: 64, masterBedroom: 48, balcony: 38, eventNote: 'Steady indoor presence' },
  { hour: '12:00', displayTime: '12:00 PM', totalAverage: 54, parentsSuite: 48, ensuiteBathroom: 26, livingRoom: 82, masterBedroom: 52, balcony: 62, eventNote: 'Lunchtime movement' },
  { hour: '13:00', displayTime: '1:00 PM', totalAverage: 44, parentsSuite: 52, ensuiteBathroom: 24, livingRoom: 60, masterBedroom: 45, balcony: 39, eventNote: 'Dining completed' },
  { hour: '14:00', displayTime: '2:00 PM', totalAverage: 22, parentsSuite: 35, ensuiteBathroom: 12, livingRoom: 20, masterBedroom: 32, balcony: 11, eventNote: 'Afternoon siesta / low motion' },
  { hour: '15:00', displayTime: '3:00 PM', totalAverage: 36, parentsSuite: 42, ensuiteBathroom: 18, livingRoom: 48, masterBedroom: 36, balcony: 36, eventNote: 'Afternoon waking & tea' }
];

export const MmWaveGlobalActivityChart: React.FC<MmWaveGlobalActivityChartProps> = ({
  onClose,
  onShowToast
}) => {
  const [showRoomBreakdown, setShowRoomBreakdown] = useState<boolean>(false);
  const [timeSpan, setTimeSpan] = useState<'24h' | '12h' | '6h'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<'average' | 'all'>('average');

  // Filtered dataset according to time span
  const filteredData = useMemo(() => {
    if (timeSpan === '6h') {
      return LAST_24H_ACTIVITY_DATA.slice(-6);
    }
    if (timeSpan === '12h') {
      return LAST_24H_ACTIVITY_DATA.slice(-12);
    }
    return LAST_24H_ACTIVITY_DATA;
  }, [timeSpan]);

  // Derived statistics for summary cards
  const stats = useMemo(() => {
    const values = filteredData.map((d) => d.totalAverage);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / values.length);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const peakRecord = filteredData.find((d) => d.totalAverage === maxVal);
    const minRecord = filteredData.find((d) => d.totalAverage === minVal);

    return {
      avg,
      maxVal,
      minVal,
      peakHour: peakRecord?.displayTime || '8:00 AM',
      peakNote: peakRecord?.eventNote || 'Morning movement',
      restHour: minRecord?.displayTime || '1:00 AM',
      restNote: minRecord?.eventNote || 'Deep sleep phase'
    };
  }, [filteredData]);

  const handleExportData = () => {
    try {
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(
          JSON.stringify(
            {
              residence: 'Apartment 402 · Tower A',
              period: 'Last 24 Hours mmWave Activity Summary',
              generatedAt: new Date().toISOString(),
              stats,
              data: filteredData
            },
            null,
            2
          )
        );
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute('href', dataStr);
      dlAnchor.setAttribute(
        'download',
        `SafeHaven_Apt402_mmWave_24h_GlobalView_${timeSpan}.json`
      );
      document.body.appendChild(dlAnchor);
      dlAnchor.click();
      dlAnchor.remove();
      if (onShowToast) {
        onShowToast(
          'Exported 24-hour mmWave radar activity dataset (JSON).',
          'download'
        );
      }
    } catch {
      if (onShowToast) {
        onShowToast('Export initiated.', 'download');
      }
    }
  };

  return (
    <div
      id="mmwave-global-view-summary"
      className="w-full bg-[#ffffff] rounded-xl p-4 shadow-sm border border-[#e6e2da] flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Header bar with standardized residence pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f1ede5]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3E8F5D]/10 text-[#3E8F5D] flex items-center justify-center shrink-0 border border-[#3E8F5D]/30">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              monitoring
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-[18px] font-bold text-[#060810] leading-tight">
                Global mmWave 24-Hour Activity Profile
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-[#f1ede5] border border-[#e6e2da] text-[#060810] inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E8F5D]"></span>
                Apartment 402 · Tower A
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#3E8F5D]/10 text-[#3E8F5D] border border-[#3E8F5D]/25">
                5 Active Rooms
              </span>
            </div>
            <p className="text-[12px] text-[#46464b] mt-0.5 leading-relaxed">
              Consolidated Doppler velocity and voxel displacement indices across all ceiling 60 GHz radar nodes for the last 24 hours.
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportData}
            className="px-2.5 py-1.5 rounded-lg bg-[#f1ede5] hover:bg-[#e6e2da] text-[#060810] text-[11.5px] font-bold flex items-center gap-1.5 transition-all border border-[#e6e2da] active:scale-95 shadow-2xs"
            title="Download JSON telemetry logs"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span className="hidden sm:inline">Export</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#ece8e0] text-[#76777c] hover:text-[#060810] transition-all"
              title="Close Global View"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* 24-Hour Key Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[#f7f3eb] p-3 rounded-lg border border-[#e6e2da] flex flex-col">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#76777c]">
            24h Mean Activity
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-[22px] font-bold text-[#060810]">
              {stats.avg}%
            </span>
            <span className="text-[11px] text-[#3E8F5D] font-bold">Optimal</span>
          </div>
          <span className="text-[10px] text-[#46464b] mt-0.5">
            Balanced daytime &amp; resting cycle
          </span>
        </div>

        <div className="bg-[#f7f3eb] p-3 rounded-lg border border-[#e6e2da] flex flex-col">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#76777c]">
            Peak Surge Hour
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-[22px] font-bold text-[#060810]">
              {stats.maxVal}%
            </span>
            <span className="text-[11px] text-[#76777c] font-mono">
              @{stats.peakHour}
            </span>
          </div>
          <span className="text-[10px] text-[#46464b] mt-0.5 truncate" title={stats.peakNote}>
            {stats.peakNote}
          </span>
        </div>

        <div className="bg-[#f7f3eb] p-3 rounded-lg border border-[#e6e2da] flex flex-col">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#76777c]">
            Deep Rest Baseline
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-[22px] font-bold text-[#060810]">
              {stats.minVal}%
            </span>
            <span className="text-[11px] text-[#76777c] font-mono">
              @{stats.restHour}
            </span>
          </div>
          <span className="text-[10px] text-[#46464b] mt-0.5 truncate" title={stats.restNote}>
            Micro-respiration stable (14 bpm)
          </span>
        </div>

        <div className="bg-[#f7f3eb] p-3 rounded-lg border border-[#e6e2da] flex flex-col">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#76777c]">
            Gating Safety Margin
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-mono text-[22px] font-bold text-[#3E8F5D]">
              +14.5 dB
            </span>
            <span className="text-[11px] text-[#3E8F5D] font-bold">Zero Fall</span>
          </div>
          <span className="text-[10px] text-[#46464b] mt-0.5">
            No unconfirmed drops &gt; 88%
          </span>
        </div>
      </div>

      {/* Toolbar: Time span filter & Room Breakdown toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-lg bg-[#f7f3eb] border border-[#e6e2da]">
        {/* Time Span Tabs */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-[#46464b] mr-1.5">
            Window:
          </span>
          {(['24h', '12h', '6h'] as const).map((span) => (
            <button
              key={span}
              type="button"
              onClick={() => setTimeSpan(span)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                timeSpan === span
                  ? 'bg-[#060810] text-white shadow-2xs'
                  : 'bg-white text-[#46464b] hover:bg-[#ece8e0] border border-[#e6e2da]'
              }`}
            >
              {span === '24h'
                ? 'Full 24 Hours'
                : span === '12h'
                ? 'Last 12 Hours'
                : 'Last 6 Hours'}
            </button>
          ))}
        </div>

        {/* Breakdown Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRoomBreakdown(!showRoomBreakdown)}
            className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
              showRoomBreakdown
                ? 'bg-[#060810] text-white border-[#060810]'
                : 'bg-white text-[#060810] hover:bg-[#ece8e0] border-[#e6e2da]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {showRoomBreakdown ? 'layers' : 'layers_clear'}
            </span>
            <span>
              {showRoomBreakdown
                ? 'Showing All 5 Rooms'
                : 'Overlay Individual Rooms'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Recharts Area Chart Container */}
      <div className="w-full bg-white p-3 rounded-lg border border-[#e6e2da] shadow-2xs">
        <div className="flex items-center justify-between text-[11.5px] pb-2 text-[#46464b]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#3E8F5D]"></span>
            <span className="font-bold text-[#060810]">
              Consolidated 24-Hour Average Activity Level (%)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10.5px]">
            <span className="flex items-center gap-1 text-[#76777c]">
              <span className="w-2.5 h-0.5 bg-[#825300] inline-block"></span>
              24h Mean ({stats.avg}%)
            </span>
            <span className="flex items-center gap-1 text-[#fe5364]">
              <span className="w-2.5 h-0.5 bg-[#fe5364] inline-block"></span>
              Emergency Gate (88%)
            </span>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 12, left: -18, bottom: 0 }}
            >
              <defs>
                {/* Emerald primary gradient for Global Average */}
                <linearGradient id="globalAvgGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3E8F5D" stopOpacity={0.45} />
                  <stop offset="60%" stopColor="#3E8F5D" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3E8F5D" stopOpacity={0.01} />
                </linearGradient>

                {/* Subtle room colors if toggled */}
                <linearGradient id="livingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f2be71" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f2be71" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1ede5" vertical={false} />

              <XAxis
                dataKey="hour"
                stroke="#76777c"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#e6e2da' }}
                interval={timeSpan === '24h' ? 2 : 0}
              />

              <YAxis
                stroke="#76777c"
                fontSize={10}
                domain={[0, 100]}
                tickLine={false}
                axisLine={{ stroke: '#e6e2da' }}
                ticks={[0, 20, 40, 60, 80, 100]}
                tickFormatter={(val) => `${val}%`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as HourlyActivityRecord;
                    return (
                      <div className="bg-[#060810] text-white p-2.5 rounded-lg shadow-xl border border-[#2c303c] text-[11px] flex flex-col gap-1.5 min-w-[200px]">
                        <div className="flex items-center justify-between border-b border-[#2c303c] pb-1">
                          <span className="font-bold text-white">
                            {data.displayTime} ({data.hour})
                          </span>
                          <span className="font-mono text-[#f2be71] font-bold text-[12px]">
                            {data.totalAverage}% Avg
                          </span>
                        </div>

                        {data.eventNote && (
                          <div className="text-[10px] text-[#b0b3bf] italic">
                            &ldquo;{data.eventNote}&rdquo;
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] pt-1 text-[#858793] border-t border-[#2c303c]/60">
                          <div className="flex justify-between">
                            <span>Parents Suite:</span>
                            <span className="text-white font-mono">{data.parentsSuite}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>En-Suite Bath:</span>
                            <span className="text-white font-mono">{data.ensuiteBathroom}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Living Room:</span>
                            <span className="text-white font-mono">{data.livingRoom}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Master Bed:</span>
                            <span className="text-white font-mono">{data.masterBedroom}%</span>
                          </div>
                          <div className="flex justify-between col-span-2">
                            <span>Balcony Transit:</span>
                            <span className="text-white font-mono">{data.balcony}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Reference line for 24h Average */}
              <ReferenceLine
                y={stats.avg}
                stroke="#825300"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Mean ${stats.avg}%`,
                  position: 'right',
                  fill: '#825300',
                  fontSize: 9,
                  fontWeight: 'bold'
                }}
              />

              {/* Reference line for Fall Gate Alert */}
              <ReferenceLine
                y={88}
                stroke="#fe5364"
                strokeDasharray="3 3"
                strokeWidth={1}
                label={{
                  value: 'Gate 88%',
                  position: 'insideTopRight',
                  fill: '#fe5364',
                  fontSize: 9,
                  fontWeight: 'bold'
                }}
              />

              {/* Optional Room Breakdown Overlays */}
              {showRoomBreakdown && (
                <>
                  <Line
                    type="monotone"
                    dataKey="livingRoom"
                    name="Living Room"
                    stroke="#f2be71"
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray="2 2"
                  />
                  <Line
                    type="monotone"
                    dataKey="parentsSuite"
                    name="Parents' Suite"
                    stroke="#4361ee"
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray="2 2"
                  />
                  <Line
                    type="monotone"
                    dataKey="ensuiteBathroom"
                    name="En-Suite Bath"
                    stroke="#7209b7"
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray="2 2"
                  />
                </>
              )}

              {/* Main Consolidated 24-Hour Average Curve */}
              <Area
                type="monotone"
                dataKey="totalAverage"
                name="Total Average mmWave Activity"
                stroke="#3E8F5D"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#globalAvgGradient)"
                activeDot={{
                  r: 5,
                  fill: '#3E8F5D',
                  stroke: '#ffffff',
                  strokeWidth: 2
                }}
              />

              {showRoomBreakdown && (
                <Legend
                  wrapperStyle={{ fontSize: '10.5px', paddingTop: '8px' }}
                  iconType="circle"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Room Legend & Individual Node Health Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
        <div className="p-2 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4361ee]"></span>
            <span className="text-[11px] font-semibold text-[#060810]">
              Parents’ Suite
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#46464b] font-bold">
            Pod 01 (60GHz)
          </span>
        </div>

        <div className="p-2 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7209b7]"></span>
            <span className="text-[11px] font-semibold text-[#060810]">
              En-Suite Bath
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#46464b] font-bold">
            Pod 04 (Radar)
          </span>
        </div>

        <div className="p-2 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f2be71]"></span>
            <span className="text-[11px] font-semibold text-[#060810]">
              Living &amp; Foyer
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#46464b] font-bold">
            Hub FMCW
          </span>
        </div>

        <div className="p-2 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3a0ca3]"></span>
            <span className="text-[11px] font-semibold text-[#060810]">
              Master Bedroom
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#46464b] font-bold">
            Pod 02 (Radar)
          </span>
        </div>

        <div className="p-2 rounded-lg bg-[#f7f3eb] border border-[#e6e2da] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2a9d8f]"></span>
            <span className="text-[11px] font-semibold text-[#060810]">
              Balcony Utility
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#46464b] font-bold">
            Node 03
          </span>
        </div>
      </div>
    </div>
  );
};
