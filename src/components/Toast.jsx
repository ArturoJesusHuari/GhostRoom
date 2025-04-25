import { CheckCircle, XCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";

export const Toast = () => {
    return(
        <Toaster
          position="bottom-left"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "black",
              color: "#66bb6a", 
              fontFamily: "monospace",
              border: "1px solid #66bb6a",
              boxShadow: "none",
            },
            success: {
              icon: <CheckCircle size={20} className="text-green-400" />,
            },
            error: {
              icon: <XCircle size={20} className="text-red-500" />,
            },
          }}
        />
    )
}