import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './index';

describe('SearchBar', () => {
  const mockOnSearchChange = jest.fn();

  test('renders input with placeholder and initial value', () => {
    render(<SearchBar searchTerm="test" onSearchChange={mockOnSearchChange} />);
    const input = screen.getByPlaceholderText('Search by service name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test');
  });

  test('calls onSearchChange when input changes', () => {
    render(<SearchBar searchTerm="" onSearchChange={mockOnSearchChange} />);
    fireEvent.change(screen.getByPlaceholderText('Search by service name'), { target: { value: 'new search' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('new search');
  });
});