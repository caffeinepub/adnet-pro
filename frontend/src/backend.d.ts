import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AdvertisingRegistration {
    yearsOfExperience: bigint;
    principal: Principal;
    areaOfExpertise: AreaOfExpertise;
    professionalDesignation: ProfessionalDesignation;
    workReelURL: string;
    name: string;
    currentCity: string;
    availability: Array<Time>;
    industryReferences?: string;
}
export type Time = bigint;
export interface UserProfile {
    areaOfExpertise?: AreaOfExpertise;
    professionalDesignation?: ProfessionalDesignation;
    name: string;
    currentCity: string;
}
export enum AreaOfExpertise {
    pr = "pr",
    media = "media",
    creative = "creative",
    production = "production",
    other = "other",
    research = "research",
    strategy = "strategy",
    postProduction = "postProduction",
    digital = "digital",
    accountManagement = "accountManagement"
}
export enum ProfessionalDesignation {
    other = "other",
    editor = "editor",
    artDirector = "artDirector",
    director = "director",
    designer = "designer",
    mediaPlanner = "mediaPlanner",
    accountExecutive = "accountExecutive",
    producer = "producer",
    cinematographer = "cinematographer",
    strategist = "strategist",
    copywriter = "copywriter"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProfessionalRegistration(user: Principal): Promise<AdvertisingRegistration | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVerifiedMembers(): Promise<Array<Principal>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitProfessionalRegistration(registration: AdvertisingRegistration): Promise<void>;
}
