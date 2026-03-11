import { useNavigate } from 'react-router';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from './ui/button';

export default function Terms() {
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
              <FileText className="w-5 h-5" />
              Termos de Uso
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
              Bem-vindo ao <strong>CliqAgenda</strong>! Ao utilizar nossa plataforma, você concorda com os seguintes termos e condições. 
              Por favor, leia-os atentamente antes de usar nossos serviços.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              1. Aceitação dos Termos
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Ao criar uma conta no CliqAgenda, você concorda em cumprir e estar sujeito a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              2. Descrição do Serviço
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              O CliqAgenda é uma plataforma de agendamento e gestão de serviços voltada para profissionais autônomos 
              (manicures, cabeleireiros, massagistas, etc.). Oferecemos ferramentas para:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Agendar compromissos com clientes</li>
              <li>Gerenciar pagamentos pendentes e recebidos</li>
              <li>Criar mensagens personalizadas para WhatsApp</li>
              <li>Manter histórico de clientes e serviços prestados</li>
              <li>Upload de fotos dos serviços realizados</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              3. Responsabilidades do Usuário
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Ao utilizar o CliqAgenda, você concorda em:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Fornecer informações precisas e atualizadas durante o cadastro</li>
              <li>Manter a confidencialidade de sua senha e conta</li>
              <li>Não utilizar o serviço para fins ilegais ou não autorizados</li>
              <li>Ser o único responsável pelos dados de seus clientes inseridos na plataforma</li>
              <li>Cumprir todas as leis aplicáveis de proteção de dados (LGPD)</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              4. Uso da Chave PIX
            </h2>
            <p className="text-gray-700 leading-relaxed">
              A chave PIX cadastrada em sua conta é utilizada <strong>exclusivamente</strong> para gerar mensagens 
              de cobrança que serão enviadas por você aos seus clientes. O CliqAgenda <strong>não</strong>:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
              <li>Processa pagamentos diretamente</li>
              <li>Tem acesso aos seus dados bancários</li>
              <li>Armazena informações financeiras sensíveis</li>
              <li>Realiza transações em seu nome</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              5. Propriedade Intelectual
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Todo o conteúdo disponibilizado no CliqAgenda, incluindo design, código, logos e textos, 
              é de propriedade exclusiva da plataforma e está protegido por leis de direitos autorais. 
              Você não pode copiar, reproduzir ou distribuir qualquer parte do serviço sem autorização prévia.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              6. Limitação de Responsabilidade
            </h2>
            <p className="text-gray-700 leading-relaxed">
              O CliqAgenda fornece a plataforma "como está" e não garante que o serviço será ininterrupto ou livre de erros. 
              Não nos responsabilizamos por:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
              <li>Perda de dados ou informações</li>
              <li>Problemas na comunicação com seus clientes</li>
              <li>Conflitos relacionados a pagamentos ou serviços prestados</li>
              <li>Uso indevido da plataforma por terceiros</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              7. Modificações dos Termos
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
              As alterações entrarão em vigor imediatamente após a publicação na plataforma. 
              É sua responsabilidade revisar periodicamente estes termos.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              8. Cancelamento de Conta
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Você pode cancelar sua conta a qualquer momento através das configurações do aplicativo. 
              Ao cancelar, seus dados serão excluídos conforme nossa Política de Privacidade.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              9. Lei Aplicável
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
              Qualquer disputa relacionada a estes termos será resolvida nos tribunais brasileiros.
            </p>
          </div>

          {/* Contact */}
          <div className="border-t pt-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              10. Contato
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do e-mail:{' '}
              <a href="mailto:suporte@cliqagenda.com.br" className="text-purple-600 hover:underline font-medium">
                suporte@cliqagenda.com.br
              </a>
            </p>
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