const API_URL = process.env.NODE_ENV === 'production' ? 'https://shortened-url-backend.vercel.app' : 'http://localhost:3001';
const HOME = process.env.NODE_ENV === 'production' ? 'https://shortened-url.vercel.app' : 'http://localhost:3000';

export { API_URL, HOME}