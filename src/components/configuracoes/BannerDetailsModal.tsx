import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Banner {
  id: string;
  nome: string;
  status: "ativo" | "inativo";
  imagem: string;
  posicao: number;
}

interface BannerDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
  onSave?: (banner: Banner) => void;
  onDelete?: (bannerId: string) => void;
}

export function BannerDetailsModal({
  open,
  onOpenChange,
  banner,
  onSave,
  onDelete,
}: BannerDetailsModalProps) {
  const { toast } = useToast();
  const [editedBanner, setEditedBanner] = useState<Banner | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (banner) {
      setEditedBanner({ ...banner });
      setPreviewImage(null);
    }
  }, [banner]);

  if (!banner || !editedBanner) return null;

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...editedBanner,
        imagem: previewImage || editedBanner.imagem,
      });
    }
    toast({
      description: "Banner atualizado com sucesso",
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(banner.id);
    }
    toast({
      description: "Banner excluído com sucesso",
      variant: "destructive",
    });
    setDeleteConfirmOpen(false);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Banner</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="banner-nome">Nome</Label>
              <Input
                id="banner-nome"
                value={editedBanner.nome}
                onChange={(e) =>
                  setEditedBanner({ ...editedBanner, nome: e.target.value })
                }
                placeholder="Nome do banner"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="banner-status">Status</Label>
              <Select
                value={editedBanner.status}
                onValueChange={(value: "ativo" | "inativo") =>
                  setEditedBanner({ ...editedBanner, status: value })
                }
              >
                <SelectTrigger id="banner-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Link da imagem */}
            <div className="space-y-2">
              <Label htmlFor="banner-imagem">Link da imagem</Label>
              <Input
                id="banner-imagem"
                value={editedBanner.imagem}
                onChange={(e) =>
                  setEditedBanner({ ...editedBanner, imagem: e.target.value })
                }
                placeholder="https://exemplo.com/banner.jpg"
              />
            </div>

            {/* Preview e Upload */}
            <div className="space-y-2">
              <Label>Banner atual</Label>
              <div className="flex items-start gap-4">
                <div className="border border-border rounded-lg overflow-hidden">
                  <img
                    src={previewImage || editedBanner.imagem}
                    alt={editedBanner.nome}
                    className="w-32 h-20 object-cover"
                  />
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadClick}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Substituir imagem
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Formatos aceitos: JPG, PNG, WebP
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="destructive"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Gravar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir banner</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o banner "{banner.nome}"? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
