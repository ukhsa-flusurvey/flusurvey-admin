import { Suspense } from "react";
import TabNav from "../_components/tab-nav";
import ServiceAccountsSkeleton from "./_components/service-accounts-skeleton";
import ServiceAccounts from "./_components/service-accounts";

export default function Page() {

    return (
        <div className="space-y-6">
            <TabNav
                activeTab={'service-accounts'}
            />
            <div className="flex w-full">
                <Suspense
                    fallback={<ServiceAccountsSkeleton />}
                >
                    <ServiceAccounts />
                </Suspense>
            </div>

        </div>
    );
}
