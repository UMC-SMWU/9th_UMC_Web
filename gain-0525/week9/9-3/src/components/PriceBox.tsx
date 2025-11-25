import { useCartStore } from "../hooks/useCartStore";
import { useModalStore } from "../hooks/useModalStore";

const PriceBox = () => {
    // 상태 가져오기
    const total = useCartStore((state) => state.total);
    const openModal = useModalStore((state) => state.openModal);

    const handleInitializeCart = () => {
        openModal();
    }

    // 액션 가져오기
    
    return ( 
        <div className="p-12 flex justify-between">
            <div className="border p-4 rounded-md cursor-pointer">
                <button onClick={handleInitializeCart}>
                    장바구니 초기화
                </button>
            </div>
            <div>총 가격: {total}원</div>
        </div>
    );
};

export default PriceBox;
