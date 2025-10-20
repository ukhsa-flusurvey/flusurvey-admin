import { ParticipantState } from "@/utils/server/types/participantState";

const AssignedSurveysEditor = (props: {
    participant?: ParticipantState;
    isLoading: boolean;
    onChange: (participant: ParticipantState) => void;
}) => {
    const participant = props.participant;
    if (!participant) return null;

    return <div>AssignedSurveysEditor</div>;
}

export default AssignedSurveysEditor;
