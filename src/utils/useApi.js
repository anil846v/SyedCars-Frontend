/**
 * Simple async state hook for API calls
 */
import { useState, useCallback } from 'react';

export function useApi(apiFn, opts = {}) {
  const [data,    setData]    = useState(opts.initialData ?? null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      const result = res?.data ?? res;
      setData(result);
      opts.onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      opts.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute, setData };
}

export function usePagination(apiFn) {
  const [items,      setItems]      = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  const fetch = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(params);
      const d = res?.data ?? res;
      setItems(d?.cars ?? d?.owners ?? d?.commissions ?? d?.enquiries ?? d ?? []);
      if (d?.pagination) setPagination(d.pagination);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  return { items, pagination, loading, error, fetch, setItems };
}
