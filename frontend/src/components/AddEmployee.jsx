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
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/providers/Auth";



export function AddEmployee({ onCreate, employee, open, setOpen }) {
    const { user, setUser } = useContext(AuthContext);
    const [email, setEmail] = useState(employee?.email);
    const [name, setName] = useState(employee?.name);
    const [password, setPassword] = useState();
    const [title, setTitle] = useState(employee?.title);
    const [salary, setSalary] = useState(employee?.salary);
    const { toast } = useToast();

    useEffect(() => {
        setEmail(employee?.email);
        setName(employee?.name);
        setTitle(employee?.title || '');
        setSalary(employee?.salary || '');

    }, [employee, open]);

    const clearForm = () => {
        setOpen(false)
        setEmail('')
        setName('')
        setPassword('')
        setTitle('')
        setSalary('')
    }

    useEffect(() => {
        if (!open)
            clearForm()
    }, [open])

    const addEmployee = async () => {
        try {
            const response = await http.post('/employees', {
                email,
                name,
                title,
                password,
                salary: Number(salary),
            })

            if (response.statusText.toLowerCase() != 'ok') throw new Error;
            toast({
                title: "Employee created successfully!",
            })
            onCreate()

        } catch (e) {
            toast({
                title: e.response.data.message,
            })

        }
    };


    const updateEmployee = async () => {
        var data;
        if (user.role == 'employer') {
            data = { email, name, title, salary: Number(salary) }

        } else {
            data = { email, name }
        }

        try {
            const response = await http.put(`/employees/${employee.id}`, data
            )

            if (response.statusText.toLowerCase() != 'ok') throw new Error
            toast({
                title: "Employee updated successfully!",
            })

            onCreate();

        } catch (e) {
            toast({
                title: e.response.data.message,
            })

        }
    };

    const submitForm = () => {
        if (!employee?.id) {
            addEmployee();

        }
        else {
            updateEmployee(employee.id)

        }
        clearForm();

    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="w-[100px] ml-24 mb-0">
                    {
                        user.role == 'employer' &&
                        <div className="flex items-center gap-2 h-50px">
                            <Button variant="outline" className="p-2 rounded mb-0">
                                Add Employee
                            </Button>
                        </div>
                    }
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{
                        employee?.id ? "Update Employee" :
                            "Add Employee"
                    }</DialogTitle>
                    <DialogDescription>
                        {!user.id && "New Member"}
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
                    {
                        user.role == 'employer' && !employee?.id &&
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    }

                    {user.role == 'employer' && <>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Salary</Label>
                            <Input
                                id="salary"
                                type="number"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                            />
                        </div>
                    </>
                    }
                    <Button type="button" onClick={submitForm} className='bg-blue-500 text-white rounded'
                    >
                        Save changes
                    </Button>
                </form>

            </DialogContent>
        </Dialog>
    );
}
