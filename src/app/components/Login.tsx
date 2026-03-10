import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import Logo from './Logo';
import { Apple } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = () => {
    toast.info('Login com Apple ID em desenvolvimento');
    // Aqui seria implementada a integração com Apple Sign In
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-3xl">
              <Logo showText={false} variant="light" className="scale-150" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CliqAgenda</h1>
          <p className="text-purple-200 text-sm">
            Simplifique seus agendamentos.
            <br />
            Não perca nenhum pagamento.
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-1.5"
                  autoComplete="email"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 h-12"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Apple Sign In */}
            <Button
              type="button"
              onClick={handleAppleLogin}
              variant="outline"
              className="w-full h-12 border-gray-300 hover:bg-gray-50"
            >
              <Apple className="w-5 h-5 mr-2" fill="currentColor" />
              Entrar com Apple
            </Button>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/signup')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Não tem uma conta? <span className="underline">Criar conta</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Demo info */}
        <div className="text-center">
          <p className="text-xs text-purple-200">
            Use qualquer e-mail e senha para testar
          </p>
        </div>
      </div>
    </div>
  );
}
