import NotImplemented from "@/components/NotImplemented"
import StudyRuleUploader from "@/components/admin-tool-v1/StudyRuleUploader"

export default async function Page({ params: { studyKey } }: {
    params: {
        studyKey: string
    }
}) {
    return (
        <section className="bg-white rounded p-6 shadow-sm flex flex-col divide-y">
            <h3 className="text-2xl font-bold mb-4">Study rules</h3>
            <div className="flex gap-4 py-4 flex-col sm:flex-row">
                <div className="w-full sm:w-[400px]">
                    <h3 className="text-xl font-bold">Default Rules</h3>
                    <p className="text-gray-500 text-sm">
                        To update the default study rules use the file picker and click the button to upload.
                    </p>
                </div>
                <div className="sm:ps-6">
                    <StudyRuleUploader
                        studyKey={studyKey}
                    />
                    <NotImplemented className="mt-2">
                        see rule history (with update times) | preview active rules
                    </NotImplemented>
                </div>
            </div>
        </section>
    )
}
