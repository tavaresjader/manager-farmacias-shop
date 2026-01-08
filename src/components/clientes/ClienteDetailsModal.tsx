import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Mail, Phone, FileText, Calendar, ShoppingBag, Edit, UserX, UserCheck, MapPin, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressEditModal } from "./AddressEditModal";

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
  status: "active" | "inactive";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (client) {
      setEditedClient({ ...client });
    }
    setIsEditing(false);
  }, [client]);

  if (!client || !editedClient) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedClient({ ...client });
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    toast({
      title: "Cliente atualizado",
      description: `Os dados de ${editedClient.name} foram atualizados com sucesso.`,
    });
    setIsEditing(false);
  };

  const handleToggleStatus = () => {
    const newStatus = editedClient.status === "active" ? "inativado" : "ativado";
    toast({
      title: `Cliente ${newStatus}`,
      description: `O cliente ${editedClient.name} foi ${newStatus} com sucesso.`,
    });
    onOpenChange(false);
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (updatedAddress: Address) => {
    if (editedClient) {
      const updatedAddresses = editedClient.addresses.map((addr) =>
        addr.id === updatedAddress.id ? updatedAddress : addr
      );
      setEditedClient({ ...editedClient, addresses: updatedAddresses });
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteAddress = () => {
    if (addressToDelete && editedClient) {
      const updatedAddresses = editedClient.addresses.filter(
        (addr) => addr.id !== addressToDelete
      );
      setEditedClient({ ...editedClient, addresses: updatedAddresses });
      toast({
        title: "Endereço removido",
        description: "O endereço foi removido com sucesso.",
      });
    }
    setDeleteConfirmOpen(false);
    setAddressToDelete(null);
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
                  {getInitials(editedClient.name)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{editedClient.name}</h3>
                <p className="text-sm text-muted-foreground">{editedClient.document}</p>
                <div className="mt-1">
                  {isEditing ? (
                    <Select
                      value={editedClient.status}
                      onValueChange={(value: "active" | "inactive") =>
                        setEditedClient({ ...editedClient, status: value })
                      }
                    >
                      <SelectTrigger className="w-32 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <StatusBadge
                      status={editedClient.status}
                      label={editedClient.status === "active" ? "Ativo" : "Inativo"}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Informações de contato */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Informações de Contato</h4>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">E-mail</p>
                    {isEditing ? (
                      <Input
                        value={editedClient.email}
                        onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                        className="h-7 text-sm mt-1"
                      />
                    ) : (
                      <p className="text-sm text-foreground">{editedClient.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    {isEditing ? (
                      <Input
                        value={editedClient.phone}
                        onChange={(e) => setEditedClient({ ...editedClient, phone: e.target.value })}
                        className="h-7 text-sm mt-1"
                      />
                    ) : (
                      <p className="text-sm text-foreground">{editedClient.phone}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Documento</p>
                    {isEditing ? (
                      <Input
                        value={editedClient.document}
                        onChange={(e) => setEditedClient({ ...editedClient, document: e.target.value })}
                        className="h-7 text-sm mt-1"
                      />
                    ) : (
                      <p className="text-sm text-foreground">{editedClient.document}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Endereços</h4>
              {editedClient.addresses && editedClient.addresses.length > 0 ? (
                <div className="space-y-2">
                  {editedClient.addresses.map((address) => (
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
                            onClick={() => handleEditAddress(address)}
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
                  {editedClient.totalSpent.toLocaleString("pt-BR", {
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
                  {new Date(editedClient.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2 pt-2">
              {isEditing ? (
                <>
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleCancelEdit}>
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                  <Button className="flex-1 gap-2" onClick={handleSaveEdit}>
                    <Save className="w-4 h-4" />
                    Salvar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleEdit}>
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  {editedClient.status === "active" ? (
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
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>

      <AddressEditModal
        address={selectedAddress}
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        onSave={handleSaveAddress}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover endereço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este endereço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAddress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
