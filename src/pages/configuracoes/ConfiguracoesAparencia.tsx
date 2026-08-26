import { ConfiguracoesLayout } from "@/components/configuracoes/ConfiguracoesLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { AparenciaTab } from "@/components/configuracoes/AparenciaTab";

const ConfiguracoesAparencia = () => {
  usePageTitle("Aparência");

  return (
    <ConfiguracoesLayout>
      <AparenciaTab />
    </ConfiguracoesLayout>
  );
};

export default ConfiguracoesAparencia;
