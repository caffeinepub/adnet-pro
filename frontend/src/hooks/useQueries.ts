import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  AdvertisingRegistration,
  TechnicianSearchInput,
  TechnicianSearchResult,
} from '../backend';
import { Principal } from '@dfinity/principal';

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

export function useSubmitProfessionalRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registration: AdvertisingRegistration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitProfessionalRegistration(registration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['professionalRegistration'] });
    },
  });
}

export function useGetProfessionalRegistration(user: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdvertisingRegistration | null>({
    queryKey: ['professionalRegistration', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      try {
        return await actor.getProfessionalRegistration(user);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!user,
  });
}

export function useGetVerifiedMembers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['verifiedMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVerifiedMembers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSearchTechnicians() {
  const { actor } = useActor();

  return useMutation<TechnicianSearchResult, Error, TechnicianSearchInput>({
    mutationFn: async (searchInput: TechnicianSearchInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchTechnicians(searchInput);
    },
  });
}
