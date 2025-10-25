import { render, screen, fireEvent } from '@testing-library/react';
import ServicesTable from './index';

describe('ServicesTable', () => {
  const mockServices = [
    { service_id: '1', service_name: 'Service 1', status: 'Available', description: 'Short desc' },
    { service_id: '2', service_name: 'Service 2', status: 'Not Available', description: 'A very long description that should truncate' },
  ];
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  test('renders empty table when no services', () => {
    render(<ServicesTable services={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No match found')).toBeInTheDocument();
  });

  test('renders services table with correct data', () => {
    render(<ServicesTable services={mockServices} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Service 2')).toBeInTheDocument();
    expect(screen.getByText('Short desc')).toBeInTheDocument();
    expect(screen.getByText(/A very long descript\.\.\./)).toBeInTheDocument();
  });

  test('shows full description on hover', () => {
    render(<ServicesTable services={mockServices} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    const truncatedCell = screen.getByText(/A very long descript\.\.\./).closest('td');
    fireEvent.mouseOver(truncatedCell!);
    expect(screen.getByText('A very long description that should truncate')).toBeInTheDocument();
  });

  test('calls onEdit and onDelete when buttons are clicked', () => {
    render(<ServicesTable services={mockServices} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockOnEdit).toHaveBeenCalledWith('1');
    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});