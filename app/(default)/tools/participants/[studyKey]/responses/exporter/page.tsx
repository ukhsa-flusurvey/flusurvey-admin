import BackButton from "@/components/BackButton";

import ExporterTabs from "./_components/ExporterTabs";
import { getSurveyInfos } from "@/lib/data/studyAPI";
import { toast } from "sonner";

export default async function Page(
    {
        params: { studyKey }
    }: {
        params: {
            studyKey: string;
        };
    }
) {
    let surveyKeys: string[] = [];
    try {
        const resp = await getSurveyInfos(studyKey)

        if (resp.surveys) {
            surveyKeys = resp.surveys.map(s => s.key);
        }
    } catch (e) {
        toast.error('Failed to fetch survey keys');
        console.error(e);
    }


    return (
        <div
            className="h-full w-full py-6 flex flex-col" >
            <div className="">
                <BackButton
                    label="Back to response explorer"
                    href={`/tools/participants/${studyKey}/responses`}
                />
            </div>

            <div className="grow flex overflow-hidden">
                <div className="w-full h-full flex flex-col overflow-y-scroll">
                    <ExporterTabs
                        studyKey={studyKey}
                        availableSurveyKeys={surveyKeys}
                    />
                </div>
            </div>

        </div >
    );
}
