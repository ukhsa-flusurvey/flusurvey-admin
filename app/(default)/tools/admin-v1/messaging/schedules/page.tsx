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
                    title: 'Schedules',
                    href: '/tools/admin-v1/messaging/schedules'
                }
                ]}
            />
            TODO: page
        </>
    )
}
