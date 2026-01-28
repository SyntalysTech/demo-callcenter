'use client';

import { UserCog, Shield } from 'lucide-react';

export default function UsuariosPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">Gestiona los usuarios y sus roles</p>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-100 rounded-full">
            <Shield size={24} className="text-yellow-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-yellow-800">Modo Demo</h2>
            <p className="text-yellow-700 mt-1">
              La gestión de usuarios requiere autenticación con Supabase.
              En el modo demo, esta funcionalidad está deshabilitada.
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Usuario</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rol</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <span className="text-brand-primary font-medium">D</span>
                  </div>
                  <span className="font-medium text-gray-900">Demo User</span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">demo@example.com</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                  Administrador
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                  Activo
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
