import { CampAdapter } from "./campAdapter";

export enum CampProvider {
  RECREATION = "RECREATION",
  RESERVE_CALIFORNIA = "RESERVE_CALIFORNIA",
}

export function getProviderFromString(provider: string): CampProvider {
  switch (provider) {
    case "recreation":
      return CampProvider.RECREATION;
    case "reservecalifornia":
      return CampProvider.RESERVE_CALIFORNIA;
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export class CampAdapterFactory {
  private static adapters: Map<CampProvider, CampAdapter> = new Map();

  static registerAdapter(provider: CampProvider, adapter: CampAdapter): void {
    this.adapters.set(provider, adapter);
  }

  static getAdapter(provider: CampProvider): CampAdapter {
    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new Error(`No adapter found for provider: ${provider}`);
    }
    return adapter;
  }
}
