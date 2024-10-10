import BackButton from "@/components/BackButton";
import TaskTracker from "@/components/ExportTaskTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


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
            className="h-full w-full p-6 flex flex-col" >
            <div className="">
                <BackButton
                    label="Back to start action"
                    href={`/tools/participants/${studyKey}/actions/on-responses`}
                />
            </div>

            <div className="grow flex overflow-hidden">
                <div className="w-full h-full flex flex-col">
                    <Card
                        variant={'opaque'}
                    >
                        <CardHeader>
                            <CardTitle>
                                Study action execution for previous responses
                            </CardTitle>
                            <CardDescription>
                                {"Your task is running."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TaskTracker
                                taskID={taskID}
                                taskURLPrefix={`/v1/studies/${studyKey}/run-actions/previous-responses`}
                            />
                        </CardContent>
                    </Card >
                </div>
            </div>

        </div >
    );
}
