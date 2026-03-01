import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  AdvertisingProfessional, 
  EquipmentVendor, 
  ShootLocation,
  ProductionHouse,
  CalendarAvailability,
  Time
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

export function useGetAdvertisingProfessional(id: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdvertisingProfessional | null>({
    queryKey: ['professional', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getAdvertisingProfessional(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useSetAdvertisingProfessional() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (professional: AdvertisingProfessional) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setAdvertisingProfessional(professional);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professional'] });
      queryClient.invalidateQueries({ queryKey: ['allProfessionals'] });
    },
  });
}

export function useGetEquipmentVendor(id: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EquipmentVendor | null>({
    queryKey: ['vendor', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getEquipmentVendor(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useSetEquipmentVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendor: EquipmentVendor) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setEquipmentVendor(vendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor'] });
      queryClient.invalidateQueries({ queryKey: ['allVendors'] });
    },
  });
}

export function useGetShootLocation(id: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ShootLocation | null>({
    queryKey: ['location', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getShootLocation(id);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useSetShootLocation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (location: ShootLocation) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setShootLocation(location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location'] });
      queryClient.invalidateQueries({ queryKey: ['allLocations'] });
    },
  });
}

export function useSetProductionHouse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (house: ProductionHouse) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setProductionHouse(house);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionHouse'] });
    },
  });
}

export function useGetAllAdvertisingProfessionals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdvertisingProfessional[]>({
    queryKey: ['allProfessionals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAdvertisingProfessionals();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllEquipmentVendors() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EquipmentVendor[]>({
    queryKey: ['allVendors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEquipmentVendors();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllShootLocations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ShootLocation[]>({
    queryKey: ['allLocations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShootLocations();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, availability }: { id: Principal; availability: CalendarAvailability[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAvailability(id, availability);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professional'] });
      queryClient.invalidateQueries({ queryKey: ['vendor'] });
      queryClient.invalidateQueries({ queryKey: ['location'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
}

export function useGetTimeSlotEntries(date: Time | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['availability', date?.toString()],
    queryFn: async () => {
      if (!actor || date === null) return { professionals: [], vendors: [], locations: [] };
      return actor.getTimeSlotEntries(date);
    },
    enabled: !!actor && !actorFetching && date !== null,
  });
}

export function useSendRecommendation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ toUser, message }: { toUser: Principal; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendRecommendation(toUser, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
}

export function useAcceptRecommendation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recommendationFrom: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptRecommendation(recommendationFrom);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['productionHouse'] });
    },
  });
}

export function useDeclineRecommendation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recommendationFrom: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.declineRecommendation(recommendationFrom);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
}

export function useSearchAdvertisingProfessionalsBySpecialty(specialty: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AdvertisingProfessional[]>({
    queryKey: ['searchProfessionals', specialty],
    queryFn: async () => {
      if (!actor || !specialty) return [];
      return actor.searchAdvertisingProfessionalsBySpecialty(specialty);
    },
    enabled: !!actor && !actorFetching && !!specialty,
  });
}

export function useSearchEquipmentVendorsByInventory(item: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EquipmentVendor[]>({
    queryKey: ['searchVendors', item],
    queryFn: async () => {
      if (!actor || !item) return [];
      return actor.searchEquipmentVendorsByInventory(item);
    },
    enabled: !!actor && !actorFetching && !!item,
  });
}

export function useSearchShootLocationsByCapacity(capacity: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ShootLocation[]>({
    queryKey: ['searchLocations', capacity?.toString()],
    queryFn: async () => {
      if (!actor || capacity === null) return [];
      return actor.searchShootLocationsByCapacity(capacity);
    },
    enabled: !!actor && !actorFetching && capacity !== null,
  });
}

export function useGetAllProfessions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['professions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProfessions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllCategories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !actorFetching,
  });
}
