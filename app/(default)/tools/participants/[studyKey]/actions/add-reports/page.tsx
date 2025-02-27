import AddReportsForm from "./_components/add-reports-form";

export default async function Page(
    { params }: {
        params: {
            studyKey: string;
        }
    }
) {
    return (
        <div>
            <AddReportsForm
                studyKey={params.studyKey}
            />
        </div>
    );
}
