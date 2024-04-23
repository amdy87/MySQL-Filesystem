import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SwitchUserCanvas from './SwitchUserCanvas';
import { getAllUser } from '@api/user';

// Mocking the API and localStorage
vi.mock('@api/user', () => ({
  getAllUser: vi.fn(),
}));

global.localStorage = {
  getItem: vi
    .fn()
    .mockReturnValue(JSON.stringify({ id: '123', name: 'John Doe' })),
};

describe('SwitchUserCanvas', () => {
  const mockUsers = [
    { id: '123', name: 'John Doe' },
    { id: '456', name: 'Jane Smith' },
  ];

  beforeAll(() => {
    // mock the match media api since jest does not support it and react bootstrap offcanvas uses it
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    getAllUser.mockResolvedValue({ user: mockUsers });
  });

  it('renders correctly when `show` is true', async () => {
    render(
      <SwitchUserCanvas
        show={true}
        onClose={() => {}}
        switchUser={() => {}}
        currentUser={{ id: '123' }}
      />,
    );

    await vi.waitFor(() => {
      expect(screen.getByText('Switch FileSystem')).toBeInTheDocument();
      expect(screen.getByText('John Doe(me)')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('does not render when `show` is false', () => {
    render(
      <SwitchUserCanvas
        show={false}
        onClose={() => {}}
        switchUser={() => {}}
        currentUser={{ id: '123' }}
      />,
    );

    expect(screen.queryByText('Switch FileSystem')).not.toBeInTheDocument();
  });

  it('fetches users and updates state on mount', async () => {
    render(
      <SwitchUserCanvas
        show={true}
        onClose={() => {}}
        switchUser={() => {}}
        currentUser={{ id: '123' }}
      />,
    );

    await vi.waitFor(() => {
      expect(getAllUser).toHaveBeenCalled();
      expect(screen.getByText('John Doe(me)')).toBeInTheDocument();
    });
  });

  it('calls `switchUser` when a user item is clicked', async () => {
    const mockSwitchUser = vi.fn();
    render(
      <SwitchUserCanvas
        show={true}
        onClose={vi.fn()}
        switchUser={mockSwitchUser}
        currentUser={{ id: '123' }}
      />,
    );

    await vi.waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
    const userItem = screen.getByText('Jane Smith');
    fireEvent.click(userItem);

    await vi.waitFor(() => {
      expect(mockSwitchUser).toHaveBeenCalledWith({
        id: '456',
        name: 'Jane Smith',
      });
    });
  });

  it('calls `onClose` when the canvas is requested to be closed', () => {
    const mockOnClose = vi.fn();
    render(
      <SwitchUserCanvas
        show={true}
        onClose={mockOnClose}
        switchUser={() => {}}
        currentUser={{ id: '123' }}
      />,
    );

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
