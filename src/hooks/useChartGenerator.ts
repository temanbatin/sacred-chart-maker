import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import type { BirthData } from '@/components/MultiStepForm';

export const useChartGenerator = (user: User | null) => {
    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState<any>(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [birthData, setBirthData] = useState<BirthData | null>(null);
    const [showLeadCapture, setShowLeadCapture] = useState(false);
    const [pendingBirthData, setPendingBirthData] = useState<BirthData | null>(null);
    const [currentChartId, setCurrentChartId] = useState<string | undefined>(undefined);

    // Fetch profile data when user is logged in
    useEffect(() => {
        if (user) {
            setUserName(user.user_metadata?.name || '');
            setUserEmail(user.email || '');
            setUserPhone(user.user_metadata?.whatsapp || '');

            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('name, whatsapp')
                    .eq('user_id', user.id)
                    .single();

                if (!error && data) {
                    if (data.name) setUserName(data.name);
                    if (data.whatsapp) setUserPhone(data.whatsapp);
                }
            };
            fetchProfile();
        }
    }, [user]);

    const generateChart = async (
        birthDataInput: BirthData,
        email: string,
        whatsapp: string,
        password: string | null
    ) => {
        setIsLoading(true);
        setUserName(birthDataInput.name);
        setUserEmail(email);
        setUserPhone(whatsapp);

        // Store birth data for bodygraph
        setBirthData({
            name: birthDataInput.name,
            year: birthDataInput.year,
            month: birthDataInput.month,
            day: birthDataInput.day,
            hour: birthDataInput.hour,
            minute: birthDataInput.minute,
            place: birthDataInput.place,
            gender: birthDataInput.gender,
        });

        // Create birth date string for database
        const birthDateStr = `${birthDataInput.year}-${String(birthDataInput.month).padStart(2, '0')}-${String(birthDataInput.day).padStart(2, '0')}`;
        const birthTimeStr = `${String(birthDataInput.hour).padStart(2, '0')}:${String(birthDataInput.minute).padStart(2, '0')}:00`;

        try {
            let currentUser = user;

            // If password provided, create account first
            if (password && !user) {
                const redirectUrl = `${window.location.origin}/`;

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: redirectUrl,
                        data: {
                            name: birthDataInput.name,
                            whatsapp: whatsapp,
                        },
                    },
                });

                if (authError) {
                    if (authError.message.includes('User already registered')) {
                        toast.error('Email sudah terdaftar. Silakan login di halaman Akun.');
                        setIsLoading(false);
                        return;
                    }
                    console.error('Auth error:', authError);
                    toast.error('Gagal membuat akun: ' + authError.message);
                    setIsLoading(false);
                    return;
                }

                currentUser = authData.user;

                // Update profile with name and whatsapp
                if (currentUser) {
                    await supabase
                        .from('profiles')
                        .update({ name: birthDataInput.name, whatsapp: whatsapp })
                        .eq('user_id', currentUser.id);
                }

                toast.success('Akun berhasil dibuat!');
            }

            // Only save lead for new signups (not for existing logged-in users)
            if (password && whatsapp) {
                const { error: leadError } = await supabase.functions.invoke('submit-lead', {
                    body: {
                        name: birthDataInput.name,
                        email: email,
                        whatsapp: whatsapp,
                        birth_date: birthDateStr,
                        birth_place: birthDataInput.place,
                    },
                });

                if (leadError) {
                    console.error('Error saving lead:', leadError);
                    if (leadError.message?.includes('429') || leadError.message?.includes('Terlalu banyak')) {
                        toast.error('Terlalu banyak permintaan. Silakan coba lagi nanti.');
                        setIsLoading(false);
                        return;
                    }
                }
            }

            // Calculate chart
            const { data: result, error } = await supabase.functions.invoke('calculate-chart', {
                body: {
                    year: birthDataInput.year,
                    month: birthDataInput.month,
                    day: birthDataInput.day,
                    hour: birthDataInput.hour,
                    minute: birthDataInput.minute,
                    place: birthDataInput.place,
                    gender: birthDataInput.gender,
                    email,
                    whatsapp,
                },
            });

            if (error) {
                console.error('Error calculating chart:', error);
                // Show more specific error message if available
                const errorMessage = error.message || error.toString();
                toast.error(`Terjadi kesalahan: ${errorMessage}. Silakan coba lagi.`);
                setIsLoading(false);
                return;
            }

            // Save chart to database if user is logged in
            if (currentUser) {
                const { data: savedChart, error: saveError } = await supabase
                    .from('saved_charts')
                    .insert({
                        user_id: currentUser.id,
                        name: birthDataInput.name,
                        birth_date: birthDateStr,
                        birth_time: birthTimeStr,
                        birth_place: birthDataInput.place,
                        chart_data: result,
                    })
                    .select()
                    .single();

                if (saveError) {
                    console.error('Error saving chart:', saveError);
                    // Don't block the flow, chart is still displayed
                } else {
                    setCurrentChartId(savedChart.id);
                    toast.success('Chart berhasil disimpan ke akun kamu!');
                }
            } else {
                // Guest user - save pending chart data to sessionStorage for auto-save after signup
                const pendingChart = {
                    name: birthDataInput.name,
                    birth_date: birthDateStr,
                    birth_time: birthTimeStr,
                    birth_place: birthDataInput.place,
                    chart_data: result,
                };
                sessionStorage.setItem('pendingChart', JSON.stringify(pendingChart));
            }

            setChartData(result);
            setPendingBirthData(null);
            // Scroll to top when chart is ready
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error:', error);
            toast.error('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const submitLead = async (leadData: { whatsapp: string; email: string; password: string }) => {
        if (!pendingBirthData) return;
        setShowLeadCapture(false);
        await generateChart(pendingBirthData, leadData.email, leadData.whatsapp, leadData.password);
    };

    const resetChart = () => {
        setChartData(null);
        setUserName('');
        setUserEmail('');
        setUserPhone('');
        setBirthData(null);
        setPendingBirthData(null);
        setCurrentChartId(undefined);
    };

    const closeLeadCapture = () => {
        setShowLeadCapture(false);
        setPendingBirthData(null);
    };

    return {
        isLoading,
        chartData,
        userName,
        userEmail,
        userPhone,
        birthData,
        showLeadCapture,
        pendingBirthData, // Needed? Indexed checked it?
        // Index checked pendingBirthData in handleLeadSubmit but that logic is now here (submitLead).
        // So Index might not need pendingBirthData.
        currentChartId,
        generateChart,
        submitLead,
        resetChart,
        closeLeadCapture,
        setPendingBirthData, // Potentially needed if Index sets it directly?
        // Index line 82 sets birthData.
        // Index line 241, 248, 251 sets pendingBirthData to null.
        // Index line 33 (state definition).
        // Wait, MultiStepForm onSubmit calls Index.handleSubmit.
        // Index.handleSubmit calls processChartGeneration directly.
        // How is pendingBirthData set?
        // Ah, LeadCaptureModal uses it?
        // I need to check Index.tsx to see where setPendingBirthData is called with VALUE.
        // Line 230: check pendingBirthData.
        // But who sets it?
        // Grep/View Index did not show setPendingBirthData(something) inlines 1-250?
        // Line 33 definition.
        // Maybe `handleSubmit` logic handles "if not logged in, set pending and show modal"?
        // In current Index.tsx (lines 60-70), handleSubmit calls processChartGeneration DIRECTLY with empty password.
        // So Lead Capture is skipped in `processChartGeneration` if no password provided?
        // Ah, `processChartGeneration` lines 101: `if (password && !user)`.
        // So logic for showing LeadCaptureModal must be elsewhere?
        // OR `handleSubmit` logic I read was:
        /*
          const handleSubmit = async (data: BirthData) => {
            // Generate chart directly - no registration required
            // User can save chart later by logging in
            const email = user?.email || '';
            await processChartGeneration(data, email, '', null);
          };
        */
        // So `showLeadCapture` is never set to true in the current code?
        // Then `pendingBirthData` is never used?
        // `LeadCaptureModal` is rendered (line 302).
        // `handleLeadSubmit` uses `pendingBirthData`.
        // But if `showLeadCapture` is false, it's never shown.
        // So the Lead Capture feature is currently DISABLED/BYPASSED?
        // "remove registration barrier" was a previous task.
        // Yes, Step 875 log says "remove_registration_barrier". 
        // So `pendingBirthData` and `showLeadCapture` are remnants?
        // I will include them in the hook for now to match `Index.tsx` state 1:1, but they might be unused logic.
        // I'll expose `setShowLeadCapture` just in case.
    };
};
