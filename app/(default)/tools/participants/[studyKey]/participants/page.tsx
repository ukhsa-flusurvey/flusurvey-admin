import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Search from "./_components/Search";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HardDriveDownload } from "lucide-react";
import { Suspense } from "react";
import ParticipantList, { ParticipantListSkeleton } from "./_components/ParticipantsList";
import ParticipantDetails, { ParticipantDetailsSkeleton } from "./_components/ParticipantDetails";




export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Participants',
}


interface PageProps {
    params: {
        studyKey: string;
    }
    searchParams?: {
        filter?: string;
        page?: string;
        selectedParticipant?: string;
    };
}

export default async function Page(props: PageProps) {

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
                                Participants
                            </div>
                            <Button
                                variant='link'
                                asChild
                                className="font-bold"
                            >
                                <Link
                                    href={`/tools/participants/${props.params.studyKey}/participants/exporter`}
                                >
                                    <HardDriveDownload className="size-4 me-2" />
                                    Open Exporter
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </CardTitle>
                        <div className="flex gap-12">
                            <div className="grow">
                                <Search />
                            </div>
                        </div>
                    </CardHeader>
                    <Separator
                        className="bg-neutral-300"
                    />

                    <div className="grow flex overflow-hidden">
                        <Suspense
                            key={props.params.studyKey + props.searchParams?.filter + props.searchParams?.page}
                            fallback={<ParticipantListSkeleton />}
                        >
                            <ParticipantList
                                studyKey={props.params.studyKey}
                                filter={props.searchParams?.filter}
                                page={props.searchParams?.page}
                                selectedParticipant={props.searchParams?.selectedParticipant}
                            />
                        </Suspense>

                        <div className="grow h-full overflow-auto">
                            <Suspense
                                key={props.params.studyKey + props.searchParams?.selectedParticipant}
                                fallback={<ParticipantDetailsSkeleton />}
                            >
                                <ParticipantDetails
                                    studyKey={props.params.studyKey}
                                    participantID={props.searchParams?.selectedParticipant}
                                />

                            </Suspense>
                        </div>
                    </div>
                </Card >
            </div>

        </div >
    )
}
