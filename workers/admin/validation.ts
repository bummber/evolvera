import { z } from 'zod';
// Run before imported schemas parse their configuration in workerd.
z.config({ jitless: true });
