
import React from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  ClipboardList, 
  Users, 
  Settings, 
  LogOut, 
  Coffee 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: false },
    { icon: <Utensils size={20} />, label: 'Menu', active: true },
    { icon: <ClipboardList size={20} />, label: 'Orders', active: false },
    { icon: <Users size={20} />, label: 'Customers', active: false },
    { icon: <Settings size={20} />, label: 'Settings', active: false },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-[#1a3c34] text-white h-screen flex flex-col p-4 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="bg-[#e6f4ea] p-2 rounded-xl">
          <img
            src="/logo/singgahkitalogo.svg"
            alt="Singgah Kita Logo"
            className="w-6 h-8 object-contain"
          />
        </div>
        <div className="hidden lg:block">
          <h1 className="font-bold text-lg leading-tight">Singgah Kita</h1>
          <p className="text-xs text-green-200/60 uppercase tracking-widest font-semibold">Coffee</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
              item.active 
                ? 'bg-[#2d5a4e] text-white' 
                : 'text-green-100/50 hover:bg-[#2d5a4e] hover:text-white'
            }`}
          >
            {item.icon}
            <span className="hidden lg:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-4 px-3 py-3 mt-auto text-green-100/50 hover:text-white transition-colors">
        <LogOut size={20} />
        <span className="hidden lg:block font-medium">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
