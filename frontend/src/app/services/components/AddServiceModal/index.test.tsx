import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddServiceModal from './index';
import { addService } from '../../../utils/fetchServices';

jest.mock('../../../utils/fetchServices', () => ({
  addService: jest.fn(),
}));

describe('AddServiceModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAdd = jest.fn();
  const centerId = '123';
  const mockService = {
    id: '1',
    service_name: 'Test Service',
    status: 'Available',
    description: 'Test Description',
    center_id: '123',
  };

  beforeEach(() => { jest.clearAllMocks(); (addService as jest.Mock).mockResolvedValue(mockService);});

  it('renders the modal with all form elements', () => {
    render(<AddServiceModal centerId={centerId} onClose={mockOnClose} onAdd={mockOnAdd} />);

    expect(screen.getByText('Add New Service')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Service Name')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('Available');
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Service' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
  });

  it('updates input fields when user types', async () => {
    render(<AddServiceModal centerId={centerId} onClose={mockOnClose} onAdd={mockOnAdd} />);
    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText('Service Name');
    const descriptionInput = screen.getByPlaceholderText('Description');
    const statusSelect = screen.getByRole('combobox');

    await user.type(nameInput, 'Test Service');
    await user.selectOptions(statusSelect, 'Not Available');
    await user.type(descriptionInput, 'Test Description');

    expect(nameInput).toHaveValue('Test Service');
    expect(statusSelect).toHaveValue('Not Available');
    expect(descriptionInput).toHaveValue('Test Description');
  });

  it('submits the form and calls addService with correct data', async () => {
    render(<AddServiceModal centerId={centerId} onClose={mockOnClose} onAdd={mockOnAdd} />);
    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText('Service Name');
    const descriptionInput = screen.getByPlaceholderText('Description');
    const statusSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: 'Add Service' });

    await user.type(nameInput, 'Test Service');
    await user.selectOptions(statusSelect, 'Available');
    await user.type(descriptionInput, 'Test Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(addService).toHaveBeenCalledWith({
        service_name: 'Test Service',
        status: 'Available',
        description: 'Test Description',
        center_id: '123',
      });
      expect(mockOnAdd).toHaveBeenCalledWith(mockService);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('disables submit button and shows loading text when submitting', async () => {
    render(<AddServiceModal centerId={centerId} onClose={mockOnClose} onAdd={mockOnAdd} />);
    const user = userEvent.setup();

    const nameInput = screen.getByPlaceholderText('Service Name');
    const submitButton = screen.getByRole('button', { name: 'Add Service' });

    await user.type(nameInput, 'Test Service'); 
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Adding...' })).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.getByRole('button', { name: 'Add Service' })).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    render(<AddServiceModal centerId={centerId} onClose={mockOnClose} onAdd={mockOnAdd} />);
    const user = userEvent.setup();

    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not submit form if required fields are empty', async () => {
    render(<AddServiceModal centerId={centerId} onClose={mockOnClose} onAdd={mockOnAdd} />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: 'Add Service' });
    await user.click(submitButton);

    expect(addService).not.toHaveBeenCalled();
    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});