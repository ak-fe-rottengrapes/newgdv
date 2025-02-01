import OrderForm from "@/app/components/order/OrderForm";
import { ToolProvider } from '@/app/context/ToolContext';

export default function Order() {
  return (
    <div className="h-full">
      {/* <h1 className="text-2xl font-bold mb-4 text-center">Place Order</h1> */}
      <div className="grid gap-4">
      <ToolProvider>
        <OrderForm />
      </ToolProvider>
      </div>
    </div>
  );
} 