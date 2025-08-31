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
    params: {
        studyKey: string;
    }
    searchParams?: {
        pid?: string;
        from?: string;
        until?: string;
        reportKey?: string;
    }
}

export default async function Page(props: PageProps) {
    const reportsCompKey = props.params.studyKey + JSON.stringify(props.searchParams);

    return (
        <div
            className="h-full w-full flex flex-col" >
            <SidebarToggleWithBreadcrumbs
                breadcrumbs={[
                    {
                        href: "/tools/participants",
                        content: props.params.studyKey
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
                                    href={`/tools/participants/${props.params.studyKey}/reports/exporter`}
                                >
                                    <HardDriveDownload className="size-4 me-2" />
                                    Open Exporter
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </CardTitle>
                        <ReportsToolbar
                            studyKey={props.params.studyKey}
                            searchParams={props.searchParams}
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
                                studyKey={props.params.studyKey}
                                reportKey={props.searchParams?.reportKey}
                                pid={props.searchParams?.pid}
                                from={parseUnixSecondsToDate(props.searchParams?.from)}
                                until={parseUnixSecondsToDate(props.searchParams?.until)}
                            />
                        </Suspense>
                    </div>
                </Card>
            </main>
        </div>
    );
}
