import { ConfiguracoesLayout } from "@/components/configuracoes/ConfiguracoesLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ContaTab } from "@/components/configuracoes/ContaTab";

const ConfiguracoesConta = () => {
  usePageTitle("Minha conta");

  return (
    <ConfiguracoesLayout>
      <ContaTab />
    </ConfiguracoesLayout>
  );
};

export default ConfiguracoesConta;
