import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { deleteAccount } from '@api/user';
import Header from './Header';

// mock the useNavigate function to test it
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actualModule = await vi.importActual('react-router-dom'); // Import actual module
  return {
    ...actualModule,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('@api/user', async () => ({
  deleteAccount: vi.fn(() => Promise.resolve()),
}));

const renderHeader = ({ username = null, userId = null } = {}) =>
  render(
    <MemoryRouter initialEntries={['/test']}>
      <Routes>
        <Route
          path="/test"
          element={<Header username={username} userId={userId} />}
        />
      </Routes>
    </MemoryRouter>,
  );

describe('Header Component', () => {
  const mockData = {
    username: 'testuser',
    userId: 123,
  };

  it('renders without username should not show welcome message or logout button', () => {
    renderHeader();
    expect(screen.queryByText('Welcome')).not.toBeInTheDocument();
  });

  it('renders with username', () => {
    renderHeader(mockData);
    expect(
      screen.getByText(`Welcome ${mockData.username}`),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(`Welcome ${mockData.username}`));
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('logout button navigates to the login page', () => {
    renderHeader(mockData);
    fireEvent.click(screen.getByText(`Welcome ${mockData.username}`));
    fireEvent.click(screen.getByText('Logout'));
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  it('open the modal when delete account is clicked', async () => {
    renderHeader(mockData);
    fireEvent.click(screen.getByText(`Welcome ${mockData.username}`));
    fireEvent.click(screen.getByText(/Delete Account/i));
    expect(
      screen.getByText(
        /Deleteing account will result in deletion of all files in the filesystem. Please confirm this action./i,
      ),
    ).toBeInTheDocument();
  });

  it('close the modal when close button is clicked', async () => {
    renderHeader(mockData);
    fireEvent.click(screen.getByText(`Welcome ${mockData.username}`));
    await act(async () => {
      fireEvent.click(screen.getByText(/Delete Account/i));
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId('close-button'));
    });
    await vi.waitFor(() => {
      expect(
        screen.queryByText(
          /Deleteing account will result in deletion of all files in the filesystem. Please confirm this action./i,
        ),
      ).not.toBeInTheDocument();
    });
  });

  it('call deleteAccount API and clear localStorage on confirm', async () => {
    renderHeader(mockData);
    fireEvent.click(screen.getByText(`Welcome ${mockData.username}`));
    fireEvent.click(screen.getByText(/Delete Account/i));
    fireEvent.click(screen.getByTestId('confirm-button'));

    await vi.waitFor(() => {
      expect(deleteAccount).toHaveBeenCalledWith({ userId: 123 });
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });
});
