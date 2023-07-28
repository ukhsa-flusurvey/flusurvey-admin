import { getSurveysForStudy } from "@/utils/server/studyAPI";
import { SurveyInfos } from "@/utils/server/types/studyInfos";
import ResponseDownloader from "./ResponseDownloader";
import SurveyInfoDownloader from "./SurveyInfoDownloader";


export default async function Page({ params: { studyKey } }: {
    params: {
        studyKey: string
    }
}) {
    let surveys: SurveyInfos | undefined;
    try {
        surveys = (await getSurveysForStudy(studyKey));
    } catch (error: any) {
        console.log(error)
    }


    return (
        <div className="p-4 bg-white">
            <h2 className="font-bold text-2xl mb-4">
                Response exporter for study {studyKey}
            </h2>

            <ResponseDownloader
                studyKey={studyKey}
                surveyInfos={surveys}
            />

            <div className="mt-16 rounded bg-neutral-200 p-3 mb-16">
                <SurveyInfoDownloader
                    studyKey={studyKey}
                    surveyInfos={surveys}
                />
            </div>

        </div>
    )
}
