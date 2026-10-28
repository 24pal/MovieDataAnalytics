import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users as UsersIcon, UserCheck, Activity, Award, Star, Heart, Loader2, Sparkles } from 'lucide-react';
import { API_BASE } from '../config/api';

const TIER_COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

interface UserTier {
  tier: string;
  users: number;
  percentage: number;
}

interface TopUser {
  userId: number;
  ratingCount: number;
  avgRating: number;
  favoriteGenre: string;
}

interface UserAnalyticsData {
  totalUsers: number;
  totalRatings: number;
  avgRatingsPerUser: number;
  tiers: UserTier[];
  topUsers: TopUser[];
}

export const Users: React.FC = () => {
  const [data, setData] = useState<UserAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_BASE}/user_analytics`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load user analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-sm border border-slate-200">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
        <p className="text-slate-600 font-medium">Profiling user cohorts with Apache Spark...</p>
      </div>
    );
  }

  const mostActiveUser = data.topUsers[0];
  const powerTier = data.tiers.find(t => t.tier.includes('Power'));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Active Users</p>
            <h3 className="text-2xl font-bold text-slate-800">{data.totalUsers.toLocaleString()}</h3>
            <p className="text-xs text-slate-400 mt-1">unique raters in corpus</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Average Activity</p>
            <h3 className="text-2xl font-bold text-slate-800">{data.avgRatingsPerUser}</h3>
            <p className="text-xs text-slate-400 mt-1">reviews per user</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Top Power Contributor</p>
            <h3 className="text-2xl font-bold text-slate-800">User #{mostActiveUser?.userId}</h3>
            <p className="text-xs text-slate-400 mt-1">{mostActiveUser?.ratingCount.toLocaleString()} movies rated</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Power Users (&gt; 200 reviews)</p>
            <h3 className="text-2xl font-bold text-slate-800">{powerTier?.users || 0} Users</h3>
            <p className="text-xs text-slate-400 mt-1">{powerTier?.percentage}% of community</p>
          </div>
        </div>
      </div>

      {/* Cohort Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Cohort Donut Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">User Activity Tiers</h2>
            <p className="text-sm text-slate-500 mb-4">Breakdown of user participation volume</p>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.tiers}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="users"
                  nameKey="tier"
                >
                  {data.tiers.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={TIER_COLORS[index % TIER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} users`, name]}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-800">{data.totalUsers}</span>
              <p className="text-xs text-slate-400 font-medium">Total Users</p>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-slate-100">
            {data.tiers.map((t, idx) => (
              <div key={t.tier} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TIER_COLORS[idx] }}></span>
                  <span className="text-slate-600 font-medium">{t.tier}</span>
                </div>
                <span className="font-bold text-slate-800">{t.users} ({t.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Behavior Insights Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">User Engagement Dynamics</h2>
            <p className="text-sm text-slate-500 mb-6">Behavior patterns identified through collaborative filtering logs</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Long-Tail Rating Distribution</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    A core group of <strong>{powerTier?.users} power users</strong> drives over 45% of all rating interactions. 
                    This creates the high-density rating clusters that allow Apache Spark’s ALS matrix factorization algorithm to identify latent tastes.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Genre Affinity Loyalty</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Most active users show strong affinity toward <strong>Drama</strong> and <strong>Action</strong>, 
                    with rating bias averaging <strong>3.39 to 3.85 stars</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Collaborative Filtering Cold-Start Mitigation</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Casual users (rating &le; 50 titles) benefit from hybrid fallback recommendations, 
                    using genre similarity when personal latent vectors have lower confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 10 Most Active Users Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Top 10 Power Users Leaderboard</h2>
            <p className="text-sm text-slate-500">The most prolific movie reviewers in the dataset</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
            PySpark User Cohort
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Total Reviews</th>
                <th className="px-6 py-4">Average Rating Given</th>
                <th className="px-6 py-4">Favorite Genre</th>
                <th className="px-6 py-4">Reviewer Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.topUsers.map((user, idx) => (
                <tr key={user.userId} className="hover:bg-slate-50 transition-colors">
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
                  <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      U{user.userId}
                    </div>
                    <span>User #{user.userId}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {user.ratingCount.toLocaleString()} reviews
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {user.avgRating.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {user.favoriteGenre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                      {idx === 0 ? '🏆 Elite Critic' : idx < 3 ? '⭐ Master Reviewer' : '🔥 Power User'}
                    </span>
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
