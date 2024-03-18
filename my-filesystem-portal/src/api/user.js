import { request } from '@utils/request';
async function login({ email, password }) {
  return await request('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

async function signup({ name, email, password }) {
  return await request('/api/user/signup', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export { login, signup };
