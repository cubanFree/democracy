'use client';

import BtnGithub, { BtnGmail } from '@/components/auth/btnProviders';
import BtnSubmit from '@/components/auth/btnSubmit';
import { Input } from '@/components/ui/input';
import { Divider } from '@nextui-org/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import React, { useEffect } from 'react';
import { loginWithPassword, signupWithPassword } from '@/lib/action';
import { useRouter } from 'next/navigation';
import RegisterCard from './registerCard';
import { toast } from "sonner"

export default function FormAuth() {

    // estados de register card
    const [avatar, setAvatar] = React.useState('/avatar_default.jpg')
    const [isValidData, setIsValidData] = React.useState(false)
    const refCheckbox = React.useRef(null)
    const refInputName = React.useRef(null)
    const [isChecked, setIsChecked] = React.useState(false);

    // estado de visibilidad de contraseña y email
    const [isVisiblePass, setIsVisiblePass] = React.useState('')
    const [isVisibleEmail, setIsVisibleEmail] = React.useState('')

    // estado para verificar las credenciales
    const [isValid, setIsValid] = React.useState(false)
    useEffect(() => {
        if (isVisiblePass !== '' && isVisibleEmail !== '' && isVisibleEmail.includes('@')) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [isVisiblePass, isVisibleEmail])

    // estado para mostrar contraseña
    const [showPass, setShowPass] = React.useState(false)

    // handling action signUp
    const handleSignUp = async (formData) => {
        const { error } = await signupWithPassword(location.origin, formData)
        if (error) return toast.error(error)

        // resetear todos los valores del Form
        setIsVisibleEmail('')
        setIsVisiblePass('')
        showPass && setShowPass(false)
        setAvatar('/avatar_default.jpg')
        setIsChecked(false)
        setIsValidData(false)
        refCheckbox.current?.setAttribute('data-state', 'unchecked')
        refInputName.current.value = ''

        // mostrar mensaje
        toast.success('Verify your email to continue')
    }

    // handling action signIn
    const router = useRouter()
    const handleSignIn = async (formData) => {
        const { error } = await loginWithPassword(formData)
        if (error) return toast.error(error)

        // resetear todos los valores del Form
        setIsVisibleEmail('')
        setIsVisiblePass('')
        showPass && setShowPass(false)

        // refrescar la pagina
        router.refresh()
    }

    return (
        <Tabs defaultValue="login" className="w-[95%] sm:w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log in</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login">
                <Card>
                    <CardContent className="space-y-2">

                        <BtnGithub />
                        <BtnGmail />
                        <div className="w-full flex justify-between items-center gap-3 text-gray-400 dark">
                            <Divider className="w-[45%]"/>
                            <span className="flex justify-center items-center">or</span>
                            <Divider className="w-[45%]"/>
                        </div>

                        <form
                            id='login'
                            action={handleSignIn}
                            className="w-full h-full flex flex-col gap-5 px-0 dark"
                            >
                                <Input
                                    name='email'
                                    type="email"
                                    value={isVisibleEmail}
                                    placeholder='Email'
                                    autoComplete='on'
                                    onChange={(e) => setIsVisibleEmail(e.target.value)}
                                />
                                <label className='flex gap-2 justify-center items-center'>
                                    <Input
                                        name='password'
                                        type={showPass ? 'text' : 'password'}
                                        value={isVisiblePass}
                                        placeholder='Password'
                                        onChange={(e) => setIsVisiblePass(e.target.value)}
                                    />
                                    {
                                        showPass
                                            ? <HiOutlineEye size={20} onClick={() => setShowPass(!showPass)} />
                                            : <HiOutlineEyeOff size={20} onClick={() => setShowPass(!showPass)} />
                                    }
                                </label>

                                <BtnSubmit text='Are you ready?' isDisabled={!isValid} />
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Register */}
            <TabsContent value="register">
                <Card>
                    <CardHeader>
                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>
                            Enter your email below to create your account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-2 py-0">
                        <form
                            id='register'
                            action={handleSignUp}
                            className="w-full h-full flex flex-col gap-5 px-0 text-gray-300 dark"
                            >
                                <Input
                                    name='email'
                                    type="email"
                                    value={isVisibleEmail}
                                    placeholder='Email'
                                    autoComplete='on'
                                    required
                                    onChange={(e) => setIsVisibleEmail(e.target.value)}
                                />
                                <label className='flex gap-2 justify-center items-center'>
                                    <Input
                                        name='password'
                                        type={showPass ? 'text' : 'password'}
                                        value={isVisiblePass}
                                        placeholder='Password'
                                        required
                                        onChange={(e) => setIsVisiblePass(e.target.value)}
                                    />
                                    {
                                        showPass
                                            ? <HiOutlineEye onClick={() => setShowPass(!showPass)} />
                                            : <HiOutlineEyeOff onClick={() => setShowPass(!showPass)} />
                                    }
                                </label>

                                <div className='relative'>
                                    <div className={'w-full flex flex-col gap-5' + (!isValid ? ' blur-md opacity-25' : '')}>
                                        <RegisterCard 
                                            isDisabled={!isValid} 
                                            avatar={avatar}
                                            setAvatar={setAvatar}
                                            isValid={isValidData}
                                            setIsValid={setIsValidData}
                                            refCheckbox={refCheckbox}
                                            isChecked={isChecked}
                                            setIsChecked={setIsChecked}
                                            refInputName={refInputName}
                                        />
                                    </div>
                                    <span className={"w-full z-50 absolute top-[50%] left-[50%] text-center transform -translate-x-1/2 -translate-y-1/2 text-[0.9rem] text-gray-300" + (isValid ? ' hidden' : '')}>
                                        By signing up, please fill out the <strong>email</strong> and <strong>password</strong> fields.
                                    </span>
                                </div>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}