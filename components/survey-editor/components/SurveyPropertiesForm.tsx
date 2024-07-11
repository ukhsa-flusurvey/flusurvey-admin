interface SurveyPropertiesFormProps {
    activeForm: React.ReactNode;
}

export const SurveyDocumentForm: React.FC<SurveyPropertiesFormProps> = (props) => {
    return (
        <div className="space-y-6">
            {props.activeForm}
        </div>
    )
}
