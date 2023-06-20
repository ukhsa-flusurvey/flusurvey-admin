import NotImplemented from "@/components/NotImplemented"
import StudyRuleUploader from "@/components/admin-tool-v1/StudyRuleUploader"
import SurveyOverview from "@/components/admin-tool-v1/SurveyOverview"
import SurveyUploader from "@/components/admin-tool-v1/SurveyUploader"
import { Suspense } from "react"

export default async function Page({ params: { studyKey } }: {
    params: {
        studyKey: string
    }
}) {



    return (
        <div className="flex flex-col gap-8">
            <section className="bg-white rounded p-6 shadow-sm flex flex-col divide-y">
                <h3 className="text-2xl font-bold mb-4">Surveys</h3>
                <div className="flex gap-4 py-4 flex-col sm:flex-row">
                    <div className="w-full sm:w-[400px]">
                        <h3 className="text-xl font-bold">Available surveys</h3>
                        <p className="text-gray-500 text-sm">
                            Currently available surveys for this study.
                        </p>
                    </div>
                    <div className="sm:ps-6">
                        <Suspense
                            fallback={<p>loading...</p>}
                        >
                            <SurveyOverview
                                studyKey={studyKey}
                            />
                        </Suspense>
                    </div>
                </div>
                <div className="flex gap-4 flex-col sm:flex-row pt-4 ">
                    <div className="w-full sm:w-[400px]">
                        <h3 className="text-xl font-bold">Upload survey</h3>
                        <p className="text-gray-500 text-sm">
                            You can upload a new survey version here. Drag and drop a file or click to browse into the marked field and click the button to upload.
                        </p>
                    </div>
                    <div className="sm:ps-6">
                        <SurveyUploader
                            studyKey={studyKey}
                        />
                    </div>
                </div>

            </section>


        </div>
    )
}
