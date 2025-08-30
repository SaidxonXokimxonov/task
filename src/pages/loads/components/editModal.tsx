import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/store/hooks";
import { updateLoad, type Load, type CreateLoadData } from "@/store/reducers/loadsSlice";

interface EditModalProps {
  loadId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData: Load;
}

export function EditLoadModal({
  loadId,
  isOpen,
  onClose,
  initialData,
}: EditModalProps) {
  const dispatch = useAppDispatch();
  const sheetCloseRef = useRef<HTMLButtonElement>(null);

  const [form, setForm] = useState({
    name: "",
    volume: "",
    price: "",
    user: "",
    car: "",
    fromLoc: "",
    toLoc: "",
    paymentMethod: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        volume: initialData.volume,
        price: initialData.price,
        user: initialData.user,
        car: initialData.car,
        fromLoc: initialData.fromLoc,
        toLoc: initialData.toLoc,
        paymentMethod: initialData.paymentMethod,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    if (initialData) {
      setForm({
        name: initialData.name,
        volume: initialData.volume,
        price: initialData.price,
        user: initialData.user,
        car: initialData.car,
        fromLoc: initialData.fromLoc,
        toLoc: initialData.toLoc,
        paymentMethod: initialData.paymentMethod,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const loadData: CreateLoadData = {
        name: form.name,
        volume: parseFloat(form.volume),
        price: parseFloat(form.price),
        user: form.user,
        car: form.car,
        fromLoc: form.fromLoc,
        toLoc: form.toLoc,
        paymentMethod: form.paymentMethod,
      };

      await dispatch(updateLoad({ loadId, loadData })).unwrap();

      resetForm();
      sheetCloseRef.current?.click();
    } catch (err: any) {
      alert(err.message || "Failed to update load");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[500px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit Load</SheetTitle>
          <p className="text-sm text-gray-500">
            Update load information and click save.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 px-5 py-4 overflow-y-auto space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name"
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="volume">Volume *</Label>
            <Input 
              id="volume"
              name="volume" 
              type="number" 
              value={form.volume} 
              onChange={handleChange} 
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price *</Label>
            <Input 
              id="price"
              name="price" 
              type="number" 
              value={form.price} 
              onChange={handleChange} 
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user">User (relation ID)</Label>
            <Input 
              id="user"
              name="user" 
              value={form.user} 
              onChange={handleChange} 
              placeholder="e.g: rec_xyz123"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="car">Car (relation ID)</Label>
            <Input 
              id="car"
              name="car" 
              value={form.car} 
              onChange={handleChange} 
              placeholder="e.g: rec_car123"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fromLoc">From Location (relation ID)</Label>
            <Input 
              id="fromLoc"
              name="fromLoc" 
              value={form.fromLoc} 
              onChange={handleChange} 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="toLoc">To Location (relation ID)</Label>
            <Input 
              id="toLoc"
              name="toLoc" 
              value={form.toLoc} 
              onChange={handleChange} 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Payment Method (relation ID)</Label>
            <Input 
              id="paymentMethod"
              name="paymentMethod" 
              value={form.paymentMethod} 
              onChange={handleChange} 
            />
          </div>

          <SheetFooter className="flex gap-2 pt-4 border-t">
            <SheetClose asChild>
              <Button 
                ref={sheetCloseRef} 
                variant="outline" 
                type="button" 
                onClick={() => { resetForm(); onClose(); }}
              >
                Close
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}