import Container from "@/components/Container";
import NotImplemented from "@/components/NotImplemented";
import Navbar from "@/components/admin-tool-v1/Navbar";
import SystemMessageTemplateUploader from "@/components/admin-tool-v1/SytemMessageTemplateUploader";


export default async function Page() {

    return (
        <>
            <Navbar
                links={[{
                    title: 'Home',
                    href: '/tools/admin-v1'
                },
                {
                    title: 'Messaging',
                },
                {
                    title: 'Common Templates',
                    href: '/tools/admin-v1/messaging/common-templates'
                }
                ]}
            />
            <Container className="py-6">
                <div className="bg-white rounded p-6">
                    <h2 className="text-2xl font-bold">Upload system message templates</h2>
                    <p className="text-gray-500 mb-6">Manage which templates should be used by the system for common system functions</p>
                    <NotImplemented className="my-6">
                        show a list of templates already uploaded in the system
                    </NotImplemented>

                    <SystemMessageTemplateUploader />
                </div>
            </Container>
        </>
    )
}
