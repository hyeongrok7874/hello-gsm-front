import create from 'zustand';

interface storeType {
  showFAQModal: boolean;
  FAQModalTitle: string;
  FAQModalContent: string;
  showMypageModal: boolean;
  mypageModalContent: string;
  isSearching: boolean;
  showDepartmentModal: boolean;
  selectedChoice: number;
  choice1: number;
  choice2: number;
  choice3: number;
  showFindSchoolModal: boolean;
  schoolName: string;
  showFindAddressModal: boolean;
  address: string;

  setShowFAQModal: () => void;
  setFAQModalTitle: (title: string) => void;
  setFAQModalContent: (content: string) => void;
  setShowMypageModal: () => void;
  setMypageModalContent: (content: string) => void;
  setIsSearching: (trueOrFalse: boolean) => void;
  setShowDepartmentModal: () => void;
  setSelectedChoice: (index: number) => void;
  setChoice1: (type: number) => void;
  setChoice2: (type: number) => void;
  setChoice3: (type: number) => void;
  setShowFindSchoolModal: () => void;
  setSchoolName: (name: string) => void;
  setShowFindAddressModal: () => void;
  setAddress: (residence: string) => void;
}

const useStore = create<storeType>(set => ({
  showFAQModal: false,
  FAQModalTitle: '',
  FAQModalContent: '',
  showMypageModal: false,
  mypageModalContent: '',
  isSearching: false,
  showDepartmentModal: false,
  selectedChoice: 0,
  choice1: 0,
  choice2: 0,
  choice3: 0,
  showFindSchoolModal: false,
  schoolName: '',
  showFindAddressModal: false,
  address: '',

  setShowFAQModal: () => set(state => ({ showFAQModal: !state.showFAQModal })),
  setFAQModalTitle: title => set({ FAQModalTitle: title }),
  setFAQModalContent: content => set({ FAQModalContent: content }),
  setShowMypageModal: () =>
    set(state => ({ showMypageModal: !state.showMypageModal })),
  setMypageModalContent: content => set({ mypageModalContent: content }),
  setIsSearching: trueOrFalse => set({ isSearching: trueOrFalse }),
  setShowDepartmentModal: () =>
    set(state => ({ showDepartmentModal: !state.showDepartmentModal })),
  setSelectedChoice: index => set({ selectedChoice: index }),
  setChoice1: type => set({ choice1: type }),
  setChoice2: type => set({ choice2: type }),
  setChoice3: type => set({ choice3: type }),
  setShowFindSchoolModal: () =>
    set(state => ({ showFindSchoolModal: !state.showFindSchoolModal })),
  setSchoolName: name => set({ schoolName: name }),
  setShowFindAddressModal: () =>
    set(state => ({ showFindAddressModal: !state.showFindAddressModal })),
  setAddress: residence => set({ address: residence }),
}));

export default useStore;
