import axios, { AxiosInstance } from 'axios';

export enum BaseUrlKey {
  BACKEND = 'REACT_APP_API_USUARIO_URL',
}

// Mapeamento das chaves do enum para as URLs
const baseUrls: Record<BaseUrlKey, string | undefined> = {
  [BaseUrlKey.BACKEND]: process.env.REACT_APP_API_TV_E_STREAMING_URL || "http://localhost:5000/api",
};


export function axiosComBaseUrl(baseUrlKey: keyof typeof baseUrls): AxiosInstance {
  const baseUrl = baseUrls[baseUrlKey];
  console.log(`Base URL para a chave ${baseUrlKey}: ${baseUrl}`);
  if (!baseUrls[baseUrlKey]) {
    throw new Error(`Base URL não encontrada para a chave ${baseUrlKey}`);
  }

  return axios.create({
    baseURL: baseUrl as string,
  });
}