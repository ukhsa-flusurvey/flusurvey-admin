import { getStudies } from "@/utils/server/studyAPI";
import Link from "next/link";

export default async function StudySelector() {

    let studies = [];
    try {
        studies = await getStudies();
    } catch (error: any) {
        console.log(error)
        return (
            <div className="text-red-500">
                Error loading studies: {error.message}
            </div>

        )
    }

    // console.log(studies)

    if (!studies || !studies.studies || studies.studies.length === 0) {
        return (
            <>
                <div className="p-4 border border-dashed border-gray-300 rounded mb-2">
                    <p className=" text-gray-400">No studies found</p>
                    <p className="text-sm text-gray-400">Create your first study using the button below</p>
                </div>
                <Link
                    className="block font-bold px-4 py-2 rounded bg-slate-100 border-gray-200 hover:text-blue-600 hover:bg-gray-100"
                    href='/tools/admin-v1/studies/new'
                >
                    Create new study
                </Link>
            </>
        )
    }

    return (
        <>
            <h3 className="font-bold">Select study to edit:</h3>
            <div className="flex flex-col gap-2 ">
                {studies.studies.map((study: any) => (
                    <Link
                        key={study.id}
                        className="font-bold px-4 py-2 rounded border bg-gray-300 border-gray-200 hover:text-blue-600 hover:bg-gray-100"
                        href={`/tools/admin-v1/studies/${study.key}`}>
                        {study.key}
                    </Link>
                ))}
            </div>
            <hr className="my-2"></hr>
            <Link
                className="block font-bold px-4 py-2 rounded bg-slate-100 border-gray-200 hover:text-blue-600 hover:bg-gray-100"
                href='/tools/admin-v1/studies/new'
            >
                Create new study
            </Link>
        </>
    )
}
