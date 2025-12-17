import { DashboardShell, Header } from "@/components/layout";

export const metadata = {
    title: "Privacy Policy - Twilight SmartBus",
    description: "Privacy Policy for Twilight SmartBus Driver Payment Management System",
};

export default function PrivacyPage() {
    return (
        <DashboardShell>
            <Header title="Privacy Policy" subtitle="Last updated: December 2024" />
            <div className="p-6 max-w-3xl">
                <div className="prose prose-slate dark:prose-invert prose-sm">
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">1. Information We Collect</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            We collect information you provide directly to us, such as when you create an account,
                            record trips, or manage driver payments. This includes names, contact information,
                            vehicle details, and payment records.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">2. How We Use Your Information</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            We use the information we collect to provide, maintain, and improve our services,
                            process transactions, send notifications about your account, and respond to your
                            comments and questions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">3. Data Security</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            We implement appropriate security measures to protect your personal information against
                            unauthorized access, alteration, disclosure, or destruction. All data is encrypted in
                            transit and at rest using industry-standard protocols.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">4. Data Retention</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            We retain your information for as long as your account is active or as needed to provide
                            you services. We will also retain and use your information as necessary to comply with
                            legal obligations and resolve disputes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">5. Your Rights</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            You have the right to access, update, or delete your personal information at any time.
                            You may also request a copy of your data or ask us to restrict processing of your information.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">6. Contact Us</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at
                            support@twilightbus.com.
                        </p>
                    </section>
                </div>
            </div>
        </DashboardShell>
    );
}
