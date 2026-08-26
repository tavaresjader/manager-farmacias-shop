import { ConfiguracoesLayout } from "@/components/configuracoes/ConfiguracoesLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { BannersTab } from "@/components/configuracoes/BannersTab";

const ConfiguracoesBanners = () => {
  usePageTitle("Banners");

  return (
    <ConfiguracoesLayout>
      <BannersTab />
    </ConfiguracoesLayout>
  );
};

export default ConfiguracoesBanners;
