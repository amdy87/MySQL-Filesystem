import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, expect } from 'vitest';
import LoginPage from './LoginPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { login } from '@api/user';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actualModule = await vi.importActual('react-router-dom');
  return {
    ...actualModule,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('@api/user', () => ({
  login: vi.fn(),
}));

describe('LoginPage', () => {
  it('renders correctly', () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('navigates to /file on successful login', async () => {
    login.mockResolvedValue({ user: { name: 'John Doe' } });

    render(<LoginPage />, { wrapper: MemoryRouter });
    const emailInput = screen.getByTestId(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, 'user@example.com');
    expect(emailInput.value).toBe('user@example.com');

    await userEvent.type(passwordInput, 'password');
    expect(passwordInput.value).toBe('password');

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/file');
    });
  });

  it('updates input fields correctly', async () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    const emailInput = screen.getByTestId(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    userEvent.type(emailInput, 'user@example.com').then(() => {
      expect(emailInput.value).toBe('user@example.com');
    });

    userEvent.type(passwordInput, 'password').then(() => {
      expect(passwordInput.value).toBe('password');
    });
  });

  it('shows an alert if email is missing', () => {
    global.alert = vi.fn();

    render(<LoginPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });
    fireEvent.click(screen.getByText('Login'));

    expect(global.alert).toHaveBeenCalledWith('Please input your email');
  });

  it('navigates to sign up page when Sign Up is clicked', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockedNavigate).toHaveBeenCalledWith('/signup');
  });
});
