import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { Movies } from './pages/Movies';
import { Genres } from './pages/Genres';
import { Ratings } from './pages/Ratings';
import { Recommendations } from './pages/Recommendations';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="movies" element={<Movies />} />
          <Route path="genres" element={<Genres />} />
          <Route path="ratings" element={<Ratings />} />
          <Route path="recommendations" element={<Recommendations />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
