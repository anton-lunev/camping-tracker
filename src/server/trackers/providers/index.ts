import { CampProvider, ProviderAdapterFactory } from "./providerAdapterFactory";
import { ReserveCaliforniaAdapter } from "./reserve-california/adapter";
import { RecreationAdapter } from "./recreation/adapter";

// Register adapters
ProviderAdapterFactory.registerAdapter(
  CampProvider.RECREATION,
  new RecreationAdapter(),
);
ProviderAdapterFactory.registerAdapter(
  CampProvider.RESERVE_CALIFORNIA,
  new ReserveCaliforniaAdapter(),
);

export function getProviderAdapter(provider: CampProvider) {
  return ProviderAdapterFactory.getAdapter(provider);
}
