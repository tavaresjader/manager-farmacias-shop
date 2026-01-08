import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

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

interface AddressEditModalProps {
  address: Address | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: Address) => void;
}

export function AddressEditModal({ address, open, onOpenChange, onSave }: AddressEditModalProps) {
  const { toast } = useToast();
  const [editedAddress, setEditedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (address) {
      setEditedAddress({ ...address });
    }
  }, [address]);

  if (!editedAddress) return null;

  const handleSave = () => {
    if (!editedAddress.street || !editedAddress.number || !editedAddress.neighborhood || !editedAddress.city || !editedAddress.state || !editedAddress.zipCode) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    onSave(editedAddress);
    toast({
      title: "Endereço atualizado",
      description: "O endereço foi atualizado com sucesso.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Editar Endereço</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="street">Rua *</Label>
            <Input
              id="street"
              value={editedAddress.street}
              onChange={(e) => setEditedAddress({ ...editedAddress, street: e.target.value })}
              placeholder="Nome da rua"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                value={editedAddress.number}
                onChange={(e) => setEditedAddress({ ...editedAddress, number: e.target.value })}
                placeholder="123"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={editedAddress.complement || ""}
                onChange={(e) => setEditedAddress({ ...editedAddress, complement: e.target.value })}
                placeholder="Apto, Sala..."
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="neighborhood">Bairro *</Label>
            <Input
              id="neighborhood"
              value={editedAddress.neighborhood}
              onChange={(e) => setEditedAddress({ ...editedAddress, neighborhood: e.target.value })}
              placeholder="Nome do bairro"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={editedAddress.city}
                onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
                placeholder="Cidade"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">UF *</Label>
              <Input
                id="state"
                value={editedAddress.state}
                onChange={(e) => setEditedAddress({ ...editedAddress, state: e.target.value })}
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="zipCode">CEP *</Label>
            <Input
              id="zipCode"
              value={editedAddress.zipCode}
              onChange={(e) => setEditedAddress({ ...editedAddress, zipCode: e.target.value })}
              placeholder="00000-000"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isDefault"
              checked={editedAddress.isDefault || false}
              onCheckedChange={(checked) =>
                setEditedAddress({ ...editedAddress, isDefault: checked as boolean })
              }
            />
            <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
              Definir como endereço padrão
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
