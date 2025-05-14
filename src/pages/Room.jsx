import { useRoom } from "../../context/roomContext";
import Chat from "../components/Room/Chat";
import { X } from "lucide-react";

export default function Room() {
    const {
        room,
        loading,
        isModalOpenInvitation,
        handleAcceptInvitation,
        handleDeclineInvitation
    } = useRoom();

    return (
        <div className="max-w-4xl mx-auto mt-6">
            {loading ? (
                <p className="text-center animate-pulse">Loading room...</p>
            ) : room ? (
                <div className="flex flex-col space-y-4">
                    <div className="h-[10vh] border border-green-500 rounded-lg p-4 bg-black text-green-300">
                        <span className="text-md">{room.name}</span>
                    </div>
                <Chat />
                </div>
            ) : (
                <p className="text-center">Room not found.</p>
            )}

            {isModalOpenInvitation && !loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="p-6 rounded shadow-lg max-w-md w-full border border-green-500 bg-black">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg text-green-400">Room Invitation</h2>
                            <button onClick={handleDeclineInvitation} className="text-red-500 hover:text-red-400">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-green-400 mb-4">You have been invited to join this room. Do you accept?</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={handleDeclineInvitation} className="px-4 py-2 border border-green-500 text-green-400 hover:bg-green-700 rounded">
                                Decline
                            </button>
                            <button onClick={handleAcceptInvitation} className="px-4 py-2 bg-green-500 text-black rounded hover:bg-green-600">
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
