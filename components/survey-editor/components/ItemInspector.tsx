import React from 'react';
import { BsArrowReturnLeft, BsArrowsAngleContract, BsArrowsAngleExpand, BsAt, BsCardHeading, BsCollectionFill, BsHash, BsInfoCircle, BsKeyFill, BsStopCircle, BsTag, BsX, BsXLg } from 'react-icons/bs';
import { Button } from '@nextui-org/button';
import { Divider, Input, Popover, PopoverContent, PopoverTrigger, Tooltip } from '@nextui-org/react';
import { SurveyGroupItem, SurveyItem, SurveySingleItem } from 'survey-engine/data_types';


interface ItemInspectorProps {
    isExpanded: boolean;
    onExpandToggle: (isExpanded: boolean) => void;

    selectedItem: SurveyItem | null;
    onClearSelection: () => void;

    onItemKeyChange: (oldKey: string, newKey: string) => boolean;
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

const KeyEditor: React.FC<{
    parentKey: string;
    itemKey: string;
    onItemKeyChange: (oldKey: string, newKey: string) => boolean;
}> = ({ parentKey, itemKey, onItemKeyChange }) => {
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);


    return <div>
        <div className='flex items-center text-small font-bold'>
            <span>
                <BsTag className='text- text-default-500 me-2' />
            </span>
            Key:
        </div>
        <div className='overflow-x-scroll'>
            <div className='flex items-center'>
                <span className='font-mono text-tiny text-default-400 pt-1'>
                    {parentKey}.
                </span>
                <Input
                    aria-label='Item key'
                    className='font-mono min-w-[200px] w-80'
                    variant='bordered'
                    size='md'
                    placeholder='Enter a key for the item'
                    isRequired

                    validationState={itemKey.length === 0 ? 'invalid' : 'valid'}
                    value={itemKey}
                    onValueChange={(v) => {
                        setErrorMsg(null);
                        if (!onItemKeyChange([parentKey, itemKey].join('.'), [parentKey, v].join('.'))) {
                            setErrorMsg('Key already exists. To avoid issues it is not possible to change the key to an existing one.');
                        }
                    }}
                />
            </div>
            {errorMsg && <p className='text-danger-500 text-sm mt-1'>{errorMsg}</p>}
        </div>
    </div>
}

const ItemInspector: React.FC<ItemInspectorProps> = ({
    selectedItem,
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

    return (
        <div className='w-full bg-background overflow-y-scroll'>
            <div className='sticky bg-white z-10 top-0 p-unit-sm border-b border-default-400 drop-sshadow'>
                <div className='flex gap-unit-sm items-center  '>
                    {heading}
                    <span className='grow'></span>
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
            <div className='py-unit-lg px-unit-sm space-y-unit-sm'>


                <KeyEditor
                    parentKey={parentKey || ''}
                    itemKey={selectedItem?.key.split('.').slice(-1)[0] || ''}
                    onItemKeyChange={props.onItemKeyChange}
                />

                <Divider />

            </div>

        </div>
    );
};

export default ItemInspector;
