import StudyDashboard from "./_components/StudyDashboard";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";

interface PageProps {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {
    return (
        <SimpleBreadcrumbsPageLayout
            links={
                [
                    {
                        title: 'Studies',
                        href: '/tools/study-configurator',
                    },
                    {
                        title: props.params.studyKey,
                    },
                ]
            }
        >
            <StudyDashboard
                studyKey={props.params.studyKey}
            />
        </SimpleBreadcrumbsPageLayout>
    )
}
