import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import type { User } from "../types/User";
import type { ProfileErrors } from "../utils/validateProfile";
import { validateProfile } from "../utils/validateProfile";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

type ToggleProps = {
    enabled: boolean;
    onChange: (value: boolean) => void;
};

export default function AccountPage() {
    const user = useAuthStore(state => state.user);
    const setUser = useAuthStore(state => state.setUser);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        notificationEmail: "",
    });

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [inAppNotifications, setInAppNotifications] = useState(true);

    const [errors, setErrors] = useState<ProfileErrors>({
        firstName: null,
        lastName: null,
        notificationEmail: null,
    });

    const fetchUser = useCallback(async () => {
        const res = await api.get<User>("auth/me");
        setUser(res.data);
        setForm({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            notificationEmail: res.data.notificationEmail,
        });
        setLoading(false);
    }, [setUser]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        const saved = localStorage.getItem("notificationPrefs");
        if (saved) {
            const prefs = JSON.parse(saved);
            setEmailNotifications(prefs.emailNotifications);
            setInAppNotifications(prefs.inAppNotifications);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const firstName = form.firstName.trim();
        const lastName = form.lastName.trim();
        const notificationEmail = form.notificationEmail.trim();

        const {errors, isValid} = validateProfile({
            firstName,
            lastName,
            notificationEmail,
        });

        setErrors(errors);

        if (!isValid) {
            toast.error("Please fix errors before submitting");
            setLoading(false);
            return;
        }

        const updated = {
            firstName,
            lastName,
            notificationEmail,
        };

        try {
            const res = await api.put(`/users/${user?.id}`, updated)
            setUser(res.data);
            toast.success("Profile updated successfully");
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    // Saving Notification Preferences locally
    function handlePreferencesSave() {
        const prefs = {
            emailNotifications,
            inAppNotifications
        };

        localStorage.setItem("notificationPrefs", JSON.stringify(prefs));
    }

    const clearErrors = (field: keyof ProfileErrors) => {
        setErrors((prev) => ({...prev, [field]: null}));
    }

    // Function for smooth transition toggle for In-App preferences
    function Toggle({ enabled, onChange }: ToggleProps) {
        return (
            <button type="button"
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                enabled ? "bg-blue-600" : "bg-gray-300"
                }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    enabled ? "translate-x-6" : "translate-x-1"
                    }`}/>
                </button>
        );
    }

    return (
        <>
        <div className="flex flex-col gap-6 mb-6">
            <h1 className="text-3xl font-semibold mb-6">Account</h1>

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold">Profile Information</h2>

                <div className="grid gird-cols-1 md:grid-cols-2 gap-4">
                    <input name="firstName"
                    className="border rounded px-3 py-2"
                    value={form.firstName}
                    disabled={loading}
                    onChange={(e) => {
                        handleChange(e);
                        clearErrors("firstName");
                    }}/>
                    {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}

                    <input name="lastName"
                    className="border rounded px-3 py-2"
                    value={form.lastName}
                    disabled={loading}
                    onChange={(e) => {
                        handleChange(e);
                        clearErrors("lastName");
                    }}/>
                    {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                </div>

                <input name="notificationEmail"
                className="border rounded px-3 py-2 w-full"
                value={form.notificationEmail}
                disabled={loading}
                onChange={(e) => {
                    handleChange(e);
                    clearErrors("notificationEmail");
                }}/>
                {errors.notificationEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.notificationEmail}</p>
                )}

                <button onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h2 className="text-xl font-semibold">Notification Preferences</h2>

                <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <Toggle enabled={emailNotifications} onChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                    <span>In-App Notifications</span>
                    <Toggle enabled={inAppNotifications} onChange={setInAppNotifications}/>
                </div>

                <button onClick={handlePreferencesSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold">Security</h2>

                <button type="button"
                onClick={() => navigate(`/change-password`)}
                className="text-blue-600 hover:underline">Change Password</button>
            </div>
        </div>
        </>
    );
}