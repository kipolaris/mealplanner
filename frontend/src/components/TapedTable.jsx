import React from 'react';
import '../assets/css/components/taped-table.css';
import pinkFlowerTape from '../assets/images/pinkflowertape.png';
import paperBackground from '../assets/images/paperbackground.png';
import upArrow from '../assets/images/arrowup.png';
import downArrow from '../assets/images/arrowdown.png';

const TapedTable = ({
                        columns,
                        rows,
                        renderCell,
                        extraBottomRow,
                        handleReset,
                        handleReorder,
                        navigate,
                        layout = 'horizontal',
                        renderRowLabel,
                        allowReorder = true,
                        showRowLabels = true,
                        showHeader = true
                    }) => {

    return (
        <div className={`taped-table-wrapper ${layout === 'vertical' ? 'vertical-layout' : 'horizontal-layout'}`}
             style={{ backgroundImage: `url(${paperBackground})` }}>
            {/* Tapes on corners */}
            <img src={pinkFlowerTape} alt="tape" className="tape top-left" />
            <img src={pinkFlowerTape} alt="tape" className="tape top-right" />
            <img src={pinkFlowerTape} alt="tape" className="tape bottom-left" />
            <img src={pinkFlowerTape} alt="tape" className="tape bottom-right" />

            <table className="taped-table">
                <thead>
                    <tr>
                        {showHeader && (
                            <>
                                <th>
                                    <button className="table-button lobster" onClick={handleReset}>Reset</button>
                                </th>
                                {layout === 'horizontal' && columns.map((col, idx) => (
                                    <th key={idx} className="lobster" onClick={() => navigate(`/day/${col}`)}>
                                        {col}
                                    </th>

                                ))}
                                {layout === 'vertical' && <th className="lobster">Meals</th>}
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={row.id || rowIndex}>
                        {showRowLabels && (
                            <td className="lobster meal-time-cell">
                                <div className="meal-time-container">
                                    {renderRowLabel ? (
                                        <span className="meal-time-name">
                                            {renderRowLabel(row, rowIndex)}
                                        </span>
                                    ) : (
                                        <span className="meal-time-name" onClick={() => navigate(`/meal/${row.name}`)}>
                                            {row.name}
                                        </span>)}
                                    {allowReorder && (
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
                                    )}
                                </div>
                            </td>
                        )}
                        {layout === 'horizontal' && columns.map((col, colIndex) => (
                            <td key={colIndex} className="patrick" >
                                {renderCell(rowIndex, colIndex)}
                            </td>
                        ))}
                        {layout === 'vertical' && (
                            <td className="patrick">
                                {renderCell(rowIndex, 0)}
                            </td>
                        )}
                    </tr>
                ))}
                {extraBottomRow}
                </tbody>
            </table>
        </div>
    );
};

export default TapedTable;