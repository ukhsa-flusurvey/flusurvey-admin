import { flagKeySchema, flagValueSchema } from "@/utils/server/types/flagValidation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";


const KeyValueEditorForm = (props: {
    initialValue?: { key: string; value: string; };
    onSave: (key: string, value: string) => void;
    onCancel: () => void;
    usedKeys: string[];
}) => {
    const isNewFlag = props.initialValue === undefined;

    const schema = useMemo(() => {
        return z.object({
            key: flagKeySchema.refine((key) => {
                if (!isNewFlag) return true; // editing: key is read-only and already unique
                return !props.usedKeys.includes(key);
            }, {
                message: 'This key is already in use',
            }),
            value: flagValueSchema,
        });
    }, [isNewFlag, props.usedKeys]);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            key: props.initialValue?.key ?? '',
            value: props.initialValue?.value ?? '',
        },
        mode: 'onChange',
    });

    const onSubmit = (values: z.infer<typeof schema>) => {
        if (values.key === props.initialValue?.key && values.value === props.initialValue?.value) {
            props.onCancel();
            return;
        }
        props.onSave(values.key, values.value);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>

                <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Key</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    readOnly={props.initialValue !== undefined}
                                    className='font-mono text-xs'
                                />
                            </FormControl>
                            {props.initialValue !== undefined && (
                                <FormDescription>
                                    Key cannot be changed when editing existing flags
                                </FormDescription>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className='font-mono text-xs'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex justify-end gap-2'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={props.onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        disabled={form.formState.isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default KeyValueEditorForm;
