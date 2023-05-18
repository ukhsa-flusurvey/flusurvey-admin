import Container from "@/components/Container";
import Sidenav from "@/components/admin-tool-v1/Sidenav";
import StudySelector from "@/components/admin-tool-v1/StudySelector";
import { ClipboardDocumentListIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Suspense } from "react";


export const dynamic = 'force-dynamic';

export default async function Page() {

    return (
        <div className="flex w-full h-full">
            <Sidenav
                links={[
                    {
                        title: 'Study Management',
                        href: '/tools/admin-v1',
                        icon: <ClipboardDocumentListIcon className="w-6 h-6" />
                    },
                    {
                        title: 'Messaging',
                        href: '/tools/admin-v1/messaging',
                        icon: <EnvelopeIcon className="w-6 h-6" />
                    }
                ]}
            />
            <div className="overflow-y-scroll grow">
                <Container className="py-8 flex flex-col gap-8">
                    <div className="bg-white rounded p-6 shadow-sm flex gap-4 flex-col sm:flex-row sm:divide-x">
                        <div className="w-full sm:w-[400px]">
                            <h3 className="text-xl font-bold">Studies</h3>
                            <p className="text-gray-500 text-sm">
                                Create a new study configuration, or manage an existing study by updating surveys, study rules or configs.
                            </p>
                        </div>
                        <div className="sm:ps-6">
                            <Suspense
                                fallback={<p>loading...</p>}
                            >
                                {/* @ts-expect-error Async Server Component */}
                                <StudySelector />
                            </Suspense>
                        </div>
                    </div>

                    <div className="bg-white rounded p-6 shadow-sm flex gap-4 flex-col sm:flex-row  sm:divide-x">
                        <div className="w-full sm:w-[400px]">
                            <h3 className="text-xl font-bold">Messaging</h3>
                            <p className="text-gray-500 text-sm">
                                Manage message templates and schedules.
                            </p>
                        </div>
                        <div className="sm:ps-6 flex flex-col gap-2">
                            <Link
                                className="font-bold px-4 py-2 rounded border border-gray-200 hover:text-blue-600 hover:bg-gray-100"
                                href='/tools/admin-v1/messaging/common-templates'>
                                Manage System Messages
                            </Link>
                            <Link
                                className="font-bold px-4 py-2 rounded border border-gray-200 hover:text-blue-600 hover:bg-gray-100"
                                href='/tools/admin-v1/messaging/custom-templates'>
                                Manage Custom Messages Templates
                            </Link>
                            <Link
                                className="font-bold px-4 py-2 rounded border border-gray-200 hover:text-blue-600 hover:bg-gray-100"
                                href='/tools/admin-v1/messaging/schedules'>
                                Manage Schedules
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )
}
