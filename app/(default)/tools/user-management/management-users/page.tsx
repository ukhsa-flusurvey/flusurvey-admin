import { Suspense } from "react";
import TabNav from "../_components/tab-nav";
import ManagementUsers from "./_components/ManagementUsers";
import ManagementUsersLoader from "./_components/ManagementUsersLoader";

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <div className="space-y-6">
            <TabNav
                activeTab={'management-users'}
            />
            <div className="flex w-full">
                <Suspense
                    fallback={<ManagementUsersLoader />}
                >
                    <ManagementUsers />
                </Suspense>
            </div>

        </div>
    );
}
