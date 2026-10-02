import React from 'react';

interface HeaderProps {
  onOpenAssistantModal?: () => void;
  onShowToast: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAssistantModal, onShowToast }) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0f131c]/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.4)] pt-safe border-b border-[#1c2028]">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-2xl mx-auto">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00a572] to-[#4edea3] flex items-center justify-center shadow-md flex-shrink-0">
            <span className="material-symbols-outlined text-[#003824] text-[20px] font-bold">storefront</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-['Manrope'] font-semibold text-[16px] text-[#dfe2ee] truncate tracking-tight">
                Vendora Shop POS
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              <span className="font-['Hanken_Grotesk'] text-[10px] font-bold text-[#4edea3] truncate uppercase tracking-wider">
                Live Cloud Sync Active
              </span>
            </div>
          </div>
        </div>

        {/* Action icons & profile */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Backend Assistant Schema Inspector Toggle */}
          <button
            aria-label="Assistant Protocol Inspector"
            onClick={onOpenAssistantModal}
            className="px-2.5 py-1.5 rounded-xl bg-[#262a33]/80 hover:bg-[#31353e] text-[#c0c1ff] font-['Hanken_Grotesk'] text-[11px] font-semibold flex items-center gap-1.5 border border-[#464554]/40 transition-colors"
            title="Inspect Backend Assistant JSON Protocol"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-[#8083ff]">terminal</span>
            <span className="hidden xs:inline">Backend API</span>
          </button>

          {/* Notifications button */}
          <button
            aria-label="Notifications"
            onClick={() => onShowToast('System notifications: All 3 store terminals synced.')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#262a33]/60 text-[#c7c4d7] hover:text-[#dfe2ee] hover:bg-[#31353e] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>

          {/* User profile avatar */}
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              alt="Store Manager Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#c0c1ff]/40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2autg--WokVInm8hsMAXubJmPdWVyPWkSUbF4gSwWf6QsbbkZGvIYGf7cKAhT31MF43_e9VEQF2Syh9dENpyxb9BjxkaxgvteX4EEOONIVvn7VRKhXzywG7W2KnQe7A0sx_iP1Uy3qgTUTfvmESmvKDjjiyGf1UIyjyzo4OoSdtMhhRlexKiqkhKFeEBcCxTh8ykW6_4xHoQsfeouGZUOudxoJidXAKunrfYZF2xbZPuE4GYfzVyQnQ"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
