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
import Migration "migration";

(with migration = Migration.run)
actor {
  public type Director = {
    fullName : Text;
    currentCity : Text;
    productSpecialisation : ?Text;
    genreSpecialisation : ?Text;
    yearsOfExperience : Nat;
    availabilityStart : Time.Time;
    availabilityEnd : Time.Time;
    workReelUrl : Text;
    industryReference : Text;
  };

  public type TribalLeaderRole = {
    #director;
    #productionHouse;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let directors = Map.empty<Principal, Director>();
  let tribalLeaders = Map.empty<Principal, TribalLeaderRole>();

  public shared ({ caller }) func submitDirectorRegistration(director : Director) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can submit registration");
    };
    if (directors.containsKey(caller)) {
      Runtime.trap("Error: Cannot modify existing director registration");
    };
    directors.add(caller, director);
    tribalLeaders.add(caller, #director);
  };

  public query ({ caller }) func getDirectorRegistration(principal : Principal) : async ?Director {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own director registration");
    };
    directors.get(principal);
  };

  public query ({ caller }) func getTribalLeaderRole(principal : Principal) : async ?TribalLeaderRole {
    tribalLeaders.get(principal);
  };

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

  public type UserProfile = {
    fullName : Text;
    email : Text;
    contactNumber : Text;
    city : Text;
    department : Text;
    designation : Text;
    yearsOfExperience : Nat;
    tribeCompanyName : Text;
    role : Text;
    executiveProducers : [Text];
    workReelUrl : Text;
    industryReferenceEmail : Text;
    availability : [Text];
  };

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

  /// Create or update the caller's profile. Requires authenticated user.
  public shared ({ caller }) func createOrUpdateProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create/update profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// Get the caller's own profile. Requires authenticated user.
  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  /// Get the caller's own profile (alias required by frontend). Requires authenticated user.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  /// Save the caller's own profile (alias required by frontend). Requires authenticated user.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// Get a specific user's profile. Caller must be the owner or an admin.
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  /// Update only the availability field of the caller's profile. Requires authenticated user.
  public shared ({ caller }) func updateAvailability(availability : [Text]) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update availability");
    };
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not found: Please create a profile first");
      };
      case (?profile) {
        let updatedProfile : UserProfile = {
          profile with
          availability
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  /// Search for available technicians. No authentication required (public search).
  public query ({ caller }) func searchTechnicians(searchInput : TechnicianSearchInput) : async TechnicianSearchResult {
    let matches = technicians.filter(
      func(tech) {
        tech.availableFrom <= searchInput.availableFrom and tech.availableUntil >= searchInput.availableTo and searchInput.requiredRoles.find(func(role) { role == tech.role }) != null;
      }
    );

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

  /// Submit a production house registration. Requires authenticated user.
  public shared ({ caller }) func submitProductionHouseRegistration(productionHouse : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can submit registration");
    };
    userProfiles.add(caller, productionHouse);
    tribalLeaders.add(caller, #productionHouse);
  };

  /// Submit a director registration using the full UserProfile model. Requires authenticated user.
  public shared ({ caller }) func submitDirectorRegistrationV2(director : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can submit registration");
    };
    userProfiles.add(caller, director);
    tribalLeaders.add(caller, #director);
  };
};
