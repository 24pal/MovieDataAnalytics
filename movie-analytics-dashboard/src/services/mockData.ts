export interface Movie {
  id: number;
  title: string;
  genres: string[];
  rating: number;
  year: number;
}

export const movies: Movie[] = [
  { id: 1, title: 'The Shawshank Redemption', genres: ['Drama'], rating: 4.5, year: 1994 },
  { id: 2, title: 'The Godfather', genres: ['Crime', 'Drama'], rating: 4.4, year: 1972 },
  { id: 3, title: 'Fight Club', genres: ['Drama'], rating: 4.3, year: 1999 },
  { id: 4, title: 'Pulp Fiction', genres: ['Crime', 'Drama'], rating: 4.3, year: 1994 },
  { id: 5, title: 'The Dark Knight', genres: ['Action', 'Crime', 'Drama'], rating: 4.3, year: 2008 },
  { id: 6, title: 'Toy Story', genres: ['Animation', 'Comedy', 'Family'], rating: 4.0, year: 1995 },
  { id: 7, title: 'Inception', genres: ['Action', 'Sci-Fi', 'Thriller'], rating: 4.2, year: 2010 },
  { id: 8, title: 'The Matrix', genres: ['Action', 'Sci-Fi'], rating: 4.2, year: 1999 },
  { id: 9, title: 'Interstellar', genres: ['Adventure', 'Drama', 'Sci-Fi'], rating: 4.1, year: 2014 },
  { id: 10, title: 'The Lord of the Rings: The Return of the King', genres: ['Action', 'Adventure', 'Drama'], rating: 4.4, year: 2003 },
];

export const kpiData = {
  totalMovies: 9742,
  totalUsers: 3683,
  totalGenres: 610,
  averageRating: 3.50,
};

export const moviesByGenre = [
  { genre: 'Drama', count: 2130 },
  { genre: 'Comedy', count: 1710 },
  { genre: 'Action', count: 1420 },
  { genre: 'Thriller', count: 980 },
  { genre: 'Romance', count: 760 },
  { genre: 'Sci-Fi', count: 620 },
  { genre: 'Horror', count: 540 },
];

export const ratingDistribution = [
  { rating: '5', percentage: 23.4, count: 2280 },
  { rating: '4', percentage: 32.1, count: 3127 },
  { rating: '3', percentage: 20.5, count: 1997 },
  { rating: '2', percentage: 13.2, count: 1286 },
  { rating: '1', percentage: 10.8, count: 1052 },
];

export const moviesOverYears = [
  { year: 1995, count: 200 },
  { year: 2000, count: 350 },
  { year: 2005, count: 480 },
  { year: 2010, count: 600 },
  { year: 2015, count: 850 },
  { year: 2020, count: 780 },
];

export const avgRatingByGenre = [
  { genre: 'Drama', rating: 3.9 },
  { genre: 'Crime', rating: 3.8 },
  { genre: 'Action', rating: 3.6 },
  { genre: 'Adventure', rating: 3.5 },
  { genre: 'Comedy', rating: 3.4 },
  { genre: 'Thriller', rating: 3.3 },
  { genre: 'Romance', rating: 3.2 },
  { genre: 'Sci-Fi', rating: 3.1 },
  { genre: 'Horror', rating: 2.9 },
];

export const recommendations = [
  { id: 101, title: 'Toy Story 2', genres: ['Animation', 'Comedy', 'Family'], match: 92 },
  { id: 102, title: 'Monsters, Inc.', genres: ['Animation', 'Comedy', 'Family'], match: 88 },
  { id: 103, title: 'Finding Nemo', genres: ['Animation', 'Adventure', 'Family'], match: 85 },
  { id: 104, title: 'The Incredibles', genres: ['Animation', 'Action', 'Comedy'], match: 82 },
  { id: 105, title: 'Shrek', genres: ['Animation', 'Comedy', 'Family'], match: 79 },
];

// Data layer function to fetch movies
export const getTopMovies = () => {
  return movies.sort((a, b) => b.rating - a.rating).slice(0, 5);
};
