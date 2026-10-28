import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Clapperboard, Users, Star, Tags, Loader2 } from 'lucide-react';
import { Recommendations } from './Recommendations'; 

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];
const PIE_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7'];

import { API_BASE } from '../config/api';

export const Overview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    kpis: null,
    topMovies: [],
    moviesByGenre: [],
    ratingDistribution: [],
    moviesOverYears: [],
    avgRatingByGenre: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const safeFetch = async (url: string) => {
          const r = await fetch(url);
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        };

        const [kpis, topMovies, moviesByGenre, ratingDist, moviesOverYears, avgRatingByGenre] = await Promise.all([
          safeFetch(`${API_BASE}/kpis`),
          safeFetch(`${API_BASE}/top_movies`),
          safeFetch(`${API_BASE}/movies_by_genre`),
          safeFetch(`${API_BASE}/rating_distribution`),
          safeFetch(`${API_BASE}/movies_over_years`),
          safeFetch(`${API_BASE}/avg_rating_by_genre`)
        ]);
        
        setData({
          kpis,
          topMovies: Array.isArray(topMovies) ? topMovies : [],
          moviesByGenre: Array.isArray(moviesByGenre) ? moviesByGenre : [],
          ratingDistribution: Array.isArray(ratingDist) ? ratingDist : [],
          moviesOverYears: Array.isArray(moviesOverYears) ? moviesOverYears : [],
          avgRatingByGenre: Array.isArray(avgRatingByGenre) ? avgRatingByGenre : []
        });
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg font-medium">Crunching data with Apache Spark...</p>
        <p className="text-sm">This may take a few seconds on the first load.</p>
      </div>
    );
  }

  if (!data || !data.kpis || typeof data.kpis.totalMovies !== 'number') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center">
          <p className="text-lg font-bold text-slate-800 mb-2">Failed to load data from backend</p>
          <p className="text-sm text-slate-500 mb-6">Please ensure the PySpark backend is running.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { kpis, topMovies, moviesByGenre, ratingDistribution, moviesOverYears, avgRatingByGenre } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Clapperboard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Movies</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpis.totalMovies?.toLocaleString() ?? '-'}</h3>
            <p className="text-xs text-slate-400 mt-1">in dataset</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpis.totalUsers?.toLocaleString() ?? '-'}</h3>
            <p className="text-xs text-slate-400 mt-1">unique users</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <Tags className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Genres</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpis.totalGenres?.toLocaleString() ?? '-'}</h3>
            <p className="text-xs text-slate-400 mt-1">unique genres</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Average Rating</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpis.averageRating?.toFixed(2) ?? '-'}</h3>
            <p className="text-xs text-slate-400 mt-1">out of 5</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Movies Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-1 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Top Movies (50+ Ratings)</h2>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                  <th className="pb-3 pl-2">#</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Genre</th>
                  <th className="pb-3 text-right pr-2">Rating</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700">
                {topMovies.map((movie: any, index: number) => (
                  <tr key={movie.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 pl-2 text-slate-400">{index + 1}</td>
                    <td className="py-3 font-medium text-slate-800 line-clamp-1">{movie.title}</td>
                    <td className="py-3 text-slate-500">{movie.genres[0]}</td>
                    <td className="py-3 text-right pr-2">
                      <span className="text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                        {movie.rating.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Movies by Genre Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Movies by Genre</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moviesByGenre} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="genre" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {moviesByGenre.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating Distribution Donut */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Rating Distribution</h2>
          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratingDistribution}
                  cx="40%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="percentage"
                  stroke="none"
                >
                  {ratingDistribution.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: any) => [`${value}%`, 'Percentage']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {ratingDistribution.map((entry: any, index: number) => (
                <div key={entry.rating} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                  <span className="font-medium text-slate-700">{entry.rating}</span>
                  <span className="text-slate-400">({entry.percentage}%)</span>
                </div>
              ))}
            </div>
            <div className="absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="block text-xl font-bold text-slate-800">{kpis.totalMovies.toLocaleString()}</span>
              <span className="block text-xs text-slate-500">Total Ratings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Movies Released Over Years Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Movies Released (1990+)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moviesOverYears} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Rating by Genre Horizontal Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Avg Rating by Genre</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgRatingByGenre} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis type="category" dataKey="genre" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                <RechartsTooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="rating" radius={[0, 4, 4, 0]} barSize={16}>
                   {avgRatingByGenre.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="lg:col-span-1">
          <Recommendations />
        </div>
      </div>
    </div>
  );
};
