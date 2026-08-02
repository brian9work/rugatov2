'use client'

import { useState } from 'react'
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';

export function usePut<TResponse = unknown, TBody = unknown>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const put = async (
    url: string, 
    body: TBody,
    headers?: AxiosRequestHeaders
  ): Promise<{success: boolean, response: TResponse} | null> => {
    setLoading(true)
    setError(null)

    try {
      const response: AxiosResponse<TResponse> = await axios.put(url, body, {
        headers: {
          'Content-Type': 'application/json',
          ...(headers || {}),
        },
      });

      return {
        success: true,
        response: response.data
      };
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error(`Error en la petición ${url}`);
        console.error(`Status: ${err.response?.status}`);
        console.error(err.response?.data);
        setError(
          `Error ${err.response?.status}: ${JSON.stringify(err.response?.data)}`
        );
      } else {
        console.error(err);
        setError(err.message || 'Error desconocido');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { put, loading, error }
}
