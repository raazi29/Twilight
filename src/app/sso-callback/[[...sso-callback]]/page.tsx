export default function SSOCallback() {
    // This page handles the SSO callback
    // Clerk will automatically redirect after processing
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Completing sign in...</p>
            </div>
        </div>
    );
}
