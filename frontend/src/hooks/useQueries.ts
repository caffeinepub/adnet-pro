import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  UserProfile,
  TechnicianSearchInput,
  TechnicianSearchResult,
  Director,
  TribalLeaderRole,
} from '../backend';
import { Principal } from '@dfinity/principal';

// ── Local enum types kept for backward-compat with legacy components ──────────
// These are no longer in the backend interface; defined locally so existing
// components (InlineRegistrationForm, ProfessionalProfileForm, ProfilePage) compile.

export enum AreaOfExpertise {
  creative = 'creative',
  production = 'production',
  accountManagement = 'accountManagement',
  strategy = 'strategy',
  media = 'media',
  postProduction = 'postProduction',
  digital = 'digital',
  pr = 'pr',
  research = 'research',
  other = 'other',
}

export enum ProfessionalDesignation {
  director = 'director',
  producer = 'producer',
  artDirector = 'artDirector',
  copywriter = 'copywriter',
  strategist = 'strategist',
  accountExecutive = 'accountExecutive',
  mediaPlanner = 'mediaPlanner',
  editor = 'editor',
  cinematographer = 'cinematographer',
  designer = 'designer',
  other = 'other',
}

// ── Local type kept for backward-compat with components that still reference it ──
// The backend no longer stores AdvertisingRegistration; these hooks are stubs.
export interface AdvertisingRegistration {
  name: string;
  currentCity: string;
  areaOfExpertise: AreaOfExpertise;
  professionalDesignation: ProfessionalDesignation;
  yearsOfExperience: bigint;
  availability: bigint[];
  workReelURL: string;
  industryReferences?: string;
  principal: Principal;
}

// ── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (availability: string[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAvailability(availability);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── Professional Registration (stub — backend method removed) ─────────────────
// These hooks are retained so existing components compile without changes.

export function useSubmitProfessionalRegistration() {
  return useMutation({
    mutationFn: async (_registration: AdvertisingRegistration): Promise<void> => {
      return Promise.resolve();
    },
  });
}

export function useGetProfessionalRegistration(user: Principal | null) {
  return useQuery<AdvertisingRegistration | null>({
    queryKey: ['professionalRegistration', user?.toString()],
    queryFn: async () => null,
    enabled: !!user,
  });
}

// ── Verified Members (stub — backend method removed) ─────────────────────────

export function useGetVerifiedMembers() {
  return useQuery<Principal[]>({
    queryKey: ['verifiedMembers'],
    queryFn: async () => [],
  });
}

// ── Technician Search ─────────────────────────────────────────────────────────

export function useSearchTechnicians() {
  const { actor } = useActor();

  return useMutation<TechnicianSearchResult, Error, TechnicianSearchInput>({
    mutationFn: async (searchInput: TechnicianSearchInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchTechnicians(searchInput);
    },
  });
}

// ── Director Registration ─────────────────────────────────────────────────────

export function useSubmitDirectorRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (director: Director) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitDirectorRegistration(director);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['directorRegistration'] });
      queryClient.invalidateQueries({ queryKey: ['tribalLeaderRole'] });
    },
  });
}

export function useSubmitDirectorRegistrationV2() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (director: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitDirectorRegistrationV2(director);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tribalLeaderRole'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSubmitProductionHouseRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitProductionHouseRegistration(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tribalLeaderRole'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetDirectorRegistration(user: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Director | null>({
    queryKey: ['directorRegistration', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      try {
        return await actor.getDirectorRegistration(user);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!user,
  });
}

// ── Tribal Leader Role ────────────────────────────────────────────────────────

export function useTribalLeaderRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const principal = identity?.getPrincipal() ?? null;

  const query = useQuery<TribalLeaderRole | null>({
    queryKey: ['tribalLeaderRole', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      try {
        return await actor.getTribalLeaderRole(principal);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!principal,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
