import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { handleApiError } from "./apiErrorHandler";
import { API_TIMEOUT_MS } from "@/constants/appConfig";
import { USER_DATA_STORAGE_KEY } from "@/constants/storageKeys";
import { getAuthToken, clearAuthToken } from "@/utils/secureStorage";
import { logger } from "@/utils/logger";

const SCOPE = "apiClient";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("EXPO_PUBLIC_API_BASE_URL is not configured");
}

// Configure axios defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT_MS,
});

const PUBLIC_AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// Attach token before each request if available
apiClient.interceptors.request.use(
  async (config) => {
    logger.debug(
      SCOPE,
      `API request: ${config.method?.toUpperCase()} ${config.url}`,
    );

    const url = config.url ?? "";
    const isPublicAuthEndpoint = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
      url.includes(endpoint),
    );

    // Attach auth token (await AsyncStorage)
    if (!isPublicAuthEndpoint) {
      try {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        logger.warn(SCOPE, "Failed to read auth token", err);
      }
    }

    return config;
  },
  (error) => {
    logger.error(SCOPE, "Request setup failed", error);
    return Promise.reject(error);
  },
);

// Log responses and handle global errors
apiClient.interceptors.response.use(
  (response) => {
    logger.debug(
      SCOPE,
      `API response: ${response.status} ${response.config.url}`,
    );
    return response;
  },
  async (error) => {
    const normalized = handleApiError(error);

    logger.error(
      SCOPE,
      `API error: ${error.config?.url ?? "unknown endpoint"}`,
      normalized,
    );

    // If unauthorized, clear stored auth data. Navigation should be
    // performed by the UI layer instead of the API client to avoid
    // surprising side-effects during background requests.
    if (normalized.status === 401) {
      try {
        await clearAuthToken();
        await AsyncStorage.removeItem(USER_DATA_STORAGE_KEY);
      } catch (e) {
        logger.warn(SCOPE, "Failed to clear local auth data", e);
      }
    }

    // Reject with a normalized error object so thunks can extract message
    return Promise.reject(normalized);
  },
);

export default apiClient;
