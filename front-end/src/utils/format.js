const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const formatINR = (value) => inr.format(Number(value) || 0);

export const formatDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', opts) : '—';

// Local YYYY-MM-DD (toISOString would shift the date across time zones).
export const toISODate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const addDays = (iso, days) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(`${checkOut}T00:00:00`) - new Date(`${checkIn}T00:00:00`);
  return Math.max(0, Math.round(ms / 86400000));
};

// Turn a DRF error response into one readable sentence.
export const apiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const data = error?.response?.data;
  if (!error?.response) return 'Cannot reach the server. Check your connection and try again.';
  if (!data) return fallback;
  if (typeof data === 'string') return fallback;
  if (data.detail) return data.detail;
  if (data.error) return data.error;
  const first = Object.entries(data)[0];
  if (!first) return fallback;
  const [field, value] = first;
  const msg = Array.isArray(value) ? value[0] : value;
  if (typeof msg !== 'string') return fallback;
  return field === 'non_field_errors' ? msg : `${field.replace(/_/g, ' ')}: ${msg}`;
};

// "Varkala, Kerala" -> "Varkala"
export const cityOf = (address = '') => address.split(',').map((s) => s.trim()).filter(Boolean)[0] || address;
