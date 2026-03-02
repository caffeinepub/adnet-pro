import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
    currentCity : Text;
    areaOfExpertise : ?{ #creative; #production; #accountManagement; #strategy; #media; #postProduction; #digital; #pr; #research; #other };
    professionalDesignation : ?{ #director; #producer; #artDirector; #copywriter; #strategist; #accountExecutive; #mediaPlanner; #editor; #cinematographer; #designer; #other };
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewUserProfile = {
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

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, _oldProfile) {
        {
          fullName = "";
          email = "";
          contactNumber = "";
          city = "";
          department = "";
          designation = "";
          yearsOfExperience = 0;
          tribeCompanyName = "";
          role = "";
          executiveProducers = [];
          workReelUrl = "";
          industryReferenceEmail = "";
          availability = [];
        };
      }
    );
    { userProfiles = newProfiles };
  };
};
