import { redirect } from "next/navigation";
import TabNav from "../_components/tab-nav";
import DeleteUsersFormAndFeedback from "./_components/delete-users-form-and-feedback";
import { hasPermission } from "@/lib/permission-utils";
import ErrorAlert from "@/components/ErrorAlert";

export default async function Page() {
    let hasPermissionToDeleteUsers = false;
    try {
        hasPermissionToDeleteUsers = await hasPermission('users', '*', 'delete-users');
    } catch (error) {
        return <ErrorAlert
            title="Error loading permissions"
            error={error instanceof Error ? error.message : 'Unknown error'}
        />
    }

    if (!hasPermissionToDeleteUsers) {
        redirect('/auth/admin-account-required')
    }

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
