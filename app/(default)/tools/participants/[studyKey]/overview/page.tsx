import Breadcrumbs from "@/components/Breadcrumbs";
import ParticipantOverviewScreen from "./ParticipantOverviewScreen";
import { pageTitle } from "@/utils/pageTitle";



export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        studyKey: string;
    }
}

export const metadata = {
    title: pageTitle('Participants overview'),
    description: 'View and manage participants in your study.',
}


export default async function Page(props: PageProps) {

    return (
        <div className="relative h-full bg-white/70 w-full">
            <div className="absolute top-0 left-0 py-unit-sm w-full px-unit-lg shadow-sm bg-white border-b border-default-200 z-10">
                <Breadcrumbs
                    homeLink={`/tools/participants/${props.params.studyKey}`}
                    links={
                        [
                            {
                                title: `${props.params.studyKey}`,
                                href: `/tools/participants/${props.params.studyKey}`
                            },
                            {
                                title: `Participants overview`
                            }
                        ]
                    }
                />
            </div>
            <main className="pt-11 px-unit-lg h-full" >
                <ParticipantOverviewScreen
                    studyKey={props.params.studyKey}
                />
            </main>
        </div>
    );
}
