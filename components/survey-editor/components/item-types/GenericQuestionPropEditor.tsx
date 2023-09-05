import React from 'react';
import AttributeGroupsAccordion from './AttributeGroupsAccordion';
import { BsBraces, BsCardHeading, BsCheckCircle, BsChevronBarDown, BsChevronBarUp, BsEye, BsFileEarmarkCode, BsHSquare, BsSubscript, BsSuperscript, BsTypeH1 } from 'react-icons/bs';
import ItemConditionEditor from './ItemConditionEditor';

interface GenericQuestionPropEditorProps {
}

const GenericQuestionPropEditor: React.FC<GenericQuestionPropEditorProps> = (props) => {
    return (
        <AttributeGroupsAccordion
            attributeGroups={[
                {
                    key: 'heading',
                    title: 'Header',
                    icon: <BsHSquare />,
                    content: (
                        <div>todo</div>
                    )
                },
                {
                    key: 'startcontent',
                    title: 'Start content',
                    icon: <BsChevronBarUp />,
                    content: (
                        <div>todo</div>
                    )
                },
                {
                    key: 'body',
                    title: 'Response options',
                    icon: <BsBraces />,
                    content: (
                        <div>todo</div>
                    )
                },
                {
                    key: 'endcontent',
                    title: 'End content',
                    icon: <BsChevronBarDown />,
                    content: (
                        <div>todo</div>
                    )
                },
                {
                    key: 'footer',
                    title: 'Footer',
                    icon: <BsSubscript />,
                    content: (
                        <div>todo</div>
                    )
                },
                {
                    key: 'validations',
                    title: 'Validations',
                    icon: <BsCheckCircle />,
                    content: (
                        <div>todo</div>
                    )
                },
                {
                    key: 'condition',
                    title: 'Condition',
                    icon: <BsEye />,
                    content: (
                        <ItemConditionEditor />
                    )
                },
                {
                    key: 'metadata',
                    title: 'Metadata',
                    icon: <BsFileEarmarkCode />,
                    content: (
                        <div>todo</div>
                    )
                },
            ]}
        />
    );
};

export default GenericQuestionPropEditor;
