import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders search input available', () => {
  render(<App />);
  const element = screen.getAllByPlaceholderText(/Search.../i);
  expect(element[0]).toBeInTheDocument();
});

test('renders add button available', () => {
  render(<App />);
  const element = screen.getByTitle(/Add new dog./i);
  expect(element).toBeInTheDocument();
});
