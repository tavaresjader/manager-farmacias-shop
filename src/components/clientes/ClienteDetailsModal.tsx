import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Mail, Phone, Building2, Calendar, ShoppingBag, Edit, UserX, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  segment: string;
  status: "active" | "inactive" | "pending";
  campaigns: number;
  totalSpent: number;
  createdAt: string;
}

interface ClienteDetailsModalProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClienteDetailsModal({ client, open, onOpenChange }: ClienteDetailsModalProps) {
  const { toast } = useToast();

  if (!client) return null;

  const handleEdit = () => {
    toast({
      title: "Editar cliente",
      description: "Funcionalidade de edição será implementada em breve.",
    });
  };

  const handleToggleStatus = () => {
    const newStatus = client.status === "active" ? "inativado" : "ativado";
    toast({
      title: `Cliente ${newStatus}`,
      description: `O cliente ${client.name} foi ${newStatus} com sucesso.`,
    });
    onOpenChange(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com avatar e info principal */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">
                {getInitials(client.name)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{client.name}</h3>
              <p className="text-sm text-muted-foreground">{client.company}</p>
              <div className="mt-1">
                <StatusBadge
                  status={client.status}
                  label={
                    client.status === "active"
                      ? "Ativo"
                      : client.status === "inactive"
                      ? "Inativo"
                      : "Pendente"
                  }
                />
              </div>
            </div>
          </div>

          {/* Informações de contato */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Informações de Contato</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">E-mail</p>
                  <p className="text-sm text-foreground">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="text-sm text-foreground">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Segmento</p>
                  <p className="text-sm text-foreground">{client.segment}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Total em Compras</p>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {client.totalSpent.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Cliente desde</p>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {new Date(client.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleEdit}>
              <Edit className="w-4 h-4" />
              Editar
            </Button>
            {client.status === "active" ? (
              <Button
                variant="outline"
                className="flex-1 gap-2 text-destructive hover:text-destructive"
                onClick={handleToggleStatus}
              >
                <UserX className="w-4 h-4" />
                Inativar
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex-1 gap-2 text-green-600 hover:text-green-600"
                onClick={handleToggleStatus}
              >
                <UserCheck className="w-4 h-4" />
                Ativar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
