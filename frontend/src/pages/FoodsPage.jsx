import React from "react";
import { useNavigate} from "react-router-dom";
import { useFoods} from "../hooks/useFoods";
import '../assets/css/pages/foods-page.css';
import PageTitle from "../components/PageTitle";
import TapeButton from "../components/TapeButton";
import TapedTable from "../components/TapedTable";
import NewNameModal from "../components/modals/NewNameModal";

const FoodsPage = () => {
    const navigate = useNavigate();

    const {
        foods,
        isModalOpen,
        setIsModalOpen,
        editingFood,
        handleAddFood,
        handleDeleteFood,
        handleEditFood,
        handleSaveEditedFood
    } = useFoods();

    const navigateToMenu = () => {
        navigate('/menu');
    };

    if (!Array.isArray(foods)) return <PageTitle text="Loading foods..." />;

    const sortedFoods = [...foods].sort((a,b) =>
        a.name?.localeCompare(b.name || '') || 0
    );

    return (
        <div className="app-container">
            <div className="foods-header">
                <div className="menu-button">
                    <TapeButton text="Menu" onClick={navigateToMenu} />
                </div>
                <PageTitle text="Foods"/>
            </div>
            <div className="foods-wrapper">
                <div className="foods-table-container">
                    <TapedTable
                        layout="vertical"
                        rows={sortedFoods}
                        renderCell={(rowIndex) => {
                            const f = sortedFoods[rowIndex];
                            return (
                                <div className="food-row">
                                    <span className="food-name" onClick={() => navigate(`/food/${encodeURIComponent(f.name)}`)}>{f.name}</span>
                                    <div className="food-icons">
                                        <div className="edit-buttons">
                                            <img
                                                src={require('../assets/images/pencil.png')}
                                                alt="Edit"
                                                className="edit-button"
                                                onClick={() => handleEditFood(f)}
                                            />
                                            <img
                                                src={require('../assets/images/trashcan.png')}
                                                alt="Delete"
                                                className="edit-button"
                                                onClick={() => handleDeleteFood(f.id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                        allowReorder={false}
                        showHeader={false}
                        showRowLabels={false}
                        extraBottomRow={
                            <tr>
                                <td>
                                    <button className="table-button lobster" onClick={() => setIsModalOpen(true)}>
                                        Add new food
                                    </button>
                                </td>
                            </tr>
                        }
                    />
                </div>
                <NewNameModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(name) => {
                        if (editingFood) {
                            handleSaveEditedFood(name);
                        } else {
                            handleAddFood(name);
                        }
                    }}
                    itemName="food"
                    defaultName={editingFood?.name}
                />
            </div>
        </div>
    );
}

export default FoodsPage