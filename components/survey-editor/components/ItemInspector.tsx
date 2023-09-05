import React from 'react';
import { BsArrowReturnLeft, BsArrowsAngleContract, BsArrowsAngleExpand, BsArrowsMove, BsCardHeading, BsClipboard, BsCollectionFill, BsInfoCircle, BsStopCircle, BsThreeDotsVertical, BsTrash, BsXLg } from 'react-icons/bs';
import { Button } from '@nextui-org/button';
import { Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Popover, PopoverContent, PopoverTrigger, Tooltip } from '@nextui-org/react';
import { ExpressionArg, LocalizedString, SurveyGroupItem, SurveyItem, SurveySingleItem } from 'survey-engine/data_types';
import SurveyEndAttributeEditor from './item-types/SurveyEndAttributeEditor';
import { ItemEditor } from 'case-editor-tools/surveys/survey-editor/item-editor';
import { generateTitleComponent } from 'case-editor-tools/surveys/utils/simple-generators';
import KeyEditor from './KeyEditor';
import SurveyGroupItemAttributeEditor from './item-types/SurveyGroupItemAttributeEditor';
import PageBreakAttributeEditor from './item-types/PageBreakAttributeEditor';
import SurveySingleItemAttributeEditor from './item-types/SurveySingleItemAttributeEditor';


interface ItemInspectorProps {
    isExpanded: boolean;
    onExpandToggle: (isExpanded: boolean) => void;

    selectedItem: SurveyItem | null;
    onClearSelection: () => void;
    onDeleteItem: (
        itemKey: string,
    ) => void;
    onItemKeyChange: (oldKey: string, newKey: string) => boolean;
    onWantsToMoveItem: (itemKey: string) => void;
    onItemChange: (item: SurveyItem) => void;
}

const HeadingWithIcon: React.FC<{
    icon: React.ReactNode,
    text: string,
    infoText: string,
}> = ({ icon, text, infoText }) => {
    return <div className='flex items-center gap-unit-sm'>
        <span className=''>
            {icon}
        </span>
        <span className='font-bold text-xl'>{text}</span>
        <Popover placement='bottom'
            backdrop='opaque'
            showArrow
        >
            <PopoverTrigger>
                <Button
                    variant='light'
                    isIconOnly
                    size='sm'
                >
                    <BsInfoCircle />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className='p-unit-1 max-w-[400px]'>
                    <p className='text-sm'>
                        {infoText}
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    </div>
}

const InspectorActionMenu: React.FC<{
    onActionSelected?: (action: 'copy' | 'move' | 'delete') => void;
}> = (props) => {
    return (
        <Dropdown
            placement='bottom-end'

        >
            <DropdownTrigger>
                <Button
                    variant="light"
                    isIconOnly
                >
                    <BsThreeDotsVertical />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions for the selected item"
                onAction={(action) => {
                    if (props.onActionSelected) {
                        props.onActionSelected(action as 'copy' | 'move' | 'delete');
                    }
                }}
            >
                <DropdownSection aria-label='actions' showDivider>
                    <DropdownItem
                        key="copy"
                        description='Copy the item to the clipboard'
                        startContent={<BsClipboard className='text-default-500' />}
                    >
                        Copy
                    </DropdownItem>
                    <DropdownItem
                        key="move"
                        description='Move the item to another parent group'
                        startContent={<BsArrowsMove className='text-default-500' />}
                    >
                        Move
                    </DropdownItem>
                </DropdownSection>
                <DropdownItem key="delete" className="text-danger" color="danger"
                    startContent={<BsTrash className='text-danger-200' />}
                    description='Delete the item from the survey'
                >
                    Delete
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}



const localisedStringToMap = (loc?: LocalizedString[]): Map<string, string> => {
    const map = new Map<string, string>();
    if (!loc) return map;
    loc.forEach((item) => {
        map.set(item.code, item.parts.map(p => (p as ExpressionArg).str).join(''));
    });
    return map;
}

const ItemInspector: React.FC<ItemInspectorProps> = ({
    selectedItem,
    onItemChange,
    ...props
}) => {
    const itemType: null | 'surveyEnd' | 'item' | 'group' | 'pageBreak' = React.useMemo(() => {
        if (!selectedItem) return null;

        if ((selectedItem as SurveyGroupItem).items !== undefined) {
            return 'group';
        }
        switch ((selectedItem as SurveySingleItem).type) {
            case 'pageBreak':
                return 'pageBreak';
            case 'surveyEnd':
                return 'surveyEnd';
            default:
                return 'item';
        }
    }, [selectedItem]);


    const heading = React.useMemo(() => {
        if (!itemType) return null;

        switch (itemType) {
            case 'group':
                return <HeadingWithIcon
                    icon={<BsCollectionFill className='text-xl text-primary-300' />}
                    text='Group'
                    infoText='This is a group component. It is used to group items together, e.g. if they have the same dependencies or they always appear together.'
                />
            case 'pageBreak':
                return <HeadingWithIcon
                    icon={<BsArrowReturnLeft className='text-xl text-secondary-300' />}
                    text='Page Break'
                    infoText='This is a page break component. It is used to separate the survey into pages.'
                />
            case 'surveyEnd':
                return <HeadingWithIcon
                    icon={<BsStopCircle className='text-xl text-danger-300' />}
                    text='Survey End'
                    infoText='You can control with this component what text should appear next to the submit button.'
                />
            default:
                return <HeadingWithIcon
                    icon={<BsCardHeading className='text-xl text-default-400' />}
                    text='Survey Item'
                    infoText='This is a survey item. It is used to ask questions or display information.'
                />
        }
    }, [itemType]);

    const parentKey = selectedItem?.key.split('.').slice(0, -1).join('.');

    const attributeEditor = React.useMemo(() => {
        if (!selectedItem) return null;

        if (itemType === 'surveyEnd') {
            // todo: item to attributes
            const content = (selectedItem as SurveySingleItem).components?.items.find(item => item.role === 'title');
            const attributes = {
                key: selectedItem.key,
                content: localisedStringToMap(content?.content as LocalizedString[]),
            }
            return <SurveyEndAttributeEditor
                attributes={attributes}
                onChange={(attributes) => {
                    const editor = new ItemEditor(undefined, { itemKey: selectedItem.key, type: 'surveyEnd', isGroup: false });
                    editor.setTitleComponent(
                        generateTitleComponent(attributes.content)
                    );
                    // CONDITION
                    editor.setCondition(attributes.condition);
                    const se = editor.getItem();
                    onItemChange(se);
                }}
            />
        } else if (itemType === 'item') {
            return <SurveySingleItemAttributeEditor
                surveyItem={selectedItem as SurveySingleItem}
            />
        } else if (itemType === 'group') {
            return <SurveyGroupItemAttributeEditor
            />
        } else if (itemType === 'pageBreak') {
            return <PageBreakAttributeEditor />;
        } else {
            return <p>Unexpected item type: {itemType}</p>
        }
    }, [itemType, selectedItem, onItemChange]);

    return (
        <div className='w-full bg-background overflow-y-scroll'>
            <div className='sticky bg-white z-10 top-0 p-unit-sm border-b border-default-400 drop-sshadow'>
                <div className='flex gap-unit-sm items-center  '>
                    {heading}
                    <span className='grow'></span>
                    <InspectorActionMenu
                        onActionSelected={(action) => {
                            switch (action) {
                                case 'copy':
                                    if (selectedItem) {
                                        const content = JSON.stringify(selectedItem, undefined, 2)
                                        navigator.clipboard.writeText(content);
                                    }
                                    break;
                                case 'move':
                                    if (selectedItem) {
                                        props.onWantsToMoveItem(selectedItem.key);
                                    }
                                    break;
                                case 'delete':
                                    if (selectedItem && confirm('Are you sure you want to delete this item?')) {
                                        props.onDeleteItem(selectedItem?.key || '');
                                    }
                                    break;
                            }
                        }}
                    />
                    <Tooltip
                        content={props.isExpanded ? 'Collapse' : 'Expand'}
                    >
                        <Button
                            variant='light'
                            isIconOnly
                            size='sm'
                            className='text-lg'
                            type='button'
                            onPress={() => {
                                props.onExpandToggle(!props.isExpanded);
                            }}
                        >
                            {props.isExpanded ? <BsArrowsAngleContract /> : <BsArrowsAngleExpand />}
                        </Button>
                    </Tooltip>
                    <Tooltip
                        content={'Close item'}
                    >
                        <Button
                            variant='light'
                            isIconOnly
                            size='sm'
                            className='text-lg'
                            type='button'
                            onPress={() => {
                                props.onClearSelection();
                            }}
                        >
                            <BsXLg />
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className='py-unit-lg px-unit-sm'>
                <div className='mb-unit-md'>
                    <KeyEditor
                        parentKey={parentKey || ''}
                        itemKey={selectedItem?.key.split('.').slice(-1)[0] || ''}
                        onItemKeyChange={props.onItemKeyChange}
                    />
                </div>

                <Divider />

                {attributeEditor}

            </div>

        </div >
    );
};

export default ItemInspector;
