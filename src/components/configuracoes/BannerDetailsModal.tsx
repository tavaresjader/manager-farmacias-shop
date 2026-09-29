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
import { Loader2, Save, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Banner {
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

interface BannerDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
  onSave?: (banner: Banner) => Promise<boolean> | boolean;
  onDelete?: (bannerId: string) => Promise<boolean> | boolean;
  loading?: boolean;
  saving?: boolean;
  deleting?: boolean;
}

const emptyBanner: Banner = {
  id: "",
  nome: "",
  status: "ativo",
  imagem: "",
  posicao: 0,
  url: "",
  fileName: "",
};

export function BannerDetailsModal({
  open,
  onOpenChange,
  banner,
  onSave,
  onDelete,
  loading = false,
  saving = false,
  deleting = false,
}: BannerDetailsModalProps) {
  const { toast } = useToast();
  const [editedBanner, setEditedBanner] = useState<Banner | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCreate = !banner;

  useEffect(() => {
    if (open) {
      setEditedBanner(banner ? { ...banner } : { ...emptyBanner });
      setPreviewImage(null);
    }
  }, [banner, open]);

  if (!editedBanner) return null;

  const validateBanner = (): boolean => {
    if (!editedBanner.nome.trim()) {
      toast({
        description: "Informe o nome do banner.",
        variant: "destructive",
      });
      return false;
    }

    if (isCreate && !editedBanner.fileBase64) {
      toast({
        description: "Selecione a imagem do banner.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateBanner()) return;

    if (onSave) {
      const saved = await onSave({
        ...editedBanner,
        imagem: previewImage || editedBanner.imagem,
      });
      if (!saved) return;
    }

    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (onDelete && banner) {
      const deleted = await onDelete(banner.id);
      if (!deleted) return;
    }

    setDeleteConfirmOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileBase64 = reader.result as string;
        setPreviewImage(fileBase64);
        setEditedBanner((currentBanner) =>
          currentBanner
            ? {
                ...currentBanner,
                imagem: fileBase64,
                fileBase64,
                uploadFileName: file.name,
                fileName: currentBanner.fileName || file.name,
              }
            : currentBanner,
        );
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
            <DialogTitle>{isCreate ? "Adicionar banner" : "Detalhes do Banner"}</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando banner...
              </div>
            </div>
          ) : (
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

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="banner-url">URL de destino</Label>
              <Input
                id="banner-url"
                value={editedBanner.url}
                onChange={(e) =>
                  setEditedBanner({ ...editedBanner, url: e.target.value })
                }
                placeholder="https://exemplo.com/promocao"
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

            {/* Posição */}
            <div className="space-y-2">
              <Label htmlFor="banner-posicao">Posição</Label>
              <Select
                value={editedBanner.posicao.toString()}
                onValueChange={(value) =>
                  setEditedBanner({ ...editedBanner, posicao: parseInt(value) })
                }
              >
                <SelectTrigger id="banner-posicao">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview e Upload */}
            <div className="space-y-2">
              <Label>Imagem do banner</Label>
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-32 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-xs text-muted-foreground">
                  {previewImage || editedBanner.imagem ? (
                    <img
                      src={previewImage || editedBanner.imagem}
                      alt={editedBanner.nome || "Banner"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "Sem imagem"
                  )}
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
                    {isCreate ? "Selecionar imagem" : "Substituir imagem"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isCreate
                      ? "Obrigatório no cadastro. Formatos aceitos: JPG, PNG, WebP"
                      : "Opcional na edição. Formatos aceitos: JPG, PNG, WebP"}
                  </p>
                  {editedBanner.uploadFileName && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Arquivo: {editedBanner.uploadFileName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}

          <DialogFooter className={isCreate ? "justify-end" : "flex justify-between sm:justify-between"}>
            {!isCreate && (
              <Button
                variant="destructive"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={loading || saving || deleting}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Excluir
              </Button>
            )}
            <Button onClick={handleSave} disabled={loading || saving || deleting}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? "Gravando..." : "Gravar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir banner</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o banner "{banner?.nome}"? Esta ação não pode
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
