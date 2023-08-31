import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Group } from 'case-editor-tools/surveys/types';
import React from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import { SurveyItem } from 'survey-engine/data_types';

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


const ModalContentForGroupAction = ({
    parentKey,
    onSubmit,
    onClose
}: {
    parentKey: string;
    onSubmit: (key: string) => void;
    onClose: () => void;

}) => {
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
            console.log('close modal');
            props.onClose();
        }}>
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

/*
<>
<ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                        <ModalBody>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Nullam pulvinar risus non risus hendrerit venenatis.
                                Pellentesque sit amet hendrerit risus, sed porttitor quam.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Nullam pulvinar risus non risus hendrerit venenatis.
                                Pellentesque sit amet hendrerit risus, sed porttitor quam.
                            </p>
                            <p>
                                Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                                dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
                                Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                                Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur
                                proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Action
                            </Button>
                        </ModalFooter>
</>
*/
