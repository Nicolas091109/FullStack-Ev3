import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Mail, Lock, Heart, CheckCircle2, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'register' && !name.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!email.trim()) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    try {
      if (activeTab === 'login') {
        const result = await login(email, password);
        if (result.success) {
          if (result.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/usuario/reportes');
          }
        } else {
          setError('Credenciales incorrectas o error al iniciar sesión.');
        }
      } else {
        const result = await register(email, password, name.trim());
        if (result.success) {
          setActiveTab('login');
          setError('');
          alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        } else {
          setError('Ha ocurrido un error al registrar el usuario.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ha ocurrido un error inesperado.');
    }
  };

  const autofillCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@test.com');
      setPassword('admin123');
    } else {
      setEmail('bruno@test.com');
      setPassword('bruno123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FDFBF7]">
      
      {/* Container Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-5xl bg-white rounded-[24px] overflow-hidden shadow-sm border border-[#E9E1D4] grid grid-cols-1 md:grid-cols-2"
      >
        
        {/* Left column: Beautiful Illustration / Marketing Banner */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-brand-primary text-white relative overflow-hidden">
          
          {/* Circular abstract shapes */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#7C8B7F]/10 rounded-full blur-3xl"></div>
 
          {/* Top content */}
          <div className="flex items-center space-x-2 z-10">
            <div className="p-2 bg-brand-tertiary rounded-xl text-brand-primary">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <span className="font-serif italic font-bold text-xl tracking-wide">Sanos y Salvos</span>
          </div>
 
          {/* Vector mascot illustration or beautiful styled block */}
          <div className="my-auto space-y-6 z-10 relative">
            <h1 className="text-3xl lg:text-4xl font-serif italic leading-tight tracking-tight text-[#FDFBF7]">
              Bienvenido de vuelta a la comunidad
            </h1>
            <p className="text-[#E9E1D4] text-sm leading-relaxed">
              Ayudamos a reunir a las familias con sus compañeros más leales de manera confiable, rápida y solidaria. Tu colaboración es vital para mantener sanas y salvas a las mascotas de tu vecindario.
            </p>
            
            <div className="pt-6">
              <p className="text-sm text-[#E9E1D4]/80 leading-relaxed font-sans font-semibold">
                Nuestra mision es ayudar a la comunidad chilena a reportar, geolocalizar y rescatar mascotas perdidas mediante un canal rapido, unificado y solidario.
              </p>
            </div>
          </div>
 
          {/* Footer stats */}
          <div className="text-xs text-[#E9E1D4]/70 border-t border-brand-primary-hover pt-4 z-10">
            © 2026 Sanos y Salvos. Uniendo familias, una mascota a la vez.
          </div>
        </div>
 
        {/* Right column: Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
          
          {/* Header Switch tabs */}
          <div className="flex p-1.5 bg-brand-primary-light border border-[#E9E1D4] rounded-2xl mb-8">
            <button 
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-secondary hover:text-brand-primary'
              }`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-secondary hover:text-brand-primary'
              }`}
            >
              Crear Cuenta
            </button>
          </div>
 
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif text-brand-primary italic">
                {activeTab === 'login' ? 'Ingresa a tu cuenta' : 'Únete a la comunidad'}
              </h2>
              <p className="text-xs text-brand-secondary mt-1">
                {activeTab === 'login' 
                  ? 'Ingresa tus credenciales para administrar o levantar reportes.' 
                  : 'Registra tus datos para empezar a levantar y ver reportes de mascotas.'}
              </p>
            </div>
 
            {/* Error Banner */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 text-brand-accent text-xs font-semibold border border-red-100 rounded-2xl flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent block flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
 
            <form onSubmit={handleSubmit} className="space-y-4">
              

 
              {/* Name Control (only for register) */}
              {activeTab === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block px-1">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-secondary">
                      <User className="h-4 w-4" />
                    </div>
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 h-11 bg-[#FDFBF7] text-[#2D2D2D] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all text-xs font-medium"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>
              )}

              {/* Email Control */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block px-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-secondary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 h-11 bg-[#FDFBF7] text-[#2D2D2D] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all text-xs font-medium"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
 
              {/* Password Control */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider block px-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-secondary">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-10 h-11 bg-[#FDFBF7] text-[#2D2D2D] border border-[#E9E1D4] rounded-xl focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all text-xs font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-secondary hover:text-brand-primary cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
 
              {activeTab === 'login' && (
                <div className="flex items-center justify-between text-[11px] py-1">
                  <label className="flex items-center space-x-2 text-brand-secondary cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#E9E1D4] text-brand-primary focus:ring-brand-primary h-4 w-4"
                    />
                    <span>Recordarme en este dispositivo</span>
                  </label>
                  <a href="#reset" onClick={(e) => { e.preventDefault(); setError('La simulación de restauración de contraseña está activa. Pruebe a ingresar directamente.'); }} className="font-bold text-brand-accent hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}
 
              {/* Submit Action */}
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full h-11 bg-brand-primary hover:bg-brand-primary-hover text-[#FDFBF7] font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer mt-4"
              >
                <span>{activeTab === 'login' ? 'Ingresar a la Plataforma' : 'Crear mi Cuenta'}</span>
              </motion.button>
            </form>
 
            <div className="text-center text-[10px] text-brand-secondary pt-3 leading-relaxed">
              Al continuar aceptas los Términos de Servicio y las Políticas de Privacidad de "Sanos y Salvos" Chile.
            </div>
 
          </div>
        </div>

      </motion.div>
    </div>
  );
};
