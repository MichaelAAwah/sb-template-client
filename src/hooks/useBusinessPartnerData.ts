import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BusinessPartner, 
  BPFilters, 
  BPTransaction, 
  BPSalesData, 
  BPAgedAnalysis,
  BPStats,
  BPGroup,
  PriceList,
  SalesRep
} from '../types/businessPartner';
import { 
  fetchBusinessPartners,
  fetchBusinessPartnerById,
  fetchBPTransactions,
  fetchBPSalesData,
  fetchBPAgedAnalysis,
  createBusinessPartner,
  updateBusinessPartner,
  createSalesRep,
  mockBPStats,
  mockBPGroups,
  mockPriceLists,
  mockSalesReps
} from '../api/businessPartnerData';

// Business Partners
export const useBusinessPartners = (filters?: BPFilters) => {
  return useQuery({
    queryKey: ['businessPartners', filters],
    queryFn: () => fetchBusinessPartners(filters),
    staleTime: 30000,
  });
};

export const useBusinessPartner = (id: string) => {
  return useQuery({
    queryKey: ['businessPartner', id],
    queryFn: () => fetchBusinessPartnerById(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useCreateBusinessPartner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBusinessPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessPartners'] });
    },
  });
};

export const useUpdateBusinessPartner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BusinessPartner> }) => 
      updateBusinessPartner(id, updates),
    onSuccess: (updatedBP) => {
      queryClient.invalidateQueries({ queryKey: ['businessPartners'] });
      queryClient.setQueryData(['businessPartner', updatedBP.id], updatedBP);
    },
  });
};

// Transactions
export const useBPTransactions = (bpId: string) => {
  return useQuery({
    queryKey: ['bpTransactions', bpId],
    queryFn: () => fetchBPTransactions(bpId),
    enabled: !!bpId,
    staleTime: 60000,
  });
};

// Sales Data
export const useBPSalesData = (bpId: string) => {
  return useQuery({
    queryKey: ['bpSalesData', bpId],
    queryFn: () => fetchBPSalesData(bpId),
    enabled: !!bpId,
    staleTime: 300000,
  });
};

// Aged Analysis
export const useBPAgedAnalysis = (bpId: string) => {
  return useQuery({
    queryKey: ['bpAgedAnalysis', bpId],
    queryFn: () => fetchBPAgedAnalysis(bpId),
    enabled: !!bpId,
    staleTime: 300000,
  });
};

// Stats
export const useBPStats = () => {
  return useQuery({
    queryKey: ['bpStats'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockBPStats;
    },
    staleTime: 60000,
  });
};

// Reference Data
export const useBPGroups = () => {
  return useQuery({
    queryKey: ['bpGroups'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockBPGroups;
    },
    staleTime: 300000,
  });
};

export const usePriceLists = () => {
  return useQuery({
    queryKey: ['priceLists'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockPriceLists;
    },
    staleTime: 300000,
  });
};

export const useSalesReps = () => {
  return useQuery({
    queryKey: ['salesReps'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSalesReps;
    },
    staleTime: 300000,
  });
};

export const useCreateSalesRep = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSalesRep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesReps'] });
    },
  });
};