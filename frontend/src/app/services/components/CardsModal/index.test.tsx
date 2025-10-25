import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cards from './index';

describe('Cards Component', () => {
  const mockOnOpeningHoursChange = jest.fn();
  const mockOnClosingHoursChange = jest.fn();
  const mockOnArvStatusChange = jest.fn();
  const mockOnClinicStatusChange = jest.fn();

  const defaultProps = {
    openingHours: '08:00 AM',
    closingHours: '08:00 PM',
    arvStatus: 'Available' as const,
    clinicStatus: 'Open' as const,
    onOpeningHoursChange: mockOnOpeningHoursChange,
    onClosingHoursChange: mockOnClosingHoursChange,
    onArvStatusChange: mockOnArvStatusChange,
    onClinicStatusChange: mockOnClinicStatusChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all select fields with correct initial values', () => {
    render(<Cards {...defaultProps} />);

    expect(screen.getByDisplayValue('08:00 AM')).toBeInTheDocument();
    expect(screen.getByDisplayValue('08:00 PM')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Available')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Open')).toBeInTheDocument();
  });

  it('calls onOpeningHoursChange when opening hours are changed', async () => {
    render(<Cards {...defaultProps} />);
    const user = userEvent.setup();

    const openingHoursSelect = screen.getByDisplayValue('08:00 AM');
    await user.selectOptions(openingHoursSelect, '09:00 AM');

    expect(mockOnOpeningHoursChange).toHaveBeenCalledWith('09:00 AM');
  });

  it('calls onClosingHoursChange when closing hours are changed', async () => {
    render(<Cards {...defaultProps} />);
    const user = userEvent.setup();

    const closingHoursSelect = screen.getByDisplayValue('08:00 PM');
    await user.selectOptions(closingHoursSelect, '09:00 AM');

    expect(mockOnClosingHoursChange).toHaveBeenCalledWith('09:00 AM');
  });

  it('calls onArvStatusChange when ARV status is changed', async () => {
    render(<Cards {...defaultProps} />);
    const user = userEvent.setup();

    const arvStatusSelect = screen.getByDisplayValue('Available');
    await user.selectOptions(arvStatusSelect, 'Not Available');

    expect(mockOnArvStatusChange).toHaveBeenCalledWith('Not Available');
  });

  it('calls onClinicStatusChange when Clinic status is changed', async () => {
    render(<Cards {...defaultProps} />);
    const user = userEvent.setup();

    const clinicStatusSelect = screen.getByDisplayValue('Open');
    await user.selectOptions(clinicStatusSelect, 'Closed');

    expect(mockOnClinicStatusChange).toHaveBeenCalledWith('Closed');
  });
});
