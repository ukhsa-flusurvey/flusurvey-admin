
export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        studyKey: string;
    }
}

export default async function Page(props: PageProps) {
    return (
        <main>
            {props.params.studyKey}
        </main>
    )
}
