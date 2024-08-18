import SMSTempatesSidebar from "./_components/SMSTemplatesSidebar";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "SMS Templates",
    description: "Configure SMS templates for this instance.",
}

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex max-w-full h-full">
            {
                <div className='sticky top-0 h-screen shrink z-50'>
                    <SMSTempatesSidebar />
                </div>
            }

            <div className="grow overflow-hidden">
                {children}
            </div>
        </div>
    );
}
