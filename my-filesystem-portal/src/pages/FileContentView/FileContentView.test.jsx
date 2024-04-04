import { render, screen } from '@testing-library/react';
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
});
