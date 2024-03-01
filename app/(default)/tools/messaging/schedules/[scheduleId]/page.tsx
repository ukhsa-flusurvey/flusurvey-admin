import Breadcrumbs from "@/components/Breadcrumbs";
import { Suspense } from "react";
import ScheduleEditorLoader, { ScheduleEditorLoaderSkeleton } from "../_components/ScheduleEditorLoader";

export default function Page(
    props: {
        params: { scheduleId: string; }
    }
) {

    return (
        <div className="px-6">
            <div className="pt-3 flex gap-8">
                <Breadcrumbs
                    links={
                        [
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
                        ]
                    }
                />
            </div>
            <main className="py-6">
                <div className="flex ">
                    <Suspense fallback={<ScheduleEditorLoaderSkeleton />}>
                        <ScheduleEditorLoader
                            id={props.params.scheduleId}
                        />
                    </Suspense>
                </div>
            </main>

        </div>
    );
}
