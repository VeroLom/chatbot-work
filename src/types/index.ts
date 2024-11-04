export enum OptionsType {
    OPTIONS_AUTO,
    OPTIONS_CHOICE,
    OPTIONS_FORM,
    OPTIONS_SUBMIT,
    OPTIONS_FIELDS,
    OPTIONS_NOTICE,
}

interface Dependency {
    optionName: string,
    optionValue: string | number,
}

export interface Option {
    id: number,
    type?: string,
    name: string,
    value: string | number,
    title: string,
    badge?: string,
    image?: string,
    dependency?: Dependency,
}

export interface ChatMessage {
    id: number,
    isUser?: boolean,
    content?: string,
    optionType?: OptionsType,
    options?: Option[],
    delay?: number,
}

export type Field = {
    [name: string]: string | number | boolean | undefined,
}


export interface Action {
    id: number,
    title: string,
    icon?: string,
}

export interface Settings {
    color: string,
    brand: string,
    phone: string,
    address: string,
    requisites: string,
    operator: string,
    subheader: string,
}