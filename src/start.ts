import "./index.js";
import { OtherListeners } from "./listeners/OtherListeners.js";
import { PortalListeners } from "./listeners/PortalListeners.js";

// Set up listeners
client.setMaxListeners(0);
client.on('interactionCreate', OtherListeners.command);
client.on('messageCreate', (message) => {
    PortalListeners.main(message);
    if (!message.content) return;
    OtherListeners.help(message);
});