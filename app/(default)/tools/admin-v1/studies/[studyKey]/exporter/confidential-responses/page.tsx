import ConfidentialResponseDownloader from "./ConfidentialResponseDownloader"

export default async function Page({ params: { studyKey } }: {
    params: {
        studyKey: string
    }
}) {


    return (
        <div className="p-4 bg-white">
            <h2 className="font-bold text-2xl mb-4">
                Confidential response exporter for study {studyKey}
            </h2>

            <ConfidentialResponseDownloader
                studyKey={studyKey}
            />
        </div>
    )
}
