import React from 'react';
import WrapperCard from './WrapperCard';
import { getStudy } from '@/lib/data/studyAPI';
import ErrorAlert from '@/components/ErrorAlert';
import AccountIdTrackingToggle from './AccountIdTrackingToggle';
import { Skeleton } from '@/components/ui/skeleton';

interface AccountIdTrackingCardProps {
    studyKey: string;
}

const Wrapper = (props: { children: React.ReactNode }) => {
    return (
        <WrapperCard
            title={'Account ID Tracking'}
            description={'If enabled, the account ID is tracked for new participants. Participants from the same account can be identified, but the profile cannot be traced back.'}
        >
            {props.children}
        </WrapperCard>
    )
}

const AccountIdTrackingCard: React.FC<AccountIdTrackingCardProps> = async (props) => {
    const resp = await getStudy(props.studyKey);

    const error = resp.error;
    if (error) {
        return <ErrorAlert
            title="Error loading account ID tracking settings"
            error={error}
        />
    }

    const study = resp.study;

    return (
        <Wrapper>
            <AccountIdTrackingToggle
                studyKey={props.studyKey}
                trackAccount={study?.configs.trackAccount ?? false}
            />
        </Wrapper>
    );
};

export default AccountIdTrackingCard;

export const AccountIdTrackingCardSkeleton: React.FC = () => {
    return (
        <Wrapper>
            <Skeleton className='h-8 w-20' />
        </Wrapper>
    );
}
