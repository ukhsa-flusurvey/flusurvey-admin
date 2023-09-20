import React from 'react';
import SystemMessagesSidebar from './SystemMessagesSidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

const Layout: React.FC<LayoutProps> = (props) => {
    return (
        <div className="flex max-w-full">
            {
                <div className='sticky top-0 h-screen shrink'>
                    <SystemMessagesSidebar />
                </div>
            }


            <div className="grow overflow-hidden">

                {props.children}
            </div>
        </div>



    );
};

export default Layout;
