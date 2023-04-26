import CaseAdminHeader from "@/components/CaseAdminHeader";
import Container from "@/components/Container";
import Link from "next/link";

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
}

const ToolCard: React.FC<ToolCardProps> = (props) => {
    return (
        <Link href={props.href}
            className="p-4 border border-gray-300 rounded hover:ring-4 ring-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 "
        >
            <h3 className="text-lg font-semibold">{props.title}</h3>
            <p className="text-sm text-gray-600">{props.description}</p>

        </Link>
    )
}

export default async function Page() {
    return (
        <div className="h-full bg-slate-100">

            <div className='h-52 bg-cyan-800 -mb-52'>
            </div>
            <Container>
                <div className="border-t border-white/25"></div>
            </Container>
            <section className="mt-8">
                <Container className="">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white rounded shadow-sm p-8 h-full my-auto flex flex-col justify-center">
                            <div>
                                <CaseAdminHeader
                                    appName={process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools'}
                                />
                                <p className='mt-4'>This is the admin tool, to manage studies, surveys, messages and participants.</p>
                            </div>
                        </div>
                        <div className="bg-white rounded shadow-sm p-8">
                            <h2 className="text-xl font-bold">Tools</h2>
                            <div className="flex flex-col gap-4 mt-4">
                                <ToolCard
                                    title='Admin v1'
                                    description='Graphical user interface to upload and manage configuration files and templates.'
                                    href='/tools/admin-v1'
                                />
                                <ToolCard
                                    title='Service Status'
                                    description='Check the status of the services. You can use this to test, if the services are reachable from your network.'
                                    href='/service-status'
                                />
                            </div>

                        </div>

                    </div>
                </Container>
            </section>
        </div >
    )
}
