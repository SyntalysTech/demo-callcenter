'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bot } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Demo mode - just redirect to dashboard
    setTimeout(() => {
      window.location.replace('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-brand-primary p-4 shadow-lg flex items-center justify-center">
            <Bot size={64} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          EnergyVoice AI
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Demo Mode - LocalStorage
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electronico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
              placeholder="demo@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contrasena
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
              placeholder="********"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-700">
              <strong>Modo Demo:</strong> No se requiere autenticacion real.
              Haz clic en el boton para acceder al dashboard.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-brand-text py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar al Demo'}
          </button>
        </form>
      </div>
    </div>
  );
}
