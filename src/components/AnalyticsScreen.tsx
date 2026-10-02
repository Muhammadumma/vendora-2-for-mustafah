import React, { useState } from 'react';

interface AnalyticsScreenProps {
  onShowToast: (msg: string, icon?: string, colorClass?: string) => void;
  todaySales: number;
  creditRecovery: number;
  activeDebt: number;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  onShowToast,
  todaySales,
  creditRecovery,
  activeDebt,
}) => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D'>('7D');
  const [activeTooltipDay, setActiveTooltipDay] = useState<number>(6); // 6 = Today

  const daysData = [
    { day: 'Mon', rev: 95000, debt: 50000, svgYRev: 95, svgYDebt: 50 },
    { day: 'Tue', rev: 112000, debt: 46000, svgYRev: 80, svgYDebt: 58 },
    { day: 'Wed', rev: 125000, debt: 44000, svgYRev: 65, svgYDebt: 62 },
    { day: 'Thu', rev: 118000, debt: 48000, svgYRev: 75, svgYDebt: 48 },
    { day: 'Fri', rev: 140000, debt: 45000, svgYRev: 40, svgYDebt: 52 },
    { day: 'Sat', rev: 132000, debt: 43000, svgYRev: 50, svgYDebt: 45 },
    { day: 'Today', rev: todaySales, debt: activeDebt, svgYRev: 25, svgYDebt: 40 },
  ];

  const currentPoint = daysData[activeTooltipDay];

  // Daily Cash Flow Phase 5 math
  const restockOutflow = 35000;
  const netDailyCash = todaySales + creditRecovery - restockOutflow; // ₦127,750

  const handleExportCsv = () => {
    onShowToast('CSV Ledger Export ready. Non-blocking export completed.', 'table_view', 'text-[#c0c1ff]');
  };

  const handleDownloadPdf = () => {
    onShowToast('Phase 5 Weekly PDF Summary ready. Non-blocking export completed.', 'picture_as_pdf', 'text-[#4edea3]');
  };

  const handleAutoDraftPO = () => {
    onShowToast('Auto-Draft Purchase Order (₦64,000) created for Peak Milk & Indomie!', 'auto_fix_high', 'text-[#ffb95f]');
  };

  const handleBundleAction = () => {
    onShowToast('Special discount bundle promo created for Canned Sardines (Titus)', 'high_res', 'text-[#c0c1ff]');
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-20 max-w-2xl mx-auto space-y-3.5 select-none">
      {/* Command Center Header & Scope Switcher */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-lg bg-[#c0c1ff]/10 text-[#c0c1ff]">
              <span className="material-symbols-outlined text-[18px]">neurology</span>
            </span>
            <span className="font-['Manrope'] font-semibold text-[16px] text-[#dfe2ee]">
              Predictive Command Center
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="font-['Hanken_Grotesk'] text-[10px] tracking-wider uppercase font-bold">
              Phase 5 Engine
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <button
            className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-[#262a33] text-[#dfe2ee] hover:bg-[#353942] transition-all shadow-sm border border-[#31353e]"
            type="button"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">storefront</span>
              <span className="font-['Hanken_Grotesk'] text-[12px] font-semibold truncate">
                All Products (Store Overview)
              </span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#908fa0]">unfold_more</span>
          </button>

          <div className="flex items-center gap-1 bg-[#262a33] p-1 rounded-xl border border-[#31353e]">
            <button
              onClick={() => setTimeRange('7D')}
              className={`px-2.5 py-1 rounded-lg font-['Hanken_Grotesk'] text-[11px] font-bold transition-colors ${
                timeRange === '7D'
                  ? 'bg-[#353942] text-[#dfe2ee] shadow'
                  : 'text-[#c7c4d7] hover:text-[#dfe2ee]'
              }`}
              type="button"
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange('30D')}
              className={`px-2.5 py-1 rounded-lg font-['Hanken_Grotesk'] text-[11px] font-bold transition-colors ${
                timeRange === '30D'
                  ? 'bg-[#353942] text-[#dfe2ee] shadow'
                  : 'text-[#c7c4d7] hover:text-[#dfe2ee]'
              }`}
              type="button"
            >
              30D
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Performance Metrics Trio */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="flex flex-col p-2.5 rounded-xl bg-[#262a33] border border-[#31353e] shadow-sm">
          <div className="flex items-center gap-1 text-[#c7c4d7] mb-1">
            <span className="material-symbols-outlined text-[14px] text-[#4edea3]">payments</span>
            <span className="font-['Hanken_Grotesk'] text-[10px] truncate uppercase tracking-wider font-semibold">
              Weekly Rev
            </span>
          </div>
          <span className="font-['Manrope'] font-bold text-[15px] text-[#dfe2ee] truncate tracking-tight">
            ₦984,200
          </span>
          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#4edea3] mt-0.5 flex items-center gap-0.5 font-bold">
            <span className="material-symbols-outlined text-[12px]">trending_up</span>+14.8%
          </span>
        </div>

        <div className="flex flex-col p-2.5 rounded-xl bg-[#262a33] border border-[#31353e] shadow-sm">
          <div className="flex items-center gap-1 text-[#c7c4d7] mb-1">
            <span className="material-symbols-outlined text-[14px] text-[#c0c1ff]">receipt_long</span>
            <span className="font-['Hanken_Grotesk'] text-[10px] truncate uppercase tracking-wider font-semibold">
              Trans.
            </span>
          </div>
          <span className="font-['Manrope'] font-bold text-[15px] text-[#dfe2ee] truncate">
            412
          </span>
          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0] mt-0.5">
            58/day avg
          </span>
        </div>

        <div className="flex flex-col p-2.5 rounded-xl bg-[#262a33] border border-[#31353e] shadow-sm">
          <div className="flex items-center gap-1 text-[#c7c4d7] mb-1">
            <span className="material-symbols-outlined text-[14px] text-[#ffb95f]">inventory</span>
            <span className="font-['Hanken_Grotesk'] text-[10px] truncate uppercase tracking-wider font-semibold">
              Units Sold
            </span>
          </div>
          <span className="font-['Manrope'] font-bold text-[15px] text-[#dfe2ee] truncate">
            1,840
          </span>
          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#c0c1ff] mt-0.5 flex items-center gap-0.5 font-bold">
            <span className="material-symbols-outlined text-[12px]">bolt</span>High Vol
          </span>
        </div>
      </div>

      {/* Predictive Stock Forecast Alert Card */}
      <div className="relative overflow-hidden p-3.5 rounded-xl bg-[#262a33] border border-[#ffb95f]/30 shadow-md">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#ffb95f]/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-start gap-2.5 relative z-10">
          <div className="p-2 rounded-xl bg-[#ca8100]/30 text-[#ffb95f] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#ffb95f] uppercase tracking-wider font-bold">
                Predictive Stock Forecast
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#ffb95f]/20 text-[#ffb95f] font-['Hanken_Grotesk'] text-[10px] font-bold">
                4d runout
              </span>
            </div>
            <p className="font-['Hanken_Grotesk'] text-[13px] text-[#dfe2ee] mt-1 leading-snug">
              Projected Stockout in 4 days:{' '}
              <span className="font-semibold text-[#dfe2ee]">Peak Milk</span> &amp;{' '}
              <span className="font-semibold text-[#dfe2ee]">Indomie noodles</span>.
            </p>
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#c7c4d7]">
                Recommended PO:{' '}
                <span className="font-bold text-[#4edea3]">₦64,000</span>
              </span>
              <button
                onClick={handleAutoDraftPO}
                className="px-3 py-1 rounded-lg bg-[#353942] hover:bg-[#31353e] text-[#c0c1ff] font-['Hanken_Grotesk'] text-[11px] font-semibold flex items-center gap-1 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                Auto-Draft PO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Chart Card (7-Day Trend: Revenue vs Active Debt) */}
      <div className="flex flex-col p-3.5 rounded-xl bg-[#262a33] border border-[#31353e] shadow-md">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <h3 className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">
              Financial Health &amp; Debt Curve
            </h3>
            <p className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">
              Daily Revenue vs Active Debt Stability Ratio
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#353942] text-[#4edea3] font-['Hanken_Grotesk'] text-[10px] font-bold">
            30% Cap: Safe (18.4%)
          </span>
        </div>

        {/* Chart Legends */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-[#4edea3]"></span>
            <span className="font-['Hanken_Grotesk'] text-[#c7c4d7]">Daily Revenue (Cash + Repayments)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-[#ffb4ab]"></span>
            <span className="font-['Hanken_Grotesk'] text-[#ffb4ab]">Unpaid Customer Debt (Red Dashed)</span>
          </div>
        </div>

        {/* Interactive SVG Visualization Container */}
        <div className="relative w-full h-44 mt-1">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 340 140">
            <defs>
              <linearGradient id="emeraldGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4edea3" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line stroke="#31353e" strokeDasharray="3,3" strokeWidth="0.8" x1="0" x2="340" y1="20" y2="20" />
            <line stroke="#31353e" strokeDasharray="3,3" strokeWidth="0.8" x1="0" x2="340" y1="60" y2="60" />
            <line stroke="#31353e" strokeDasharray="3,3" strokeWidth="0.8" x1="0" x2="340" y1="100" y2="100" />
            <line stroke="#464554" strokeWidth="1" x1="0" x2="340" y1="130" y2="130" />

            {/* Area Fill for Revenue */}
            <polygon
              fill="url(#emeraldGrad)"
              points="0,95 56,80 112,65 168,75 224,40 280,50 336,25 336,130 0,130"
            />

            {/* Solid Emerald Line: Daily Revenue */}
            <polyline
              fill="none"
              points="0,95 56,80 112,65 168,75 224,40 280,50 336,25"
              stroke="#4edea3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />

            {/* Red Dashed Line: Active Debt */}
            <polyline
              fill="none"
              points="0,50 56,58 112,62 168,48 224,52 280,45 336,40"
              stroke="#ffb4ab"
              strokeDasharray="4,4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />

            {/* Interactive Data Point Circles */}
            {daysData.map((d, idx) => {
              const cx = idx * 56;
              const isSelected = activeTooltipDay === idx;
              return (
                <g key={d.day} onClick={() => setActiveTooltipDay(idx)} className="cursor-pointer">
                  <circle
                    cx={cx}
                    cy={d.svgYRev}
                    r={isSelected ? 5 : 3.5}
                    fill="#4edea3"
                    stroke={isSelected ? '#0f131c' : 'none'}
                    strokeWidth={isSelected ? 1.5 : 0}
                  />
                  <circle
                    cx={cx}
                    cy={d.svgYDebt}
                    r={isSelected ? 4 : 2.5}
                    fill="#ffb4ab"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Display Marker */}
          <div
            className="absolute top-0 bg-[#31353e] px-2.5 py-1 rounded-md shadow-lg border border-[#464554] pointer-events-none transition-all duration-200"
            style={{
              right: activeTooltipDay === 6 ? 0 : undefined,
              left: activeTooltipDay < 6 ? `${activeTooltipDay * 14}%` : undefined,
            }}
          >
            <span className="font-['Hanken_Grotesk'] text-[11px] text-[#4edea3] font-bold">
              ₦{currentPoint.rev.toLocaleString()}
            </span>
            <span className="font-['Hanken_Grotesk'] text-[11px] text-[#ffb4ab] ml-1.5">
              (₦{currentPoint.debt.toLocaleString()} Debt)
            </span>
          </div>
        </div>

        {/* Day X-Axis Labels */}
        <div className="flex justify-between items-center text-[#908fa0] font-['Hanken_Grotesk'] text-[11px] pt-2">
          {daysData.map((d, idx) => (
            <button
              key={d.day}
              onClick={() => setActiveTooltipDay(idx)}
              className={`${
                activeTooltipDay === idx
                  ? 'text-[#4edea3] font-bold underline'
                  : 'hover:text-[#dfe2ee]'
              }`}
            >
              {d.day}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Cash Flow Breakdown Card (Phase 5 Math Formulation) */}
      <div className="flex flex-col p-3.5 rounded-xl bg-[#262a33] border border-[#31353e] shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded bg-[#4edea3]/10 text-[#4edea3]">
              <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            </span>
            <h3 className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">
              Daily Cash Flow Breakdown
            </h3>
          </div>
          <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">Live Closing</span>
        </div>

        <div className="flex flex-col space-y-1.5 pt-1">
          {/* Gross Sales */}
          <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#1c2028] border border-[#31353e]/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#908fa0]"></span>
              <span className="font-['Hanken_Grotesk'] text-[13px] text-[#dfe2ee]">Gross Sales (Retail/POS)</span>
            </div>
            <span className="font-['Hanken_Grotesk'] font-bold text-[13px] text-[#dfe2ee]">
              ₦{todaySales.toLocaleString()}
            </span>
          </div>

          {/* Debt Repayments Collected */}
          <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#1c2028] border border-[#31353e]/40">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-[#4edea3]">add_circle</span>
              <div className="flex flex-col">
                <span className="font-['Hanken_Grotesk'] text-[13px] text-[#4edea3] font-semibold truncate">
                  Debt Repayments Collected
                </span>
                <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0]">Settled cash-in today</span>
              </div>
            </div>
            <span className="font-['Hanken_Grotesk'] font-bold text-[13px] text-[#4edea3]">
              +₦{creditRecovery.toLocaleString()}
            </span>
          </div>

          {/* Cash Purchases / Supplier Restock */}
          <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#1c2028] border border-[#31353e]/40">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-[#ffb95f]">remove_circle</span>
              <div className="flex flex-col">
                <span className="font-['Hanken_Grotesk'] text-[13px] text-[#c7c4d7] truncate">
                  Cash Purchases / Supplier Restock
                </span>
                <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0]">Direct operational outflow</span>
              </div>
            </div>
            <span className="font-['Hanken_Grotesk'] font-bold text-[13px] text-[#ffb95f]">
              -₦{restockOutflow.toLocaleString()}
            </span>
          </div>

          {/* Net Daily Cash In-Hand Highlight */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#00a572]/20 border border-[#4edea3]/40 mt-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#4edea3] text-[#003824]">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </span>
              <div className="flex flex-col">
                <span className="font-['Hanken_Grotesk'] text-[12px] text-[#4edea3] font-bold">
                  Net Daily Cash In-Hand
                </span>
                <span className="font-['Hanken_Grotesk'] text-[10px] text-[#c7c4d7]">Physical ledger reconciliation</span>
              </div>
            </div>
            <span className="font-['Manrope'] text-[20px] text-[#4edea3] font-bold tracking-tight">
              ₦{netDailyCash.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Fast Movers vs Dead Stock Insights Mosaic */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">
            Product Velocity &amp; Movement
          </h3>
          <span className="font-['Hanken_Grotesk'] text-[11px] text-[#c0c1ff]">Store.js Diagnostics</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Fast Moving Stock Card */}
          <div className="flex flex-col p-3.5 rounded-xl bg-[#262a33] border border-[#31353e] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded bg-[#4edea3]/15 text-[#4edea3]">
                  <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                </span>
                <span className="font-['Hanken_Grotesk'] text-[11px] text-[#4edea3] uppercase tracking-wider font-bold">
                  Fast Moving SKUs
                </span>
              </div>
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">High Turn Velocity</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1c2028] border border-[#31353e]/40">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#353942] flex items-center justify-center text-[#c0c1ff] flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">ramen_dining</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#dfe2ee] truncate">
                      Indomie Instant Noodles
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">Runout: ~3.8 days</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-['Hanken_Grotesk'] text-[13px] text-[#4edea3] font-bold block">98 packs</span>
                  <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0]">/ week</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#1c2028] border border-[#31353e]/40">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#353942] flex items-center justify-center text-[#4edea3] flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">grain</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#dfe2ee] truncate">
                      Dangote Sugar 1kg
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">Runout: ~5.1 days</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-['Hanken_Grotesk'] text-[13px] text-[#4edea3] font-bold block">64 units</span>
                  <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0]">/ week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slow Moving / Dead Stock Alert Card */}
          <div className="flex flex-col p-3.5 rounded-xl bg-[#262a33] border border-[#31353e] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded bg-[#ffb4ab]/15 text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-[16px]">hourglass_disabled</span>
                </span>
                <span className="font-['Hanken_Grotesk'] text-[11px] text-[#ffb4ab] uppercase tracking-wider font-bold">
                  Slow Moving &amp; Dead Stock
                </span>
              </div>
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#ffb4ab] font-semibold">Capital Trapped</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-[#1c2028] border border-[#31353e]/40">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#353942] flex items-center justify-center text-[#ffb4ab] flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">set_meal</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#dfe2ee] truncate">
                    Canned Sardines (Titus)
                  </span>
                  <span className="font-['Hanken_Grotesk'] text-[11px] text-[#ffb4ab]">Only 2 units in past 14 days</span>
                </div>
              </div>

              <button
                onClick={handleBundleAction}
                className="px-2.5 py-1 rounded bg-[#353942] hover:bg-[#31353e] text-[#dfe2ee] font-['Hanken_Grotesk'] text-[11px] font-semibold flex items-center gap-1 flex-shrink-0 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">high_res</span>
                Bundle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Action Bar (Phase 5 Reporting Pipeline) */}
      <div className="pt-1 pb-6 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] font-['Hanken_Grotesk'] text-[12px] font-bold transition-all active:scale-[0.98] shadow-sm border border-[#31353e]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#c0c1ff]">table_view</span>
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] font-['Hanken_Grotesk'] text-[12px] font-bold transition-all active:scale-[0.98] shadow-sm border border-[#31353e]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#4edea3]">picture_as_pdf</span>
            <span>Weekly PDF Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
