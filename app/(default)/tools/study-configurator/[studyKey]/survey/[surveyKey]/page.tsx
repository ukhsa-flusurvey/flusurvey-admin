import Breadcrumbs from "@/components/Breadcrumbs";
import NotImplemented from "@/components/NotImplemented";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SurveyEditActions from "./SurveyEditActions";


interface PageProps {
    params: {
        studyKey: string;
        surveyKey: string;
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        redirect('/auth/login?callbackUrl=/tools/study-configurator');
    }

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
                    <div className="grid grid-cols-2 gap-unit-md">
                        <NotImplemented >
                            list of existing survey versions
                        </NotImplemented>

                        <SurveyEditActions
                            studyKey={props.params.studyKey}
                            surveyKey={props.params.surveyKey}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}
