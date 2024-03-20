import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileRenamePopup from './FileRenamePopup';

describe('FileRenamePopup', () => {
  it('renders correctly when open', () => {
    const mockOnClose = vi.fn();
    const mockOnRename = vi.fn();
    const fileName = 'testFile.txt';

    render(
      <FileRenamePopup
        isOpen={true}
        onClose={mockOnClose}
        onRename={mockOnRename}
        fileName={fileName}
      />,
    );

    expect(screen.getByLabelText(/new name/i)).toBeInTheDocument();
  });

  it('does not render when not open', () => {
    const { container } = render(
      <FileRenamePopup
        isOpen={false}
        onClose={() => {}}
        onRename={() => {}}
        fileName="testFile.txt"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onRename with the new name when the Rename button is clicked', async () => {
    const mockOnRename = vi.fn();
    const mockOnClose = vi.fn();
    const fileName = 'testFile.txt';

    render(
      <FileRenamePopup
        isOpen={true}
        onClose={mockOnClose}
        onRename={mockOnRename}
        fileName={fileName}
      />,
    );

    fireEvent.change(screen.getByLabelText(/new name/i), {
      target: { value: 'newFileName.txt' },
    });
    fireEvent.click(screen.getByRole('button', { name: /rename/i }));

    expect(mockOnRename).toHaveBeenCalledWith('newFileName.txt');
  });

  it('calls onClose when the Cancel button is clicked', () => {
    const mockOnClose = vi.fn();
    render(
      <FileRenamePopup
        isOpen={true}
        onClose={mockOnClose}
        onRename={() => {}}
        fileName="testFile.txt"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
