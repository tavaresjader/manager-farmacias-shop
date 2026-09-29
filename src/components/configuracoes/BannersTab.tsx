import { useEffect, useRef, useState } from "react";
import { Plus, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BannerDetailsModal } from "./BannerDetailsModal";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { toast } from "sonner";

export interface Banner {
  id: string;
  nome: string;
  status: "ativo" | "inativo";
  imagem: string;
  posicao: number;
  url: string;
  fileName: string;
  fileBase64?: string;
  uploadFileName?: string;
}

interface BannerListApiResponse {
  id: string;
  name?: string | null;
  url?: string | null;
  active: boolean;
  fileUrl?: string | null;
  displayOrder: number;
}

interface BannerDetailsApiResponse extends BannerListApiResponse {
  fileName?: string | null;
}

interface BannerPayload {
  name: string;
  url: string | null;
  active: boolean;
  fileName?: string;
  fileBase64?: string;
  displayOrder: number;
}

function toBanner(banner: BannerListApiResponse | BannerDetailsApiResponse): Banner {
  return {
    id: banner.id,
    nome: banner.name?.trim() || "",
    status: banner.active ? "ativo" : "inativo",
    imagem: banner.fileUrl ?? "",
    posicao: banner.displayOrder,
    url: banner.url ?? "",
    fileName: "fileName" in banner ? banner.fileName ?? "" : "",
  };
}

function toBannerPayload(banner: Banner): BannerPayload {
  const payload: BannerPayload = {
    name: banner.nome.trim(),
    url: banner.url.trim() || null,
    active: banner.status === "ativo",
    displayOrder: banner.posicao,
  };

  if (banner.fileBase64) {
    payload.fileName = banner.uploadFileName || banner.fileName;
    payload.fileBase64 = banner.fileBase64;
  }

  return payload;
}

export function BannersTab() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [savingBanner, setSavingBanner] = useState(false);
  const [deletingBanner, setDeletingBanner] = useState(false);
  const detailsRequestId = useRef(0);

  const loadBanners = async () => {
    setLoadingBanners(true);
    const response = await managerBackendBff.get<BannerListApiResponse[]>("/v1/banners");

    if (response.data) {
      setBanners(response.data.map(toBanner));
    } else {
      setBanners([]);
      toast.error(`Erro ao carregar banners: ${response.error ?? "Tente novamente."}`);
    }

    setLoadingBanners(false);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchBanners = async () => {
      setLoadingBanners(true);
      const response = await managerBackendBff.get<BannerListApiResponse[]>("/v1/banners");

      if (cancelled) return;

      if (response.data) {
        setBanners(response.data.map(toBanner));
      } else {
        setBanners([]);
        toast.error(`Erro ao carregar banners: ${response.error ?? "Tente novamente."}`);
      }

      setLoadingBanners(false);
    };

    fetchBanners();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBannerClick = async (banner: Banner) => {
    const requestId = ++detailsRequestId.current;
    setSelectedBanner(banner);
    setBannerModalOpen(true);
    setLoadingDetails(true);

    const response = await managerBackendBff.get<BannerDetailsApiResponse>(
      `/v1/banners/${encodeURIComponent(banner.id)}`,
    );

    if (requestId !== detailsRequestId.current) return;

    if (response.data) {
      setSelectedBanner(toBanner(response.data));
    } else {
      setBannerModalOpen(false);
      toast.error(`Erro ao carregar banner: ${response.error ?? "Tente novamente."}`);
    }

    setLoadingDetails(false);
  };

  const handleDetailsModalOpenChange = (open: boolean) => {
    setBannerModalOpen(open);
    if (!open) {
      detailsRequestId.current += 1;
      setLoadingDetails(false);
      setSelectedBanner(null);
    }
  };

  const handleSaveBanner = async (updatedBanner: Banner) => {
    setSavingBanner(true);
    const response = await managerBackendBff.put<unknown>(
      `/v1/banners/${encodeURIComponent(updatedBanner.id)}`,
      toBannerPayload(updatedBanner),
    );

    setSavingBanner(false);

    if (response.error) {
      toast.error(`Erro ao atualizar banner: ${response.error}`);
      return false;
    }

    toast.success("Banner atualizado com sucesso.");
    await loadBanners();

    const detailsResponse = await managerBackendBff.get<BannerDetailsApiResponse>(
      `/v1/banners/${encodeURIComponent(updatedBanner.id)}`,
    );
    if (detailsResponse.data) setSelectedBanner(toBanner(detailsResponse.data));

    return true;
  };

  const handleCreateBanner = async (banner: Banner) => {
    setSavingBanner(true);
    const response = await managerBackendBff.post<unknown>("/v1/banners", toBannerPayload(banner));

    setSavingBanner(false);

    if (response.error) {
      toast.error(`Erro ao cadastrar banner: ${response.error}`);
      return false;
    }

    toast.success("Banner cadastrado com sucesso.");
    await loadBanners();
    return true;
  };

  const handleDeleteBanner = async (bannerId: string) => {
    setDeletingBanner(true);
    const response = await managerBackendBff.delete<unknown>(
      `/v1/banners/${encodeURIComponent(bannerId)}`,
    );

    setDeletingBanner(false);

    if (response.error) {
      toast.error(`Erro ao excluir banner: ${response.error}`);
      return false;
    }

    toast.success("Banner excluído com sucesso.");
    setBanners((prev) => prev.filter((banner) => banner.id !== bannerId));
    handleDetailsModalOpenChange(false);
    return true;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Banners</h2>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar banner
        </Button>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead>Posição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingBanners ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <div className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando banners...
                  </div>
                </TableCell>
              </TableRow>
            ) : banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Nenhum banner encontrado
                </TableCell>
              </TableRow>
            ) : banners.map((banner) => (
              <TableRow 
                key={banner.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleBannerClick(banner)}
              >
                <TableCell className="font-medium">{banner.nome}</TableCell>
                <TableCell>
                  <Badge variant={banner.status === "ativo" ? "default" : "secondary"}>
                    {banner.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {banner.imagem ? (
                    <a
                      href={banner.imagem}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                    <img 
                      src={banner.imagem} 
                      alt={banner.nome}
                      className="w-16 h-10 object-cover rounded border border-border hover:opacity-80 transition-opacity"
                    />
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">Sem imagem</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground font-medium text-sm">
                    {banner.posicao}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBannerClick(banner);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BannerDetailsModal
        open={bannerModalOpen}
        onOpenChange={handleDetailsModalOpenChange}
        banner={selectedBanner}
        onSave={handleSaveBanner}
        onDelete={handleDeleteBanner}
        loading={loadingDetails}
        saving={savingBanner}
        deleting={deletingBanner}
      />

      <BannerDetailsModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        banner={null}
        onSave={handleCreateBanner}
        saving={savingBanner}
      />
    </div>
  );
}
