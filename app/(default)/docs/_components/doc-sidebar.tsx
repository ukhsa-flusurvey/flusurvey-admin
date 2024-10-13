import React from 'react';
import SearchDocs from './search-docs';

const DocSidebar: React.FC = () => {
    return (
        <aside className="overflow-auto">
            <div className='sticky top-0 bg-secondary backdrop-blur-md py-2 px-3 border-b border-border'>
                <h2 className='text-lg font-semibold mb-4'>CASE Admin Documentation</h2>
                <div className='mb-2'>
                    <SearchDocs />
                </div>
            </div>

            <nav>
                <ul>
                    <li className='px-3'>
                        todo
                    </li>
                </ul>
            </nav>


        </aside>
    );
};

export default DocSidebar;
