'use client';

import { useState } from 'react';
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';

export function usePost<TResponse = unknown, TBody = unknown, TError = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TError | string | null>(null);

  const post = async (
    url: string,
    body?: TBody,
    headers?: AxiosRequestHeaders
  ): Promise<{ success: boolean; response: TResponse | null; error: TError | null }> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<TResponse> = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
      });

      return {
        success: true,
        response: response.data,
        error: null,
      };
    } catch (err: any) {
      let parsedError: TError | string = 'Error desconocido';

      if (axios.isAxiosError(err)) {
        parsedError = err.response?.data as TError;
        console.error('❌ Axios error:', parsedError);
        setError(parsedError);
      } else {
        parsedError = err.message || 'Error desconocido';
        console.error('❌ Error general:', parsedError);
        setError(parsedError);
      }

      return {
        success: false,
        response: null,
        error: parsedError as TError,
      };
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error };
}
