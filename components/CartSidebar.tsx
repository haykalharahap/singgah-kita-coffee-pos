
import React from 'react';
import { Trash2, Minus, Plus, ShoppingBag, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  cart, 
  onUpdateQuantity, 
  onRemove,
  onCheckout
}) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <aside className="w-full lg:w-96 bg-white h-screen border-l border-gray-100 flex flex-col fixed right-0 top-0 z-40">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="text-[#1a3c34]" size={20} />
          <h2 className="text-xl font-bold">Current Order</h2>
        </div>
        <span className="bg-[#f0f9f1] text-[#1a3c34] px-3 py-1 rounded-full text-sm font-semibold">
          {cart.length} items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <ShoppingBag size={32} />
            </div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-[#1a3c34] font-bold text-sm mt-1">{formatCurrency(item.price)}</p>
                <div className="flex items-center gap-3 mt-auto bg-gray-50 self-start px-2 py-1 rounded-lg">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="text-gray-400 hover:text-[#1a3c34]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="text-gray-400 hover:text-[#1a3c34]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Tax (10%)</span>
            <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 mt-2">
            <span>Total</span>
            <span className="text-[#1a3c34]">{formatCurrency(total)}</span>
          </div>
        </div>

        <button 
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full bg-[#1a3c34] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#2d5a4e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard size={20} />
          Place Order
        </button>
      </div>
    </aside>
  );
};

export default CartSidebar;
