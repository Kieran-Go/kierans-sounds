import { expect, afterEach } from 'vitest'; // bring in Vitest's expect + afterEach
import { cleanup } from '@testing-library/react'; // cleanup DOM after each test
import * as matchers from "@testing-library/jest-dom/matchers"; // jest-dom matchers

// Extend Vitest's expect with jest-dom matchers like toBeInTheDocument()
expect.extend(matchers);

// Automatically run cleanup after each test to avoid test pollution
afterEach(() => {
  cleanup();
});
