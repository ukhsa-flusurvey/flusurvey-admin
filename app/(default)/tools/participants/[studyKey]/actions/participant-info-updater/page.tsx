import ParticipantInfoUpdater from "./_components/participant-info-updater";

export default async function Page(
    { params }: {
        params: {
            studyKey: string;
        }
    }
) {
    return (
        <div>
            <ParticipantInfoUpdater
                studyKey={params.studyKey}
            />
        </div>
    );
}
