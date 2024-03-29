import React, { useEffect, useState } from 'react';
import { isItemGroupComponent, ItemComponent, ItemGroupComponent } from 'survey-engine/data_types/survey-item-component';
import { ResponseItem } from 'survey-engine/data_types/response';
import { CommonResponseComponentProps, getClassName, getLocaleStringTextByCode } from '../../utils';
import DateInput from '../DateInput/DateInput';
import TextInput from './TextInput';
import NumberInput from './NumberInput';

import clsx from 'clsx';
import { renderFormattedContent } from '../../renderUtils';
import ClozeQuestion from './ClozeQuestion';
import Time from './Time';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SingleChoiceGroupProps extends CommonResponseComponentProps {
    showOptionKey?: boolean;
}


const SingleChoiceGroup: React.FC<SingleChoiceGroupProps> = (props) => {
    const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
    const [touched, setTouched] = useState(false);

    const [subResponseCache, setSubResponseCache] = useState<Array<ResponseItem>>(
        (props.prefill && props.prefill.items) ? [...props.prefill.items] : []
    );

    useEffect(() => {
        if (touched) {
            const timer = setTimeout(() => {
                props.responseChanged(response);
            }, 200);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);


    const handleSelectionChange = (value: string) => {
        const key = value;
        onOptionSelected(key);
    };

    const onOptionSelected = (key: string) => {
        setTouched(true);
        setResponse(prev => {
            if (!prev) {
                return {
                    key: props.compDef.key ? props.compDef.key : 'no key found',
                    items: [{ key: key }]
                }
            }
            const subResp = subResponseCache.find(sr => sr.key === key);
            return {
                ...prev,
                items: [
                    subResp ? subResp : { key }
                ]
            }
        });
    }

    const setResponseForKey = (key: string | undefined) => (response: ResponseItem | undefined) => {
        if (!key || !props.compDef.key) { return; }
        setTouched(true);

        if (!response) {
            setResponse({ key: props.compDef.key, items: [] });
            setSubResponseCache(prev => {
                const ind = prev.findIndex(pr => pr.key === key);
                if (ind < 0) {
                    return prev;
                }
                prev.splice(ind, 1);
                return [...prev]
            })
        } else {
            setResponse({ key: props.compDef.key, items: [{ ...response }] });
            setSubResponseCache(prev => {
                const ind = prev.findIndex(pr => pr.key === key);
                if (ind < 0) {
                    prev.push(response);
                }
                else {
                    prev[ind] = { ...response };
                }
                return [...prev];
            })
        }
    }

    const getSelectedItem = (): ResponseItem | undefined => {
        if (!response || !response.items || response.items.length < 1) {
            return undefined;
        }
        return response.items[0];
    }

    const getSelectedKey = (): string | undefined => {
        if (!response || !response.items || response.items.length < 1) {
            return '';
        }
        return response.items[0].key;
    }

    const renderResponseOption = (option: ItemComponent, isLast: boolean): React.ReactNode => {
        if (option.displayCondition === false) {
            return null;
        }
        const prefill = getSelectedItem();
        const optionKey = props.parentKey + '.' + option.key;

        const isDisabled = option.disabled === true;

        const optionClassName = getClassName(option.style);

        let labelComponent = <p>{'loading...'}</p>
        let ariaLabel: string | undefined = undefined;
        if (isItemGroupComponent(option)) {
            switch (option.role) {
                // TODO: handle composite option types, when contains different inputs
                case 'option':
                    labelComponent = <div
                        className="grow cursor-pointer"
                    >
                        {renderFormattedContent(option, props.languageCode, 'cursor-pointer', props.dateLocales)}
                    </div>
                    break;
                case 'cloze':
                    ariaLabel = option.key;
                    labelComponent = <ClozeQuestion
                        parentKey={optionKey}
                        key={option.key}
                        compDef={option}
                        prefill={(prefill && prefill.key === option.key) ? prefill : undefined}
                        languageCode={props.languageCode}
                        responseChanged={setResponseForKey(option.key)}
                        disabled={isDisabled}
                        dateLocales={props.dateLocales}
                    />;
                    break;
            }
        } else {
            // Simplified option type (no styled text, single input)
            switch (option.role) {
                case 'option':
                    labelComponent = <div className="grow" >
                        {getLocaleStringTextByCode(option.content, props.languageCode)}
                    </div>
                    break;
                case 'input':
                    ariaLabel = getLocaleStringTextByCode(option.content, props.languageCode);
                    labelComponent =
                        <TextInput
                            parentKey={props.parentKey}
                            key={option.key}
                            compDef={option}
                            prefill={(prefill && prefill.key === option.key) ? prefill : undefined}
                            languageCode={props.languageCode}
                            responseChanged={setResponseForKey(option.key)}
                            updateDelay={5}
                            disabled={isDisabled}
                            dateLocales={props.dateLocales}
                        />;
                    break;
                case 'numberInput':
                    ariaLabel = getLocaleStringTextByCode(option.content, props.languageCode);
                    labelComponent =
                        <NumberInput
                            parentKey={props.parentKey}
                            key={option.key}
                            compDef={option}
                            prefill={(prefill && prefill.key === option.key) ? prefill : undefined}
                            languageCode={props.languageCode}
                            responseChanged={setResponseForKey(option.key)}
                            ignoreClassName={optionClassName !== undefined}
                            dateLocales={props.dateLocales}
                        />;
                    break;
                case 'timeInput':
                    ariaLabel = getLocaleStringTextByCode(option.content, props.languageCode);
                    labelComponent =
                        <Time
                            parentKey={props.parentKey}
                            key={option.key}
                            compDef={option}
                            prefill={(prefill && prefill.key === option.key) ? prefill : undefined}
                            languageCode={props.languageCode}
                            responseChanged={setResponseForKey(option.key)}
                            ignoreClassName={optionClassName !== undefined}
                            dateLocales={props.dateLocales}
                        />;
                    break;
                case 'dateInput':
                    ariaLabel = getLocaleStringTextByCode(option.content, props.languageCode);
                    labelComponent = <DateInput
                        parentKey={optionKey}
                        key={option.key}
                        compDef={option}
                        prefill={(prefill && prefill.key === option.key) ? prefill : undefined}
                        languageCode={props.languageCode}
                        responseChanged={setResponseForKey(option.key)}
                        openCalendar={touched && getSelectedKey() === option.key}
                        disabled={isDisabled}
                        dateLocales={props.dateLocales}
                    />;
                    break;
                default:
                    labelComponent = <p key={option.key}>role inside single choice group not implemented yet: {option.role}</p>;
            }
        }

        if (!option.key) {
            return <p>ERROR: single choice option key missing</p>
        }

        return (<Label className={clsx(
            "flex items-center gap-2",
            'px-[--survey-card-px-sm] sm:px-[--survey-card-px] py-1.5',
            'hover:bg-black/5',
            'font-normal text-base',
            {
                'cursor-not-allowed opacity-50': isDisabled,
                'cursor-pointer': !isDisabled,
            },
            optionClassName,
        )}
            htmlFor={optionKey + '-radio'}
            key={option.key}
        >

            {props.showOptionKey ?
                <span className="text-primary-600 me-2">{option.key}</span>
                : null}

            <RadioGroupItem
                value={option.key}
                id={optionKey + '-radio'}
                aria-label={ariaLabel}
                className='bg-background size-5'
                disabled={isDisabled}
            />

            {labelComponent}

        </Label>)
    }

    if (!(props.compDef as ItemGroupComponent).items) {
        return <p>ERROR: single choice options missing</p>
    }

    return (
        <RadioGroup
            id={props.parentKey}
            aria-label="single choice options"
            className=' flex flex-col py-4 gap-0'
            value={getSelectedKey()}
            onValueChange={handleSelectionChange}
        >
            {
                (props.compDef as ItemGroupComponent).items.map(
                    (option, index) => renderResponseOption(option, (props.compDef as ItemGroupComponent).items.length - 1 === index)
                )
            }
        </RadioGroup>
    );
};

export default SingleChoiceGroup;
