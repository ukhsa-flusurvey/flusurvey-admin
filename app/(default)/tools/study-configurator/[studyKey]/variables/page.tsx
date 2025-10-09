import { StudyKeyPageParams } from "../page";


export default function Page(props: StudyKeyPageParams) {
    const studyKey = props.params.studyKey;

    console.log(studyKey);

    return (
        <div>
            <h1>Variables</h1>
        </div>
    )
}
