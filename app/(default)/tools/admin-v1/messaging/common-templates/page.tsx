import Navbar from "@/components/admin-tool-v1/Navbar";

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
            TODO: page
        </>
    )
}
