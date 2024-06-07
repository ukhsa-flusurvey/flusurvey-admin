import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import React from 'react';
import { SurveyItem, SurveySingleItem } from 'survey-engine/data_types';

interface AdvancedConfigsProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const AdvancedConfigs: React.FC<AdvancedConfigsProps> = (props) => {
    const currentItem = props.surveyItem as SurveySingleItem;

    const confidentialModeOn = currentItem.confidentialMode !== undefined;

    const onToggleConfidentialMode = (checked: boolean) => {
        if (!checked) {
            currentItem.confidentialMode = undefined;
        } else {
            currentItem.confidentialMode = 'replace';
        }
        props.onUpdateSurveyItem(currentItem);
    }

    return (
        <div className='px-4 py-2 space-y-4'>
            <div>
                <h3 className='font-semibold text-base'>Confidential mode</h3>
                <p className='text-sm text-neutral-600'>By marking this item as confidential, the response will be saved into the confidential data store.</p>
            </div>
            <div className=''>
                <Label htmlFor='confidential-mode-switch'
                    className='flex items-center gap-2'
                >
                    <Switch
                        id='confidential-mode-switch'
                        checked={confidentialModeOn}
                        onCheckedChange={onToggleConfidentialMode}
                    />
                    Confidential mode ({confidentialModeOn ? 'On' : 'Off'})
                </Label>
            </div>

            {confidentialModeOn && (
                <fieldset className='space-y-2 flex'>
                    <legend className='font-semibold text-sm'>Confidential mode</legend>
                    <div>
                        <Select value={currentItem.confidentialMode || ''}
                            onValueChange={(value) => {
                                currentItem.confidentialMode = value as 'replace' | 'add';
                                props.onUpdateSurveyItem(currentItem);
                            }}
                        >

                            <SelectTrigger className='w-64'>
                                <SelectValue placeholder="Select a confidential mode..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='replace'>Replace</SelectItem>
                                <SelectItem value='add'>Add</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </fieldset>
            )}
        </div>
    );
};

export default AdvancedConfigs;
