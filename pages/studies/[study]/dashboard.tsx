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
            <main className='flex'>
                <Sidebar>
                </Sidebar>
            </main>
        </>
    )
}
