import { ConfiguracoesLayout } from "@/components/configuracoes/ConfiguracoesLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { IntegracoesTab } from "@/components/configuracoes/IntegracoesTab";

const ConfiguracoesIntegracoes = () => {
  usePageTitle("Integrações");

  return (
    <ConfiguracoesLayout>
      <IntegracoesTab />
    </ConfiguracoesLayout>
  );
};

export default ConfiguracoesIntegracoes;
