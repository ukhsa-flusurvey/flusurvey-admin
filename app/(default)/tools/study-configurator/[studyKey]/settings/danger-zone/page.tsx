import { StudyKeyPageParams } from "../../page";
import DangerZone from "./_components/DangerZone";

export const dynamic = 'force-dynamic';



export default function Page(props: StudyKeyPageParams) {

    return (
        <DangerZone
            studyKey={props.params.studyKey}
        />
    );
}
