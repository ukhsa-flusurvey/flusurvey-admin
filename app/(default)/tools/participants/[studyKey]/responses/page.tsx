
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HardDriveDownload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import ResponseFilter, { ResponseFilterSkeleton } from "./_components/ResponseFilter";
import ResponseTable, { ResponseTableSkeleton } from "./_components/ResponseTable";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";
import { ResponsesPageLinkContent } from "../../_components/breacrumbs-contents";


export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Responses',
    description: 'Download responses from the study.',
}


interface PageProps {
    params: Promise<{
        studyKey: string;
    }>
    searchParams?: Promise<{
        surveyKey?: string;
        laterThan?: number;
        earlierThan?: number;
        page?: string;
    }>
}

export default async function Page(props: PageProps) {
    const { studyKey } = await props.params;
    const searchParams = await props.searchParams;

    const responseTableKey = studyKey + JSON.stringify(searchParams);

    return (
        <div className="flex flex-col h-screen">
            <SidebarToggleWithBreadcrumbs
                breadcrumbs={[
                    {
                        href: "/tools/participants",
                        content: studyKey
                    },
                    {
                        content: <ResponsesPageLinkContent />
                    }
                ]}
            />
            <main className="px-4 flex flex-col grow p-1 overflow-hidden">
                <Card
                    variant={'opaque'}
                    className="grow flex flex-col overflow-hidden"
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
                                    href={`/tools/participants/${studyKey}/responses/exporter`}
                                >
                                    <HardDriveDownload className="size-4 me-2" />
                                    Open Exporter
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </CardTitle>

                        <Suspense fallback={<ResponseFilterSkeleton />}>
                            <ResponseFilter
                                studyKey={studyKey}
                            />
                        </Suspense>
                    </CardHeader>
                    <Separator />
                    <div className="grow flex overflow-hidden">
                        <Suspense
                            key={responseTableKey}
                            fallback={<ResponseTableSkeleton />}>
                            <ResponseTable
                                studyKey={studyKey}
                                searchParams={searchParams}
                            />
                        </Suspense>
                    </div>
                </Card>

            </main>
        </div>
    );
}
