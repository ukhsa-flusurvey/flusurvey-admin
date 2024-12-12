import CogLoader from "@/components/CogLoader";
import ErrorAlert from "@/components/ErrorAlert";
import { LinkMenu } from "@/components/LinkMenu";
import StudyCard from "@/components/StudyCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudies } from "@/lib/data/studyAPI";
import { getPermissionsForCurrentUser } from "@/lib/data/userManagementAPI";
import { filterStudiesWithPermissions } from "@/lib/permission-utils";
import { Study } from "@/utils/server/types/studyInfos";
import { redirect } from "next/navigation";
import { BsJournalMedical } from "react-icons/bs";


const StudyListCardWrapper: React.FC<{
    isLoading: boolean;
    children: React.ReactNode;
}> = (props) => {
    return (
        <Card
            variant={"opaque"}
            className='w-full sm:w-1/2 sm:min-w-[400px]'
        >
            <CardHeader>
                <CardTitle>
                    Select a study
                </CardTitle>
            </CardHeader>

            <CardContent>
                {props.children}
            </CardContent>
        </Card>
    );
}


const StudyList: React.FC = async () => {
    const resp = await getStudies();
    const currentUserPermissions = await getPermissionsForCurrentUser();

    if (currentUserPermissions.error) {
        return <ErrorAlert
            title="Error loading permissions"
            error={currentUserPermissions.error}
        />
    }

    const error = resp.error;
    const studies: Array<Study> | undefined = filterStudiesWithPermissions(currentUserPermissions, resp.studies);

    let content = null;
    if (error) {
        content = <ErrorAlert
            title="Error loading studies"
            error={error}
        />
    } else if (!studies || studies.length === 0) {
        content = <div className="flex py-6 flex-col justify-center items-center text-center">
            <BsJournalMedical className="text-3xl text-neutral-300 mb-3" />
            <p className="font-bold ">
                {"You don't have access to any studies"}
            </p>
            <p className="text-neutral-500 text-sm">Ask your administrator to add you to a study</p>
        </div>
    } else if (studies.length === 1) {
        redirect(`/tools/participants/${studies[0].key}`);
    } else {
        content = (
            <LinkMenu>
                {studies.map((study: Study) => <StudyCard key={study.key}
                    baseURL='/tools/participants'
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

export const StudySelectorSkeleton = () => {
    return (
        <StudyListCardWrapper isLoading={true}>
            <CogLoader
                label='Loading studies...'
            />
        </StudyListCardWrapper>
    )
}
