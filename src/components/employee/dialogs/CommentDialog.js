import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from 'lucide-react';
import { addAdminComment } from "@/components/services/order/api"
import { useSession } from "next-auth/react"
export function CommentDialog({ children, comments, setComments, orderId }) {
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const [selectedMode, setSelectedMode] = useState("Private");
    const { data: session } = useSession()
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const commentData = {
                comment: newMessage,
                is_private: selectedMode === "Private" ? "true" : "false"
            };

            const newMsg = {
                id: new Date().getTime(),
                comment: newMessage,
                created_at: new Date().toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }),
                user: session.user.name,
                is_private: commentData.is_private,
            };
            setComments(prev => [...prev, newMsg]);
            setNewMessage("");

            if (session?.user?.access) {
                setLoading(true);
                try {
                    await addAdminComment(session.user.access, orderId, commentData);
                } catch (error) {
                    console.error("Failed to send message:", error.message);
                } finally {
                    setLoading(false)
                }
            }
        }
    };
    const formatTime = (date) => {
        return new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(date);
      };
    const formatDate = (date) => {
        const now = new Date();
        const messageDate = new Date(date);
        
        // If message is from today, just show time
        if (messageDate.toDateString() === now.toDateString()) {
          return formatTime(messageDate);
        }
        
        // If message is from yesterday, show "Yesterday" and time
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (messageDate.toDateString() === yesterday.toDateString()) {
          return `Yesterday, ${formatTime(messageDate)}`;
        }
        
        // Otherwise show full date and time
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(messageDate);
      };
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-gray-100">Comments</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col h-[500px]">
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {comments.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    key={message.id}
                                    className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user'
                                                ? 'bg-blue-600 text-gray-100 rounded-br-none'
                                                : 'bg-gray-700 text-gray-100 rounded-bl-none'
                                            }`}
                                    >
                                        {message.comment}
                                    </div>
                                    <p className="flex gap-1">
                                    <span className="text-xs text-gray-400 mt-1 px-1">
                                        {message.user}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1 px-1">
                                        {formatDate(message.created_at)}
                                    </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <form className="border-t border-gray-700 p-4">
                        <div className="flex gap-2 flex-col">
                            <div className="flex gap-4">
                                <Button type='button' onClick={() => setSelectedMode('Public')} className={`w-fit  ${selectedMode == 'Public' && 'bg-blue-600 text-white'}`}>Public</Button>
                                <Button type='button' onClick={() => setSelectedMode('Private')} className={`w-fit ${selectedMode == 'Private' && 'bg-blue-600 text-white'}`}>Private</Button>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    onClick={handleSendMessage}
                                    className="bg-blue-600 hover:bg-blue-700 text-gray-100"
                                >
                                    {loading ? "..." : <Send className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}