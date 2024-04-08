import { INVALID_TOKEN_ERROR } from '@utils/error';
import { request } from '@utils/request';

// Requests all the directories and files for the user
async function getFileTree() {
  const data = await request('/api/tree/sampleData');
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
      body: JSON.stringify(data), // Puts file data in JSON format
    });

    if (response.ok) {
      console.log('File uploaded successfully');
      return response.ok;
    } else {
      console.error('Upload failed');
    }
  } catch (error) {
    // Print out error message in console
    console.error('Error:', error);
  }
}

async function sendDirectory(data) {
  try {
    const response = await fetch('/backend/api/dir/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Puts file data in JSON format
    });

    if (response.ok) {
      console.log('Directory created successfully');
      return response.ok;
    } else {
      console.error('Creation failed');
    }
  } catch (error) {
    // Print out error message in console
    console.error('Error:', error);
  }
}

// Posts the new file name to the backend
async function fileRename(data) {
  try {
    console.log('Renaming file');
    const token = JSON.parse(localStorage.getItem('authToken'));
    if (!token) {
      throw {
        name: INVALID_TOKEN_ERROR,
      };
    }
    const response = await fetch('/backend/api/file/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
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

// Posts the new directory name to the backend
async function directoryRename(data) {
  try {
    console.log('Renaming Directory');
    const token = JSON.parse(localStorage.getItem('authToken'));
    if (!token) {
      throw {
        name: INVALID_TOKEN_ERROR,
      };
    }
    const response = await fetch('/backend/api/dir/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Backend requires JSON format
    });

    if (response.ok) {
      console.log('Directory renamed successfully');
    } else {
      console.error('Rename failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Gets the user content
async function collectUserContent(userId) {
  try {
    // Puts GET info into a query to send to backend
    const url = new URL('/backend/api/file/', 'http://localhost');
    url.searchParams.set('userId', userId);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('User data collected successfully');
      const data = await response.json();
      return data; // returns response data in json format
    } else {
      console.error('Collection failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export {
  getFileTree,
  sendFile,
  sendDirectory,
  fileRename,
  directoryRename,
  collectUserContent,
};
