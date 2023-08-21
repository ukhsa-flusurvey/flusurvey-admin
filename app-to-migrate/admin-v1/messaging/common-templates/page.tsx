import Container from "@/components/Container";
import NotImplemented from "@/components/NotImplemented";
import SystemMessageTemplateUploader from "@/app-to-migrate/admin-tool-v1/SytemMessageTemplateUploader";


export default async function Page() {

    return (
        <>
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
