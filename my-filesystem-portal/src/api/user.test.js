import { describe, it, expect, vi } from 'vitest';
import { request } from '@utils/request';
import { login, signup } from './user';

// Mock the request module
vi.mock('@utils/request', () => ({
  request: vi.fn(),
}));

// Tests for login
describe('test login', () => {
  it('logs in a user using email and password', async () => {
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await login({ email: '123@wisc.edu', password: 'password' });
    expect(request).toHaveBeenCalledWith('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({ email: '123@wisc.edu', password: 'password' }),
    });
    expect(result).toEqual(mockData);
  });
});

// Tests for signup
describe('test signup', () => {
  it('signs up a user using name, email, and password', async () => {
    const mockData = { success: true };
    request.mockResolvedValueOnce(mockData);
    const result = await signup({
      name: '123',
      email: '123@wisc.edu',
      password: 'password',
    });
    expect(request).toHaveBeenCalledWith('/api/user/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: '123',
        email: '123@wisc.edu',
        password: 'password',
      }),
    });
    expect(result).toEqual(mockData);
  });
});
