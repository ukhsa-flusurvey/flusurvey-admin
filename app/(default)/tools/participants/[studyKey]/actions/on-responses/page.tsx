import StartStudyActionOnPreviousResponses from "./_components/start-study-action-on-previous-responses";

export default async function Page(
    props: {
        params: Promise<{
            studyKey: string;
        }>
    }
) {
    const { studyKey } = await props.params;

    return (
        <StartStudyActionOnPreviousResponses
            studyKey={studyKey}
        />
    );
}
