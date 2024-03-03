import StudyDashboard from "./_components/StudyDashboard";

export interface StudyKeyPageParams {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: StudyKeyPageParams) {
    return (
        <StudyDashboard
            studyKey={props.params.studyKey}
        />
    )
}
