
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useContext, useEffect, useState } from "react"
import { SurveyContext } from "../../surveyContext"
import { LocalizedString } from "survey-engine/data_types"
import { getLocalizedString, updateLocalizedString } from "@/utils/getLocalisedString"
import React from "react"
import LanguageSelector from "@/components/LanguageSelector"

const formSchema = z.object({ "name": z.string().max(255), "description": z.string(), "duration_notice": z.string() })

export function SurveyBasicInfoForm() {
    const { survey, setSurvey, selectedLanguage, setSelectedLanguage } = useContext(SurveyContext);
    const currentSurveyProps = survey?.props;

    const initialValues = () => ({
        name: getLocalizedString(currentSurveyProps?.name, selectedLanguage) ?? "",
        description: getLocalizedString(currentSurveyProps?.description, selectedLanguage) ?? "",
        duration_notice: getLocalizedString(currentSurveyProps?.typicalDuration, selectedLanguage) ?? "",
    });

    useEffect(() => {
        form.reset(initialValues());
    }, [selectedLanguage]);

    const form = useForm<z.infer<typeof formSchema>>({
        mode: 'onSubmit',
        resolver: zodResolver(formSchema),
    })


    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        if (survey !== undefined) {
            if (survey.props == undefined) {
                survey.props = {};
            }
            survey.props.name = updateLocalizedString(survey.props.name as LocalizedString[], selectedLanguage, values.name);
            survey.props.description = updateLocalizedString(survey.props.description as LocalizedString[], selectedLanguage, values.description);
            survey.props.typicalDuration = updateLocalizedString(survey.props.typicalDuration as LocalizedString[], selectedLanguage, values.duration_notice);
            setSurvey({ ...survey });
        }
    }

    return (
        <>
            <div className="flex flex-row justify-between grow">
                <div>
                    <h3 className="text-lg font-medium">Basic Info</h3>
                    <p className="text-sm text-muted-foreground">
                        How the survey is represented.
                    </p>
                </div>
                <div className="flex justify-end self-start">
                    <LanguageSelector onLanguageChange={setSelectedLanguage} initialLanguage={selectedLanguage} />
                </div>
            </div>
            <Separator />
            <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="rounded-lg border p-4">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    The display name of the survey.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="rounded-lg border p-4">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    The survey description should be a brief summary of the survey's purpose.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField
                        control={form.control}
                        name="duration_notice"
                        render={({ field }) => (
                            <FormItem className="rounded-lg border p-4">
                                <FormLabel>Duration notice</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    This text will be displayed to the user to indicate the estimated time to complete the survey.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <div className="flex justify-end"><Button type="submit">Save</Button></div>
                </form>
            </Form>
        </>
    )
}
