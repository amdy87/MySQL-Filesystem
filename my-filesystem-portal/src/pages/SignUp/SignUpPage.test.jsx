import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpPage from './SignUpPage';

import { signup } from '@api/user';

vi.mock('react-router-dom', () => {
  const actualModule = vi.importActual('react-router-dom');
  return {
    ...actualModule,
    useNavigate: () => mockedNavigate,
  };
});
const mockedNavigate = vi.fn();

vi.mock('@api/user', () => ({
  signup: vi.fn(() => Promise.resolve({ user: {}, authToken: 'token' })),
}));

describe('SignUpPage Component', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    signup.mockClear();
  });

  it('renders correctly', () => {
    render(<SignUpPage />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Retype Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('allows input to be entered', async () => {
    render(<SignUpPage />);
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const passwordCheckInput = screen.getByLabelText('Retype Password');

    await userEvent.type(nameInput, 'Fred');
    await userEvent.type(emailInput, 'fred@test.com');
    await userEvent.type(passwordInput, 'Password123');
    await userEvent.type(passwordCheckInput, 'Password123');

    expect(nameInput).toHaveValue('Fred');
    expect(emailInput).toHaveValue('fred@test.com');
    expect(passwordInput).toHaveValue('Password123');
    expect(passwordCheckInput).toHaveValue('Password123');
  });

  it('navigates when form is correctly filled and submitted', async () => {
    render(<SignUpPage />);
    await userEvent.type(screen.getByLabelText('Name'), 'Fred');
    await userEvent.type(screen.getByLabelText('Email'), 'fred@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Password123');
    await userEvent.type(
      screen.getByLabelText('Retype Password'),
      'Password123',
    );

    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(signup).toHaveBeenCalledTimes(1);
    expect(signup).toHaveBeenCalledWith({
      name: 'Fred', // Adjust this to match the actual input value that's being sent
      email: 'fred@test.com',
      password: 'Password123',
    });

    await vi.waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/file');
    });
  });

  it('does not submit form when passwords do not match', async () => {
    render(<SignUpPage />);
    await userEvent.type(screen.getByLabelText('Name'), 'Fred');
    await userEvent.type(screen.getByLabelText('Email'), 'fred@test.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Password123');
    await userEvent.type(
      screen.getByLabelText('Retype Password'),
      'Password124',
    );

    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(signup).not.toHaveBeenCalled();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});
