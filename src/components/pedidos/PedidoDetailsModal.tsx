import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle, 
  XCircle, 
  Truck, 
  Package, 
  MapPin,
  User,
  Calendar,
  ShoppingBag,
  DollarSign,
  FileDown
} from "lucide-react";
import { toast } from "sonner";
import { CancelOrderModal } from "./CancelOrderModal";

import ifoodLogo from "@/assets/channels/ifood.webp";
import keetaLogo from "@/assets/channels/keeta.png";
import farmaciaShopLogo from "@/assets/channels/farmacia-shop.png";
import pedeProntoLogo from "@/assets/channels/pede-pronto.png";
import aiqfomeLogo from "@/assets/channels/aiqfome.jfif";

type Origem = "ifood" | "keeta" | "farmacia-shop" | "pede-pronto" | "aiqfome" | "unknown";

const origemLogos: Record<Origem, string> = {
  ifood: ifoodLogo,
  keeta: keetaLogo,
  "farmacia-shop": farmaciaShopLogo,
  "pede-pronto": pedeProntoLogo,
  aiqfome: aiqfomeLogo,
  unknown: farmaciaShopLogo,
};

const origemNames: Record<Origem, string> = {
  ifood: "iFood",
  keeta: "Keeta",
  "farmacia-shop": "Farmácia Shop",
  "pede-pronto": "Pede Pronto",
  aiqfome: "aiqfome",
  unknown: "Canal não informado",
};

interface PedidoItem {
  nome: string;
  quantidade: number;
  preco: number;
}

interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  telefone?: string;
  endereco?: string;
  data: string;
  status: "active" | "inactive" | "pending" | "processing" | "cancelled";
  statusLabel?: string;
  tipo?: "delivery" | "retirada";
  total: number;
  taxaEntrega?: number;
  itens: number;
  items?: PedidoItem[];
  hasPrescription?: boolean;
  origem?: Origem;
  origemLogoUrl?: string;
  origemLabel?: string;
  unidade?: string;
}

interface PedidoDetailsModalProps {
  pedido: Pedido | null;
  loading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export function PedidoDetailsModal({ 
  pedido, 
  loading = false,
  open, 
  onOpenChange 
}: PedidoDetailsModalProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(() => {
    setIsTracking(false);
    setCancelModalOpen(false);
  }, [pedido?.id]);

  if (!pedido) return null;

  const items = pedido.items ?? [];
  const taxaEntrega = pedido.taxaEntrega ?? 0;
  const subtotal = Math.max(pedido.total - taxaEntrega, 0);

  const handleConfirmar = () => {
    toast.success(`Pedido ${pedido.numero} confirmado com sucesso!`);
    onOpenChange(false);
  };

  const handleCancelar = () => {
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = (reason: string) => {
    toast.error(`Pedido ${pedido.numero} cancelado.`);
    onOpenChange(false);
  };

  const handleDespachar = () => {
    toast.success(`Pedido ${pedido.numero} despachado para entrega!`);
    onOpenChange(false);
  };

  const handleEntregar = () => {
    toast.success(`Pedido ${pedido.numero} marcado como entregue!`);
    onOpenChange(false);
  };

  const handleAcompanhar = () => {
    setIsTracking(true);
    toast.info("Abrindo rastreamento em tempo real...");
  };

  const handleDownloadReceita = () => {
    toast.success("Download da receita iniciado!");
    // In a real app, this would trigger a file download
  };

  const ReceitaButton = () => pedido.hasPrescription ? (
    <Button
      variant="outline"
      onClick={handleDownloadReceita}
      className="gap-2"
    >
      <FileDown className="w-4 h-4" />
      Receita
    </Button>
  ) : null;

  const getActionButtons = () => {
    if (loading) return null;

    switch (pedido.status) {
      case "pending":
        return (
          <>
            <ReceitaButton />
            <Button 
              variant="outline" 
              onClick={handleCancelar}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <XCircle className="w-4 h-4" />
              Cancelar
            </Button>
            <Button onClick={handleConfirmar} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Confirmar
            </Button>
          </>
        );
      case "active":
        return (
          <>
            <ReceitaButton />
            <Button 
              variant="outline" 
              onClick={handleCancelar}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <XCircle className="w-4 h-4" />
              Cancelar
            </Button>
            <Button onClick={handleDespachar} className="gap-2">
              <Truck className="w-4 h-4" />
              Despachar
            </Button>
          </>
        );
      case "processing":
        return (
          <>
            <ReceitaButton />
            <Button 
              variant="outline" 
              onClick={handleAcompanhar}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" />
              Acompanhar Entregador
            </Button>
            <Button onClick={handleEntregar} className="gap-2">
              <Package className="w-4 h-4" />
              Confirmar Entrega
            </Button>
          </>
        );
      case "inactive":
        return (
          <>
            <ReceitaButton />
            <Button variant="outline" disabled className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Pedido Entregue
            </Button>
          </>
        );
      case "cancelled":
        return (
          <Button variant="outline" disabled className="gap-2 text-destructive">
            <XCircle className="w-4 h-4" />
            Pedido Cancelado
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Pedido {pedido.numero}</span>
            {pedido.unidade && (
              <span className="text-sm font-normal text-muted-foreground">
                — {pedido.unidade}
              </span>
            )}
            {pedido.origem && (
              <div className="flex items-center gap-2">
                <img 
                  src={pedido.origemLogoUrl || origemLogos[pedido.origem]} 
                  alt={pedido.origemLabel || origemNames[pedido.origem]} 
                  className="w-6 h-6 rounded object-cover"
                />
                <span className="text-sm font-normal text-muted-foreground">
                  #{pedido.numero.slice(-4).padStart(4, '0')}
                </span>
              </div>
            )}
            <span className="text-muted-foreground">|</span>
            <StatusBadge status={pedido.status} label={pedido.statusLabel} />
            {pedido.tipo && (
              <span className="text-sm font-normal text-muted-foreground">
                | {pedido.tipo === "delivery" ? "Delivery" : "Retirada"}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {loading ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-44" />
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-36" />
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-10/12" />
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <>
          {/* Informações do Cliente */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Informações do Cliente
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Nome:</span>{" "}
                <span className="font-medium">{pedido.cliente}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Telefone:</span>{" "}
                <span className="font-medium">{pedido.telefone || "Não informado"}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Endereço:</span>{" "}
                <span className="font-medium">{pedido.endereco || "Não informado"}</span>
              </p>
            </div>
          </div>

          {/* Informações do Pedido */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              Itens do Pedido
            </h3>
            <div className="bg-muted/50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Produto</th>
                    <th className="text-center p-3 text-xs font-medium text-muted-foreground">Qtd</th>
                    <th className="text-right p-3 text-xs font-medium text-muted-foreground">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-sm text-muted-foreground">
                        Nenhum item informado
                      </td>
                    </tr>
                  ) : items.map((item, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="p-3 text-sm">{item.nome}</td>
                      <td className="p-3 text-sm text-center">{item.quantidade}</td>
                      <td className="p-3 text-sm text-right font-medium">
                        {formatCurrency(item.preco)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* Resumo */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Resumo do Pedido
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxa de entrega:</span>
                <span>{formatCurrency(taxaEntrega)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-primary text-lg">
                  {formatCurrency(pedido.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Pedido realizado em {pedido.data}</span>
          </div>

          {/* Mapa de Acompanhamento */}
          {isTracking && pedido.status === "processing" && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Acompanhamento em Tempo Real
                </h3>
                <div className="bg-muted/50 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MapPin className="w-12 h-12 text-primary mx-auto animate-bounce" />
                    <p className="text-sm text-muted-foreground">
                      Entregador a caminho...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Previsão de chegada: 15 minutos
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
            </>
          )}
        </div>

        {!loading && (
          <DialogFooter className="mt-4 pt-4 border-t gap-2 sm:gap-0 flex-shrink-0">
            {getActionButtons()}
          </DialogFooter>
        )}
      </DialogContent>

      <CancelOrderModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        orderNumber={pedido.numero}
        onConfirm={handleConfirmCancel}
      />
    </Dialog>
  );
}
