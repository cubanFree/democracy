'use client';

import { useEffect, useRef } from 'react';
import { scrollDown } from "../general/scroll-down";
import { Button } from "../ui/button";
import { FaArrowDown } from "react-icons/fa";

export default function BtnScrollDown({ bodyScrollRef }) {

    const botonScrollRef = useRef();

    useEffect(() => {
        const handleScroll = () => {
            if (bodyScrollRef && bodyScrollRef.current) {
                const contenedor = bodyScrollRef.current;
                const isAtBottom = contenedor.scrollHeight - contenedor.scrollTop <= contenedor.clientHeight;

                // Control de la visibilidad del botón mediante la referencia
                if (botonScrollRef.current) { // Acceso correcto a .current
                    botonScrollRef.current.style.display = isAtBottom ? 'none' : 'block';
                }
            }
        };

        // Agregar el event listener al contenedor de mensajes
        const contenedor = bodyScrollRef.current;
        if (contenedor) {
            contenedor.addEventListener('scroll', handleScroll);
        }

        // Limpieza del event listener al desmontar
        return () => {
            if (contenedor) {
                contenedor.removeEventListener('scroll', handleScroll);
            }
        };
    }, [bodyScrollRef]);

    return (
        <Button 
            ref={botonScrollRef} // Asignar useRef al elemento
            onClick={() => scrollDown({ ref: bodyScrollRef })}
            variant="default"
            size="sm"
            className="absolute rounded-full p-2 bg-stone-700 hover:bg-stone-600 bottom-24 right-3 md:bottom-28 md:right-3"
            style={{ display: 'none' }}
        >
            <FaArrowDown size={20} className="text-stone-300"/>
        </Button>
    );
}