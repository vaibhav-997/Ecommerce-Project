
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

function AdminSelectOptions() {
    const navigate = useNavigate()
    return (
    <div className="grid">
        <Sheet >
        <SheetTrigger asChild>
            <p className="cursor-pointer">Admin</p>
        </SheetTrigger>
        <SheetContent side={'top'}>
            <SheetHeader>
            <SheetTitle>Admin Options</SheetTitle>
            
            </SheetHeader>
            <div className="flex gap-2 py-4 justify-center">
                <div className="  items-center gap-4">
                    <Button onClick={() => navigate('/add-product') }>Add Product</Button>
                </div>
                <div className=" items-center gap-4">
                <Button  onClick={() => navigate('/all-product') } >All Products</Button>
                </div>
            </div>
            
        </SheetContent>
        </Sheet>
    </div>
    );
    }

    export default AdminSelectOptions