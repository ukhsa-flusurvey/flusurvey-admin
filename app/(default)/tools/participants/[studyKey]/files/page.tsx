import QueryFilterInput from "@/components/QueryFilterInput";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Suspense } from "react";
import ParticipantFiles, { ParticipantFilesSkeleton } from "./_components/ParticipantFiles";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Participant Files',
    description: 'Download participant from the study.',
}


interface PageProps {
    params: {
        studyKey: string;
    }
    searchParams?: {
        filter?: string;
    }
}

export default async function Page(props: PageProps) {
    const filesCompKey = props.params.studyKey + JSON.stringify(props.searchParams);

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
                                Files
                            </div>
                        </CardTitle>
                        <CardDescription>
                            If the study accepts file uploads, you can access the files through this page.
                        </CardDescription>

                        <QueryFilterInput
                            id='files-filter'
                        />
                    </CardHeader>
                    <Separator
                        className="bg-neutral-300"
                    />
                    <div className="grow flex overflow-hidden">
                        <Suspense
                            key={filesCompKey}
                            fallback={<ParticipantFilesSkeleton />}>
                            <ParticipantFiles
                                studyKey={props.params.studyKey}
                                filter={props.searchParams?.filter}
                            />
                        </Suspense>
                    </div>
                </Card>
            </div>
        </div>
    );
}
