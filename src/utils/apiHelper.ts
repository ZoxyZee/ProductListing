import axios, {AxiosRequestConfig} from 'axios';

export async function apiHelper<TData>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<TData> {
  const response = await axios.request<TData>({
    url: endpoint,
    method: 'GET',
    timeout: 15000,
    ...config,
  });

  return response.data;
}
