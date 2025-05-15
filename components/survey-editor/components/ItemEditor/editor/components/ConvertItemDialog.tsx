import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useEffect } from 'react';
import { SpecialSurveyItemTypeInfos, SurveyItemTypeRegistry, getItemKeyFromFullKey, getItemTypeInfos, getParentKeyFromFullKey } from '../../../../utils/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { SurveyItem } from 'survey-engine/data_types';
import { SurveyItemFeatures, surveyItemFeatureLookup } from './item-transformations';

interface ConvertItemDialogProps {
    open: boolean;
    surveyItem: SurveyItem;
    onClose: () => void;
    onItemConverted?: (newConvertedItem: string) => void;
}

const allSurveyItemTypes = [
    SpecialSurveyItemTypeInfos.groupItem,
    SpecialSurveyItemTypeInfos.pageBreak,
    SpecialSurveyItemTypeInfos.surveyEnd,
    ...SurveyItemTypeRegistry.map((re) => ({
        key: re.key,
        label: re.label,
        description: re.description,
        defaultItemClassName: re.className,
        icon: re.icon,
    }))
];

const ConvertItemDialog: React.FC<ConvertItemDialogProps> = (props) => {
    const itemTypeInfos = getItemTypeInfos(props.surveyItem);
    const [targetType, setTargetType] = React.useState<string>(itemTypeInfos.key);

    useEffect(() => {
        setTargetType(itemTypeInfos.key);
    }, [props.surveyItem]);

    return (
        <Dialog
            open={props.open}
            onOpenChange={(open) => {
                if (!open) {
                    props.onClose();
                }
            }}
        >
            <DialogContent className="w-[640px] max-w-none">
                <DialogHeader>
                    <DialogTitle>
                        Convert item:
                        <span className='ms-2 font-mono'>
                            {String(surveyItemFeatureLookup[SurveyItemFeatures.ItemKey](props.surveyItem) || '')}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <div className='flex flex-row items-center justify-center'>
                    <div className=''>
                        <p className='text-sm mb-1'>
                            From
                        </p>
                        <div className='flex flex-row items-center gap-2 border rounded-lg px-3 h-10 w-64 text-sm'>
                            <itemTypeInfos.icon
                                className='size-4'
                            />
                            {itemTypeInfos.label}
                        </div>
                    </div>
                    <div className='self-end flex flex-col items-center justify-center h-10 grow'>
                        <ArrowRight className='size-6' />
                    </div>
                    <div className='w-64'>
                        <p className='text-sm mb-1'>
                            To
                        </p>
                        <Select
                            value={targetType}
                            onValueChange={(value) => {
                                setTargetType(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {allSurveyItemTypes.map(typeInfo => (
                                    <SelectItem
                                        key={typeInfo.key}
                                        value={typeInfo.key}
                                    >
                                        <div className='flex flex-row items-center gap-2'>
                                            <typeInfo.icon
                                                className='size-4'
                                            />
                                            {typeInfo.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant={'outline'}
                        onClick={() => {
                            props.onClose()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            props.onClose();
                        }}
                    >
                        Convert
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConvertItemDialog;
