import { Survey } from "survey-engine/data_types";

export abstract class SurveyStorage {
    public static debug = true;
    public static storedSurveys: StoredSurvey[];

    public static readFromLocalStorage = () => {
        this.debug && console.log('Reading from local storage');
        let surveyStorageString = localStorage.getItem('SurveyStorage');
        this.storedSurveys = [];
        try {
            if (surveyStorageString) {
                const json = JSON.parse(surveyStorageString);
                if (json.storedSurveys) {
                    this.storedSurveys = json.storedSurveys.map((s: any) => new StoredSurvey(s.id, s.survey, new Date(s.date)));
                }
            }
        } catch (error) {
            console.error('Error parsing SurveyStorage:', error);
        }
    }

    public static saveToLocalStorage = () => {
        this.debug && console.log('Saving to local storage');
        let surveyStorageString = JSON.stringify({ storedSurveys: this.storedSurveys });
        localStorage.setItem('SurveyStorage', surveyStorageString);
    }

    public static updateSurvey = (updatedStoredSurvey: StoredSurvey) => {
        this.debug && console.log('Updating survey in storage with id:', updatedStoredSurvey.id);
        this.storedSurveys = this.storedSurveys.filter(s => s.id !== updatedStoredSurvey.id);
        this.storedSurveys.push(updatedStoredSurvey);

    }

    public static getRecentlyEditedSurveys = (): StoredSurvey[] => {
        let sortedSurveys = this.storedSurveys.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
        return sortedSurveys;
    }

    public static getMostRecentlyEditedSurvey = (): StoredSurvey | undefined => {
        let res = this.getRecentlyEditedSurveys();
        return res.length > 0 ? res[0] : undefined;
    }

    public static removeSurvey = (storedSurvey: StoredSurvey) => {
        this.debug && console.log('Removing survey in storage with id:', storedSurvey.id);
        this.storedSurveys = this.storedSurveys.filter(s => s.id !== storedSurvey.id);
    }
}

export class StoredSurvey {
    id: string;
    survey: Survey;
    lastUpdated: Date;

    constructor(id: string, survey: Survey, date: Date) {
        this.survey = survey;
        this.lastUpdated = date;
        this.id = id;
    }

    toJSON = (): any => {
        return {
            id: this.id,
            survey: this.survey,
            date: this.lastUpdated.toISOString(),
        };
    }
}
