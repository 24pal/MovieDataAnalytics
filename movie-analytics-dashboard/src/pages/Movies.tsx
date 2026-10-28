import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Calendar, MessageSquare, ChevronLeft, ChevronRight, Loader2, Film } from 'lucide-react';
import { API_BASE } from '../config/api';

interface MovieItem {
  id: number;
  title: string;
  genres: string[];
  year: number | null;
  rating: number;
  ratingCount: number;
}

export const Movies: React.FC = () => {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch genres once on mount
  useEffect(() => {
    fetch(`${API_BASE}/genres`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setGenres(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load genres:", err));
  }, []);

  // Fetch movies catalog whenever filters change
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '12',
          genre: selectedGenre,
          search: search,
          sort_by: sortBy
        });
        const res = await fetch(`${API_BASE}/movies?${queryParams}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setMovies(Array.isArray(data?.movies) ? data.movies : []);
        setTotalPages(data?.totalPages || 1);
        setTotalCount(data?.total || 0);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchMovies();
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [page, selectedGenre, search, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header & Controls Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Movie Catalog Explorer</h1>
            <p className="text-sm text-slate-500 mt-1">
              Browse, filter, and inspect {totalCount.toLocaleString()} movies processed by Apache Spark
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-52 md:w-64"
              />
            </div>

            {/* Genre Dropdown */}
            <div className="relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 cursor-pointer"
              >
                <option value="All">All Genres</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 cursor-pointer"
            >
              <option value="popular">Most Reviewed</option>
              <option value="highest_rated">Highest Rated (Min 10 reviews)</option>
              <option value="newest">Release Year</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-sm border border-slate-200">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
          <p className="text-slate-600 font-medium">Fetching catalog from Apache Spark...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500">
          <Film className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-lg font-medium text-slate-700">No movies found</p>
          <p className="text-sm text-slate-400">Try adjusting your search query or genre filter.</p>
        </div>
      ) : (
        /* Movie Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Film className="w-5 h-5" />
                  </div>
                  {movie.year && (
                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      <Calendar className="w-3 h-3" /> {movie.year}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                  {movie.title}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200 font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-800">{movie.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  {movie.ratingCount.toLocaleString()} reviews
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {!loading && totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{((page - 1) * 12) + 1}</span> to{' '}
            <span className="font-semibold text-slate-700">{Math.min(page * 12, totalCount)}</span> of{' '}
            <span className="font-semibold text-slate-700">{totalCount.toLocaleString()}</span> movies
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>

            <span className="text-sm font-medium text-slate-700 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
