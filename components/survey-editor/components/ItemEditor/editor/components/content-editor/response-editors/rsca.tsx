import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import { ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';

interface RscaProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const ModeSelector = (props: {
    size: string,
    mode?: string,
    onChange: (size: string, mode: string) => void
}) => {
    return <div className='flex items-center gap-2'>
        <p className='w-20 font-semibold text-sm'>{props.size}</p>
        <Select value={props.mode || ''}
            onValueChange={(value) => {
                props.onChange(props.size, value);
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a render mode..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='vertical'>Vertical</SelectItem>
                <SelectItem value='horizontal'>Horizontal</SelectItem>
                <SelectItem value='table'>Table</SelectItem>
            </SelectContent>
        </Select>
    </div>
}

const Rsca: React.FC<RscaProps> = (props) => {

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const rscaGroupIndex = rg.items.findIndex(comp => comp.role === 'responsiveSingleChoiceArray');
    if (rscaGroupIndex === undefined || rscaGroupIndex === -1) {
        return <p>Responsive single choice array not found</p>;
    }
    const rscaGroup = rg.items[rscaGroupIndex] as ItemGroupComponent;
    if (!rscaGroup || !rscaGroup.items) {
        return <p>Single choice group not found</p>;
    }

    const styles = rscaGroup.style || [];

    const defaultMode = styles?.find(st => st.key === 'defaultMode')?.value;
    const smMode = styles?.find(st => st.key === 'smMode')?.value;
    const mdMode = styles?.find(st => st.key === 'mdMode')?.value;
    const lgMode = styles?.find(st => st.key === 'lgMode')?.value;
    const xlMode = styles?.find(st => st.key === 'xlMode')?.value;

    const onChangeRSCA = (newRSCA: ItemGroupComponent) => {
        const existingItems = props.surveyItem.components?.items || [];
        (existingItems[rgIndex] as ItemGroupComponent).items[rscaGroupIndex] = newRSCA;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingItems,
            }
        });
    };

    const onModeChange = (size: string, mode: string) => {
        const existingStyles = [...styles];
        const modeKey = `${size}Mode`;

        const index = existingStyles.findIndex(st => st.key === modeKey);
        if (index > -1) {
            existingStyles[index] = { key: modeKey, value: mode };
        } else {
            existingStyles.push({ key: modeKey, value: mode });
        }

        rscaGroup.style = existingStyles;
        onChangeRSCA(rscaGroup);
    }

    return (
        <div>
            <p>Rsca</p>
            <p>
                options: list of options with labels
            </p>
            <p>
                sortable rows:
                key,
                label,
                display condition
                horizontalModeLabelPlacement: top, none, undefined
                horizontalModeClassName: string
                tableModeClassName: string
                verticalModeReverseOrder: true | false, undefined
                verticalModeClassName: string
            </p>

            <div className='space-y-2'>
                <p className='font-semibold'>
                    Render mode for screen sizes:
                </p>
                <ModeSelector
                    size='default'
                    mode={defaultMode}
                    onChange={onModeChange}
                />

                <ModeSelector
                    size='sm'
                    mode={smMode}
                    onChange={onModeChange}
                />

                <ModeSelector
                    size='md'
                    mode={mdMode}
                    onChange={onModeChange}
                />

                <ModeSelector
                    size='lg'
                    mode={lgMode}
                    onChange={onModeChange}
                />

                <ModeSelector
                    size='xl'
                    mode={xlMode}
                    onChange={onModeChange}
                />
            </div>

        </div>
    );
};

export default Rsca;
