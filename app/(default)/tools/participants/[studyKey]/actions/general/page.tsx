import StartActionForm from "./_components/start-action-form";

export default async function Page(
    props: {
        params: Promise<{
            studyKey: string;
        }>
    }
) {
    const { studyKey } = await props.params;

    return (
        <div>
            <StartActionForm
                studyKey={studyKey}
            />
        </div>
    );
}
