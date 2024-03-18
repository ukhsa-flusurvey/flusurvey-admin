import BackButton from "@/components/BackButton";

import ExporterTabs from "./_components/ExporterTabs";

export default function Page(
    {
        params: { studyKey }
    }: {
        params: {
            studyKey: string;
        };
    }
) {

    return (
        <div
            className="h-full w-full py-6 flex flex-col" >
            <div className="">
                <BackButton
                    label="Back to response explorer"
                    href={`/tools/participants/${studyKey}/responses`}
                />
            </div>

            <div className="grow flex overflow-hidden">
                <div className="w-full h-full flex flex-col">
                    <ExporterTabs
                        studyKey={studyKey}
                    />
                </div>
            </div>

        </div >
    );
}
