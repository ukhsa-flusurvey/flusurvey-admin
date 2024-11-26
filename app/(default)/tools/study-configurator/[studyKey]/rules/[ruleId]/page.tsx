export default function Page(props: {
    params: {
        studyKey: string
        ruleId: string
    }
}) {
    console.log(props)

    return (
        <div>
            <h1>TODO page for: app/(default)/tools/study-configurator/[studyKey]/rules/[ruleId]/page.tsx</h1>
        </div>
    );
}
