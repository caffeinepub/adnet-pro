import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EquipmentVendor {
    id: Principal;
    inventory: Array<string>;
    name: string;
    availability: Array<CalendarAvailability>;
}
export interface CalendarAvailability {
    status: Variant_booked_available_unavailable;
    date: Time;
}
export type Time = bigint;
export interface ShootLocation {
    id: Principal;
    name: string;
    description: string;
    pricing: bigint;
    availability: Array<CalendarAvailability>;
    capacity: bigint;
}
export interface ProductionHouse {
    id: Principal;
    name: string;
    verifiedConnections: Array<Principal>;
    companyInfo: string;
}
export interface UserProfile {
    name: string;
    profileType: Variant_professional_vendor_productionHouse_location;
}
export interface AdvertisingProfessional {
    id: Principal;
    portfolio: Array<string>;
    name: string;
    availability: Array<CalendarAvailability>;
    specialties: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_booked_available_unavailable {
    booked = "booked",
    available = "available",
    unavailable = "unavailable"
}
export enum Variant_professional_vendor_productionHouse_location {
    professional = "professional",
    vendor = "vendor",
    productionHouse = "productionHouse",
    location = "location"
}
export interface backendInterface {
    acceptRecommendation(recommendationFrom: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    declineRecommendation(recommendationFrom: Principal): Promise<void>;
    getAdvertisingProfessional(id: Principal): Promise<AdvertisingProfessional>;
    getAllAdvertisingProfessionals(): Promise<Array<AdvertisingProfessional>>;
    getAllCategories(): Promise<Array<string>>;
    getAllEquipmentVendors(): Promise<Array<EquipmentVendor>>;
    getAllProductionHouses(): Promise<Array<ProductionHouse>>;
    getAllProfessions(): Promise<Array<string>>;
    getAllShootLocations(): Promise<Array<ShootLocation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEquipmentVendor(id: Principal): Promise<EquipmentVendor>;
    getShootLocation(id: Principal): Promise<ShootLocation>;
    getTimeSlotEntries(date: Time): Promise<{
        professionals: Array<AdvertisingProfessional>;
        vendors: Array<EquipmentVendor>;
        locations: Array<ShootLocation>;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchAdvertisingProfessionalsBySpecialty(specialty: string): Promise<Array<AdvertisingProfessional>>;
    searchEquipmentVendorsByInventory(item: string): Promise<Array<EquipmentVendor>>;
    searchShootLocationsByCapacity(requiredCapacity: bigint): Promise<Array<ShootLocation>>;
    sendRecommendation(toUser: Principal, message: string): Promise<void>;
    setAdvertisingProfessional(professional: AdvertisingProfessional): Promise<void>;
    setEquipmentVendor(vendor: EquipmentVendor): Promise<void>;
    setProductionHouse(house: ProductionHouse): Promise<void>;
    setShootLocation(location: ShootLocation): Promise<void>;
    updateAvailability(id: Principal, availability: Array<CalendarAvailability>): Promise<void>;
}
