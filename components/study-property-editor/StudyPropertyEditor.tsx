import React from 'react';
import Input from '../inputs/Input';
import TextArea from '../inputs/TextArea';
import NotImplemented from '../NotImplemented';
import Button from '../buttons/Button';
import { Study } from '@/utils/server/types/studyInfos';

interface StudyPropertyEditorProps {
    onSubmit: (study: Study) => void;
}


const StudyProperty: React.FC<{ label: string, description: string, children: React.ReactNode }> = (props) => {
    return (
        <div className='grid grid-cols-2 gap-4 my-6'>
            <div className=''>
                <h4 className='text-xl font-bold'>{props.label}</h4>
                <p className='text-sm text-gray-500'>{props.description}</p>
            </div>
            <div className=''>
                {props.children}
            </div>
        </div>
    );
}

const StudyPropertyEditor: React.FC<StudyPropertyEditorProps> = (props) => {
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
    } as Study);

    const validateStudy = (): boolean => {
        if (newStudy.key === '' || newStudy.secretKey === '') {
            return false;
        }
        return true;
    }

    return (
        <div className='p-6 bg-white rounded'>
            <h2 className='text-3xl font-bold'>Study creator</h2>
            <h3 className='text-2xl font-bold mt-8'>Study configuration</h3>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    props.onSubmit(newStudy);
                }}
            >
                <StudyProperty
                    label='Key'
                    description='The study key is used to identify the study in the system. It is used in the URL to access the study. It is also used to identify the study in the API. The study key can only contain letters, numbers and dashes.'
                >
                    <Input
                        id="study-key"
                        placeholder='Study key'
                        className='w-full'
                        type='text'
                        autoComplete='off'
                        onChange={(event) => {
                            setNewStudy({ ...newStudy, key: event.target.value });
                        }}
                    />
                </StudyProperty>

                <StudyProperty
                    label='ID mapping method'
                    description='The ID mapping method defines how the participant IDs are generated. Changing the method for an existing study will disassociate the existing participant IDs from the participant data.'
                >
                    <NotImplemented className=''>
                        widget to select id mapping method | until the selection is implemented the id mapping method is fixed to `sha256-b64`
                    </NotImplemented>
                </StudyProperty>

                <StudyProperty
                    label='Study secret'
                    description='The study secret is used to calculate the participant IDs in combination with a global secret configured in the study system. The ID mapping method defines how this key is used. Changing the secret for an existing study will disassociate the existing participant IDs from the participant data.'
                >
                    <Input
                        id="study-secret-key"
                        placeholder='enter a secret'
                        className='w-full'
                        type='password'
                        autoComplete='off'
                        onChange={(event) => {
                            setNewStudy({ ...newStudy, secretKey: event.target.value });
                        }}
                    />
                </StudyProperty>

                <StudyProperty
                    label='Participant file upload rule'
                    description='Configure if participants are allowed to upload files in the study. Allow or disallow options apply always, while the rule option allows to define a rule to allow file upload only for participants that meet the rule condition.'
                >
                    <NotImplemented className=''>
                        wigdet for participant file upload rule | until the selection is implemented the participant file upload rule is fixed to `disallow`
                    </NotImplemented>
                </StudyProperty>

                <StudyProperty
                    label='System default study'
                    description='If true, participants will be automatically assigned to this study triggering the `ENTER` event.'
                >
                    <Input
                        id="system-default-study"
                        type='checkbox'
                        className='w-6 h-6'
                        onChange={(event) => {
                            setNewStudy({ ...newStudy, props: { ...newStudy.props, systemDefaultStudy: event.target.checked } });
                        }}
                    />
                </StudyProperty>

                <hr></hr>

                <h3 className='text-2xl font-bold mt-6'>Display Texts</h3>
                <NotImplemented className='my-6'>
                    language selector
                    | help text: display texts should be defined in all languages
                    | indicate if a language is missing
                </NotImplemented>
                <StudyProperty
                    label='Study name'
                    description='Name of the study, use a desciptive short name, will be eventually displayed on the list of available studies.'
                >
                    <Input
                        id="study-name"
                        placeholder='Enter study name'
                        className='w-full'
                        type='text'
                        autoComplete='off'
                        disabled
                    />
                </StudyProperty>

                <StudyProperty
                    label='Study description'
                    description='Short description of the study. Add a sentence or two explaining what the study is about.'
                >
                    <TextArea
                        id="study-description"
                        rows={4}
                        placeholder='Add a study description'
                        autoComplete='off'
                        disabled
                    />
                </StudyProperty>

                <StudyProperty
                    label='Tags'
                    description='Tags are used to categorize studies. You can add tags to your study to make it easier to find. You can manage the list of tags attached to the study here.'
                >
                    <NotImplemented className=''>
                        widget to manage tag list (add, remove, edit current translation, sort)
                    </NotImplemented>
                </StudyProperty>

                <hr></hr>

                <div className='flex justify-end'>
                    <Button
                        type='submit'
                        disabled={!validateStudy()}
                    >Save</Button>
                </div>
            </form>
        </div>
    );
};

export default StudyPropertyEditor;
