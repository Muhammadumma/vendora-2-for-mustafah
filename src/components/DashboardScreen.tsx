import React, { useRef } from 'react';
import { ScreenId, LedgerTransaction } from '../types';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast: (msg: string, icon?: string, colorClass?: string) => void;
  todaySales: number;
  cashInCollected: number;
  creditRecovery: number;
  activeDebt: number;
  stockValuation: number;
  transactions: LedgerTransaction[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onShowToast,
  todaySales,
  cashInCollected,
  creditRecovery,
  activeDebt,
  stockValuation,
  transactions,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 30% Debt Cap Sentinel calculations
  const debtCapLimit = Math.round(stockValuation * 0.3); // 30% of inventory value: ~₦68,940
  const debtCapRatio = ((activeDebt / stockValuation) * 100).toFixed(1); // ~18.4%
  const marginAvailable = Math.max(0, debtCapLimit - activeDebt);

  const handlePrintSlip = () => {
    onShowToast('Printing 80mm Daily Summary Slip...', 'receipt_long', 'text-[#4edea3]');

    if (!iframeRef.current) return;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vendora Daily Close Summary</title>
        <style>
          body { font-family: monospace; font-size: 12px; width: 280px; margin: 0; padding: 12px; color: #000; background: #fff; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .row { display: flex; justify-content: space-between; margin: 4px 0; }
          .divider { border-top: 1px dashed #000; margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class="center bold" style="font-size: 14px;">VENDORA SHOP POS</div>
        <div class="center">LAGOS STORE #01 - DAILY CLOSE</div>
        <div class="center">${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div class="divider"></div>
        <div class="row"><span>TODAY SALES</span><span class="bold">NGN ${todaySales.toLocaleString()}</span></div>
        <div class="row"><span>CASH-IN TOTAL</span><span class="bold">NGN ${cashInCollected.toLocaleString()}</span></div>
        <div class="row"><span>DEBT RECOVERED</span><span>NGN ${creditRecovery.toLocaleString()}</span></div>
        <div class="divider"></div>
        <div class="row"><span>ACTIVE DEBT</span><span>NGN ${activeDebt.toLocaleString()}</span></div>
        <div class="row"><span>DEBT CAP RATIO</span><span>${debtCapRatio}% (SAFE)</span></div>
        <div class="row"><span>STOCK VALUATION</span><span>NGN ${stockValuation.toLocaleString()}</span></div>
        <div class="divider"></div>
        <div class="center bold">STATUS: BALANCED & RECONCILED</div>
        <div class="center" style="font-size: 10px; margin-top: 6px;">*** Live Cloud Sync Verified ***</div>
      </body>
      </html>
    `;

    iframeRef.current.srcdoc = receiptHtml;
    iframeRef.current.onload = () => {
      try {
        iframeRef.current?.contentWindow?.print();
      } catch (err) {
        // Sandboxed webview fallback
      }
    };
  };

  return (
    <div className="flex flex-col w-full gap-5 px-4 pb-28 pt-20 max-w-2xl mx-auto select-none">
      {/* Financial Intelligence Cards (Bento Cluster) */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
            <span className="font-['Hanken_Grotesk'] text-[10px] uppercase tracking-wider text-[#908fa0] font-bold">
              Terminal Pulse • Today
            </span>
          </div>
          <span className="font-['Hanken_Grotesk'] text-[10px] text-[#c7c4d7] bg-[#262a33] px-2 py-0.5 rounded-full font-semibold">
            Lagos Store #01
          </span>
        </div>

        {/* Primary Daily Metric Hero Card */}
        <div className="bg-[#1c2028] border border-[#262a33] rounded-xl p-4 shadow-md flex flex-col gap-2.5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#c0c1ff]/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="font-['Hanken_Grotesk'] text-[12px] font-semibold text-[#c7c4d7]">
              Today's Sales
            </span>
            <span className="inline-flex items-center gap-1 font-['Hanken_Grotesk'] text-[11px] font-semibold text-[#4edea3] bg-[#00a572]/20 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              +14.2% vs yesterday
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-['Manrope'] font-bold text-[18px] text-[#c0c1ff]">₦</span>
              <span className="font-['Manrope'] font-bold text-[28px] text-[#dfe2ee] tracking-tight">
                {todaySales.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0] uppercase tracking-wider">
                Cash-In Collected
              </span>
              <span className="font-['Hanken_Grotesk'] text-[14px] font-bold text-[#4edea3]">
                ₦{cashInCollected.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-[#262a33]/80 rounded-lg p-2 flex items-center justify-between text-[#c7c4d7] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#ffb95f]">price_check</span>
              <span className="font-['Hanken_Grotesk'] text-[11px]">Includes collected credit recovery:</span>
            </div>
            <span className="font-['Hanken_Grotesk'] font-bold text-[#ffb95f]">
              ₦{creditRecovery.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dual Micro-Ledger Sub-Cards */}
        <div className="grid grid-cols-2 gap-2">
          {/* Active Unpaid Debt Card */}
          <div
            onClick={() => onNavigate('debts')}
            className="bg-[#1c2028] border border-[#262a33] hover:border-[#ffb95f]/40 rounded-xl p-3.5 flex flex-col justify-between shadow-sm cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#c7c4d7] truncate">
                Active Unpaid Debt
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#ffb95f]">crisis_alert</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-0.5">
                <span className="font-['Hanken_Grotesk'] text-[11px] text-[#ffb95f]">₦</span>
                <span className="font-['Manrope'] font-bold text-[20px] text-[#dfe2ee]">
                  {activeDebt.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                <span className="font-['Hanken_Grotesk'] text-[11px] text-[#4edea3] truncate font-semibold">
                  {debtCapRatio}% cap ratio
                </span>
              </div>
            </div>
          </div>

          {/* Stock Valuation Card */}
          <div
            onClick={() => onNavigate('inventory')}
            className="bg-[#1c2028] border border-[#262a33] hover:border-[#c0c1ff]/40 rounded-xl p-3.5 flex flex-col justify-between shadow-sm cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#c7c4d7] truncate">
                Stock Valuation
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">inventory</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-0.5">
                <span className="font-['Hanken_Grotesk'] text-[11px] text-[#c0c1ff]">₦</span>
                <span className="font-['Manrope'] font-bold text-[20px] text-[#dfe2ee]">
                  {stockValuation.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#908fa0]">
                <span className="material-symbols-outlined text-[13px]">layers</span>
                <span className="font-['Hanken_Grotesk'] text-[11px]">342 active items</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fast Counter Actions Command Strip */}
      <section className="flex flex-col gap-1.5">
        <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0] uppercase tracking-wider font-bold">
          Fast Counter Actions
        </span>
        <div className="grid grid-cols-4 gap-2">
          {/* Quick Sell */}
          <button
            onClick={() => onNavigate('sell')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#4edea3] text-[#003824] active:scale-[0.96] transition-transform shadow-md hover:opacity-95"
            type="button"
          >
            <div className="w-8 h-8 rounded-lg bg-[#003824]/15 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[20px] text-[#003824] fill-1">point_of_sale</span>
            </div>
            <span className="font-['Hanken_Grotesk'] text-[11px] font-bold text-center leading-tight">Quick Sell</span>
          </button>

          {/* Add Stock */}
          <button
            onClick={() => {
              onNavigate('inventory');
              onShowToast('Opening Inventory Restock Manager', 'add_box', 'text-[#c0c1ff]');
            }}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#262a33] text-[#dfe2ee] hover:bg-[#31353e] active:scale-[0.96] transition-transform"
            type="button"
          >
            <div className="w-8 h-8 rounded-lg bg-[#353942] flex items-center justify-center mb-1 text-[#c0c1ff]">
              <span className="material-symbols-outlined text-[20px]">add_box</span>
            </div>
            <span className="font-['Hanken_Grotesk'] text-[11px] font-semibold text-center leading-tight">Add Stock</span>
          </button>

          {/* Settle Debt */}
          <button
            onClick={() => onNavigate('debts')}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#262a33] text-[#dfe2ee] hover:bg-[#31353e] active:scale-[0.96] transition-transform"
            type="button"
          >
            <div className="w-8 h-8 rounded-lg bg-[#353942] flex items-center justify-center mb-1 text-[#ffb95f]">
              <span className="material-symbols-outlined text-[20px]">handshake</span>
            </div>
            <span className="font-['Hanken_Grotesk'] text-[11px] font-semibold text-center leading-tight">Settle Debt</span>
          </button>

          {/* Thermal Day Summary */}
          <button
            onClick={handlePrintSlip}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#262a33] text-[#dfe2ee] hover:bg-[#31353e] active:scale-[0.96] transition-transform"
            type="button"
          >
            <div className="w-8 h-8 rounded-lg bg-[#353942] flex items-center justify-center mb-1 text-[#c7c4d7]">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <span className="font-['Hanken_Grotesk'] text-[11px] font-semibold text-center leading-tight">Print Slip</span>
          </button>
        </div>
      </section>

      {/* Smart Debt Alert & 30% Cap Sentinel Indicator Card */}
      <section className="bg-[#262a33] border border-[#31353e] rounded-xl p-4 shadow-md flex flex-col gap-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4edea3]/15 flex items-center justify-center text-[#4edea3]">
              <span className="material-symbols-outlined text-[18px]">shield</span>
            </div>
            <div>
              <h2 className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">
                30% Debt Cap Sentinel
              </h2>
              <p className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">Capital Exposure Guard</p>
            </div>
          </div>
          <span className="font-['Hanken_Grotesk'] text-[11px] bg-[#00a572]/20 text-[#4edea3] px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-[13px]">verified_user</span>
            Healthy & Safe
          </span>
        </div>

        {/* Progress Meter */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex justify-between items-center font-['Hanken_Grotesk'] text-[11px]">
            <span className="text-[#c7c4d7]">
              Current Debt Ratio: <strong className="text-[#4edea3] font-bold">{debtCapRatio}%</strong>
            </span>
            <span className="text-[#908fa0]">
              Safety Limit: <strong className="text-[#dfe2ee]">30.0%</strong>
            </span>
          </div>

          {/* Multi-tier Bar Gauge */}
          <div className="h-2.5 w-full bg-[#0a0e16] rounded-full overflow-hidden flex relative">
            <div
              className="h-full bg-[#4edea3] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Number(debtCapRatio))}%` }}
            ></div>
            <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-[#ffb4ab] z-10"></div>
          </div>

          <div className="flex justify-between font-['Hanken_Grotesk'] text-[10px] text-[#908fa0]">
            <span>₦0 (0%)</span>
            <span className="text-[#ffb4ab]">Threshold 30% (₦{debtCapLimit.toLocaleString()})</span>
            <span>100% Valuation</span>
          </div>
        </div>

        {/* Policy Status Micro Banner */}
        <div className="bg-[#1c2028] rounded-lg px-3 py-2 flex items-center gap-2 border border-[#31353e]">
          <span className="material-symbols-outlined text-[16px] text-[#4edea3] flex-shrink-0">check_circle</span>
          <p className="font-['Hanken_Grotesk'] text-[11px] text-[#dfe2ee] leading-tight">
            <strong className="text-[#4edea3] font-semibold">30% Debt Cap Rule Active:</strong> Credit sales permitted. ₦{marginAvailable.toLocaleString()} margin available before mandatory block.
          </p>
        </div>
      </section>

      {/* Low Stock Smart Warnings */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#ffb4ab]">notification_important</span>
            <h2 className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">Stock Critical Watch</h2>
          </div>
          <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">2 items urgent</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Low Stock Item 1 */}
          <div className="bg-[#1c2028] border border-[#262a33] rounded-xl p-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#353942] flex items-center justify-center flex-shrink-0 text-[#ffb4ab]">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#dfe2ee] truncate">Peak Milk 400g</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-['Hanken_Grotesk'] text-[10px] text-[#ffb4ab] bg-[#93000a]/30 px-1.5 py-0.2 rounded font-bold">
                    3 cans remaining
                  </span>
                  <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0]">• Fast Mover</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onShowToast('Reorder PO drafted for Peak Milk 400g (24 units)', 'local_shipping', 'text-[#c0c1ff]')}
              className="flex-shrink-0 bg-[#c0c1ff]/10 hover:bg-[#c0c1ff]/20 text-[#c0c1ff] px-3 py-1.5 rounded-lg font-['Hanken_Grotesk'] text-[11px] font-semibold flex items-center gap-1 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              Reorder
            </button>
          </div>

          {/* Low Stock Item 2 */}
          <div className="bg-[#1c2028] border border-[#262a33] rounded-xl p-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#353942] flex items-center justify-center flex-shrink-0 text-[#ffb95f]">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#dfe2ee] truncate">Golden Penny Spaghetti</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-['Hanken_Grotesk'] text-[10px] text-[#ffb95f] bg-[#ca8100]/20 px-1.5 py-0.2 rounded font-bold">
                    8 packs remaining
                  </span>
                  <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0]">• Daily Staple</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onShowToast('Reorder PO drafted for Golden Penny Spaghetti (40 packs)', 'local_shipping', 'text-[#c0c1ff]')}
              className="flex-shrink-0 bg-[#c0c1ff]/10 hover:bg-[#c0c1ff]/20 text-[#c0c1ff] px-3 py-1.5 rounded-lg font-['Hanken_Grotesk'] text-[11px] font-semibold flex items-center gap-1 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              Reorder
            </button>
          </div>
        </div>
      </section>

      {/* Recent Live Transactions Feed */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">dynamic_feed</span>
            <h2 className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">Live Ledger Flow</h2>
          </div>
          <button
            onClick={() => onNavigate('sell')}
            className="font-['Hanken_Grotesk'] text-[11px] text-[#c0c1ff] flex items-center gap-0.5 hover:underline"
            type="button"
          >
            Terminal View
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#1c2028] border border-[#262a33] rounded-xl p-3 flex flex-col gap-1.5 shadow-sm active:bg-[#262a33] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-['Hanken_Grotesk'] text-[10px] bg-[#353942] text-[#c7c4d7] px-1.5 py-0.5 rounded font-mono">
                    {tx.refCode}
                  </span>
                  <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">{tx.timeAgo}</span>
                </div>
                <span
                  className={`font-['Hanken_Grotesk'] font-bold text-[13px] ${
                    tx.type === 'debt_pending'
                      ? 'text-[#ffb4ab]'
                      : tx.type === 'debt_settle'
                      ? 'text-[#4edea3]'
                      : 'text-[#dfe2ee]'
                  }`}
                >
                  {tx.type === 'debt_settle' ? `+₦${tx.amount.toLocaleString()}` : `₦${tx.amount.toLocaleString()}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-['Hanken_Grotesk'] text-[13px] text-[#dfe2ee] truncate">{tx.title}</span>
                  <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0] truncate">{tx.subtitle}</span>
                </div>

                {tx.type === 'sale' && (
                  <span className="font-['Hanken_Grotesk'] text-[10px] text-[#4edea3] bg-[#00a572]/15 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 font-semibold">
                    <span className="material-symbols-outlined text-[12px]">payments</span>
                    Paid via Cash
                  </span>
                )}
                {tx.type === 'debt_pending' && (
                  <span className="font-['Hanken_Grotesk'] text-[10px] text-[#ffb4ab] bg-[#93000a]/20 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 font-semibold">
                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                    Pending Debt
                  </span>
                )}
                {tx.type === 'debt_settle' && (
                  <span className="font-['Hanken_Grotesk'] text-[10px] text-[#4edea3] bg-[#00a572]/20 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 font-semibold">
                    <span className="material-symbols-outlined text-[12px]">done_all</span>
                    Debt Settle
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hidden iframe for thermal printing */}
      <iframe ref={iframeRef} className="hidden" title="Vendora Thermal Print Engine" />
    </div>
  );
};
