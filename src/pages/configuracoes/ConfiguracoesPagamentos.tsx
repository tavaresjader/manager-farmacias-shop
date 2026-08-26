import { ConfiguracoesLayout } from "@/components/configuracoes/ConfiguracoesLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PagamentosTab } from "@/components/configuracoes/PagamentosTab";

const ConfiguracoesPagamentos = () => {
  usePageTitle("Pagamentos");

  return (
    <ConfiguracoesLayout>
      <PagamentosTab />
    </ConfiguracoesLayout>
  );
};

export default ConfiguracoesPagamentos;
