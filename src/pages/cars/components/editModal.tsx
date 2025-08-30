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
import { updateCar, type Car } from "@/store/reducers/carsSlice";

interface EditModalProps {
  carId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData: Car;
}

export function EditCarModal({
  carId,
  isOpen,
  onClose,
  initialData,
}: EditModalProps) {
  const dispatch = useAppDispatch();
  const sheetCloseRef = useRef<HTMLButtonElement>(null);

  const [form, setForm] = useState({
    ...initialData,
    location: { ...initialData.location },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm({ ...initialData, location: { ...initialData.location } });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lon") {
      setForm({
        ...form,
        location: { ...form.location, [name]: Number(value) },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({ ...initialData, location: { ...initialData.location } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("volume", form.volume.toString());
      formData.append("user", form.user);
      formData.append("type", form.type);
      formData.append("carNumber", form.carNumber);
      formData.append("from", form.from);
      formData.append("to", form.to);
      formData.append("model", form.model);
      formData.append(
        "location",
        JSON.stringify({ lat: Number(form.location.lat), lon: Number(form.location.lon) })
      );

      await dispatch(updateCar({ carId, formData })).unwrap();

      resetForm();
      sheetCloseRef.current?.click();
    } catch (err: any) {
      alert(err.message || "Failed to update car");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[500px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit Car</SheetTitle>
          <p className="text-sm text-gray-500">
            Update car information and click save.
          </p>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 px-5 py-4 overflow-y-auto space-y-4"
        >
          <div className="grid gap-2">
            <Label>Name *</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <Label>Volume *</Label>
            <Input
              type="number"
              name="volume"
              value={form.volume}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>User (relation ID) *</Label>
            <Input name="user" value={form.user} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <Label>Type</Label>
            <Input name="type" value={form.type} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>Car Number</Label>
            <Input name="carNumber" value={form.carNumber} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>From (relation ID)</Label>
            <Input name="from" value={form.from} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>To (relation ID)</Label>
            <Input name="to" value={form.to} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>Model (relation ID)</Label>
            <Input name="model" value={form.model} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>Location *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Latitude"
                name="lat"
                type="number"
                value={form.location.lat}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="Longitude"
                name="lon"
                type="number"
                value={form.location.lon}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <SheetFooter className="flex pt-4 border-t">
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
