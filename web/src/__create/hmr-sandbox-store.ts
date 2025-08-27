import { create } from 'zustand';

interface SandboxStore {
  isCodeGenGenerating: boolean;
  startCodeGen: () => void;
  setCodeGenGenerating: () => void;
  completeCodeGen: () => void;
  errorCodeGen: () => void;
  stopCodeGen: () => void;
}

export const useSandboxStore = create<SandboxStore>((set) => ({
  isCodeGenGenerating: false,
  startCodeGen: () => set({ isCodeGenGenerating: true }),
  setCodeGenGenerating: () => set({ isCodeGenGenerating: true }),
  completeCodeGen: () => set({ isCodeGenGenerating: false }),
  errorCodeGen: () => set({ isCodeGenGenerating: false }),
  stopCodeGen: () => set({ isCodeGenGenerating: false }),
}));