import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import Logo from './Logo';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, phone, password);
      toast.success('Conta criada com sucesso!');
      navigate('/phone-verification');
    } catch (error) {
      toast.error('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex flex-col">
      {/* Header */}
      <div className="pt-4 px-4">
        <button
          onClick={() => navigate('/login')}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 pb-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
                <Logo showText={false} variant="light" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Criar Conta</h1>
            <p className="text-purple-200 text-sm">
              Preencha seus dados para começar
            </p>
          </div>

          {/* SignUp Form */}
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Maria Silva"
                    className="mt-1.5"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="mt-1.5"
                    autoComplete="tel"
                  />
                </div>

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
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 h-12"
                  disabled={loading}
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}