import Breadcrumbs from "@/components/Breadcrumbs";
import { BsHouseFill } from "react-icons/bs";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import StudyDashboard from "../_components/StudyDashboard";

interface PageProps {
    params: {
        studyKey: string
    }
}

export default async function Page(props: PageProps) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        redirect('/auth/login?callbackUrl=/tools/study-configurator/new');
    }

    return (
        <div className="px-unit-lg bg-white/60 h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    links={
                        [
                            {
                                href: '/tools/study-configurator',
                                title: <BsHouseFill />
                            },
                            {
                                title: props.params.studyKey
                            }
                        ]
                    }
                />
                <main className="py-unit-lg">
                    <StudyDashboard studyKey={props.params.studyKey} />
                </main>
            </div>
        </div>
    )
}
