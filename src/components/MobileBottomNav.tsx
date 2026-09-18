import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  Calculator,
  Layers,
  Bot,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const items = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/start', label: 'Start', icon: Compass, end: false },
    { to: '/tools', label: 'Tools', icon: Calculator, end: false },
    { to: '/workout-builder', label: 'Builder', icon: Layers, end: false },
    { to: '/ai-coach', label: 'AI Coach', icon: Bot, end: false },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 lg:hidden px-3 py-1.5 shadow-2xl"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-400 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg transition-colors ${
                      isActive ? 'bg-emerald-500/15' : 'bg-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
