import StartActionForm from "./_components/start-action-form";

export default function Page(props: {
    params: {
        studyKey: string;
    }
}) {


    return (
        <div>
            <StartActionForm
                studyKey={props.params.studyKey}
            />
        </div>
    );
}
