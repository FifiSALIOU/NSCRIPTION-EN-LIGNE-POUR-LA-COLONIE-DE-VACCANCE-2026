import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppUser, ROLE_LABELS, UserRole } from "@/types/app";

const USERS_STORAGE_KEY = "css_colonie_users_v1";
const SESSION_STORAGE_KEY = "css_colonie_session_user_id_v1";

const seedUsers: AppUser[] = [
  {
    id: "usr-parent-001",
    role: "parent",
    matricule: "PARENT001",
    prenom: "Amina",
    nom: "Hassan",
    email: "amina.hassan@css.dj",
    service: "Prestations Sociales",
    password: "Parent123!",
    isActive: true,
  },
  {
    id: "usr-admin-001",
    role: "admin",
    matricule: "ADMIN001",
    prenom: "Youssouf",
    nom: "Ali",
    email: "youssouf.ali@css.dj",
    service: "Administration",
    password: "Admin123!",
    isActive: true,
  },
  {
    id: "usr-super-001",
    role: "super_admin",
    matricule: "SUPER001",
    prenom: "Salma",
    nom: "Ibrahim",
    email: "salma.ibrahim@css.dj",
    service: "Direction Générale",
    password: "Super123!",
    isActive: true,
  },
];

const normalizeMatricule = (value: string) => value.trim().toUpperCase();

const readUsers = (): AppUser[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) return seedUsers;

  try {
    const parsed = JSON.parse(stored) as AppUser[];
    return parsed.length > 0 ? parsed : seedUsers;
  } catch {
    return seedUsers;
  }
};

interface RegisterParentInput {
  matricule: string;
  prenom: string;
  nom: string;
  email?: string;
  service: string;
  password: string;
}

interface CreateUserInput {
  matricule: string;
  prenom: string;
  nom: string;
  email?: string;
  service: string;
  role: UserRole;
  password: string;
}

interface AuthContextValue {
  users: AppUser[];
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  login: (matricule: string, password: string) => { ok: boolean; message: string };
  logout: () => void;
  registerParent: (input: RegisterParentInput) => { ok: boolean; message: string };
  createUser: (input: CreateUserInput) => { ok: boolean; message: string };
  updateUser: (id: string, data: Partial<Omit<AppUser, "id">>) => void;
  deleteUser: (id: string) => void;
  toggleUserActive: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<AppUser[]>(readUsers);
  const [sessionUserId, setSessionUserId] = useState<string | null>(() => localStorage.getItem(SESSION_STORAGE_KEY));

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (!sessionUserId) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    localStorage.setItem(SESSION_STORAGE_KEY, sessionUserId);
  }, [sessionUserId]);

  const currentUser = useMemo(() => users.find((user) => user.id === sessionUserId) ?? null, [users, sessionUserId]);

  const login = (matricule: string, password: string) => {
    const normalized = normalizeMatricule(matricule);
    const user = users.find(
      (item) => normalizeMatricule(item.matricule) === normalized && item.password === password,
    );

    if (!user) {
      return { ok: false, message: "Matricule ou mot de passe incorrect." };
    }

    if (user.isActive === false) {
      return { ok: false, message: "Ce compte est désactivé. Contactez l'administrateur." };
    }

    setSessionUserId(user.id);
    return { ok: true, message: `Connexion réussie (${ROLE_LABELS[user.role]}).` };
  };

  const logout = () => {
    setSessionUserId(null);
  };

  const registerParent = (input: RegisterParentInput) => {
    const matricule = normalizeMatricule(input.matricule);

    const exists = users.some((user) => normalizeMatricule(user.matricule) === matricule);
    if (exists) {
      return { ok: false, message: "Ce matricule existe déjà." };
    }

    const newUser: AppUser = {
      id: `usr-parent-${Date.now()}`,
      role: "parent",
      matricule,
      prenom: input.prenom.trim(),
      nom: input.nom.trim(),
      email: input.email?.trim() || "",
      service: input.service.trim(),
      password: input.password,
      isActive: true,
    };

    setUsers((prev) => [...prev, newUser]);
    return { ok: true, message: "Compte parent créé avec succès." };
  };

  const createUser = (input: CreateUserInput) => {
    const matricule = normalizeMatricule(input.matricule);
    const exists = users.some((user) => normalizeMatricule(user.matricule) === matricule);
    if (exists) {
      return { ok: false, message: "Ce matricule existe déjà." };
    }

    const newUser: AppUser = {
      id: `usr-${input.role}-${Date.now()}`,
      role: input.role,
      matricule,
      prenom: input.prenom.trim(),
      nom: input.nom.trim(),
      email: input.email?.trim() || "",
      service: input.service.trim(),
      password: input.password,
      isActive: true,
    };

    setUsers((prev) => [...prev, newUser]);
    return { ok: true, message: `Utilisateur ${input.prenom} ${input.nom} créé avec succès.` };
  };

  const updateUser = (id: string, data: Partial<Omit<AppUser, "id">>) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, ...data } : user,
      ),
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const toggleUserActive = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isActive: user.isActive === false ? true : false } : user,
      ),
    );
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      users,
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
      registerParent,
      createUser,
      updateUser,
      deleteUser,
      toggleUserActive,
    }),
    [users, currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }

  return context;
};
