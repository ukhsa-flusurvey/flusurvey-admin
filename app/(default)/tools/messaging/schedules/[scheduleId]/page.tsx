import { Suspense } from "react";
import ScheduleEditorLoader, { ScheduleEditorLoaderSkeleton } from "../_components/ScheduleEditorLoader";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export const dynamic = 'force-dynamic';

export default function Page(
    props: {
        params: { scheduleId: string; }
    }
) {

    return (
        <SimpleBreadcrumbsPageLayout
            links={[
                {
                    title: 'Messaging Tools',
                    href: '/tools/messaging',
                },
                {
                    title: 'Schedules emails',
                    href: '/tools/messaging/schedules',
                },
                {
                    title: props.params.scheduleId,
                },
            ]}
        >
            <div className="flex ">
                <Suspense fallback={<ScheduleEditorLoaderSkeleton />}>
                    <ScheduleEditorLoader
                        id={props.params.scheduleId}
                    />
                </Suspense>
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}
