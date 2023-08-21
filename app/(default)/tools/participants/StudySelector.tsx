import StudyCard from "@/components/StudyCard";
import { getStudies } from "@/utils/server/studyAPI";
import { Study } from "@/utils/server/types/studyInfos";
import { redirect } from "next/navigation";
import { BsJournalMedical } from "react-icons/bs";

export default async function StudySelector() {
    let studies: Study[] = [];
    try {
        const fetchedStudies = await getStudies();
        studies = fetchedStudies.studies ? fetchedStudies.studies : [];
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            redirect('/auth/login?callbackUrl=/tools/participants');
        }
    }

    studies = studies.map((study: Study) => {
        return {
            ...study,
            stats: {
                participantCount: typeof (study.stats.participantCount) === 'string' ? parseInt(study.stats.participantCount) : study.stats.participantCount,
                tempParticipantCount: typeof (study.stats.tempParticipantCount) === 'string' ? parseInt(study.stats.tempParticipantCount) : study.stats.tempParticipantCount,
                responseCount: typeof (study.stats.responseCount) === 'string' ? parseInt(study.stats.responseCount) : study.stats.responseCount,
            }
        }
    })


    return (
        <>
            {(!studies || studies.length === 0) && (
                <div className="flex py-unit-md flex-col justify-center items-center text-center">
                    <BsJournalMedical className="text-3xl text-default-300 mb-unit-sm" />
                    <p className="font-bold ">No studies</p>
                    <p className="text-default-500 text-small">You can create studies in the study configurator</p>
                </div>
            )}
            {studies && studies.length > 0 && (
                studies.map(
                    (study: Study) => {
                        return <StudyCard
                            key={study.key}
                            study={study}
                            baseURL='/tools/participants'
                        />
                    }
                )
            )}
        </>
    )
}
