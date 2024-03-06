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
            <div className="flex w-full">
                <ScheduleEditor />
            </div>
        </SimpleBreadcrumbsPageLayout>
    );
}
