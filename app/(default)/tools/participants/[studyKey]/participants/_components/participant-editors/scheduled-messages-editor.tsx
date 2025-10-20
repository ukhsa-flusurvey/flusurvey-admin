import { ParticipantState } from "@/utils/server/types/participantState";

const ScheduledMessagesEditor = (props: {
    participant?: ParticipantState;
    isLoading: boolean;
    onChange: (participant: ParticipantState) => void;
}) => {
    const participant = props.participant;
    if (!participant) return null;

    return <div>ScheduledMessagesEditor</div>;
}

export default ScheduledMessagesEditor;
