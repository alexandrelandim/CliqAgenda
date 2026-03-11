import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronDown, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

// Country codes with flags
const countryCodes = [
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+1', country: 'EUA/Canadá', flag: '🇺🇸' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+34', country: 'Espanha', flag: '🇪🇸' },
  { code: '+33', country: 'França', flag: '🇫🇷' },
  { code: '+49', country: 'Alemanha', flag: '🇩🇪' },
  { code: '+39', country: 'Itália', flag: '🇮🇹' },
  { code: '+81', country: 'Japão', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+91', country: 'Índia', flag: '🇮🇳' },
  { code: '+61', country: 'Austrália', flag: '🇦🇺' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
];

export default function EditPhone() {
  const navigate = useNavigate();
  const { user, signup } = useAuth();
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+55');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Extract country code and phone from user's current phone
  useEffect(() => {
    if (user?.phone) {
      const phoneStr = user.phone;
      // Try to match country code
      const match = phoneStr.match(/^\+(\d{1,3})(\d+)$/);
      if (match) {
        const extractedCode = `+${match[1]}`;
        const extractedPhone = match[2];
        
        // Check if this country code exists in our list
        const countryExists = countryCodes.find(c => c.code === extractedCode);
        if (countryExists) {
          setCountryCode(extractedCode);
        }
        
        // Format the phone number for display
        setPhone(formatPhoneInput(extractedPhone));
      }
    }
  }, [user]);

  // Format phone number as user types (Brazilian format)
  const formatPhoneInput = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Apply Brazilian format: (XX) XXXXX-XXXX
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
    
    // Limit to 11 digits
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhone(formatted);
    
    // Clear error when user starts typing
    if (phoneError) setPhoneError('');
  };

  const validatePhone = () => {
    const digits = phone.replace(/\D/g, '');
    
    // Brazilian phone validation (11 digits: DDD + 9 digits)
    if (countryCode === '+55') {
      if (digits.length === 0) {
        setPhoneError('Digite o número de telefone');
        return false;
      }
      if (digits.length < 11) {
        setPhoneError('Número incompleto. Inclua o DDD + 9 dígitos');
        return false;
      }
    }
    
    setPhoneError('');
    return true;
  };

  const handleSave = async () => {
    if (!validatePhone()) {
      return;
    }

    setLoading(true);
    try {
      // Remove any country code the user might have entered
      let cleanPhone = phone.replace(/\D/g, '');
      
      // Remove common country code prefixes if user entered them
      if (cleanPhone.startsWith('55')) {
        cleanPhone = cleanPhone.substring(2);
      } else if (cleanPhone.startsWith('1') && cleanPhone.length === 11) {
        cleanPhone = cleanPhone.substring(1);
      }
      
      const fullPhone = countryCode + cleanPhone;
      
      // Update user phone (simulate API call)
      // In a real app, this would update the phone in the backend
      await signup(
        user?.name || '',
        user?.email || '',
        fullPhone,
        '' // Password not needed for update
      );
      
      toast.success('Telefone atualizado!');
      navigate('/phone-verification');
    } catch (error) {
      toast.error('Erro ao atualizar telefone');
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];

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
              Alterar Telefone
            </h1>
            <p className="text-purple-200 text-sm">
              Digite o número correto para receber o código
            </p>
          </div>

          {/* Phone Input */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div>
              <Label htmlFor="phone" className="text-white text-sm mb-2 block">
                Novo Telefone
              </Label>
              <div className="relative">
                {/* Country Code Selector */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCountryDropdown(!showCountryDropdown);
                  }}
                  className="absolute left-0 top-0 h-full px-3 flex items-center gap-1 border-r border-white/20 bg-white/10 hover:bg-white/20 transition-colors rounded-l-lg z-10"
                >
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span className="text-sm font-medium text-white">{countryCode}</span>
                  <ChevronDown className="w-4 h-4 text-white/70" />
                </button>
                
                {/* Dropdown */}
                {showCountryDropdown && (
                  <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {countryCodes.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setCountryCode(item.code);
                          setShowCountryDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-purple-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-2xl">{item.flag}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{item.country}</div>
                          <div className="text-xs text-gray-500">{item.code}</div>
                        </div>
                        {countryCode === item.code && (
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Phone Input */}
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 98765-4321"
                  className="pl-28 bg-white/90 border-white/20 focus:bg-white"
                  autoComplete="tel"
                />
                {phoneError && <p className="text-xs text-red-300 mt-2 font-medium">{phoneError}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full h-12 bg-white text-purple-700 hover:bg-gray-100 font-semibold"
            >
              {loading ? 'Salvando...' : 'Salvar e Continuar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
