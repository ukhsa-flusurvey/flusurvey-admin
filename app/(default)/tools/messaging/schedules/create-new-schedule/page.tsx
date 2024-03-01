import Breadcrumbs from "@/components/Breadcrumbs";
import ScheduleEditor from "../_components/ScheduleEditor";

export default function Page() {

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
                                title: 'Scheduled Emails',
                                href: '/tools/messaging/schedules',
                            },
                            {
                                title: 'Create New Schedule',
                            },
                        ]
                    }
                />
            </div>
            <main className="py-6">
                <div className="flex w-full">
                    <ScheduleEditor />
                </div>
            </main>

        </div>
    );
}
