'use client'

import { useState } from 'react'
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';

export function useDelete<TResponse = unknown>() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const del = async (
        url: string,
        headers?: AxiosRequestHeaders
    ): Promise<
        {
            all: AxiosResponse<TResponse> | null,
            success: boolean,
            message: any
        } | null> => {
        setLoading(true)
        setError(null)

        try {
            const response = await axios.delete(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(headers || {}),
                },
            });

            return {
                all: response,
                success: response.status === 200 ? true : false,
                message: response.data
            }
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

    return { del, loading, error }
}
