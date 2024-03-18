import { afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// cleanup the dom after each test
afterEach(() => {
  cleanup();
});
