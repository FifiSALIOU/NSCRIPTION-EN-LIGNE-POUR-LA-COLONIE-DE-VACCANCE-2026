import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Inscription, InscriptionStatus, ListType, ParentRelation } from "@/types/app";

const INSCRIPTIONS_STORAGE_KEY = "css_colonie_inscriptions_v1";

const readInscriptions = (): Inscription[] => {
  const stored = localStorage.getItem(INSCRIPTIONS_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Inscription[];
  } catch {
    return [];
  }
};

export const getNextListType = (
  hasMainChild: boolean,
  relation: ParentRelation | "",
): ListType => {
  if (relation === "autre") return "attente_2";
  if (hasMainChild) return "attente_1";
  return "principale";
};

interface CreateInscriptionInput {
  parentUserId: string;
  parentMatricule: string;
  parentPrenom: string;
  parentNom: string;
  parentService: string;
  childPrenom: string;
  childNom: string;
  childBirthDate: string;
  childSex: "masculin" | "feminin";
  childRelation: ParentRelation;
}

interface InscriptionsContextValue {
  inscriptions: Inscription[];
  hasMainChildForParent: (matricule: string) => boolean;
  getParentInscriptions: (parentUserId: string) => Inscription[];
  createInscription: (input: CreateInscriptionInput) => { ok: boolean; message: string; inscription?: Inscription };
  reviewInscription: (id: string, status: Exclude<InscriptionStatus, "en_attente">, reviewerUserId: string) => void;
}

const InscriptionsContext = createContext<InscriptionsContextValue | null>(null);

export const InscriptionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>(readInscriptions);

  useEffect(() => {
    localStorage.setItem(INSCRIPTIONS_STORAGE_KEY, JSON.stringify(inscriptions));
  }, [inscriptions]);

  const hasMainChildForParent = (matricule: string) =>
    inscriptions.some((item) => item.parentMatricule === matricule && item.listType === "principale");

  const getParentInscriptions = (parentUserId: string) =>
    inscriptions.filter((item) => item.parentUserId === parentUserId);

  const createInscription = (input: CreateInscriptionInput) => {
    const year = Number(input.childBirthDate.split("-")[0]);

    if (!Number.isFinite(year) || year < 2012 || year > 2019) {
      return {
        ok: false,
        message: `Inscription rejetée : année de naissance invalide (${year || "inconnue"}). Doit être entre 2012 et 2019.`,
      };
    }

    const hasMain = hasMainChildForParent(input.parentMatricule);
    const listType = getNextListType(hasMain, input.childRelation);

    const inscription: Inscription = {
      id: `INS-${Date.now()}`,
      parentUserId: input.parentUserId,
      parentMatricule: input.parentMatricule,
      parentPrenom: input.parentPrenom,
      parentNom: input.parentNom,
      parentService: input.parentService,
      childPrenom: input.childPrenom,
      childNom: input.childNom,
      childBirthDate: input.childBirthDate,
      childSex: input.childSex,
      childRelation: input.childRelation,
      isTitulaire: listType === "principale",
      listType,
      status: "en_attente",
      createdAt: new Date().toISOString(),
    };

    setInscriptions((prev) => [inscription, ...prev]);

    return {
      ok: true,
      message: "Demande enregistrée avec succès.",
      inscription,
    };
  };

  const reviewInscription = (
    id: string,
    status: Exclude<InscriptionStatus, "en_attente">,
    reviewerUserId: string,
  ) => {
    setInscriptions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              reviewedAt: new Date().toISOString(),
              reviewedByUserId: reviewerUserId,
            }
          : item,
      ),
    );
  };

  const value = useMemo<InscriptionsContextValue>(
    () => ({
      inscriptions,
      hasMainChildForParent,
      getParentInscriptions,
      createInscription,
      reviewInscription,
    }),
    [inscriptions],
  );

  return <InscriptionsContext.Provider value={value}>{children}</InscriptionsContext.Provider>;
};

export const useInscriptions = () => {
  const context = useContext(InscriptionsContext);
  if (!context) {
    throw new Error("useInscriptions doit être utilisé dans InscriptionsProvider.");
  }

  return context;
};
