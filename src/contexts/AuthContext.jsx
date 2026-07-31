import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Erro ao recuperar sessão:", error);
      }

      const currentSession = data?.session ?? null;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthLoading(false);
    }

    loadInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    const redirectTo = `${window.location.origin}/reset-password`;

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo },
    );

    if (error) {
      throw error;
    }

    return data;
  }, []);

  const updatePassword = useCallback(async (password) => {
    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      throw error;
    }

    return data;
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      isAuthenticated: Boolean(session),
      isAuthLoading,
      signIn,
      signOut,
      requestPasswordReset,
      updatePassword,
    }),
    [
      session,
      user,
      isAuthLoading,
      signIn,
      signOut,
      requestPasswordReset,
      updatePassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de AuthProvider.");
  }

  return context;
}
