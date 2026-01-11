import { z } from 'zod';

export const birthDataSchema = z.object({
    name: z.string().min(2, "Nama harus minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
    gender: z.enum(["male", "female"]),
    day: z.number().min(1).max(31),
    month: z.number().min(1).max(12),
    year: z.number().min(1900).max(new Date().getFullYear()),
    hour: z.number().min(0).max(23),
    minute: z.number().min(0).max(59),
    place: z.string().min(2, "Kota kelahiran wajib diisi"),
    honeypot: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export const leadDataSchema = z.object({
    email: z.string().email("Format email tidak valid"),
    whatsapp: z.string().min(9, "Nomor WhatsApp minimal 9 digit").max(15, "Nomor WhatsApp maksimal 15 digit").regex(/^\+?[0-9]*$/, "Hanya boleh angka"),
    password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
});

export type BirthDataInput = z.infer<typeof birthDataSchema>;
export type LeadDataInput = z.infer<typeof leadDataSchema>;
