import { Modal } from "@/pages/cars/components/addModal";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCar, fetchCars, type Car } from "@/store/reducers/carsSlice";
import { useEffect, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditCarModal } from "./components/editModal";

export default function Cars() {
  const [open, setOpen] = useState(false);
  const [car, setCar] = useState<Car>({} as Car)
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.cars);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCar(id)).unwrap();
      console.log("Car deleted!");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  function closeModal() {
    setOpen(false);
  }

  function startEdit(item: Car) {
    setOpen(true)
    console.log(open)
    setCar(item)
  }

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);
  return (
    <div>
      <div className="flex h-[100px] items-center justify-between px-5">
        <h2 className="text-2xl">Cars</h2>
        <Modal />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-200">
            <TableHead className="w-[80px] text-center">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Car Number</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium text-center">
                {item.id}
              </TableCell>
              <TableCell className="font-semibold">{item.name}</TableCell>
              <TableCell>{item.volume} m³</TableCell>
              <TableCell>
                <Badge variant="outline">{item.user}</Badge>
              </TableCell>
              <TableCell>
                <Badge>{item.type}</Badge>
              </TableCell>
              <TableCell className="text-sm ">
                {item.location.lat} | {item.location.lon}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{item.from}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{item.to}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.model}</Badge>
              </TableCell>
              <TableCell className="font-mono">{item.carNumber}</TableCell>
              <TableCell>
                {new Date(item.created).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(item.updated).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button onClick={()=> startEdit(item)} className="bg-yellow-400 hover:bg-yellow-600">
                  <Edit />
                </Button>
                <Button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 hover:bg-red-800"
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditCarModal
        isOpen={open}
        onClose={closeModal}
        initialData={car}
        carId={car.id}
      />
    </div>
  );
}
