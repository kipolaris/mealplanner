import React from 'react';
import '../assets/css/taped-table.css';
import pinkFlowerTape from '../assets/images/pinkflowertape.png';
import paperBackground from '../assets/images/paperbackground.png';

const TapedTable = ({ columns, rows, renderCell, extraBottomRow }) => {
    return (
        <div className="taped-table-wrapper" style={{
            backgroundImage: `url(${paperBackground})`
        }}>
            {/* Tapes on corners */}
            <img src={pinkFlowerTape} alt="tape" className="tape top-left" />
            <img src={pinkFlowerTape} alt="tape" className="tape top-right" />
            <img src={pinkFlowerTape} alt="tape" className="tape bottom-left" />
            <img src={pinkFlowerTape} alt="tape" className="tape bottom-right" />

            <table className="taped-table">
                <thead>
                <tr>
                    <th><button className="orange-button lobster">Reset</button></th>
                    {columns.map((col, idx) => (
                        <th key={idx} className="lobster">{col}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <td className="lobster meal-time">{row}</td>
                        {columns.map((col, colIndex) => (
                            <td key={colIndex} className="patrick">
                                {renderCell(rowIndex, colIndex)}
                            </td>
                        ))}
                    </tr>
                ))}
                {extraBottomRow}
                </tbody>
            </table>
        </div>
    );
};

export default TapedTable;
