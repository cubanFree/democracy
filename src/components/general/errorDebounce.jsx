'use client';

import React, { Component } from 'react';
import { Button } from '../ui/button';

class ErrorDebounce extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de reserva
    // e incluye el mensaje de error
    return { hasError: true, errorMessage: error.message || 'Un error desconocido ha ocurrido' };
  }

  componentDidCatch(error, errorInfo) {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error("Capturado un ErrorDebounce: ", error, errorInfo);
  }

  refreshPage = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // Renderiza la interfaz de reserva con el mensaje de error
      return (
        <div className='flex flex-col justify-center items-center gap-2 h-full'>
          <span className='text-md'>Something went wrong.</span>
          <span className='text-sm text-red-400'>{this.state.errorMessage}</span> {/* Muestra el mensaje de error */}
          <Button onClick={this.refreshPage}>Try again</Button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorDebounce;