import HeaderBar from "../components/HeaderBar";
import Sidebar from "../components/Sidebar";
import { useGetLeadSummaryQuery } from "../service/api-service";

function DashboardView({ onLogout }) {
  const { data, isLoading, isFetching } = useGetLeadSummaryQuery();
  const summary = data?.data || {
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    siteVisitScheduledLeads: 0,
    closedLeads: 0,
    lostLeads: 0,
  };

  const cards = [
    { label: "Total Leads", value: summary.totalLeads },
    { label: "New Leads", value: summary.newLeads },
    { label: "Contacted Leads", value: summary.contactedLeads },
    {
      label: "Site Visit Scheduled Leads",
      value: summary.siteVisitScheduledLeads,
    },
    { label: "Closed Leads", value: summary.closedLeads },
    { label: "Lost Leads", value: summary.lostLeads },
  ];

  return (
    <section className="dashboard-stage">
      <HeaderBar />
      <div className="dashboard-body">
        <Sidebar onLogout={onLogout} />
        <article className="dash-content">
          <h2>Dashboard Overview</h2>
          <div className="stat-band">
            {cards.map((card) => (
              <div className="stat-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{isLoading || isFetching ? "..." : card.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default DashboardView;
