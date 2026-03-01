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

  public type AreaOfExpertise = {
    #creative;
    #production;
    #accountManagement;
    #strategy;
    #media;
    #postProduction;
    #digital;
    #pr;
    #research;
    #other;
  };

  public type ProfessionalDesignation = {
    #director;
    #producer;
    #artDirector;
    #copywriter;
    #strategist;
    #accountExecutive;
    #mediaPlanner;
    #editor;
    #cinematographer;
    #designer;
    #other;
  };

  public type AdvertisingRegistration = {
    name : Text;
    currentCity : Text;
    areaOfExpertise : AreaOfExpertise;
    professionalDesignation : ProfessionalDesignation;
    yearsOfExperience : Nat;
    availability : [Time.Time];
    workReelURL : Text;
    industryReferences : ?Text;
    principal : Principal;
  };

  public type UserProfile = {
    name : Text;
    currentCity : Text;
    areaOfExpertise : ?AreaOfExpertise;
    professionalDesignation : ?ProfessionalDesignation;
  };

  let registrations = Map.empty<Principal, AdvertisingRegistration>();
  let verifiedMembers = Set.empty<Principal>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Required profile management functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Registration functions

  public shared ({ caller }) func submitProfessionalRegistration(registration : AdvertisingRegistration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can submit registration");
    };
    if (caller != registration.principal) {
      Runtime.trap("Unauthorized: Can only submit registration for yourself");
    };
    registrations.add(caller, registration);
  };

  public query ({ caller }) func getProfessionalRegistration(user : Principal) : async ?AdvertisingRegistration {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own registration");
    };
    registrations.get(user);
  };

  public query ({ caller }) func getVerifiedMembers() : async [Principal] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view verified members");
    };
    verifiedMembers.values().toArray();
  };
};
