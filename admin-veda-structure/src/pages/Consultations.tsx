import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, CalendarCheck } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import consultationService, {
  ConsultationRequest,
} from "@/services/consultationService";

const consultationStatuses = ["Pending", "Read"];

export default function Consultations() {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConsultations = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await consultationService.getConsultations();
        setConsultations(data);
      } catch (err) {
        setError(
          (err as Error).message || "Unable to load consultation requests",
        );
      } finally {
        setLoading(false);
      }
    };

    loadConsultations();
  }, []);

  const filtered = useMemo(() => {
    return consultations.filter((item) => {
      if (search) {
        const query = search.toLowerCase();
        const matches =
          item.fullName.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.phone.includes(query) ||
          item.message.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query);
        if (!matches) {
          return false;
        }
      }

      if (status) {
        if (status === "Read") {
          return item.isRead;
        }
        if (status === "Pending") {
          return !item.isRead;
        }
      }

      return true;
    });
  }, [consultations, search, status]);

  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <PageHeader
        title="Consultations"
        subtitle="View all customer consultation requests submitted through the website."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search by name, email, phone, or ID..."
        />
        <FilterDropdown
          label="Status"
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={consultationStatuses}
        />
      </div>

      {error ? (
        <div className="card p-6 bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-charcoal-500">
            Loading consultations...
          </div>
        ) : current.length === 0 ? (
          <EmptyState
            title="No consultations found"
            message="There are no consultation requests matching your filters."
            icon={<CalendarCheck className="w-8 h-8 text-charcoal-300" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-50 text-charcoal-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">
                    Request ID
                  </th>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Phone</th>
                  <th className="text-left px-5 py-3 font-medium">DOB</th>
                  <th className="text-left px-5 py-3 font-medium">ToB</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {current.map((item) => (
                  <tr key={item.id} className="table-row-hover">
                    <td className="px-5 py-3 font-medium text-charcoal-700">
                      {item.id}
                    </td>
                    <td className="px-5 py-3 text-charcoal-600">
                      {item.fullName}
                    </td>
                    <td className="px-5 py-3 text-charcoal-500">
                      {item.email}
                    </td>
                    <td className="px-5 py-3 text-charcoal-500">
                      {item.phone}
                    </td>
                    <td className="px-5 py-3 text-charcoal-600">
                      {item.dateOfBirth}
                    </td>
                    <td className="px-5 py-3 text-charcoal-600">
                      {item.timeOfBirth}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={item.isRead ? "Read" : "Pending"} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/admin/consultations/${item.id}`}
                        className="inline-flex items-center gap-2 text-saffron-600 hover:text-saffron-700"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {current.length > 0 && (
          <div className="px-5 py-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
