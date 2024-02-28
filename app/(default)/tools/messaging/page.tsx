import LinkCard from "@/components/LinkCard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, CalendarClock, Info, Megaphone } from "lucide-react";




export default async function Page() {

    return (
        <main className="p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            <Card
                variant={"opaque"}
            >
                <CardHeader>
                    <CardTitle>
                        Email templates
                    </CardTitle>
                    <CardDescription>
                        Configure email templates for system messages and custom messages.
                    </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6 flex flex-col gap-3">
                    <LinkCard
                        href="/tools/messaging/email-templates/system-templates"
                        title="System templates"
                        description="Configure email templates for system messages, like signup, password reset, etc."
                        icon={<Info className="size-8" />}
                    />

                    <LinkCard
                        href="/tools/messaging/email-templates/global-templates"
                        title="Global templates"
                        description="You can specify global email templates that can be used across all studies."
                        icon={<Megaphone className="size-8" />}
                    />

                    <LinkCard
                        href="/tools/messaging/email-templates/study-templates"
                        title="Study templates"
                        description="Configure email templates for study-specific messages, like reminders, etc."
                        icon={<BellRing className="size-8" />}
                    />
                </div>
            </Card>

            <div>
                <Card
                    variant={"opaque"}
                >
                    <CardHeader>
                        <CardTitle>
                            Scheduled messages
                        </CardTitle>
                        <CardDescription>
                            Configure messages to be sent periodically or at specific times.
                        </CardDescription>
                    </CardHeader>
                    <div className="px-6 pb-6 flex flex-col gap-3">
                        <LinkCard
                            href="/tools/messaging/schedules"
                            title="Manage schedules"
                            description="Go to schedule overview"
                            icon={<CalendarClock className="size-8" />}
                        />
                    </div>
                </Card>
            </div>

        </main>
    )
}
