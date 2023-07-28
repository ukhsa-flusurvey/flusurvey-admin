'use client';

import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { BsChevronExpand, BsCheck } from 'react-icons/bs';

interface SelectProps {
    id: string;
    options: Array<{
        value: string;
        label: string;
    }>;
    value: string;
    label: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const Select: React.FC<SelectProps> = (props) => {
    return (
        <Listbox
            value={props.value} onChange={props.onChange}>

            <div className='relative'>
                <label
                    htmlFor={props.id}
                    className='block text-sm font-medium text-gray-700 mb-1'
                >
                    {props.label}
                </label>
                <Listbox.Button
                    id={props.id}
                    className='flex items-center rounded border border-gray-300 px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-700/50'
                >
                    {props.value.length ? props.value : <span className='text-gray-600'>{props.placeholder}</span>}
                    <span
                        className='text-gray-700 ms-auto'
                    >
                        <BsChevronExpand />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options
                        className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

                        {props.options.map((option) => (
                            <Listbox.Option
                                key={option.value}
                                value={option.value}
                                className='relative cursor-default select-none pl-10 pr-3 py-2 ui-active:text-white ui-active:bg-cyan-700  ui-selected:bg-cyan-700 ui-selected:text-white'
                            >
                                {({ selected }) => (
                                    <>
                                        {selected ? (
                                            <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                                                <BsCheck className='h-5 w-5 text-white' aria-hidden="true" />
                                            </span>
                                        ) : null}
                                        <span className='ui-selected:font-bold'>
                                            {option.label}
                                        </span>

                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

export default Select;
