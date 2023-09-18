import axios, { AxiosResponse } from 'axios';
import { requestError } from '@/errors';

async function get<T>(url: string): Promise<AxiosResponse<T>> {
  try {
    const result = await axios.get(url);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;
    throw requestError(status, statusText);
  }
}

export const request = {
  get,
};
