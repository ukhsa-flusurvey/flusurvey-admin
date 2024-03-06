import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";
import CreateStudyForm from "./CreateStudyForm";


export const dynamic = 'force-dynamic';

export default async function Page() {
    return (
        <SimpleBreadcrumbsPageLayout
            links={
                [
                    {
                        title: 'Studies',
                        href: '/tools/study-configurator',
                    },
                    {
                        title: 'Create a new study',
                    },
                ]
            }
        >
            <div className="flex">
                <CreateStudyForm />
            </div>
        </SimpleBreadcrumbsPageLayout>
    )
}
