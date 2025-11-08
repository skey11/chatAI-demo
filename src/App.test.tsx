import { render, screen } from '@testing-library/react';
import { AppShell } from './App';

describe('App shell', () => {
  it('renders header metadata', () => {
    render(<AppShell />);
    expect(screen.getByText(/Chat AI 控制台/)).toBeInTheDocument();
  });
});
