import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Database, 
  CheckCircle, 
  Plus, 
  ShoppingCart, 
  DollarSign, 
  Sparkles,
  Search,
  ChevronDown
} from 'lucide-react';
import { PRODUCTS, INITIAL_DISTRIBUTORS } from '../data';
import { ProductItem } from '../types';

export const ComercialModule: React.FC = () => {
  const [productsList, setProductsList] = useState<ProductItem[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(PRODUCTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checkout simulator state
  const [recipientID, setRecipientID] = useState(INITIAL_DISTRIBUTORS[0].id);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [successReceipt, setSuccessReceipt] = useState<{
    orderId: string;
    total: number;
    pv: number;
    credited: string;
  } | null>(null);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !customerName.trim()) return;

    const pseudoOrderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
    const totalCost = selectedProduct.price * quantity;
    const totalPV = selectedProduct.pv * quantity;

    // Simulate database updates (increase distributor volume)
    const targetDist = INITIAL_DISTRIBUTORS.find(d => d.id === recipientID);
    if (targetDist) {
      targetDist.monthlyPV += totalPV;
      targetDist.monthlyGV += totalCost;
    }

    setSuccessReceipt({
      orderId: pseudoOrderId,
      credited: targetDist ? targetDist.name : recipientID,
      total: totalCost,
      pv: totalPV
    });

    // Reset shopping cart inputs
    setQuantity(1);
    setCustomerName('');
  };

  const filteredProducts = productsList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5 bg-slate-900/30 rounded-xl border border-slate-800/80 gap-4 text-left">
        <div>
          <h2 className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-450" /> Commercial Operations & Product Store
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Setup corporate products inventory, synchronize Shopify SKUs, and simulate retail sales to accumulate commission PV/GV.
          </p>
        </div>

        {/* Product Keyword Lookup */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search SKUs or Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none py-2 pl-9 pr-4 rounded-lg text-xs placeholder:text-slate-600 text-slate-200"
          />
        </div>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Product Catalog Display Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center font-mono text-[10px] text-slate-500 border-b border-slate-800 pb-2 mb-2">
            <span className="uppercase">Corporate SKUs ({filteredProducts.length})</span>
            <span className="text-amber-400">ACTIVE SHOPIFY AUTOMATION</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((p) => {
              const pvRate = (p.pv / p.price * 100).toFixed(0);
              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setSuccessReceipt(null);
                  }}
                  className={`bg-slate-900 border p-4 rounded-lg cursor-pointer text-left flex flex-col justify-between hover:border-slate-700 transition-all group ${
                    selectedProduct?.id === p.id 
                      ? 'border-amber-500 bg-slate-900 shadow-md shadow-amber-950/10' 
                      : 'border-slate-800/80 bg-slate-900/60'
                  }`}
                >
                  <div>
                    <div className="relative h-28 w-full rounded overflow-hidden mb-3.5 bg-slate-950 border border-slate-850">
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-mono font-bold uppercase bg-slate-950/95 border border-slate-800 px-2 py-0.5 rounded text-indigo-400 tracking-wider">
                        {p.pv} PV rewards
                      </span>
                    </div>

                    <p className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">{p.sku} • {p.category}</p>
                    <h4 className="text-xs font-semibold font-display text-slate-200 mt-1 lines-clamp-1">{p.name}</h4>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-850 pt-2.5 mt-3.5">
                    <span className="text-md font-bold font-mono text-white">${p.price.toFixed(2)}</span>
                    <span className="text-[10px] font-mono text-slate-500">Yield: {pvRate}% PV value</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Details & Checkout Builder panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 text-left flex flex-col justify-between">
          
          {selectedProduct ? (
            <div className="space-y-5 h-full flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <h3 className="text-md font-bold font-display text-white uppercase tracking-wide leading-snug">{selectedProduct.name}</h3>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">SKU: {selectedProduct.sku} | STOCK: {selectedProduct.stock} items</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-md font-bold font-mono text-white">${selectedProduct.price.toFixed(2)}</span>
                    <span className="block text-[10px] font-mono text-indigo-400">{selectedProduct.pv} PV rewards</span>
                  </div>
                </div>

                {successReceipt ? (
                  // Purchase complete invoice mockup
                  <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20 text-center animate-fade-in space-y-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Commission Invoice Confirmed</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">ORDER ID: {successReceipt.orderId}</p>
                    </div>

                    <div className="bg-slate-950/60 rounded border border-slate-850 p-3 text-xs text-left space-y-1.5 font-sans">
                      <div className="flex justify-between text-slate-400">
                        <span>Checkout Volume:</span>
                        <span className="text-indigo-400 font-bold font-mono">+{successReceipt.pv} PV</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Credited Recipient:</span>
                        <span className="text-slate-200 font-semibold">{successReceipt.credited}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Total Paid:</span>
                        <span className="text-white font-mono font-bold">${successReceipt.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSuccessReceipt(null)}
                      className="text-[11px] text-emerald-400 font-mono underline hover:text-emerald-300 transition-colors block mx-auto cursor-pointer"
                    >
                      Process another checkout order
                    </button>
                  </div>
                ) : (
                  // Checkout input forms
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                      <ShoppingCart className="w-3.5 h-3.5 text-amber-500" />
                      <span>Checkout volume credit simulator</span>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono text-slate-400 mb-1 uppercase">Purchasing Client Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Eleanor Vance"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none p-2 rounded text-xs text-slate-200"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10.5px] font-mono text-slate-400 mb-1 uppercase">VOLUME CREDITED ID</label>
                        <select
                          value={recipientID}
                          onChange={(e) => setRecipientID(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none p-2.5 rounded text-xs text-slate-300"
                        >
                          {INITIAL_DISTRIBUTORS.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-mono text-slate-400 mb-1 uppercase">QUANTITY</label>
                        <input 
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none p-2 rounded text-xs font-mono text-slate-200"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-950/65 rounded border border-slate-850 p-3 text-xs space-y-1 mt-4 text-slate-400 font-sans">
                      <div className="flex justify-between">
                        <span>Total Checkout PV Credited:</span>
                        <span className="text-indigo-400 font-mono font-bold font-semibold">{(selectedProduct.pv * quantity)} PV</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Aggregate Order Cost:</span>
                        <span className="text-white font-mono font-bold">${(selectedProduct.price * quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-450 hover:text-white rounded font-mono text-xs font-semibold cursor-pointer transition-all uppercase tracking-wide mt-2"
                    >
                      EXECUTE SHOPIFY RETAIL ORDER
                    </button>

                  </form>
                )}

              </div>

              {/* API and Shopify metadata sync states */}
              <div className="bg-slate-950/30 border border-slate-850 p-3 rounded-lg flex items-center space-x-3 text-[11px] font-mono text-slate-500 mt-4">
                <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Shopify webhook synchronicity matches 100%. Tax nexus evaluated under Avalara automation loops.</span>
              </div>

            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs font-sans">
              Select any SKU card of your catalog to inspect details or run retail calculations
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
