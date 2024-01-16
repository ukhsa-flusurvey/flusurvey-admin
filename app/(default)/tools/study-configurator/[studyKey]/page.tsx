import Breadcrumbs from "@/components/Breadcrumbs";
import StudyDashboard from "./StudyDashboard";
import { getStudy } from "@/lib/data/studyAPI";

interface PageProps {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {

    let study = await getStudy(props.params.studyKey);
    study = {
        ...study,
        stats: {
            participantCount: typeof (study.stats.participantCount) === 'string' ? parseInt(study.stats.participantCount) : study.stats.participantCount,
            tempParticipantCount: typeof (study.stats.tempParticipantCount) === 'string' ? parseInt(study.stats.tempParticipantCount) : study.stats.tempParticipantCount,
            responseCount: typeof (study.stats.responseCount) === 'string' ? parseInt(study.stats.responseCount) : study.stats.responseCount,
        }
    }



    return (
        <div className="px-unit-lg bg-white/60 h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    homeLink="/tools/study-configurator"
                    links={
                        [
                            {
                                title: props.params.studyKey
                            }
                        ]
                    }
                />
                <main className="py-unit-lg">
                    <StudyDashboard
                        studyKey={props.params.studyKey}
                        study={study}
                    />
                </main>
            </div>
        </div>
    )
}
