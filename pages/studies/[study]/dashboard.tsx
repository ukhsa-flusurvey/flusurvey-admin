import Head from 'next/head'
import Sidebar from '@/components/sidebar/Sidebar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';


export default function Dashboard() {
    const router = useRouter()
    const { study: studyKey } = router.query

    console.log(studyKey);

    useEffect(() => {
        console.log('Dashboard');
        const fetchData = async () => {
            const res = await fetch('/api/studies/tekenradar/survey');
            const data = await res.json();
            console.log(data);
        }
        fetchData();
    }, []);

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='flex'>
                <Sidebar>
                </Sidebar>
            </main>
        </>
    )
}