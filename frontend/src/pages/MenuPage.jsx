import React from 'react';
import { useNavigate } from 'react-router-dom';
import TapeButton from '../components/TapeButton';
import PageTitle from '../components/PageTitle';
import TapedTable from '../components/TapedTable';
import '../assets/css/menu-page.css';

const MenuPage = () => {
    const navigate = useNavigate();

    const rows = [
        { label: 'Meal plan', onClick: () => navigate('/meal-plan') },
        { label: 'Meal times', onClick: () => navigate('/meal-times') },
        { label: 'Foods', onClick: () => {} },
        { label: 'Ingredients', onClick: () => navigate('/ingredients') },
        { label: 'Shopping list', onClick: () => {} },
        { label: 'Calendar', onClick: () => {} }
    ];

    return (
        <div className="app-container">
            <div className="menu-header">
                <div className="menu-buttons">
                    <TapeButton text="Account" onClick={() => {}} />
                    <TapeButton text="How to" onClick={() => {}} />
                </div>
                <PageTitle text="Menu" />
            </div>

            <div className="menu-wrapper">
                <div className="menu-table-container">
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
