export default function Toast({ type, message }: { type: "error" | "success" | "warning" | "info"; message: string }) {

    const colors = {
        error: "bg-red-100 border border-red-400 text-red-700",
        success: "bg-green-100 border border-green-400 text-green-700",
        warning: "bg-yellow-100 border border-yellow-400 text-yellow-700",
        info: "bg-blue-100 border border-blue-400 text-blue-700",
    }

    return (
        <div className={`w-full p-3 ${colors[type]} rounded text-sm`}>
            {message}
        </div>
    )
}