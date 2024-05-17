import React, { useEffect, useRef, useState } from 'react';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import SimpleMarkdownRenderer from './SimpleMarkdownRenderer';
import { Separator } from '@/components/ui/separator';


interface ConsentDialogProps {
    open: boolean;
    title: string;
    content?: string;
    cancelBtn: string;
    acceptBtn: string;
    onConfirmed: () => void;
    onCancelled: () => void;
    onClose: () => void;
    dialogPaddingXClass?: string;
    dialogPaddingYClass?: string;
}

const ConsentDialog: React.FC<ConsentDialogProps> = (props) => {
    const [scrollComplete, setScrollComplete] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);


    const handleScroll = () => {
        if (containerRef.current && containerRef.current.scrollHeight - containerRef.current.scrollTop - containerRef.current.clientHeight < 5) {
            setScrollComplete(true);
        }
    };

    useEffect(() => {
        if (props.open) {
            setTimeout(() => handleScroll(), 1500);
            setTimeout(() => handleScroll(), 3500);
        }
    }, [props.open])

    return (
        <AlertDialog
            open={props.open}
            onOpenChange={(open) => {
                if (!open) {
                    props.onClose();
                }
            }}
        >

            <AlertDialogContent className='overflow-y-scroll max-h-svh pb-12 sm:pb-6'>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {props.title}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <Separator />

                <div
                    ref={containerRef}
                    onScroll={() => handleScroll()}
                    tabIndex={0}
                >
                    {props.content ? <div>
                        <SimpleMarkdownRenderer>
                            {props.content}
                        </SimpleMarkdownRenderer>
                    </div> : null}


                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            props.onCancelled();
                        }}
                    >
                        {props.cancelBtn}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!scrollComplete}
                        onClick={() => {
                            props.onConfirmed();
                        }}
                    >
                        {props.acceptBtn}
                    </AlertDialogAction>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConsentDialog;
