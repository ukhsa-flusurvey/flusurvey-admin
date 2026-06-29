import { StudyKeyPageParams } from "../../page";
import DangerZone from "./_components/DangerZone";

export const dynamic = 'force-dynamic';



export default async function Page(props: StudyKeyPageParams) {
    const { studyKey } = await props.params;

    return (
        <DangerZone
            studyKey={studyKey}
        />
    );
}
