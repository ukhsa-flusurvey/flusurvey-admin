import React, { Suspense } from 'react'
import TabNav from '../_components/tab-nav';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AddNewAppRole from './_components/add-new-app-role';
import AppRolesTemplateList from './_components/app-roles-template-list';


const Page = () => {
    return (
        <div className="space-y-6">
            <TabNav
                activeTab={'app-roles'}
            />
            <Card
                variant={"opaque"}
                className='max-w-full min-w-80'
            >
                <CardHeader>
                    <h2 className='text-lg font-bold flex items-center gap-8 w-full justify-between'>
                        Available App Roles
                        <AddNewAppRole />
                    </h2>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Loading...</div>}>
                        <AppRolesTemplateList />
                    </Suspense>
                </CardContent>
            </Card>

        </div>
    )
}

export default Page
