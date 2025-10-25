import axios from 'axios';

const baseURL = 'http://localhost:4000/';

const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (localStorage.getItem('accessToken')) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      'accessToken',
    )}`;
  }
  return config;
});

apiClient.interceptors.response.use(undefined, (err) => {
  const { response } = err;

  // eslint-disable-next-line no-console
  console.log('Error: ', response);

  return Promise.reject(err);
});

export default apiClient;
