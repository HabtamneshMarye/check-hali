'use client';

interface Service {
  service_id: string;
  service_name: string;
  status: string;
  description: string;
}

interface ServicesTableProps {
  services: Service[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ServicesTable = ({ services, onEdit, onDelete }: ServicesTableProps) => {
  if (services.length === 0) {
    return (
      <div className="mt-4">
        <table className="min-w-full bg-transparent border border-gray-300 table-fixed">
          <thead>
            <tr className="text-left text-[#172A5A] font-bold text-2xl border-b border-gray-300">
              <th className="py-4 px-6 border-r border-gray-300 w-1/4">Services</th>
              <th className="py-4 px-6 border-r border-gray-300 w-1/4">Status</th>
              <th className="py-4 px-6 border-r border-gray-300 w-1/4">Description</th>
              <th className="py-4 px-6 w-1/4">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="py-4 px-6 text-center text-gray-500 border-t border-gray-300">
                No match found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <table className="min-w-full bg-transparent border border-gray-300 table-fixed">
        <thead>
          <tr className="text-left text-[#172A5A] font-bold text-xl border-b border-gray-300">
            <th className="py-4 px-6 border-r border-gray-300 w-1/4">Services</th>
            <th className="py-4 px-6 border-r border-gray-300 w-1/4">Status</th>
            <th className="py-4 px-6 border-r border-gray-300 w-1/4">Description</th>
            <th className="py-4 px-6 w-1/4">Action</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr
              key={service.service_id}
              className="font-medium text-[#172A5A] text-base border-b border-gray-300">
              <td className="py-4 px-6 border-r border-gray-300 w-1/4">{service.service_name}</td>
              <td className="py-4 px-6 border-r border-gray-300 w-1/4">
                <span className="text-[#172A5A] font-medium text-lg">{service.status}</span>
              </td>
              <td className="py-4 px-6 border-r border-gray-300 text-lg w-1/4">
                <div className="relative group">
                  <span className="truncate w-40 inline-block">
                    {service.description.length > 20
                      ? `${service.description.slice(0, 20)}...`
                      : service.description || 'No description available'}
                  </span>
                  {service.description.length > 20 && (
                    <span className="absolute hidden group-hover:block bg-white border border-gray-300 p-2 rounded shadow-lg w-64 z-10">
                      {service.description || 'No description available'}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-4 px-6 w-1/4">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(service.service_id)}
                    className="bg-[#597DD8] text-white px-3 py-1 rounded text-lg hover:bg-[#10004B]
                   transition font-bold cursor-pointer"
                    style={{ minWidth: 100 }}> Edit </button>

                  <button
                    onClick={() => onDelete(service.service_id)}
                    className="bg-[#E05656] text-white px-4 py-1 rounded text-sm hover:bg-[#F94A7A]
                   transition font-bold cursor-pointer"
                    style={{ minWidth: 100 }}> Delete </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTable;