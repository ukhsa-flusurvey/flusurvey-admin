import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsDownloader from "./_components/ReportsDownloader";

export default function Page({
    params: { studyKey }
}: {
    params: {
        studyKey: string;
    };
}) {

    return (
        <div
            className="h-full w-full py-6 flex flex-col" >
            <div className="">
                <BackButton
                    label="Back to participant explorer"
                    href={`/tools/participants/${studyKey}/participants`}
                />
            </div>

            <div className="grow flex overflow-hidden">
                <div className="w-full h-full flex flex-col">
                    <Card
                        variant={'opaque'}
                    >
                        <CardHeader>
                            <CardTitle>
                                Export Reports
                            </CardTitle>
                            <CardDescription>
                                Prepare a JSON file with all the reports for the given query and when ready download the file.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReportsDownloader
                                studyKey={studyKey}
                            />
                        </CardContent>
                    </Card >
                </div>
            </div>

        </div >
    );
}
