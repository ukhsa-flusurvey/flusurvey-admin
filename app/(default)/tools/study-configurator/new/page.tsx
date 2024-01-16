import Breadcrumbs from "@/components/Breadcrumbs";
import NewStudyForm from "./NewStudyForm";


export default async function Page() {
    return (
        <div className="px-unit-lg bg-white/60 h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    homeLink="/tools/study-configurator"
                    links={
                        [
                            {
                                title: 'Create a new study'
                            }
                        ]
                    }
                />
                <main className="py-unit-lg">
                    <NewStudyForm />
                </main>
            </div>
        </div>
    )
}
