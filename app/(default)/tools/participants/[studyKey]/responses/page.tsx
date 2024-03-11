
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HardDriveDownload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import ResponseFilter, { ResponseFilterSkeleton } from "./_components/ResponseFilter";
import ResponseTable, { ResponseTableSkeleton } from "./_components/ResponseTable";


export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Responses',
    description: 'Download responses from the study.',
}


interface PageProps {
    params: {
        studyKey: string;
    }
    searchParams?: {
        surveyKey?: string;
        laterThan?: number;
        earlierThan?: number;
        page?: string;
    }
}

export default async function Page(props: PageProps) {

    const responseTableKey = props.params.studyKey + JSON.stringify(props.searchParams);

    return (
        <div
            className="h-full w-full py-6 flex flex-col gap-4" >
            <div className="grow flex overflow-hidden">
                <Card
                    variant={'opaque'}
                    className="w-full h-full flex flex-col overflow-hidden"
                >
                    <CardHeader
                        className="p-4 gap-1 bg-neutral-50"
                    >
                        <CardTitle className="flex items-center">
                            <div className="grow">
                                Responses
                            </div>
                            <Button
                                variant='link'
                                asChild
                                className="font-bold"
                            >
                                <Link
                                    href={`/tools/participants/${props.params.studyKey}/responses/exporter`}
                                >
                                    <HardDriveDownload className="size-4 me-2" />
                                    Open Exporter
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </CardTitle>

                        <Suspense fallback={<ResponseFilterSkeleton />}>
                            <ResponseFilter
                                studyKey={props.params.studyKey}
                            />
                        </Suspense>
                    </CardHeader>
                    <Separator
                        className="bg-neutral-300"
                    />
                    <div className="grow flex overflow-hidden">
                        <Suspense
                            key={responseTableKey}
                            fallback={<ResponseTableSkeleton />}>
                            <ResponseTable
                                studyKey={props.params.studyKey}
                                searchParams={props.searchParams}
                            />
                        </Suspense>
                    </div>
                </Card>

            </div>
        </div>

    )
}
