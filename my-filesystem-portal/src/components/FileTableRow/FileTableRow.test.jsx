import timezoneMock from 'timezone-mock';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FileTableRow from './FileTableRow';
import { deleteFile, deleteDirectory } from '../../api/file';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actualModule = await vi.importActual('react-router-dom');
  return {
    ...actualModule,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('../../api/file', () => ({
  deleteFile: vi.fn(() => Promise.resolve()),
  deleteDirectory: vi.fn(() => Promise.resolve()),
}));

describe('FileTableRow', () => {
  beforeAll(() => {
    // mock the timezone so it display the same time in all environments
    timezoneMock.register('UTC');
  });

  afterAll(() => {
    // revert to the real time zone after the tests
    timezoneMock.unregister();
  });

  const mockRefresh = vi.fn();

  const fileProps = {
    userId: '123',
    id: '456',
    fileName: 'test-file',
    fileType: 'file',
    permissions: { read: true, write: true, execute: false },
    updatedAt: 1712580000000,
    clickDirectory: vi.fn(),
    refresh: mockRefresh,
  };
  it('renders correctly', () => {
    render(
      <table>
        <tbody>
          <FileTableRow {...fileProps} />
        </tbody>
      </table>,
    );

    expect(screen.getByText('test-file')).toBeInTheDocument();
    expect(screen.getByText('RW')).toBeInTheDocument();
    expect(screen.getByText('4/8/2024, 12:40:00 PM')).toBeInTheDocument();
  });

  it('calls deleteFile when delete button is clicked for a file', async () => {
    global.confirm = vi.fn().mockReturnValue(true); // Mock confirmation dialog  and allow delete

    render(
      <table>
        <tbody>
          <FileTableRow {...fileProps} />
        </tbody>
      </table>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteFile).toHaveBeenCalledWith({ fileId: '456' });
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('calls deleteDirectory when delete button is clicked for a directory', async () => {
    const directoryProps = {
      ...fileProps,
      fileName: 'testDirectory',
      fileType: 'directory',
    };

    global.confirm = vi.fn().mockReturnValue(true); // Mock confirmation dialog and allow delete

    render(
      <table>
        <tbody>
          <FileTableRow {...directoryProps} />
        </tbody>
      </table>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteDirectory).toHaveBeenCalledWith({ directoryId: '456' });
    expect(mockRefresh).toHaveBeenCalled();
  });
});
