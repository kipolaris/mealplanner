import React from 'react';
import { useNavigate } from 'react-router-dom';
import TapeButton from '../components/TapeButton';
import PageTitle from '../components/PageTitle';
import TapedTable from '../components/TapedTable';

const MenuPage = () => {
    const navigate = useNavigate();

    const rows = [
        { label: 'Meal plan', onClick: () => navigate('/meal-plan') },
        { label: 'Meal times', onClick: () => navigate('/meal-times') },
        { label: 'Foods', onClick: () => navigate('/foods') },
        { label: 'Ingredients', onClick: () => navigate('/ingredients') },
        { label: 'Ingredients at home', onClick: () => navigate('/ingredients-at-home')},
        { label: 'Shopping list', onClick: () => navigate('/shopping-list') }
    ];

    return (
        <div className="app-container">
            <div className="page-header">
                <PageTitle text="Menu" />
            </div>

            <div className="content-wrapper">
                <div className="content-table-container">
                    <TapedTable
                        layout="vertical"
                        rows={rows}
                        renderCell={(rowIndex) => {
                            const row = rows[rowIndex];
                            return (
                                <button className="meal-button lobster" onClick={row.onClick}>
                                    {row.label}
                                </button>
                            );
                        }}
                        handleReset={() => {}}
                        allowReorder={false}
                        showRowLabels={false}
                        showHeader={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
