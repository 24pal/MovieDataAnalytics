import React from 'react';
import { Search, Bell, Settings, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Movie Analytics Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Explore movie insights, trends and personalized recommendations</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium">
            <option>All Genres</option>
            <option>Action</option>
            <option>Comedy</option>
            <option>Drama</option>
            <option>Sci-Fi</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-64 pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
            placeholder="Search for a movie..."
          />
        </div>
        <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm ring-2 ring-slate-100">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};
