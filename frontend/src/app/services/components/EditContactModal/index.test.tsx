import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditContact from './index';

describe('EditContact Component', () => {
  const mockOnSave = jest.fn();
  const defaultProps = {
    initialData: { telephone: '123-456-7890', location: '123 Main St' },
    onSave: mockOnSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = 'unset';
  });

  it('renders Edit Contact button initially', () => {
    render(<EditContact {...defaultProps} />);
    expect(screen.getByRole('button', { name: /edit contact/i })).toBeInTheDocument();
  });

  it('opens modal when Edit Contact button is clicked', async () => {
    render(<EditContact {...defaultProps} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /edit contact/i }));

    expect(screen.getByText('Edit Contact Details')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Telephone')).toHaveValue('123-456-7890');
    expect(screen.getByPlaceholderText('Location')).toHaveValue('123 Main St');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('updates form inputs when user types', async () => {
    render(<EditContact {...defaultProps} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /edit contact/i }));

    const telephoneInput = screen.getByPlaceholderText('Telephone');
    const locationInput = screen.getByPlaceholderText('Location');

    await user.clear(telephoneInput);
    await user.type(telephoneInput, '987-654-3210');
    await user.clear(locationInput);
    await user.type(locationInput, '456 Elm St');

    expect(telephoneInput).toHaveValue('987-654-3210');
    expect(locationInput).toHaveValue('456 Elm St');
  });

  it('saves changes and closes modal on form submission', async () => {
    render(<EditContact {...defaultProps} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /edit contact/i }));

    const telephoneInput = screen.getByPlaceholderText('Telephone');
    const locationInput = screen.getByPlaceholderText('Location');
    const saveButton = screen.getByRole('button', { name: /save changes/i });

    await user.clear(telephoneInput);
    await user.type(telephoneInput, '987-654-3210');
    await user.clear(locationInput);
    await user.type(locationInput, '456 Elm St');
    await user.click(saveButton);

    expect(saveButton).toHaveTextContent('Saving...');
    expect(saveButton).toBeDisabled();

    await waitFor(
      () => {
        expect(screen.queryByText('Edit Contact Details')).not.toBeInTheDocument();
        expect(mockOnSave).toHaveBeenCalledWith({
          telephone: '987-654-3210',
          location: '456 Elm St'
        });
        expect(document.body.style.overflow).toBe('unset');
      },
      { timeout: 2000 }
    );
  });

  it('closes modal without saving when close button is clicked', async () => {
    render(<EditContact {...defaultProps} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /edit contact/i }));
    await user.click(screen.getByLabelText('Close modal'));

    expect(screen.queryByText('Edit Contact Details')).not.toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('uses default empty contact data when initialData is not provided', async () => {
    render(<EditContact onSave={mockOnSave} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /edit contact/i }));

    expect(screen.getByPlaceholderText('Telephone')).toHaveValue('');
    expect(screen.getByPlaceholderText('Location')).toHaveValue('');
  });
});