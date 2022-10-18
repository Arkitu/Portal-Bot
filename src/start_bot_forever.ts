import { Monitor } from "forever-monitor";
import { dirname } from 'dirname-filename-esm';
import { join } from 'path';

const __dirname = dirname(import.meta);

let monitor: Monitor = new Monitor(join(__dirname, "start.js"), {
    max: Infinity,
    silent: false
});

monitor.start();