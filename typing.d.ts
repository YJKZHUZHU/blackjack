import type { WalletWidget, WidgetConfig } from "@initia/utils";
export { }; // 确保这是模块

interface Eip1193Provider {
  request(request: { method: string, params?: Array<any> | Record<string, any> }): Promise<any>;
};

declare global {
  declare interface Window {
    ethereum?: Eip1193Provider | undefined
    phantom?: { ethereum?: Eip1193Provider | undefined }
    okxwallet?: Eip1193Provider | undefined
    createWalletWidget?: (config: WidgetConfig) => Promise<WalletWidget>;
    solana?: {
      isPhantom: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      publicKey: PublicKey;
      isConnected: boolean
      on: (event: string, callback: (args: any) => void) => void;
      off: (event: string, callback: (args: any) => void) => void;
    };
  }
}