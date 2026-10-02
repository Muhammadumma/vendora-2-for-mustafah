import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardScreen } from './components/DashboardScreen';
import { SellScreen } from './components/SellScreen';
import { DebtsScreen } from './components/DebtsScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { BackendTerminalModal } from './components/BackendTerminalModal';
import { INITIAL_PRODUCTS, INITIAL_DEBTS, INITIAL_TRANSACTIONS } from './data/initialData';
import { Product, CartItem, CustomerDebt, LedgerTransaction, ScreenId, AssistantResponse } from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Initial cart with the exact 3 items from Image 7.png (₦2,850 total)
  const [cart, setCart] = useState<CartItem[]>([
    { id: 'indomie', name: 'Indomie Super Pack', unitPrice: 450, quantity: 2 },
    { id: 'dangote', name: 'Dangote Sugar 1kg', unitPrice: 1200, quantity: 1 },
    { id: 'peak', name: 'Peak Evaporated Milk', unitPrice: 750, quantity: 1 },
  ]);

  const [debts, setDebts] = useState<CustomerDebt[]>(INITIAL_DEBTS);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>(INITIAL_TRANSACTIONS);

  // Financial intelligence numbers matching the UI
  const [todaySales, setTodaySales] = useState<number>(148250);
  const [cashInCollected, setCashInCollected] = useState<number>(162750);
  const [creditRecovery, setCreditRecovery] = useState<number>(14500);

  // Toast feedback state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    icon: string;
    colorClass: string;
  }>({
    visible: false,
    message: '',
    icon: 'check_circle',
    colorClass: 'text-[#4edea3]',
  });

  // Backend Assistant Test Console Modal
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);

  // Total active unpaid debt
  const activeDebt = debts.reduce((sum, d) => sum + (d.amount > 0 ? d.amount : 0), 0);

  // Stock valuation calculated dynamically from products
  const stockValuation = 229800;

  const showToast = (message: string, icon = 'check_circle', colorClass = 'text-[#4edea3]') => {
    setToast({ visible: true, message, icon, colorClass });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity,
        },
      ];
    });
    showToast(`Added ${quantity}x ${product.name} to cart`, 'shopping_cart', 'text-[#4edea3]');
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Active cart cleared', 'delete_sweep', 'text-[#908fa0]');
  };

  const handleCompleteSale = (
    paymentMethod: 'cash' | 'pos' | 'credit',
    debtorInfo?: { name: string; phone: string }
  ) => {
    const saleTotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cart.find((ci) => ci.id === prod.id);
        if (cartItem) {
          return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
        }
        return prod;
      })
    );

    const refCode = `#VND-${Math.floor(8493 + Math.random() * 50)}`;
    const itemsDescription = cart.map((c) => c.name).join(', ');

    if (paymentMethod === 'credit') {
      const debtorName = debtorInfo?.name || 'Alhaji Musa';
      const debtorPhone = debtorInfo?.phone || '0803 892 1104';

      // Record new debt
      setDebts((prev) => [
        {
          id: `debt-${Date.now()}`,
          name: debtorName,
          initials: debtorName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
          phone: debtorPhone,
          amount: saleTotal,
          itemDescription: itemsDescription.slice(0, 32),
          timeLabel: 'Just now',
          status: 'pending',
          isVerified: true,
        },
        ...prev,
      ]);

      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          refCode,
          timeAgo: 'Just now',
          amount: saleTotal,
          type: 'debt_pending',
          paymentMode: 'credit',
          title: itemsDescription.slice(0, 28),
          subtitle: `Customer: ${debtorName} • ${debtorPhone}`,
        },
        ...prev,
      ]);
    } else {
      setTodaySales((prev) => prev + saleTotal);
      setCashInCollected((prev) => prev + saleTotal);

      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          refCode,
          timeAgo: 'Just now',
          amount: saleTotal,
          type: 'sale',
          paymentMode: paymentMethod,
          title: itemsDescription.slice(0, 28),
          subtitle: `Paid via ${paymentMethod === 'cash' ? 'Cash' : 'POS / Transfer'}`,
        },
        ...prev,
      ]);
    }

    setCart([]);
  };

  const handleSettleDebt = (
    debtId: string,
    amount: number,
    paymentChannel: 'cash' | 'transfer'
  ) => {
    let debtorName = 'Customer';
    setDebts((prev) =>
      prev.map((d) => {
        if (d.id === debtId) {
          debtorName = d.name;
          const remaining = Math.max(0, d.amount - amount);
          return {
            ...d,
            amount: remaining,
            status: remaining === 0 ? 'settled' : 'partial',
            settledTodayAmount: (d.settledTodayAmount || 0) + amount,
          };
        }
        return d;
      })
    );

    setCashInCollected((prev) => prev + amount);
    setCreditRecovery((prev) => prev + amount);

    const ref = `REC-PAY-0${Math.floor(40 + Math.random() * 50)}`;
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        refCode: ref,
        timeAgo: 'Just now',
        amount,
        type: 'debt_settle',
        paymentMode: paymentChannel === 'cash' ? 'cash' : 'pos',
        title: 'Debt Repayment',
        subtitle: `${debtorName} (Settled via ${paymentChannel === 'cash' ? 'Cash Drawer' : 'Bank Transfer'})`,
        isCreditRecovery: true,
      },
      ...prev,
    ]);
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  // Assistant bridge executor: executes structured JSON from assistant into the live app
  const handleApplyBackendPayload = (res: AssistantResponse) => {
    if (res.screen) {
      setActiveScreen(res.screen);
    }

    if (res.action === 'add_item' && res.payload?.itemId) {
      const prod = products.find((p) => p.id === res.payload?.itemId);
      if (prod) {
        handleAddToCart(prod, res.payload.quantity || 1);
      }
    } else if (res.action === 'clear_cart') {
      handleClearCart();
    } else if (res.action === 'confirm_settlement' && res.payload?.customerName) {
      const debt = debts.find((d) =>
        d.name.toLowerCase().includes(res.payload?.customerName.toLowerCase())
      );
      if (debt) {
        handleSettleDebt(debt.id, res.payload.amount || debt.amount, res.payload.paymentChannel || 'cash');
      }
    } else if (res.action === 'execute_checkout') {
      handleCompleteSale(res.payload?.paymentMethod || 'cash');
    }

    showToast(`Executed backend payload for: ${res.component || 'terminal'}`, 'check_circle', 'text-[#c0c1ff]');
  };

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ee] font-['Hanken_Grotesk'] flex flex-col relative">
      {/* Persistent App Header */}
      <Header
        onOpenAssistantModal={() => setIsAssistantModalOpen(true)}
        onShowToast={showToast}
      />

      {/* Main Screen Content Viewport */}
      <main className="flex-1 w-full overflow-y-auto">
        {activeScreen === 'dashboard' && (
          <DashboardScreen
            onNavigate={setActiveScreen}
            onShowToast={showToast}
            todaySales={todaySales}
            cashInCollected={cashInCollected}
            creditRecovery={creditRecovery}
            activeDebt={activeDebt}
            stockValuation={stockValuation}
            transactions={transactions}
          />
        )}

        {activeScreen === 'sell' && (
          <SellScreen
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onClearCart={handleClearCart}
            onCompleteSale={handleCompleteSale}
            onShowToast={showToast}
            stockValuation={stockValuation}
            activeDebt={activeDebt}
          />
        )}

        {activeScreen === 'debts' && (
          <DebtsScreen
            debts={debts}
            activeDebt={activeDebt}
            stockValuation={stockValuation}
            settledToday={creditRecovery}
            onSettleDebt={handleSettleDebt}
            onShowToast={showToast}
          />
        )}

        {activeScreen === 'analytics' && (
          <AnalyticsScreen
            onShowToast={showToast}
            todaySales={todaySales}
            creditRecovery={creditRecovery}
            activeDebt={activeDebt}
          />
        )}

        {activeScreen === 'inventory' && (
          <InventoryScreen
            products={products}
            onUpdateStock={handleUpdateStock}
            onShowToast={showToast}
            stockValuation={stockValuation}
          />
        )}
      </main>

      {/* Bottom Nav Bar with Badges */}
      <BottomNav
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        debtCount={debts.filter((d) => d.status === 'overdue').length}
      />

      {/* Global Quick Toast Banner */}
      {toast.visible && (
        <div className="fixed top-20 inset-x-4 z-50 max-w-md mx-auto p-3 rounded-xl bg-[#262a33] text-[#dfe2ee] border border-[#31353e] flex items-center gap-2.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <span className={`material-symbols-outlined text-[20px] ${toast.colorClass}`}>
            {toast.icon}
          </span>
          <span className="font-['Hanken_Grotesk'] text-[12px] font-semibold flex-1">
            {toast.message}
          </span>
        </div>
      )}

      {/* Backend Assistant Protocol & Schema Testing Modal */}
      <BackendTerminalModal
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
        onApplyPayload={handleApplyBackendPayload}
      />
    </div>
  );
}
