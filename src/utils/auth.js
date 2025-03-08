export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the token payload
    return Date.now() >= payload.exp * 1000; // Check if the token is expired
  } catch {
    return true; // If there's an error, assume the token is expired
  }
};