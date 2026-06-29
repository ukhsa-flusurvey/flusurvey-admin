import { getSurveyVersion, getSurveyVersions } from "@/lib/data/studyAPI";
import BackButton from "../../../../../../../../components/BackButton";
import ErrorAlert from "@/components/ErrorAlert";
import { AlertTriangle } from "lucide-react";


interface PageProps {
    params: Promise<{
        studyKey: string;
        surveyKey: string;
        versionId: string;
    }>
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {
    const { studyKey, surveyKey, versionId } = await props.params;

    // download survey
    const resp = await getSurveyVersion(studyKey, surveyKey, versionId);
    if (resp.error) {
        return (
            <div>
                <BackButton
                    label="Back to version overview"
                    href={`/tools/study-configurator/${studyKey}/surveys/${surveyKey}`}
                />
                <ErrorAlert
                    title='Could not load survey information'
                    error={resp.error}
                />
            </div>
        );
    }
    const surveyDef = resp.survey;

    const versionsResp = await getSurveyVersions(studyKey, surveyKey);
    const versions = versionsResp.versions;

    const warnIfNotLatest = versions && versions.length > 0 && versions[0].versionId !== versionId;

    return (
        <>
            <div className="space-y-4">
                <div className="flex gap-4 justify-between">
                    <BackButton
                        label="Back to version overview"
                        href={`/tools/study-configurator/${studyKey}/surveys/${surveyKey}`}
                    />
                    {warnIfNotLatest && <div className="flex items-center bg-yellow-100 border text-sm px-2 py-1 rounded-md">
                        <span>
                            <AlertTriangle className="size-6 me-2 text-yellow-600" />
                        </span>
                        <p>
                            You are currently editing an older version of the survey. This might override changes made in the latest version.
                        </p>
                    </div>}


                </div>
                <div>
                    Survey editor would open here for {surveyDef?.surveyDefinition.key}
                </div>
            </div>
        </>
    );
}
