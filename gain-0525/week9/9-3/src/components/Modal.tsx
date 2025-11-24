import { useModalStore } from "../hooks/useModalStore";
import { useCartActions } from "../hooks/useCartStore";

const Modal = () => {
    const isOpen = useModalStore((state) => state.isOpen);
    const closeModal = useModalStore((state) => state.closeModal);
    const { clearCart } = useCartActions();

    if (!isOpen) return null;

    const handleConfirm = () => {
        clearCart();
        closeModal();
    }

    const handleCancel = () => {
        closeModal();
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-90 backdrop-blur-sm z-50">
            <div className="bg-white p-6 rounded shadow-md w-80 text-center">
                <p className="mb-4 text-lg">정말 장바구니를 초기화하시겠습니까?</p>
                <div className="flex justify-around">
                    <button 
                        onClick={handleCancel} 
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        아니요
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        네
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
