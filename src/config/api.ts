const isProduction = import.meta.env.MODE === 'production';

// In production, we assume the API is at the same domain/relative path.
// In development, we point to the XAMPP server.
export const API_BASE_URL = isProduction
    ? "/api"
    : "http://localhost:5000/api";

export const IMG_BASE_URL = isProduction
    ? "" // Relative to root
    : "http://localhost/CRM Project";
