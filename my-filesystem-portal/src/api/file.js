import { request } from '@utils/request';

async function getFileTree({ userId, parentId }) {
  const data = await request(
    `/api/tree/treeByParent?userId=${userId}&parentId=${parentId}`,
    {},
    true,
  );
  return data;
}

async function deleteFile({ fileId }) {
  const data = await request(
    `/api/file`,
    {
      method: 'DELETE',
      body: JSON.stringify({ fileId }),
    },
    true,
  );
  return data;
}

async function deleteDirectory({ directoryId }) {
  const data = await request(
    `/api/dir`,
    {
      method: 'DELETE',
      body: JSON.stringify({ directoryId }),
    },
    true,
  );
  return data;
}

// Posts all the file data to the backend
async function sendFile(fileData) {
  const data = await request(
    '/api/file/add',
    {
      method: 'POST',
      body: JSON.stringify(fileData),
    },
    true,
  );
  return data;
}

async function sendDirectory(data) {
  const response = await request(
    '/api/dir/add',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    true,
  );
  return response;
}

// Posts the new file name to the backend
async function fileRename(data) {
  const response = await request(
    '/api/file/update',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    true,
  );
  return response;
}

// Posts the new directory name to the backend
async function directoryRename(data) {
  const response = await request(
    '/api/dir/update',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    true,
  );
  return response;
}

// Gets the user content
async function collectUserContent(userId) {
  const data = await request(`/api/file?userId=${userId}`, {}, true);
  return data;
}

async function updateFile({ fileId, content }) {
  const data = await request(
    `/api/file/update`,
    {
      method: 'POST',
      body: JSON.stringify({ fileId, content }),
    },
    true,
  );
  return data;
}

async function changeFilePermission({ fileId, permissions }) {
  const data = await request(
    `/api/file/update`,
    {
      method: 'POST',
      body: JSON.stringify({ fileId, permissions }),
    },
    true,
  );
  return data;
}

async function changeDirectoryPermission({ directoryId, permissions }) {
  const data = await request(
    `/api/dir/update`,
    {
      method: 'POST',
      body: JSON.stringify({ directoryId, permissions }),
    },
    true,
  );
  return data;
}

export {
  getFileTree,
  sendFile,
  sendDirectory,
  fileRename,
  directoryRename,
  collectUserContent,
  deleteFile,
  deleteDirectory,
  updateFile,
  changeFilePermission,
  changeDirectoryPermission,
};
