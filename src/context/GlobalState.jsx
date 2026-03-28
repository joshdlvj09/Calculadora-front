import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';

// Initial state
const initialState = {
  movimientos: [], 
  loading: true,
  error: null
};

// url de la api - Asegúrate de que esta ruta sea la correcta en tu backend
const API_URL = 'https://calculadora-back-f4kd.onrender.com';

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

    useEffect(() => {
      getMovimientos();
    }, []);

    // Actions
    async function getMovimientos() {
      try {
            const response = await fetch(`${API_URL}`);
            
            // Validación de respuesta exitosa
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - No se encontró la ruta`);
            }

            const data = await response.json();

            dispatch({
                type: 'GET_MOVIMIENTOS',
                payload: data
            });

        } catch (error) {
            dispatch({
                type: 'MOVIMIENTOS_ERROR',
                payload: error.message
            });
        }
    }

    async function addMovimiento(movimiento) {
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movimiento)
            });

            if (!response.ok) throw new Error('Error al agregar movimiento');

            const data = await response.json();

            dispatch({
                type: 'ADD_MOVIMIENTO',
                payload: data
            });

        } catch (error) {
            dispatch({
                type: 'MOVIMIENTOS_ERROR',
                payload: error.message
            });
        }
    }

    async function deleteMovimiento(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar movimiento');

            dispatch({
                type: 'DELETE_MOVIMIENTO',
                payload: id
            });
        } catch (error) {
            dispatch({
                type: 'MOVIMIENTOS_ERROR',
                payload: error.message
            });
        }
    }

    return (
        <GlobalContext.Provider value={{
            movimientos: state.movimientos,
            loading: state.loading,
            error: state.error,
            getMovimientos, // Agregado por si necesitas recargar manualmente
            addMovimiento,
            deleteMovimiento
        }}>
            {children}
        </GlobalContext.Provider>
    );
}