import React from 'react';
import AttributeGroupsAccordion, { AttributeGroup } from './AttributeGroupsAccordion';
import { BsCheckCircle, BsChevronBarDown, BsChevronBarUp, BsEye, BsFileEarmarkCode, BsHSquare, BsSubscript } from 'react-icons/bs';
import ItemConditionEditor from './ItemConditionEditor';
import { GenericQuestionProps } from 'case-editor-tools/surveys/types';
import { Input, Textarea } from '@nextui-org/input';
import { Divider, Switch } from '@nextui-org/react';
import LanguageSelector from '@/components/LanguageSelector';
import ItemHeaderEditor from './specific-editors/ItemHeaderEditor';


interface GenericQuestionPropEditorProps {
    genericProps?: GenericQuestionProps;
    specificEditGroup: AttributeGroup;
}


const GenericQuestionPropEditor: React.FC<GenericQuestionPropEditorProps> = ({
    genericProps,
    ...props
}) => {


    return (
        <AttributeGroupsAccordion
            attributeGroups={[
                {
                    key: 'heading',
                    title: 'Header',
                    icon: <BsHSquare />,
                    content: <ItemHeaderEditor />
                },
                {
                    key: 'startcontent',
                    title: 'Start content',
                    icon: <BsChevronBarUp />,
                    content: (
                        <div>todo</div>
                    )
                },
                props.specificEditGroup,
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
                        <ItemConditionEditor
                            onChange={() => {
                                console.log('todo')
                            }}
                        />
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
