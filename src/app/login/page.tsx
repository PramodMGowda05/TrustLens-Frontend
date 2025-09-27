import { LoginForm } from '@/components/auth/login-form';
import { Bot } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl md:grid md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-primary p-8 text-primary-foreground md:flex">
          <div className="flex items-center gap-2 text-2xl font-bold font-headline">
            <Bot size={32} />
            TrustView
          </div>
          <p className="text-lg">
            Unveiling the truth behind every review. Our advanced AI-powered platform helps you identify fake reviews and build trust with your customers.
          </p>
          <p className="text-sm opacity-70">&copy; 2024 TrustView Inc. All rights reserved.</p>
        </div>
        <div className="bg-card p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
