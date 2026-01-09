import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BannerDetailsModal } from "./BannerDetailsModal";

export interface Banner {
  id: string;
  nome: string;
  status: "ativo" | "inativo";
  imagem: string;
  posicao: number;
}

const mockBanners: Banner[] = [
  {
    id: "1",
    nome: "Banner Principal",
    status: "ativo",
    imagem: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&h=60&fit=crop",
    posicao: 1,
  },
  {
    id: "2",
    nome: "Promoção de Verão",
    status: "ativo",
    imagem: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=60&fit=crop",
    posicao: 2,
  },
  {
    id: "3",
    nome: "Ofertas Especiais",
    status: "inativo",
    imagem: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&h=60&fit=crop",
    posicao: 3,
  },
  {
    id: "4",
    nome: "Novidades",
    status: "ativo",
    imagem: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=60&fit=crop",
    posicao: 4,
  },
];

export function BannersTab() {
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);

  const handleBannerClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setBannerModalOpen(true);
  };

  const handleSaveBanner = (updatedBanner: Banner) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === updatedBanner.id ? updatedBanner : b))
    );
    setSelectedBanner(updatedBanner);
  };

  const handleDeleteBanner = (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Banners</h2>
        <Button onClick={() => console.log("Adicionar banner")}>
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
            {banners.map((banner) => (
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
                  <a 
                    href="https://cdn.farmaciashop.com.br/banner.jpg" 
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
        onOpenChange={setBannerModalOpen}
        banner={selectedBanner}
        onSave={handleSaveBanner}
        onDelete={handleDeleteBanner}
      />
    </div>
  );
}
