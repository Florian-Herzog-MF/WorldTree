import { shareReplay } from 'rxjs';

export const cache = <T>() => shareReplay<T>({ bufferSize: 1, refCount: true });
