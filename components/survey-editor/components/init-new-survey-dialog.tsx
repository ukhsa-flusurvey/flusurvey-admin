import React from 'react';
import { SurveyContext } from '../surveyContext';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BsExclamationTriangle } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


interface InitNewSurveyDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const InitNewSurveyDialog: React.FC<InitNewSurveyDialogProps> = (props) => {
    const { survey, setSurvey } = React.useContext(SurveyContext);

    const [surveyKey, setSurveyKey] = React.useState<string>('');

    const onCreateNewSurvey = () => {
        if (!surveyKey) return;
        setSurvey({
            availableFor: 'active_participants',
            surveyDefinition: {
                key: surveyKey,
                items: [],
            },
            versionId: '',

        });
        props.onClose();
    }


    return (
        <Dialog open={props.isOpen} onOpenChange={props.onClose}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create new survey
                    </DialogTitle>
                </DialogHeader>
                <div>
                    {survey && <div className='flex items-center gap-3 p-4 bg-yellow-100 rounded-lg mb-3'>
                        <span className='text-yellow-800 text-xl'>
                            <BsExclamationTriangle />
                        </span>
                        <p className='text-yellow-800'>
                            This will overwrite the current survey. Are you sure you want to continue?
                        </p>
                    </div>}

                    <div className='space-y-1.5'>
                        <Label htmlFor='surveyKey'>
                            Survey key
                        </Label>
                        <Input
                            id='surveyKey'
                            value={surveyKey}
                            onChange={(e) => setSurveyKey(e.target.value)}
                            placeholder='Enter a key for the survey'
                        />
                    </div>


                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={props.onClose}>
                        Cancel
                    </Button>

                    <Button color="primary" onClick={onCreateNewSurvey}
                        disabled={!surveyKey || surveyKey.length === 0}
                    >
                        Create
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default InitNewSurveyDialog;
