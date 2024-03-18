import BackButton from "@/components/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TaskTracker from "@/components/ExportTaskTracker";

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
                    href={`/tools/participants/${studyKey}/responses/exporter`}
                />
            </div>

            <div className="grow flex overflow-hidden">
                <div className="w-full h-full flex flex-col">
                    <Card
                        variant={'opaque'}
                    >
                        <CardHeader>
                            <CardTitle>
                                Export Confidential Responses
                            </CardTitle>
                            <CardDescription>
                                {"Your file is being prepared. You can download it once it's ready."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TaskTracker
                                taskID={taskID}
                                taskURLPrefix={`/v1/studies/${studyKey}/data-exporter/confidential-responses`}
                            />
                        </CardContent>
                    </Card >
                </div>
            </div>

        </div >
    );
}
