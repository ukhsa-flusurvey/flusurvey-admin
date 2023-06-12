import { MessageSchedule } from "@/utils/server/types/messaging";
import { getMessageSchedules } from "../utils";
import { redirect } from "next/navigation";
import MessageScheduleEditor from "@/components/admin-tool-v1/MessageScheduleEditor";

interface PageProps {
    params: {
        scheduleId: string
    }
}

export default async function Page(props: PageProps) {
    let schedules: MessageSchedule[];
    try {
        schedules = await getMessageSchedules();
    } catch (e) {
        redirect('/auth/login?callbackUrl=/tools/admin-v1/messaging/schedules')
    }

    const currentSchedule = schedules.find(s => s.id === props.params.scheduleId);

    if (!currentSchedule) {
        redirect('/tools/admin-v1/messaging/schedules')
    }

    return (
        <>
            <div className="p-6">
                <MessageScheduleEditor
                    scheduleToEdit={currentSchedule}
                />
            </div>
        </>
    )
}
