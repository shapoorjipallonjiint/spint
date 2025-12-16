"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AdminItemContainer from '@/app/components/common/AdminItemContainer'

interface FormValues {
    headerScript: string;
    bodyScript: string;
}

interface FormValues2 {
    currentPassword: string;
    newPassword: string;
}

const Settings = () => {

        const { register, handleSubmit,setValue,getValues } = useForm<FormValues | FormValues2>();
        const [currentPasswordIsCorrect, setCurrentPasswordIsCorrect] = React.useState<boolean>(false);
        
        const onSubmit = async(data: FormValues | FormValues2) => {
            try {
                const response = await fetch("/api/admin/tags", {
                    method: "POST",
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                } else {
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.log("Error saving details", error);
            }
        }
    
        const fetchTag = async() => {
            try {
                const response = await fetch("/api/admin/tags");
                if (response.ok) {
                    const data = await response.json();
                    setValue('headerScript', data.tag.headerScript);
                    setValue('bodyScript', data.tag.bodyScript);
                } else {
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.log("Error fetching details", error);
            }
        }
    
        useEffect(() => {
            fetchTag();
        }, []);

        const checkCurrentPassword = async() => {
            try {
                const currentPassword = getValues('currentPassword');
                if(!currentPassword){
                    alert("Please enter current password");
                    return;
                }
                const response = await fetch("/api/admin/settings/check-password", {
                    method: "POST",
                    body: JSON.stringify({currentPassword}),
                });
                if (response.ok) {
                    const data = await response.json();
                    if(data.success){
                        setCurrentPasswordIsCorrect(true);
                        setValue('currentPassword',"");
                        alert(data.message);
                    }else{
                        setCurrentPasswordIsCorrect(false);
                        alert(data.message);
                    }
                } else {
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.log("Error saving details", error);
            }
        }


        const submitNewPassword = async() => {
            try {
                const newPassword = getValues('newPassword');
                if(!newPassword){
                    alert("Please enter new password");
                    return;
                }
                const response = await fetch("/api/admin/settings/check-password", {
                    method: "PATCH",
                    body: JSON.stringify({newPassword}),
                });
                if (response.ok) {
                    const data = await response.json();
                    if(data.success){
                        setCurrentPasswordIsCorrect(false);
                        setValue('newPassword',"");
                        alert(data.message);
                    }else{
                        setCurrentPasswordIsCorrect(false);
                        alert(data.message);
                    }
                } else {
                    const data = await response.json();
                    alert(data.message);
                }
            } catch (error) {
                console.log("Error saving details", error);
            }
        }


  return (
    <div className='grid grid-cols-2 gap-5'>
        <AdminItemContainer>
            <Label main>Meta Section</Label>
        <div className='flex flex-col gap-5 border-r-gray-300 p-5'>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <Label className=''>Header Script</Label>
                            <Textarea {...register('headerScript')}></Textarea>
                        </div>
            
                        <div className="space-y-4">
                            <Label className=''>Body Script</Label>
                            <Textarea {...register('bodyScript')}></Textarea>
                        </div>
                        <div className="flex justify-center">
                            <Button type="submit" className='w-full cursor-pointer text-white text-[16px]'>Submit</Button>
                        </div>
                    </form>
        </div>
        </AdminItemContainer>

        <AdminItemContainer>
        <Label main>Change Password</Label>
            {!currentPasswordIsCorrect ? (<form className='flex flex-col gap-5 p-5'>
                        <div className="space-y-4">
                            <Label className=''>Current Password</Label>
                            <Input {...register('currentPassword')}></Input>
                        </div>
            
                        <div className="flex flex-col gap-1">
                            <p className='text-[16px]'>Type in the current password and hit continue</p>
                            <Button type="button" className='w-full cursor-pointer text-white text-[16px]' onClick={checkCurrentPassword}>Continue</Button>
                        </div>
                    </form>) 
                    
                    : 
                    
                    (<form className='flex flex-col gap-5 p-5'>
                        <div className="space-y-4">
                            <Label className=''>New Password</Label>
                            <Input {...register('newPassword')}></Input>
                        </div>
            
                        <div className="flex flex-col gap-1">
                            <p className='text-[16px]'>Type in the new password and hit continue</p>
                            <Button type="button" className='w-full cursor-pointer text-white text-[16px]' onClick={submitNewPassword}>Confirm</Button>
                        </div>
                    </form>)
                    
                    }
        </AdminItemContainer>

        
    </div>
  )
}

export default Settings