import { clearStore } from './store';

clearStore().then(() => console.log('Assessment store cleared. Add authoritative GIS records before analysis.')).catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
