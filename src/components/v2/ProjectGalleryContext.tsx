import {
  createContext,
  useContext,
  type Dispatch,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from 'react';
import type { OmnitrixControllerHandle } from './OmnitrixController';

export interface ProjectGalleryBridge {
  previewRef: RefObject<HTMLElement | null>;
  onPreviewChange: (projectId: string) => void;
}

export interface ProjectGalleryContextValue {
  bridge: ProjectGalleryBridge | null;
  setBridge: Dispatch<SetStateAction<ProjectGalleryBridge | null>>;
  controllerRef: MutableRefObject<OmnitrixControllerHandle | null>;
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
  revealProject: (projectId: string) => void;
  selectorOpen: boolean;
  setSelectorOpen: Dispatch<SetStateAction<boolean>>;
}

const ProjectGalleryContext = createContext<ProjectGalleryContextValue | null>(null);

export function ProjectGalleryProvider({
  value,
  children,
}: {
  value: ProjectGalleryContextValue;
  children: ReactNode;
}) {
  return (
    <ProjectGalleryContext.Provider value={value}>
      {children}
    </ProjectGalleryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProjectGallery() {
  const value = useContext(ProjectGalleryContext);
  if (!value) {
    throw new Error('useProjectGallery must be used within ProjectGalleryProvider');
  }
  return value;
}
