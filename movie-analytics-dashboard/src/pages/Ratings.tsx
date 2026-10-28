import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Star, MessageSquare, ThumbsUp, Award, Loader2, Clapperboard, Calendar } from 'lucide-react';
import { API_BASE } from '../config/api';

interface RatingDistributionItem {
  rating: string;
  count: number;
  percentage: number;
}

interface MostRatedMovie {
  id: number;
  title: string;
  genres: string[];
  rating: number;
  ratingCount: number;
  year: number | null;
}

interface RatingAnalyticsData {
  totalRatings: number;
  avgRating: number;
  distribution: RatingDistributionItem[];
  mostRatedMovies: MostRatedMovie[];
}

export const Ratings: React.FC = () => {
  const [data, setData] = useState<RatingAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const res = await fetch(`${API_BASE}/rating_analytics`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json && Array.isArray(json.distribution)) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load rating analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRatingData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-sm border border-slate-200">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
        <p className="text-slate-600 font-medium">Aggregating 100,000+ ratings with Apache Spark...</p>
      </div>
    );
  }

  // Derive extra stats
  const mostFrequentRating = [...data.distribution].sort((a, b) => b.count - a.count)[0];
  const positiveRatingsCount = data.distribution
    .filter(d => parseFloat(d.rating) >= 4.0)
    .reduce((acc, curr) => acc + curr.count, 0);
  const positivePercentage = ((positiveRatingsCount / data.totalRatings) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total User Reviews</p>
            <h3 className="text-2xl font-bold text-slate-800">{data.totalRatings.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">ratings across 9,742 movies</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Dataset Average Rating</p>
            <h3 className="text-2xl font-bold text-slate-800">{data.avgRating.toFixed(2)}</h3>
            <p className="text-xs text-slate-400 mt-1">on a 0.5 - 5.0 scale</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Positive Ratings (≥ 4★)</p>
            <h3 className="text-2xl font-bold text-slate-800">{positivePercentage}%</h3>
            <p className="text-xs text-slate-400 mt-1">{positiveRatingsCount.toLocaleString()} votes</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Most Common Score</p>
            <h3 className="text-2xl font-bold text-slate-800">{mostFrequentRating?.rating} Stars</h3>
            <p className="text-xs text-slate-400 mt-1">{mostFrequentRating?.percentage}% of all reviews</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Full 10-tier Distribution Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Granular Rating Distribution</h2>
          <p className="text-sm text-slate-500 mb-6">Vote count for every rating score from 0.5★ to 5.0★</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="rating" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  formatter={(val: any, _name: any, item: any) => [
                    `${Number(val).toLocaleString()} votes (${item.payload.percentage}%)`,
                    'Count'
                  ]}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating Percentage Curve Area Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Rating Frequency Curve (%)</h2>
          <p className="text-sm text-slate-500 mb-6">Probability density curve showing audience rating bias</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="rating" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis unit="%" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}% of total votes`, 'Percentage']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#ratingGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hall of Fame: Top 10 Most Reviewed Movies */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Most Reviewed Movies (Hall of Fame)</h2>
            <p className="text-sm text-slate-500">The 10 most rated movies across the entire MovieLens corpus</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
            Top 10 by Volume
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Movie Title</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">Genres</th>
                <th className="px-6 py-4">Review Count</th>
                <th className="px-6 py-4">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.mostRatedMovies.map((movie, idx) => (
                <tr key={movie.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-300'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-700 ring-2 ring-slate-300'
                        : idx === 2
                        ? 'bg-amber-700/20 text-amber-900 ring-2 ring-amber-600/30'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                    <Clapperboard className="w-4 h-4 text-blue-500 shrink-0" />
                    {movie.title}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <span className="inline-flex items-center gap-1 text-xs font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {movie.year || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.map((g) => (
                        <span key={g} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {movie.ratingCount.toLocaleString()} reviews
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {movie.rating.toFixed(1)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
