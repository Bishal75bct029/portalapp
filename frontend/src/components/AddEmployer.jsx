import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import http from "@/http";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";



export function AddEmployer({ onCreate, user, open, setOpen }) {
    const [email, setEmail] = useState(user?.email);
    const [name, setName] = useState(user?.name);
    const { toast } = useToast();

    useEffect(() => {
        setEmail(user?.email || '');
        setName(user?.name || '');
    }, [user]);

    const clearForm = () => {
        setOpen(false)
        setEmail('')
        setName('')
    }

    useEffect(() => {
        if (!open) {
            clearForm();
        }
    }, [open])

    const addEmployer = async () => {
        try {
            const response = await http.post('/employers', {
                email,
                name
            })

            if (response.statusText.toLowerCase() != 'ok') throw new Error;
            toast({
                title: "Employer created successfully!",
            })
            onCreate()

        } catch (e) {
            toast({
                title: e.response.data.message,
            })

        }
    };


    const updateEmployer = async () => {
        try {
            const response = await http.put(`/employers/${user.id}`, {
                email,
                name
            }
            )

            if (response.statusText.toLowerCase() != 'ok') throw new Error
            toast({
                title: "Employer updated successfully!",
            })
            onCreate();

        } catch (e) {
            toast({
                title: e.response.data.message,
            })

        }
    };

    const submitForm = () => {
        if (!user?.id) {
            addEmployer();

        }
        else {
            updateEmployer(user.id)

        }
        clearForm();

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="w-[100px] ml-24 mb-0">
                    <Button variant="outline" className="p-2 rounded mb-0">
                        Add Employer
                    </Button>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Employer</DialogTitle>
                    <DialogDescription>
                        New Member
                    </DialogDescription>
                </DialogHeader>

                <form className={cn("grid items-start gap-4")}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <Button type="button" onClick={submitForm} className='bg-blue-500 text-white rounded'
                    >
                        Save changes
                    </Button>
                </form>

            </DialogContent>
        </Dialog>
    );
}
