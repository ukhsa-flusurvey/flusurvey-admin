import Breadcrumbs from "@/components/Breadcrumbs";
import TabLinksNav from "@/components/TabLinksNav";

export default function Layout({
    children,
    params
}: {
    children: React.ReactNode;
    params: {
        studyKey: string;
    };
}) {

    return (
        <div className="px-6 h-full">
            <div className="pt-3">
                <Breadcrumbs
                    links={[
                        {
                            title: 'Studies',
                            href: '/tools/participants',
                        },
                        {
                            title: params.studyKey,
                        },
                    ]}
                />
                <TabLinksNav
                    className="bg-neutral-50 mt-4"
                    links={
                        [
                            {
                                title: 'Participants',
                                href: `/tools/participants/${params.studyKey}/participants`,
                            },
                            {
                                title: 'Responses',
                                href: `/tools/participants/${params.studyKey}/responses`,
                            },
                            {
                                title: 'Reports',
                                href: `/tools/participants/${params.studyKey}/reports`,
                            },
                            {
                                title: 'Files',
                                href: `/tools/participants/${params.studyKey}/files`,
                            },
                            {
                                title: 'Actions',
                                href: `/tools/participants/${params.studyKey}/actions`,
                            }
                        ]
                    }
                />
            </div>
            <main className="h-full pb-[94px]">
                {children}
            </main>
        </div>

    );
}
