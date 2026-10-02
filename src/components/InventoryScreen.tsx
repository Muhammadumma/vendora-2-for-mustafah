import React, { useState } from 'react';
import { Product } from '../types';

interface InventoryScreenProps {
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onShowToast: (msg: string, icon?: string, colorClass?: string) => void;
  stockValuation: number;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  products,
  onUpdateStock,
  onShowToast,
  stockValuation,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addedStockQty, setAddedStockQty] = useState(10);

  const categories = ['All', 'Beverages', 'Grains & Food', 'Toiletries', 'Snacks'];

  const filtered = products.filter((p) => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSaveStock = () => {
    if (!editingProduct) return;
    const newQty = editingProduct.stock + addedStockQty;
    onUpdateStock(editingProduct.id, newQty);
    onShowToast(`Stock updated: +${addedStockQty} units of ${editingProduct.name}`, 'add_box', 'text-[#4edea3]');
    setEditingProduct(null);
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-20 max-w-2xl mx-auto space-y-3.5 select-none">
      {/* Inventory Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#c0c1ff]/15 flex items-center justify-center text-[#c0c1ff]">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
          <div>
            <h2 className="font-['Manrope'] font-semibold text-[16px] text-[#dfe2ee]">
              Inventory Stock Ledger
            </h2>
            <p className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">
              Total Valuation: <strong className="text-[#4edea3]">₦{stockValuation.toLocaleString()}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (products.length > 0) {
              setEditingProduct(products[0]);
              setAddedStockQty(20);
            }
          }}
          className="px-3 py-1.5 rounded-xl bg-[#c0c1ff] hover:bg-[#8083ff] text-[#1000a9] font-['Hanken_Grotesk'] text-[12px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Quick Restock
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#908fa0] text-[20px]">
            search
          </span>
          <input
            className="w-full h-11 pl-10 pr-10 bg-[#1c2028] border border-[#262a33] rounded-xl font-['Hanken_Grotesk'] text-[13px] text-[#dfe2ee] placeholder:text-[#908fa0] focus:outline-none focus:border-[#c0c1ff]/50 transition-colors"
            placeholder="Search SKU or item name..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#908fa0] hover:text-[#dfe2ee]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[12px] flex-shrink-0 transition-colors ${
                selectedCat === cat
                  ? 'bg-[#c0c1ff] text-[#1000a9] font-bold'
                  : 'bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] font-semibold'
              }`}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-2">
        {filtered.map((item) => {
          const isLowStock = item.stock <= (item.lowStockThreshold || 10);
          const itemValuation = item.stock * item.price;

          return (
            <div
              key={item.id}
              className="bg-[#1c2028] border border-[#262a33] rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm hover:border-[#31353e] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  alt={item.imageAlt}
                  className="w-12 h-12 rounded-lg object-cover bg-[#262a33] flex-shrink-0"
                  src={item.image}
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-['Hanken_Grotesk'] text-[13px] font-semibold text-[#dfe2ee] truncate">
                      {item.name}
                    </span>
                    {item.isFastMover && (
                      <span className="font-['Hanken_Grotesk'] text-[9px] px-1.5 py-0.2 rounded bg-[#00a572]/20 text-[#4edea3] font-bold">
                        FAST
                      </span>
                    )}
                  </div>
                  <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">
                    ₦{item.price.toLocaleString()} / unit • Val: ₦{itemValuation.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col items-end">
                  <span
                    className={`font-['Manrope'] font-bold text-[15px] ${
                      isLowStock ? 'text-[#ffb4ab]' : 'text-[#4edea3]'
                    }`}
                  >
                    {item.stock} in stock
                  </span>
                  {isLowStock && (
                    <span className="font-['Hanken_Grotesk'] text-[10px] text-[#ffb4ab] font-bold">
                      Critical Low
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(item);
                    setAddedStockQty(12);
                  }}
                  className="w-8 h-8 rounded-lg bg-[#262a33] hover:bg-[#353942] flex items-center justify-center text-[#c0c1ff] border border-[#31353e] active:scale-90 transition-transform"
                  type="button"
                  title="Restock"
                >
                  <span className="material-symbols-outlined text-[18px]">add_box</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Restock Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-[#0f131c]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#262a33] border border-[#31353e] rounded-2xl p-4 max-w-sm w-full shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Manrope'] font-semibold text-[15px] text-[#dfe2ee]">
                  Restock: {editingProduct.name}
                </h3>
                <p className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0]">
                  Current Stock: {editingProduct.stock} units
                </p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-7 h-7 rounded-full bg-[#1c2028] flex items-center justify-center text-[#908fa0] hover:text-[#dfe2ee]"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-[#1c2028] rounded-xl p-3 flex flex-col gap-1 border border-[#31353e]">
              <span className="font-['Hanken_Grotesk'] text-[11px] text-[#908fa0] uppercase font-bold">
                Additional Quantity
              </span>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setAddedStockQty(Math.max(1, addedStockQty - 5))}
                  className="w-9 h-9 rounded-lg bg-[#262a33] text-[#dfe2ee] flex items-center justify-center hover:bg-[#31353e]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <span className="font-['Manrope'] font-bold text-[22px] text-[#4edea3]">
                  +{addedStockQty}
                </span>
                <button
                  onClick={() => setAddedStockQty(addedStockQty + 5)}
                  className="w-9 h-9 rounded-lg bg-[#262a33] text-[#dfe2ee] flex items-center justify-center hover:bg-[#31353e]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[#908fa0] font-['Hanken_Grotesk'] text-[11px] px-1">
              <span>New Total Stock</span>
              <span className="font-bold text-[#dfe2ee]">{editingProduct.stock + addedStockQty} units</span>
            </div>

            <button
              onClick={handleSaveStock}
              className="w-full h-12 rounded-xl bg-[#4edea3] text-[#003824] font-['Manrope'] font-bold text-[14px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">check</span>
              <span>Confirm Stock Injection</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
