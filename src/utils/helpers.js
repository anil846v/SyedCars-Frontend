// Format currency in Indian Rupees
export const formatINR = (amount) => {
  if (!amount && amount !== 0) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format compact number (e.g. 1.2L, 48K)
export const formatCompact = (num) => {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num;
};

// Savings percentage
export const savingsPercent = (asking, market) => {
  if (!asking || !market || market === 0) return 0;
  return Math.round(((market - asking) / market) * 100);
};

// Truncate text
export const truncate = (str, len = 80) =>
  str && str.length > len ? str.slice(0, len) + '…' : str;

// Validate email
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate Indian phone
export const isValidPhone = (phone) =>
  /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));

// Debounce
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Class names helper
export const cx = (...classes) =>
  classes.filter(Boolean).join(' ');
