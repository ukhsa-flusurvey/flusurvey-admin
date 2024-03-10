import StudyList from "./_components/StudyList";


export const dynamic = 'force-dynamic';

export default async function Page() {
    return (
        <>
            <main
                className="p-6"
            >
                <div className="flex">
                    <StudyList />
                </div>
            </main>
        </>
    )
}
