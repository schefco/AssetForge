export type UserErrors = {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: string | null;
    password: string | null;
};

export function validateUser(fields: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password?: string;
}) {
    const errors: UserErrors = {
        firstName: null,
        lastName: null,
        email: null,
        role: null,
        password: null,
    };

    // Required fields
    if (!fields.firstName.trim()) errors.firstName = "Required";
    if (!fields.lastName.trim()) errors.lastName = "Required";
    if (!fields.role.trim()) errors.role = "Required";
    // Only validate password when it's provided (e.g. during create)
    if (fields.password !== undefined) {
        if (!fields.password.trim()) errors.password = "Required";
    }

    // Email validation
    if (!fields.email.trim()) {
        errors.email = "Required";
    } else if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
        errors.email = "Invalid email format";
    }

    const isValid = Object.values(errors).every((e) => e === null);

    return { errors, isValid };
}