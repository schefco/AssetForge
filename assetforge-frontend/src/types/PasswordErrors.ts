export type PasswordErrors = {
    currentPassword?: string | null;
    newPassword: string | null;
    confirmPassword: string | null;
};