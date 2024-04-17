import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import PermissionChangePopup from './PermissionChangePopup';
import * as Api from '@api/file';

// Mock the API methods
vi.mock('@api/file', () => ({
  changeFilePermission: vi.fn(() => Promise.resolve()),
  changeDirectoryPermission: vi.fn(() => Promise.resolve()),
}));

describe('PermissionChangePopup', () => {
  const defaultProps = {
    id: '123',
    show: true,
    onClose: vi.fn(),
    refresh: vi.fn(),
    initialPermission: { read: true, write: false, execute: false },
    fileType: 'file',
  };

  it('renders correctly', () => {
    render(<PermissionChangePopup {...defaultProps} />);
    // reader the title correctly
    expect(screen.getByTestId('change-permission-title')).toBeInTheDocument();
  });

  it('initializes checkboxes based on initialPermission prop', () => {
    render(<PermissionChangePopup {...defaultProps} />);
    expect(screen.getByLabelText('read').checked).toBe(true);
    expect(screen.getByLabelText('write').checked).toBe(false);
    expect(screen.getByLabelText('execute').checked).toBe(false);
  });

  it('updates state when checkboxes are changed', () => {
    render(<PermissionChangePopup {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('write'));
    expect(screen.getByLabelText('write').checked).toBe(true);
  });

  it('calls changeFilePermission and onClose, refresh on button click for files', async () => {
    render(<PermissionChangePopup {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Change Permission' }));
    await waitFor(() => {
      expect(Api.changeFilePermission).toHaveBeenCalledWith({
        fileId: '123',
        permission: { read: true, write: false, execute: false },
      });
      expect(defaultProps.onClose).toHaveBeenCalled();
      expect(defaultProps.refresh).toHaveBeenCalled();
    });
  });

  it('calls changeDirectoryPermission and onClose, refresh on button click for directories', async () => {
    defaultProps.fileType = 'directory';
    render(<PermissionChangePopup {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Change Permission' }));
    await waitFor(() => {
      expect(Api.changeDirectoryPermission).toHaveBeenCalledWith({
        directoryId: '123',
        permission: { read: true, write: false, execute: false },
      });
      expect(defaultProps.onClose).toHaveBeenCalled();
      expect(defaultProps.refresh).toHaveBeenCalled();
    });
  });
});
