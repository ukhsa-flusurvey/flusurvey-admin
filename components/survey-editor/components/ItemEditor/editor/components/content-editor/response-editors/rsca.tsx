import SortableItem from '@/components/survey-editor/components/general/SortableItem';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Circle } from 'lucide-react';
import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';

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

const OptionEditor = (props: {
    option: ItemComponent,
    onChange: (newOption: ItemComponent) => void
}) => {
    return <SortableItem
        id={props.option.key!}

    >
        todo
    </SortableItem>
}

const OptionsEditor = (props: {
    options: ItemComponent[],
    onChange: (newOptions: ItemComponent[]) => void
}) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);



    const draggedItem = props.options.find(option => option.key === draggedId);


    return <div>
        <p className='font-semibold'>
            Options ({props.options.length})
        </p>
        <p className='text-sm text-muted-foreground'>
            These options will be used for each row
            (drag and drop to reorder)
        </p>



        <SortableWrapper
            sortableID={`options-for-rsca`}
            items={props.options.map((option, index) => {
                return {
                    id: option.key || index.toString(),
                }
            })}
            onDraggedIdChange={(id) => {
                setDraggedId(id);
            }}
            onReorder={(activeIndex, overIndex) => {
                const newItems = [...props.options];
                newItems.splice(activeIndex, 1);
                newItems.splice(overIndex, 0, props.options[activeIndex]);
                props.onChange(newItems);

            }}
            dragOverlayItem={(draggedId && draggedItem) ?
                <OptionEditor
                    option={draggedItem}
                    onChange={(newOption) => { }}
                />
                : null}
        >

            <ol className='px-1 space-y-2 py-4'>
                {props.options.length === 0 && <p className='text-sm text-primary'>
                    No options defined.
                </p>}
                {props.options.map((option, index) => {
                    return <OptionEditor
                        key={option.key || index}
                        option={option}
                        onChange={(newOption) => {
                            const newOptions = [...props.options];
                            newOptions[index] = newOption;
                            props.onChange(newOptions);
                        }}
                    />
                })}
            </ol>
        </SortableWrapper>

        <AddDropdown
            options={[
                { key: 'option', label: 'Option', icon: <Circle className='size-4 text-neutral-500 me-2' /> },
            ]}
            onAddItem={(type) => {
                if (type === 'option') {
                    const newOption: ItemComponent = {
                        key: Math.random().toString(36).substring(9),
                        role: 'option',
                    }
                    props.onChange([...props.options, newOption]);
                }
            }}
        />
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

    const useVerticalModeReverseOrder = styles?.find(st => st.key === 'verticalModeReverseOrder')?.value === 'true';

    const options = (rscaGroup.items.find(comp => comp.role === 'options') as ItemGroupComponent)?.items || [];

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
        <div className='space-y-4'>
            <OptionsEditor
                options={options}
                onChange={(newOptions) => {
                    const optionsIndex = rscaGroup.items.findIndex(comp => comp.role === 'options');
                    if (optionsIndex === -1) {
                        rscaGroup.items.push({
                            role: 'options',
                            items: newOptions
                        });
                    } else {
                        rscaGroup.items[optionsIndex] = {
                            role: 'options',
                            items: newOptions
                        };
                    }
                    onChangeRSCA(rscaGroup);
                }}
            />

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

            <div className='space-y-2'>
                <p className='font-semibold'>
                    Reverse option order in vertical mode:
                </p>

                <Label
                    className='flex items-center gap-2'
                    htmlFor='vertical-mode-reverse-order'
                >
                    <Switch
                        id='vertical-mode-reverse-order'
                        checked={useVerticalModeReverseOrder}
                        onCheckedChange={(checked) => {
                            let existingStyles = [...styles];

                            const verticalModeReverseOrderKey = 'verticalModeReverseOrder';

                            if (checked) {
                                const index = existingStyles.findIndex(st => st.key === verticalModeReverseOrderKey);

                                if (index > -1) {
                                    existingStyles[index] = { key: verticalModeReverseOrderKey, value: 'true' };
                                } else {
                                    existingStyles.push({ key: verticalModeReverseOrderKey, value: 'true' });
                                }
                            } else {
                                existingStyles = existingStyles.filter(st => st.key !== verticalModeReverseOrderKey);
                            }

                            rscaGroup.style = existingStyles;
                            onChangeRSCA(rscaGroup);
                        }}
                    />

                    <span>
                        {useVerticalModeReverseOrder ? 'Yes' : 'No'}
                    </span>
                </Label>

            </div>
        </div>
    );
};

export default Rsca;
