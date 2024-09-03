import { SurveyContext } from '@/components/survey-editor/surveyContext';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React, { useContext } from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';

interface ContactFormProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}


const SimpleFieldConfigs: React.FC<{
    id: string;
    fieldName: string;
    selectedLanguage: string;
    component: ItemGroupComponent | undefined;
    onChange: (newComp: ItemComponent | undefined) => void;
    hideToggle?: boolean;
}> = (props) => {
    const isUsed = props.component !== undefined;

    return (<div className='p-2 border border-border rounded-md space-y-2'>
        <p className='font-semibold text-sm '>
            {props.fieldName}
        </p>
        {!props.hideToggle && <Label
            className='flex items-center gap-2'
            htmlFor={`${props.id}-used`}>
            <Switch id={`${props.id}-used`}
                checked={isUsed}
                onCheckedChange={(checked) => {
                    if (!checked) {
                        if (confirm('Are you sure you want to remove this field?')) {
                            props.onChange(undefined);
                        }
                    } else {
                        props.onChange({
                            key: props.id,
                            role: props.id,
                        });
                    }
                }}
            >

            </Switch>
            Use field
        </Label>}

        {isUsed && <div className='flex flex-col gap-2'>
            <div className='space-y-1.5'>
                <Label
                    htmlFor={`${props.id}-label`}
                >
                    Label
                </Label>
                <Input
                    id={`${props.id}-label`}
                    value={localisedObjectToMap(props.component?.content).get(props.selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { ...props.component } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(props.selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        props.onChange(updatedComponent);
                    }}
                    placeholder='Enter label for selected language...'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor={`${props.id}-placeholder`}
                >
                    Placeholder
                </Label>
                <Input
                    id={`${props.id}-placeholder`}
                    value={localisedObjectToMap(props.component?.description).get(props.selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { ...props.component } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.description);
                        updatedContent.set(props.selectedLanguage, e.target.value);
                        updatedComponent.description = generateLocStrings(updatedContent);
                        props.onChange(updatedComponent);
                    }}
                    placeholder='Enter placeholder for selected language...'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor={`${props.id}-pattern`}
                >
                    Pattern (regex)
                </Label>
                <Input
                    id={`${props.id}-pattern`}
                    value={props.component?.properties?.pattern || ''}
                    onChange={(e) => {
                        const updatedComponent = { ...props.component } as ItemComponent;
                        updatedComponent.properties = {
                            ...props.component?.properties,
                            pattern: e.target.value
                        }
                        props.onChange(updatedComponent);
                    }}
                    placeholder='Enter pattern...'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor={`${props.id}-hint`}
                >
                    Hint
                </Label>
                <Input
                    id={`${props.id}-hint`}
                    value={localisedObjectToMap(props.component?.items?.find(item => item.role === 'hint')?.content).get(props.selectedLanguage) || ''}
                    onChange={(e) => {
                        if (!props.component) {
                            return;
                        }
                        let comp = props.component?.items?.find(item => item.role === 'hint');
                        if (props.component?.items === undefined) {
                            props.component.items = [];
                        }
                        if (!comp) {
                            comp = {
                                key: 'hint',
                                role: 'hint',
                                content: generateLocStrings(new Map([[props.selectedLanguage, e.target.value]]))
                            };
                            props.component.items = [...props.component.items, comp];

                        } else {
                            const updatedContent = localisedObjectToMap(comp.content);
                            updatedContent.set(props.selectedLanguage, e.target.value);
                            comp.content = generateLocStrings(updatedContent);
                            props.component.items.map(item => {
                                if (item.role === 'hint') {
                                    return comp;
                                }
                                return item;
                            });
                        }
                        props.onChange(props.component);
                    }}
                    placeholder='Enter hint...'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor={`${props.id}-error`}
                >
                    Field error
                </Label>
                <Input
                    id={`${props.id}-error`}
                    value={localisedObjectToMap(props.component?.items?.find(item => item.role === 'error')?.content).get(props.selectedLanguage) || ''}
                    onChange={(e) => {
                        if (!props.component) {
                            return;
                        }
                        let comp = props.component?.items?.find(item => item.role === 'error');
                        if (props.component?.items === undefined) {
                            props.component.items = [];
                        }
                        if (!comp) {
                            comp = {
                                key: 'error',
                                role: 'error',
                                content: generateLocStrings(new Map([[props.selectedLanguage, e.target.value]]))
                            };
                            props.component.items = [...props.component.items, comp];

                        } else {
                            const updatedContent = localisedObjectToMap(comp.content);
                            updatedContent.set(props.selectedLanguage, e.target.value);
                            comp.content = generateLocStrings(updatedContent);
                            props.component.items.map(item => {
                                if (item.role === 'error') {
                                    return comp;
                                }
                                return item;
                            });
                        }

                        props.onChange(props.component);
                    }}
                    placeholder='Error message...'
                />
            </div>
        </div>
        }
    </div>
    );
}

const ContactForm: React.FC<ContactFormProps> = (props) => {
    const { selectedLanguage } = useContext(SurveyContext);

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const contactCompIndex = rg.items.findIndex(comp => comp.role === 'contact');
    if (contactCompIndex === undefined || contactCompIndex === -1) {
        return <p>Consent not found</p>;
    }

    const contactComp = rg.items[contactCompIndex] as ItemGroupComponent;
    if (!contactComp) {
        return <p>Contact group not found</p>;
    }

    const previewLabelComp = contactComp.items.find(item => item.role === 'previewLabel');
    const btnLabelComp = contactComp.items.find(item => item.role === 'btnLabel');
    const dialogComp = contactComp.items.find(item => item.role === 'dialog');
    const saveBtnComp = contactComp.items.find(item => item.role === 'saveBtn');
    const resetBtnComp = contactComp.items.find(item => item.role === 'resetBtn');
    const cancelBtnComp = contactComp.items.find(item => item.role === 'cancelBtn');

    // field config components:
    const fullNameComp = contactComp.items.find(item => item.role === 'fullName');
    const companyComp = contactComp.items.find(item => item.role === 'company');
    const emailComp = contactComp.items.find(item => item.role === 'email');
    const phoneComp = contactComp.items.find(item => item.role === 'phone');
    const addressComp = contactComp.items.find(item => item.role === 'address');


    const onChange = (newComp: ItemComponent) => {
        if (contactComp.items.findIndex(item => item.role === newComp.role) === -1) {
            contactComp.items.push({
                role: newComp.role,
                content: generateLocStrings(new Map([[selectedLanguage, '']]))
            })
        }

        contactComp.items = contactComp.items.map(item => {
            if (item.role === newComp.role) {
                return newComp;
            }
            return item;
        });
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[contactCompIndex] = contactComp;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingComponents,
            }
        });

    };

    const onRemoveField = (field: string) => {
        const newItems = contactComp.items.filter(item => item.role !== field);
        contactComp.items = newItems;
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[contactCompIndex] = contactComp;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingComponents,
            }
        });

    };

    const renderAddressFields = () => {
        const currentAddressComp = (addressComp as ItemGroupComponent | undefined);
        const streetComp = currentAddressComp?.items.find(item => item.role === 'street');
        const street2Comp = currentAddressComp?.items.find(item => item.role === 'street2');
        const cityComp = currentAddressComp?.items.find(item => item.role === 'city');
        const postalCodeComp = currentAddressComp?.items.find(item => item.role === 'postalCode');


        return <div className='space-y-4 p-2 border border-border rounded-md'>
            <p className='font-semibold text-sm '>
                Address
            </p>

            <Label
                className='flex items-center gap-2'
                htmlFor={`address-toggle`}
            >
                <Switch id={`address-toggle`}
                    checked={addressComp !== undefined}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            const newAddressComp = {
                                key: 'address',
                                role: 'address',
                                items: [
                                    {
                                        key: 'street',
                                        role: 'street',
                                        content: generateLocStrings(new Map([[selectedLanguage, '']]))
                                    },
                                    {
                                        key: 'street2',
                                        role: 'street2',
                                        content: generateLocStrings(new Map([[selectedLanguage, '']]))
                                    },
                                    {
                                        key: 'city',
                                        role: 'city',
                                        content: generateLocStrings(new Map([[selectedLanguage, '']]))
                                    },
                                    {
                                        key: 'postalCode',
                                        role: 'postalCode',
                                        content: generateLocStrings(new Map([[selectedLanguage, '']]))
                                    }
                                ],
                            };
                            onChange(newAddressComp);
                        } else {
                            if (confirm('Are you sure you want to remove this field?')) {
                                onRemoveField('address');
                            }
                        }
                    }}
                >

                </Switch>
                Use address field
            </Label>

            {currentAddressComp !== undefined && <>
                <div className='space-y-1.5'>
                    <Label
                        htmlFor='address-label'
                    >
                        Label for address group
                    </Label>
                    <Input
                        id='address-label'
                        value={localisedObjectToMap(currentAddressComp?.content).get(selectedLanguage) || ''}
                        onChange={(e) => {
                            const updatedComponent = { ...currentAddressComp } as ItemComponent;
                            const updatedContent = localisedObjectToMap(updatedComponent.content);
                            updatedContent.set(selectedLanguage, e.target.value);
                            updatedComponent.content = generateLocStrings(updatedContent);
                            onChange(updatedComponent);
                        }}
                        placeholder='e.g. Your address:'
                    />
                </div>


                <SimpleFieldConfigs
                    component={streetComp as ItemGroupComponent}
                    onChange={(newComp) => {
                        if (!newComp) {
                            return;
                        }
                        currentAddressComp.items = currentAddressComp.items.map(item => {
                            if (item.role === newComp.role) {
                                return newComp;
                            }
                            return item;
                        });

                        onChange(currentAddressComp);
                    }}
                    id='street'
                    fieldName='Street'
                    selectedLanguage={selectedLanguage}
                    hideToggle={true}
                />
                <SimpleFieldConfigs
                    component={street2Comp as ItemGroupComponent}
                    onChange={(newComp) => {
                        if (!newComp) {
                            return;
                        }
                        currentAddressComp.items = currentAddressComp.items.map(item => {
                            if (item.role === newComp.role) {
                                return newComp;
                            }
                            return item;
                        });

                        onChange(currentAddressComp);
                    }}
                    id='street2'
                    fieldName='Street 2'
                    selectedLanguage={selectedLanguage}
                    hideToggle={true}
                />
                <SimpleFieldConfigs
                    component={cityComp as ItemGroupComponent}
                    onChange={(newComp) => {
                        if (!newComp) {
                            return;
                        }
                        currentAddressComp.items = currentAddressComp.items.map(item => {
                            if (item.role === newComp.role) {
                                return newComp;
                            }
                            return item;
                        });

                        onChange(currentAddressComp);
                    }}
                    id='city'
                    fieldName='City'
                    selectedLanguage={selectedLanguage}
                    hideToggle={true}
                />
                <SimpleFieldConfigs
                    component={postalCodeComp as ItemGroupComponent}
                    onChange={(newComp) => {
                        if (!newComp) {
                            return;
                        }
                        currentAddressComp.items = currentAddressComp.items.map(item => {
                            if (item.role === newComp.role) {
                                return newComp;
                            }
                            return item;
                        });

                        onChange(currentAddressComp);
                    }}
                    id='postalCode'
                    fieldName='Postal code'
                    selectedLanguage={selectedLanguage}
                    hideToggle={true}
                />
            </>}
        </div>
    }

    return (
        <div className='space-y-4'>
            <div className='space-y-1.5'>
                <Label
                    htmlFor='preview-label'
                >
                    Label
                </Label>
                <Input
                    id='preview-label'
                    value={localisedObjectToMap(previewLabelComp?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { key: 'previewLabel', role: 'previewLabel', ...previewLabelComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='e.g. Your address:'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='preview-label'
                >
                    Preview placeholder
                </Label>
                <Input
                    id='preview-placeholder'
                    value={localisedObjectToMap(previewLabelComp?.description).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { key: 'previewLabel', role: 'previewLabel', ...previewLabelComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.description = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='e.g. Enter your address using the button'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='btn-label'
                >
                    Button label
                </Label>
                <Input
                    id='btn-label'
                    value={localisedObjectToMap(btnLabelComp?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { key: 'btnLabel', role: 'btnLabel', ...btnLabelComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='e.g. Change address'
                />
            </div>

            <Separator />

            <div className='space-y-1.5'>
                <Label
                    htmlFor='dialog-title'
                >
                    Dialog title
                </Label>
                <Input
                    id='dialog-title'
                    value={localisedObjectToMap(dialogComp?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { key: 'dialog', role: 'dialog', ...dialogComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='e.g. Contact details'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='dialog-description'
                >
                    Dialog description
                </Label>
                <Input
                    id='dialog-description'
                    value={localisedObjectToMap(dialogComp?.description).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { key: 'dialog', role: 'dialog', ...dialogComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.description = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='e.g. Needed to contact you regarding further information'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='cancel-btn-label'
                >
                    Cancel button label
                </Label>
                <Input
                    id='cancel-btn-label'
                    value={localisedObjectToMap(cancelBtnComp?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { key: 'cancelBtn', role: 'cancelBtn', ...cancelBtnComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='e.g. Cancel'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='reset-btn-label'
                >
                    Reset button label
                </Label>
                <Input
                    id='reset-btn-label'
                    value={localisedObjectToMap(resetBtnComp?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { key: 'resetBtn', role: 'resetBtn', ...resetBtnComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='e.g. Reset'
                />
            </div>


            <div className='space-y-1.5'>
                <Label
                    htmlFor='save-btn-label'
                >
                    Save button label
                </Label>
                <Input
                    id='save-btn-label'
                    value={localisedObjectToMap(saveBtnComp?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { key: 'saveBtn', role: 'saveBtn', ...saveBtnComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='e.g. Save'
                />
            </div>

            <Separator />

            <SimpleFieldConfigs
                component={fullNameComp as ItemGroupComponent}
                onChange={(newComp) => {
                    if (newComp === undefined) {
                        onRemoveField('fullName');
                        return;
                    }
                    onChange(newComp);
                }}
                id='fullName'
                fieldName='Full name'
                selectedLanguage={selectedLanguage}
            />


            <SimpleFieldConfigs
                component={companyComp as ItemGroupComponent}
                onChange={(newComp) => {
                    if (newComp === undefined) {
                        onRemoveField('company');
                        return;
                    }
                    onChange(newComp);
                }}
                id='company'
                fieldName='Company name'
                selectedLanguage={selectedLanguage}
            />

            <SimpleFieldConfigs
                component={emailComp as ItemGroupComponent}
                onChange={(newComp) => {
                    if (newComp === undefined) {
                        onRemoveField('email');
                        return;
                    }
                    onChange(newComp);
                }}
                id='email'
                fieldName='Email'
                selectedLanguage={selectedLanguage}
            />

            <SimpleFieldConfigs
                component={phoneComp as ItemGroupComponent}
                onChange={(newComp) => {
                    if (newComp === undefined) {
                        onRemoveField('phone');
                        return;
                    }
                    onChange(newComp);
                }}
                id='phone'
                fieldName='Phone'
                selectedLanguage={selectedLanguage}
            />

            <Separator />

            {renderAddressFields()}



        </div>
    );
};

export default ContactForm;
