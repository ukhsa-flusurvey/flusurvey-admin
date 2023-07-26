import NotImplemented from "@/components/NotImplemented"
import StudyRuleUploader from "@/components/admin-tool-v1/StudyRuleUploader"
import ExpressionBlock from "./ExpressionBlock"
import ExpressionEditor from "./ExpressionEditor"


export default async function Page({ params: { studyKey } }: {
    params: {
        studyKey: string
    }
}) {


    return (
        <>
            <ExpressionEditor />
            <section className="bg-white rounded p-6 shadow-sm flex flex-col divide-y">

                <div className="py-24 flex flex-col gap-1">
                    <ExpressionBlock
                        type="action"
                        title="REMOVE_SURVEYS_BY_KEY"
                        slots={[
                            {
                                slotName: 'survey key',
                                content: <ExpressionBlock
                                    type="globalConstant"
                                    title="weekly"
                                />
                            }
                        ]}
                    />

                    <ExpressionBlock
                        type="action"
                        label="ADD_NEW_SURVEY"
                        title="assign weekly again"
                        slots={[
                            {
                                slotName: 'survey key',
                                content: <ExpressionBlock
                                    type="globalConstant"
                                    title="weekly"
                                />
                            },
                            {
                                slotName: 'category',
                                content: <ExpressionBlock
                                    type="localConstant"
                                    title="prio"
                                />
                            },
                            {
                                slotName: 'from',
                                content: <ExpressionBlock
                                    type="dynamicValue"
                                    title="relative timestamp"
                                    label="timestampWithOffset"
                                    slots={[
                                        {
                                            slotName: 'offset',
                                            content: <ExpressionBlock
                                                type="localConstant"
                                                title="5m"
                                            />
                                        },
                                        {
                                            slotName: 'reference',
                                            content: <span>-</span>
                                        }
                                    ]}
                                />
                            },
                            {
                                slotName: 'until',
                                content: <span>-</span>
                            }
                        ]}
                    />
                    <ExpressionBlock
                        type="action"

                        title="handle ongoing symptoms"
                        label="IF"
                        slots={[
                            {
                                slotName: 'condition',
                                content: <ExpressionBlock
                                    type="condition"
                                    title="single choice option selected"
                                    label="responseHasKeysAny"
                                    slots={[
                                        {
                                            slotName: 'item key',
                                            content: <ExpressionBlock
                                                type="localConstant"
                                                title='"weekly.HS.Q4"'
                                            ></ExpressionBlock>
                                        },
                                        {
                                            slotName: 'option',
                                            content: <ExpressionBlock
                                                type="localConstant"
                                                title='"2"'
                                            />

                                        },
                                    ]}
                                ></ExpressionBlock>
                            },
                            {
                                slotName: 'TRUE',
                                content: <ExpressionBlock
                                    type="action"
                                    title="update flag"
                                />
                            },
                            {
                                slotName: 'FALSE',
                                content: <ExpressionBlock
                                    type="action"
                                    title="update flag"
                                />
                            },
                        ]}
                    />
                </div>
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
        </>
    )
}
