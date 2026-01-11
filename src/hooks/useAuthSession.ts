import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthSession = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function getInitialSession() {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (mounted) {
                    if (session) {
                        setSession(session);
                        setUser(session.user);
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error getting session:', error);
                if (mounted) setLoading(false);
            }
        }

        getInitialSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return { session, user, loading };
};
