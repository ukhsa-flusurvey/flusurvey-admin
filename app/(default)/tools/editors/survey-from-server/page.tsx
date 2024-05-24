
import { Suspense } from "react";
import SurveyEditorLoader from "./_components/survey-editor-loader";


interface PageProps {
    searchParams: {
        studyKey: string;
        surveyKey: string;
        versionId: string;
    }
}

export default async function Page(props: PageProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SurveyEditorLoader
                studyKey={props.searchParams.studyKey}
                surveyKey={props.searchParams.surveyKey}
                versionId={props.searchParams.versionId}
            />
        </Suspense>
    )

}
