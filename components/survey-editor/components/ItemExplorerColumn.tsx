import { Button } from '@nextui-org/button';
import { Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Kbd, Listbox, ListboxItem } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { BsArrowReturnLeft, BsCardHeading, BsChevronRight, BsClipboardPlus, BsCollection, BsCollectionFill, BsFileEarmarkPlus, BsPlus, BsPlusCircle, BsPlusSquare, BsQuestionSquare, BsStopCircle } from 'react-icons/bs';
import { SurveyGroupItem, SurveyItem, SurveySingleItem, isSurveyGroupItem } from 'survey-engine/data_types';

interface ItemExplorerColumnProps {
    itemGroup: SurveyGroupItem;
    onAddItem: (itemMode: string, path: string) => void;
}

const ItemExplorerColumn: React.FC<ItemExplorerColumnProps> = (props) => {
    const [selectedItem, setSelectedItem] = React.useState<SurveyItem | null>(null);

    let itemList: React.ReactNode = null;
    if (!props.itemGroup.items || props.itemGroup.items.length === 0) {
        itemList = (
            <div className=' py-unit-md flex flex-col items-center justify-center gap-unit-sm'>
                <div className='text-small'>
                    <div className='text-default-400 text-xl flex justify-center mb-unit-1'>
                        <BsQuestionSquare />
                    </div>
                    Empty group
                </div>
            </div>
        );
    } else {
        itemList = (
            <Listbox
                aria-label={`List of items in group ${props.itemGroup.key}`}
                onAction={(key) => {
                    const item = props.itemGroup.items.find(i => i.key === key);
                    if (item) {
                        setSelectedItem(item);
                    } else {
                        setSelectedItem(null);
                    }
                }}
            >

                {props.itemGroup.items.map((item, index) => {
                    let icon = <BsCardHeading />;
                    if (isSurveyGroupItem(item) || (item as SurveyGroupItem).items !== undefined) {
                        icon = <BsCollectionFill className='text-primary-300' />;
                    } else if (item.type === 'pageBreak') {
                        icon = <BsArrowReturnLeft className='text-secondary-300' />;
                    } else if (item.type === 'surveyEnd') {
                        icon = <BsStopCircle className='text-danger-300' />;
                    }

                    return (
                        <ListboxItem
                            key={item.key}
                            color='primary'
                            variant='flat'
                            startContent={<span className='text-default-400'>{icon}</span>}
                            endContent={(item as SurveyGroupItem).items !== undefined && <span className='text-default-400'>
                                <BsChevronRight />
                            </span>}
                            className={clsx(
                                'relative group',
                                {
                                    'bg-primary-100': selectedItem?.key === item.key,
                                }
                            )}
                            textValue={item.key}
                        >
                            {(item as SurveySingleItem).type === 'pageBreak' ? 'Page break' : item.key.split('.').pop()}
                        </ListboxItem>
                    )
                })}
            </Listbox>
        );
    }

    return (
        <div className='h-full flex '>
            <div className='border-r border-default-400 min-w-[220px] overflow-y-scroll' >
                <div className='font-mono bg-content2 px-unit-sm py-unit-1 text-small'>
                    {props.itemGroup.key}
                </div>
                {itemList}
                <Divider />
                <div className='flex justify-center py-unit-sm'>
                    <Dropdown backdrop='opaque'>
                        <DropdownTrigger>
                            <Button
                                startContent={<BsPlusSquare />}
                                color='secondary'
                                variant='light'
                                size='sm'
                            >
                                Add new item
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Action event example"
                            onAction={(key) => {
                                const actionKey = key as string;
                                props.onAddItem(actionKey, props.itemGroup.key);
                            }}
                        >
                            <DropdownSection showDivider aria-label='System actions'>
                                <DropdownItem
                                    key="pasteJSON"
                                    description='Paste a JSON object to create a new item.'
                                    startContent={<span className='text-xl text-default-400'><BsClipboardPlus /></span>}
                                >
                                    Paste from JSON
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Built-in items">
                                <DropdownItem key="item"
                                    description='Item type will be selected in the next step.'
                                    startContent={<span className='text-xl text-default-400'><BsCardHeading /></span>}
                                >
                                    Question/Info item</DropdownItem>
                                <DropdownItem key="group"
                                    description='Container for a group of items.'
                                    startContent={<span className='text-xl text-primary-300'><BsCollectionFill /></span>}
                                >
                                    Group</DropdownItem>
                                <DropdownItem key="pageBreak"
                                    startContent={<span className='text-xl text-secondary-300'><BsArrowReturnLeft /></span>}
                                    description='Items after this will be displayed on a new page.'
                                >Page break</DropdownItem>
                                <DropdownItem
                                    key="surveyEnd"
                                    startContent={<span className='text-xl text-danger-300'><BsStopCircle /></span>}
                                    description='Define content that appears next to the submit button.'
                                >Survey end content</DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>

                </div>
            </div>
            {(selectedItem && (selectedItem as SurveyGroupItem).items !== undefined) && (
                <ItemExplorerColumn
                    itemGroup={selectedItem as SurveyGroupItem}
                    onAddItem={props.onAddItem}
                />
            )}
            {/*items.length > 1 && (
                <ExplorerColumn
                    items={newItems}
                />
            )*/}

        </div>
    );

};

export default ItemExplorerColumn;
