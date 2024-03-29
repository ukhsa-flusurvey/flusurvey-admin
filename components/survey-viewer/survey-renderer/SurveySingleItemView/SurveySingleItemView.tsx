import React, { useState, useEffect } from 'react';
import { SurveySingleItem, ItemGroupComponent, ResponseItem, ItemComponent, isItemGroupComponent } from 'survey-engine/data_types';
import { getClassName, getItemComponentByRole, getItemComponentsByRole, getLocaleStringTextByCode } from './utils';
import HelpGroup from './SurveyComponents/HelpGroup';
import TextViewComponent from './SurveyComponents/TextViewComponent';
import ErrorComponent from './SurveyComponents/ErrorComponent';
import WarningComponent from './SurveyComponents/WarningComponent';
import ResponseComponent, { CustomSurveyResponseComponent } from './ResponseComponent/ResponseComponent';
import clsx from 'clsx';
import BulletList from './SurveyComponents/BulletList';
import MarkdownComponent from './SurveyComponents/MarkdownComponent';
import { renderFormattedContent } from './renderUtils';

interface SurveySingleItemViewProps {
    renderItem: SurveySingleItem;
    languageCode: string;
    responsePrefill?: ResponseItem;
    responseChanged: (response: ResponseItem | undefined) => void;
    showInvalid?: boolean;
    invalidWarning: string;
    showKeys?: boolean;
    customResponseComponents?: Array<CustomSurveyResponseComponent>;
    dateLocales?: Array<{ code: string, locale: any, format: string }>;
}


const SurveySingleItemView: React.FC<SurveySingleItemViewProps> = (props) => {
    const [response, setResponse] = useState<ResponseItem | undefined>(props.responsePrefill);
    const [touched, setTouched] = useState(false);


    useEffect(() => {
        if (touched) {
            props.responseChanged(response);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    const renderHelpGroup = (): React.ReactNode => {
        if (!props.renderItem.components) { return null; }
        const helpGroup = getItemComponentByRole(props.renderItem.components.items, 'helpGroup') as ItemGroupComponent;
        if (!helpGroup) {
            return null;
        }
        return (
            <HelpGroup
                itemKey={props.renderItem.key.replace('.', '-')}
                componentGroup={helpGroup}
                languageCode={props.languageCode}
            />
        )
    }

    const requiredItem = props.renderItem.validations?.find(val => val.type === 'hard');

    const renderBodyComponents = (): React.ReactNode => {
        if (!props.renderItem.components) { return null; }
        return <React.Fragment>
            {
                props.renderItem.components.items.map((component: ItemComponent, index: number) => {
                    if (component.displayCondition === false) {
                        return null;
                    }
                    switch (component.role) {
                        case 'title':
                            return null;
                        case 'helpGroup':
                            return null;
                        case 'footnote':
                            return null;
                        case 'responseGroup':
                            return <ResponseComponent key={index.toFixed()}
                                itemKey={props.renderItem.key}
                                languageCode={props.languageCode}
                                compDef={component}
                                prefill={props.responsePrefill}
                                isRequired={requiredItem ? true : false}
                                dateLocales={props.dateLocales ? props.dateLocales : []}
                                responseChanged={(response) => {
                                    console.log('new response set', response)
                                    setTouched(true);
                                    setResponse(response);
                                }}
                                showOptionKey={props.showKeys}
                                customResponseComponents={props.customResponseComponents}
                            />
                        case 'text':
                            return <TextViewComponent key={index.toFixed()}
                                compDef={component}
                                languageCode={props.languageCode}
                            />;
                        case 'bullets':
                            return <BulletList key={index.toFixed()}
                                compDef={component}
                                languageCode={props.languageCode}
                            />
                        case 'markdown':
                            return <MarkdownComponent key={index.toFixed()}
                                compDef={component}
                                languageCode={props.languageCode}
                            />;
                        case 'error':
                            return <ErrorComponent key={index.toFixed()}
                                compDef={component}
                                languageCode={props.languageCode}
                            />
                        case 'warning':
                            return <WarningComponent key={index.toFixed()}
                                compDef={component}
                                languageCode={props.languageCode}
                            />
                        default:
                            console.warn('component role not implemented: ' + component.role);
                            return <p key={index.toFixed()}>{component.role} not implemented</p>
                    }
                })
            }
        </React.Fragment>;
    }

    // const titleComp = props.renderItem.components ? getItemComponentTranslationByRole(props.renderItem.components.items, 'title', props.languageCode) : undefined;
    const titleComp = getItemComponentByRole(props.renderItem.components?.items, 'title')

    const renderTitleComp = (): React.ReactNode => {
        if (!titleComp) {
            return null;
        }

        let content = renderFormattedContent(titleComp, props.languageCode, undefined, props.dateLocales ? props.dateLocales : []);

        const description = getLocaleStringTextByCode(titleComp.description, props.languageCode);

        return (
            <legend
                className={
                    clsx(
                        'flex items-center rounded-t w-full',
                        'px-4 sm:px-6 py-2 sm:py-4',
                        'bg-[--survey-card-header-bg]',
                        getClassName(titleComp.style),
                        {
                            'bg-[--survey-card-invalid-bg]': props.showInvalid
                        }
                    )}
            >
                <div className="grow">

                    <span className="m-0 font-bold text-xl">
                        {content}
                        {requiredItem ?
                            <span
                                aria-required="true"
                                className={clsx(
                                    'ms-1',
                                    {
                                        'text-primary': !props.showInvalid,
                                        'text-[--survey-error-text-color]': props.showInvalid
                                    }
                                )}
                            >
                                {'*'}
                            </span> : null}
                    </span>
                    {description ? <p className="m-0 italic">{description} </p> : null}
                </div>

                {renderHelpGroup()}
            </legend >
        )
    }

    const renderFootnote = (): React.ReactNode => {
        if (!props.renderItem.components) { return null; }
        const currentComponents = getItemComponentsByRole(props.renderItem.components.items, 'footnote');
        if (currentComponents.length < 1) {
            return null;
        }

        return currentComponents.map((component: ItemComponent, index: number) => {
            if (component.displayCondition === false) {
                return null;
            }
            return <TextViewComponent
                className={clsx('mt-4')}
                key={index.toFixed()}
                compDef={component}
                languageCode={props.languageCode}
            />
        })
    }

    return (
        <React.Fragment>
            <div
                role='group'
                className={'bg-[--survey-card-bg] rounded-[--survey-card-border-radius] relative'}>
                {props.showKeys ?
                    <span className="text-primary me-2 absolute -top-4 text-xs">{props.renderItem.key}</span>
                    : null}
                <fieldset>
                    {renderTitleComp()}
                    <div className={clsx(
                        //'px-4 sm:px-6 py-4',
                    )}
                    >
                        {renderBodyComponents()}
                    </div>
                    {props.showInvalid ?
                        <p className={clsx(
                            'font-bold',
                            'px-4 sm:px-6 py-4',
                            'bg-[--survey-card-invalid-bg]  m-0 text-[--survey-error-text-color] rounded-b-[--survey-card-border-radius]'
                        )}
                            style={{ fontSize: '1.1875rem' }}
                            role="alert"
                        >
                            {props.invalidWarning}
                        </p>
                        : null}
                </fieldset>
            </div>
            {renderFootnote()}
        </React.Fragment>
    );
};

export default SurveySingleItemView;
