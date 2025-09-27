import { SignupForm } from '@/components/auth/signup-form';
import { Bot } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl md:grid md:grid-cols-2">
         <div className="hidden flex-col justify-between bg-primary p-8 text-primary-foreground md:flex">
          <div className="flex items-center gap-2 text-2xl font-bold font-headline">
            <Bot size={32} />
            TrustView
          </div>
          <p className="text-lg">
            Join the new standard in review authenticity. Get access to powerful AI tools to protect your brand and customers from misinformation.
          </p>
          <p className="text-sm opacity-70">&copy; 2024 TrustView Inc. All rights reserved.</p>
        </div>
        <div className="bg-card p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
