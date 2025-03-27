import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from '@/components/ui/sidebar';
import { ArrowLeftIcon, MoreVerticalIcon, SaveIcon, UploadIcon, XIcon } from 'lucide-react';
import React from 'react';
import { useStudyExpressionEditor } from '../../study-expression-editor-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import LoadContextFromDisk from './load-context-from-disk';
import EditorCard from './editor-card';
import { KeyValuePairDefs } from '../../types';


const Overview: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const [openLoadContextDialog, setOpenLoadContextDialog] = React.useState(false);
    const { changeView, currentName, currentStudyContext, updateCurrentStudyContext } = useStudyExpressionEditor();

    const [selection, setSelection] = React.useState<{
        item: string | KeyValuePairDefs;
        attributeKey: string;
    } | undefined>(undefined);


    const closeEditor = () => {
        setOpen(false);
    }

    const saveContextToFile = () => {
        if (!currentStudyContext) {
            toast.error('No context to save');
            return;
        }

        const contextStr = JSON.stringify(currentStudyContext, null, 2);
        const blob = new Blob([contextStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);

        const prefix = 'study-context';

        const fileName = `${prefix}${currentName ? ('_' + currentName) : ''}.json`;

        link.download = fileName;
        link.click();

        toast.success('Study context saved to disk', {
            description: fileName
        });
    }

    const itemEditorOpen = selection !== undefined;

    return (
        <SidebarProvider
            open={itemEditorOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setSelection(undefined);
                }
            }}
            style={{
                "--sidebar-width": "25rem",
                "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties}
        >
            <main className='overflow-y-scroll @container w-full p-6 pt-2'>
                <div className='flex justify-between gap-2 items-center'>
                    <Button
                        variant={'ghost'}
                        onClick={() => {
                            changeView('expression-editor')
                        }}
                    >
                        <span><ArrowLeftIcon className='size-4' /></span>
                        Exit context editor
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'ghost'}
                                size={'icon'}
                            >
                                <MoreVerticalIcon className='size-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                                disabled={!currentStudyContext}
                                onClick={saveContextToFile}
                            >
                                <SaveIcon className='mr-2 size-4' />
                                Save context to file
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setOpenLoadContextDialog(true)}
                            >
                                <UploadIcon className='mr-2 size-4' />
                                Open context from file
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div>
                    <Button
                        onClick={() => setOpen(!open)}
                    >Toggle sidebar</Button>
                </div>
                <div className='grid grid-cols-1 gap-4 @2xl:grid-cols-2 @6xl:grid-cols-3'>
                    <EditorCard
                        label={'Survey keys'}
                        description={'Define which surveys are available for this study.'}
                        type={'string'}
                        data={currentStudyContext?.surveyKeys ?? []}
                        selectedIndex={selection?.attributeKey === 'surveyKeys' ? currentStudyContext?.surveyKeys?.indexOf(selection?.item as string) : undefined}
                        onChange={(data) => {
                            let newStudyContext = { ...currentStudyContext };
                            if (!newStudyContext) {
                                newStudyContext = { surveyKeys: data as string[] };
                            } else {
                                newStudyContext.surveyKeys = data as string[];
                            }
                            updateCurrentStudyContext(newStudyContext);
                        }}
                        onSelectIndex={(index) => {
                            console.log(index);
                            if (index === undefined) {
                                setSelection(undefined);
                                return;
                            }
                            const item = currentStudyContext?.surveyKeys?.at(index);
                            console.log(item);
                            if (!item) {
                                return;
                            }
                            setSelection({
                                item,
                                attributeKey: 'surveyKeys',
                            });
                        }}
                    />
                    <div className='h-64'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor expedita totam blanditiis illum corrupti reiciendis. Perferendis dolores dicta officiis cum veniam atque accusamus ipsam? Sed consectetur architecto tempore blanditiis eligendi.
                    </div>
                    <div className='h-64'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor expedita totam blanditiis illum corrupti reiciendis. Perferendis dolores dicta officiis cum veniam atque accusamus ipsam? Sed consectetur architecto tempore blanditiis eligendi.
                    </div>
                    <div className='h-64'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor expedita totam blanditiis illum corrupti reiciendis. Perferendis dolores dicta officiis cum veniam atque accusamus ipsam? Sed consectetur architecto tempore blanditiis eligendi.
                    </div>
                    <div className='h-64'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor expedita totam blanditiis illum corrupti reiciendis. Perferendis dolores dicta officiis cum veniam atque accusamus ipsam? Sed consectetur architecto tempore blanditiis eligendi.
                    </div>
                    <div className='h-64'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor expedita totam blanditiis illum corrupti reiciendis. Perferendis dolores dicta officiis cum veniam atque accusamus ipsam? Sed consectetur architecto tempore blanditiis eligendi.
                    </div>
                    <div className='h-64'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor expedita totam blanditiis illum corrupti reiciendis. Perferendis dolores dicta officiis cum veniam atque accusamus ipsam? Sed consectetur architecto tempore blanditiis eligendi.
                    </div>
                    <div className='h-64'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor expedita totam blanditiis illum corrupti reiciendis. Perferendis dolores dicta officiis cum veniam atque accusamus ipsam? Sed consectetur architecto tempore blanditiis eligendi.
                    </div>
                    <div className='h-64'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor expedita totam blanditiis illum corrupti reiciendis. Perferendis dolores dicta officiis cum veniam atque accusamus ipsam? Sed consectetur architecto tempore blanditiis eligendi.
                    </div>
                </div>
            </main>

            <LoadContextFromDisk
                open={openLoadContextDialog}
                onClose={() => setOpenLoadContextDialog(false)}
            />

            <Sidebar
                variant='sidebar'
                side='right'
                className='mt-10'

            >
                <SidebarHeader>
                    <div className='relative'>
                        <h2 className='font-bold text-lg pe-6'>Edit </h2>

                        <Button variant={'ghost'} size={'icon'}
                            className='absolute -right-2 -top-2'
                            onClick={closeEditor}
                        >
                            <XIcon />
                            <span className='sr-only'>Close sidebar</span>
                        </Button>
                    </div>

                </SidebarHeader>
                <SidebarContent

                >
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta autem pariatur nobis voluptatibus? Dicta nihil quisquam quo et! Quidem corporis repellendus ipsam suscipit culpa fugiat exercitationem rerum! Tenetur, alias officia!
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    );
};

export default Overview;
