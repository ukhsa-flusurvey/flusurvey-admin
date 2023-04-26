import Breadcrumbs from "@/components/Breadcrumbs";
import Container from "@/components/Container";
import Navbar from "@/components/admin-tool-v1/Navbar";
import Link from "next/link";


export default async function Page() {
    return (
        <>
            <Navbar
                links={[{
                    title: 'Home',
                    href: '/tools/admin-v1'
                }]}
            />
            <Container className="py-8 flex flex-col gap-8">
                <div className="bg-white rounded p-6 shadow-sm flex gap-4 flex-col sm:flex-row sm:divide-x">
                    <div className="w-full sm:w-[400px]">
                        <h3 className="text-xl font-bold">Studies</h3>
                        <p className="text-gray-500 text-sm">
                            Create a new study configuration, or manage an existing study by updating surveys, study rules or configs.
                        </p>
                    </div>
                    <div className="sm:ps-6">
                        add links
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
        </>
    )
}
