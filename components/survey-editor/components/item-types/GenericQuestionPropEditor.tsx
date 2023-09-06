import React from 'react';
import AttributeGroupsAccordion, { AttributeGroup } from './AttributeGroupsAccordion';
import { BsBraces, BsCardHeading, BsCheckCircle, BsChevronBarDown, BsChevronBarUp, BsEye, BsFileEarmarkCode, BsHSquare, BsSubscript, BsSuperscript, BsTypeH1 } from 'react-icons/bs';
import ItemConditionEditor from './ItemConditionEditor';
import { GenericQuestionProps } from 'case-editor-tools/surveys/types';
import { Input, Textarea } from '@nextui-org/input';
import { Divider, Switch } from '@nextui-org/react';
import LanguageSelector from '@/components/LanguageSelector';

interface GenericQuestionPropEditorProps {
    genericProps?: GenericQuestionProps;
    specificEditGroup: AttributeGroup;
}



const GenericQuestionPropEditor: React.FC<GenericQuestionPropEditorProps> = ({
    genericProps,
    ...props
}) => {
    const [testV, setTestV] = React.useState<string>('');

    const headerEditor = (
        <div className='flex flex-col gap-unit-sm'>
            <LanguageSelector />
            <Switch size='sm'>
                Simple title
            </Switch>
            <Input
                id='item-title'
                label="Title"
                variant='flat'
                placeholder="Enter title here"
                value={testV}
                onValueChange={(v) => setTestV(v)}
                description="This text will be displayed above the item."
            />
            <Divider />
            <Input
                id='item-subtitle'
                label="Subtitle"
                variant='flat'
                placeholder="Enter subtitle here"
                description="This text will be displayed below the title with a smaller font size."
            />

            <Switch size='sm'>
                Use help popup
            </Switch>
            <Textarea
                id='item-helpgroup'
                label="Content for help"
                variant='flat'
                placeholder="Enter help content"

            />
            <Switch size='sm'>
                Sticky header
            </Switch>
        </div>
    );


    return (
        <AttributeGroupsAccordion
            attributeGroups={[
                {
                    key: 'heading',
                    title: 'Header',
                    icon: <BsHSquare />,
                    content: headerEditor
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
