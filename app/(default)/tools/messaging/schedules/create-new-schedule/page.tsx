import ScheduleEditor from "../_components/ScheduleEditor";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

export default function Page() {

    return (
        <SimpleBreadcrumbsPageLayout
            links={
                [
                    {
                        title: 'Messaging Tools',
                        href: '/tools/messaging',
                    },
                    {
                        title: 'Scheduled Emails',
                        href: '/tools/messaging/schedules',
                    },
                    {
                        title: 'Create New Schedule',
                    },
                ]
            }
        >
            <div
                className="h-full w-full pb-6 flex flex-col gap-4" >
                <div className="grow flex overflow-hidden">
                    <ScheduleEditor />
                </div>
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}
