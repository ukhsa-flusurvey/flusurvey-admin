import React from 'react';
import DeleteCodeListItem from './delete-code-list-item';
import { Loader2Icon } from 'lucide-react';

interface CodeListSectionProps {
    studyKey: string;
    listKey: string;
}

const CodeListSection: React.FC<CodeListSectionProps> = async (props) => {
    // load code list items for list key
    return (
        <section>
            <h3>Code list {props.listKey}</h3>
            <ul>
                <li>Code list item <DeleteCodeListItem
                    studyKey={props.studyKey}
                    listKey={props.listKey}
                    code={'code1'}
                /></li>
            </ul>
        </section>
    );
};

export default CodeListSection;

export const CodeListSectionLoader = (props: CodeListSectionProps) => {
    <section>
        <h3>Code list {props.listKey}</h3>
        <div className='w-full flex items-center justify-center'>
            <Loader2Icon
                className='animate-spin size-8 text-primary'></Loader2Icon>
        </div>
    </section>

}
