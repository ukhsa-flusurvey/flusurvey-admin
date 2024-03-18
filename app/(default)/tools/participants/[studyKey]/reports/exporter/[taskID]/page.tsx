import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TaskTracker from "../../../../../../../../components/ExportTaskTracker";

export default function Page(
    {
        params: { studyKey, taskID }
    }: {
        params: {
            studyKey: string;
            taskID: string;
        };
    }
) {

    return (
        <div
            className="h-full w-full py-6 flex flex-col" >
            <div className="">
                <BackButton
                    label="Back to exporter"
                    href={`/tools/participants/${studyKey}/reports/exporter`}
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
                            <TaskTracker
                                taskID={taskID}
                                taskURLPrefix={`/v1/studies/${studyKey}/data-exporter/reports`}
                            />
                        </CardContent>
                    </Card >
                </div>
            </div>

        </div >
    );
}
