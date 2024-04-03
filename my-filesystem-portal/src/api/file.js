import { request } from '@utils/request';

async function getFileTree() {
  const data = await request('/api/tree');
  return data;
}

// Posts all the file data to the backend
async function sendFile(data) {
  try {
    const response = await fetch('/backend/api/file/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log('File uploaded successfully');
      return response.ok;
    } else {
      console.error('Upload failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Posts the new file name to the backend
async function fileRename(data) {
  try {
    console.log('Renaming file');
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw {
        name: INVALID_TOKEN_ERROR,
      };
    }
    const response = await fetch('/backend/api/file/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Backend requires JSON format
    });

    if (response.ok) {
      console.log('File renamed successfully');
    } else {
      console.error('Rename failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export { getFileTree, sendFile, fileRename };
