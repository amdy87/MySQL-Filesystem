import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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

const renderHeader = ({ username = null } = {}) =>
  render(
    <MemoryRouter initialEntries={['/test']}>
      <Routes>
        <Route path="/test" element={<Header username={username} />} />
      </Routes>
    </MemoryRouter>,
  );

describe('Header Component', () => {
  it('renders without username should not show welcome message or logout button', () => {
    renderHeader();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    expect(screen.queryByText('Welcome')).not.toBeInTheDocument();
  });

  it('renders with username', () => {
    const username = 'test';
    renderHeader({ username });
    expect(screen.getByText(`Welcome, ${username}`)).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('logout button navigates to the login page', () => {
    const username = 'test';
    renderHeader({ username });
    fireEvent.click(screen.getByText('Logout'));
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});
