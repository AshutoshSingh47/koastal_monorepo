import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    withCredentials?: boolean;
    getToken?: () => string | null;
    onUnauthorized?: () => void;
    onError?: (error: AxiosError) => void;
}

export class ApiClient {
    private client: AxiosInstance;
    private config: ApiClientConfig;

    constructor(config: ApiClientConfig) {
        this.config = config;

        // Create axios instance
        this.client = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 30000,
            withCredentials: config.withCredentials ?? true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Setup retry logic
        axiosRetry(this.client, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (error) => {
                return (
                    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
                    (error.response?.status ?? 0) >= 500
                );
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add auth token
                const token = this.config.getToken?.();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add timestamp for performance tracking
                config.metadata = { startTime: new Date() };

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                // Log API calls in development
                if (process.env.NODE_ENV === 'development') {
                    const duration = new Date().getTime() - (response.config.metadata?.startTime?.getTime() || new Date().getTime());
                    console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
                }
                return response;
            },
            async (error: AxiosError) => {
                // Handle 401 Unauthorized
                if (error.response?.status === 401) {
                    this.config.onUnauthorized?.();
                }

                // Format error message
                if (error.response) {
                    const data = error.response.data as any;
                    const message = data?.message || data?.error || this.getDefaultErrorMessage(error.response.status);

                    const enhancedError = new Error(message);
                    (enhancedError as any).status = error.response.status;
                    (enhancedError as any).data = data;

                    this.config.onError?.(error);
                    return Promise.reject(enhancedError);
                }

                // Network error
                if (error.request) {
                    const networkError = new Error('Network error. Please check your connection.');
                    this.config.onError?.(error);
                    return Promise.reject(networkError);
                }

                return Promise.reject(error);
            }
        );
    }

    private getDefaultErrorMessage(status: number): string {
        const messages: Record<number, string> = {
            400: 'Bad request. Please check your input.',
            401: 'Unauthorized. Please login again.',
            403: 'Access denied.',
            404: 'Resource not found.',
            429: 'Too many requests. Please try again later.',
            500: 'Server error. Please try again later.',
        };
        return messages[status] || 'An error occurred. Please try again.';
    }

    // HTTP methods
    public get<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.client.get<T>(url, config);
    }

    public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.client.post<T>(url, data, config);
    }

    public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.client.put<T>(url, data, config);
    }

    public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.client.patch<T>(url, data, config);
    }

    public delete<T = any>(url: string, config?: AxiosRequestConfig) {
        return this.client.delete<T>(url, config);
    }

    public getInstance() {
        return this.client;
    }
}

// Extend AxiosRequestConfig for metadata
declare module 'axios' {
    export interface AxiosRequestConfig {
        metadata?: {
            startTime: Date;
        };
    }
}
