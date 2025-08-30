import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLoads, deleteLoad, type Load } from "@/store/reducers/loadsSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { LoadsModal } from "./components/addModal";
import { EditLoadModal } from "./components/editModal";

export default function Loads() {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.loads);

  const [openEdit, setOpenEdit] = useState(false);
  const [loadToEdit, setLoadToEdit] = useState<Load>({} as Load);

  useEffect(() => {
    dispatch(fetchLoads());
  }, [dispatch]);

  const startEdit = (load: Load) => {
    setLoadToEdit(load);
    setOpenEdit(true);
  };

  const closeEditModal = () => setOpenEdit(false);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteLoad(id)).unwrap();
      console.log("Load deleted!");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div>
      <div className="flex h-[100px] items-center justify-between px-5">
        <h2 className="text-2xl">Loads</h2>
        <LoadsModal />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-200">
            <TableHead className="w-[80px] text-center">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Car</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Telegram</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>In Advance?</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {list.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="text-center">{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.volume}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.user || <span className="text-gray-400">N/A</span>}</TableCell>
              <TableCell>{item.car || <span className="text-gray-400">N/A</span>}</TableCell>
              <TableCell>{item.fromLoc || <span className="text-gray-400">N/A</span>}</TableCell>
              <TableCell>{item.toLoc || <span className="text-gray-400">N/A</span>}</TableCell>
              <TableCell>{item.paymentMethod || <span className="text-gray-400">N/A</span>}</TableCell>
              <TableCell>{item.phoneNumber || "N/A"}</TableCell>
              <TableCell>{item.telegram || "N/A"}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.InAdvanceMethod ? "Yes" : "No"}</TableCell>
              <TableCell>{new Date(item.created).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(item.updated).toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-2">
                <Button onClick={() => startEdit(item)} className="bg-yellow-400 hover:bg-yellow-600">
                  <Edit />
                </Button>
                <Button onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-800">
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditLoadModal
        isOpen={openEdit}
        onClose={closeEditModal}
        initialData={loadToEdit}
        loadId={loadToEdit.id}
      />
    </div>
  );
}
