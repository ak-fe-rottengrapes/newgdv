import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { rejectOrder } from "@/components/services/admin/orders/api" // You'll need to create this API function

export function RejectDialog({ open, onOpenChange, orderId, setOrderProp }) {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleReject = async (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
        duration: 2000
      })
      return
    }

    setLoading(true)
    try {
        const data = {
            order_status: 'cancelled',
            reason: reason
        }
      const response = await rejectOrder(session.user.access, orderId, data)
      toast({
        title: "Success",
        description: response.message,
        variant: "success",
        className: "bg-green-200",
        duration: 2000
      })
      setOrderProp((prev) => ({
        ...prev,
        order_status: "cancelled",
      }));
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 2000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-gray-100 border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Reject Request</DialogTitle>
          <DialogDescription className="text-gray-300">
            Are you sure you want to reject this request? Please provide a reason.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleReject}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reason" className="text-gray-200">
                Reason for rejection
              </Label>
              <Input
                id="reason"
                placeholder="Enter reason..."
                className="bg-gray-800 text-gray-100 border-gray-700"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 ml-2"
              disabled={loading}
            >
              {loading ? "Rejecting..." : "Reject"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
