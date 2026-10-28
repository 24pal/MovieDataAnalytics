import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Layers, Award, TrendingUp, Star, Film, Loader2, ArrowRight } from 'lucide-react';
import { API_BASE } from '../config/api';

interface GenreStat {
  genre: string;
  movieCount: number;
  ratingCount: number;
  avgRating: number;
}

interface TopMovieInGenre {
  id: number;
  title: string;
  genres: string[];
  rating: number;
  ratingCount: number;
  year: number | null;
}

export const Genres: React.FC = () => {
  const [genreStats, setGenreStats] = useState<GenreStat[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('Drama');
  const [topMovies, setTopMovies] = useState<TopMovieInGenre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [moviesLoading, setMoviesLoading] = useState<boolean>(false);

  // Fetch full genre analytics
  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const res = await fetch(`${API_BASE}/genre_analytics`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const statsList = Array.isArray(data) ? data : [];
        setGenreStats(statsList);
        if (statsList.length > 0) {
          setSelectedGenre(statsList[0].genre);
        }
      } catch (err) {
        console.error("Failed to load genre analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGenreData();
  }, []);

  // Fetch top movies for selected genre
  useEffect(() => {
    if (!selectedGenre) return;
    const fetchTopMoviesForGenre = async () => {
      setMoviesLoading(true);
      try {
        const res = await fetch(`${API_BASE}/genre_top_movies?genre=${encodeURIComponent(selectedGenre)}&limit=6`);
        const data = await res.json();
        setTopMovies(data || []);
      } catch (err) {
        console.error("Failed to load top movies for genre:", err);
      } finally {
        setMoviesLoading(false);
      }
    };
    fetchTopMoviesForGenre();
  }, [selectedGenre]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-sm border border-slate-200">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
        <p className="text-slate-600 font-medium">Computing genre distributions with Apache Spark...</p>
      </div>
    );
  }

  // Derive summary metrics
  const topByCount = genreStats.length > 0 ? [...genreStats].sort((a, b) => b.movieCount - a.movieCount)[0] : null;
  const topByRating = genreStats.length > 0 ? [...genreStats].sort((a, b) => b.avgRating - a.avgRating)[0] : null;
  const topByPopularity = genreStats.length > 0 ? [...genreStats].sort((a, b) => b.ratingCount - a.ratingCount)[0] : null;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Genres</p>
            <h3 className="text-2xl font-bold text-slate-800">{genreStats.length}</h3>
            <p className="text-xs text-slate-400 mt-1">in Apache Spark dataset</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Most Produced Genre</p>
            <h3 className="text-2xl font-bold text-slate-800">{topByCount?.genre || '-'}</h3>
            <p className="text-xs text-slate-400 mt-1">{topByCount?.movieCount.toLocaleString()} movies</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Highest Rated Genre</p>
            <h3 className="text-2xl font-bold text-slate-800">{topByRating?.genre || '-'}</h3>
            <p className="text-xs text-slate-400 mt-1">⭐ {topByRating?.avgRating} / 5.0 avg</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Most Reviewed Genre</p>
            <h3 className="text-2xl font-bold text-slate-800">{topByPopularity?.genre || '-'}</h3>
            <p className="text-xs text-slate-400 mt-1">{topByPopularity?.ratingCount.toLocaleString()} user reviews</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movies count per genre */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Movie Volume by Genre</h2>
          <p className="text-sm text-slate-500 mb-6">Total number of catalog titles mapped to each genre</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genreStats.slice(0, 10)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="genre" angle={-35} textAnchor="end" interval={0} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} movies`, 'Count']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="movieCount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg Rating per Genre */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Average Rating by Genre</h2>
          <p className="text-sm text-slate-500 mb-6">Audience reception across all genre categories (out of 5.0)</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...genreStats].sort((a, b) => b.avgRating - a.avgRating).slice(0, 10)}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[2.5, 4.0]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis type="category" dataKey="genre" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  formatter={(val: any) => [`⭐ ${Number(val).toFixed(2)}`, 'Avg Rating']}
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="avgRating" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Genre Deep Dive & Top Movies */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Genre Deep Dive: Top Movies</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Select any genre to see its highest-rated hallmark films computed by Apache Spark
            </p>
          </div>

          {/* Interactive Genre Chips */}
          <div className="flex flex-wrap gap-2 max-w-xl">
            {genreStats.slice(0, 12).map((g) => (
              <button
                key={g.genre}
                onClick={() => setSelectedGenre(g.genre)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedGenre === g.genre
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g.genre}
              </button>
            ))}
          </div>
        </div>

        {/* Top Movies for Selected Genre */}
        {moviesLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-2" />
            <span className="text-slate-500 font-medium">Loading {selectedGenre} movies...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topMovies.map((movie, idx) => (
              <div
                key={movie.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3 pr-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{movie.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {movie.year || 'Unknown year'} • {movie.ratingCount} reviews
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {movie.rating.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comprehensive Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">All Genres Summary Table</h2>
          <p className="text-sm text-slate-500">Comprehensive Spark aggregation metrics per category</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Genre</th>
                <th className="px-6 py-4">Total Movies</th>
                <th className="px-6 py-4">Total Ratings</th>
                <th className="px-6 py-4">Average Rating</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {genreStats.map((stat) => (
                <tr key={stat.genre} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    {stat.genre}
                  </td>
                  <td className="px-6 py-4">{stat.movieCount.toLocaleString()}</td>
                  <td className="px-6 py-4">{stat.ratingCount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-700">{stat.avgRating.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedGenre(stat.genre);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                    >
                      Inspect <ArrowRight className="w-3 h-3" />
                    </button>
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
