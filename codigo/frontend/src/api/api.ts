import { axiosComBaseUrl, BaseUrlKey } from "@/api/config";
import { AxiosResponse } from 'axios';

export async function get<T>(endpoint: string, baseUrlKey: BaseUrlKey, authorization: string): Promise<AxiosResponse<T>> {
  const axiosInstance = axiosComBaseUrl(baseUrlKey);

  try {
    console.log(`Fazendo chamada GET para ${baseUrlKey} - ${endpoint} na API`);
    const response = await axiosInstance.get<T>(endpoint, {
      headers: {
        Authorization: `Bearer ${authorization}`
      }
    });
    return response;
  } catch (error) {
    console.error(`Erro ao fazer chamada GET para ${endpoint} na API: ${error}`);
    throw error;
  }
}

export async function post<T>(endpoint: string, data: any, baseUrlKey: BaseUrlKey, authorization: string): Promise<AxiosResponse<T>> {
  const axiosInstance = axiosComBaseUrl(baseUrlKey);

  try {
    const response = await axiosInstance.post<T>(endpoint, data, {
      headers: {
        Authorization: `Bearer ${authorization}`
      }
    });
    return response;
  } catch (error) {
    console.error(`Erro ao fazer chamada POST para ${endpoint} na API: ${error}`);
    throw error;
  }
}

export interface CompileResponse {
  data: string; 
  message?: string;
}

export async function put<T>(endpoint: string, data: any, baseUrlKey: BaseUrlKey, authorization: string): Promise<AxiosResponse<T>> {
  const axiosInstance = axiosComBaseUrl(baseUrlKey);

  try {
    const response = await axiosInstance.put<T>(endpoint, data, {
      headers: {
        Authorization: `Bearer ${authorization}`
      }
    });
    return response;
  } catch (error) {
    console.error(`Erro ao fazer chamada PUT para ${endpoint} na API: ${error}`);
    throw error;
  }
}

export async function del<T>(endpoint: string, baseUrlKey: BaseUrlKey, authorization: string): Promise<AxiosResponse<T>> {
  const axiosInstance = axiosComBaseUrl(baseUrlKey);

  try {
    const response = await axiosInstance.delete<T>(endpoint, {
      headers: {
        Authorization: `Bearer ${authorization}`
      }
    });
    return response;
  } catch (error) {
    console.error(`Erro ao fazer chamada DELETE para ${endpoint} na API: ${error}`);
    throw error;
  }
}