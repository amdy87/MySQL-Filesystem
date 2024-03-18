import { request } from '@utils/request';
async function getFileTree() {
  const data = await request('/api/tree');
  return data;
}

export { getFileTree };
