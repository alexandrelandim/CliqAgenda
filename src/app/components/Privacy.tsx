import { useNavigate } from 'react-router';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from './ui/button';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Política de Privacidade
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-4 py-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Introduction */}
          <div>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Última atualização:</strong> 10 de março de 2026
            </p>
            <p className="text-gray-700 leading-relaxed">
              A privacidade dos nossos usuários é extremamente importante para nós. Esta Política de Privacidade 
              descreve como o <strong>CliqAgenda</strong> coleta, usa, armazena e protege suas informações pessoais 
              em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Informações que Coletamos
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Para fornecer nossos serviços, coletamos as seguintes informações:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Dados de Cadastro:</strong> Nome, e-mail, telefone e senha
              </li>
              <li>
                <strong>Dados Profissionais:</strong> Serviços oferecidos, valores praticados e chave PIX (opcional)
              </li>
              <li>
                <strong>Dados de Clientes:</strong> Nomes e telefones dos clientes cadastrados por você
              </li>
              <li>
                <strong>Dados de Agendamentos:</strong> Datas, horários, endereços, valores e observações
              </li>
              <li>
                <strong>Fotos:</strong> Imagens de serviços realizados (upload voluntário)
              </li>
              <li>
                <strong>Dados de Uso:</strong> Informações sobre como você utiliza a plataforma
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. Como Usamos suas Informações
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Utilizamos seus dados exclusivamente para:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Fornecer e melhorar nossos serviços de agendamento</li>
              <li>Processar e gerenciar seus agendamentos e pagamentos</li>
              <li>Gerar mensagens personalizadas para seus clientes</li>
              <li>Enviar notificações importantes sobre o serviço</li>
              <li>Fornecer suporte técnico quando solicitado</li>
              <li>Melhorar a experiência do usuário na plataforma</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. Chave PIX e Dados Financeiros
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
              <p className="text-amber-900 text-sm">
                <strong>⚠️ Importante:</strong> A chave PIX cadastrada é usada <strong>apenas</strong> para gerar 
                mensagens de cobrança que <strong>você</strong> envia aos seus clientes.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-2">
              O CliqAgenda <strong>NÃO</strong>:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Processa pagamentos ou transações financeiras</li>
              <li>Tem acesso a contas bancárias ou senhas</li>
              <li>Armazena dados de cartões de crédito/débito</li>
              <li>Realiza cobranças automáticas em seu nome</li>
              <li>Compartilha sua chave PIX com terceiros</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. Compartilhamento de Dados
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Seus dados pessoais <strong>nunca</strong> serão vendidos ou compartilhados com terceiros para fins comerciais. 
              Podemos compartilhar informações apenas nos seguintes casos:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>
                <strong>Com seu consentimento explícito:</strong> Quando você autorizar expressamente
              </li>
              <li>
                <strong>Obrigação legal:</strong> Quando exigido por lei ou ordem judicial
              </li>
              <li>
                <strong>Prestadores de serviço:</strong> Empresas que nos auxiliam a operar a plataforma 
                (hospedagem, analytics), sempre com contratos de confidencialidade
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Segurança dos Dados
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Implementamos medidas técnicas e organizacionais para proteger seus dados:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Autenticação segura com verificação por SMS</li>
              <li>Acesso restrito aos dados apenas para pessoal autorizado</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares para prevenção de perda de dados</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Seus Direitos (LGPD)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              De acordo com a LGPD, você tem direito a:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><strong>Confirmação:</strong> Saber se processamos seus dados pessoais</li>
              <li><strong>Acesso:</strong> Solicitar cópia dos seus dados</li>
              <li><strong>Correção:</strong> Atualizar dados incompletos ou incorretos</li>
              <li><strong>Exclusão:</strong> Solicitar a remoção de seus dados</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação de Consentimento:</strong> Retirar autorização a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento de seus dados</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              Para exercer qualquer destes direitos, entre em contato através do e-mail{' '}
              <a href="mailto:privacidade@cliqagenda.com.br" className="text-purple-600 hover:underline font-medium">
                privacidade@cliqagenda.com.br
              </a>
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Retenção de Dados
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Mantemos seus dados pelo tempo necessário para fornecer nossos serviços ou conforme exigido por lei. 
              Quando você cancelar sua conta, seus dados serão excluídos em até <strong>30 dias</strong>, 
              exceto informações que precisamos manter por obrigação legal (registros fiscais, por exemplo).
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              8. Cookies e Tecnologias Similares
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma 
              e personalizar conteúdo. Você pode gerenciar as preferências de cookies nas configurações do seu navegador.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              9. Dados de Terceiros (Seus Clientes)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Você é o <strong>controlador</strong> dos dados de seus clientes cadastrados na plataforma. 
              É sua responsabilidade:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
              <li>Obter consentimento dos seus clientes para armazenar suas informações</li>
              <li>Informá-los sobre como seus dados serão usados</li>
              <li>Garantir a precisão das informações inseridas</li>
              <li>Respeitar o direito de seus clientes à privacidade</li>
            </ul>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              10. Alterações nesta Política
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações 
              significativas através do aplicativo ou por e-mail. Recomendamos revisar esta página regularmente.
            </p>
          </div>

          {/* Contact */}
          <div className="border-t pt-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              11. Encarregado de Dados (DPO)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Para questões relacionadas à proteção de dados pessoais, entre em contato com nosso Encarregado:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-1">
              <p className="text-gray-700">
                <strong>E-mail:</strong>{' '}
                <a href="mailto:dpo@cliqagenda.com.br" className="text-purple-600 hover:underline">
                  dpo@cliqagenda.com.br
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Suporte Geral:</strong>{' '}
                <a href="mailto:suporte@cliqagenda.com.br" className="text-purple-600 hover:underline">
                  suporte@cliqagenda.com.br
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pb-8">
          <Button
            onClick={() => navigate(-1)}
            className="bg-purple-600 hover:bg-purple-700 px-8"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}