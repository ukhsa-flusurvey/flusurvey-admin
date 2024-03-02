import Breadcrumbs from "@/components/Breadcrumbs";
import NewStudyForm from "./NewStudyForm";
import SimpleBreadcrumbsPageLayout from "@/components/SimpleBreadcrumbsPageLayout";


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
            <div className="">
                <NewStudyForm />
            </div>
        </SimpleBreadcrumbsPageLayout>
    )
}
