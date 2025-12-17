import { DashboardShell, Header } from "@/components/layout";

export const metadata = {
    title: "Terms of Service - Twilight SmartBus",
    description: "Terms of Service for Twilight SmartBus Driver Payment Management System",
};

export default function TermsPage() {
    return (
        <DashboardShell>
            <Header title="Terms of Service" subtitle="Last updated: December 2024" />
            <div className="p-6 max-w-3xl">
                <div className="prose prose-slate dark:prose-invert prose-sm">
                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            By accessing or using the Twilight SmartBus Driver Payment Management System, you agree
                            to be bound by these Terms of Service. If you do not agree to these terms, please do not
                            use our services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">2. Use of Service</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            You agree to use this service only for lawful purposes and in accordance with these Terms.
                            You are responsible for maintaining the confidentiality of your account credentials and
                            for all activities that occur under your account.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">3. User Responsibilities</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            You are responsible for ensuring that all information you provide is accurate and up-to-date.
                            This includes driver details, trip records, and payment information. Inaccurate data may
                            result in incorrect payment calculations.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">4. Intellectual Property</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            All content, features, and functionality of this service are owned by Twilight SmartBus
                            and are protected by copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">5. Limitation of Liability</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Twilight SmartBus shall not be liable for any indirect, incidental, special, consequential,
                            or punitive damages resulting from your use of or inability to use the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">6. Modifications</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify users of any
                            material changes by posting the new Terms on this page with an updated revision date.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">7. Contact</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            For questions about these Terms of Service, please contact us at support@twilightbus.com.
                        </p>
                    </section>
                </div>
            </div>
        </DashboardShell>
    );
}
