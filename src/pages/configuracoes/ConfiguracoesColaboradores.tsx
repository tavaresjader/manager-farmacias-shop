import { ConfiguracoesLayout } from "@/components/configuracoes/ConfiguracoesLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ColaboradoresTab } from "@/components/configuracoes/ColaboradoresTab";

const ConfiguracoesColaboradores = () => {
  usePageTitle("Colaboradores");

  return (
    <ConfiguracoesLayout>
      <ColaboradoresTab />
    </ConfiguracoesLayout>
  );
};

export default ConfiguracoesColaboradores;
