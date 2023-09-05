import { Accordion, AccordionItem } from '@nextui-org/react';
import React from 'react';

interface AttributeGroupsAccordionProps {
    attributeGroups: Array<{
        key: string;
        title: string | React.ReactNode;
        icon?: React.ReactNode;
        content: React.ReactNode;
    }>;
}

const AttributeGroupsAccordion: React.FC<AttributeGroupsAccordionProps> = (props) => {
    return (
        <Accordion
            className='p-0'
            selectionMode='multiple'
        >
            {props.attributeGroups.map(group => (
                <AccordionItem
                    key={group.key}
                    title={group.title}
                    startContent={<span className='text-default-400'>
                        {group.icon}
                    </span>}
                    textValue={'accordion-item-' + group.key}
                    classNames={{
                        title: 'font-bold text-small',
                        content: 'pb-unit-lg'
                    }}
                >
                    <div className='space-unit-sm px-unit-sm border-s border-secondary-200'>
                        {group.content}
                    </div>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default AttributeGroupsAccordion;
