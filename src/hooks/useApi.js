import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../auth/msalConfig.js';

export function useApi() {
  const { instance, accounts } = useMsal();

  const getToken = async () => {
    const account = accounts[0];
    if (!account) throw new Error('Not authenticated');
    const res = await instance.acquireTokenSilent({ ...loginRequest, account });
    return res.idToken;
  };

  const callApi = async (url, options = {}) => {
    const token = await getToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const get = (url) => callApi(url);

  const post = (url, body, isFormData = false) =>
    callApi(url, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? body : JSON.stringify(body),
    });

  const put = (url, body) =>
    callApi(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  const del = (url) => callApi(url, { method: 'DELETE' });

  return { get, post, put, del, callApi };
}
