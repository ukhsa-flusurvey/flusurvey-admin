import React, { Fragment } from 'react';
import { ItemGroupComponent } from 'survey-engine/data_types';
import { Popover, Transition } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import MarkdownComponent from './MarkdownComponent';


interface HelpGroupProps {
    componentGroup: ItemGroupComponent;
    languageCode: string;
    itemKey: string;
}

const HelpGroup: React.FC<HelpGroupProps> = (props) => {
    const renderContent = () => {
        if (props.componentGroup.items === undefined) {
            return <p className='text-[--survey-error-text-color]'> items is missing in the helpGroup component </p>
        }
        return <React.Fragment>
            {
                props.componentGroup.items.map((item, index) => {
                    return <MarkdownComponent key={index.toFixed()}
                        className='prose prose-sm'
                        compDef={item}
                        languageCode={props.languageCode}
                        embedded={true}
                    />
                })
            }
        </React.Fragment>
    }

    return (
        <Popover className="relative">
            <Popover.Button
                aria-label='Open help popover'
                className='ms-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full'
            >
                <QuestionMarkCircleIcon className="h-6 w-6 text-primary" aria-hidden="true" />
            </Popover.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel
                    className="absolute right-0 w-60 sm:w-96 z-50 "
                    role='dialog'
                >
                    <div className='bg-white p-4 shadow-sm border border-border rounded-[--survey-card-border-radius-sm] sm:rounded-[--survey-card-border-radius]'>
                        {renderContent()}
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default HelpGroup;
