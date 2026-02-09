import type { PasswordErrors } from "../types/PasswordErrors";

export function validateResetPassword(fields: {
    newPassword: string;
    confirmPassword: string;
}) {
    const errors: PasswordErrors = {
        newPassword: null,
        confirmPassword: null,
    };

    if (!fields.newPassword.trim()) {
        errors.newPassword = "Required";
    }

    if (!fields.confirmPassword.trim()) {
        errors.confirmPassword = "Required";
    }

    if (fields.newPassword.trim() && fields.confirmPassword.trim() && fields.newPassword !== fields.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    const isValid = Object.values(errors).every((e) => e === null);

    return { errors, isValid };
}