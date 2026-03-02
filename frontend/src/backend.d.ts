import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TechnicianResult {
    city: string;
    name: string;
    role: string;
    contactNumber: string;
}
export type Time = bigint;
export interface TechnicianSearchResult {
    otherCityMatches: Array<TechnicianResult>;
    sameCityMatches: Array<TechnicianResult>;
}
export interface TechnicianSearchInput {
    city: string;
    availableFrom: Time;
    requiredRoles: Array<string>;
    availableTo: Time;
}
export interface Director {
    yearsOfExperience: bigint;
    availabilityStart: Time;
    workReelUrl: string;
    fullName: string;
    currentCity: string;
    genreSpecialisation?: string;
    productSpecialisation?: string;
    availabilityEnd: Time;
    industryReference: string;
}
export interface UserProfile {
    yearsOfExperience: bigint;
    industryReferenceEmail: string;
    city: string;
    workReelUrl: string;
    designation: string;
    role: string;
    fullName: string;
    email: string;
    availability: Array<string>;
    tribeCompanyName: string;
    executiveProducers: Array<string>;
    contactNumber: string;
    department: string;
}
export enum TribalLeaderRole {
    director = "director",
    productionHouse = "productionHouse"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Create or update the caller's profile. Requires authenticated user.
     */
    createOrUpdateProfile(profile: UserProfile): Promise<void>;
    /**
     * / Get the caller's own profile (alias required by frontend). Requires authenticated user.
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDirectorRegistration(principal: Principal): Promise<Director | null>;
    /**
     * / Get the caller's own profile. Requires authenticated user.
     */
    getMyProfile(): Promise<UserProfile | null>;
    getTribalLeaderRole(principal: Principal): Promise<TribalLeaderRole | null>;
    /**
     * / Get a specific user's profile. Caller must be the owner or an admin.
     */
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Save the caller's own profile (alias required by frontend). Requires authenticated user.
     */
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Search for available technicians. No authentication required (public search).
     */
    searchTechnicians(searchInput: TechnicianSearchInput): Promise<TechnicianSearchResult>;
    submitDirectorRegistration(director: Director): Promise<void>;
    /**
     * / Submit a director registration using the full UserProfile model. Requires authenticated user.
     */
    submitDirectorRegistrationV2(director: UserProfile): Promise<void>;
    /**
     * / Submit a production house registration. Requires authenticated user.
     */
    submitProductionHouseRegistration(productionHouse: UserProfile): Promise<void>;
    /**
     * / Update only the availability field of the caller's profile. Requires authenticated user.
     */
    updateAvailability(availability: Array<string>): Promise<void>;
}
