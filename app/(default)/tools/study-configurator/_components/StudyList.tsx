import CogLoader from "@/components/CogLoader";
import ErrorAlert from "@/components/ErrorAlert";
import { ItemListCardWrapperWithAddButton } from "@/components/ItemListCardWrapperWithAddButton";
import { LinkMenu } from "@/components/LinkMenu";
import StudyCard from "@/components/StudyCard";
import { getStudies } from "@/lib/data/studyAPI";
import { Study } from "@/utils/server/types/studyInfos";
import { BsJournalMedical } from "react-icons/bs";

interface StudyListProps {
}

const StudyListCardWrapper: React.FC<{
    isLoading: boolean;
    children: React.ReactNode;
}> = (props) => {
    return (
        <ItemListCardWrapperWithAddButton
            title="Studies"
            description="Available studies"
            addHref="/tools/study-configurator/new"
            addLabel="Create New Study"
            isLoading={props.isLoading}
            className='w-full sm:w-1/2 sm:min-w-[400px]'
        >
            {props.children}
        </ItemListCardWrapperWithAddButton>
    );
}


const StudyList: React.FC<StudyListProps> = async (props) => {
    const resp = await getStudies();

    const studies: Array<Study> | undefined = resp.studies;
    const error = resp.error;

    let content = null;
    if (error) {
        content = <ErrorAlert
            title="Error loading studies"
            error={error}
        />
    } else if (!studies || studies.length === 0) {
        content = <div className="flex py-6 flex-col justify-center items-center text-center">
            <BsJournalMedical className="text-3xl text-neutral-300 mb-3" />
            <p className="font-bold ">No studies</p>
            <p className="text-neutral-500 text-sm">Get started by adding a new study</p>
        </div>
    } else {
        content = (
            <LinkMenu>
                {studies.map((study: Study) => <StudyCard key={study.key}
                    baseURL='/tools/study-configurator'
                    study={study}
                />)}
            </LinkMenu>
        )
    }

    return (
        <StudyListCardWrapper isLoading={false}>
            {content}
        </StudyListCardWrapper >
    );
};

export default StudyList;

export const StudyListSkeleton = () => {
    return (
        <StudyListCardWrapper isLoading={true}>
            <CogLoader
                label='Loading studies...'
            />
        </StudyListCardWrapper>
    )
}
