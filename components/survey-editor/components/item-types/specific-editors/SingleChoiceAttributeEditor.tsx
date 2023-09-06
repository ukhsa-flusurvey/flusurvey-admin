import React from 'react';
import GenericQuestionPropEditor from '../GenericQuestionPropEditor';
import { OptionQuestionProps } from 'case-editor-tools/surveys/survey-items';
import { BsBraces } from 'react-icons/bs';

interface SingleChoiceAttributeEditorProps {
}




const SingleChoiceAttributeEditor: React.FC<SingleChoiceAttributeEditorProps> = (props) => {
    const itemProps: OptionQuestionProps | undefined = undefined;


    return (
        <GenericQuestionPropEditor
            genericProps={
                itemProps
            }
            specificEditGroup={
                {
                    key: 'body',
                    title: 'Response options',
                    icon: <BsBraces />,
                    content: (
                        <div>todo</div>
                    )
                }
            }
        />
    );
};

export default SingleChoiceAttributeEditor;
