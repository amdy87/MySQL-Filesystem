import { request } from '@utils/request';

async function getFileTree() {
  const data = await request('/api/tree');
  return data;
}

// Posts all the file data to the backend
async function sendFile(data) {
  try {
    console.log('Sending file');
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

export { getFileTree, sendFile };
