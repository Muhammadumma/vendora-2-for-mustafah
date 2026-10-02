import React from 'react';
import { ScreenId } from '../types';

interface BottomNavProps {
  activeScreen: ScreenId;
  onScreenChange: (screen: ScreenId) => void;
  debtCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onScreenChange,
  debtCount = 6,
}) => {
  const navItems: { id: ScreenId; label: string; icon: string; badge?: string; hasDot?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'sell', label: 'Sell', icon: 'shopping_cart', badge: 'POS' },
    { id: 'inventory', label: 'Inventory', icon: 'inventory_2' },
    { id: 'debts', label: 'Debts', icon: 'assignment_late', hasDot: debtCount > 0 },
    { id: 'analytics', label: 'Analytics', icon: 'query_stats' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#0a0e16]/90 backdrop-blur-xl shadow-[0_-2px_16px_rgba(0,0,0,0.5)] border-t border-[#1c2028]">
      <div className="flex justify-around items-center h-16 px-1 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition-all relative ${
                isActive
                  ? 'text-[#c0c1ff] font-semibold'
                  : 'text-[#c7c4d7] hover:text-[#dfe2ee]'
              }`}
              type="button"
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>

                {/* POS green pill */}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#4edea3] text-[#003824] font-['Hanken_Grotesk'] text-[10px] font-bold px-1 rounded-full leading-none py-0.5">
                    {item.badge}
                  </span>
                )}

                {/* Overdue/Debt red alert dot */}
                {item.hasDot && (
                  <span className="absolute -top-0.5 -right-1.5 w-2 h-2 rounded-full bg-[#ffb4ab] ring-1 ring-[#0f131c]"></span>
                )}
              </div>
              <span className="font-['Hanken_Grotesk'] text-[10px] tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
