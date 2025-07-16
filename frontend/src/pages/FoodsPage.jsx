import React from "react";
import { useNavigate} from "react-router-dom";
import { useFoods} from "../hooks/useFoods";
import PageTitle from "../components/PageTitle";
import TapeButton from "../components/TapeButton";
import TapedTable from "../components/TapedTable";
import NewNameModal from "../components/modals/NewNameModal";
import {useConfirm} from "../hooks/useConfirm";
import ConfirmModal from "../components/modals/ConfirmModal";

const FoodsPage = () => {
    const navigate = useNavigate();

    const {
        foods,
        isModalOpen,
        setIsModalOpen,
        editingFood,
        addFood,
        deleteFood,
        editFood,
        saveEditedFood
    } = useFoods();

    const {
        isConfirmModalOpen,
        setIsConfirmModalOpen,
        confirmText,
        confirmAction,
        confirm
    } = useConfirm();

    const navigateToMenu = () => {
        navigate('/menu');
    };

    const handleDeleteFood = (food) => confirm(`Are you sure you want to delete ${food.name}?`, () => deleteFood(food.id));

    if (!Array.isArray(foods)) return <PageTitle text="Loading foods..." />;

    const sortedFoods = [...foods].sort((a,b) =>
        a.name?.localeCompare(b.name || '') || 0
    );

    return (
        <div className="app-container">
            <div className="page-header">
                <div className="header-buttons">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                </div>
                <PageTitle text="Foods"/>
            </div>
            <div className="content-wrapper">
                <TapedTable
                    layout="vertical"
                    rows={sortedFoods}
                    columns={[
                        {
                            header: "Food",
                            render: (f) => (
                                <span
                                    className="patrick"
                                    style={{ fontSize: 'clamp(12px, 2vw, 18px)', cursor: 'pointer'}}
                                    onClick={() => navigate(`/food/${encodeURIComponent(f.name)}`)}
                                >
                                    {f.name}
                                </span>
                            ),
                        },
                        {
                            header: "Actions",
                            render: (f) => (
                                <div className="edit-buttons">
                                    <img
                                        src={require('../assets/images/pencil.png')}
                                        alt="Edit"
                                        className="edit-button"
                                        onClick={() => editFood(f)}
                                    />
                                    <img
                                        src={require('../assets/images/trashcan.png')}
                                        alt="Delete"
                                        className="edit-button"
                                        onClick={() => handleDeleteFood(f)}
                                    />
                                </div>
                            ),
                        },
                    ]}
                    showHeader={true}
                    showRowLabels={false}
                    allowReorder={false}
                    extraBottomRow={
                        <tr>
                            <td colSpan={2}>
                                <button className="table-button lobster" onClick={() => setIsModalOpen(true)}>
                                    Add new food
                                </button>
                            </td>
                        </tr>
                    }
                />
                <NewNameModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(name) => {
                        if (editingFood) {
                            saveEditedFood(name);
                        } else {
                            addFood(name);
                        }
                    }}
                    itemName="food"
                    defaultName={editingFood?.name}
                />
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onSave={confirmAction}
                    text={confirmText}
                />
            </div>
        </div>
    );
}

export default FoodsPage