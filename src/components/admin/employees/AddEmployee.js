'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { VscDiffAdded } from 'react-icons/vsc';
import { useForm } from 'react-hook-form';
import { addEmployee } from '@/components/services/admin/employeeList/api';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { PulseLoader } from 'react-spinners';

const FormField = ({ label, error, children }) => (
    <div className="flex flex-col space-y-2 w-full">
        <label className="text-sm font-medium text-gray-200">{label}</label>
        {children}
        {error && <p className="text-red-400 text-xs">{error.message}</p>}
    </div>
);

const validate = (data) => {
    const errors = {};
    if (!data.firstName || data.firstName.length < 3 || !/^[a-zA-Z\s]+$/.test(data.firstName)) {
        errors.firstName = 'First name is required and should be at least 3 characters long, containing only letters and spaces';
    }
    if (!data.lastName || data.lastName.length < 3 || !/^[a-zA-Z\s]+$/.test(data.lastName)) {
        errors.lastName = 'Last name is required and should be at least 3 characters long, containing only letters and spaces';
    }
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Enter a valid email';
    }
    if (!data.password || data.password.length < 6) {
        errors.password = 'Password is required and should be at least 6 characters long';
    }
    return errors;
};

export const AddEmployee = ({ employees,setEmployees }) => {
  const {toast} = useToast();
  const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, formState: { errors }, trigger, setError, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        const validationErrors = validate(data);
        if (Object.keys(validationErrors).length > 0) {
            Object.keys(validationErrors).forEach((key) => {
                setError(key, { type: 'manual', message: validationErrors[key] });
            });
            return;
        }

        try {
          setIsLoading(true);
            const response = await addEmployee(session?.user?.access, {
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                password: data.password,
                is_employee: true
            });
            toast({
                title: 'Employee added successfully',
                description: 'The employee has been added successfully',
                status: 'success',
                className: 'bg-green-200',
                duration: 2000,
            });
            reset(); 
            setEmployees([...employees, { first_name: data.firstName, last_name: data.lastName, email: data.email }]);
            setOpen(false); 
        } catch (error) {
            toast({
                title: 'Error adding employee',
                description: error.message,
                status: 'error',
                className: 'bg-yellow-200',
                duration: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const inputClassName = "w-full px-3 py-2 bg-[#1f2937] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400";

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button 
                        variant="outline" 
                        className="hover:bg-[#303d4b] bg-[#3e4f61] hover:text-white px-4 py-2 rounded-md flex items-center space-x-2"
                    >
                        <span>Add Employee</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#111827] border border-gray-700 max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-white mb-4">Add New Employee</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Fill in the details below to add a new employee to the system.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            <FormField label="First Name" error={errors.firstName}>
                                <input
                                    type="text"
                                    {...register('firstName')}
                                    className={inputClassName}
                                    placeholder="Enter first name"
                                    onBlur={() => trigger('firstName')}
                                />
                            </FormField>

                            <FormField label="Last Name" error={errors.lastName}>
                                <input
                                    type="text"
                                    {...register('lastName')}
                                    className={inputClassName}
                                    placeholder="Enter last name"
                                    onBlur={() => trigger('lastName')}
                                />
                            </FormField>

                            <FormField label="Email Address" error={errors.email}>
                                <input
                                    type="email"
                                    {...register('email')}
                                    className={inputClassName}
                                    placeholder="Enter email address"
                                    onBlur={() => trigger('email')}
                                />
                            </FormField>

                            <FormField label="Password" error={errors.password}>
                                <input
                                    type="password"
                                    {...register('password')}
                                    className={inputClassName}
                                    placeholder="Enter password"
                                    onBlur={() => trigger('password')}
                                />
                            </FormField>
                        </div>

                        <DialogFooter className="px-6 pb-6">
                            <Button
                                type="submit"
                                className="hover:bg-[#2b3a4a] bg-[#3e4f61] hover:text-white w-[120px] px-4 py-2 rounded-md flex items-center space-x-2"
                            >
                                {isLoading ? <PulseLoader size={4} /> : 'Add Employee'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddEmployee;