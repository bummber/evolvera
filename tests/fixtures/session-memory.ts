import { Sessions } from '../../workers/admin/store';
import type { Storage } from '../../workers/admin/store';

export class MemoryStorage implements Storage {
  data = new Map<string, unknown>();
  tail: Promise<unknown> = Promise.resolve();
  alarm = 0;
  async get<T>(key: string) {
    return this.data.get(key) as T | undefined;
  }
  async put(key: string, value: unknown) {
    this.data.set(key, value);
  }
  async delete(key: string) {
    return this.data.delete(key);
  }
  async deleteAll() {
    this.data.clear();
  }
  async setAlarm(time: number) {
    this.alarm = time;
  }
  transaction<T>(callback: (txn: Storage) => Promise<T>): Promise<T> {
    const pending = this.tail.then(() => callback(this));
    this.tail = pending.catch(() => {});
    return pending;
  }
}
export class MemoryNamespace {
  stores = new Map<string, MemoryStorage>();
  objects = new Map<string, Sessions>();
  idFromName(name: string) {
    return name;
  }
  get(id: unknown) {
    const key = String(id);
    if (!this.objects.has(key)) {
      const storage = new MemoryStorage();
      this.stores.set(key, storage);
      this.objects.set(key, new Sessions({ storage }));
    }
    return this.objects.get(key)!;
  }
}
