import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Mail, Phone, FileText, Calendar, ShoppingBag, Edit, UserX, UserCheck, MapPin, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  segment: string;
  status: "active" | "inactive" | "pending";
  campaigns: number;
  totalSpent: number;
  createdAt: string;
  addresses: Address[];
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

  const handleEditAddress = (addressId: string) => {
    toast({
      title: "Editar endereço",
      description: "Funcionalidade de edição de endereço será implementada em breve.",
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    toast({
      title: "Endereço removido",
      description: "O endereço foi removido com sucesso.",
    });
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)] pr-4">
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
                <p className="text-sm text-muted-foreground">{client.document}</p>
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
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cidade / UF</p>
                    <p className="text-sm text-foreground">{client.segment}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Endereços */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Endereços</h4>
              {client.addresses && client.addresses.length > 0 ? (
                <div className="space-y-2">
                  {client.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-foreground">
                              {address.street}, {address.number}
                              {address.complement && ` - ${address.complement}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {address.neighborhood} - {address.city}/{address.state}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              CEP: {address.zipCode}
                            </p>
                            {address.isDefault && (
                              <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                Padrão
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditAddress(address.id)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado.</p>
              )}
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
