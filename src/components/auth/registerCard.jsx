'use client';

import { Input } from "@/components/ui/input"
import BtnSubmit from "./btnSubmit"
import { useDebouncedCallback } from 'use-debounce';
import { checkUsernameExists } from "@/lib/data";
import React from "react";
import Image from "next/image"
import { Checkbox } from "../ui/checkbox";
import { RiErrorWarningLine } from "react-icons/ri";

export default function RegisterCard(
    { 
        isDisabled,
        avatar,
        setAvatar = () => {},
        isValid,
        setIsValid = () => {},
        refCheckbox,
        isChecked,
        setIsChecked = () => {},
        refInputName,
    }
) {

  // estado de visibilidad del Avatar
  const handlingFileChange = (event) => {
      const file = event.target.files[0]

      // revocar la url cuando avatar => true y el evento contenga un objeto file
      if (avatar && file) URL.revokeObjectURL(avatar)
      
      // crea la nueva url y actualiza el estado si el objeto file existe
      if (file) setAvatar( URL.createObjectURL(file) )
  }

  // estado de verificacion de los datos
  const checkValidity = useDebouncedCallback(async (heardUsername) => {

      // chequear que el usuario no exista
      const { data, error } = await checkUsernameExists(heardUsername)

      // setear el estado de verificacion
      if (error) {
          // console.error(error)
          return setIsValid(false)
      }
      data ? setIsValid(false) : setIsValid(true)
  }, 200)

  // estado del checkbox
  const handleCheckboxChange = () => {
    // extraer y verificar estado del checkbox
    const stateBox = refCheckbox.current?.getAttribute('data-state')
    setIsChecked(!(stateBox === 'checked'));
  }

  return (
        <>
          <div className="w-full flex justify-center gap-4">
              <label className="flex justify-center items-center">
                  <Image 
                      src={avatar}
                      alt="Avatar Profile"
                      width={200}
                      height={200}
                      className="rounded-3xl border border-gray-500 p-1 object-cover cursor-pointer"
                  />
                  <input
                      disabled={isDisabled}
                      name="avatar"
                      type="file"
                      onChange={handlingFileChange}
                      accept="image/*"
                      className="hidden"
                  />
              </label>
              <div className="w-full self-end flex flex-col gap-2">
                {
                    !isValid && (
                        <span className="w-full flex justify-end items-center gap-2 text-yellow-700 text-sm">
                            <RiErrorWarningLine size={16} />
                            Username not available
                        </span>
                    )
                }
                <Input
                    disabled={isDisabled}
                    name='username'
                    type="text"
                    placeholder='Name of the company'
                    autoComplete='off'
                    onChange={(e) => checkValidity(e.target.value)}
                    ref={refInputName}
                    required
                />
              </div>
          </div>
          <div className="w-full items-top flex space-x-2" >
              <Checkbox id="terms1" className="dark" ref={refCheckbox} onClick={handleCheckboxChange} required disabled={isDisabled} />
              <div className="grid gap-1.5 leading-none">
                  <span
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                          Accept terms and conditions
                  </span>
                  <p className="text-sm text-muted-foreground">
                      You agree to our Terms of Service and Privacy Policy.
                  </p>
              </div>
          </div>
          
          <BtnSubmit text='Done' isDisabled={(!isValid || !isChecked || isDisabled)} />
        </>
  )
}
