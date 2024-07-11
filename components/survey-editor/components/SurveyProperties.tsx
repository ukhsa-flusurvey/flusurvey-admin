import React, { useContext } from 'react';
import { SurveyContext } from '../surveyContext';
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from './general/sidebar-nav';
import { SurveyDocumentForm } from './SurveyPropertiesForm';
import { SurveyBasicInfoForm } from './forms/SurveyBasicInfoForm';
import { SurveyAccessForm } from './forms/SurveyAccessForm';

interface SurveyPropertiesProps {
}

const SurveyProperties: React.FC<SurveyPropertiesProps> = (props) => {
    const { survey, setSurvey } = useContext(SurveyContext);
    const [formIndex, setFormIndex] = React.useState(0);

    const formItems = [
        {
            title: "Basic Information",
            form: <SurveyBasicInfoForm />,
            href: "",
            navOnClick: () => setFormIndex(0),
        },
        {
            title: "Access Conditions",
            form: <SurveyAccessForm />,
            href: "",
            navOnClick: () => setFormIndex(1),
        },
    ];

    if (!survey) {
        return <p>No survey loaded</p>;
    }

    return (
        <>
            <div className='md:p-6 overflow-auto'>
                <section className='grow md:rounded-[0.5rem] md:border md:shadow mx-auto max-w-screen-lg bg-white'>
                    <div className="space-y-6 p-10">
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-bold tracking-tight">Survey Properties</h2>
                            <p className="text-muted-foreground">
                                Manage the properties of the currently opened survey file.
                            </p>
                        </div>
                        <Separator className="my-6" />
                        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                            <aside className="-mx-4 lg:w-1/5">
                                <SidebarNav items={formItems} formIndex={formIndex} />
                            </aside>
                            <div className="flex-1 lg:max-w-2xl">
                                <SurveyDocumentForm activeForm={formItems[formIndex].form} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>


        </>
    )
};

export default SurveyProperties;
