import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateServiceModal from './index';
import { updateService } from '../../../utils/fetchServices';

jest.mock('../../../utils/fetchServices', () => ({
  __esModule: true,
  updateService: jest.fn(),
}));

describe('UpdateServiceModal', () => {
  const mockService = {
    service_id: '1',
    service_name: 'Test Service',
    status: 'Available',
    description: 'Test Description',
  };
  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (updateService as jest.Mock).mockResolvedValue({
      service_id: '1',
      service_name: 'Updated Service',
      status: 'Not Available',
      description: 'Updated Description',
    });
  });

  test('renders modal with pre-filled form fields', () => {
    render(<UpdateServiceModal service={mockService} onClose={mockOnClose} onUpdate={mockOnUpdate} />);
    expect(screen.getByRole('heading', { name: /update service/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Service Name')).toHaveValue('Test Service');
    expect(screen.getByRole('combobox')).toHaveValue('Available');
    expect(screen.getByPlaceholderText('Description')).toHaveValue('Test Description');
    expect(screen.getByRole('button', { name: /update service/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
  });

  test('updates form fields on user input', () => {
    render(<UpdateServiceModal service={mockService} onClose={mockOnClose} onUpdate={mockOnUpdate} />);
    const nameInput = screen.getByPlaceholderText('Service Name');
    const statusSelect = screen.getByRole('combobox');
    const descriptionTextarea = screen.getByPlaceholderText('Description');

    fireEvent.change(nameInput, { target: { value: 'Updated Service' } });
    expect(nameInput).toHaveValue('Updated Service');

    fireEvent.change(statusSelect, { target: { value: 'Not Available' } });
    expect(statusSelect).toHaveValue('Not Available');

    fireEvent.change(descriptionTextarea, { target: { value: 'Updated Description' } });
    expect(descriptionTextarea).toHaveValue('Updated Description');
  });

  test('submits form and calls onUpdate and onClose on success', async () => {
    render(<UpdateServiceModal service={mockService} onClose={mockOnClose} onUpdate={mockOnUpdate} />);
    const nameInput = screen.getByPlaceholderText('Service Name');
    const statusSelect = screen.getByRole('combobox');
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    const form = screen.getByRole('button', { name: /update service/i }).closest('form');

    fireEvent.change(nameInput, { target: { value: 'Updated Service' } });
    fireEvent.change(statusSelect, { target: { value: 'Not Available' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Updated Description' } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(updateService).toHaveBeenCalledWith('1', {
        service_name: 'Updated Service',
        status: 'Not Available',
        description: 'Updated Description',
      });
      expect(mockOnUpdate).toHaveBeenCalledWith({
        service_id: '1',
        service_name: 'Updated Service',
        status: 'Not Available',
        description: 'Updated Description',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('disables submit button and shows loading state', async () => {
    render(<UpdateServiceModal service={mockService} onClose={mockOnClose} onUpdate={mockOnUpdate} />);
    const form = screen.getByRole('button', { name: /update service/i }).closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /updating/i });
      expect(submitButton).toBeDisabled();
    });
  });

  test('handles error during submission', async () => {
    (updateService as jest.Mock).mockRejectedValue(new Error('Failed to update service'));
    render(<UpdateServiceModal service={mockService} onClose={mockOnClose} onUpdate={mockOnUpdate} />);
    const form = screen.getByRole('button', { name: /update service/i }).closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(updateService).toHaveBeenCalled();
      expect(mockOnUpdate).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: /update service/i })).toBeInTheDocument();
    });
  });

  test('closes modal when close button is clicked', () => {
    render(<UpdateServiceModal service={mockService} onClose={mockOnClose} onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});