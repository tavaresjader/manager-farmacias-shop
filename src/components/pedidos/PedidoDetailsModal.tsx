import { useState } from "react";
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
  Store
} from "lucide-react";
import { toast } from "sonner";

import ifoodLogo from "@/assets/channels/ifood.webp";
import keetaLogo from "@/assets/channels/keeta.png";
import farmaciaShopLogo from "@/assets/channels/farmacia-shop.png";
import pedeProntoLogo from "@/assets/channels/pede-pronto.png";
import aiqfomeLogo from "@/assets/channels/aiqfome.jfif";

type Canal = "ifood" | "keeta" | "farmacia-shop" | "pede-pronto" | "aiqfome";

const channelLogos: Record<Canal, string> = {
  ifood: ifoodLogo,
  keeta: keetaLogo,
  "farmacia-shop": farmaciaShopLogo,
  "pede-pronto": pedeProntoLogo,
  aiqfome: aiqfomeLogo,
};

const channelNames: Record<Canal, string> = {
  ifood: "iFood",
  keeta: "Keeta",
  "farmacia-shop": "Farmácia Shop",
  "pede-pronto": "Pede Pronto",
  aiqfome: "aiqfome",
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
  data: string;
  status: "active" | "inactive" | "pending" | "processing" | "cancelled";
  total: number;
  itens: number;
  canal?: Canal;
}

interface PedidoDetailsModalProps {
  pedido: Pedido | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock items for the order
const mockItems: PedidoItem[] = [
  { nome: "Dipirona 500mg - 20 comprimidos", quantidade: 2, preco: 12.90 },
  { nome: "Vitamina C 1g - 30 comprimidos", quantidade: 1, preco: 35.50 },
  { nome: "Protetor Solar FPS 50", quantidade: 1, preco: 89.90 },
];

export function PedidoDetailsModal({ 
  pedido, 
  open, 
  onOpenChange 
}: PedidoDetailsModalProps) {
  const [isTracking, setIsTracking] = useState(false);

  if (!pedido) return null;

  const handleConfirmar = () => {
    toast.success(`Pedido ${pedido.numero} confirmado com sucesso!`);
    onOpenChange(false);
  };

  const handleCancelar = () => {
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

  const getActionButtons = () => {
    switch (pedido.status) {
      case "pending":
        return (
          <>
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
          <Button variant="outline" disabled className="gap-2">
            <CheckCircle className="w-4 h-4" />
            Pedido Entregue
          </Button>
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
            {pedido.canal && (
              <div className="flex items-center gap-2">
                <img 
                  src={channelLogos[pedido.canal]} 
                  alt={channelNames[pedido.canal]} 
                  className="w-6 h-6 rounded object-cover"
                />
                <span className="text-sm font-normal text-muted-foreground">
                  #{pedido.numero.slice(-4).padStart(4, '0')}
                </span>
              </div>
            )}
            <span className="text-muted-foreground">|</span>
            <StatusBadge status={pedido.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
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
                <span className="font-medium">(11) 99999-9999</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Endereço:</span>{" "}
                <span className="font-medium">Rua das Flores, 123 - Centro, São Paulo - SP</span>
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
                  {mockItems.map((item, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="p-3 text-sm">{item.nome}</td>
                      <td className="p-3 text-sm text-center">{item.quantidade}</td>
                      <td className="p-3 text-sm text-right font-medium">
                        {(item.preco * item.quantidade).toLocaleString("pt-BR", { 
                          style: "currency", 
                          currency: "BRL" 
                        })}
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
                <span>{(pedido.total - 8.90).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxa de entrega:</span>
                <span>R$ 8,90</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-primary text-lg">
                  {pedido.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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
        </div>

        <DialogFooter className="mt-4 pt-4 border-t gap-2 sm:gap-0 flex-shrink-0">
          {getActionButtons()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
