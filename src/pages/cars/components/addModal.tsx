import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import { createCar } from "@/store/reducers/carsSlice"
import { useAppDispatch } from "@/store/hooks"

export function Modal() {
  const dispatch = useAppDispatch()
  const sheetCloseRef = useRef<HTMLButtonElement>(null)
  
  const [form, setForm] = useState({
    name: "",
    volume: "",
    user: "",
    type: "",
    carNumber: "",
    from: "",
    to: "",
    model: "",
    lat: "",
    lon: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm({
      name: "",
      volume: "",
      user: "",
      type: "",
      carNumber: "",
      from: "",
      to: "",
      model: "",
      lat: "",
      lon: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!form.name.trim()) {
      alert("Name is required")
      return
    }
    
    if (!form.volume || isNaN(Number(form.volume)) || Number(form.volume) <= 0) {
      alert("Please enter a valid volume")
      return
    }
    
    if (!form.user.trim()) {
      alert("User ID is required")
      return
    }

    if (!form.lat || !form.lon || isNaN(Number(form.lat)) || isNaN(Number(form.lon))) {
      alert("Please provide valid location coordinates")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", form.name.trim())
      formData.append("volume", form.volume)
      formData.append("user", form.user.trim())
      formData.append("location", JSON.stringify({
        lon: parseFloat(form.lon),
        lat: parseFloat(form.lat),
      }))

      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }

      await dispatch(createCar(formData)).unwrap()

      resetForm()
      sheetCloseRef.current?.click()
      
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create car"
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add new car</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-[500px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Add New Car</SheetTitle>
          <SheetDescription>
            Fill in the fields below to add a new car. Click save when you&apos;re done.
          </SheetDescription>
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
              type="number" 
              name="volume" 
              value={form.volume} 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user">User (relation ID) *</Label>
            <Input 
              id="user" 
              name="user" 
              value={form.user} 
              onChange={handleChange}
              placeholder="e.g: rec_xyz123abc"
              required 
            />
            <p className="text-xs text-gray-500">Enter valid user record ID</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Input 
              id="type" 
              name="type" 
              value={form.type} 
              onChange={handleChange}
              placeholder="e.g: ref, car, truck"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="carNumber">Car Number</Label>
            <Input id="carNumber" name="carNumber" value={form.carNumber} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="from">From (relation ID)</Label>
            <Input 
              id="from" 
              name="from" 
              value={form.from} 
              onChange={handleChange}
              placeholder="e.g: rec_location123"
            />
            <p className="text-xs text-gray-500">Enter valid location record ID or leave empty</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="to">To (relation ID)</Label>
            <Input 
              id="to" 
              name="to" 
              value={form.to} 
              onChange={handleChange}
              placeholder="e.g: rec_location456"
            />
            <p className="text-xs text-gray-500">Enter valid location record ID or leave empty</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="model">Model (relation ID)</Label>
            <Input 
              id="model" 
              name="model" 
              value={form.model} 
              onChange={handleChange}
              placeholder="e.g: rec_model789"
            />
            <p className="text-xs text-gray-500">Enter valid model record ID or leave empty</p>
          </div>

          <div className="grid gap-2">
            <Label>Location *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="Latitude" 
                name="lat" 
                type="number" 
                step="any"
                value={form.lat} 
                onChange={handleChange}
                required 
              />
              <Input 
                placeholder="Longitude" 
                name="lon" 
                type="number" 
                step="any"
                value={form.lon} 
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
                onClick={resetForm}
              >
                Close
              </Button>
            </SheetClose>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Car"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}