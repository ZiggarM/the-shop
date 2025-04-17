import { getOrderWithProducts } from "@/actions/orders";


const Orders = async () => {
    const orderWithProducts = await getOrderWithProducts();

    if (!orderWithProducts) {
        return <div className="text-center font-bold text-2xl">No order found</div>
    }



return <div className="">Orders page</div>


}

export default Orders