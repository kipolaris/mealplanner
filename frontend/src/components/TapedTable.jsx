import React from 'react';
import '../assets/css/taped-table.css';
import pinkFlowerTape from '../assets/images/pinkflowertape.png';
import paperBackground from '../assets/images/paperbackground.png';
import upArrow from '../assets/images/arrowup.png';
import downArrow from '../assets/images/arrowdown.png'

const TapedTable = ({ columns, rows, renderCell, extraBottomRow, handleReset, handleReorder, navigate }) => {
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
                    <th>
                        <button className="table-button lobster" onClick={handleReset}>Reset</button>
                    </th>
                    {columns.map((col, idx) => (
                        <th key={idx} className="lobster">{col}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={row.id}>
                        <td className="lobster meal-time-cell">
                            <div className="meal-time-container">
                                <span className="meal-time-name" onClick={() => navigate(`/meal/${row.name}`)}>
                                  {row.name}
                                </span>
                                <div className="arrow-buttons">
                                    {rowIndex > 0 && (
                                        <img
                                            src={upArrow}
                                            alt="Move up"
                                            className="arrow-button"
                                            onClick={() => handleReorder(rowIndex, rowIndex - 1)}
                                        />
                                    )}
                                    {rowIndex < rows.length - 1 && (
                                        <img
                                            src={downArrow}
                                            alt="Move down"
                                            className="arrow-button"
                                            onClick={() => handleReorder(rowIndex, rowIndex + 1)}
                                        />
                                    )}
                                </div>
                            </div>
                        </td>

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
