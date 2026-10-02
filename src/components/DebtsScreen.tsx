import React, { useState } from 'react';
import { CustomerDebt } from '../types';

interface DebtsScreenProps {
  debts: CustomerDebt[];
  activeDebt: number;
  stockValuation: number;
  settledToday: number;
  onSettleDebt: (debtId: string, amount: number, paymentChannel: 'cash' | 'transfer') => void;
  onShowToast: (msg: string, icon?: string, colorClass?: string) => void;
}

export const DebtsScreen: React.FC<DebtsScreenProps> = ({
  debts,
  activeDebt,
  stockValuation,
  settledToday,
  onSettleDebt,
  onShowToast,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'overdue' | 'settled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDebtForModal, setSelectedDebtForModal] = useState<CustomerDebt | null>(null);
  const [modalAmount, setModalAmount] = useState<number>(0);
  const [paymentChannel, setPaymentChannel] = useState<'cash' | 'transfer'>('cash');

  const storeDebtCap = Math.round(stockValuation * 0.3); // ₦68,940
  const capRatio = ((activeDebt / stockValuation) * 100).toFixed(1); // 18.4%
  const thresholdPercentage = Math.min(100, Math.round((activeDebt / storeDebtCap) * 100 * 10) / 10); // 61.3%

  const overdueTotal = debts
    .filter((d) => d.status === 'overdue')
    .reduce((sum, d) => sum + d.amount, 0);

  const filteredDebts = debts.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery);

    if (activeFilter === 'overdue') {
      return matchesSearch && d.status === 'overdue';
    }
    if (activeFilter === 'settled') {
      return matchesSearch && (d.status === 'settled' || (d.settledTodayAmount && d.settledTodayAmount > 0));
    }
    return matchesSearch && d.amount > 0;
  });

  const openSettlement = (debt: CustomerDebt) => {
    setSelectedDebtForModal(debt);
    setModalAmount(debt.amount);
    setPaymentChannel('cash');
  };

  const closeSettlement = () => {
    setSelectedDebtForModal(null);
  };

  const handleConfirmSettlement = () => {
    if (!selectedDebtForModal) return;
    const debt = selectedDebtForModal;
    const amt = modalAmount || debt.amount;

    onSettleDebt(debt.id, amt, paymentChannel);
    onShowToast(`₦${amt.toLocaleString()} Repayment from ${debt.name} added to Daily Cash Flow!`, 'check_circle', 'text-[#4edea3]');
    closeSettlement();
  };

  const handleSmsReminder = (debt: CustomerDebt) => {
    onShowToast(`SMS reminder queued for ${debt.name} (₦${debt.amount.toLocaleString()})`, 'sms', 'text-[#c0c1ff]');
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="flex flex-col w-full pb-28 pt-20 max-w-2xl mx-auto select-none">
      {/* Top Stat Cockpit: Safety Debt Cap (Phase 5 store.js rule) */}
      <section className="p-4 flex flex-col gap-3">
        {/* Primary Ledger Card */}
        <div className="bg-[#262a33] border border-[#31353e] rounded-xl p-4 shadow-md flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffb95f] text-[20px]">account_balance_wallet</span>
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#c7c4d7] uppercase tracking-wider font-semibold">
                Active Customer Debt
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00a572] text-[#003824] font-['Hanken_Grotesk'] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              Safe (Green)
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="font-['Manrope'] font-bold text-[28px] text-[#dfe2ee]">
                ₦{activeDebt.toLocaleString()}
              </span>
              <span className="font-['Hanken_Grotesk'] text-[12px] text-[#908fa0] ml-1.5">
                / {debts.filter((d) => d.amount > 0).length} active debtors
              </span>
            </div>
            <div className="text-right">
              <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0] block uppercase tracking-wider font-semibold">
                Store Debt Cap
              </span>
              <span className="font-['Manrope'] font-bold text-[16px] text-[#dfe2ee]">
                ₦{storeDebtCap.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Linear Safety Gauge */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="w-full bg-[#0a0e16] h-2.5 rounded-full overflow-hidden flex relative">
              <div
                className="h-full bg-[#4edea3] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, thresholdPercentage)}%` }}
              ></div>
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#ffb95f]"></div>
            </div>
            <div className="flex items-center justify-between text-[#908fa0] font-['Hanken_Grotesk'] text-[11px]">
              <span>{thresholdPercentage}% of Max Allowed Threshold</span>
              <span>{capRatio}% of ₦{(stockValuation / 1000).toFixed(1)}k Inventory Value</span>
            </div>
          </div>

          {/* System Protection Banner */}
          <div className="mt-1 p-2 rounded-lg bg-[#1c2028] flex items-start gap-2 border border-[#31353e]">
            <span className="material-symbols-outlined text-[#c0c1ff] text-[18px] flex-shrink-0 mt-0.5">
              verified_user
            </span>
            <p className="font-['Hanken_Grotesk'] text-[11px] text-[#c7c4d7] leading-tight">
              <strong className="text-[#c0c1ff] font-semibold">store.js Guardrail Active:</strong> System automatically locks POS debt checkouts if total customer balance exceeds 30% of inventory value.
            </p>
          </div>
        </div>

        {/* Quick Financial Health Trend Snapshot */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1c2028] border border-[#262a33] rounded-xl p-3 flex flex-col gap-1 shadow-sm">
            <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">Settled Today</span>
            <div className="flex items-baseline gap-1">
              <span className="font-['Manrope'] font-bold text-[18px] text-[#4edea3]">
                ₦{settledToday.toLocaleString()}
              </span>
              <span className="material-symbols-outlined text-[#4edea3] text-[16px]">trending_up</span>
            </div>
            <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">3 recovered ledgers</span>
          </div>

          <div className="bg-[#1c2028] border border-[#262a33] rounded-xl p-3 flex flex-col gap-1 shadow-sm">
            <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">Overdue (&gt;14d)</span>
            <div className="flex items-baseline gap-1">
              <span className="font-['Manrope'] font-bold text-[18px] text-[#ffb4ab]">
                ₦{overdueTotal.toLocaleString()}
              </span>
              <span className="material-symbols-outlined text-[#ffb4ab] text-[16px]">priority_high</span>
            </div>
            <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">2 delinquent flags</span>
          </div>
        </div>
      </section>

      {/* Filter & Customer Search Controls */}
      <section className="px-4 pb-2 flex flex-col gap-2">
        {/* Search Bar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#908fa0] text-[20px]">
            search
          </span>
          <input
            className="w-full h-11 pl-10 pr-10 bg-[#1c2028] border border-[#262a33] rounded-xl font-['Hanken_Grotesk'] text-[13px] text-[#dfe2ee] placeholder:text-[#908fa0] focus:outline-none focus:border-[#c0c1ff]/50 transition-colors"
            placeholder="Search customer name or phone..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#908fa0] hover:text-[#dfe2ee]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Segmented State Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[12px] flex-shrink-0 transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#c0c1ff] text-[#1000a9] font-bold'
                : 'bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] font-semibold'
            }`}
            type="button"
          >
            All Debts ({debts.filter((d) => d.amount > 0).length})
          </button>

          <button
            onClick={() => setActiveFilter('overdue')}
            className={`px-3 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[12px] flex-shrink-0 transition-colors ${
              activeFilter === 'overdue'
                ? 'bg-[#c0c1ff] text-[#1000a9] font-bold'
                : 'bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] font-semibold'
            }`}
            type="button"
          >
            Overdue &gt; 14 days (2)
          </button>

          <button
            onClick={() => setActiveFilter('settled')}
            className={`px-3 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[12px] flex-shrink-0 transition-colors ${
              activeFilter === 'settled'
                ? 'bg-[#c0c1ff] text-[#1000a9] font-bold'
                : 'bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] font-semibold'
            }`}
            type="button"
          >
            Settled Today (3)
          </button>
        </div>
      </section>

      {/* Debt Ledger Customer Stream */}
      <section className="px-4 flex flex-col gap-2.5 pb-6">
        {filteredDebts.length === 0 ? (
          <div className="py-8 text-center text-[#908fa0] font-['Hanken_Grotesk'] text-[13px]">
            No customer debts found matching current filter.
          </div>
        ) : (
          filteredDebts.map((debt) => {
            const isOverdue = debt.status === 'overdue';
            const isPartial = debt.status === 'partial';

            return (
              <div
                key={debt.id}
                className="bg-[#1c2028] border border-[#262a33] rounded-xl p-3.5 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-['Manrope'] font-bold text-[14px] flex-shrink-0 ${
                        isOverdue
                          ? 'bg-[#93000a]/40 text-[#ffb4ab]'
                          : isPartial
                          ? 'bg-[#00a572] text-[#003824]'
                          : 'bg-[#8083ff]/20 text-[#c0c1ff]'
                      }`}
                    >
                      {debt.initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee] truncate">
                          {debt.name}
                        </span>
                        {isOverdue && <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span>}
                      </div>
                      <div className="flex items-center gap-1 text-[#908fa0] font-['Hanken_Grotesk'] text-[12px]">
                        <span className="material-symbols-outlined text-[13px]">call</span>
                        <span>{debt.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`font-['Manrope'] font-bold text-[20px] block ${
                        isPartial ? 'text-[#ffb95f]' : 'text-[#dfe2ee]'
                      }`}
                    >
                      ₦{debt.amount.toLocaleString()}
                    </span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-[#31353e] text-[#c7c4d7] font-['Hanken_Grotesk'] text-[10px] font-semibold">
                      {debt.itemDescription}
                    </span>
                  </div>
                </div>

                {/* Ledger Meta Row */}
                <div className="flex items-center justify-between pt-1 text-[#908fa0] font-['Hanken_Grotesk'] text-[11px]">
                  <span className={`flex items-center gap-1 ${isOverdue ? 'text-[#ffb4ab]' : ''}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {isOverdue ? 'event_busy' : 'schedule'}
                    </span>
                    {debt.timeLabel}
                  </span>

                  {debt.isVerified && (
                    <span className="text-[#4edea3] uppercase font-bold text-[10px]">
                      Verified Debtor
                    </span>
                  )}
                  {debt.invoiceRef && (
                    <span className="text-[#908fa0] font-mono text-[11px]">
                      Ref: {debt.invoiceRef}
                    </span>
                  )}
                </div>

                {/* Partial Settlement Chip if available */}
                {debt.settledTodayAmount && (
                  <div className="p-2 rounded-lg bg-[#181c24] flex items-center justify-between border border-[#262a33]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#4edea3] text-[16px]">check_circle</span>
                      <span className="font-['Hanken_Grotesk'] text-[12px] text-[#dfe2ee]">
                        ₦{debt.settledTodayAmount.toLocaleString()} settled today
                      </span>
                    </div>
                    <span className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0]">11:30 AM (Cash Flow)</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-1">
                  {isOverdue ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openSettlement(debt)}
                        className="h-11 bg-[#4edea3] text-[#003824] rounded-xl font-['Hanken_Grotesk'] text-[12px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform shadow-md"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                        <span>Settle Debt</span>
                      </button>

                      <button
                        onClick={() => handleSmsReminder(debt)}
                        className="h-11 bg-[#262a33] text-[#c0c1ff] hover:bg-[#31353e] rounded-xl font-['Hanken_Grotesk'] text-[12px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform border border-[#31353e]"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">sms</span>
                        <span>SMS Reminder</span>
                      </button>
                    </div>
                  ) : isPartial ? (
                    <button
                      onClick={() => openSettlement(debt)}
                      className="w-full h-11 bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] rounded-xl font-['Hanken_Grotesk'] text-[13px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform border border-[#31353e]"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[#4edea3] text-[19px]">check_box</span>
                      <span>Settle Remaining ₦{debt.amount.toLocaleString()}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openSettlement(debt)}
                      className="w-full h-11 bg-[#4edea3] text-[#003824] rounded-xl font-['Hanken_Grotesk'] text-[13px] font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-transform shadow-md"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[19px]">payments</span>
                      <span>Settle Debt</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Interactive Settlement Bottom Modal Overlay */}
      {selectedDebtForModal && (
        <div className="fixed inset-0 z-50 bg-[#0f131c]/80 backdrop-blur-sm flex flex-col justify-end animate-in fade-in">
          <div className="bg-[#262a33] border-t border-[#31353e] rounded-t-2xl p-4 flex flex-col gap-3.5 max-w-md mx-auto w-full shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-['Manrope'] font-semibold text-[16px] text-[#dfe2ee]">
                  Settle: {selectedDebtForModal.name}
                </span>
                <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">
                  {selectedDebtForModal.phone} • {selectedDebtForModal.itemDescription}
                </span>
              </div>
              <button
                aria-label="Close Modal"
                onClick={closeSettlement}
                className="w-8 h-8 rounded-full bg-[#1c2028] flex items-center justify-center text-[#c7c4d7] hover:text-[#dfe2ee]"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Amount Input Container */}
            <div className="bg-[#1c2028] border border-[#31353e] rounded-xl p-3 flex flex-col gap-1">
              <label className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0] uppercase font-bold" htmlFor="settlementAmount">
                Amount Received
              </label>
              <div className="flex items-baseline gap-1">
                <span className="font-['Manrope'] font-bold text-[24px] text-[#4edea3]">₦</span>
                <input
                  id="settlementAmount"
                  className="w-full bg-transparent font-['Manrope'] font-bold text-[24px] text-[#dfe2ee] focus:outline-none"
                  type="number"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Payment Channel Toggle (Phase 5 POS rule) */}
            <div className="flex flex-col gap-1.5">
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0] uppercase font-bold">
                Payment Channel
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentChannel('cash')}
                  className={`h-12 rounded-xl font-['Hanken_Grotesk'] text-[12px] flex items-center justify-center gap-2 font-bold transition-all ${
                    paymentChannel === 'cash'
                      ? 'bg-[#4edea3] text-[#003824] shadow-md'
                      : 'bg-[#1c2028] text-[#dfe2ee] border border-[#31353e]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[19px]">payments</span>
                  <span>Cash Drawer</span>
                </button>

                <button
                  onClick={() => setPaymentChannel('transfer')}
                  className={`h-12 rounded-xl font-['Hanken_Grotesk'] text-[12px] flex items-center justify-center gap-2 font-bold transition-all ${
                    paymentChannel === 'transfer'
                      ? 'bg-[#4edea3] text-[#003824] shadow-md'
                      : 'bg-[#1c2028] text-[#dfe2ee] border border-[#31353e]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[19px]">account_balance</span>
                  <span>Bank Transfer</span>
                </button>
              </div>
            </div>

            {/* Live Timestamp Tag */}
            <div className="flex items-center justify-between text-[#908fa0] font-['Hanken_Grotesk'] text-[11px] px-1">
              <span>Receipt & Daily Ledger Sync</span>
              <span className="text-[#c0c1ff] font-semibold">Sync at {currentTime}</span>
            </div>

            {/* Confirmation Primary CTA */}
            <button
              onClick={handleConfirmSettlement}
              className="w-full h-14 bg-[#4edea3] text-[#003824] rounded-xl font-['Manrope'] font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg hover:opacity-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">verified</span>
              <span>Confirm Settlement & Update Cash In</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
