import { getSurveysForStudy } from "@/utils/server/studyAPI";
import NotImplemented from "../NotImplemented";
import { SurveyInfos } from "@/utils/server/types/studyInfos";

interface SurveyOverviewProps {
    studyKey: string
}

export default async function SurveyOverview(props: SurveyOverviewProps) {
    let surveys: SurveyInfos;
    try {
        surveys = (await getSurveysForStudy(props.studyKey));
    } catch (error: any) {
        console.log(error)
        return (
            <div className="text-red-500">
                Error loading studies: {error.message}
            </div>

        )
    }

    // console.log(surveys)

    const renderSurveys = () => {
        if (!surveys || !surveys.infos || surveys.infos.length === 0) {
            return (
                <div className="p-4 border border-dashed border-gray-300 rounded">
                    <p className=" text-gray-400">No surveys found</p>
                    <p className="text-sm text-gray-400">Upload your first survey using the button below</p>
                </div>
            )
        }
        return (
            <div className="flex flex-col gap-2 ">
                {surveys.infos.map((survey) => (
                    <div
                        key={survey.surveyKey}
                        className="font-bold px-4 py-2 rounded border bg-gray-50 border-gray-200">
                        {survey.surveyKey}
                    </div>
                ))}
            </div>
        )
    }




    return <>
        {renderSurveys()}
        <NotImplemented className="mt-2">
            see version history | preview survey | delete survey versions
        </NotImplemented>
    </>
    /*

    if (!studies || studies.length === 0) {
        return (
            <>
                <div className="p-4 border border-dashed border-gray-300 rounded">
                    <p className=" text-gray-400">No studies found</p>
                    <p className="text-sm text-gray-400">Create your first study using the button below</p>
                </div>
            </>
        )
    }

    return (
        <>
            <h3 className="font-bold">Select study to edit:</h3>
            <div className="flex flex-col gap-2 ">
                {studies.studies.map((study: any) => (
                    <Link
                        key={study.id}
                        className="font-bold px-4 py-2 rounded border bg-gray-300 border-gray-200 hover:text-blue-600 hover:bg-gray-100"
                        href={`/tools/admin-v1/studies/${study.key}`}>
                        {study.key}
                    </Link>
                ))}
            </div>
            <hr className="my-2"></hr>
            <Link
                className="block font-bold px-4 py-2 rounded bg-slate-100 border-gray-200 hover:text-blue-600 hover:bg-gray-100"
                href='/tools/admin-v1/studies/new'
            >
                Create new study
            </Link>
        </>
    )*/
}
