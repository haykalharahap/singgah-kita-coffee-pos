
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Sparkles, X, Plus, LayoutDashboard, 
  Utensils, ClipboardList, LogOut, 
  Coffee, CreditCard, ShoppingBag, Trash2, Minus, 
  CheckCircle2, Clock, ChefHat, TrendingUp, DollarSign, Package,
  Menu as MenuIcon, ChevronRight
} from 'lucide-react';
import { MENU_ITEMS, CATEGORIES } from './constants';
import { MenuItem, Category, CartItem, Order, Role, OrderStatus } from './types';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  // Authentication & Navigation
  const [role, setRole] = useState<Role | null>(null);
  const [currentView, setCurrentView] = useState<'POS' | 'Orders' | 'Admin'>('POS');

  // Core Data
  const [menu, setMenu] = useState<MenuItem[]>(MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // UI State
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ itemName: string; baristaTip: string }[]>([]);
  const [businessTips, setBusinessTips] = useState<string[]>([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  // Filtering Menu
  const filteredItems = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menu, selectedCategory, searchQuery]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);

  // AI Logic
  const fetchBusinessTips = async () => {
    if (orders.length === 0) return;
    const gemini = new GeminiService();
    const result = await gemini.getBusinessAdvice(orders);
    setBusinessTips(result.tips);
  };

  useEffect(() => {
    if (currentView === 'Admin' && businessTips.length === 0) {
      fetchBusinessTips();
    }
  }, [currentView]);

  // Handlers
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleCheckout = () => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      items: [...cart],
      subtotal,
      tax,
      total,
      status: 'Pending',
      timestamp: new Date()
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    alert(`Order #${newOrder.id} Placed!`);
  };

  const updateOrderStatus = (id: string, nextStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  // Login View
  if (!role) {
    return (
      <div className="min-h-screen bg-[#1a3c34] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-[#2d5a4e] rounded-full blur-[120px] opacity-20" />
        <div className="bg-[#fdfdfb] w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-center relative z-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="bg-[#e6f4ea] p-4 rounded-[1.8rem] flex items-center justify-center text-[#1a3c34] mb-4 shadow-sm">
              <Coffee size={32} />
            </div>
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-bold tracking-[0.5em] text-[#1a3c34] uppercase opacity-40 mb-1">KITA</span>
               <div className="flex items-center">
                  <span className="text-4xl font-serif text-[#1a3c34] italic -mr-1">S</span>
                  <span className="text-3xl font-bold text-[#1a3c34] tracking-tight">inggah</span>
               </div>
            </div>
          </div>
          <div className="space-y-3">
            <button onClick={() => { setRole('Cashier'); setCurrentView('POS'); }} className="w-full py-4 bg-[#1a3c34] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#2d5a4e] transition-all shadow-lg">
              <ShoppingBag size={20} /> Login as Cashier
            </button>
            <button onClick={() => { setRole('Admin'); setCurrentView('Admin'); }} className="w-full py-4 border-2 border-[#1a3c34]/10 text-[#1a3c34] rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
              <LayoutDashboard size={20} /> Login as Admin
            </button>
          </div>
          <p className="mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Premium Coffee POS v2.1</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#fdfdfb]">
      
      {/* SIDEBAR - Desktop Only */}
      <aside className="hidden lg:flex w-64 bg-[#1a3c34] text-white h-screen flex-col p-6 fixed left-0 top-0 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="bg-[#e6f4ea] p-2.5 rounded-[1rem] flex items-center justify-center text-[#1a3c34]">
            <Coffee size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">Singgah Kita</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {role === 'Admin' && (
            <button onClick={() => setCurrentView('Admin')} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${currentView === 'Admin' ? 'bg-[#2d5a4e] text-white shadow-md' : 'text-green-100/50 hover:bg-[#2d5a4e] hover:text-white'}`}>
              <LayoutDashboard size={20} /><span className="font-semibold">Dashboard</span>
            </button>
          )}
          <button onClick={() => setCurrentView('POS')} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${currentView === 'POS' ? 'bg-[#2d5a4e] text-white shadow-md' : 'text-green-100/50 hover:bg-[#2d5a4e] hover:text-white'}`}>
            <Utensils size={20} /><span className="font-semibold">Menu</span>
          </button>
          <button onClick={() => setCurrentView('Orders')} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${currentView === 'Orders' ? 'bg-[#2d5a4e] text-white shadow-md' : 'text-green-100/50 hover:bg-[#2d5a4e] hover:text-white'}`}>
            <ClipboardList size={20} /><span className="font-semibold">Orders</span>
          </button>
        </nav>
        <button onClick={() => setRole(null)} className="flex items-center gap-4 px-4 py-3.5 mt-auto text-green-100/50 hover:text-white border-t border-white/5 pt-6">
          <LogOut size={20} /><span className="font-semibold">Logout</span>
        </button>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a3c34] text-white z-[60] flex items-center justify-around px-2 py-3 border-t border-white/5 shadow-2xl rounded-t-[1.5rem]">
        {role === 'Admin' && (
          <button onClick={() => setCurrentView('Admin')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === 'Admin' ? 'text-white' : 'text-white/40'}`}>
            <LayoutDashboard size={20} /><span className="text-[10px] font-bold">Admin</span>
          </button>
        )}
        <button onClick={() => setCurrentView('POS')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === 'POS' ? 'text-white' : 'text-white/40'}`}>
          <Utensils size={20} /><span className="text-[10px] font-bold">Menu</span>
        </button>
        <button onClick={() => setCurrentView('Orders')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${currentView === 'Orders' ? 'text-white' : 'text-white/40'}`}>
          <ClipboardList size={20} /><span className="text-[10px] font-bold">Orders</span>
        </button>
        <button onClick={() => setRole(null)} className="flex flex-col items-center gap-1 p-2 text-white/40">
          <LogOut size={20} /><span className="text-[10px] font-bold">Exit</span>
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-300 px-4 py-6 lg:p-10 mb-20 lg:mb-0 ${currentView === 'POS' ? 'lg:ml-64 lg:mr-96' : 'lg:ml-64'}`}>
        
        {/* VIEW: POS */}
        {currentView === 'POS' && (
          <div className="max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center justify-between w-full md:w-auto">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-[#1a3c34]">Choose Menu</h1>
                  <p className="text-xs lg:text-sm text-gray-500 font-medium">Singgah Kita Premium Coffee</p>
                </div>
                <button onClick={() => setIsCartOpen(true)} className="lg:hidden relative p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <ShoppingBag size={22} className="text-[#1a3c34]" />
                  {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cart.length}</span>}
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search menu..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#1a3c34]/5 outline-none text-sm transition-all" />
                </div>
                <button onClick={() => setShowAiModal(true)} className="bg-[#1a3c34] text-white p-3.5 rounded-2xl hover:bg-[#2d5a4e] transition-all shadow-lg flex items-center justify-center gap-2 px-6">
                  <Sparkles size={16} /> <span className="text-sm font-bold">AI Barista</span>
                </button>
              </div>
            </header>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {CATEGORIES.map((cat) => (
                <button key={cat.value} onClick={() => setSelectedCategory(cat.value)} className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${selectedCategory === cat.value ? 'bg-[#1a3c34] text-white border-[#1a3c34] shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 mt-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-[1.8rem] md:rounded-[2.5rem] p-3 md:p-5 border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => addToCart(item)}>
                  <div className="relative overflow-hidden rounded-[1.2rem] md:rounded-[1.8rem] aspect-square mb-4">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/90 backdrop-blur-md px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-bold text-[#1a3c34] uppercase tracking-widest border border-white/20">
                      {item.category}
                    </div>
                  </div>
                  <h3 className="text-sm md:text-lg font-bold text-[#1a3c34] leading-tight line-clamp-1">{item.name}</h3>
                  <p className="text-gray-400 text-[10px] md:text-xs mb-3 line-clamp-1 mt-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm md:text-xl font-bold text-[#1a3c34]">{formatCurrency(item.price)}</span>
                    <div className="bg-[#1a3c34] text-white p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-md group-active:scale-90 transition-transform"><Plus size={16} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: ORDER TRACKER */}
        {currentView === 'Orders' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1a3c34]">Order Tracker</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['Pending', 'Brewing', 'Done'] as OrderStatus[]).map(status => (
                <div key={status} className="bg-gray-50/50 rounded-[2rem] p-5 border border-gray-100 min-h-[400px]">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm md:text-base font-bold flex items-center gap-2 uppercase tracking-widest text-gray-500">
                      {status === 'Pending' && <Clock size={16} className="text-orange-400" />}
                      {status === 'Brewing' && <ChefHat size={16} className="text-blue-400" />}
                      {status === 'Done' && <CheckCircle2 size={16} className="text-green-400" />}
                      {status}
                    </h2>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-[#1a3c34] shadow-sm border border-gray-50">
                      {orders.filter(o => o.status === status).length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {orders.filter(o => o.status === status).map(order => (
                      <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-bold text-gray-400">ORD-{order.id}</span>
                          <span className="text-[10px] text-gray-300 font-medium">{order.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="space-y-1 mb-4">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-xs font-bold text-[#1a3c34]">
                              <span>{it.name}</span>
                              <span className="text-gray-400">x{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                          <span className="font-bold text-sm">{formatCurrency(order.total)}</span>
                          {status !== 'Done' && (
                            <button onClick={() => updateOrderStatus(order.id, status === 'Pending' ? 'Brewing' : 'Done')} className="text-[10px] font-bold bg-[#1a3c34] text-white px-4 py-2 rounded-lg flex items-center gap-1">
                              MOVE <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: ADMIN DASHBOARD */}
        {currentView === 'Admin' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1a3c34]">Performance</h1>
                <p className="text-sm text-gray-500 font-medium">Real-time store overview</p>
              </div>
              <button onClick={fetchBusinessTips} className="bg-[#1a3c34] text-white p-3 rounded-2xl shadow-lg hover:rotate-12 transition-transform">
                <Sparkles size={20} />
              </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="bg-green-50 w-10 h-10 rounded-xl flex items-center justify-center text-green-600 mb-6"><DollarSign size={20} /></div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Revenue Today</p>
                  <h3 className="text-2xl font-bold text-[#1a3c34] mt-1">{formatCurrency(totalRevenue)}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="bg-orange-50 w-10 h-10 rounded-xl flex items-center justify-center text-orange-600 mb-6"><Package size={20} /></div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Sales</p>
                  <h3 className="text-2xl font-bold text-[#1a3c34] mt-1">{orders.length} Orders</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm sm:col-span-2 relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-[#1a3c34] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles size={14} className="text-yellow-500" /> AI Insights
                  </p>
                  <div className="space-y-3">
                    {businessTips.length > 0 ? businessTips.map((tip, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        <p className="text-sm font-semibold text-[#1a3c34]/80 leading-snug">{tip}</p>
                      </div>
                    )) : <p className="text-sm text-gray-400 italic">Generate insights to optimize your coffee shop.</p>}
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 p-4 opacity-5"><TrendingUp size={100} /></div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <h3 className="text-xl font-bold text-[#1a3c34] mb-6">Recent Transactions</h3>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    <tr>
                      <th className="pb-4">Order ID</th>
                      <th className="pb-4">Summary</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td className="py-4 font-bold text-gray-400">#{order.id}</td>
                        <td className="py-4 font-semibold text-[#1a3c34]">{order.items.length} beverage{order.items.length > 1 ? 's' : ''}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                            order.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-right font-bold text-[#1a3c34]">{formatCurrency(order.total)}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={4} className="py-8 text-center text-gray-400 italic font-medium">No sales recorded yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CART DRAWER - Desktop Always Visible / Mobile Modal */}
      <div className={`fixed inset-0 z-[70] transition-opacity duration-300 lg:hidden ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      </div>

      <aside className={`fixed right-0 top-0 h-full w-full sm:w-[400px] lg:w-96 bg-white z-[80] shadow-2xl flex flex-col transition-transform duration-500 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} ${currentView !== 'POS' ? 'lg:hidden' : 'lg:flex'}`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#f0f9f1] p-2 rounded-xl text-[#1a3c34]"><ShoppingBag size={20} /></div>
            <h2 className="text-xl font-bold text-[#1a3c34]">Order Detail</h2>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4"><ShoppingBag size={40} className="opacity-20" /></div>
              <p className="font-bold">Cart is empty</p>
              <p className="text-xs mt-1">Add items from the menu to start.</p>
            </div>
          ) : cart.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#1a3c34] text-sm leading-tight">{item.name}</h3>
                    <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                  <p className="text-[#1a3c34] font-bold text-sm mt-1">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 self-start px-3 py-1.5 rounded-xl border border-gray-100">
                  <button onClick={() => { if(item.quantity > 1) setCart(cart.map(c => c.id === item.id ? {...c, quantity: c.quantity - 1} : c)) }} className="text-gray-400 hover:text-[#1a3c34]"><Minus size={14} /></button>
                  <span className="text-sm font-extrabold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => setCart(cart.map(c => c.id === item.id ? {...c, quantity: c.quantity + 1} : c))} className="text-gray-400 hover:text-[#1a3c34]"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400 font-medium"><span>Subtotal</span><span className="text-[#1a3c34] font-bold">{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-gray-400 font-medium"><span>Tax (10%)</span><span className="text-[#1a3c34] font-bold">{formatCurrency(tax)}</span></div>
            <div className="flex justify-between text-xl font-bold border-t border-gray-200 pt-4 mt-2 text-[#1a3c34]"><span>Total Pay</span><span>{formatCurrency(total)}</span></div>
          </div>
          <button disabled={cart.length === 0} onClick={handleCheckout} className="w-full bg-[#1a3c34] text-white py-5 rounded-[1.8rem] font-bold flex items-center justify-center gap-3 hover:bg-[#2d5a4e] transition-all shadow-xl shadow-[#1a3c34]/20 disabled:opacity-50 disabled:shadow-none">
            <CreditCard size={20} /> Checkout Order
          </button>
        </div>
      </aside>

      {/* AI ASSISTANT MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setShowAiModal(false)} />
          <div className="relative bg-[#fdfdfb] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1a3c34] rounded-[1.2rem] flex items-center justify-center text-white shadow-lg"><Sparkles size={24} /></div>
                  <div><h2 className="text-xl font-bold text-[#1a3c34]">AI Barista</h2><p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Singgah Kita Intelligence</p></div>
                </div>
                <button onClick={() => setShowAiModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-600">Tell me what you're craving today?</p>
                <textarea value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} className="w-full h-28 p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-[#1a3c34]/5 outline-none resize-none text-sm transition-all" placeholder="e.g. Something cold and sweet but with a coffee kick..." />
                <button onClick={async () => { setAiLoading(true); const result = await new GeminiService().getSmartRecommendation(aiQuery, menu); setAiSuggestions(result.suggestions); setAiLoading(false); }} disabled={aiLoading || !aiQuery.trim()} className="w-full bg-[#1a3c34] text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-[#1a3c34]/20 transition-all flex items-center justify-center gap-2">
                  {aiLoading ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Thinking...</> : <><Sparkles size={18} /> Get Recommendation</>}
                </button>
              </div>
              <div className="mt-8 space-y-4 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                {aiSuggestions.map((s, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-50 shadow-sm flex items-start gap-4 group cursor-pointer hover:border-green-200 transition-colors">
                    <div className="w-1.5 h-full bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <h4 className="font-bold text-[#1a3c34] text-sm uppercase tracking-wide">{s.itemName}</h4>
                      <p className="text-xs text-gray-400 mt-1 italic leading-relaxed">"{s.baristaTip}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
