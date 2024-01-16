import Breadcrumbs from "@/components/Breadcrumbs";
import { getSurveyKeys } from "@/lib/data/studyAPI";
import SurveyInfoDownloader from "./SurveyInfoDownloader";
import ResponseDownloader from "./ResponseDownloader";
import { pageTitle } from "@/utils/pageTitle";


export const dynamic = 'force-dynamic';

export const metadata = {
    title: pageTitle('Responses'),
    description: 'Download responses from the study.',
}


interface PageProps {
    params: {
        studyKey: string;
    }
}

export default async function Page(props: PageProps) {
    let surveyKeys: string[] = [];
    try {
        const resp = await getSurveyKeys(props.params.studyKey)
        if (resp.keys) {
            surveyKeys = resp.keys;
        }
    } catch (e) {
        console.error(e);
    }

    return (
        <div className="py-unit-sm px-unit-lg">
            <Breadcrumbs
                homeLink={`/tools/participants`}
                links={
                    [
                        {
                            title: `${props.params.studyKey}`,
                            href: `/tools/participants/${props.params.studyKey}`
                        },
                        {
                            title: `Response downloader`
                        }
                    ]
                }
            />
            <main className="py-unit-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-lg">
                    <ResponseDownloader
                        studyKey={props.params.studyKey}
                        availableSurveys={surveyKeys}
                    />
                    <SurveyInfoDownloader
                        studyKey={props.params.studyKey}
                        availableSurveys={surveyKeys}
                    />
                </div>
            </main>
        </div>
    );
}
