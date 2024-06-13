import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import stylesz from "../stylesz/colorgrill.module.css";

export const Colorgrill = () => {
    const [currentColor, setCurrentColor] = useState("#FFB1FF");
    const [matriz, setMatriz] = useState(createMatriz(35, 60)); // Criando a matriz inicialmente com tamanho 35x60
    const [isMouseDown, setIsMouseDown] = useState(false); // Estado para rastrear se o botão do mouse está pressionado

    // Função para criar a matriz inicial com a cor preta
    function createMatriz(rows, cols) {
        return Array.from({ length: rows }, () => Array.from({ length: cols }, () => "#FFFFFF"));
    }

    // Função para atualizar a cor de uma célula na matriz
    const handleCellClick = (rowIndex, colIndex) => {
        const newMatriz = matriz.map((row, i) =>
            row.map((col, j) => {
                // Se a célula for a clicada, define a cor atual
                if (i === rowIndex && j === colIndex) {
                    return currentColor;
                }
                // Se a célula for adjacente à clicada, define a cor com 60% de opacidade
                else if (
                    (i === rowIndex - 1 && j === colIndex) || // Célula acima
                    (i === rowIndex + 1 && j === colIndex) || // Célula abaixo
                    (i === rowIndex && j === colIndex - 1) || // Célula à esquerda
                    (i === rowIndex && j === colIndex + 1)    // Célula à direita
                ) {
                    const [r, g, b] = hexToRgb(currentColor); // Converte a cor atual para RGB
                    return `rgba(${r}, ${g}, ${b}, 1)`; // Define a cor com 60% de opacidade
                }
                // Caso contrário, mantém a cor atual da célula
                else {
                    return col;
                }
            })
        );
        setMatriz(newMatriz);
    };

    // Função para converter um código de cor hexadecimal para RGB
    const hexToRgb = (hex) => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    };

    // Função para lidar com o evento de pressionar o botão do mouse
    const handleMouseDown = () => {
        setIsMouseDown(true);
    };

    // Função para lidar com o evento de soltar o botão do mouse
    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    // Função para atualizar a cor de uma célula quando o mouse está sobre ela e o botão do mouse está pressionado
    const handleMouseEnter = (rowIndex, colIndex) => {
        if (isMouseDown) {
            handleCellClick(rowIndex, colIndex);
        }
    };

    // Função para atualizar a cor atual quando uma nova cor é selecionada no seletor de cores
    const handleChangeColor = (newColor) => {
        setCurrentColor(newColor.hex);
    };

    // Função para redefinir a grade para a cor preta
    const resetGrill = () => {
        setMatriz(createMatriz(35, 60));
    };

    return (
        <div>
            <div className={stylesz["title-container"]}>
                <div className={stylesz["title"]}>
                    <h1 style={{ color: currentColor }}>B4F PixelArt</h1>
                </div>
            </div>
            <div className={stylesz["container"]}>
                <div className={stylesz["color-picker-container"]}>
                    <ChromePicker className={stylesz['chrome-picker']} color={currentColor} onChange={handleChangeColor} />
                </div>
                <div className={stylesz["grill-container"]} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                    {matriz.map((row, rowIndex) => (
                        <div key={rowIndex} className={stylesz["grill-row"]}>
                            {row.map((col, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className={stylesz["grill-cell"]}
                                    style={{ backgroundColor: col }}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className={stylesz["reset-button-container"]}>
                    <button className={stylesz["reset-button"]} onClick={resetGrill} style={{backgroundColor: currentColor }}>
                        Reset
                        <span className={stylesz["reset-button__inner"]}>
                            <span className={stylesz["reset-button__blobs"]}>
                                <span className={stylesz["reset-button__blob"]} />
                                <span className={stylesz["reset-button__blob"]} />
                                <span className={stylesz["reset-button__blob"]} />
                                <span className={stylesz["reset-button__blob"]} />
                            </span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
