import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Group } from 'case-editor-tools/surveys/types';
import React from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import { SurveyItem } from 'survey-engine/data_types';
import SurveyEndAttributeEditor, { SurveyEndAttributes } from './item-types/SurveyEndAttributeEditor';
import KeyEditor from './KeyEditor';
import { generateTitleComponent } from 'case-editor-tools/surveys/utils/simple-generators';
import { ItemEditor } from 'case-editor-tools/surveys/survey-editor/item-editor';

interface NewItemDialogProps {
    currentMode: {
        actionKey: string,
        path: string,
    } | null;
    onCreateItem: (item: SurveyItem, path: string) => void;
    onClose: () => void;
}

class SimpleGroup extends Group {
    constructor(parentKey: string, key: string) {
        super(parentKey, key);
    }

    buildGroup(): void {
    }
}

interface ModalContentProps {
    onClose: () => void;
    parentKey?: string;
}

interface ModalContentForGroupActionProps extends ModalContentProps {
    onSubmit: (key: string) => void;
}

const ModalContentForGroupAction = ({
    parentKey,
    onSubmit,
    onClose
}: ModalContentForGroupActionProps) => {
    const [itemKey, setItemKey] = React.useState<string>('');

    return <form
        onSubmit={(e) => {
            e.preventDefault();
            onSubmit(itemKey);
        }}
    >
        <ModalHeader className='bg-content2'>
            New Group
        </ModalHeader>
        <Divider />
        <ModalBody>
            <div className='flex flex-col gap-unit-md py-unit-md'>
                <div className='p-unit-md bg-primary-100 rounded-medium flex gap-unit-sm items-center'>
                    <span className='text-primary-700 text-2xl'><BsInfoCircle /></span>
                    <span className='text-small'>
                        This can be used to group items together, e.g. if they have the same dependencies or they always appear together.
                    </span>
                </div>
                <Input
                    id='new-group-key'
                    label='Group key'
                    labelPlacement='outside'
                    placeholder='Enter a key for the new group'
                    variant='bordered'
                    description='Must be unique within the parent group.'
                    isRequired
                    value={itemKey}
                    onValueChange={(v) => {
                        setItemKey(v);
                    }}
                />
                <div>
                    <p className='text-small mb-unit-1'>Full key of the new item:</p>
                    <p className='font-mono overflow-x-scroll'>
                        <span className='text-default-500'>{parentKey}.</span><span>{itemKey}</span>
                    </p>
                </div>
            </div>
        </ModalBody>
        <Divider />
        <ModalFooter className='bg-content2'>
            <Button
                variant='ghost'
                color='danger'
                onClick={onClose}
                type='button'
            >
                Cancel
            </Button>
            <Button
                color='primary'
                type='submit'
            >
                Create
            </Button>

        </ModalFooter>
    </form>
}

interface ModalContentForSurveyEndActionProps extends ModalContentProps {
    onSubmit: (surveyEndAttributes: SurveyEndAttributes) => void;
}

const ModalContentForSurveyEndAction = (props: ModalContentForSurveyEndActionProps) => {
    const [itemProps, setItemProps] = React.useState<SurveyEndAttributes>({
        key: '',
        content: new Map(),
    });

    return <>
        <ModalHeader className='bg-content2'>
            New Survey End
        </ModalHeader>
        <Divider />
        <ModalBody className='py-unit-lg px-unit-md'>
            <KeyEditor
                parentKey={props.parentKey || ''}
                itemKey={itemProps.key.split('.').pop() || ''}
                onItemKeyChange={(_, key) => {
                    setItemProps({
                        ...itemProps,
                        key: key,
                    });
                    return true;
                }}
            />
            <Divider />
            <SurveyEndAttributeEditor
                attributes={itemProps}
                onChange={(newProps) => {
                    setItemProps(newProps);
                }}
            />
        </ModalBody>
        <Divider />
        <ModalFooter className='bg-content2'>
            <Button
                variant='ghost'
                color='danger'
                onClick={props.onClose}
                type='button'
            >
                Cancel
            </Button>
            <Button
                color='primary'
                type='button'
                isDisabled={!itemProps.key}
                onPress={() => {
                    props.onSubmit(itemProps);
                }}
            >
                Create
            </Button>
        </ModalFooter>
    </>
}


const NewItemDialog: React.FC<NewItemDialogProps> = ({
    currentMode,
    onCreateItem,
    ...props
}) => {
    const isOpen = currentMode !== null;

    const dialogContent = React.useMemo(() => {
        if (!currentMode) return null;

        const actionKey = currentMode.actionKey;
        const parentKey = currentMode.path;

        switch (currentMode.actionKey) {
            case 'group':
                return <ModalContent>
                    {(onClose) => (
                        <ModalContentForGroupAction
                            parentKey={parentKey}
                            onSubmit={(key) => {
                                console.log('submit', key);
                                const newGroup = new SimpleGroup(parentKey, key)
                                onCreateItem(newGroup.get(), parentKey);
                            }}
                            onClose={onClose} />
                    )}
                </ModalContent>
            case 'surveyEnd':
                return <ModalContent>
                    {(onClose) => (
                        <ModalContentForSurveyEndAction
                            parentKey={parentKey}
                            onSubmit={(surveyEndAtttributes) => {
                                const editor = new ItemEditor(undefined, { itemKey: surveyEndAtttributes.key, type: 'surveyEnd', isGroup: false });
                                editor.setTitleComponent(
                                    generateTitleComponent(surveyEndAtttributes.content)
                                );
                                editor.setCondition(surveyEndAtttributes.condition);
                                const se = editor.getItem();
                                onCreateItem(se, parentKey);
                            }}
                            onClose={onClose}
                        />
                    )}
                </ModalContent>
            default:
                return <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className='bg-content2'>
                                Unknown action
                            </ModalHeader>
                            <Divider />
                            <ModalBody className='text-warning py-unit-lg px-unit-md font-bold'>
                                The selected action is currently not implemented: {actionKey}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>

        }

    }, [currentMode, onCreateItem]);

    return (
        <Modal isOpen={isOpen} onOpenChange={() => {
            props.onClose();
        }}
            isDismissable={false}

            scrollBehavior='outside'
            className='rounded-medium overflow-hidden'
            size='2xl'

        >
            <ModalContent>
                {(onClose) => (
                    <>
                        {dialogContent}

                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default NewItemDialog;
