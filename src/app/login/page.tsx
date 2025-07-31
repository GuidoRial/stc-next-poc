import LoginForm from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen surface-50 flex align-items-center justify-content-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-900 mb-2">
            Sign In
          </h1>
          <p className="text-lg text-600">
            Welcome to Skilled Trades Connect
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}