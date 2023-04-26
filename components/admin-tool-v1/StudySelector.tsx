import { getStudies } from "@/utils/server/studyAPI";

export default async function StudySelector() {
    // sleep 1 s to show loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    let studies = [];
    try {
        studies = await getStudies();
    } catch (error) {
        console.log(error)
    }

    console.log(studies)

    if (!studies || studies.length === 0) {
        return (
            <>
                <div className="p-4 border border-dashed border-gray-300 rounded">
                    <p className=" text-gray-400">No studies found</p>
                    <p className="text-sm text-gray-400">Create your first study using the button below</p>
                </div>
            </>
        )
    }

    return (
        <>
            Study selector
        </>
    )
}
