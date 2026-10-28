import React from 'react';
import { NavLink } from 'react-router-dom';
import { Clapperboard, Home, Film, Tags, Star, Crosshair, Info } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Overview', path: '/', icon: Home },
  { name: 'Movies', path: '/movies', icon: Film },
  { name: 'Genres', path: '/genres', icon: Tags },
  { name: 'Ratings', path: '/ratings', icon: Star },
  { name: 'Recommendations', path: '/recommendations', icon: Crosshair },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-sidebar text-slate-300 flex flex-col min-h-screen">
      <div className="p-6 flex items-center gap-3 text-white">
        <Clapperboard className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-xl font-bold leading-tight">Movie Analytics</h1>
          <p className="text-xs text-slate-400">Insights &bull; Trends &bull; Recommendations</p>
        </div>
      </div>
      <nav className="flex-1 px-4 mt-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500">
          <Info className="w-4 h-4" />
          <span>Powered by Apache Spark</span>
        </div>
      </div>
    </aside>
  );
};
