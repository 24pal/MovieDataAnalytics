import React, { useState, useEffect, useRef } from 'react';
import { Crosshair, Loader2, Search } from 'lucide-react';
import { API_BASE } from '../config/api';

export const Recommendations: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState('Toy Story (1995)');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial load
    fetchRecommendations('Toy Story (1995)');
  }, []);

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/search_movies?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const fetchRecommendations = async (movieTitle: string) => {
    setLoading(true);
    setError('');
    setShowDropdown(false);
    setSelectedMovie(movieTitle);
    setSearchQuery('');
    
    try {
      const res = await fetch(`${API_BASE}/recommendations?movie=${encodeURIComponent(movieTitle)}`);
      if (!res.ok) {
        throw new Error('Movie not found or failed to fetch recommendations.');
      }
      const data = await res.json();
      setRecommendations(data);
    } catch (err: any) {
      setError(err.message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-[440px] flex flex-col relative">
        <div className="flex items-center gap-2 mb-4">
          <Crosshair className="text-blue-500 w-6 h-6" />
          <h2 className="text-lg font-bold text-slate-800">Get Recommendations (ALS)</h2>
        </div>
        
        <div className="mb-4 relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search for a movie</label>
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-9 pr-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-sm"
                value={searchQuery || selectedMovie}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedMovie) setSelectedMovie('');
                }}
                onFocus={() => {
                  if (selectedMovie) {
                    setSearchQuery(selectedMovie);
                    setSelectedMovie('');
                  }
                }}
                placeholder="Type to search movies..."
              />
            </div>
            <button 
              onClick={() => fetchRecommendations(selectedMovie || searchQuery)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm text-sm"
            >
              Get
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Currently showing recs for: <span className="font-semibold text-blue-500">{selectedMovie || '...'}</span></p>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <div 
                  key={idx}
                  className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                  onClick={() => fetchRecommendations(result.title)}
                >
                  <p className="text-sm font-medium text-slate-800">{result.title}</p>
                  <p className="text-xs text-slate-500">{result.genres.join(', ')}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar mt-2">
          <h3 className="text-sm font-bold text-slate-800 mb-3 sticky top-0 bg-white z-10 py-1">Recommended Movies</h3>
          
          {loading ? (
             <div className="flex justify-center items-center h-32">
               <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
             </div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : recommendations.length === 0 ? (
            <div className="text-slate-500 text-sm">No recommendations found.</div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec: any) => (
                <div key={rec.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group relative">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-md bg-slate-200 overflow-hidden flex-shrink-0 relative">
                       <img src={`https://picsum.photos/seed/${rec.id}/100/150`} alt={rec.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm truncate" title={rec.title}>{rec.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{rec.genres.join(' | ')}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded ml-2 flex-shrink-0">
                    {rec.match}% Match
                  </div>
                  
                  {/* Hover Movie Poster Pop-up */}
                  <div className="hidden group-hover:block absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 w-48 bg-white p-2 rounded-xl shadow-2xl border border-slate-200">
                     <img src={`https://picsum.photos/seed/${rec.id}/200/300`} alt={rec.title} className="w-full h-auto rounded-lg mb-2" />
                     <h4 className="font-bold text-slate-800 text-sm text-center leading-tight">{rec.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
