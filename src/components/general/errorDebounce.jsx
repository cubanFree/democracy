'use client';

import React, { Component } from 'react';
import { Button } from '../ui/button';

class ErrorDebounce extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la interfaz de reserva
    return { hasError: true };
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
      // Puedes renderizar cualquier interfaz de reserva personalizada
      return (
        <div className='flex flex-col justify-center items-center gap-2 h-full'>
          <h1>Something went wrong.</h1>
          <Button onClick={this.refreshPage} className='dark'>Try again</Button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorDebounce;

