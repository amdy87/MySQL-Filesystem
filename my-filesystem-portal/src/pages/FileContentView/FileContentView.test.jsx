import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FileContentView from './FileContentView';

// Setup mocks for react-router-dom and API call
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual, // Use actual implementations for unmocked parts
    useParams: vi.fn(() => ({ userId: '1', fileId: '2' })), // Mock useParams
    useNavigate: vi.fn(), // Mock implementation for useNavigate
  };
});

vi.mock('../../api/file', () => ({
  collectUserContent: vi.fn(() =>
    Promise.resolve({
      files: [{ id: 2, name: 'Test File', content: 'This is test content.' }],
    }),
  ),
  updateFile: vi.fn(() => Promise.resolve({ message: 'Update successful' })),
}));

describe('FileContentView', () => {
  it('displays file content correctly after fetching', async () => {
    render(<FileContentView />);

    // Check if file name is displayed
    expect(await screen.findByText('Test File')).toBeInTheDocument();

    // Check if file content is displayed
    expect(
      await screen.findByText('This is test content.'),
    ).toBeInTheDocument();
  });

  it('enables edit mode when edit button is clicked', async () => {
    render(<FileContentView />);
    fireEvent.click(await screen.findByText('Edit File'));
    expect(await screen.findByText('Confirm')).toBeInTheDocument();
  });

  it('handles input change correctly', async () => {
    render(<FileContentView />);
    fireEvent.click(await screen.findByText('Edit File'));
    const textarea = await screen.findByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated content' } });
    expect(textarea.value).toBe('Updated content');
  });

  it('updates content and exits edit mode on confirm', async () => {
    render(<FileContentView />);
    fireEvent.click(await screen.findByText('Edit File'));
    const textarea = await screen.findByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated content' } });
    fireEvent.click(await screen.findByText('Confirm'));
    await waitFor(() => {
      expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Updated content')).toBeInTheDocument();
  });

  it('exits edit mode and does not update content on cancel', async () => {
    render(<FileContentView />);
    fireEvent.click(await screen.findByText('Edit File'));
    const textarea = await screen.findByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated content' } });
    fireEvent.click(await screen.findByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    });
    expect(screen.getByText('This is test content.')).toBeInTheDocument();
  });
});
