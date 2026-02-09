export type ProfileErrors = {
    firstName: string | null,
    lastName: string | null,
    notificationEmail: string | null,
};

export function validateProfile(fields: {
    firstName: string;
    lastName: string;
    notificationEmail: string;
}) {
    const errors: ProfileErrors = {
        firstName: null,
        lastName: null,
        notificationEmail: null,
    };

    // Required fields
    if (!fields.firstName.trim()) errors.firstName = "Required";
    if (!fields.lastName.trim()) errors.lastName = "Required";

    // Email validation
    if (!fields.notificationEmail.trim()) {
        errors.notificationEmail = "Required";
    } else if (!/^\S+@\S+\.\S+$/.test(fields.notificationEmail)) {
        errors.notificationEmail = "Invalid email format";
    }

    const isValid = Object.values(errors).every((e) => e === null);

    return { errors, isValid };
}