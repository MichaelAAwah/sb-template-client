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
  SalesRep,
  BPNote,
  UserDefinedField
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
  fetchBPNotes,
  createBPNote,
  updateBPNote,
  deleteBPNote,
  fetchBPUDFs,
  updateBPUDFs,
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

// Notes hooks
export const useBPNotes = (bpId: string) => {
  return useQuery({
    queryKey: ['bpNotes', bpId],
    queryFn: () => fetchBPNotes(bpId),
    enabled: !!bpId,
    staleTime: 60000,
  });
};

export const useCreateBPNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bpId, noteData }: { bpId: string; noteData: Omit<BPNote, 'id' | 'bpId' | 'createdAt' | 'updatedAt'> }) => 
      createBPNote(bpId, noteData),
    onSuccess: (_, { bpId }) => {
      queryClient.invalidateQueries({ queryKey: ['bpNotes', bpId] });
      queryClient.invalidateQueries({ queryKey: ['businessPartner', bpId] });
    },
  });
};

export const useUpdateBPNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bpId, noteId, updates }: { bpId: string; noteId: string; updates: Partial<BPNote> }) => 
      updateBPNote(bpId, noteId, updates),
    onSuccess: (_, { bpId }) => {
      queryClient.invalidateQueries({ queryKey: ['bpNotes', bpId] });
    },
  });
};

export const useDeleteBPNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bpId, noteId }: { bpId: string; noteId: string }) => 
      deleteBPNote(bpId, noteId),
    onSuccess: (_, { bpId }) => {
      queryClient.invalidateQueries({ queryKey: ['bpNotes', bpId] });
    },
  });
};

// User Defined Fields hooks
export const useBPUDFs = (bpId: string) => {
  return useQuery({
    queryKey: ['bpUDFs', bpId],
    queryFn: () => fetchBPUDFs(bpId),
    enabled: !!bpId,
    staleTime: 300000,
  });
};

export const useUpdateBPUDFs = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bpId, udfs }: { bpId: string; udfs: UserDefinedField[] }) => 
      updateBPUDFs(bpId, udfs),
    onSuccess: (_, { bpId }) => {
      queryClient.invalidateQueries({ queryKey: ['bpUDFs', bpId] });
      queryClient.invalidateQueries({ queryKey: ['businessPartner', bpId] });
    },
  });
};