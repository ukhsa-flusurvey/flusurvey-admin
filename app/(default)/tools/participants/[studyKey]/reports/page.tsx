import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, HardDriveDownload } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { parseUnixSecondsToDate } from "@/lib/parse-unix-seconds-to-date";
import ReportViewer, { ReportViewerSkeleton } from "./_components/ReportViewer";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";
import { ReportsPageLinkContent } from "../../_components/breacrumbs-contents";
import ReportsToolbar from "./_components/ReportsToolbar";



export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Reports',
    description: 'Download participant reports from the study.',
}


interface PageProps {
    params: Promise<{
        studyKey: string;
    }>
    searchParams?: Promise<{
        pid?: string;
        from?: string;
        until?: string;
        reportKey?: string;
    }>
}

export default async function Page(props: PageProps) {
    const { studyKey } = await props.params;
    const searchParams = await props.searchParams;
    const reportsCompKey = studyKey + JSON.stringify(searchParams);

    return (
        <div
            className="h-full w-full flex flex-col" >
            <SidebarToggleWithBreadcrumbs
                breadcrumbs={[
                    {
                        href: "/tools/participants",
                        content: studyKey
                    },
                    {
                        // href: `/tools/participants/${props.params.studyKey}/reports`,
                        content: <ReportsPageLinkContent />
                    }
                ]}
            />
            <main className="grow flex overflow-hidden px-4 pb-1">
                <Card
                    variant={'opaque'}
                    className="w-full h-full flex flex-col overflow-hidden"
                >
                    <CardHeader
                        className="p-4 gap-1 bg-neutral-50"
                    >
                        <CardTitle className="flex items-center">
                            <div className="grow">
                                Reports
                            </div>
                            <Button
                                variant='link'
                                asChild
                                className="font-bold"
                            >
                                <Link
                                    href={`/tools/participants/${studyKey}/reports/exporter`}
                                >
                                    <HardDriveDownload className="size-4 me-2" />
                                    Open Exporter
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </CardTitle>
                        <ReportsToolbar
                            studyKey={studyKey}
                            searchParams={searchParams}
                        />
                    </CardHeader>
                    <Separator
                        className="bg-neutral-300"
                    />
                    <div className="grow flex overflow-hidden">
                        <Suspense
                            key={reportsCompKey}
                            fallback={<ReportViewerSkeleton />}>
                            <ReportViewer
                                studyKey={studyKey}
                                reportKey={searchParams?.reportKey}
                                pid={searchParams?.pid}
                                from={parseUnixSecondsToDate(searchParams?.from)}
                                until={parseUnixSecondsToDate(searchParams?.until)}
                            />
                        </Suspense>
                    </div>
                </Card>
            </main>
        </div>
    );
}
