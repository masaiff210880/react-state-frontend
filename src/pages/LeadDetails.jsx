import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import Sidebar from "../components/Sidebar";
import { useGetLeadByIdQuery } from "../service/api-service";

function LeadDetails({ onLogout }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: leadResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetLeadByIdQuery(id);

  const lead = leadResponse?.data;

  const detailItems = lead
    ? [
        { label: "Lead Id", value: lead._id },
        { label: "Full Name", value: lead.fullName },
        { label: "Email", value: lead.email },
        { label: "Phone Number", value: lead.phoneNumber },
        { label: "Interested Property", value: lead.interestedProperty },
        { label: "Unit Type", value: lead.unitType },
        {
          label: "Budget",
          value: Number(lead.budget || 0).toLocaleString("en-IN"),
        },
        { label: "Lead Source", value: lead.leadSource },
        { label: "Status", value: lead.status },
        {
          label: "Created At",
          value: lead.createdAt
            ? new Date(lead.createdAt).toLocaleString()
            : "-",
        },
        {
          label: "Updated At",
          value: lead.updatedAt
            ? new Date(lead.updatedAt).toLocaleString()
            : "-",
        },
      ]
    : [];

  return (
    <section className="dashboard-stage">
      <HeaderBar />
      <div className="dashboard-body">
        <Sidebar onLogout={onLogout} />
        <article className="dash-content">
          <div className="lead-details-head">
            <div>
              <h2>Lead Details</h2>
              <p>Detailed view for the selected lead.</p>
            </div>
            <button
              type="button"
              className="table-btn edit-btn"
              onClick={() => navigate("/leads")}
            >
              Back to Leads
            </button>
          </div>

          <section className="lead-details-card">
            {isLoading ? (
              <div className="table-state state-loading">
                <span className="inline-spinner" aria-hidden="true"></span>
                <span>Loading lead details...</span>
              </div>
            ) : isError ? (
              <div className="table-state state-error">
                <strong>Could not load lead details</strong>
                <p>{error?.data?.message || "Something went wrong."}</p>
                <button
                  type="button"
                  className="table-btn retry-btn"
                  onClick={refetch}
                >
                  Retry
                </button>
              </div>
            ) : lead ? (
              <div className="lead-details-grid">
                {detailItems.map((item) => (
                  <div className="lead-detail-item" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value || "-"}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-state state-empty">
                <strong>Lead not found</strong>
                <p>The requested lead does not exist.</p>
              </div>
            )}
          </section>
        </article>
      </div>
    </section>
  );
}

export default LeadDetails;
