import CogLoader from "@/components/CogLoader";
import ErrorAlert from "@/components/ErrorAlert";
import { ItemListCardWrapperWithAddButton } from "@/components/ItemListCardWrapperWithAddButton";
import { LinkMenu } from "@/components/LinkMenu";
import StudyCard from "@/components/StudyCard";
import { getStudies } from "@/lib/data/studyAPI";
import { getPermissionsForCurrentUser } from "@/lib/data/userManagementAPI";
import { Study } from "@/utils/server/types/studyInfos";
import { BsJournalMedical } from "react-icons/bs";

interface StudyListProps {
}

const StudyListCardWrapper: React.FC<{
    isLoading: boolean;
    children: React.ReactNode;
    hideAddButton?: boolean;
}> = (props) => {
    return (
        <ItemListCardWrapperWithAddButton
            title="Studies"
            description="Available studies"
            addHref="/tools/study-configurator/new"
            addLabel="Create New Study"
            isLoading={props.isLoading}
            className='w-full sm:w-1/2 sm:min-w-[400px]'
            hideAddButton={props.hideAddButton}
        >
            {props.children}
        </ItemListCardWrapperWithAddButton>
    );
}


const StudyList: React.FC<StudyListProps> = async (props) => {
    const resp = await getStudies();
    const currentUserPermissions = await getPermissionsForCurrentUser();

    if (currentUserPermissions.error) {
        return <ErrorAlert
            title="Error loading permissions"
            error={currentUserPermissions.error}
        />
    }

    const allowedToCreateStudy = currentUserPermissions.permissions.some((permission) => {
        return permission.action === 'create-study';
    }) || currentUserPermissions.isAdmin;


    let studies: Array<Study> | undefined = resp.studies;
    const error = resp.error;
    if (!error && studies !== undefined) {
        studies = studies.filter((study) => {
            return currentUserPermissions.permissions.some((permission) => {
                if (permission.resourceType !== 'study') {
                    return false;
                }
                return permission.resourceKey === study.key || permission.resourceKey === '*';
            })
        });
    }

    let content = null;
    if (error) {
        content = <ErrorAlert
            title="Error loading studies"
            error={error}
        />
    } else if (!studies || studies.length === 0) {
        content = <div className="flex py-6 flex-col justify-center items-center text-center">
            <BsJournalMedical className="text-3xl text-neutral-300 mb-3" />
            <p className="font-bold ">{"You don't have access to any studies studies"}</p>
            <p className="text-neutral-500 text-sm">Get started by adding a new study, or ask your administrator to add you to a study</p>
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
        <StudyListCardWrapper isLoading={false}
            hideAddButton={!allowedToCreateStudy}
        >
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
