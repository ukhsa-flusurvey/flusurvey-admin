import Filepicker from '@/components/inputs/Filepicker';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import React from 'react';

interface LoadNewTemplateFormDiskProps {
    open: boolean;
    onClose: () => void;
    onTemplateLoaded: (content: string) => void;
}

const LoadNewTemplateFormDisk: React.FC<LoadNewTemplateFormDiskProps> = (props) => {
    return (
        <Dialog
            open={props.open}
            onOpenChange={props.onClose}
        >

            <DialogContent
                closeBtnAriaLabel='Close'
            >
                <Filepicker
                    label='Pick a new file to replace/set the current template'
                    id='template-upload'
                    accept={{
                        'application/html': ['.html'],
                    }}
                    onChange={(files) => {
                        if (files.length > 0) {
                            // read file as a json
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const text = e.target?.result;
                                if (typeof text === 'string') {
                                    props.onTemplateLoaded(text);
                                }
                            }
                            reader.readAsText(files[0]);
                        }
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default LoadNewTemplateFormDisk;
