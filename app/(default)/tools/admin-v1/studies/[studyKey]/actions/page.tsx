import NotImplemented from "@/components/NotImplemented"

export default async function Page({ params: { studyKey } }: {
    params: {
        studyKey: string
    }
}) {



    return (
        <section className="bg-white rounded p-6 shadow-sm flex flex-col divide-y">
            <div className="flex gap-4 flex-col sm:flex-row pt-4 ">
                <div className="w-full sm:w-[400px]">
                    <h3 className="text-xl font-bold">Custom rules</h3>
                    <p className="text-gray-500 text-sm">
                        Custom rules can be triggered here manually. Here you can select a custom rule file and trigger the execution of the rules.
                    </p>
                </div>
                <div className="sm:ps-6">
                    <NotImplemented>
                        select custom rule file | trigger rule execution
                    </NotImplemented>

                    <NotImplemented className="mt-2">
                        see progress of rule execution
                    </NotImplemented>
                </div>
            </div>

        </section>
    )
}
