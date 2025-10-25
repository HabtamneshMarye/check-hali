import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServicesPage from './page';
import { act } from 'react';
import { deleteService } from '../utils/fetchServices';

let mockServices = [
  { service_id: '1', service_name: 'Dental' },
  { service_id: '2', service_name: 'Cardiology' },
  { service_id: '3', service_name: 'Neurology' },
];

let mockSetServices = jest.fn((updater) => {
  if (typeof updater === 'function') {
    mockServices = updater(mockServices);
  } else {
    mockServices = updater;
  }
});

jest.mock('../hooks/useFetchServices', () => {
  return () => ({
    services: mockServices,
    loading: false,
    error: null,
    refetch: jest.fn(),
    setServices: mockSetServices,
  });
});

jest.mock('../hooks/useFetchClinics', () => {
  return () => ({
    clinics: [
      {
        center_id: 'clinic-1',
        contact_number: '+123456789',
        address: '123 Health St',
        opening_time: '08:00:00',
        closing_time: '17:00:00',
        operational_status: 'Open',
      },
    ],
    loading: false,
    error: null,
    refetch: jest.fn(),
  });
});

jest.mock('../hooks/useArv', () => ({
  useArv: () => ({
    arvStatus: 'Available',
    setArvStatus: jest.fn(),
    loading: false,
    error: null,
    saveArvStatus: jest.fn().mockResolvedValue({}),
  }),
}));

jest.mock('../utils/fetchServices', () => ({
  deleteService: jest.fn().mockResolvedValue({}),
}));

jest.mock('../utils/fetchClinics', () => ({
  updateClinic: jest.fn().mockResolvedValue({}),
}));

jest.mock('./components/AddServiceModal', () => {
  return ({ onAdd, onClose }: any) => (
    <div data-testid="add-service-modal">
      <button
        data-testid="confirm-add-btn"
        onClick={() =>
          onAdd({ service_id: `${Date.now()}`, service_name: 'New Service' })
        }
      >
        Confirm Add
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
});

jest.mock('./components/UpdateServiceModal', () => {
  return ({ service, onUpdate, onClose }: any) => (
    <div data-testid="update-service-modal">
      <span>Editing: {service.service_name}</span>
      <button
        data-testid="save-update-btn"
        onClick={() => onUpdate({ ...service, service_name: 'Updated Name' })}
      >
        Save Update
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
});

jest.mock('./components/SearchBar', () => {
  return ({ searchTerm, onSearchChange }: any) => (
    <input
      data-testid="search-input"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search services..."
    />
  );
});

jest.mock('./components/ServiceTable', () => {
  return ({ services, onEdit, onDelete }: any) => (
    <table data-testid="services-table">
      <tbody>
        {services.map((service: any) => (
          <tr key={service.service_id}>
            <td data-testid={`service-name-${service.service_id}`}>
              {service.service_name}
            </td>
            <td>
              <button onClick={() => onEdit(service.service_id)}>Edit</button>
              <button onClick={() => onDelete(service.service_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

jest.mock('./components/EditContactModal', () => {
  return ({ initialData }: any) => (
    <div data-testid="edit-contact">
      Contact: {initialData.telephone} | {initialData.location}
    </div>
  );
});

jest.mock('../shared-components/Layout', () => {
  return ({ children }: any) => <div data-testid="layout">{children}</div>;
});

describe('ServicesPage', () => {
  beforeEach(() => {
    mockServices = [
      { service_id: '1', service_name: 'Dental' },
      { service_id: '2', service_name: 'Cardiology' },
      { service_id: '3', service_name: 'Neurology' },
    ];
    mockSetServices.mockClear();
    (deleteService as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  it('renders correctly with initial content', () => {
    render(<ServicesPage />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('services-table')).toBeInTheDocument();
    expect(screen.getByText('Dental')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('Neurology')).toBeInTheDocument();
    expect(screen.getByText('Add Services')).toBeInTheDocument();
  });

  it('can open Add Service modal and add a new service', async () => {
    render(<ServicesPage />);
    await act(async () => {
      fireEvent.click(screen.getByText('Add Services'));
    });

    expect(screen.getByTestId('add-service-modal')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId('confirm-add-btn'));
    });

    expect(mockSetServices).toHaveBeenCalledWith(expect.any(Function));
  });

  it('can filter services using search', async () => {
    render(<ServicesPage />);
    const searchInput = screen.getByTestId('search-input');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Dental' } });
    });
    expect(screen.getByText('Dental')).toBeInTheDocument();
    expect(screen.queryByText('Cardiology')).not.toBeInTheDocument();
  });

  it('can delete a service through the confirmation modal', async () => {
    render(<ServicesPage />);
    const deleteButtons = screen.getAllByText('Delete');
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Confirm'));
    });

    await waitFor(() => {
      expect(deleteService).toHaveBeenCalledWith('1');
      expect(mockSetServices).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('can update a service name', async () => {
    render(<ServicesPage />);
    const editButtons = screen.getAllByText('Edit');
    await act(async () => {
      fireEvent.click(editButtons[0]);
    });

    expect(screen.getByTestId('update-service-modal')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId('save-update-btn'));
    });

    expect(mockSetServices).toHaveBeenCalledWith(expect.any(Function));
  });
});
