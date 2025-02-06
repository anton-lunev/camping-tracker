import { ProviderAdapter } from "./providerAdapter";

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

export class ProviderAdapterFactory {
  private static adapters: Map<CampProvider, ProviderAdapter> = new Map();

  static registerAdapter(
    provider: CampProvider,
    adapter: ProviderAdapter,
  ): void {
    this.adapters.set(provider, adapter);
  }

  static getAdapter(provider: CampProvider): ProviderAdapter {
    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new Error(`No adapter found for provider: ${provider}`);
    }
    return adapter;
  }
}
