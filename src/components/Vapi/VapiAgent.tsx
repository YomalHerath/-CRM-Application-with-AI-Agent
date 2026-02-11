import { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import { API_BASE_URL } from "../../config/api";

const VapiAgent = () => {
    const [vapi, setVapi] = useState<any>(null);
    const [callStatus, setCallStatus] = useState<"idle" | "loading" | "active">("idle");
    const [publicKey, setPublicKey] = useState("86b75c04-2c14-47e8-af7b-8b0a3f50c8ba"); // Pre-filled
    const [assistantId, setAssistantId] = useState("87b9403b-796d-4c64-9f3b-51eb72bbebdb"); // Pre-filled

    // Initialize Vapi SDK (lazy init on start call or mount)
    useEffect(() => {
        const vapiInstance = new Vapi(publicKey || "your-public-key");
        setVapi(vapiInstance);

        // Event Listeners
        vapiInstance.on("call-start", () => {
            console.log("Call has started");
            setCallStatus("active");
        });

        vapiInstance.on("call-end", () => {
            console.log("Call has stopped");
            setCallStatus("idle");
        });

        vapiInstance.on("error", (e: any) => {
            console.error("Vapi Error:", e);
            setCallStatus("idle");
        });

        return () => {
            vapiInstance.stop(); // Cleanup
        };
    }, []);

    const startCall = () => {
        if (!publicKey || !assistantId) {
            alert("Please enter your Vapi Public Key and Assistant ID.");
            return;
        }

        setCallStatus("loading");

        const vapiInstance = new Vapi(publicKey);
        setVapi(vapiInstance);

        // Define system prompt
        const systemPrompt = `You are a smart receptionist for a CRM company. Current Date: ${new Date().toString()}. Your goal is to answer calls and collect details to book Events on the calendar. You must collect: 1) Title 2) Description 3) Start Date/Time 4) End Date/Time (Optional) 5) Priority (Low, Medium, High, Urgent). Once you have these, use the 'bookEvent' tool. Be professional and helpful.`;

        // Define tool for booking event
        const assistantOverrides = {
            model: {
                provider: "openai",
                model: "gpt-4",
                messages: [
                    { role: "system", content: systemPrompt }
                ],
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "bookEvent",
                            description: "Book an event or task. Collect title, date, end date, description, and priority.",
                            parameters: {
                                type: "object",
                                properties: {
                                    title: { type: "string", description: "Title of the event" },
                                    date: { type: "string", description: "Start date/time (ISO YYYY-MM-DDTHH:MM)" },
                                    endDate: { type: "string", description: "End date/time (ISO YYYY-MM-DDTHH:MM). Optional." },
                                    description: { type: "string", description: "Description or notes" },
                                    priority: { type: "string", enum: ["Primary", "Success", "Danger", "Warning"], description: "Priority: Primary=Medium, Success=Low, Danger=High, Warning=Urgent" }
                                },
                                required: ["title", "date"]
                            }
                        }
                    }
                ]
            }
        } as any;

        vapiInstance.start(assistantId, assistantOverrides)
            .catch((err: any) => {
                console.error("Failed to start call:", err);
                setCallStatus("idle");
                alert("Failed to start call. Check console for details.");
            });

        vapiInstance.on("message", async (message: any) => {
            if (message.type === "tool-calls") {
                for (const toolCall of message.toolCalls) {
                    if (toolCall.function.name === "bookEvent") {
                        console.log("Booking event:", toolCall.function.arguments);
                        const args = typeof toolCall.function.arguments === 'string'
                            ? JSON.parse(toolCall.function.arguments)
                            : toolCall.function.arguments;

                        await createEvent(args, toolCall.id, vapiInstance);
                    }
                }
            }
        });
    };

    const createEvent = async (args: any, toolCallId: string, vapiInstance: any) => {
        try {
            const newEvent = {
                title: args.title,
                start: args.date,
                end: args.endDate,
                description: args.description || "Booked via Voice Agent",
                calendar: args.priority || "Primary",
                source: "voice_ai" // Track source
            };

            const response = await fetch(`${API_BASE_URL}/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEvent)
            });

            const data = await response.json();

            // Send result back to Vapi (if supported/required for flow to continue)
            vapiInstance.send({
                type: "tool-outputs",
                toolOutcome: [
                    {
                        toolCallId: toolCallId,
                        result: data.message || "Event created successfully"
                    }
                ]
            });

        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const stopCall = () => {
        if (vapi) {
            vapi.stop();
            setCallStatus("idle");
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    AI Voice Agent (Vapi)
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${callStatus === 'active' ? 'bg-green-100 text-green-700' :
                    callStatus === 'loading' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                    }`}>
                    {callStatus === 'active' ? '● Live' : callStatus === 'loading' ? 'Connecting...' : 'Idle'}
                </span>
            </div>

            <div className="space-y-4">
                <div className="grid gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Public Key</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
                            placeholder="Enter Vapi Public Key"
                            value={publicKey}
                            onChange={(e) => setPublicKey(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                            Assistant ID
                            <span className="ml-2 text-xs font-normal text-gray-500">
                                (Vapi Dashboard → Assistants → Click ID to copy)
                            </span>
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
                            placeholder="Enter Assistant ID"
                            value={assistantId}
                            onChange={(e) => setAssistantId(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    {callStatus === 'active' || callStatus === 'loading' ? (
                        <button
                            onClick={stopCall}
                            className="w-full py-2.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition shadow-lg shadow-red-500/20"
                        >
                            End Call
                        </button>
                    ) : (
                        <button
                            onClick={startCall}
                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium hover:from-brand-600 hover:to-brand-700 transition shadow-lg shadow-brand-500/20"
                        >
                            Start Call
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VapiAgent;
