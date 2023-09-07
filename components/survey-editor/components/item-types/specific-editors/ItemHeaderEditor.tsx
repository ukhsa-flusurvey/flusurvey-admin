import LanguageSelector from '@/components/LanguageSelector';
import { Divider, Input, Switch, Textarea } from '@nextui-org/react';
import React from 'react';
import AdvancedContentMonacoEditor from './AdvancedContentMonacoEditor';

interface ItemHeaderEditorProps {
}

const ItemHeaderEditor: React.FC<ItemHeaderEditorProps> = (props) => {
    return (
        <div className='flex flex-col gap-unit-sm'>
            <div className='flex justify-end'>
                <LanguageSelector />
            </div>

            <Switch size='sm'>
                Simple title
            </Switch>
            <Input
                id='item-title'
                label="Title"
                variant='bordered'
                placeholder="Enter title here"
            //value={testV}
            // onValueChange={(v) => setTestV(v)}
            />
            <AdvancedContentMonacoEditor
                advancedContent={[]}
                onChange={(v) => console.log(v)}
            />
            <Divider />
            <Input
                id='item-subtitle'
                label="Subtitle"
                variant='bordered'
                placeholder="Enter subtitle here"
                description="This text will be displayed below the title with a smaller font size."
            />

            <Switch size='sm'>
                Use help popup
            </Switch>
            <Textarea
                id='item-helpgroup'
                label="Content for help"
                variant='bordered'
                placeholder="Enter help content"

            />
            <Switch size='sm'>
                Sticky header
            </Switch>
        </div>
    );
};

export default ItemHeaderEditor;
