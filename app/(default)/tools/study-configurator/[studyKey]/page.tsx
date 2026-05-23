import StudyDashboard from "./_components/StudyDashboard";

export interface StudyKeyPageParams {
    params: Promise<{
        studyKey: string
    }>
}

export const dynamic = 'force-dynamic';


export default async function Page(props: StudyKeyPageParams) {
    const { studyKey } = await props.params;
    return (
        <StudyDashboard
            studyKey={studyKey}
        />
    );
}
