import Set "mo:core/Set";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Environment types
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

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let registrations = Map.empty<Principal, AdvertisingRegistration>();
  let verifiedMembers = Set.empty<Principal>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Backend persistent record for Technicians
  public type Technician = {
    name : Text;
    role : Text;
    city : Text;
    contactNumber : Text;
    availableFrom : Time.Time;
    availableUntil : Time.Time;
  };

  public type TechnicianSearchInput = {
    city : Text;
    availableFrom : Time.Time;
    availableTo : Time.Time;
    requiredRoles : [Text];
  };

  public type TechnicianResult = {
    name : Text;
    role : Text;
    city : Text;
    contactNumber : Text;
  };

  public type TechnicianSearchResult = {
    sameCityMatches : [TechnicianResult];
    otherCityMatches : [TechnicianResult];
  };

  // Persistent state for technician data
  var technicians : [Technician] = [
    {
      name = "Carlos Gomez";
      role = "Cinematographer";
      city = "Barcelona";
      contactNumber = "+34 671 234 567";
      availableFrom = 1712832000;
      availableUntil = 1713033600;
    },
    {
      name = "Marta Rodriguez";
      role = "Production Assistant";
      city = "Madrid";
      contactNumber = "+34 910 123 456";
      availableFrom = 1712853600;
      availableUntil = 1713408000;
    },
    {
      name = "David Garcia";
      role = "Director";
      city = "Barcelona";
      contactNumber = "+34 935 654 321";
      availableFrom = 1713345600;
      availableUntil = 1713945600;
    },
    {
      name = "Nuria Lopez";
      role = "Editor";
      city = "Valencia";
      contactNumber = "+34 963 456 789";
      availableFrom = 1712832000;
      availableUntil = 1713033600;
    },
    {
      name = "Javier Martinez";
      role = "Sound Technician";
      city = "Sevilla";
      contactNumber = "+34 954 123 456";
      availableFrom = 1712925600;
      availableUntil = 1713172800;
    },
    {
      name = "Lucia Hernandez";
      role = "Gaffer";
      city = "Barcelona";
      contactNumber = "+34 671 456 789";
      availableFrom = 1713194400;
      availableUntil = 1713441600;
    },
    {
      name = "Pablo Fernandez";
      role = "Grip";
      city = "Madrid";
      contactNumber = "+34 910 987 654";
      availableFrom = 1713000000;
      availableUntil = 1713201600;
    },
    {
      name = "Elena Sanchez";
      role = "Makeup Artist";
      city = "Valencia";
      contactNumber = "+34 963 789 012";
      availableFrom = 1713100800;
      availableUntil = 1713355200;
    },
    {
      name = "Manuel Perez";
      role = "Costume Designer";
      city = "Sevilla";
      contactNumber = "+34 954 654 321";
      availableFrom = 1713573600;
      availableUntil = 1713775200;
    },
    {
      name = "Sara Jimenez";
      role = "Set Designer";
      city = "Barcelona";
      contactNumber = "+34 671 789 012";
      availableFrom = 1713021600;
      availableUntil = 1713223200;
    },
    {
      name = "Pedro Ruiz";
      role = "Camera Operator";
      city = "Madrid";
      contactNumber = "+34 910 234 567";
      availableFrom = 1713194400;
      availableUntil = 1713441600;
    },
    {
      name = "Ana Castro";
      role = "Lighting Technician";
      city = "Valencia";
      contactNumber = "+34 963 321 654";
      availableFrom = 1713091200;
      availableUntil = 1713331200;
    },
    {
      name = "Miguel Torres";
      role = "Hair Stylist";
      city = "Sevilla";
      contactNumber = "+34 954 987 654";
      availableFrom = 1712755200;
      availableUntil = 1712956800;
    },
    {
      name = "Laura Moreno";
      role = "Production Coordinator";
      city = "Barcelona";
      contactNumber = "+34 671 234 890";
      availableFrom = 1712889600;
      availableUntil = 1713081600;
    },
    {
      name = "Antonio Sanchez";
      role = "Assistant Director";
      city = "Madrid";
      contactNumber = "+34 910 567 890";
      availableFrom = 1713148800;
      availableUntil = 1713340800;
    },
  ];

  // Profile management functions
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

  // Technician Search Feature — publicly accessible to all callers including guests
  public query func searchTechnicians(searchInput : TechnicianSearchInput) : async TechnicianSearchResult {
    let matches = technicians.filter(
      func(tech) {
        tech.availableFrom <= searchInput.availableFrom and tech.availableUntil >= searchInput.availableTo and searchInput.requiredRoles.find(func(role) { role == tech.role }) != null;
      }
    );

    // Custom partition logic for same city and other city matches
    let sameCity = matches.filter(func(tech) { tech.city == searchInput.city });
    let otherCity = matches.filter(func(tech) { tech.city != searchInput.city });

    let sameCityResults = sameCity.map(
      func(tech) {
        {
          name = tech.name;
          role = tech.role;
          city = tech.city;
          contactNumber = tech.contactNumber;
        };
      }
    );

    let otherCityResults = otherCity.map(
      func(tech) {
        {
          name = tech.name;
          role = tech.role;
          city = tech.city;
          contactNumber = tech.contactNumber;
        };
      }
    );

    {
      sameCityMatches = sameCityResults;
      otherCityMatches = otherCityResults;
    };
  };
};
