import TabNav from "../_components/tab-nav";
import DeleteUsersFormAndFeedback from "./_components/delete-users-form-and-feedback";

export default function Page() {

    return (
        <div className="space-y-6">
            <TabNav
                activeTab={'participant-users'}
            />
            <div className="flex w-full">
                <DeleteUsersFormAndFeedback />
            </div>
        </div>
    );
}
