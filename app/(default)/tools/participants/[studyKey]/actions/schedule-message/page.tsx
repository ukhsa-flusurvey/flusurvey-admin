import { getStudyMessageTemplates } from "@/lib/data/messagingAPI";
import { EmailTemplate } from "@/utils/server/types/messaging";
import ScheduleMessageActionForm from "./_components/schedule-message-action-form";

export default async function Page(
    { params }: {
        params: {
            studyKey: string;
        }
    }
) {

    const studyEmailTemplatesResp = await getStudyMessageTemplates();

    const studyEmailTemplates = studyEmailTemplatesResp.templates?.filter((t: EmailTemplate) => t.studyKey === params.studyKey) || [];

    return (
        <div>
            <ScheduleMessageActionForm
                studyKey={params.studyKey}
                availableStudyEmailTemplates={studyEmailTemplates}
            />
        </div>
    );
}
