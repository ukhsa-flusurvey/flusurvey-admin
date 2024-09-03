import React, { useEffect, useState } from 'react';
import { ResponseItem } from 'survey-engine/data_types';
import { CommonResponseComponentProps, getClassName, getLocaleStringTextByCode, getStyleValueByKey } from '../../utils';
import clsx from 'clsx';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MultilineTextInputProps extends CommonResponseComponentProps {
}

const MultilineTextInput: React.FC<MultilineTextInputProps> = (props) => {
    const [response, setResponse] = useState<ResponseItem | undefined>(props.prefill);
    const [touched, setTouched] = useState(false);

    const [inputValue, setInputValue] = useState<string>(
        props.prefill && props.prefill.value ? props.prefill.value : ''
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


    const handleInputValueChange = (key: string | undefined) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!key) { return; }
        setTouched(true);

        const value = (event.target as HTMLTextAreaElement).value;

        setInputValue(value);
        setResponse(prev => {
            if (value.length < 1) {
                return undefined;
            }
            if (!prev) {
                return {
                    key: props.compDef.key ? props.compDef.key : 'no key found',
                    value: value
                }
            }
            return {
                ...prev,
                value: value
            }
        })
    };

    const maxLengthValue = getStyleValueByKey(props.compDef.style, 'maxLength');
    const fullKey = [props.parentKey, props.compDef.key].join('.');
    return (
        <div
            className={cn(
                "flex items-start",
                'px-[--survey-card-px-sm] sm:px-[--survey-card-px]',
                getClassName(props.compDef.style))}
        >
            <Label htmlFor={fullKey} className="space-y-2 w-full">
                <span>
                    {getLocaleStringTextByCode(props.compDef.content, props.languageCode)}
                </span>

                <Textarea
                    autoComplete="off"
                    id={fullKey}
                    placeholder={getLocaleStringTextByCode(props.compDef.description, props.languageCode)}
                    value={inputValue}
                    maxLength={maxLengthValue ? parseInt(maxLengthValue) : 4000}
                    rows={3}
                    onChange={handleInputValueChange(props.compDef.key)}
                    disabled={props.compDef.disabled !== undefined}
                />
            </Label>
        </div>
    );
};

export default MultilineTextInput;
