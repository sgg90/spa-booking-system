import React from "react";
import Button from "./Button";
import { TEXTOS } from "../../data/config";

// Límite de errores defensivo: si algo falla de forma inesperada al renderizar
// una vista, se muestra un mensaje comprensible en lugar de dejar la pantalla
// en blanco, y se ofrece volver a la Agenda.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { conError: false };
  }

  static getDerivedStateFromError() {
    return { conError: true };
  }

  componentDidCatch(error, info) {
    // Se registra únicamente en consola, sin exponer detalles técnicos al usuario.
    console.error("Error no controlado en la interfaz:", error, info);
  }

  handleVolver = () => {
    this.setState({ conError: false });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.conError) {
      return (
        <div className="mx-auto max-w-md rounded-xl2 border border-sand-200 bg-white p-6 text-center">
          <p className="mb-4 text-sm text-ink-500">{TEXTOS.generales.errorGenerico}</p>
          <Button variante="principal" onClick={this.handleVolver}>
            {TEXTOS.generales.volverAgenda}
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
