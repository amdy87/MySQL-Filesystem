import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { getFileTree } from '@api/file'; // Import mocked API
import '@testing-library/jest-dom';
import FileViewPage from './FileViewPage';

// the mock data for the file tree
vi.mock('@api/file', () => ({
  getFileTree: vi.fn(),
}));

// Helper to mock local storage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

// mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// for unit testing, we want to mock the component
vi.mock('@components', () => {
  const OriginalModule = vi.importActual('@components');
  return {
    ...OriginalModule,
    FileTableRow: ({ id, fileName, permissions, updatedAt }) => (
      <tr data-testid={`mock-file-table-row-${id}`}>
        <td>{fileName}</td>
        <td>{permissions}</td>
        <td>{updatedAt}</td>
      </tr>
    ),
    Header: () => <div>Header</div>,
    SwitchUserCanvas: ({ show }) =>
      show ? (
        <div data-testid="switch-user-canvas">Mock Canvas</div>
      ) : (
        <div>Mock Canvas</div>
      ),
  };
});

describe('FileViewPage', () => {
  beforeEach(() => {
    // Reset mocks and local storage before each test
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('displays the file tree correctly', async () => {
    // Mock user data in local storage
    const user = { id: '123', name: 'Test User', rootDirId: 'root' };
    window.localStorage.setItem('user', JSON.stringify(user));

    // Mock getFileTree response to simulate a simple file tree
    vi.mocked(getFileTree).mockResolvedValue({
      name: 'root',
      directories: [
        {
          id: 2,
          name: 'dir1',
          metadata: { perms: 'rwx', updatedAt: '2023-04-10' },
        },
        {
          id: 3,
          name: 'dir2',
          metadata: { perms: 'rwx', updatedAt: '2023-04-11' },
        },
      ],
      files: [
        {
          id: 4,
          name: 'file1.txt',
          metadata: { perms: 'rw-', updatedAt: '2023-04-12' },
        },
      ],
      metadata: { perms: 'rwx', updatedAt: '2023-04-10' },
      id: 1,
    });

    render(<FileViewPage />);

    await waitFor(() => {
      // Check for the directories and files rendered
      expect(
        screen.getByTestId('mock-file-table-row-2', { name: /dir1/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('mock-file-table-row-3', { name: /dir2/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('mock-file-table-row-4', { name: /file1.txt/ }),
      ).toBeInTheDocument();

      // Check for the permissions and updated date
      expect(
        screen.getByTestId('mock-file-table-row-2', { name: /rwx/ }),
      ).toBeInTheDocument(); // For directories permission display
      expect(
        screen.getByTestId('mock-file-table-row-2', { name: /2023-04-10/ }),
      ).toBeInTheDocument(); // For directories date display
    });
  });

  it('displays the switch user canvas when showCanvas is true', async () => {
    const user = { id: '123', name: 'Test User', rootDirId: 'root' };
    window.localStorage.setItem('user', JSON.stringify(user));

    vi.mocked(getFileTree).mockResolvedValue({
      name: 'root',
      directories: [],
      files: [],
      metadata: { perms: 'rwx', updatedAt: '2023-04-10' },
      id: 1,
    });

    render(<FileViewPage />);
    fireEvent.click(screen.getByText('Switch User'));
    await waitFor(() => {
      expect(screen.getByTestId('switch-user-canvas')).toBeInTheDocument();
    });
  });
});
