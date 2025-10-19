import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HardDriveDownload } from "lucide-react";
import { Suspense } from "react";
import ParticipantList, { ParticipantListSkeleton } from "./_components/ParticipantsList";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";
import { ParticipantsPageLinkContent } from "../../_components/breacrumbs-contents";
import ParticipantFilterPopover from "./_components/participant-filter-popover";
import SortConfig from "./_components/sort-config";
import { getSurveyInfos } from "@/lib/data/studyAPI";

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
        sortAscending?: string; // parsed to boolean below
    };
}

export default async function Page(props: PageProps) {
    const sortAscending = props.searchParams?.sortAscending === 'true';

    // Fetch survey keys for filter suggestions
    let surveyKeys: string[] = [];
    try {
        const resp = await getSurveyInfos(props.params.studyKey);
        if (resp.surveys) {
            surveyKeys = resp.surveys.map(s => s.key);
        }
    } catch (e) {
        console.error('Failed to fetch survey keys:', e);
    }

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


            <main className="px-4 flex flex-col gap-4 grow overflow-hidden py-1">

                <div className="flex gap-2">
                    <ParticipantFilterPopover surveyKeys={surveyKeys} />

                    <SortConfig />

                    <div className="grow" />
                    <Button
                        variant='outline'
                        asChild
                        className="font-bold rounded-full shadow-sm"
                    >
                        <Link
                            href={`/tools/participants/${props.params.studyKey}/participants/exporter`}
                        >
                            <HardDriveDownload className="size-4 me-2" />
                            Open Exporter
                            <ArrowRight className="ml-2 size-4" />
                        </Link>
                    </Button>


                </div>

                <Card
                    variant={'opaque'}
                    className="flex flex-col overflow-hidden grow rounded-xl"
                >


                    <div className="grow flex overflow-hidden">
                        <Suspense
                            key={props.params.studyKey + props.searchParams?.filter + props.searchParams?.page + (sortAscending ? '1' : '-1')}
                            fallback={<ParticipantListSkeleton />}
                        >
                            <ParticipantList
                                studyKey={props.params.studyKey}
                                filter={props.searchParams?.filter}
                                page={props.searchParams?.page}
                                sortAscending={sortAscending}
                            />
                        </Suspense>
                    </div>
                </Card >
            </main>


        </div >
    )
}
