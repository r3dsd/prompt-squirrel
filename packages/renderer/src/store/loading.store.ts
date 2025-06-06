import { create } from 'zustand';

interface LoadingState {
    isLoading: boolean;
    message: string;
}

interface LoadingAction {
    loading: (message?: string) => void;
    stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState & LoadingAction>((set) => ({
    isLoading: false,
    message: '',

    loading: (message = '로딩 중...') => set({ isLoading: true, message }),
    stopLoading: () => set({ isLoading: false, message: '' }),
}));
