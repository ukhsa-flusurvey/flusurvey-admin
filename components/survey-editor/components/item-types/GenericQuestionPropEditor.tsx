import React from 'react';
import AttributeGroupsAccordion, { AttributeGroup } from './AttributeGroupsAccordion';
import { BsCheckCircle, BsChevronBarDown, BsChevronBarUp, BsEye, BsFileEarmarkCode, BsHSquare, BsInfoCircle, BsSubscript } from 'react-icons/bs';
import ItemConditionEditor from './ItemConditionEditor';
import { GenericQuestionProps } from 'case-editor-tools/surveys/types';
import ItemHeaderEditor from './specific-editors/ItemHeaderEditor';
import ItemHelpPopupEditor from './specific-editors/ItemHelpPopupEditor';


interface GenericQuestionPropEditorProps {
    genericProps: GenericQuestionProps;
    specificEditGroup: AttributeGroup;
    onChange: (genericProps: GenericQuestionProps) => void;
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
                    defaultOpen: true,
                    icon: <BsHSquare />,
                    content: <ItemHeaderEditor
                        genericProps={genericProps}
                        onChange={(newProps) => {
                            props.onChange(newProps);
                        }}
                    />
                },
                {
                    key: 'helpgroup',
                    title: 'Help popup',
                    icon: <BsInfoCircle />,
                    content: <ItemHelpPopupEditor
                        genericProps={genericProps}
                        onChange={(newProps) => {
                            props.onChange(newProps);
                        }}
                    />
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
                    key: 'advnaced',
                    title: 'Advanced',
                    icon: <BsFileEarmarkCode />,
                    content: (
                        <div>
                            <p>confidential mode</p>
                            <p>metadata</p>
                        </div>
                    )
                },
            ]}
        />
    );
};

export default GenericQuestionPropEditor;
