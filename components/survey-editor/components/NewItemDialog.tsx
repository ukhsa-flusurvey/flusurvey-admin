import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';

interface NewItemDialogProps {
    currentMode: {
        actionKey: string,
        path: string,
    } | null;
    onClose: () => void;
}


const NewItemDialog: React.FC<NewItemDialogProps> = (props) => {
    const isOpen = props.currentMode !== null;

    const dialogContent = React.useMemo(() => {
        if (!props.currentMode) return null;

        const actionKey = props.currentMode.actionKey;

        switch (props.currentMode.actionKey) {
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

    }, [props.currentMode]);

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
