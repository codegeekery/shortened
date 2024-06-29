const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.codegeekery.com' : 'http://localhost:3001';
const HOME = process.env.NODE_ENV === 'production' ? 'https://shorter.codegeekery.com' : 'http://localhost:3000';

export { API_URL, HOME}