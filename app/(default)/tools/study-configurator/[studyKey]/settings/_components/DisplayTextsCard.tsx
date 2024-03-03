import React from 'react';
import WrapperCard from './WrapperCard';

interface DisplayTextsCardProps {
    studyKey: string;
}

const Wrapper = (props: { children: React.ReactNode }) => {
    return (
        <WrapperCard
            title={'Display Texts'}
            description={'If the instance supports study selection, the display texts can be edited here.'}
        >
            {props.children}
        </WrapperCard>
    )
}

const DisplayTextsCard: React.FC<DisplayTextsCardProps> = async (props) => {
    // wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    return (
        <Wrapper>
            <p>
                form to edit display texts
            </p>
        </Wrapper>
    );
};

export default DisplayTextsCard;

export const DisplayTextsCardSkeleton: React.FC = () => {
    return (
        <Wrapper>
            <p>DisplayTextsCardSkeleton</p>
        </Wrapper >
    );
}
