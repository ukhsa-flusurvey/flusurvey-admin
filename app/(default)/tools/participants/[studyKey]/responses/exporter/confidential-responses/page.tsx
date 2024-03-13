import Breadcrumbs from "@/components/Breadcrumbs";
import ConfidentialResponseDownloader from "./ConfidentialResponseDownloader";


export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Confidential Responses',
    description: 'Download confidential responses from the study.',
}

interface PageProps {
    params: {
        studyKey: string;
    }
}

export default async function Page(props: PageProps) {

    return (
        <div className="py-unit-sm px-unit-lg">
            <Breadcrumbs
                homeLink={`/tools/participants/${props.params.studyKey}`}
                links={
                    [
                        {
                            title: `${props.params.studyKey}`,
                            href: `/tools/participants/${props.params.studyKey}`
                        },
                        {
                            title: `Confidential responses`
                        }
                    ]
                }
            />
            <main className="py-unit-lg">
                <div className="flex justify-center">
                    <ConfidentialResponseDownloader
                        studyKey={props.params.studyKey}
                    />
                </div>
            </main>
        </div>
    );
}
