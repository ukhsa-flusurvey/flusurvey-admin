import AuthManager from '@/components/AuthManager';
import React from 'react';
import { Expression, LocalizedString } from 'survey-engine/data_types';

interface Study {
    key: string;
    status: string;
    secretKey: string;
    props: {
        name: LocalizedString[];
        description: LocalizedString[];
        tags: LocalizedString[][];
    }
    configs: {
        idMappingMethod: string;
        participantFileUploadRule: Expression;
    }
    rules: Expression[];
}

const NewStudy: React.FC = () => {
    const [newStudy, setNewStudy] = React.useState<Study>({
        key: '',
        status: 'active',
        secretKey: '',
        rules: [],
        props: {
            name: [],
            description: [],
            tags: [],
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

    const createStudy = async () => {
        const response = await fetch('/api/studies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStudy),
        });
        const data = await response.json();
        console.log(data);
    };



    return (
        <AuthManager>
            <div>
                <h1>New Study</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createStudy();
                    }}

                >
                    <label htmlFor='studyKey'>Study key</label>
                    <input type='text' name='studyKey'
                        onChange={(e) => {
                            setNewStudy({
                                ...newStudy,
                                key: e.target.value,
                            });
                        }}
                    />
                    <label htmlFor='props.secretKey'>Secret key</label>
                    <input type='text' name='props.secretKey'
                        onChange={(e) => {
                            setNewStudy({
                                ...newStudy,
                                secretKey: e.target.value,
                            });
                        }}
                    />
                    <button type='submit'>Create</button>
                </form>
            </div>
        </AuthManager >
    );
};

export default NewStudy;
