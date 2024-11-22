import TabNav from "../../_components/tab-nav";
import NewServiceAccountForm from "./_components/new-service-account-form";

export default function Page() {

    return (
        <div className="space-y-6">
            <TabNav
                activeTab={'service-accounts'}
            />
            <NewServiceAccountForm />
        </div>
    );
}
