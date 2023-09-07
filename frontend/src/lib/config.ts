export const SERVER_HOSTNAME =
  document.location.hostname === "localhost"
    ? "http://localhost:8000"
    : document.location.origin;
