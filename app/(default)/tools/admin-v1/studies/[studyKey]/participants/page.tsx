import ParticipantManager from "./_components/ParticipantManager"

export default async function Page({ params: { studyKey } }: {
    params: {
        studyKey: string
    }
}) {
    return (
        <div className="p-4 bg-white">
            <h2 className="font-bold text-2xl mb-4">
                Participants for study {studyKey}
            </h2>
            <ParticipantManager studyKey={studyKey} />
        </div>
    )
}
