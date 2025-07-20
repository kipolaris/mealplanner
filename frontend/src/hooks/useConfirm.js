import {useState} from "react";

export const useConfirm = () => {
    const [isOpen,setIsOpen] = useState(false);
    const [text,setText] = useState('');
    const [action, setAction] = useState(() => () => {});

    const confirm = (message, onConfirm) => {
        setText(message);
        setAction(() => () => {
            onConfirm();
            setIsOpen(false);
        });
        setIsOpen(true);
    };

    return {
        isConfirmModalOpen: isOpen,
        setIsConfirmModalOpen: setIsOpen,
        confirmText: text,
        confirmAction: action,
        confirm
    };
}