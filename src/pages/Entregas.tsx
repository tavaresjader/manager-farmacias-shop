import { MainLayout } from "@/components/layout/MainLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { PageLoading } from "@/components/layout/PageLoading";

const Entregas = () => {
  usePageTitle("Entregas");
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Entregas</h1>
        </div>

        <p className="text-muted-foreground">Gerencie suas entregas aqui.</p>
      </div>
    </MainLayout>
  );
};

export default Entregas;
