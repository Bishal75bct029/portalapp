import http from '@/http';
import { useToast } from './ui/use-toast';
import React, { useEffect, useState } from 'react'
import { AddEmployer } from '@/components/AddEmployer';
import { DataTable } from '@/components/Datatable';

function Admin() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [employers, setEmployers] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [user, setUser] = useState();

    function getEmployers(page) {
        http.get(`/employers?page=${page}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                setTotalPage(res.data.pagination.totalPages)
                setEmployers(res.data.employers);

            })
            .catch((_) => {
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem while fetching employers, please try again.",
                })
            })
    }

    function editEmployer(id) {
        const selectedUser = employers.filter(e => e.id == id);
        if (selectedUser.length > 0) {
            setUser(selectedUser[0]);
            setOpen(true);
        }
    }

    function deleteEmployer(id) {
        http.delete(`/employers/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                toast({
                    title: res.data.message || ""
                })

                setEmployers(employers.filter(e => e.id != id))

                getEmployers(pageNumber)
            }).catch(_ => {
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: 'There was a problem while deleting user, please try again.'
                })
            })
    }

    const columns = [
        {
            accessorKey: "name",
            header: "Name"
        },
        {
            accessorKey: "email",
            header: "Email"
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => {
                const date = new Date(row.original.createdAt);

                return date.toLocaleDateString()
            }
        },
        {
            header: "Action",
            cell: ({ row }) => {
                return (<div className="flex items-center gap-x-2 text-sm">
                    <button onClick={() => editEmployer(row.original.id)}>Edit</button>
                    <button type="button" className="text-red-500" onClick={() => deleteEmployer(row.original.id)}>Delete</button>
                </div>
                )
            }
        }
    ]

    useEffect(() => {
        if (!localStorage.getItem('token')) return
        getEmployers(pageNumber)

    }, [pageNumber])

    useEffect(() => {
        if (!open) setUser(null);
    }, [open])

    return (
        <div>
            <AddEmployer
                onCreate={() => {
                    getEmployers(pageNumber)
                }}
                user={user}
                open={open}
                setOpen={setOpen}
            />
            <div className="flex">
                <div className="mt-3 mb-0 w-full">
                    <div className="flex justify-between w-full mb-0">

                    </div>

                    <div className="container mx-auto">
                        <DataTable columns={columns} data={employers} page={pageNumber} totalPage={totalPage} setPageNumber={setPageNumber} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin