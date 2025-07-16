import React from 'react';
import '../assets/css/components/taped-table.css';
import pinkFlowerTape from '../assets/images/pinkflowertape.png';
import paperBackground from '../assets/images/paperbackground.png';
import upArrow from '../assets/images/arrowup.png';
import downArrow from '../assets/images/arrowdown.png';

const TapedTable = ({
                        layout = 'horizontal',
                        columns = [],
                        rows = [],
                        renderHeaderCell = null,
                        renderRowLabel = null,
                        renderCell = null,
                        extraBottomRow = null,
                        onReset = null,
                        onReorder = null,
                        allowReorder = true,
                        showHeader = true,
                        showRowLabels = true,
                        rowLabelHeader = ''
                    }) => {
    return (
        <div
            className={`taped-table-wrapper ${layout === 'vertical' ? 'vertical-layout' : 'horizontal-layout'}`}
            style={{ backgroundImage: `url(${paperBackground})` }}
        >
            <img src={pinkFlowerTape} alt="tape" className="tape top-left" />
            <img src={pinkFlowerTape} alt="tape" className="tape top-right" />
            <img src={pinkFlowerTape} alt="tape" className="tape bottom-left" />
            <img src={pinkFlowerTape} alt="tape" className="tape bottom-right" />

            <table className="taped-table">
                {showHeader && (
                    <thead>
                    <tr>
                        {showRowLabels && (
                            <th>
                                {onReset ? (
                                    <button className="table-button lobster" onClick={onReset}>
                                        Reset
                                    </button>
                                ) : (
                                    <span className="lobster" style={{ fontSize: 'clamp(12px, 2vw, 18px)' }}>{rowLabelHeader || ''}</span>
                                )}
                            </th>
                        )}
                        {columns.map((col, idx) => (
                            <th key={idx} className="lobster">
                                {renderHeaderCell ? renderHeaderCell(col, idx) : col.header || ''}
                            </th>
                        ))}
                    </tr>
                    </thead>
                )}

                <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={row.id || rowIndex}>
                        {showRowLabels && (
                            <td className="lobster meal-time-cell">
                                <div className="meal-time-container">
                                    <div className="meal-time-name">
                                        {renderRowLabel ? renderRowLabel(row, rowIndex) : row.name}
                                    </div>
                                    {allowReorder && onReorder && (
                                        <div className="arrow-buttons">
                                            {rowIndex > 0 && (
                                                <img
                                                    src={upArrow}
                                                    alt="Move up"
                                                    className="arrow-button"
                                                    onClick={() => onReorder(rowIndex, rowIndex - 1)}
                                                />
                                            )}
                                            {rowIndex < rows.length - 1 && (
                                                <img
                                                    src={downArrow}
                                                    alt="Move down"
                                                    className="arrow-button"
                                                    onClick={() => onReorder(rowIndex, rowIndex + 1)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </td>
                        )}

                        {columns.map((col, colIndex) => (
                            <td key={colIndex} className="patrick">
                                {col.render
                                    ? col.render(row, rowIndex, colIndex)
                                    : renderCell?.(rowIndex, colIndex) || null}
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
