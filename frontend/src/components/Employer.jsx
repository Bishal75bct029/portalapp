import http from '@/http';
import { useToast } from './ui/use-toast';
import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/Datatable';
import { AddEmployee } from '@/components/AddEmployee';

function Employer() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState(null)
    const [employers, setEmployers] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [user, setUser] = useState();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file.');
            return;
        }

        try {

            const formData = new FormData();
            formData.append('file', file);

            const response = await http.post(`/employees/bulk-import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.statusText.toLowerCase() == 'ok') {
                alert('File uploaded successfully.');
            } else {
                const data = await response.json();
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the file.');
        }
    };

    function getEmployers(page) {
        http.get(`/employees?page=${page}`)
            .then((res) => {
                setTotalPage(res.data.pagination.totalNumberOfPage)
                setEmployers(res.data.employees);

            })
            .catch((e) => {
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem while fetching employers, please try again.",
                })
            });
    }

    function editEmployee(id) {
        const selectedUser = employers.filter(e => e.id == id);
        if (selectedUser.length > 0) {
            setUser(selectedUser[0]);
            setOpen(true);
        }
    }

    function deleteEmployer(id) {
        http.delete(`/employees/${id}`, {
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
            accessorKey: "title",
            header: "title"
        },
        {
            accessorKey: "salary",
            header: "Salary"
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
                    <button onClick={() => editEmployee(row.original.id)}>Edit</button>
                    <button type="button" className="text-red-500" onClick={() => deleteEmployer(row.original.id)}>Delete</button>
                </div>
                )
            }
        }
    ]

    useEffect(() => {
        getEmployers(pageNumber)

    }, [pageNumber])

    useEffect(() => {
        if (!open) setUser(null);
    }, [open])

    return (
        <div>
            <div className='ml-24 mb-4'>
                <input type="file" className="cursor-pointer w-[220px]" accept='.xlsx' onChange={handleFileChange} />
                <button onClick={handleUpload} className='bg-blue-500 p-1 text-white rounded'>Upload Employees</button>
            </div>
            <AddEmployee
                onCreate={() => {
                    getEmployers(pageNumber)
                }}
                employee={user}
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

export default Employer