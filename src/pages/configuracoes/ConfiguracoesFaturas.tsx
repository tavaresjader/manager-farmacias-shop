import { ConfiguracoesLayout } from "@/components/configuracoes/ConfiguracoesLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FaturaTab } from "@/components/configuracoes/FaturaTab";

const ConfiguracoesFaturas = () => {
  usePageTitle("Minhas faturas");

  return (
    <ConfiguracoesLayout>
      <FaturaTab />
    </ConfiguracoesLayout>
  );
};

export default ConfiguracoesFaturas;
