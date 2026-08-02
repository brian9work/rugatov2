'use client';

import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

export function useGet<T>(url: string) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const response: AxiosResponse<T> = await axios.get(url, {
        headers,
      });

      setData(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error(`Error en la petición ${url}`);
        console.error(`Status: ${err.response?.status}`);
      } else {
        console.error(err);
        setError(err.message || 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
