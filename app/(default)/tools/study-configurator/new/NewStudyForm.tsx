'use client';

import React, { useTransition } from 'react';
// import StudyPropertyEditor from '../../../../../components/study-property-editor/StudyPropertyEditor';
import { Study } from '@/utils/server/types/studyInfos';
import { useRouter } from 'next/navigation';
import { createStudy } from '@/app/(default)/tools/study-configurator/new/createStudyAction';
import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';
import NotImplemented from '@/components/NotImplemented';
import { Button, Divider, Input, Switch, Textarea } from '@nextui-org/react';
import LanguageSelector from '@/components/LanguageSelector';


interface NewStudyFormProps {
}

const NewStudyForm: React.FC<NewStudyFormProps> = (props) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [newStudy, setNewStudy] = React.useState<Study>({
        key: '',
        status: 'active',
        secretKey: '',
        rules: [],
        props: {
            name: [],
            description: [],
            tags: [],
            systemDefaultStudy: false,
        },
        configs: {
            idMappingMethod: 'sha256-b64',
            participantFileUploadRule: {
                name: 'gt',
                data: [
                    { dtype: 'num', num: 0 },
                    { dtype: 'num', num: 1 },
                ]
            }
        },
        stats: {
            participantCount: 0,
            tempParticipantCount: 0,
            responseCount: 0
        }
    } as Study);

    const onSubmit = async (study: Study) => {
        startTransition(async () => {
            try {
                const r = await createStudy(study);
                router.refresh();
                router.replace(`/tools/study-configurator/${r.key}`);
            } catch (e: any) {
                if (e.message === 'unauthenticated') {
                    router.push('/auth/login?callbackUrl=/tools/study-configurator/new');
                    return;
                }
                console.error(e);
            }
        });
    };

    const validateStudy = (): boolean => {
        if (newStudy.key === '' || newStudy.secretKey === '') {
            return false;
        }
        return true;
    }


    return (
        <>
            <h2 className='text-3xl font-bold'>Study creator</h2>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit(newStudy);
                }}
            >
                <TwoColumnsWithCards
                    label='Study configuration'
                    description='Configure the technical properties of the study.'
                    infoboxContent={(
                        <div className='py-unit-2 flex gap-unit-md flex-wrap'>
                            <div className=''>
                                <h4 className='text-medium font-bold'>Key</h4>
                                <p>The study key is used to identify the study in the system. It is used in the URL to access the study. It is also used to identify the study in the API. The study key can only contain letters, numbers and dashes.</p>
                            </div>
                            <div className=''>
                                <h4 className='text-medium font-bold'>ID mapping method</h4>
                                <p>The ID mapping method defines how the participant IDs are generated. Changing the method for an existing study will disassociate the existing participant IDs from the participant data.</p>
                            </div>
                            <div className=''>
                                <h4 className='text-medium font-bold'>Study secret</h4>
                                <p>The study secret is used to calculate the participant IDs in combination with a global secret configured in the study system. The ID mapping method defines how this key is used. Changing the secret for an existing study will disassociate the existing participant IDs from the participant data.</p>
                            </div>
                            <div className=''>
                                <h4 className='text-medium font-bold'>Participant file upload rule</h4>
                                <p>Configure if participants are allowed to upload files in the study. Allow or disallow options apply always, while the rule option allows to define a rule to allow file upload only for participants that meet the rule condition.</p>
                            </div>
                            <div className=''>
                                <h4 className='text-medium font-bold'>System default study</h4>
                                <p>If true, participants will be automatically assigned to this study triggering the `ENTER` event.</p>
                            </div>
                        </div>
                    )}

                >
                    <div className='flex flex-col gap-unit-lg'>
                        <Input
                            type="text"
                            placeholder='enter-a-study-key'
                            name='study-key'
                            label='Study key'
                            labelPlacement='outside'
                            radius='sm'
                            isRequired
                            variant='bordered'
                            autoComplete='off'
                            description='Must be unique for each study.'
                            classNames={{
                                inputWrapper: 'bg-white'
                            }}
                            value={newStudy.key}
                            onValueChange={(value) => {
                                setNewStudy({ ...newStudy, key: value });
                            }}
                        />

                        <NotImplemented className=''>
                            widget to select id mapping method | until the selection is implemented the id mapping method is fixed to `sha256-b64`
                        </NotImplemented>

                        <Input
                            type="text"
                            placeholder='enter a secret key'
                            name='study-secret-key'
                            label='Study Secret Key'
                            labelPlacement='outside'
                            radius='sm'
                            isRequired
                            variant='bordered'
                            classNames={{
                                inputWrapper: 'bg-white'
                            }}
                            autoComplete='off'
                            description='Used for the ID mapping to calculate participant ID.'
                            value={newStudy.secretKey}
                            onValueChange={(value) => {
                                setNewStudy({ ...newStudy, secretKey: value });
                            }}
                        />

                        <NotImplemented className=''>
                            wigdet for participant file upload rule | until the selection is implemented the participant file upload rule is fixed to `disallow`
                        </NotImplemented>

                        <Switch isSelected={
                            newStudy.props.systemDefaultStudy
                        } onValueChange={(isSelected) => {
                            setNewStudy({ ...newStudy, props: { ...newStudy.props, systemDefaultStudy: isSelected } })
                        }}>
                            Default study <span className='text-default-500 text-small'>({newStudy.props.systemDefaultStudy ? 'yes' : 'no'})</span>
                        </Switch>
                    </div>
                </TwoColumnsWithCards>

                <Divider />

                <TwoColumnsWithCards
                    label='Display Texts'
                    description='Content displayed on study cards, if the platform supports study selector.'
                    infoboxContent={(
                        <div className='py-unit-2 flex gap-unit-md flex-wrap'>
                            <div className=''>
                                <h4 className='text-medium font-bold'>Localisation</h4>
                                <p>These texts are localisable, so the application displays them in the selected language. Please provide all the translations for it to work correctly</p>
                            </div>
                            <div className=''>
                                <h4 className='text-medium font-bold'>Study name</h4>
                                <p>Name of the study, use a desciptive short name, will be eventually displayed on the list of available studies.</p>
                            </div>
                            <div className=''>
                                <h4 className='text-medium font-bold'>Study description</h4>
                                <p>Short description of the study. Add a sentence or two explaining what the study is about.</p>
                            </div>
                            <div className=''>
                                <h4 className='text-medium font-bold'>Tags</h4>
                                <p>Tags are used to categorize studies. You can add tags to your study to make it easier to find. You can manage the list of tags attached to the study here.</p>
                            </div>
                        </div>
                    )}

                >
                    <div className='flex flex-col gap-unit-lg'>
                        <div className='flex justify-end'>
                            <LanguageSelector
                                showBadgeForLanguages={['nl']}
                                onLanguageChange={(lang) => {
                                    console.log(lang);
                                }}
                            />
                        </div>

                        <NotImplemented className=''>
                            language selector
                            | help text: display texts should be defined in all languages
                            | indicate if a language is missing
                        </NotImplemented>

                        <Input
                            type="text"
                            placeholder='study name'
                            name='study-name'
                            label='Study Name'
                            labelPlacement='outside'
                            radius='sm'
                            variant='bordered'
                            autoComplete='off'
                            description='Localised short name for the study.'
                            classNames={{
                                inputWrapper: 'bg-white'
                            }}
                            /*value={}
                            onValueChange={(value) => {
                                setNewStudy({ ...newStudy, key: value });
                            }}*/
                            isDisabled
                        />

                        <Textarea
                            label="Description"
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="Enter your study description"
                            isDisabled
                        />

                        <NotImplemented className=''>
                            widget to manage tag list (add, remove, edit current translation, sort)
                        </NotImplemented>
                    </div>
                </TwoColumnsWithCards>

                <Divider />

                <div className='py-unit-lg flex justify-end gap-unit-md'>
                    <Button
                        type='submit'
                        color='primary'
                        size='lg'
                        isDisabled={!validateStudy()}
                        isLoading={isPending}
                    >
                        Create study
                    </Button>
                    <Button
                        type='button'
                        color='danger'
                        variant='ghost'
                        size='lg'
                        onPress={() => {
                            router.back();
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </>

    );
};

export default NewStudyForm;
