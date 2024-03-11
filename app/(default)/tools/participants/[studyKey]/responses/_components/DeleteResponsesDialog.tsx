'use client'
import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react';

interface DeleteResponsesDialogProps {
    isOpen: boolean;
    onClose: () => void;

    studyKey: string;
    onPerformDelete: () => void;

}

const DeleteResponsesDialog: React.FC<DeleteResponsesDialogProps> = (props) => {
    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    props.onClose();
                }
            }}
        >
            <DialogContent>            <DialogHeader>
                <DialogTitle>
                    Delete responses
                </DialogTitle>
            </DialogHeader>

                <div>
                    <p>Warn</p>
                    <p>form input for entering study key for confirmation</p>

                </div>
                <DialogFooter>
                    <DialogClose
                        asChild
                    >
                        <Button variant={'outline'}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <LoadingButton>
                        Delete responses
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    );
};

export default DeleteResponsesDialog;
