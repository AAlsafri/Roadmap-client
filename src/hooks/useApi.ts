import { fetchWithResponse } from "@/services/fetcher";
import { useState, useCallback } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiError extends Error {
  status?: number;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
}

export const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const callApi = useCallback(
    async <T = any>(
      method: HttpMethod,
      url: string,
      data: any = null
    ): Promise<ApiResponse<T>> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWithResponse(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: data ? JSON.stringify(data) : undefined,
        });
        setLoading(false);
        return response as ApiResponse<T>;
      } catch (err) {
        const apiError: ApiError =
          err instanceof Error ? err : new Error("An unknown error occurred");
        setError(apiError);
        setLoading(false);
        throw apiError;
      }
    },
    []
  );

  return { callApi, loading, error };
};
