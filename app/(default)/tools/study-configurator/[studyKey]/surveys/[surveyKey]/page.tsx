import Breadcrumbs from "@/components/Breadcrumbs";
import SurveyHistoryView from "./SurveyHistoryView";


interface PageProps {
    params: {
        studyKey: string;
        surveyKey: string;
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {

    return (
        <div className="px-unit-lg bg-white/60 h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    homeLink="/tools/study-configurator"
                    links={
                        [
                            {
                                title: props.params.studyKey,
                                href: `/tools/study-configurator/${props.params.studyKey}`,
                            },
                            {
                                title: `Survey: ${props.params.surveyKey}`,
                            }
                        ]
                    }
                />
                <main className="py-unit-lg">
                    <SurveyHistoryView
                        studyKey={props.params.studyKey}
                        surveyKey={props.params.surveyKey}
                    />
                </main>
            </div>
        </div>
    )
}
