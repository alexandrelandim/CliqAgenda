import { useState, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function PhoneVerification() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const codeString = code.join('');
    if (codeString.length < 6) {
      toast.error('Digite o código completo');
      return;
    }

    setLoading(true);
    try {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Telefone verificado!');
      navigate('/onboarding');
    } catch (error) {
      toast.error('Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    toast.success('Novo código enviado!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex flex-col">
      {/* Header */}
      <div className="pt-4 px-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Icon */}
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verificar Telefone
            </h1>
            <p className="text-purple-200 text-sm mb-1">
              Enviamos um código via WhatsApp para
            </p>
            <p className="text-white font-medium">{user?.phone}</p>
          </div>

          {/* Code Input */}
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold bg-white/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:bg-white"
              />
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              disabled={loading || code.join('').length < 6}
              className="w-full h-12 bg-white text-purple-700 hover:bg-gray-100 font-semibold"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </Button>

            <button
              onClick={handleResend}
              className="w-full text-sm text-purple-200 hover:text-white transition-colors"
            >
              Não recebeu? <span className="underline font-medium">Reenviar código</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
