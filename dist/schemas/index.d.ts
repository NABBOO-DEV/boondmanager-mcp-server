import { z } from "zod";
export declare const SearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const ResourceSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    keywordsType: z.ZodOptional<z.ZodEnum<{
        firstName: "firstName";
        lastName: "lastName";
        title: "title";
        reference: "reference";
        resumeTd: "resumeTd";
        fullName: "fullName";
        strictFullName: "strictFullName";
        emails: "emails";
        titleSkills: "titleSkills";
        phones: "phones";
        resume: "resume";
        td: "td";
    }>>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    resourceStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    excludeResourceStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    resourceTypes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    excludeResourceTypes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    activityAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    expertiseAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodString>>;
    experiences: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    trainings: z.ZodOptional<z.ZodArray<z.ZodString>>;
    mobilityAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    languages: z.ZodOptional<z.ZodArray<z.ZodString>>;
    flags: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    period: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    providerCompanies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    coordinates: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    geoDistance: z.ZodOptional<z.ZodNumber>;
    excludeManager: z.ZodOptional<z.ZodBoolean>;
    shields: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        minimum: "minimum";
        uncomplete: "uncomplete";
        complete: "complete";
    }>>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const CandidateSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    keywordsType: z.ZodOptional<z.ZodEnum<{
        firstName: "firstName";
        lastName: "lastName";
        title: "title";
        reference: "reference";
        resumeTd: "resumeTd";
        fullName: "fullName";
        strictFullName: "strictFullName";
        emails: "emails";
        titleSkills: "titleSkills";
        phones: "phones";
        resume: "resume";
        td: "td";
    }>>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    perimeterManagersType: z.ZodOptional<z.ZodEnum<{
        main: "main";
        hr: "hr";
    }>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    candidateStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    candidateTypes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    contractTypes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    availabilityTypes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    activityAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    expertiseAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodString>>;
    experiences: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    trainings: z.ZodOptional<z.ZodArray<z.ZodString>>;
    mobilityAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    languages: z.ZodOptional<z.ZodArray<z.ZodString>>;
    evaluations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sources: z.ZodOptional<z.ZodArray<z.ZodString>>;
    flags: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    period: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    providerCompanies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    coordinates: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    geoDistance: z.ZodOptional<z.ZodNumber>;
    shields: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        minimum: "minimum";
        uncomplete: "uncomplete";
        complete: "complete";
    }>>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const ContactSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    keywordsType: z.ZodOptional<z.ZodEnum<{
        firstName: "firstName";
        lastName: "lastName";
        default: "default";
        fullName: "fullName";
        strictFullName: "strictFullName";
        emails: "emails";
        phones: "phones";
        companyFullName: "companyFullName";
        socialNetworks: "socialNetworks";
    }>>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    states: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    companyStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    typesOf: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    origins: z.ZodOptional<z.ZodArray<z.ZodString>>;
    activityAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    expertiseAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodString>>;
    influencers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    flags: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    period: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    completeness: z.ZodOptional<z.ZodArray<z.ZodString>>;
    shields: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        minimum: "minimum";
        uncomplete: "uncomplete";
        complete: "complete";
    }>>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const CompanySearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    keywordsType: z.ZodOptional<z.ZodEnum<{
        name: "name";
        default: "default";
        emails: "emails";
        phones: "phones";
        socialNetworks: "socialNetworks";
    }>>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    states: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    expertiseAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    origins: z.ZodOptional<z.ZodArray<z.ZodString>>;
    influencers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    flags: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    period: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    shields: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        minimum: "minimum";
        uncomplete: "uncomplete";
        complete: "complete";
    }>>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const OpportunitySearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    perimeterManagersType: z.ZodOptional<z.ZodEnum<{
        main: "main";
        hr: "hr";
    }>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    opportunityStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    opportunityTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    positioningStates: z.ZodOptional<z.ZodArray<z.ZodString>>;
    expertiseAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    activityAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodString>>;
    places: z.ZodOptional<z.ZodArray<z.ZodString>>;
    durations: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    origins: z.ZodOptional<z.ZodArray<z.ZodString>>;
    flags: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    period: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    shields: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        minimum: "minimum";
        uncomplete: "uncomplete";
        complete: "complete";
    }>>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const ProjectSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    projectStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    projectTypes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    companies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    expertiseAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    activityAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    flags: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    period: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const EntityIdSchema: z.ZodString;
export declare const IdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strict>;
export declare const DocumentIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strict>;
export declare const IdTabSchema: z.ZodObject<{
    id: z.ZodString;
    tab: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const stateField: (entity: string, baseDescription: string) => z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
export declare const CandidateCreateSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email1: z.ZodOptional<z.ZodString>;
    phone1: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
    mainSkills: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const PositioningUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    state: z.ZodOptional<z.ZodNumber>;
    stateReasonTypeOf: z.ZodOptional<z.ZodNumber>;
    stateReasonDetail: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    informationComments: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const CandidateUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email1: z.ZodOptional<z.ZodString>;
    phone1: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
    mainSkills: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ResourceCreateSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email1: z.ZodOptional<z.ZodString>;
    phone1: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ResourceUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email1: z.ZodOptional<z.ZodString>;
    phone1: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ResourceTechnicalDataUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    mode: z.ZodDefault<z.ZodEnum<{
        replace: "replace";
        merge: "merge";
    }>>;
    title: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodString>;
    experience: z.ZodOptional<z.ZodNumber>;
    training: z.ZodOptional<z.ZodString>;
    expertiseAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    activityAreas: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
        tool: z.ZodString;
        level: z.ZodNumber;
    }, z.core.$strict>>>;
    languages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        language: z.ZodString;
        level: z.ZodEnum<{
            scolaire: "scolaire";
            intermediaire: "intermediaire";
            courant: "courant";
            bilingue: "bilingue";
            maternel: "maternel";
        }>;
    }, z.core.$strict>>>;
    diplomas: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const ReferenceCreateSchema: z.ZodObject<{
    resourceId: z.ZodString;
    title: z.ZodString;
    company: z.ZodString;
    description: z.ZodString;
    location: z.ZodOptional<z.ZodString>;
    startMonth: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    startYear: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    endMonth: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    endYear: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    skills: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ReferenceUpdateSchema: z.ZodObject<{
    resourceId: z.ZodString;
    referenceId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    startMonth: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    startYear: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    endMonth: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    endYear: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    skills: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ReferenceIdSchema: z.ZodObject<{
    resourceId: z.ZodString;
    referenceId: z.ZodString;
}, z.core.$strict>;
export declare const ContactCreateSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email1: z.ZodOptional<z.ZodString>;
    phone1: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    companyId: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ContactUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email1: z.ZodOptional<z.ZodString>;
    phone1: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const CompanyCreateSchema: z.ZodObject<{
    name: z.ZodString;
    email1: z.ZodOptional<z.ZodString>;
    phone1: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    siret: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const CompanyUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    email1: z.ZodOptional<z.ZodString>;
    phone1: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    siret: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const OpportunityCreateSchema: z.ZodObject<{
    typeOf: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    companyId: z.ZodOptional<z.ZodString>;
    contactId: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
    criteria: z.ZodOptional<z.ZodString>;
    expertiseArea: z.ZodOptional<z.ZodString>;
    turnoverEstimatedExcludingTax: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    poleId: z.ZodOptional<z.ZodString>;
    hrManagerId: z.ZodOptional<z.ZodString>;
    mainManagerId: z.ZodOptional<z.ZodString>;
    agencyId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
}, z.core.$strict>;
export declare const OpportunityUpdateSchema: z.ZodObject<{
    typeOf: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    companyId: z.ZodOptional<z.ZodString>;
    contactId: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
    criteria: z.ZodOptional<z.ZodString>;
    expertiseArea: z.ZodOptional<z.ZodString>;
    turnoverEstimatedExcludingTax: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    poleId: z.ZodOptional<z.ZodString>;
    hrManagerId: z.ZodOptional<z.ZodString>;
    mainManagerId: z.ZodOptional<z.ZodString>;
    agencyId: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ActionSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    candidateId: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    contactId: z.ZodOptional<z.ZodString>;
    companyId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const ActionCreateSchema: z.ZodObject<{
    typeOf: z.ZodUnion<readonly [z.ZodCoercedNumber<unknown>, z.ZodString]>;
    title: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    candidateId: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    contactId: z.ZodOptional<z.ZodString>;
    opportunityId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    companyId: z.ZodOptional<z.ZodString>;
    positioningId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ActionUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    typeOf: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    title: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ResourceTimesheetSchema: z.ZodObject<{
    resourceId: z.ZodString;
    month: z.ZodOptional<z.ZodNumber>;
    year: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export declare const TimesheetSearchSchema: z.ZodObject<{
    startMonth: z.ZodString;
    endMonth: z.ZodString;
    keywords: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const TimesheetGetSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strict>;
export declare const ProjectCreateSchema: z.ZodObject<{
    name: z.ZodString;
    companyId: z.ZodOptional<z.ZodString>;
    contactId: z.ZodOptional<z.ZodString>;
    opportunityId: z.ZodOptional<z.ZodString>;
    typeOf: z.ZodOptional<z.ZodNumber>;
    state: z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ProjectUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    typeOf: z.ZodOptional<z.ZodNumber>;
    state: z.ZodOptional<z.ZodPreprocess<z.ZodCoercedNumber<unknown>>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const InvoiceCreateSchema: z.ZodObject<{
    reference: z.ZodOptional<z.ZodString>;
    orderId: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodNumber>;
    invoiceDate: z.ZodOptional<z.ZodString>;
    expectedPaymentDate: z.ZodOptional<z.ZodString>;
    amountExcludingTax: z.ZodOptional<z.ZodNumber>;
    taxRate: z.ZodOptional<z.ZodNumber>;
    invoiceRecords: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    invoicePayments: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const InvoiceUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodNumber>;
    invoiceDate: z.ZodOptional<z.ZodString>;
    expectedPaymentDate: z.ZodOptional<z.ZodString>;
    amountExcludingTax: z.ZodOptional<z.ZodNumber>;
    taxRate: z.ZodOptional<z.ZodNumber>;
    invoiceRecords: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    invoicePayments: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const InvoiceSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    companyId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    period: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const OrderCreateSchema: z.ZodObject<{
    reference: z.ZodOptional<z.ZodString>;
    companyId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodNumber>;
    orderDate: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    amountExcludingTax: z.ZodOptional<z.ZodNumber>;
    customerAgreement: z.ZodOptional<z.ZodBoolean>;
    schedules: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const OrderUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodNumber>;
    orderDate: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    amountExcludingTax: z.ZodOptional<z.ZodNumber>;
    customerAgreement: z.ZodOptional<z.ZodBoolean>;
    schedules: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const OrderSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    companyId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const DeliverySearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    companyId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const AbsenceCreateSchema: z.ZodObject<{
    resourceId: z.ZodString;
    typeOf: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
    duration: z.ZodOptional<z.ZodNumber>;
    workUnitTypeReference: z.ZodOptional<z.ZodNumber>;
    absencesPeriods: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    state: z.ZodOptional<z.ZodNumber>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const AbsenceUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodNumber>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const AbsenceSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    startMonth: z.ZodOptional<z.ZodString>;
    endMonth: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const ExpenseCreateSchema: z.ZodObject<{
    resourceId: z.ZodString;
    projectId: z.ZodOptional<z.ZodString>;
    typeOf: z.ZodOptional<z.ZodString>;
    term: z.ZodOptional<z.ZodString>;
    expenseDate: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodOptional<z.ZodString>;
    exchangeRateAgency: z.ZodOptional<z.ZodNumber>;
    state: z.ZodOptional<z.ZodNumber>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ExpenseUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    term: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    exchangeRateAgency: z.ZodOptional<z.ZodNumber>;
    state: z.ZodOptional<z.ZodNumber>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ExpenseSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const ProductCreateSchema: z.ZodObject<{
    name: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
    unitPrice: z.ZodOptional<z.ZodNumber>;
    taxRate: z.ZodOptional<z.ZodNumber>;
    state: z.ZodOptional<z.ZodNumber>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const ProductUpdateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    reference: z.ZodOptional<z.ZodString>;
    unitPrice: z.ZodOptional<z.ZodNumber>;
    taxRate: z.ZodOptional<z.ZodNumber>;
    state: z.ZodOptional<z.ZodNumber>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const PositioningCreateSchema: z.ZodObject<{
    candidateId: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    opportunityId: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodNumber>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const PositioningSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    candidateId: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    opportunityId: z.ZodOptional<z.ZodString>;
    companyId: z.ZodOptional<z.ZodString>;
    contactId: z.ZodOptional<z.ZodString>;
    productId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const PaymentSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    invoiceId: z.ZodOptional<z.ZodString>;
    purchaseId: z.ZodOptional<z.ZodString>;
    companyId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const AdvantageSearchSchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    resourceId: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const ValidationSearchSchema: z.ZodObject<{
    startMonth: z.ZodString;
    endMonth: z.ZodString;
    keywords: z.ZodOptional<z.ZodString>;
    documentTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        absencesReport: "absencesReport";
        timesReport: "timesReport";
        expensesReport: "expensesReport";
    }>>>;
    resourceTypes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    validationStates: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        waitingForValidation: "waitingForValidation";
        validated: "validated";
        rejected: "rejected";
    }>>>;
    validationAlerts: z.ZodOptional<z.ZodBoolean>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const NotificationSearchSchema: z.ZodObject<{
    category: z.ZodEnum<{
        activity: "activity";
        thread: "thread";
        corporate: "corporate";
    }>;
    state: z.ZodOptional<z.ZodEnum<{
        new: "new";
        read: "read";
    }>>;
    parentType: z.ZodOptional<z.ZodArray<z.ZodString>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const ReportingCompaniesSchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodString;
    companiesStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    maxCompanies: z.ZodOptional<z.ZodNumber>;
    showPercentage: z.ZodOptional<z.ZodBoolean>;
    companies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    keywords: z.ZodOptional<z.ZodString>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    periodDynamic: z.ZodOptional<z.ZodString>;
    periodDynamicParameters: z.ZodOptional<z.ZodString>;
    scorecards: z.ZodOptional<z.ZodArray<z.ZodString>>;
    useCache: z.ZodOptional<z.ZodEnum<{
        withCache: "withCache";
        withoutCache: "withoutCache";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const ReportingProjectsSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    projectTypes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    projectStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    maxProjects: z.ZodOptional<z.ZodNumber>;
    resources: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    projects: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    contacts: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    companies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    keywords: z.ZodOptional<z.ZodString>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    periodDynamic: z.ZodOptional<z.ZodString>;
    periodDynamicParameters: z.ZodOptional<z.ZodString>;
    scorecards: z.ZodOptional<z.ZodArray<z.ZodString>>;
    useCache: z.ZodOptional<z.ZodEnum<{
        withCache: "withCache";
        withoutCache: "withoutCache";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const ReportingResourcesSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    reportingCategory: z.ZodOptional<z.ZodEnum<{
        showByResources: "showByResources";
        showByPeriods: "showByPeriods";
    }>>;
    maxResources: z.ZodOptional<z.ZodNumber>;
    resourceTypes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    resourceStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    period: z.ZodOptional<z.ZodString>;
    resources: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    projects: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    contacts: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    companies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    keywords: z.ZodOptional<z.ZodString>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    periodDynamic: z.ZodOptional<z.ZodString>;
    periodDynamicParameters: z.ZodOptional<z.ZodString>;
    scorecards: z.ZodOptional<z.ZodArray<z.ZodString>>;
    useCache: z.ZodOptional<z.ZodEnum<{
        withCache: "withCache";
        withoutCache: "withoutCache";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const ReportingSynthesisSchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodString>;
    reportingType: z.ZodOptional<z.ZodEnum<{
        realData: "realData";
        targetsData: "targetsData";
    }>>;
    reportingCategory: z.ZodOptional<z.ZodEnum<{
        commercialSynthesis: "commercialSynthesis";
        humanResourcesSynthesis: "humanResourcesSynthesis";
        recruitmentSynthesis: "recruitmentSynthesis";
        activityExpensesSynthesis: "activityExpensesSynthesis";
        billingSynthesis: "billingSynthesis";
        globalSynthesis: "globalSynthesis";
    }>>;
    period: z.ZodOptional<z.ZodString>;
    resources: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    projects: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    contacts: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    companies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    compareIndicators: z.ZodOptional<z.ZodArray<z.ZodString>>;
    compareIndicatorsPeriod: z.ZodOptional<z.ZodString>;
    keywords: z.ZodOptional<z.ZodString>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    periodDynamic: z.ZodOptional<z.ZodString>;
    periodDynamicParameters: z.ZodOptional<z.ZodString>;
    scorecards: z.ZodOptional<z.ZodArray<z.ZodString>>;
    useCache: z.ZodOptional<z.ZodEnum<{
        withCache: "withCache";
        withoutCache: "withoutCache";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const ReportingProductionPlansSchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodString;
    resourceTypes: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    resourceStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    positioningStates: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    positioningPeriod: z.ZodOptional<z.ZodEnum<{
        created: "created";
        running: "running";
    }>>;
    showContracts: z.ZodOptional<z.ZodBoolean>;
    projects: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    contacts: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    companies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    keywords: z.ZodOptional<z.ZodString>;
    perimeterManagers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterAgencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterPoles: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterBusinessUnits: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    perimeterDynamic: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        agencies: "agencies";
        poles: "poles";
        data: "data";
        businessUnits: "businessUnits";
        managers: "managers";
    }>>>;
    narrowPerimeter: z.ZodOptional<z.ZodBoolean>;
    periodDynamic: z.ZodOptional<z.ZodString>;
    periodDynamicParameters: z.ZodOptional<z.ZodString>;
    scorecards: z.ZodOptional<z.ZodArray<z.ZodString>>;
    useCache: z.ZodOptional<z.ZodEnum<{
        withCache: "withCache";
        withoutCache: "withoutCache";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare const DictionaryGetSchema: z.ZodObject<{
    dictionaryType: z.ZodString;
}, z.core.$strict>;
export declare const DocumentParentTypes: readonly ["action", "resourceResume", "candidateResume", "resource", "candidate", "expensesReport", "timesReport", "absencesReport", "payment", "company", "project", "order", "product", "purchase", "delivery", "groupment", "inactivity", "positioning", "followeddocument", "appentity", "contract", "invoice", "providerinvoice"];
export declare const DocumentCreateSchema: z.ZodObject<{
    parentType: z.ZodEnum<{
        resource: "resource";
        candidate: "candidate";
        project: "project";
        company: "company";
        positioning: "positioning";
        product: "product";
        invoice: "invoice";
        order: "order";
        action: "action";
        absencesReport: "absencesReport";
        timesReport: "timesReport";
        expensesReport: "expensesReport";
        resourceResume: "resourceResume";
        candidateResume: "candidateResume";
        payment: "payment";
        purchase: "purchase";
        delivery: "delivery";
        groupment: "groupment";
        inactivity: "inactivity";
        followeddocument: "followeddocument";
        appentity: "appentity";
        contract: "contract";
        providerinvoice: "providerinvoice";
    }>;
    parentId: z.ZodNumber;
    fileUrl: z.ZodString;
    parsing: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type SearchInput = z.infer<typeof SearchSchema>;
export type ResourceSearchInput = z.infer<typeof ResourceSearchSchema>;
export type CandidateSearchInput = z.infer<typeof CandidateSearchSchema>;
export type ContactSearchInput = z.infer<typeof ContactSearchSchema>;
export type CompanySearchInput = z.infer<typeof CompanySearchSchema>;
export type OpportunitySearchInput = z.infer<typeof OpportunitySearchSchema>;
export type ProjectSearchInput = z.infer<typeof ProjectSearchSchema>;
export type IdInput = z.infer<typeof IdSchema>;
export type IdTabInput = z.infer<typeof IdTabSchema>;
export type ResourceTimesheetInput = z.infer<typeof ResourceTimesheetSchema>;
export type TimesheetSearchInput = z.infer<typeof TimesheetSearchSchema>;
export type TimesheetGetInput = z.infer<typeof TimesheetGetSchema>;
export type DictionaryGetInput = z.infer<typeof DictionaryGetSchema>;
export type ResourceTechnicalDataUpdateInput = z.infer<typeof ResourceTechnicalDataUpdateSchema>;
export type ReferenceCreateInput = z.infer<typeof ReferenceCreateSchema>;
export type ReferenceUpdateInput = z.infer<typeof ReferenceUpdateSchema>;
export type ReferenceIdInput = z.infer<typeof ReferenceIdSchema>;
export type DocumentCreateInput = z.infer<typeof DocumentCreateSchema>;
export type ReportingCompaniesInput = z.infer<typeof ReportingCompaniesSchema>;
export type ReportingProjectsInput = z.infer<typeof ReportingProjectsSchema>;
export type ReportingResourcesInput = z.infer<typeof ReportingResourcesSchema>;
export type ReportingSynthesisInput = z.infer<typeof ReportingSynthesisSchema>;
export type ReportingProductionPlansInput = z.infer<typeof ReportingProductionPlansSchema>;
//# sourceMappingURL=index.d.ts.map