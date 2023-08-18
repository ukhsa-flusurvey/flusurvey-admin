import Breadcrumbs from "@/components/Breadcrumbs";
import { BsHouseFill } from "react-icons/bs";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import StudyDashboard from "./StudyDashboard";
import { getStudy } from "@/utils/server/studyAPI";

interface PageProps {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        redirect('/auth/login?callbackUrl=/tools/study-configurator');
    }

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
                    links={
                        [
                            {
                                href: '/tools/study-configurator',
                                title: <BsHouseFill />
                            },
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
