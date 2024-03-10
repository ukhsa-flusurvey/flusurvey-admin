import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";
import TabLinksNav from "@/components/TabLinksNav";

export default function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        studyKey: string;
    };
}) {

    return (
        <SimpleBreadcrumbsPageLayout
            links={
                [
                    {
                        title: 'Studies',
                        href: '/tools/study-configurator',
                    },
                    {
                        title: params.studyKey,
                    },
                ]
            }
        >
            <TabLinksNav
                className="bg-neutral-50 mb-4"
                links={
                    [
                        {
                            title: 'Dashboard',
                            href: `/tools/study-configurator/${params.studyKey}`,
                            exact: true,
                        },
                        {
                            title: 'Surveys',
                            href: `/tools/study-configurator/${params.studyKey}/surveys`,
                        },
                        {
                            title: 'Rules',
                            href: `/tools/study-configurator/${params.studyKey}/rules`,
                        },
                        {
                            title: 'Settings',
                            href: `/tools/study-configurator/${params.studyKey}/settings`,
                        },
                    ]
                }
            />

            {children}
        </SimpleBreadcrumbsPageLayout>
    );
}
