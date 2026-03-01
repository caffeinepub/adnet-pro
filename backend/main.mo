import Set "mo:core/Set";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Profile Types
  public type CalendarAvailability = {
    date : Time.Time;
    status : { #available; #booked; #unavailable };
  };

  public type AdvertisingProfessional = {
    id : Principal;
    name : Text;
    specialties : [Text];
    portfolio : [Text];
    availability : [CalendarAvailability];
  };

  public type EquipmentVendor = {
    id : Principal;
    name : Text;
    inventory : [Text];
    availability : [CalendarAvailability];
  };

  public type ShootLocation = {
    id : Principal;
    name : Text;
    description : Text;
    capacity : Nat;
    pricing : Nat;
    availability : [CalendarAvailability];
  };

  public type ProductionHouse = {
    id : Principal;
    name : Text;
    companyInfo : Text;
    verifiedConnections : [Principal];
  };

  // User Profile Type for frontend compatibility
  public type UserProfile = {
    profileType : { #professional; #vendor; #location; #productionHouse };
    name : Text;
  };

  // Recommendation Types
  public type Recommendation = {
    fromUser : Principal;
    toUser : Principal;
    pending : Bool;
    message : Text;
  };

  // Constructors
  module AdvertisingProfessional {
    public func compare(prof1 : AdvertisingProfessional, prof2 : AdvertisingProfessional) : Order.Order {
      Text.compare(prof1.name, prof2.name);
    };
  };

  module EquipmentVendor {
    public func compare(vendor1 : EquipmentVendor, vendor2 : EquipmentVendor) : Order.Order {
      Text.compare(vendor1.name, vendor2.name);
    };
  };

  module ShootLocation {
    public func compare(location1 : ShootLocation, location2 : ShootLocation) : Order.Order {
      Text.compare(location1.name, location2.name);
    };
  };

  module ProductionHouse {
    public func compare(house1 : ProductionHouse, house2 : ProductionHouse) : Order.Order {
      Text.compare(house1.name, house2.name);
    };
  };

  // State
  let professionals = Map.empty<Principal, AdvertisingProfessional>();
  let vendors = Map.empty<Principal, EquipmentVendor>();
  let locations = Map.empty<Principal, ShootLocation>();
  let productionHouses = Map.empty<Principal, ProductionHouse>();
  let recommendations = Map.empty<Principal, Recommendation>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextConnectionId = 0;

  let advertisingCategories = Set.empty<Text>();
  let professions = Set.empty<Text>();

  // User Profile Management (Required by Frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless admin");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Profile Management Functions
  public shared ({ caller }) func setAdvertisingProfessional(professional : AdvertisingProfessional) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create professional profiles");
    };
    if (caller != professional.id) {
      Runtime.trap("Unauthorized: Can only create profile for yourself");
    };
    professionals.add(caller, professional);
  };

  public shared ({ caller }) func setEquipmentVendor(vendor : EquipmentVendor) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create vendor profiles");
    };
    if (caller != vendor.id) {
      Runtime.trap("Unauthorized: Can only create profile for yourself");
    };
    vendors.add(caller, vendor);
  };

  public shared ({ caller }) func setShootLocation(location : ShootLocation) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create location profiles");
    };
    if (caller != location.id) {
      Runtime.trap("Unauthorized: Can only create profile for yourself");
    };
    locations.add(caller, location);
  };

  public shared ({ caller }) func setProductionHouse(house : ProductionHouse) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create production house profiles");
    };
    if (caller != house.id) {
      Runtime.trap("Unauthorized: Can only create profile for yourself");
    };
    productionHouses.add(caller, house);
  };

  public query ({ caller }) func getAdvertisingProfessional(id : Principal) : async AdvertisingProfessional {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (professionals.get(id)) {
      case (?professional) { professional };
      case (null) { Runtime.trap("Professional does not exist") };
    };
  };

  public query ({ caller }) func getEquipmentVendor(id : Principal) : async EquipmentVendor {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (vendors.get(id)) {
      case (?vendor) { vendor };
      case (null) { Runtime.trap("Vendor does not exist") };
    };
  };

  public query ({ caller }) func getShootLocation(id : Principal) : async ShootLocation {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (locations.get(id)) {
      case (?location) { location };
      case (null) { Runtime.trap("Location does not exist") };
    };
  };

  // Availability Management
  public shared ({ caller }) func updateAvailability(id : Principal, availability : [CalendarAvailability]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update availability");
    };
    
    switch (professionals.get(id)) {
      case (?professional) {
        if (caller != professional.id) { Runtime.trap("Unauthorized: Can only update your own availability") };
        professionals.add(id, { professional with availability });
      };
      case (null) {
        switch (vendors.get(id)) {
          case (?vendor) {
            if (caller != vendor.id) { Runtime.trap("Unauthorized: Can only update your own availability") };
            vendors.add(id, { vendor with availability });
          };
          case (null) {
            switch (locations.get(id)) {
              case (?location) {
                if (caller != location.id) { Runtime.trap("Unauthorized: Can only update your own availability") };
                locations.add(id, { location with availability });
              };
              case (null) { Runtime.trap("Profile does not exist") };
            };
          };
        };
      };
    };
  };

  // Availability Querying
  public query ({ caller }) func getTimeSlotEntries(date : Time.Time) : async {
    professionals : [AdvertisingProfessional];
    vendors : [EquipmentVendor];
    locations : [ShootLocation];
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can query availability");
    };
    
    {
      professionals =
        professionals.values().toArray().filter(
          func(prof) {
            (prof.availability.filter(func(a) { a.date == date and a.status == #available })).size() > 0;
          }
        );
      vendors =
        vendors.values().toArray().filter(
          func(vendor) {
            (vendor.availability.filter(func(a) { a.date == date and a.status == #available })).size() > 0;
          }
        );
      locations =
        locations.values().toArray().filter(
          func(location) {
            (location.availability.filter(func(a) { a.date == date and a.status == #available })).size() > 0;
          }
        );
    };
  };

  public query ({ caller }) func getAllCategories() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view categories");
    };
    advertisingCategories.toArray();
  };

  public query ({ caller }) func getAllProfessions() : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view professions");
    };
    professions.toArray();
  };

  // Connection Management / Recommendations
  public shared ({ caller }) func sendRecommendation(toUser : Principal, message : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send recommendations");
    };

    // Verify sender is a production house
    switch (productionHouses.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Only production houses can send connection requests") };
      case (?_) {};
    };

    // Verify recipient is a service provider (not a production house)
    let isServiceProvider = switch (professionals.get(toUser)) {
      case (?_) { true };
      case (null) {
        switch (vendors.get(toUser)) {
          case (?_) { true };
          case (null) {
            switch (locations.get(toUser)) {
              case (?_) { true };
              case (null) { false };
            };
          };
        };
      };
    };

    if (not isServiceProvider) {
      Runtime.trap("Invalid recipient: Can only send connection requests to service providers");
    };

    let connectionId = nextConnectionId;
    nextConnectionId += 1;

    let recommendation : Recommendation = {
      fromUser = caller;
      toUser;
      pending = true;
      message;
    };

    recommendations.add(caller, recommendation);
  };

  public shared ({ caller }) func acceptRecommendation(recommendationFrom : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can accept recommendations");
    };

    switch (recommendations.get(recommendationFrom)) {
      case (?recommendation) {
        if (caller != recommendation.toUser) { 
          Runtime.trap("Unauthorized: Can only accept recommendations sent to you") 
        };
        
        let updatedRecommendation = { recommendation with pending = false };
        recommendations.add(recommendationFrom, updatedRecommendation);

        switch (productionHouses.get(recommendation.fromUser)) {
          case (?house) {
            let updatedHouse = {
              house with
              verifiedConnections = house.verifiedConnections.concat([recommendation.toUser]);
            };
            productionHouses.add(recommendation.fromUser, updatedHouse);
          };
          case (null) {};
        };
      };
      case (null) { Runtime.trap("Recommendation not found") };
    };
  };

  public shared ({ caller }) func declineRecommendation(recommendationFrom : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can decline recommendations");
    };

    switch (recommendations.get(recommendationFrom)) {
      case (?recommendation) {
        if (caller != recommendation.toUser) { 
          Runtime.trap("Unauthorized: Can only decline recommendations sent to you") 
        };
        recommendations.remove(recommendationFrom);
      };
      case (null) { Runtime.trap("Recommendation not found") };
    };
  };

  // Discovery and Search Features
  public query ({ caller }) func searchAdvertisingProfessionalsBySpecialty(specialty : Text) : async [AdvertisingProfessional] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can search professionals");
    };

    let professionalsList = professionals.values().toArray();
    professionalsList.filter(
      func(p) {
        p.specialties.foldLeft(
          false,
          func(found, s) {
            found or Text.equal(s, specialty);
          },
        );
      }
    );
  };

  public query ({ caller }) func searchEquipmentVendorsByInventory(item : Text) : async [EquipmentVendor] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can search vendors");
    };

    let vendorsList = vendors.values().toArray();
    vendorsList.filter(
      func(vendor) {
        vendor.inventory.foldLeft(
          false,
          func(found, itemInVendor) {
            found or Text.equal(itemInVendor, item);
          },
        );
      }
    );
  };

  public query ({ caller }) func searchShootLocationsByCapacity(requiredCapacity : Nat) : async [ShootLocation] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can search locations");
    };

    let locationsList = locations.values().toArray();
    locationsList.filter(func(location) { location.capacity >= requiredCapacity });
  };

  // Listing Functions
  public query ({ caller }) func getAllAdvertisingProfessionals() : async [AdvertisingProfessional] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list professionals");
    };
    professionals.values().toArray().sort();
  };

  public query ({ caller }) func getAllEquipmentVendors() : async [EquipmentVendor] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list vendors");
    };
    vendors.values().toArray().sort();
  };

  public query ({ caller }) func getAllShootLocations() : async [ShootLocation] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list locations");
    };
    locations.values().toArray().sort();
  };

  public query ({ caller }) func getAllProductionHouses() : async [ProductionHouse] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list production houses");
    };
    productionHouses.values().toArray().sort();
  };
};
