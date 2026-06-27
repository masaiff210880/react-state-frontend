import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateLeadMutation,
  useDeleteLeadMutation,
  useGetLeadsQuery,
  useUpdateLeadMutation,
} from "../service/api-service";
import useDebounce from "../hooks/useDebounce";
import ConfirmModal from "../components/ConfirmModal";
import HeaderBar from "../components/HeaderBar";
import Sidebar from "../components/Sidebar";

const initialFormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  interestedProperty: "",
  unitType: "",
  budget: "",
  leadSource: "Website",
  status: "New",
};

function LeadsView({ onLogout }) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [unitTypeFilter, setUnitTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const debouncedSearch = useDebounce(searchText, 500);

  const {
    data: leadsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetLeadsQuery({
    search: debouncedSearch,
    status: statusFilter,
    unitType: unitTypeFilter,
    sortOrder,
  });

  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();

  const leads = leadsResponse?.data || [];
  const isBusy = isLoading || isFetching;

  const filteredLeads = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return leads;
    }

    return leads.filter((lead) => {
      return (
        lead.fullName?.toLowerCase().includes(query) ||
        lead.phoneNumber?.includes(query)
      );
    });
  }, [leads, searchText]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (lead) => {
    setEditingId(lead._id);
    setFormData({
      fullName: lead.fullName || "",
      email: lead.email || "",
      phoneNumber: lead.phoneNumber || "",
      interestedProperty: lead.interestedProperty || "",
      unitType: lead.unitType || "",
      budget: lead.budget ?? "",
      leadSource: lead.leadSource || "Website",
      status: lead.status || "New",
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    try {
      const payload = {
        ...formData,
        budget: Number(formData.budget),
      };

      if (editingId) {
        await updateLead({ id: editingId, ...payload }).unwrap();
      } else {
        await createLead(payload).unwrap();
      }

      setIsFormOpen(false);
      setEditingId(null);
      setFormData(initialFormData);
    } catch (submitError) {
      setFormError(submitError?.data?.error || "Failed to save lead.");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteLead(deleteTargetId).unwrap();
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    } catch (_deleteError) {
      setFormError("Failed to delete lead.");
    }
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const apiErrorMessage = error?.data?.message || "Unable to load leads.";
  const noLeadsAvailable = !isBusy && !isError && leads.length === 0;
  const noSearchResults =
    !isBusy && !isError && leads.length > 0 && filteredLeads.length === 0;

  return (
    <section className="dashboard-stage">
      <HeaderBar />
      <div className="dashboard-body">
        <Sidebar onLogout={onLogout} />
        <article className="dash-content">
          <h2>Leads</h2>
          <p>Manage and track buyer enquiries from one place.</p>

          <div className="leads-table-wrap">
            <div className="leads-toolbar">
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by lead name or phone number"
                className="leads-search"
              />

              <div className="lead-controls">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="leads-select"
                >
                  <option value="">All Status</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Site Visit Scheduled">
                    Site Visit Scheduled
                  </option>
                  <option value="Qualified">Qualified</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed">Closed</option>
                  <option value="Lost">Lost</option>
                </select>

                <select
                  value={unitTypeFilter}
                  onChange={(event) => setUnitTypeFilter(event.target.value)}
                  className="leads-select"
                >
                  <option value="">All Unit Types</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="4BHK">4BHK</option>
                  <option value="Villa">Villa</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="leads-select"
                >
                  <option value="desc">Created Date: Newest First</option>
                  <option value="asc">Created Date: Oldest First</option>
                </select>
              </div>

              <button
                type="button"
                className="add-lead-btn"
                onClick={handleOpenCreate}
              >
                Add Lead
              </button>
            </div>

            {isFormOpen ? (
              <form className="lead-form" onSubmit={handleFormSubmit}>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Full Name"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email"
                  required
                />
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  placeholder="Phone Number"
                  required
                />
                <input
                  name="interestedProperty"
                  value={formData.interestedProperty}
                  onChange={handleFormChange}
                  placeholder="Interested Property"
                  required
                />
                <input
                  name="unitType"
                  value={formData.unitType}
                  onChange={handleFormChange}
                  placeholder="Unit Type"
                  required
                />
                <input
                  name="budget"
                  type="number"
                  min="0"
                  value={formData.budget}
                  onChange={handleFormChange}
                  placeholder="Budget"
                  required
                />
                <select
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Website">Website</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Referral">Referral</option>
                  <option value="Walk-in">Walk-in</option>
                </select>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  required
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Site Visit Scheduled">
                    Site Visit Scheduled
                  </option>
                  <option value="Qualified">Qualified</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed">Closed</option>
                  <option value="Lost">Lost</option>
                </select>
                {formError ? (
                  <p className="form-error-inline">{formError}</p>
                ) : null}

                <div className="lead-form-actions">
                  <button
                    type="button"
                    className="table-btn"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="add-lead-btn"
                    disabled={isCreating || isUpdating}
                  >
                    {editingId ? "Update Lead" : "Create Lead"}
                  </button>
                </div>
              </form>
            ) : null}

            <div className="leads-table-scroll">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Unit Type</th>
                    <th>Status</th>
                    <th>Budget</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isBusy ? (
                    <tr>
                      <td colSpan="8" className="empty-row">
                        <div className="table-state state-loading">
                          <span
                            className="inline-spinner"
                            aria-hidden="true"
                          ></span>
                          <span>Loading leads, please wait...</span>
                        </div>
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan="8" className="empty-row">
                        <div className="table-state state-error">
                          <strong>Could not load leads</strong>
                          <p>{apiErrorMessage}</p>
                          <button
                            type="button"
                            className="table-btn retry-btn"
                            onClick={refetch}
                          >
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead._id}
                        className="lead-row"
                        onClick={() => navigate(`/leads/${lead._id}`)}
                      >
                        <td>{lead._id.slice(-6).toUpperCase()}</td>
                        <td>{lead.fullName}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phoneNumber}</td>
                        <td>{lead.unitType}</td>
                        <td>{lead.status}</td>
                        <td>
                          {Number(lead.budget || 0).toLocaleString("en-IN")}
                        </td>
                        <td>
                          <div className="row-actions">
                            <button
                              type="button"
                              className="table-btn edit-btn"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleOpenEdit(lead);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="table-btn delete-btn"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteClick(lead._id);
                              }}
                              disabled={isDeleting}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-row">
                        <div className="table-state state-empty">
                          {noLeadsAvailable ? (
                            <>
                              <strong>No leads found</strong>
                              <p>
                                Start by clicking Add Lead to create your first
                                entry.
                              </p>
                            </>
                          ) : noSearchResults ? (
                            <>
                              <strong>No leads matched your search</strong>
                              <p>Try changing search text or filter values.</p>
                            </>
                          ) : (
                            <>
                              <strong>No leads available</strong>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <ConfirmModal
              isOpen={isDeleteModalOpen}
              title="Delete Lead"
              message="Are you sure you want to delete this lead? This action cannot be undone."
              confirmText="Yes, Delete"
              cancelText="No"
              onConfirm={handleDelete}
              onCancel={handleCloseDeleteModal}
              isLoading={isDeleting}
            />
          </div>
        </article>
      </div>
    </section>
  );
}

export default LeadsView;
