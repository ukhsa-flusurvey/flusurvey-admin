import React from 'react';
import { SurveySingleItem, ItemGroupComponent, ItemComponent } from 'survey-engine/data_types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ItemComponentRole } from '@/components/survey-editor/components/types';
import DropdownContentConfig from './dropdown-content-config';
import TextInputContentConfig from './text-input-content-config';
import NumberInputContentConfig from './number-input-content-config';

interface ResponsiveMatrixEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const BreakpointSelector: React.FC<{
    currentBreakpoint?: string;
    onChange: (breakpoint: string) => void;
}> = ({ currentBreakpoint, onChange }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="breakpoint-select" className="text-sm font-medium">
                Responsive Breakpoint
            </Label>
            <Select value={currentBreakpoint || 'md'} onValueChange={onChange}>
                <SelectTrigger id="breakpoint-select">
                    <SelectValue placeholder="Select breakpoint" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sm">Small (sm)</SelectItem>
                    <SelectItem value="md">Medium (md)</SelectItem>
                    <SelectItem value="lg">Large (lg)</SelectItem>
                    <SelectItem value="xl">Extra Large (xl)</SelectItem>
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                Screen size threshold where the matrix switches from mobile to desktop layout
            </p>
        </div>
    );
};

const ResponseTypeSelector: React.FC<{
    currentResponseType?: string;
    onChange: (responseType: string) => void;
}> = ({ currentResponseType, onChange }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="response-type-select" className="text-sm font-medium">
                Response Type
            </Label>
            <Select value={currentResponseType || 'dropdown'} onValueChange={onChange}>
                <SelectTrigger id="response-type-select">
                    <SelectValue placeholder="Select response type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                    <SelectItem value="input">Text Input</SelectItem>
                    <SelectItem value="numberInput">Number Input</SelectItem>
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                Type of input control used in each matrix cell
            </p>
        </div>
    );
};

const ResponsiveMatrixEditor: React.FC<ResponsiveMatrixEditorProps> = ({ surveyItem, onUpdateSurveyItem }) => {
    const rgIndex = surveyItem.components?.items.findIndex(comp => comp.role === ItemComponentRole.ResponseGroup);
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }

    const rg = surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const responsiveMatrixIndex = rg.items.findIndex(comp => comp.role === 'responsiveMatrix');
    if (responsiveMatrixIndex === undefined || responsiveMatrixIndex === -1) {
        return <p>Responsive matrix not found</p>;
    }

    const responsiveMatrixComponent = rg.items[responsiveMatrixIndex] as ItemGroupComponent;
    const styles = responsiveMatrixComponent.style || [];

    const updateSurveyItemWithNewRg = (updatedComponent: ItemComponent) => {

        const newRg = {
            ...rg,
            items: rg.items.map(comp => {
                if (comp.role === 'responsiveMatrix') {
                    return updatedComponent;
                }
                return comp;
            }),
        };

        const existingComponents = surveyItem.components?.items || [];
        existingComponents[rgIndex] = newRg;

        const newSurveyItem = {
            ...surveyItem,
            components: {
                ...surveyItem.components as ItemGroupComponent,
                items: existingComponents,
            }
        }
        onUpdateSurveyItem(newSurveyItem);
    }

    const getStyleValue = (key: string): string | undefined => {
        return styles.find(st => st.key === key)?.value;
    };

    const currentBreakpoint = getStyleValue('breakpoint');
    const currentResponseType = getStyleValue('responseType') || 'dropdown';

    const getConfigComponent = (role: string): ItemComponent | undefined => {
        return responsiveMatrixComponent.items?.find(item => item.role === role);
    };

    const updateConfigComponent = (role: string, updatedComponent: ItemComponent) => {
        const updatedResponsiveMatrix = { ...responsiveMatrixComponent };

        if (!updatedResponsiveMatrix.items) {
            updatedResponsiveMatrix.items = [];
        }

        const existingIndex = updatedResponsiveMatrix.items.findIndex(item => item.role === role);

        if (existingIndex > -1) {
            updatedResponsiveMatrix.items[existingIndex] = updatedComponent;
        } else {
            updatedResponsiveMatrix.items.push(updatedComponent);
        }

        updateSurveyItemWithNewRg(updatedResponsiveMatrix);
    };

    const handleStyleChange = (key: string, value: string) => {
        const existingStyles = [...styles];
        const index = existingStyles.findIndex(st => st.key === key);

        if (index > -1) {
            existingStyles[index] = { key, value };
        } else {
            existingStyles.push({ key, value });
        }

        // Update the component style
        const newResponsiveMatrixComponent = {
            ...responsiveMatrixComponent,
            style: existingStyles,
        };

        // Update the survey item
        updateSurveyItemWithNewRg(newResponsiveMatrixComponent);
        return newResponsiveMatrixComponent;
    };

    const renderTypeSpecificEditor = () => {
        switch (currentResponseType) {
            case 'dropdown': {
                const dropdownConfig = getConfigComponent('dropdownOptions') || {
                    key: 'dropdownOptions',
                    role: 'dropdownOptions',
                    items: []
                };
                return (
                    <DropdownContentConfig
                        component={dropdownConfig}
                        onChange={(updatedComponent) => updateConfigComponent('dropdownOptions', updatedComponent)}
                        contentInputLabel='Placeholder text'
                        contentInputPlaceholder='Enter placeholder...'
                        descriptionInputLabel='Clear option'
                        descriptionInputPlaceholder='Enter clear option...'
                    />
                );
            }
            case 'input': {
                const inputConfig = getConfigComponent('inputOptions') || {
                    key: 'inputOptions',
                    role: 'inputOptions'
                };
                return (
                    <TextInputContentConfig
                        component={inputConfig}
                        onChange={(updatedComponent) => updateConfigComponent('inputOptions', updatedComponent)}
                        allowMultipleLines={false}
                    />
                );
            }
            case 'numberInput': {
                const numberInputConfig = getConfigComponent('numberInputOptions') || {
                    key: 'numberInputOptions',
                    role: 'numberInputOptions'
                };
                return (
                    <NumberInputContentConfig
                        component={numberInputConfig}
                        onChange={(updatedComponent) => updateConfigComponent('numberInputOptions', updatedComponent)}
                    />
                );
            }
            default:
                return (
                    <div className="text-sm text-gray-500">
                        Unknown response type: {currentResponseType}
                    </div>
                );
        }
    };

    const handleResponseTypeChange = (newResponseType: string) => {
        const currentType = getStyleValue('responseType');

        // If type is not actually changing, just update normally
        if (currentType === newResponseType) {
            return;
        }

        // Check if there are existing configuration components that will be lost
        const hasDropdownOptions = responsiveMatrixComponent.items?.some(item => item.role === 'dropdownOptions');
        const hasInputOptions = responsiveMatrixComponent.items?.some(item => item.role === 'inputOptions');
        const hasNumberInputOptions = responsiveMatrixComponent.items?.some(item => item.role === 'numberInputOptions');

        const hasExistingConfig = hasDropdownOptions || hasInputOptions || hasNumberInputOptions;

        if (hasExistingConfig) {
            const confirmMessage = `Changing the response type will remove existing configuration for the current type. This may result in data loss. Are you sure you want to continue?`;
            if (!confirm(confirmMessage)) {
                return;
            }
        }

        // Update the response type style
        const updatedResponsiveMatrixComponent = handleStyleChange('responseType', newResponseType);

        // Remove existing configuration components
        if (updatedResponsiveMatrixComponent.items) {
            updatedResponsiveMatrixComponent.items = updatedResponsiveMatrixComponent.items.filter(item =>
                item.role !== 'dropdownOptions' &&
                item.role !== 'inputOptions' &&
                item.role !== 'numberInputOptions'
            );
            // Update the survey item
            updateSurveyItemWithNewRg(updatedResponsiveMatrixComponent);
        }
    };

    return (
        <div className="space-y-4">

            <div className="space-y-4">
                <BreakpointSelector
                    currentBreakpoint={currentBreakpoint}
                    onChange={(newBreakpoint) => handleStyleChange('breakpoint', newBreakpoint)}
                />

                <ResponseTypeSelector
                    currentResponseType={currentResponseType}
                    onChange={handleResponseTypeChange}
                />



                {/* Placeholder content for future implementation */}
                <div className="space-y-3 pt-4 border-t">
                    <div>
                        TODO: matrix cols
                    </div>

                    <div>
                        TODO: matrix rows
                    </div>
                </div>
            </div>


            <div className="space-y-3 pt-4 border-t">
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                        {currentResponseType === 'dropdown' && 'Dropdown Configuration'}
                        {currentResponseType === 'input' && 'Text Input Configuration'}
                        {currentResponseType === 'numberInput' && 'Number Input Configuration'}
                    </h4>
                    {renderTypeSpecificEditor()}
                </div>
            </div>



        </div>
    );
};

export default ResponsiveMatrixEditor;
