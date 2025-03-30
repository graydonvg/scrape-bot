import { create } from "zustand";

type CredentialsState = {
  existingCredentialNames: string[];
  setExistingCredentialNames: (credentialNames: string[]) => void;
};

const useCredentialsStore = create<CredentialsState>()((set) => ({
  existingCredentialNames: [],
  setExistingCredentialNames: (credentialNames) =>
    set({ existingCredentialNames: credentialNames }),
}));

export default useCredentialsStore;
