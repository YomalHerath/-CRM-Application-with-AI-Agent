import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import LeadsTable from "../components/tables/LeadsTable";

export default function Leads() {
    return (
        <>
            <PageMeta
                title="CRM Dashboard | Leads"
                description="Manage your sales leads and potential customers."
            />
            <PageBreadcrumb pageTitle="Leads Management" />
            <div className="space-y-6">
                <LeadsTable />
            </div>
        </>
    );
}
