import React from 'react';
import AttributeGroupsAccordion from './AttributeGroupsAccordion';
import { BsEye } from 'react-icons/bs';
import ItemConditionEditor from './ItemConditionEditor';

interface PageBreakAttributeEditorProps {
}

const PageBreakAttributeEditor: React.FC<PageBreakAttributeEditorProps> = (props) => {
    return (
        <AttributeGroupsAccordion
            attributeGroups={[
                {
                    key: 'condition',
                    title: 'Condition',
                    icon: <BsEye />,
                    content: (
                        <ItemConditionEditor />
                    )
                }
            ]}
        />
    );
};

export default PageBreakAttributeEditor;
