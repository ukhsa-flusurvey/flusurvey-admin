import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HardDriveDownload } from "lucide-react";
import { Suspense } from "react";
import ParticipantList, { ParticipantListSkeleton } from "./_components/ParticipantsList";
import ParticipantDetails, { ParticipantDetailsSkeleton } from "./_components/ParticipantDetails";
import QueryFilterInput from "@/components/QueryFilterInput";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";
import { ParticipantsPageLinkContent } from "../../_components/breacrumbs-contents";


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
        <div className="flex flex-col h-screen overflow-y-hidden">
            <SidebarToggleWithBreadcrumbs
                breadcrumbs={[
                    {
                        href: "/tools/participants",
                        content: props.params.studyKey
                    },
                    {
                        content: <ParticipantsPageLinkContent />
                    }
                ]}
            />


            <main className="px-4 flex flex-col gap-4 grow overflow-hidden pb-1">
                <Card
                    className="p-4 gap-1 bg-neutral-50"
                >
                    <CardTitle className="flex items-center justify-end">

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
                            <QueryFilterInput
                                id='participant-filter'
                            />
                        </div>
                    </div>
                </Card>

                <Card
                    variant={'opaque'}
                    className="flex flex-col overflow-hidden grow"
                >


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
            </main>


        </div >
    )
}
