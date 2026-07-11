import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '@/App';

describe('App', () => {
  it('shows the game title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /neon blocks/i })).toBeInTheDocument();
    expect(screen.getByText(/next signal/i)).toBeInTheDocument();
    expect(screen.getByText(/high score/i)).toBeInTheDocument();
    expect(screen.getAllByRole('gridcell')).toHaveLength(375);
  });
});
