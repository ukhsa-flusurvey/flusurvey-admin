import StartStudyActionOnPreviousResponses from "./_components/start-study-action-on-previous-responses";

export default function Page(props: {
    params: {
        studyKey: string;
    }
}) {

    return (
        <StartStudyActionOnPreviousResponses
            studyKey={props.params.studyKey}
        />
    );
}
