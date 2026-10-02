import React, { useState, useRef } from 'react';
import { Product, CartItem } from '../types';

interface SellScreenProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onClearCart: () => void;
  onCompleteSale: (
    paymentMethod: 'cash' | 'pos' | 'credit',
    debtorInfo?: { name: string; phone: string }
  ) => void;
  onShowToast: (msg: string, icon?: string, colorClass?: string) => void;
  stockValuation: number;
  activeDebt: number;
}

export const SellScreen: React.FC<SellScreenProps> = ({
  products,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onClearCart,
  onCompleteSale,
  onShowToast,
  stockValuation,
  activeDebt,
}) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'pos' | 'credit'>('credit');
  const [debtorName, setDebtorName] = useState('Alhaji Musa');
  const [debtorPhone, setDebtorPhone] = useState('0803 892 1104');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState(false);

  const thermalIframeRef = useRef<HTMLIFrameElement>(null);

  const categories = ['All', 'Beverages', 'Grains & Food', 'Toiletries', 'Snacks'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const totalUnits = cart.reduce((acc, item) => acc + item.quantity, 0);
  const grandTotal = subtotal;

  // 30% Debt Cap Rule check
  const debtCapThreshold = stockValuation * 0.3; // ₦68,940
  const prospectiveDebt = activeDebt + (paymentMethod === 'credit' ? grandTotal : 0);
  const prospectiveRatio = ((prospectiveDebt / stockValuation) * 100).toFixed(1);
  const isDebtEligible = prospectiveDebt <= debtCapThreshold;

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      onShowToast('Cart is empty. Add products before completing sale.', 'warning', 'text-[#ffb95f]');
      return;
    }

    if (paymentMethod === 'credit') {
      if (!debtorName.trim() || !debtorPhone.trim()) {
        onShowToast('Debtor name and phone number are required for credit sales.', 'warning', 'text-[#ffb95f]');
        return;
      }
      if (!isDebtEligible) {
        onShowToast('Cannot complete sale: Exceeds 30% debt cap threshold!', 'block', 'text-[#ffb4ab]');
        return;
      }
    }

    setIsSubmitting(true);

    // Silent thermal print receipt generation
    setTimeout(() => {
      if (thermalIframeRef.current) {
        const receiptHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Vendora POS Thermal Slip</title>
            <style>
              body { font-family: monospace; font-size: 11px; width: 280px; margin: 0; padding: 10px; color: #000; }
              .center { text-align: center; }
              .bold { font-weight: bold; }
              .row { display: flex; justify-content: space-between; margin: 3px 0; }
              .divider { border-top: 1px dashed #000; margin: 6px 0; }
            </style>
          </head>
          <body>
            <div class="center bold">VENDORA SHOP POS</div>
            <div class="center">Lagos Store #01</div>
            <div class="center">${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="divider"></div>
            ${cart.map((item) => `
              <div class="row">
                <span>${item.quantity}x ${item.name}</span>
                <span>NGN ${(item.unitPrice * item.quantity).toLocaleString()}</span>
              </div>
            `).join('')}
            <div class="divider"></div>
            <div class="row bold"><span>TOTAL</span><span>NGN ${grandTotal.toLocaleString()}</span></div>
            <div class="row"><span>PAYMENT</span><span>${paymentMethod.toUpperCase()}</span></div>
            ${paymentMethod === 'credit' ? `
              <div class="row"><span>DEBTOR</span><span>${debtorName}</span></div>
              <div class="row"><span>PHONE</span><span>${debtorPhone}</span></div>
            ` : ''}
            <div class="divider"></div>
            <div class="center">Thank you for your patronage!</div>
          </body>
          </html>
        `;
        thermalIframeRef.current.srcdoc = receiptHtml;
      }

      setIsSubmitting(false);
      setSaleSuccess(true);
      onShowToast(`Sale of ₦${grandTotal.toLocaleString()} recorded and printed!`, 'check_circle', 'text-[#4edea3]');

      onCompleteSale(
        paymentMethod,
        paymentMethod === 'credit' ? { name: debtorName, phone: debtorPhone } : undefined
      );

      setTimeout(() => {
        setSaleSuccess(false);
      }, 2500);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-20 max-w-2xl mx-auto select-none">
      {/* Barcode Scanner Simulated HUD (Collapsible) */}
      {isScannerOpen && (
        <div className="relative w-full h-44 bg-[#0a0e16] overflow-hidden transition-all duration-300 border-b border-[#262a33] animate-in fade-in">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#c0c1ff]/10 via-[#0a0e16]/80 to-[#0a0e16] flex flex-col items-center justify-center p-3.5">
            <div className="relative w-64 h-24 rounded-lg bg-[#262a33]/40 flex items-center justify-center border border-[#464554]/50">
              {/* Laser Scan Indicator */}
              <div className="absolute inset-x-2 h-0.5 bg-[#4edea3] shadow-[0_0_8px_#4edea3] animate-pulse"></div>
              <div className="flex items-center gap-1.5 text-[#c7c4d7] font-['Hanken_Grotesk'] text-[11px]">
                <span className="material-symbols-outlined text-[18px] text-[#4edea3] animate-bounce">
                  center_focus_weak
                </span>
                <span>Align item barcode within target frame</span>
              </div>
            </div>

            <div className="flex items-center justify-between w-full max-w-xs mt-2">
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#4edea3] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span> Laser Active
              </span>
              <button
                onClick={() => setIsScannerOpen(false)}
                className="px-2.5 py-0.5 rounded-full bg-[#31353e] hover:bg-[#353942] text-[#dfe2ee] font-['Hanken_Grotesk'] text-[11px] flex items-center gap-1 font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">close</span> Close Cam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Quick Controls & Search Header */}
      <section className="flex flex-col gap-2 px-4 pb-2">
        {/* Search Bar with Integrated Hardware Scanner Trigger */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-[#262a33] rounded-xl px-3.5 py-2.5 border border-[#31353e]">
            <span className="material-symbols-outlined text-[#908fa0] text-[20px] mr-2">search</span>
            <input
              className="w-full bg-transparent text-[#dfe2ee] placeholder:text-[#908fa0] font-['Hanken_Grotesk'] text-[14px] focus:outline-none"
              placeholder="Search item, SKU, or scan barcode..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#908fa0] hover:text-[#dfe2ee] mr-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>

          <button
            aria-label="Scan Barcode with Camera"
            onClick={() => setIsScannerOpen(!isScannerOpen)}
            className="flex-shrink-0 w-12 h-11 bg-[#c0c1ff] hover:bg-[#8083ff] text-[#1000a9] rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">barcode_scanner</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[12px] transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#c0c1ff] text-[#1000a9] font-bold'
                    : 'bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] font-semibold'
                }`}
                type="button"
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Product Catalog Touch Grid */}
      <section className="px-4 flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">Catalog Quick-Add</span>
            <span className="font-['Hanken_Grotesk'] text-[10px] px-2 py-0.5 rounded-full bg-[#262a33] text-[#c7c4d7]">
              {filteredProducts.length} items
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#4edea3] font-['Hanken_Grotesk'] text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Tap tile to add</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {filteredProducts.slice(0, 4).map((product) => {
            const isLowStock = product.stock <= (product.lowStockThreshold || 10);
            return (
              <div
                key={product.id}
                onClick={() => onAddToCart(product, 1)}
                className="group relative bg-[#1c2028] border border-[#262a33] hover:border-[#c0c1ff]/30 p-2 rounded-xl flex flex-col justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="relative w-full h-24 rounded-lg bg-[#262a33] overflow-hidden mb-2">
                  <img
                    alt={product.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={product.image}
                  />
                  <span
                    className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full backdrop-blur-md font-['Hanken_Grotesk'] text-[10px] font-bold ${
                      isLowStock
                        ? 'bg-[#93000a]/80 text-[#ffb4ab]'
                        : 'bg-[#0a0e16]/80 text-[#4edea3]'
                    }`}
                  >
                    {isLowStock ? `⚠ ${product.stock} left` : `${product.stock} in stock`}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 mb-2">
                  <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#dfe2ee] truncate">
                    {product.name}
                  </span>
                  <span className="font-['Manrope'] font-bold text-[16px] text-[#c0c1ff]">
                    ₦{product.price.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product, 1);
                  }}
                  className="w-full py-1.5 rounded-lg bg-[#262a33] group-hover:bg-[#4edea3] group-hover:text-[#003824] text-[#dfe2ee] font-['Hanken_Grotesk'] text-[12px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Cart Section / Terminal Ledger */}
      <section className="px-4 flex flex-col gap-2 pb-6">
        <div className="bg-[#1c2028] border border-[#262a33] rounded-2xl p-4 shadow-md flex flex-col gap-2.5">
          {/* Cart Header & Batch Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4edea3] text-[22px]">shopping_basket</span>
              <h2 className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">Active Cart Ledger</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] font-['Hanken_Grotesk'] text-[11px] font-bold">
                {cart.length} lines ({totalUnits} units)
              </span>
            </div>
            {cart.length > 0 && (
              <button
                aria-label="Clear Cart"
                onClick={onClearCart}
                className="p-1.5 rounded-lg text-[#908fa0] hover:text-[#ffb4ab] hover:bg-[#31353e] transition-colors flex items-center gap-1 text-[11px] font-['Hanken_Grotesk'] font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">delete_sweep</span>
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Line Items Ledger */}
          <div className="flex flex-col gap-1.5 py-1">
            {cart.length === 0 ? (
              <div className="py-6 text-center text-[#908fa0] font-['Hanken_Grotesk'] text-[13px]">
                Cart is currently empty. Tap catalog items to add.
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#181c24] border border-[#262a33]/60"
                >
                  <div className="flex flex-col min-w-0 flex-1 pr-2">
                    <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#dfe2ee] truncate">
                      {item.name}
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">
                      ₦{item.unitPrice.toLocaleString()} per unit
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#262a33] rounded-md p-0.5 border border-[#31353e]">
                      <button
                        onClick={() => onUpdateCartQty(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-[#dfe2ee] hover:bg-[#31353e] rounded active:scale-90 transition-transform"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="w-7 text-center font-['Hanken_Grotesk'] font-bold text-[13px] text-[#dfe2ee]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateCartQty(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#dfe2ee] hover:bg-[#31353e] rounded active:scale-90 transition-transform"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>

                    <span className="font-['Hanken_Grotesk'] font-bold text-right text-[#dfe2ee] min-w-[64px] text-[13px]">
                      ₦{(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Financial Calculation Matrix */}
          <div className="flex flex-col gap-1 pt-2 bg-[#0a0e16]/60 p-3 rounded-xl border border-[#262a33]">
            <div className="flex justify-between items-center text-[#908fa0] font-['Hanken_Grotesk'] text-[12px]">
              <span>Subtotal</span>
              <span className="font-['Hanken_Grotesk'] font-bold text-[#dfe2ee]">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#908fa0] font-['Hanken_Grotesk'] text-[12px]">
              <span className="flex items-center gap-1">
                <span>Tax & Discounts</span>
                <span className="text-[10px] bg-[#262a33] px-1 rounded text-[#908fa0]">0% standard</span>
              </span>
              <span className="font-['Hanken_Grotesk'] font-bold text-[#dfe2ee]">₦0</span>
            </div>
            <div className="flex justify-between items-baseline pt-1 border-t border-[#262a33]">
              <span className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">Grand Total</span>
              <span className="font-['Manrope'] font-bold text-[#4edea3] text-[24px]">
                ₦{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="font-['Hanken_Grotesk'] text-[12px] font-semibold text-[#dfe2ee]">Payment Method</span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0a0e16] rounded-xl border border-[#262a33]">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg font-['Hanken_Grotesk'] text-[11px] font-bold active:scale-95 transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-[#00a572] text-[#00311f]'
                    : 'bg-[#262a33] text-[#c7c4d7]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[19px] mb-0.5">payments</span>
                <span>Cash</span>
              </button>

              <button
                onClick={() => setPaymentMethod('pos')}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg font-['Hanken_Grotesk'] text-[11px] font-bold active:scale-95 transition-all ${
                  paymentMethod === 'pos'
                    ? 'bg-[#8083ff] text-[#0d0096]'
                    : 'bg-[#262a33] text-[#c7c4d7]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[19px] mb-0.5">point_of_sale</span>
                <span className="truncate w-full text-center">POS / Transfer</span>
              </button>

              <button
                onClick={() => setPaymentMethod('credit')}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg font-['Hanken_Grotesk'] text-[11px] font-bold active:scale-95 transition-all ${
                  paymentMethod === 'credit'
                    ? 'bg-[#ca8100] text-[#3e2400]'
                    : 'bg-[#262a33] text-[#c7c4d7]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[19px] mb-0.5">assignment_late</span>
                <span>Smart Credit</span>
              </button>
            </div>
          </div>

          {/* Phase 5 Smart Debt Form & 30% Cap Diagnostic (When Smart Credit selected) */}
          {paymentMethod === 'credit' && (
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#262a33] border border-[#ca8100]/40 animate-in fade-in">
              {/* 30% Cap Badge */}
              <div
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isDebtEligible ? 'bg-[#4edea3]/15 text-[#4edea3]' : 'bg-[#ffb4ab]/15 text-[#ffb4ab]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px]">
                    {isDebtEligible ? 'verified_user' : 'warning'}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-['Hanken_Grotesk'] text-[10px] font-bold uppercase tracking-wider">
                      {isDebtEligible ? '30% Debt Cap Rule: PASSED' : '30% Debt Cap Rule: BREACHED'}
                    </span>
                    <span className="font-['Hanken_Grotesk'] text-[11px] text-[#c7c4d7]">
                      Store Credit Ledger: {prospectiveRatio}% of Inventory Value
                    </span>
                  </div>
                </div>
                <span
                  className={`font-['Hanken_Grotesk'] text-[10px] px-2 py-0.5 rounded font-bold ${
                    isDebtEligible ? 'bg-[#4edea3] text-[#003824]' : 'bg-[#ffb4ab] text-[#690005]'
                  }`}
                >
                  {isDebtEligible ? 'ELIGIBLE' : 'BLOCKED'}
                </span>
              </div>

              {/* Debtor Details Requirement */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Hanken_Grotesk'] text-[10px] text-[#908fa0] flex items-center justify-between font-bold">
                  <span>DEBTOR RECORD REQUIREMENT</span>
                  <span className="text-[#ffb95f]">*Required for sales.js Phase 5 audit</span>
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  <div className="flex items-center bg-[#0a0e16] rounded-lg px-3 py-2 border border-[#31353e]">
                    <span className="material-symbols-outlined text-[#908fa0] text-[18px] mr-2">person</span>
                    <input
                      className="bg-transparent text-[#dfe2ee] font-['Hanken_Grotesk'] text-[13px] w-full focus:outline-none"
                      placeholder="Debtor Full Name (e.g. Alhaji Musa)"
                      type="text"
                      value={debtorName}
                      onChange={(e) => setDebtorName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center bg-[#0a0e16] rounded-lg px-3 py-2 border border-[#31353e]">
                    <span className="material-symbols-outlined text-[#908fa0] text-[18px] mr-2">call</span>
                    <input
                      className="bg-transparent text-[#dfe2ee] font-['Hanken_Grotesk'] text-[13px] w-full focus:outline-none"
                      placeholder="Phone Number (e.g. 0803 892 1104)"
                      type="tel"
                      value={debtorPhone}
                      onChange={(e) => setDebtorPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Complete Sale CTA */}
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              onClick={handleCompleteSale}
              disabled={isSubmitting || cart.length === 0}
              className={`w-full h-14 rounded-xl font-['Manrope'] font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all ${
                cart.length === 0
                  ? 'bg-[#262a33] text-[#908fa0] cursor-not-allowed'
                  : saleSuccess
                  ? 'bg-[#00a572] text-[#dfe2ee]'
                  : 'bg-[#4edea3] text-[#003824] hover:opacity-95'
              }`}
              type="button"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[24px] animate-spin">refresh</span>
                  <span>Spooling Background Iframe Receipt...</span>
                </>
              ) : saleSuccess ? (
                <>
                  <span className="material-symbols-outlined text-[24px]">check_circle</span>
                  <span>Transaction Committed & Printed!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                  <span>Complete Sale & Print Receipt</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[#908fa0] font-['Hanken_Grotesk'] text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              <span>Non-blocking thermal print (utils.js background iframe execution)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Invisible print iframe */}
      <iframe ref={thermalIframeRef} className="hidden" title="Sell Thermal Print Engine" />
    </div>
  );
};
