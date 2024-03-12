import Breadcrumbs from "@/components/Breadcrumbs";
import ParticipantFileDownloader from "./ParticipantFileDownloader";


export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Participant Files',
    description: 'Download participant from the study.',
}


interface PageProps {
    params: {
        studyKey: string;
    }
}

export default async function Page(props: PageProps) {

    return (
        <div className="py-unit-sm px-unit-lg">
            <main className="py-unit-lg">
                <ParticipantFileDownloader
                    studyKey={props.params.studyKey}
                />
            </main>
        </div>
    );
}
