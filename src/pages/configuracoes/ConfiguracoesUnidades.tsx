import { ConfiguracoesLayout } from "@/components/configuracoes/ConfiguracoesLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { UnidadesTab } from "@/components/configuracoes/UnidadesTab";

const ConfiguracoesUnidades = () => {
  usePageTitle("Unidades");

  return (
    <ConfiguracoesLayout>
      <UnidadesTab />
    </ConfiguracoesLayout>
  );
};

export default ConfiguracoesUnidades;
